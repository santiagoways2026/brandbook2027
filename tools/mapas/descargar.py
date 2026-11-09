# -*- coding: utf-8 -*-
"""Baja y prepara los datos de los mapas del Camino.

    python tools/mapas/descargar.py            # todo
    python tools/mapas/descargar.py frances    # solo una ruta

Fuentes:
  - Trazados: OpenStreetMap (api.openstreetmap.org). © colaboradores de OpenStreetMap, ODbL.
  - Pueblos: Nominatim, de OpenStreetMap.
  - Altitud: Open-Meteo Elevation API (modelo Copernicus DEM GLO-90).
  - Base cartográfica: Eurostat GISCO 1:1M (© EuroGeographics) y ríos de Natural Earth.

Lo descargado en bruto se guarda en tools/mapas/.cache/ (no se sube al repositorio).
Lo ya procesado va a tools/mapas/datos/ y eso sí se sube: generar.py solo lee de ahí.
"""
import heapq
import json
import math
import pathlib
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from rutas import RUTAS, CONSULTAS, SANTIAGO, MANUAL  # noqa: E402

CACHE = AQUI / ".cache"
DATOS = AQUI / "datos"
CACHE.mkdir(exist_ok=True)
DATOS.mkdir(exist_ok=True)

UA = {"User-Agent": "santiagoways-mapas/1.0 (generador de mapas editoriales)"}
OSM = "https://api.openstreetmap.org/api/0.6"


def bajar(url, destino=None, espera=0.0):
    if destino and destino.exists():
        return destino.read_bytes()
    for intento in range(5):
        try:
            req = urllib.request.Request(url, headers=UA)
            datos = urllib.request.urlopen(req, timeout=120).read()
            break
        except Exception as e:  # red inestable: reintento con espera creciente
            if intento == 4:
                raise
            print("   reintento", intento + 1, url[:90], e)
            time.sleep(2 ** (intento + 1))
    if destino:
        destino.write_bytes(datos)
    time.sleep(espera)
    return datos


# ------------------------------------------------------------------ geometría

def hav(a, b):
    """Distancia en km entre dos puntos (lon, lat)."""
    r = 6371.0088
    lo1, la1, lo2, la2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def rdp(puntos, tol_km):
    """Douglas-Peucker sobre (lon, lat) con tolerancia en km. Iterativo."""
    if len(puntos) < 3:
        return puntos
    if puntos[0] == puntos[-1] and len(puntos) > 3:
        # Anillo cerrado: con los extremos iguales no hay recta de referencia. Se parte
        # por el punto más lejano al inicio y se simplifica cada mitad.
        k = max(range(len(puntos)), key=lambda i: hav(puntos[0], puntos[i]))
        return rdp(puntos[:k + 1], tol_km)[:-1] + rdp(puntos[k:], tol_km)
    lat0 = math.radians(sum(p[1] for p in puntos) / len(puntos))
    kx, ky = 111.32 * math.cos(lat0), 110.57
    xy = [(p[0] * kx, p[1] * ky) for p in puntos]
    guardar = [False] * len(puntos)
    guardar[0] = guardar[-1] = True
    pila = [(0, len(puntos) - 1)]
    while pila:
        i, j = pila.pop()
        ax, ay = xy[i]
        bx, by = xy[j]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy) or 1e-12
        mejor, k = -1.0, -1
        for m in range(i + 1, j):
            px, py = xy[m]
            d = abs(dy * px - dx * py + bx * ay - by * ax) / n
            if d > mejor:
                mejor, k = d, m
        if mejor > tol_km:
            guardar[k] = True
            pila.append((i, k))
            pila.append((k, j))
    return [p for p, g in zip(puntos, guardar) if g]


def remuestrear(puntos, paso_km):
    """Puntos equiespaciados cada paso_km a lo largo de la línea. Devuelve [(km, lon, lat)]."""
    salida = [(0.0, puntos[0][0], puntos[0][1])]
    acumulado, siguiente = 0.0, paso_km
    for a, b in zip(puntos, puntos[1:]):
        d = hav(a, b)
        while d > 0 and acumulado + d >= siguiente:
            t = (siguiente - acumulado) / d
            salida.append((siguiente, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
            siguiente += paso_km
        acumulado += d
    salida.append((acumulado, puntos[-1][0], puntos[-1][1]))
    return salida


# ------------------------------------------------------------------ lugares

def candidatos():
    """Para cada lugar, todos los resultados de Nominatim (hasta 10 por consulta).

    No se elige aquí: el bueno es el que cae sobre el trazado de la ruta, y eso solo se
    sabe con la red ya montada. Ver elegir().
    """
    nombres = []
    for r in RUTAS.values():
        nombres += [n for n, _ in r["lugares"]] + r["paso"]
        for ramal in r.get("ramales", []):
            nombres += ramal
    salida = {}
    for nombre in dict.fromkeys(nombres):
        q = CONSULTAS.get(nombre, nombre + ", España")
        vistos = []
        for extra in ({}, {"featureType": "settlement"}):
            url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
                {"q": q, "format": "json", "limit": 10, **extra})
            clave = "".join(c if c.isalnum() else "_" for c in q) + ("_s" if extra else "")
            for x in json.loads(bajar(url, CACHE / f"nom_{clave}.json", espera=1.1)):
                c = (round(float(x["lon"]), 5), round(float(x["lat"]), 5), x.get("class"), x.get("type"))
                if c not in vistos:
                    vistos.append(c)
        if not vistos:
            print("  ✗ sin resultado:", nombre, "·", q)
        salida[nombre] = vistos
    return salida


class Rejilla:
    """Índice espacial mínimo para buscar el nodo de la red más cercano a un punto."""

    def __init__(self, nodos, ids, celda=0.02):
        self.celda, self.nodos, self.casillas = celda, nodos, {}
        for n in ids:
            lon, lat = nodos[n]
            self.casillas.setdefault((int(lon // celda), int(lat // celda)), []).append(n)

    def cercano(self, punto, radio=6):
        cx, cy = int(punto[0] // self.celda), int(punto[1] // self.celda)
        mejor, cual = 1e9, None
        for r in range(radio + 1):
            for dx in range(-r, r + 1):
                for dy in range(-r, r + 1):
                    if max(abs(dx), abs(dy)) != r:
                        continue
                    for n in self.casillas.get((cx + dx, cy + dy), []):
                        d = hav(self.nodos[n], punto)
                        if d < mejor:
                            mejor, cual = d, n
            if cual is not None and mejor < r * self.celda * 80:
                break
        return cual, mejor


def elegir(nombre, opciones, rejilla):
    """El candidato más pegado a la red. Un nodo «place» gana a un límite administrativo."""
    if nombre in MANUAL:
        return tuple(MANUAL[nombre])
    mejor, punto = 1e9, None
    for lon, lat, clase, _tipo in opciones:
        _, d = rejilla.cercano((lon, lat))
        d += 0 if clase == "place" else 0.8
        if d < mejor:
            mejor, punto = d, (lon, lat)
    if punto is None:
        raise SystemExit(f"   ✗ {nombre}: ningún candidato de Nominatim")
    return punto


# ------------------------------------------------------------------ OSM

def relacion(rid, nodos, vias, vistas):
    """Baja una relación con sus miembros y entra en las relaciones hijas."""
    if rid in vistas:
        return
    vistas.add(rid)
    xml = bajar(f"{OSM}/relation/{rid}/full", CACHE / f"rel_{rid}.xml", espera=0.5)
    raiz = ET.fromstring(xml)
    for n in raiz.iter("node"):
        nodos[int(n.get("id"))] = (float(n.get("lon")), float(n.get("lat")))
    for w in raiz.iter("way"):
        vias[int(w.get("id"))] = [int(nd.get("ref")) for nd in w.findall("nd")]
    for r in raiz.iter("relation"):
        if int(r.get("id")) != rid:
            continue
        for m in r.findall("member"):
            if m.get("type") == "relation":
                relacion(int(m.get("ref")), nodos, vias, vistas)


def red(relaciones, costura_km=0.4):
    nodos, vias, vistas = {}, {}, set()
    for rid in relaciones:
        relacion(rid, nodos, vias, vistas)
    grafo = {}

    def unir(a, b):
        d = hav(nodos[a], nodos[b])
        grafo.setdefault(a, {})[b] = d
        grafo.setdefault(b, {})[a] = d

    for refs in vias.values():
        refs = [r for r in refs if r in nodos]
        for a, b in zip(refs, refs[1:]):
            if a != b:
                unir(a, b)

    # Las relaciones no siempre comparten nodo en las juntas: se cosen los cabos sueltos
    # con el nodo más cercano a menos de costura_km (400 m por defecto).
    celda = 0.01 if costura_km <= 0.5 else 0.05
    rejilla = {}
    for n in grafo:
        lon, lat = nodos[n]
        rejilla.setdefault((int(lon / celda), int(lat / celda)), []).append(n)
    cosidos = 0
    for n in [n for n, v in grafo.items() if len(v) == 1]:
        lon, lat = nodos[n]
        cx, cy = int(lon / celda), int(lat / celda)
        mejor, cand = costura_km, None
        for dx in (-3, -2, -1, 0, 1, 2, 3):
            for dy in (-3, -2, -1, 0, 1, 2, 3):
                for m in rejilla.get((cx + dx, cy + dy), []):
                    if m == n or m in grafo[n]:
                        continue
                    d = hav(nodos[n], nodos[m])
                    if 0 < d < mejor:
                        # que no sea un vecino de su propia vía
                        mejor, cand = d, m
        if cand is not None:
            unir(n, cand)
            cosidos += 1
    # Segunda pasada: tramos que se cruzan o se rozan sin compartir nodo ni dejar cabos
    # sueltos (le pasa al Sanabrés). Se une cada par de componentes por sus dos nodos
    # más cercanos, si están a menos de costura_km.
    def componentes():
        resto, out = set(grafo), []
        while resto:
            n = resto.pop()
            c, pila = {n}, [n]
            while pila:
                for m in grafo[pila.pop()]:
                    if m not in c:
                        c.add(m)
                        pila.append(m)
            resto -= c
            out.append(c)
        return out

    comps = [c for c in componentes() if len(c) >= 20]
    if len(comps) > 1:
        de = {n: i for i, c in enumerate(comps) for n in c}
        rejilla2 = {}
        for n in de:
            lon, lat = nodos[n]
            rejilla2.setdefault((int(lon / 0.01), int(lat / 0.01)), []).append(n)
        mejores = {}
        alcance = max(1, int(costura_km / 0.8) + 1)
        for n, i in de.items():
            lon, lat = nodos[n]
            cx, cy = int(lon / 0.01), int(lat / 0.01)
            for dx in range(-alcance, alcance + 1):
                for dy in range(-alcance, alcance + 1):
                    for m in rejilla2.get((cx + dx, cy + dy), []):
                        j = de[m]
                        if j <= i:
                            continue
                        d = hav(nodos[n], nodos[m])
                        if d < costura_km and d < mejores.get((i, j), (9e9,))[0]:
                            mejores[(i, j)] = (d, n, m)
        for d, n, m in mejores.values():
            unir(n, m)
            cosidos += 1
    print(f"   red: {len(vistas)} relaciones, {len(vias)} vías, {len(grafo)} nodos, {cosidos} juntas cosidas")
    return nodos, grafo


def dijkstra(grafo, origen, destino):
    dist = {origen: 0.0}
    previo = {}
    cola = [(0.0, origen)]
    while cola:
        d, n = heapq.heappop(cola)
        if n == destino:
            break
        if d > dist.get(n, 1e18):
            continue
        for m, w in grafo[n].items():
            nd = d + w
            if nd < dist.get(m, 1e18):
                dist[m] = nd
                previo[m] = n
                heapq.heappush(cola, (nd, m))
    if destino not in dist:
        return None
    camino = [destino]
    while camino[-1] != origen:
        camino.append(previo[camino[-1]])
    return camino[::-1]


def trazar(nodos, grafo, rejilla, paso, sitios):
    puntos = []
    for a, b in zip(paso, paso[1:]):
        na, _ = rejilla.cercano(sitios[a])
        nb, _ = rejilla.cercano(sitios[b])
        print(f"   {a} → {b}: enganche a {hav(nodos[na], sitios[a]):.2f} km / {hav(nodos[nb], sitios[b]):.2f} km")
        tramo = dijkstra(grafo, na, nb)
        if tramo is None:
            raise SystemExit(f"   ✗ no hay conexión entre {a} y {b} en la red")
        coords = [nodos[n] for n in tramo]
        puntos += coords if not puntos else coords[1:]
    return puntos


# ------------------------------------------------------------------ altitud

def altitudes(clave, muestras):
    """Altitud de cada muestra. OpenTopoData con EU-DEM 25 m; se guarda por bloques."""
    carpeta = CACHE / f"alt_{clave}"
    carpeta.mkdir(exist_ok=True)
    salida = []
    for i in range(0, len(muestras), 100):
        bloque = muestras[i:i + 100]
        firma = f"{bloque[0][1]:.4f}_{bloque[0][2]:.4f}_{len(bloque)}"
        destino = carpeta / f"{i:06d}_{firma}.json"
        url = "https://api.opentopodata.org/v1/eudem25m?" + urllib.parse.urlencode({
            "locations": "|".join(f"{m[2]:.5f},{m[1]:.5f}" for m in bloque),
        })
        datos = json.loads(bajar(url, destino, espera=1.1))
        vals = [r["elevation"] for r in datos["results"]]
        if any(v is None for v in vals):
            # fuera de la cobertura de EU-DEM: se rellena con SRTM 30 m
            url2 = url.replace("/eudem25m?", "/srtm30m?")
            datos2 = json.loads(bajar(url2, carpeta / f"{i:06d}_{firma}_srtm.json", espera=1.1))
            vals = [v if v is not None else r["elevation"] for v, r in zip(vals, datos2["results"])]
        salida += vals
    return salida


def suavizar(valores, ventana):
    medio = ventana // 2
    return [sum(valores[max(0, i - medio):i + medio + 1]) / len(valores[max(0, i - medio):i + medio + 1])
            for i in range(len(valores))]


# ------------------------------------------------------------------ base

NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"
GISCO = "https://gisco-services.ec.europa.eu/distribution/v2/"
# Costa, fronteras y provincias: Eurostat GISCO a 1:1 millón (© EuroGeographics). A la
# escala de los mapas de Galicia, Natural Earth 1:10M se quedaba tosco: Ferrol caía al agua.
# Ríos: Natural Earth.
CAPAS = {
    "tierra": GISCO + "countries/geojson/CNTR_RG_01M_2020_4326.geojson",
    "fronteras": GISCO + "countries/geojson/CNTR_BN_01M_2020_4326.geojson",
    "provincias": GISCO + "nuts/geojson/NUTS_BN_01M_2021_4326_LEVL_3.geojson",
    "rios": NE + "ne_10m_rivers_lake_centerlines.geojson",
}
PAISES = {"ESP", "PRT", "FRA", "AND", "MAR", "GIB", "DZA"}
CAJA = (-10.6, 35.6, 4.6, 46.6)  # lon/lat que cubre cualquier mapa de la serie


def dentro(p):
    return CAJA[0] <= p[0] <= CAJA[2] and CAJA[1] <= p[1] <= CAJA[3]


def base():
    salida = {}
    for capa, url in CAPAS.items():
        datos = json.loads(bajar(url, CACHE / url.rsplit("/", 1)[1]))
        piezas = []
        tol = 0.08 if capa == "tierra" else 0.12
        for f in datos["features"]:
            g = f["geometry"]
            if not g:
                continue
            props = f["properties"]
            if capa == "tierra" and props.get("ISO3_CODE") not in PAISES:
                continue
            if capa in ("fronteras", "provincias") and props.get("COAS_FLAG") != "F":
                continue  # solo límites en tierra: la costa ya la dibuja el relleno
            if capa == "rios" and (props.get("scalerank") or 0) > 9:
                continue
            if g["type"] in ("Polygon", "MultiPolygon"):
                polis = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
                for poli in polis:
                    if any(dentro(pt) for pt in poli[0]):
                        anillos = [[[round(x, 4), round(y, 4)] for x, y in rdp(anillo, tol)] for anillo in poli]
                        if len(anillos[0]) >= 4:
                            piezas.append({"tipo": "poligono", "pais": props.get("ISO3_CODE"), "anillos": anillos})
            else:
                lineas = [g["coordinates"]] if g["type"] == "LineString" else g["coordinates"]
                for linea in lineas:
                    if any(dentro(pt) for pt in linea):
                        piezas.append({
                            "tipo": "linea",
                            "nombre": props.get("name") or "",
                            "linea": [[round(x, 4), round(y, 4)] for x, y in rdp(linea, tol)],
                        })
        salida[capa] = piezas
        print(f"   {capa}: {len(piezas)} piezas")
    (DATOS / "base.json").write_text(json.dumps(salida, separators=(",", ":")), encoding="utf-8")


# ------------------------------------------------------------------ todo

def main(solo):
    print("· Lugares")
    opciones = candidatos()
    lugares_ruta = DATOS / "lugares.json"
    sitios = json.loads(lugares_ruta.read_text(encoding="utf-8")) if lugares_ruta.exists() else {}
    trazados_ruta = DATOS / "trazados.json"
    trazados = json.loads(trazados_ruta.read_text(encoding="utf-8")) if trazados_ruta.exists() else {}
    perfiles_ruta = DATOS / "perfiles.json"
    perfiles = json.loads(perfiles_ruta.read_text(encoding="utf-8")) if perfiles_ruta.exists() else {}

    for clave, r in RUTAS.items():
        if solo and clave not in solo:
            continue
        print("·", r["nombre"])
        nodos, grafo = red(r["relaciones"], r.get("costura_km", 0.4))
        rejilla = Rejilla(nodos, grafo)
        nombres = [n for n, _ in r["lugares"]] + r["paso"] + [n for rm in r.get("ramales", []) for n in rm]
        for nombre in dict.fromkeys(nombres):
            sitios[nombre] = list(elegir(nombre, opciones[nombre], rejilla))
        lugares_ruta.write_text(json.dumps(sitios, ensure_ascii=False, indent=1), encoding="utf-8")
        linea = trazar(nodos, grafo, rejilla, r["paso"], sitios)
        ramales = [trazar(nodos, grafo, rejilla, ramal, sitios) for ramal in r.get("ramales", [])]
        km = sum(hav(a, b) for a, b in zip(linea, linea[1:]))
        print(f"   longitud: {km:.1f} km · {len(linea)} puntos")

        # Perfil: altitud cada 200 m, suavizada para quitar el ruido del modelo.
        muestras = remuestrear(linea, 0.2)
        crudas = altitudes(clave, muestras)
        # Suavizado corto (600 m): quita el ruido del modelo sin aplanar los puertos.
        alts = suavizar(crudas, 3)
        subida = sum(max(0, b - a) for a, b in zip(alts, alts[1:]))
        bajada = sum(max(0, a - b) for a, b in zip(alts, alts[1:]))

        # km de cada lugar sobre el trazado: el punto de muestra más cercano.
        marcas = []
        en_ramal = {n for rm in r.get("ramales", []) for n in rm[1:]} - set(r["paso"])
        for nombre, nivel in r["lugares"]:
            p = sitios[nombre]
            if nombre in en_ramal:
                # va en un ramal: no tiene km ni altitud sobre el perfil del tramo principal
                marcas.append({"nombre": nombre, "nivel": nivel, "km": None, "alt": None,
                               "lon": p[0], "lat": p[1], "ramal": True})
                continue
            i = min(range(len(muestras)), key=lambda k: hav((muestras[k][1], muestras[k][2]), p))
            desvio = hav((muestras[i][1], muestras[i][2]), p)
            if desvio > 3:
                print(f"   ⚠ {nombre} queda a {desvio:.1f} km del trazado")
            marcas.append({"nombre": nombre, "nivel": nivel, "km": round(muestras[i][0], 1),
                           "alt": round(alts[i]), "lon": p[0], "lat": p[1]})

        trazados[clave] = {
            "km": round(km, 1),
            "linea": [[round(x, 5), round(y, 5)] for x, y in rdp(linea, 0.03)],
            "ramales": [[[round(x, 5), round(y, 5)] for x, y in rdp(rm, 0.03)] for rm in ramales],
        }
        perfiles[clave] = {
            "paso_km": 0.2,
            "km": round(km, 1),
            "alt": [round(a) for a in alts],
            "subida": round(subida),
            "bajada": round(bajada),
            # El techo se toma del dato sin suavizar: es una cota, no una tendencia.
            "max": round(max(crudas)),
            "min": round(max(0, min(crudas))),
            "km_max": round(crudas.index(max(crudas)) * 0.2, 1),
            "marcas": marcas,
        }
        print(f"   altitud: {min(crudas):.0f}–{max(crudas):.0f} m (km {crudas.index(max(crudas)) * 0.2:.1f}) · +{subida:.0f} / -{bajada:.0f} m")
        trazados_ruta.write_text(json.dumps(trazados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        perfiles_ruta.write_text(json.dumps(perfiles, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    if not solo or "base" in solo:
        print("· Base cartográfica")
        base()


if __name__ == "__main__":
    main(set(sys.argv[1:]))
