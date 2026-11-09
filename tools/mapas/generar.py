# -*- coding: utf-8 -*-
"""Genera los mapas del Camino en SVG, los perfiles de altitud y los GPX.

    python tools/mapas/generar.py

Lee solo de tools/mapas/datos/ (lo prepara descargar.py) y escribe en
salidas/mapa-camino-de-santiago/:

    mapas/mapa-caminos-de-santiago.svg      el mapa general con todas las rutas
    mapas/mapa-camino-<ruta>.svg            un mapa por ruta
    mapas/perfil-camino-<ruta>.svg          su perfil de altitud
    gpx/camino-<ruta>.gpx                   el track para el GPS o Google My Maps

Los SVG son autónomos: llevan dentro la fuente (Montserrat, recortada a los caracteres
que usan), la animación y su <title>/<desc>. Se publican como <img>, de modo que
Google Imágenes los indexa y la página no carga nada más.

Diseño según el Brandbook 2027: verde Ways para líneas y la concha, verde sendero para
el texto en verde, grafito y gris para el resto, niebla para la tierra, Montserrat.
"""
import base64
import io
import json
import math
import pathlib
import sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
sys.path.insert(0, str(AQUI))
from rutas import RUTAS, SANTIAGO  # noqa: E402

DATOS = AQUI / "datos"
SALIDA = RAIZ / "salidas" / "mapa-camino-de-santiago"
FUENTES = AQUI / ".cache" / "fuentes"

# --- Brandbook 2027 (design-system/tokens.css) ---
VERDE = "#7AA606"      # verde Ways: líneas, puntos, concha. Nunca texto.
SENDERO = "#506718"    # verde sendero: texto en verde y resaltes
GRAFITO = "#2E2E2D"    # texto principal
GRIS = "#6F6F6E"       # texto secundario
NIEBLA = "#E8E8E6"     # superficies: aquí, la tierra
BLANCO = "#FFFFFF"

ANCHO = 1200
# Versión móvil: se compone en un lienzo de 487 unidades y se declara a 560 px, así que el
# viewBox agranda letra y trazos un 15 % por igual. Sin leyenda ni localizador: no caben.
MOVIL = False
ESCALA = 1.0
FORMATOS = {"web": (1200, 1.0), "movil": (487, 560 / 487)}


# ============================================================ utilidades

def km_es(valor):
    """Número con la ortografía de la RAE: sin separador hasta 9999, espacio fino después."""
    n = int(round(valor))
    s = str(n)
    if n >= 10000:
        partes = []
        while s:
            partes.insert(0, s[-3:])
            s = s[:-3]
        s = " ".join(partes)
    return s


def esc(t):
    return (str(t).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;"))


def hav(a, b):
    r = 6371.0088
    lo1, la1, lo2, la2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def rdp_xy(pts, tol):
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    pila = [(0, len(pts) - 1)]
    while pila:
        i, j = pila.pop()
        ax, ay = pts[i]
        bx, by = pts[j]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy)
        mejor, k = -1.0, -1
        for m in range(i + 1, j):
            px, py = pts[m]
            d = (abs(dy * px - dx * py + bx * ay - by * ax) / n) if n else math.hypot(px - ax, py - ay)
            if d > mejor:
                mejor, k = d, m
        if mejor > tol:
            keep[k] = True
            pila += [(i, k), (k, j)]
    return [p for p, g in zip(pts, keep) if g]


def d_linea(pts):
    return "M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts)


def ancho_texto(texto, tam, peso=700, mayus=False):
    factor = {500: 0.58, 600: 0.6, 700: 0.62, 800: 0.66}[peso]
    if mayus:
        factor += 0.12
    return len(texto) * tam * factor


def bezier(p1x, p1y, p2x, p2y):
    """cubic-bezier de CSS: devuelve progreso(t) para poder sincronizar los hitos con el trazo."""
    def coord(t, a, b):
        return 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3
    tabla = [(coord(i / 400, p1x, p2x), coord(i / 400, p1y, p2y)) for i in range(401)]

    def tiempo_para(progreso):
        # el instante en que el trazo llega a «progreso»
        for x, y in tabla:
            if y >= progreso:
                return x
        return 1.0
    return tiempo_para


CURVA = (0.65, 0, 0.35, 1)
TIEMPO_PARA = bezier(*CURVA)


# ============================================================ proyección

class Lambert:
    """Cónica conforme de Lambert para la península (paralelos 37° y 43°). Salida en km."""

    def __init__(self, lat1=37, lat2=43, lat0=40, lon0=-4):
        f = math.radians
        self.lon0 = f(lon0)
        n = math.log(math.cos(f(lat1)) / math.cos(f(lat2))) / math.log(
            math.tan(math.pi / 4 + f(lat2) / 2) / math.tan(math.pi / 4 + f(lat1) / 2))
        self.n = n
        self.F = math.cos(f(lat1)) * math.tan(math.pi / 4 + f(lat1) / 2) ** n / n
        self.rho0 = self.F / math.tan(math.pi / 4 + f(lat0) / 2) ** n

    def __call__(self, lon, lat):
        rho = self.F / math.tan(math.pi / 4 + math.radians(lat) / 2) ** self.n
        th = self.n * (math.radians(lon) - self.lon0)
        return 6371.0 * rho * math.sin(th), 6371.0 * (self.rho0 - rho * math.cos(th))


PROY = Lambert()


class Lienzo:
    """Pasa de lon/lat a píxeles del SVG."""

    def __init__(self, caja_km, ancho, alto, margen):
        x0, y0, x1, y1 = caja_km
        izq, arr, der, aba = margen
        util_w, util_h = ancho - izq - der, alto - arr - aba
        self.s = min(util_w / (x1 - x0), util_h / (y1 - y0))
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        self.ox = izq + util_w / 2 - cx * self.s
        self.oy = arr + util_h / 2 + cy * self.s
        self.ancho, self.alto = ancho, alto

    def __call__(self, lon, lat):
        x, y = PROY(lon, lat)
        return self.ox + x * self.s, self.oy - y * self.s

    def km_por_px(self):
        return 1 / self.s


# ============================================================ recorte

def recortar_poligono(anillo, x0, y0, x1, y1):
    """Sutherland-Hodgman contra un rectángulo."""
    def corta(pts, dentro, cruce):
        sal = []
        for i, p in enumerate(pts):
            q = pts[i - 1]
            if dentro(p):
                if not dentro(q):
                    sal.append(cruce(q, p))
                sal.append(p)
            elif dentro(q):
                sal.append(cruce(q, p))
        return sal

    def cx(v):
        return lambda a, b: (v, a[1] + (b[1] - a[1]) * (v - a[0]) / ((b[0] - a[0]) or 1e-9))

    def cy(v):
        return lambda a, b: (a[0] + (b[0] - a[0]) * (v - a[1]) / ((b[1] - a[1]) or 1e-9), v)

    pts = anillo
    for dentro, cruce in ((lambda p: p[0] >= x0, cx(x0)), (lambda p: p[0] <= x1, cx(x1)),
                          (lambda p: p[1] >= y0, cy(y0)), (lambda p: p[1] <= y1, cy(y1))):
        if not pts:
            break
        pts = corta(pts, dentro, cruce)
    return pts


def recortar_linea(pts, x0, y0, x1, y1):
    trozos, actual = [], []
    for i, p in enumerate(pts):
        if x0 <= p[0] <= x1 and y0 <= p[1] <= y1:
            if not actual and i > 0:
                actual.append(pts[i - 1])
            actual.append(p)
        elif actual:
            actual.append(p)
            trozos.append(actual)
            actual = []
    if actual:
        trozos.append(actual)
    return [t for t in trozos if len(t) > 1]


# ============================================================ fuentes

class Textos:
    """Apunta los caracteres usados por peso para recortar Montserrat."""

    def __init__(self):
        self.usados = {500: set(), 700: set(), 800: set()}

    def usar(self, texto, peso):
        self.usados[peso].update(texto)
        self.usados[peso].update(texto.upper())

    def css(self):
        from fontTools import subset
        reglas = []
        for peso, chars in self.usados.items():
            if not chars:
                continue
            origen = FUENTES / f"montserrat-latin-{peso}-normal.woff2"
            opciones = subset.Options()
            opciones.flavor = "woff2"
            opciones.layout_features = ["kern", "liga"]
            opciones.name_IDs = []
            opciones.notdef_outline = False
            fuente = subset.load_font(str(origen), opciones)
            sub = subset.Subsetter(opciones)
            sub.populate(text="".join(sorted(chars)) + " 0123456789·–—.,:")
            sub.subset(fuente)
            buf = io.BytesIO()
            subset.save_font(fuente, buf, opciones)
            b64 = base64.b64encode(buf.getvalue()).decode()
            reglas.append(
                f"@font-face{{font-family:'SW Montserrat';font-weight:{peso};"
                f"src:url(data:font/woff2;base64,{b64}) format('woff2')}}")
        return "".join(reglas)


FAMILIA = "'SW Montserrat',Montserrat,'Segoe UI',Helvetica,Arial,sans-serif"


# ============================================================ colocación de rótulos

class Ocupado:
    def __init__(self, ancho, alto, borde=8):
        self.cajas = []
        self.ancho, self.alto, self.borde = ancho, alto, borde

    def libre(self, caja, permitir=()):
        x0, y0, x1, y1 = caja
        if x0 < self.borde or y0 < self.borde or x1 > self.ancho - self.borde or y1 > self.alto - self.borde:
            return False
        for c in self.cajas:
            if c[4] in permitir:
                continue
            if x0 < c[2] and x1 > c[0] and y0 < c[3] and y1 > c[1]:
                return False
        return True

    def poner(self, caja, tipo="rotulo"):
        self.cajas.append((*caja, tipo))


def candidatos_rotulo(x, y, r, w, h):
    """Posiciones alrededor de un punto: (x_texto, y_base, anchor, caja)."""
    g = r + 5
    out = []
    for nombre, (tx, ty, anchor) in {
        "der": (x + g, y + h * 0.35, "start"),
        "izq": (x - g, y + h * 0.35, "end"),
        "arr": (x, y - g - 2, "middle"),
        "aba": (x, y + g + h * 0.75, "middle"),
        "arr_der": (x + g * 0.7, y - g * 0.7, "start"),
        "aba_der": (x + g * 0.7, y + g * 0.7 + h * 0.7, "start"),
        "arr_izq": (x - g * 0.7, y - g * 0.7, "end"),
        "aba_izq": (x - g * 0.7, y + g * 0.7 + h * 0.7, "end"),
    }.items():
        if anchor == "start":
            caja = (tx, ty - h * 0.8, tx + w, ty + h * 0.25)
        elif anchor == "end":
            caja = (tx - w, ty - h * 0.8, tx, ty + h * 0.25)
        else:
            caja = (tx - w / 2, ty - h * 0.8, tx + w / 2, ty + h * 0.25)
        out.append((tx, ty, anchor, caja))
    return out


# ============================================================ piezas comunes

def concha_svg(x, y, ancho, color=VERDE):
    texto = (AQUI / "concha.svg").read_text()
    vb = texto.split('viewBox="')[1].split('"')[0].split()
    d = texto.split(' d="')[1].split('"')[0]
    s = ancho / float(vb[2])
    return (f'<path transform="translate({x:.1f} {y:.1f}) scale({s:.4f})" fill="{color}" '
            f'fill-rule="evenodd" d="{d}"/>'), float(vb[3]) * s


def estilos(extra=""):
    return f"""
text{{font-family:{FAMILIA}}}
.halo{{paint-order:stroke;stroke:{BLANCO};stroke-width:4px;stroke-linejoin:round}}
.trazo{{animation:trazo var(--dur,3.2s) cubic-bezier({','.join(map(str, CURVA))}) var(--ini,.4s) both}}
.aparece{{animation:aparece .5s ease-out both}}
.pulso{{transform-box:fill-box;transform-origin:center;animation:pulso 1.8s ease-out 3 both}}
@keyframes trazo{{0%{{stroke-dasharray:1 1;stroke-dashoffset:1}}99%{{stroke-dasharray:1 1;stroke-dashoffset:0}}100%{{stroke-dasharray:none;stroke-dashoffset:0}}}}
@keyframes aparece{{from{{opacity:0;transform:translateY(4px)}}}}
@keyframes pulso{{0%{{opacity:.7;transform:scale(1)}}100%{{opacity:0;transform:scale(2.6)}}}}
{extra}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important}}}}
"""


def cabecera_svg(T, ocupado, x, y, antetitulo, titulo, linea, tarjeta=True):
    """Bloque de titular arriba a la izquierda, sobre tarjeta blanca con la sombra de marca."""
    T.usar(antetitulo, 700)
    T.usar(titulo, 800)
    T.usar(linea, 500)
    tam_t = (22 if len(titulo) <= 26 else 19) if MOVIL else (30 if len(titulo) <= 22 else 26)
    w = max(ancho_texto(antetitulo, 12, 700, True), ancho_texto(titulo, tam_t, 800),
            ancho_texto(linea, 15, 500)) + 48
    h = 116
    partes = []
    if tarjeta:
        partes.append(f'<rect x="{x}" y="{y}" width="{w:.0f}" height="{h}" rx="12" fill="{BLANCO}" '
                      f'filter="url(#sombra)"/>')
    partes.append(f'<rect x="{x + 24}" y="{y + 20}" width="34" height="4" rx="2" fill="{VERDE}"/>')
    partes.append(f'<text x="{x + 24}" y="{y + 44}" font-size="12" font-weight="700" letter-spacing="1.8" '
                  f'fill="{SENDERO}">{esc(antetitulo.upper())}</text>')
    partes.append(f'<text x="{x + 24}" y="{y + 44 + tam_t + 4}" font-size="{tam_t}" font-weight="800" '
                  f'fill="{GRAFITO}">{esc(titulo)}</text>')
    partes.append(f'<text x="{x + 24}" y="{y + h - 18}" font-size="15" font-weight="500" '
                  f'fill="{GRIS}">{esc(linea)}</text>')
    ocupado.poner((x - 6, y - 6, x + w + 6, y + h + 6), "panel")
    return "\n".join(partes)


def defs_comunes():
    return (f'<filter id="sombra" x="-20%" y="-20%" width="140%" height="160%">'
            f'<feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="{GRAFITO}" flood-opacity=".12"/>'
            f'</filter>')


def envolver(ancho, alto, titulo, desc, cuerpo, T, extra_css=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ancho} {alto}" width="{round(ancho * ESCALA)}" '
            f'height="{round(alto * ESCALA)}" role="img" aria-labelledby="t d">\n'
            f'<title id="t">{esc(titulo)}</title>\n<desc id="d">{esc(desc)}</desc>\n'
            f'<style>{T.css()}{estilos(extra_css)}</style>\n'
            f'<defs>{defs_comunes()}</defs>\n'
            f'{cuerpo}\n</svg>\n')


# ============================================================ capas de base

ETIQUETAS_GEO = [
    # (texto, tamaño, [(lon, lat), ...] posiciones candidatas)
    ("España", 15, [(-3.9, 40.2), (-4.6, 41.9), (-5.6, 42.4), (-3.2, 42.3), (-6.6, 39.6), (-7.3, 42.6), (-2.9, 41.2)]),
    ("Portugal", 13, [(-7.95, 39.75), (-7.75, 40.9), (-7.9, 41.45), (-8.1, 38.6), (-7.55, 41.75)]),
    ("Francia", 13, [(0.4, 43.9), (-0.6, 43.55), (1.5, 44.2), (-0.9, 43.15), (-0.3, 43.9)]),
    ("Océano Atlántico", 12, [(-9.95, 41.2), (-9.9, 39.9), (-9.8, 43.95), (-9.95, 42.0), (-9.8, 38.3)]),
    ("Mar Cantábrico", 12, [(-4.3, 43.85), (-3.1, 43.75), (-5.9, 43.8), (-7.0, 43.95), (-2.2, 43.75)]),
]


def capas_base(L, base, ocupado, T, rotular=True, con_rios=True):
    W, H = L.ancho, L.alto
    m = 30
    x0, y0, x1, y1 = -m, -m, W + m, H + m
    tierra = []
    for p in base["tierra"]:
        for i, anillo in enumerate(p["anillos"]):
            pts = [L(lon, lat) for lon, lat in anillo]
            pts = recortar_poligono(pts, x0, y0, x1, y1)
            if len(pts) < 3:
                continue
            pts = rdp_xy(pts + [pts[0]], 0.5)[:-1]
            if len(pts) >= 3:
                tierra.append(d_linea(pts) + "Z")
    partes = [f'<rect width="{W}" height="{H}" fill="{BLANCO}"/>',
              # nonzero y no evenodd: los polígonos recortados se solapan en los bordes del
              # lienzo y con evenodd esos solapes se vaciaban (salía «mar» en mitad de Galicia)
              f'<path fill="{NIEBLA}" d="{"".join(tierra)}"/>']

    def lineas(capa, tol=0.6):
        out = []
        for l in base[capa]:
            pts = [L(lon, lat) for lon, lat in l["linea"]]
            for t in recortar_linea(pts, x0, y0, x1, y1):
                t = rdp_xy(t, tol)
                out.append(d_linea(t))
        return "".join(out)

    if con_rios:
        partes.append(f'<path fill="none" stroke="{BLANCO}" stroke-width="1.2" stroke-linecap="round" '
                      f'stroke-linejoin="round" opacity=".95" d="{lineas("rios")}"/>')
    partes.append(f'<path fill="none" stroke="{BLANCO}" stroke-width=".9" stroke-dasharray="3 3" '
                  f'd="{lineas("provincias")}"/>')
    partes.append(f'<path fill="none" stroke="{BLANCO}" stroke-width="2.6" stroke-linejoin="round" '
                  f'd="{lineas("fronteras")}"/>')
    return "\n".join(partes)


def etiquetas_geo(L, ocupado, T):
    out = []
    for texto, tam, posiciones in ETIQUETAS_GEO:
        rot = texto.upper()
        w = ancho_texto(rot, tam, 700, True) + len(rot) * 2.2
        for lon, lat in posiciones:
            x, y = L(lon, lat)
            caja = (x - w / 2, y - tam, x + w / 2, y + 4)
            if ocupado.libre(caja):
                ocupado.poner(caja, "geo")
                T.usar(rot, 700)
                out.append(f'<text x="{x:.0f}" y="{y:.0f}" text-anchor="middle" font-size="{tam}" '
                           f'font-weight="700" letter-spacing="2.4" fill="{GRIS}" opacity=".75">{esc(rot)}</text>')
                break
    return "\n".join(out)


# ============================================================ mapa de una ruta

def caja_km(lineas, extra=()):
    xs, ys = [], []
    for l in lineas:
        for lon, lat in l:
            x, y = PROY(lon, lat)
            xs.append(x)
            ys.append(y)
    for lon, lat in extra:
        x, y = PROY(lon, lat)
        xs.append(x)
        ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


def ruta_px(L, linea, tol=0.35):
    return rdp_xy([L(lon, lat) for lon, lat in linea], tol)


def longitudes(pts):
    acum = [0.0]
    for a, b in zip(pts, pts[1:]):
        acum.append(acum[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    return acum


def localizador(L_mapa, base, x, y, w, h, T):
    """Mini mapa de situación: la península con el recuadro del mapa grande."""
    caja = caja_km([[(-9.6, 36.0), (3.4, 43.9)]])
    L = Lienzo(caja, w, h, (6, 6, 6, 6))
    partes = [f'<g transform="translate({x} {y})">',
              f'<rect width="{w}" height="{h}" rx="10" fill="{BLANCO}" filter="url(#sombra)"/>']
    trozos = []
    for p in base["tierra"]:
        if p["pais"] not in ("ESP", "PRT", "FRA", "AND"):
            continue
        anillo = p["anillos"][0]
        pts = [L(lon, lat) for lon, lat in anillo]
        pts = recortar_poligono(pts, 2, 2, w - 2, h - 2)
        if len(pts) >= 3:
            pts = rdp_xy(pts + [pts[0]], 0.6)[:-1]
            if len(pts) >= 3:
                trozos.append(d_linea(pts) + "Z")
    partes.append(f'<path fill="{NIEBLA}" d="{"".join(trozos)}"/>')
    # recuadro del mapa principal
    esquinas = []
    for px, py in ((0, 0), (L_mapa.ancho, 0), (L_mapa.ancho, L_mapa.alto), (0, L_mapa.alto)):
        kx = (px - L_mapa.ox) / L_mapa.s
        ky = (L_mapa.oy - py) / L_mapa.s
        esquinas.append((L.ox + kx * L.s, L.oy - ky * L.s))
    xs = [max(4, min(w - 4, e[0])) for e in esquinas]
    ys = [max(4, min(h - 4, e[1])) for e in esquinas]
    partes.append(f'<rect x="{min(xs):.1f}" y="{min(ys):.1f}" width="{max(xs) - min(xs):.1f}" '
                  f'height="{max(ys) - min(ys):.1f}" fill="{VERDE}" fill-opacity=".18" stroke="{SENDERO}" '
                  f'stroke-width="1.5"/>')
    partes.append("</g>")
    return "\n".join(partes)


def escala(L, x, y, T):
    """Barra de escala con una distancia redonda de unos 110 px."""
    kmpx = L.km_por_px()
    objetivo = 110 * kmpx
    for paso in (5, 10, 20, 25, 50, 100, 200, 250):
        if paso >= objetivo * 0.6:
            break
    w = paso / kmpx
    texto = f"{paso} km"
    T.usar(texto, 500)
    T.usar("0", 500)
    return (f'<g transform="translate({x:.0f} {y:.0f})">'
            f'<rect width="{w / 2:.1f}" height="5" fill="{GRAFITO}"/>'
            f'<rect x="{w / 2:.1f}" width="{w / 2:.1f}" height="5" fill="{BLANCO}" stroke="{GRAFITO}" stroke-width="1"/>'
            f'<text x="0" y="20" font-size="11" font-weight="500" fill="{GRIS}">0</text>'
            f'<text x="{w:.1f}" y="20" text-anchor="end" font-size="11" font-weight="500" fill="{GRIS}">{texto}</text>'
            f'</g>'), w


def leyenda(L, x, y, nombre, T, ocupado, otras=True):
    filas = [("ruta", nombre), ("punto", "Poblaciones y finales de etapa")]
    if otras:
        filas.append(("otra", "Otras rutas del Camino"))
    attrib = "Trazado © colaboradores de OpenStreetMap · Base © EuroGeographics, Natural Earth"
    w = max(max(ancho_texto(t, 13, 500) for _, t in filas) + 52, ancho_texto(attrib, 10, 500) + 32, 250)
    h = 26 + len(filas) * 22 + 48
    y0 = y - h
    partes = [f'<g transform="translate({x} {y0:.0f})">',
              f'<rect width="{w:.0f}" height="{h}" rx="12" fill="{BLANCO}" filter="url(#sombra)"/>']
    yy = 26
    for tipo, texto in filas:
        T.usar(texto, 500)
        if tipo == "ruta":
            partes.append(f'<path d="M16,{yy - 4}h26" stroke="{VERDE}" stroke-width="5" stroke-linecap="round"/>')
        elif tipo == "otra":
            partes.append(f'<path d="M16,{yy - 4}h26" stroke="{GRIS}" stroke-opacity=".45" stroke-width="2.5" '
                          f'stroke-linecap="round"/>')
        else:
            partes.append(f'<circle cx="29" cy="{yy - 4}" r="4.5" fill="{BLANCO}" stroke="{SENDERO}" stroke-width="2"/>')
        partes.append(f'<text x="52" y="{yy}" font-size="13" font-weight="500" fill="{GRAFITO}">{esc(texto)}</text>')
        yy += 22
    barra, _ = escala(L, 16, yy + 2, T)
    partes.append(barra)
    T.usar(attrib, 500)
    partes.append(f'<text x="16" y="{h - 12}" font-size="10" font-weight="500" fill="{GRIS}">{esc(attrib)}</text>')
    partes.append("</g>")
    ocupado.poner((x - 6, y0 - 6, x + w + 6, y + 6), "panel")
    return "\n".join(partes), w


def hito_svg(x, y, nivel, especial, T, delay, sello=None):
    if especial == "meta":
        concha, alto = concha_svg(x - 8, y - 6.5, 16, BLANCO)
        return (f'<g class="aparece" style="animation-delay:{delay:.2f}s">'
                f'<circle class="pulso" style="animation-delay:{delay + .2:.2f}s" cx="{x:.1f}" cy="{y:.1f}" r="13" '
                f'fill="{VERDE}"/>'
                f'<circle cx="{x:.1f}" cy="{y:.1f}" r="14" fill="{SENDERO}" stroke="{BLANCO}" stroke-width="3"/>'
                f'{concha}</g>')
    if especial == "inicio":
        return (f'<g class="aparece" style="animation-delay:{delay:.2f}s">'
                f'<circle cx="{x:.1f}" cy="{y:.1f}" r="9" fill="{SENDERO}" stroke="{BLANCO}" stroke-width="3"/>'
                f'</g>')
    r = {1: 6, 2: 5, 3: 3.8}[nivel]
    return (f'<circle class="aparece" style="animation-delay:{delay:.2f}s" cx="{x:.1f}" cy="{y:.1f}" r="{r}" '
            f'fill="{BLANCO}" stroke="{SENDERO}" stroke-width="{2.2 if nivel < 3 else 1.8}"/>')


def rotulo_hito(x, y, r, nombre, nivel, especial, T, ocupado, delay, linea_ocupada):
    if especial:
        tam, peso = 17, 800
    else:
        tam, peso = {1: (16, 700), 2: (14, 700), 3: (12.5, 500)}[nivel]
    w = ancho_texto(nombre, tam, peso)
    h = tam
    alto_extra = 14 if especial else 0
    # Inicio y meta se rotulan siempre: si no hay hueco limpio, se repite pudiendo pisar
    # puntos y rótulos geográficos (nunca otros rótulos de lugar ni los paneles).
    pasadas = [("linea",), ("linea", "hito", "geo")] if especial else [() if nivel == 3 else ("linea",)]
    intentos = [(tx, ty, anchor, caja, permitir) for permitir in pasadas
                for tx, ty, anchor, caja in candidatos_rotulo(x, y, r, w, h + alto_extra)]
    for tx, ty, anchor, caja, permitir in intentos:
        if especial:
            caja = (caja[0], caja[1] - 2, caja[2], caja[3])
        if ocupado.libre(caja, permitir=permitir):
            if nivel == 3 and any(caja[0] < lx < caja[2] and caja[1] < ly < caja[3] for lx, ly in linea_ocupada):
                continue
            ocupado.poner(caja)
            T.usar(nombre, peso)
            color = GRAFITO if nivel < 3 or especial else GRIS
            partes = [f'<g class="aparece" style="animation-delay:{delay + .1:.2f}s">']
            if especial:
                ante = "Inicio" if especial == "inicio" else "Meta"
                T.usar(ante.upper(), 700)
                partes.append(f'<text class="halo" x="{tx:.1f}" y="{ty - h - 1:.1f}" text-anchor="{anchor}" '
                              f'font-size="10.5" font-weight="700" letter-spacing="1.6" fill="{SENDERO}">'
                              f'{ante.upper()}</text>')
            partes.append(f'<text class="halo" x="{tx:.1f}" y="{ty:.1f}" text-anchor="{anchor}" font-size="{tam}" '
                          f'font-weight="{peso}" fill="{color}">{esc(nombre)}</text></g>')
            return "".join(partes)
    return ""


def mapa_ruta(clave, trazados, perfiles, base, todos=True):
    r = RUTAS[clave]
    t = trazados[clave]
    p = perfiles[clave]
    T = Textos()
    lineas_lonlat = [t["linea"]] + t["ramales"]
    x0, y0, x1, y1 = caja_km(lineas_lonlat)
    bw, bh = x1 - x0, y1 - y0
    margen = [24, 170, 24, 56] if MOVIL else [70, 190, 70, 150]
    util_w = ANCHO - margen[0] - margen[2]
    alto = margen[1] + margen[3] + util_w * bh / bw
    alto = int(max(520, min(900, alto))) if MOVIL else int(max(660, min(1500, alto)))
    # Ensancho la caja un 8 % para que la ruta respire
    pad = 0.08
    caja = (x0 - bw * pad, y0 - bh * pad, x1 + bw * pad, y1 + bh * pad)
    L = Lienzo(caja, ANCHO, alto, margen)
    ocupado = Ocupado(ANCHO, alto)

    cuerpo = [capas_base(L, base, ocupado, T)]

    # Otras rutas, en gris, para dar contexto
    if todos:
        otras = []
        for k, tt in trazados.items():
            if k == clave:
                continue
            for l in [tt["linea"]] + tt["ramales"]:
                pts = ruta_px(L, l, 0.8)
                for trozo in recortar_linea(pts, -20, -20, ANCHO + 20, alto + 20):
                    otras.append(d_linea(trozo))
        cuerpo.append(f'<path fill="none" stroke="{GRIS}" stroke-opacity=".42" stroke-width="2.5" '
                      f'stroke-linecap="round" stroke-linejoin="round" d="{"".join(otras)}"/>')

    # La ruta: casing blanco y trazo verde animado
    principal = ruta_px(L, t["linea"])
    ramales = [ruta_px(L, rm) for rm in t["ramales"]]
    acum = longitudes(principal)
    total = acum[-1]
    for pts in [principal] + ramales:
        cuerpo.append(f'<path d="{d_linea(pts)}" fill="none" stroke="{BLANCO}" stroke-width="10" '
                      f'stroke-linecap="round" stroke-linejoin="round"/>')
    cuerpo.append(f'<path class="trazo" pathLength="1" d="{d_linea(principal)}" fill="none" stroke="{VERDE}" '
                  f'stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>')
    for pts in ramales:
        cuerpo.append(f'<path class="trazo" style="--ini:3.1s;--dur:1.4s" pathLength="1" d="{d_linea(pts)}" '
                      f'fill="none" stroke="{VERDE}" stroke-width="5.5" stroke-linecap="round" '
                      f'stroke-linejoin="round"/>')

    # Paneles: cabecera, concha, leyenda, localizador
    destino = r["paso"][-1]
    origen = r["paso"][0]
    linea_cab = f"De {origen} a {destino} · {km_es(t['km'])} km"
    if clave == "fisterra":
        linea_cab = f"De Santiago a Fisterra y Muxía · {km_es(t['km'])} km hasta Fisterra"
    if MOVIL:
        linea_cab = f"Desde {origen} · {km_es(t['km'])} km" if clave != "fisterra" else \
            f"A Fisterra y Muxía · {km_es(t['km'])} km"
        cuerpo.append(cabecera_svg(T, ocupado, 16, 16, "Mapa del Camino", r["nombre"], linea_cab))
        concha, alto_c = concha_svg(ANCHO - 16 - 40, 22, 40)
        cuerpo.append(concha)
        ocupado.poner((ANCHO - 64, 12, ANCHO - 8, 22 + alto_c + 10), "panel")
        barra, _ = escala(L, 16, alto - 34, T)
        cuerpo.append(barra)
        ocupado.poner((10, alto - 40, 150, alto - 8), "panel")
        attrib = "© OpenStreetMap · © EuroGeographics"
        T.usar(attrib, 500)
        cuerpo.append(f'<text x="{ANCHO - 12}" y="{alto - 14}" text-anchor="end" font-size="9" font-weight="500" '
                      f'fill="{GRIS}">{attrib}</text>')
        ocupado.poner((ANCHO - 200, alto - 26, ANCHO - 8, alto - 8), "panel")
    else:
        cuerpo.append(cabecera_svg(T, ocupado, 32, 32, "Mapa del Camino de Santiago", r["nombre"], linea_cab))
        concha, alto_c = concha_svg(ANCHO - 32 - 54, 34, 54)
        cuerpo.append(concha)
        ocupado.poner((ANCHO - 100, 20, ANCHO - 20, 34 + alto_c + 12), "panel")
        ley, _ = leyenda(L, 32, alto - 32, r["nombre"], T, ocupado)
        cuerpo.append(ley)
        cuerpo.append(localizador(L, base, ANCHO - 32 - 170, alto - 32 - 150, 170, 150, T))
        ocupado.poner((ANCHO - 32 - 176, alto - 32 - 156, ANCHO - 26, alto - 26), "panel")

    # La línea de la ruta también ocupa: los rótulos de nivel 3 no la pisan
    linea_ocupada = []
    for pts in [principal] + ramales:
        for a, b in zip(pts, pts[1:]):
            n = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / 5))
            for i in range(n):
                linea_ocupada.append((a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n))
    for lx, ly in linea_ocupada[::2]:
        ocupado.poner((lx - 4, ly - 4, lx + 4, ly + 4), "linea")

    # Hitos: se encajan en la línea y aparecen cuando el trazo pasa por ellos
    hitos, rotulos = [], []
    datos_hitos = []
    for m in p["marcas"]:
        x, y = L(m["lon"], m["lat"])
        i = min(range(len(principal)), key=lambda k: (principal[k][0] - x) ** 2 + (principal[k][1] - y) ** 2)
        dist = math.hypot(principal[i][0] - x, principal[i][1] - y)
        frac = acum[i] / total
        if dist < 14:
            x, y = principal[i]
        else:  # en un ramal
            frac = 1.0
            for pts in ramales:
                j = min(range(len(pts)), key=lambda k: (pts[k][0] - x) ** 2 + (pts[k][1] - y) ** 2)
                if math.hypot(pts[j][0] - x, pts[j][1] - y) < 14:
                    x, y = pts[j]
        especial = "inicio" if m["nombre"] == origen else ("meta" if m["nombre"] == destino else None)
        if clave == "fisterra":
            especial = "inicio" if m["nombre"] == SANTIAGO else (
                "meta" if m["nombre"] in ("Fisterra", "Muxía") else None)
        delay = 0.4 + 3.2 * TIEMPO_PARA(frac) if frac < 1 else 3.6 + 1.0
        if m["nombre"] == "Muxía":
            delay = 4.4
        datos_hitos.append((m, x, y, especial, delay))
        ocupado.poner((x - 7, y - 7, x + 7, y + 7), "hito")

    for m, x, y, especial, delay in sorted(datos_hitos, key=lambda d: (d[3] is None, d[0]["nivel"])):
        hitos.append((m["nivel"], especial, hito_svg(x, y, m["nivel"], especial, T, delay)))
        r_ = 14 if especial == "meta" else (9 if especial else {1: 6, 2: 5, 3: 3.8}[m["nivel"]])
        rotulos.append(rotulo_hito(x, y, r_, m["nombre"], m["nivel"], especial, T, ocupado, delay, linea_ocupada))

    cuerpo.insert(1, "")  # sitio reservado
    cuerpo.append("\n".join(h for nivel, esp, h in sorted(hitos, key=lambda h: (h[1] is not None, -h[0]))))
    geo = etiquetas_geo(L, ocupado, T)
    cuerpo.insert(2, geo)
    cuerpo.append("\n".join(x for x in rotulos if x))

    titulo = f"Mapa del {r['nombre']}" if not r["nombre"].startswith("Vía") else f"Mapa de la {r['nombre']}"
    if clave == "fisterra":
        titulo = "Mapa del Camino de Finisterre y Muxía"
    nombres = [m["nombre"] for m in p["marcas"] if m["nivel"] <= 2]
    desc = (f"{titulo}: {km_es(t['km'])} km de {origen} a {destino}. Pasa por "
            + ", ".join(nombres[1:-1]) + ". Trazado de la ruta señalizada, según OpenStreetMap.")
    return envolver(ANCHO, alto, titulo, desc, "\n".join(cuerpo), T), alto, titulo, desc


# ============================================================ perfil

TECHOS = {
    "frances": "Cruz de Ferro",
    "primitivo": "Puerto del Palo",
    "plata": "Alto de Padornelo",
}


def perfil_ruta(clave, perfiles):
    r = RUTAS[clave]
    p = perfiles[clave]
    T = Textos()
    W, H = (ANCHO, 400) if MOVIL else (ANCHO, 470)
    ocupado = Ocupado(W, H)
    alts = p["alt"]
    paso = p["paso_km"]
    km_total = p["km"]
    techo = p["max"]  # dato sin suavizar: el mismo que va en la cabecera

    # Escala vertical con un paso redondo y de 3 a 6 líneas
    for paso_y in (50, 100, 200, 250, 400, 500):
        tope = math.ceil(techo * 1.06 / paso_y) * paso_y
        if tope / paso_y <= 6:
            break
    gx0, gx1, gy0, gy1 = (60, W - 22, 190, 345) if MOVIL else (92, W - 40, 215, 405)
    X = lambda km: gx0 + (gx1 - gx0) * km / km_total  # noqa: E731
    Y = lambda a: gy1 - (gy1 - gy0) * a / tope  # noqa: E731

    cuerpo = [f'<rect width="{W}" height="{H}" fill="{BLANCO}"/>']
    cab = (f"{km_es(km_total)} km · +{km_es(p['subida'])} m de desnivel positivo · "
           f"punto más alto: {km_es(techo)} m")
    if MOVIL:
        cab = f"{km_es(km_total)} km · +{km_es(p['subida'])} m · máx. {km_es(techo)} m"
        cuerpo.append(cabecera_svg(T, ocupado, -8, -4, "Perfil de altitud", r["nombre"], cab, tarjeta=False))
        concha, alto_c = concha_svg(W - 16 - 40, 22, 40)
        ocupado.poner((W - 64, 12, W - 8, 22 + alto_c + 10), "panel")
    else:
        cuerpo.append(cabecera_svg(T, ocupado, 8, 8, "Perfil de altitud", r["nombre"], cab, tarjeta=False))
        concha, alto_c = concha_svg(W - 32 - 54, 34, 54)
        ocupado.poner((W - 100, 20, W - 20, 34 + alto_c + 12), "panel")
    cuerpo.append(concha)

    # Rejilla y ejes
    a = 0
    while a <= tope + 0.1:
        y = Y(a)
        cuerpo.append(f'<path d="M{gx0},{y:.1f}H{gx1}" stroke="{NIEBLA}" stroke-width="1"/>')
        etiqueta = f"{km_es(a)} m"
        T.usar(etiqueta, 500)
        cuerpo.append(f'<text x="{gx0 - 10}" y="{y + 4:.1f}" text-anchor="end" font-size="12" font-weight="500" '
                      f'fill="{GRIS}">{etiqueta}</text>')
        a += paso_y
    for paso_x in (10, 25, 50, 100, 200, 250):
        if km_total / paso_x <= (5 if MOVIL else 10):
            break
    k = 0
    while k <= km_total + 0.01:
        x = X(k)
        etiqueta = f"{km_es(k)} km"
        T.usar(etiqueta, 500)
        cuerpo.append(f'<path d="M{x:.1f},{gy1}v6" stroke="{GRIS}" stroke-width="1"/>')
        cuerpo.append(f'<text x="{x:.1f}" y="{gy1 + 22}" text-anchor="middle" font-size="12" font-weight="500" '
                      f'fill="{GRIS}">{etiqueta}</text>')
        k += paso_x

    # Área y cresta, barridas de izquierda a derecha
    n = len(alts)
    salto = max(1, int(n / ((gx1 - gx0) / 1.2)))
    pts = [(X(i * paso), Y(alts[i])) for i in range(0, n, salto)]
    pts.append((X(km_total), Y(alts[-1])))
    area = d_linea(pts) + f"L{gx1},{gy1}L{gx0},{gy1}Z"
    cuerpo.append(f'<clipPath id="revela"><rect class="barre" x="{gx0 - 2}" y="0" width="{gx1 - gx0 + 4}" '
                  f'height="{H}"/></clipPath>')
    cuerpo.append(f'<g clip-path="url(#revela)">'
                  f'<path d="{area}" fill="{VERDE}" fill-opacity=".2"/>'
                  f'<path d="{d_linea(pts)}" fill="none" stroke="{SENDERO}" stroke-width="2.5" '
                  f'stroke-linejoin="round"/></g>')
    cuerpo.append(f'<path d="M{gx0},{gy1}H{gx1}" stroke="{GRAFITO}" stroke-width="1.2"/>')

    # La cresta también ocupa: un rótulo nunca puede quedar por debajo de ella
    cresta = {}
    for x, y in pts:
        cresta[int(x)] = min(y, cresta.get(int(x), 1e9))

    def cima(x0, x1):
        return min((cresta.get(i, 1e9) for i in range(int(x0) - 2, int(x1) + 3)), default=gy1)

    def marca_alt(km):
        return alts[min(n - 1, int(round(km / paso)))]

    elementos = []
    marcas = sorted((m for m in p["marcas"] if not m.get("ramal")), key=lambda m: (m["nivel"], m["km"]))
    techo_km = p["km_max"]
    techo_en_extremo = techo_km < km_total * 0.02 or techo_km > km_total * 0.98

    # El techo primero, para que tenga sitio
    if not techo_en_extremo:
        xt, yt = X(techo_km), Y(techo)
        nombre_t = TECHOS.get(clave, "Punto más alto")
        txt = f"{nombre_t} · {km_es(techo)} m"
        T.usar(txt, 700)
        ancho_t = ancho_texto(txt, 12, 700)
        d_t = 0.3 + 2.8 * techo_km / km_total
        elementos.append(f'<path class="aparece" style="animation-delay:{d_t:.2f}s" '
                         f'd="M{xt - 6:.1f},{yt - 4:.1f}l6,-9l6,9z" fill="{SENDERO}"/>')
        ocupado.poner((xt - 8, yt - 16, xt + 8, yt), "hito")
        for dy in (-20, -48, -76, -104):
            caja = (xt - ancho_t / 2 - 4, yt + dy - 13, xt + ancho_t / 2 + 4, yt + dy + 4)
            if caja[1] > (108 if MOVIL else 120) and caja[3] < cima(caja[0], caja[2]) - 2 and ocupado.libre(caja):
                ocupado.poner(caja)
                elementos.append(f'<text class="halo aparece" style="animation-delay:{d_t + .1:.2f}s" x="{xt:.1f}" '
                                 f'y="{yt + dy:.1f}" text-anchor="middle" font-size="12" font-weight="700" '
                                 f'fill="{SENDERO}">{esc(txt)}</text>')
                break

    for m in marcas:
        x = X(min(m["km"], km_total))
        alt = marca_alt(m["km"])
        y = Y(alt)
        delay = 0.3 + 2.8 * (m["km"] / km_total)
        elementos.append(f'<circle class="aparece" style="animation-delay:{delay:.2f}s" cx="{x:.1f}" cy="{y:.1f}" '
                         f'r="{4 if m["nivel"] < 3 else 3}" fill="{BLANCO}" stroke="{SENDERO}" stroke-width="2"/>')
        nombre = m["nombre"]
        alt_txt = f"{km_es(alt)} m"
        w = max(ancho_texto(nombre, 12.5, 700), ancho_texto(alt_txt, 11.5, 500)) + 8
        # En los extremos el rótulo se alinea hacia dentro para no salirse del lienzo
        if x + w / 2 > W - 12:
            anchor, tx, cx0, cx1 = "end", x + 4, x + 4 - w, x + 4
        elif x - w / 2 < 12:
            anchor, tx, cx0, cx1 = "start", x - 4, x - 4, x - 4 + w
        else:
            anchor, tx, cx0, cx1 = "middle", x, x - w / 2, x + w / 2
        tope_cresta = cima(cx0, cx1)
        colocado = False
        # Cuanto menos importante el lugar, menos se aleja su rótulo de la cresta
        for fila in range({1: 6, 2: 3, 3: 1}[m["nivel"]]):
            base_y = min(y, tope_cresta) - 14 - fila * 30   # línea base del texto de altitud
            caja = (cx0, base_y - 26, cx1, base_y + 4)
            if caja[1] < (108 if MOVIL else 118):
                break
            if caja[3] < tope_cresta - 2 and ocupado.libre(caja):
                ocupado.poner(caja)
                T.usar(nombre, 700)
                T.usar(alt_txt, 500)
                elementos.append(
                    f'<g class="aparece" style="animation-delay:{delay + .1:.2f}s">'
                    f'<path d="M{x:.1f},{base_y + 5:.1f}V{y - 5:.1f}" stroke="{GRIS}" stroke-opacity=".5" '
                    f'stroke-width="1" stroke-dasharray="2 2"/>'
                    f'<text class="halo" x="{tx:.1f}" y="{base_y - 13:.1f}" text-anchor="{anchor}" font-size="12.5" '
                    f'font-weight="700" fill="{GRAFITO}">{esc(nombre)}</text>'
                    f'<text class="halo" x="{tx:.1f}" y="{base_y:.1f}" text-anchor="{anchor}" font-size="11.5" '
                    f'font-weight="500" fill="{GRIS}">{alt_txt}</text></g>')
                colocado = True
                break
        if not colocado and m["nivel"] <= 1:
            print(f"   ⚠ perfil {clave}: sin sitio para {nombre}")
    cuerpo += elementos

    titulo = f"Perfil de altitud del {r['nombre']}" if not r["nombre"].startswith("Vía") else \
        f"Perfil de altitud de la {r['nombre']}"
    if clave == "fisterra":
        titulo = "Perfil de altitud del Camino de Finisterre"
    desc = (f"{titulo}: {km_es(km_total)} km, altitud entre {km_es(p['min'])} y {km_es(techo)} m y unos "
            f"{km_es(p['subida'])} m de desnivel positivo acumulado. Altitud: modelo digital EU-DEM.")
    extra = ".barre{animation:barre 3.1s cubic-bezier(.4,0,.2,1) .3s both}@keyframes barre{from{width:0}}"
    return envolver(W, H, titulo, desc, "\n".join(cuerpo), T, extra), H, titulo, desc


# ============================================================ mapa general

def mapa_general(trazados, perfiles, base):
    T = Textos()
    caja = caja_km([[(-10.5, 36.9), (-1.0, 43.6)]])
    margen = [10, 160, 10, 30] if MOVIL else [40, 170, 40, 40]
    util_w = ANCHO - margen[0] - margen[2]
    bw, bh = caja[2] - caja[0], caja[3] - caja[1]
    alto = int(margen[1] + margen[3] + util_w * bh / bw)
    L = Lienzo(caja, ANCHO, alto, margen)
    ocupado = Ocupado(ANCHO, alto)
    cuerpo = [capas_base(L, base, ocupado, T)]
    if MOVIL:
        cuerpo.append(cabecera_svg(T, ocupado, 16, 16, "Mapa del Camino", "Todas las rutas a Santiago",
                                   "Los ocho itinerarios de esta guía"))
        concha, alto_c = concha_svg(ANCHO - 16 - 40, 22, 40)
        ocupado.poner((ANCHO - 64, 12, ANCHO - 8, 22 + alto_c + 10), "panel")
    else:
        cuerpo.append(cabecera_svg(T, ocupado, 32, 32, "Mapa del Camino de Santiago",
                                   "Todas las rutas a Santiago",
                                   "Los ocho itinerarios de esta guía, con sus trazados señalizados"))
        concha, alto_c = concha_svg(ANCHO - 32 - 54, 34, 54)
        ocupado.poner((ANCHO - 100, 20, ANCHO - 20, 34 + alto_c + 12), "panel")
    cuerpo.append(concha)

    orden = ["frances", "norte", "primitivo", "ingles", "portugues", "costa", "plata", "fisterra"]
    trazos, casings, inicios = [], [], []
    linea_ocupada = []
    for i, clave in enumerate(orden):
        t = trazados[clave]
        pts = ruta_px(L, t["linea"], 0.5)
        dur = 3.4
        ini = 0.3 + i * 0.12
        if clave == "fisterra":
            ini, dur = 3.6, 1.2
        casings.append(d_linea(pts))
        trazos.append(f'<path class="trazo" style="--ini:{ini:.2f}s;--dur:{dur}s" pathLength="1" d="{d_linea(pts)}" '
                      f'fill="none" stroke="{VERDE}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>')
        for rm in t["ramales"]:
            q = ruta_px(L, rm, 0.5)
            casings.append(d_linea(q))
            trazos.append(f'<path class="trazo" style="--ini:4.4s;--dur:.8s" pathLength="1" d="{d_linea(q)}" '
                          f'fill="none" stroke="{VERDE}" stroke-width="4.5" stroke-linecap="round" '
                          f'stroke-linejoin="round"/>')
        for a, b in zip(pts, pts[1:]):
            nn = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / 5))
            for j in range(nn):
                linea_ocupada.append((a[0] + (b[0] - a[0]) * j / nn, a[1] + (b[1] - a[1]) * j / nn))
        inicios.append((clave, pts, ini))
    cuerpo.append(f'<path d="{"".join(casings)}" fill="none" stroke="{BLANCO}" stroke-width="8.5" '
                  f'stroke-linecap="round" stroke-linejoin="round"/>')
    cuerpo += trazos
    for lx, ly in linea_ocupada[::2]:
        ocupado.poner((lx - 4, ly - 4, lx + 4, ly + 4), "linea")

    # Santiago
    sx, sy = L(*json.loads((DATOS / "lugares.json").read_text(encoding="utf-8"))[SANTIAGO])
    ocupado.poner((sx - 16, sy - 16, sx + 16, sy + 16), "hito")
    rotulos = [hito_svg(sx, sy, 1, "meta", T, 3.4)]
    rotulos.append(rotulo_hito(sx, sy, 15, "Santiago de Compostela", 1, "meta", T, ocupado, 3.4, []))

    # Puntos de inicio: punto y nombre del lugar
    sitios = json.loads((DATOS / "lugares.json").read_text(encoding="utf-8"))
    vistos = set()
    for clave, pts, ini in inicios:
        origen = RUTAS[clave]["paso"][0]
        if clave == "fisterra":
            origen = "Fisterra"
        if origen in vistos:
            continue
        vistos.add(origen)
        x, y = L(*sitios[origen])
        ocupado.poner((x - 8, y - 8, x + 8, y + 8), "hito")
        rotulos.append(f'<circle class="aparece" style="animation-delay:{ini:.2f}s" cx="{x:.1f}" cy="{y:.1f}" r="6.5" '
                       f'fill="{SENDERO}" stroke="{BLANCO}" stroke-width="2.5"/>')
        rotulos.append(rotulo_hito(x, y, 7, origen, 2, None, T, ocupado, ini, []))

    # Nombre de cada ruta junto a su trazo, en verde sendero
    nombres_ruta = {
        "frances": "Camino Francés", "norte": "Camino del Norte", "primitivo": "Camino Primitivo",
        "ingles": "Camino Inglés", "portugues": "Camino Portugués", "costa": "Portugués por la Costa",
        "plata": "Vía de la Plata", "fisterra": "Finisterre y Muxía",
    }
    if MOVIL:
        nombres_ruta = {"frances": "Francés", "norte": "Norte", "primitivo": "Primitivo", "ingles": "Inglés",
                        "portugues": "Portugués", "costa": "Costa", "plata": "Vía de la Plata",
                        "fisterra": "Finisterre"}
    for clave, pts, ini in inicios:
        nombre = nombres_ruta[clave]
        acum = longitudes(pts)
        puesto = False
        intentos = [(f, 14) for f in (0.45, 0.35, 0.55, 0.25, 0.65, 0.15, 0.75, 0.85, 0.5)] + \
                   [(f / 20, 12.5) for f in range(2, 19)]
        for frac, tam in intentos:
            w = ancho_texto(nombre, tam, 800)
            if puesto:
                break
            objetivo = acum[-1] * frac
            i = min(range(len(acum)), key=lambda k: abs(acum[k] - objetivo))
            x, y = pts[i]
            for dx, dy, anchor in ((0, -14, "middle"), (0, 24, "middle"), (12, 5, "start"), (-12, 5, "end"),
                                   (0, -30, "middle"), (0, 40, "middle"), (20, -10, "start"), (-20, -10, "end"),
                                   (16, 20, "start"), (-16, 20, "end"), (16, -22, "start"), (-16, -22, "end")):
                tx, ty = x + dx, y + dy
                if anchor == "middle":
                    cj = (tx - w / 2, ty - tam + 1, tx + w / 2, ty + 4)
                elif anchor == "start":
                    cj = (tx, ty - tam + 1, tx + w, ty + 4)
                else:
                    cj = (tx - w, ty - tam + 1, tx, ty + 4)
                if ocupado.libre(cj):
                    ocupado.poner(cj)
                    T.usar(nombre, 800)
                    rotulos.append(f'<text class="halo aparece" style="animation-delay:{ini + 1.2:.2f}s" x="{tx:.1f}" '
                                   f'y="{ty:.1f}" text-anchor="{anchor}" font-size="{tam}" font-weight="800" '
                                   f'fill="{SENDERO}">{esc(nombre)}</text>')
                    puesto = True
                    break
        if not puesto:
            print("   ⚠ mapa general: sin sitio para", nombre)

    attrib = "Trazados © colaboradores de OpenStreetMap · Base © EuroGeographics, Natural Earth"
    if MOVIL:
        attrib = "© OpenStreetMap · © EuroGeographics"
    T.usar(attrib, 500)
    rotulos.append(f'<text x="{ANCHO - 12 if MOVIL else ANCHO - 24}" y="{alto - 12 if MOVIL else alto - 18}" text-anchor="end" font-size="{9 if MOVIL else 10}" font-weight="500" '
                   f'fill="{GRIS}">{esc(attrib)}</text>')
    cuerpo.insert(1, etiquetas_geo(L, ocupado, T))
    cuerpo += rotulos
    titulo = "Mapa del Camino de Santiago con todas sus rutas"
    desc = ("Mapa de las rutas del Camino de Santiago en la península ibérica: Camino Francés, del Norte, "
            "Primitivo, Inglés, Portugués Central, Portugués por la Costa, Vía de la Plata con el Sanabrés y "
            "Camino de Finisterre y Muxía, todas confluyendo en Santiago de Compostela.")
    return envolver(ANCHO, alto, titulo, desc, "\n".join(cuerpo), T), alto, titulo, desc


# ============================================================ GPX

def gpx(clave, trazados, perfiles):
    r = RUTAS[clave]
    t = trazados[clave]
    p = perfiles[clave]
    puntos = "\n".join(f'      <trkpt lat="{lat}" lon="{lon}"/>' for lon, lat in t["linea"])
    ramales = ""
    for rm in t["ramales"]:
        pr = "\n".join(f'      <trkpt lat="{lat}" lon="{lon}"/>' for lon, lat in rm)
        ramales += f"    <trkseg>\n{pr}\n    </trkseg>\n"
    wpts = "\n".join(f'  <wpt lat="{m["lat"]}" lon="{m["lon"]}">'
                     + (f'<ele>{m["alt"]}</ele>' if m["alt"] is not None else "")
                     + f'<name>{esc(m["nombre"])}</name></wpt>'
                     for m in p["marcas"])
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Santiago Ways · santiagoways.com" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>{esc(r['nombre'])} · Santiago Ways</name>
    <desc>{esc(r['nombre'])}: {km_es(t['km'])} km. Track simplificado para orientarse; sigue siempre la señalización en el terreno.</desc>
    <copyright author="colaboradores de OpenStreetMap"><license>https://opendatacommons.org/licenses/odbl/1-0/</license></copyright>
    <link href="https://santiagoways.com/es/mapa-camino-de-santiago/"><text>Mapa del Camino de Santiago · Santiago Ways</text></link>
  </metadata>
{wpts}
  <trk>
    <name>{esc(r['nombre'])}</name>
    <trkseg>
{puntos}
    </trkseg>
{ramales}  </trk>
</gpx>
"""


# ============================================================ todo

ARCHIVOS = {
    "frances": "camino-frances", "portugues": "camino-portugues", "costa": "camino-portugues-costa",
    "norte": "camino-norte", "primitivo": "camino-primitivo", "ingles": "camino-ingles",
    "plata": "via-de-la-plata", "fisterra": "camino-finisterre-muxia",
}


def main():
    global ANCHO, MOVIL, ESCALA
    trazados = json.loads((DATOS / "trazados.json").read_text(encoding="utf-8"))
    perfiles = json.loads((DATOS / "perfiles.json").read_text(encoding="utf-8"))
    base = json.loads((DATOS / "base.json").read_text(encoding="utf-8"))
    (SALIDA / "mapas").mkdir(parents=True, exist_ok=True)
    (SALIDA / "gpx").mkdir(parents=True, exist_ok=True)
    indice = {}

    for formato, (ancho, escala_) in FORMATOS.items():
        ANCHO, ESCALA, MOVIL = ancho, escala_, formato == "movil"
        sufijo = "-movil" if MOVIL else ""
        medida = lambda alto: (round(ANCHO * ESCALA), round(alto * ESCALA))  # noqa: E731

        svg, alto, titulo, desc = mapa_general(trazados, perfiles, base)
        nombre = f"mapa-caminos-de-santiago{sufijo}.svg"
        (SALIDA / "mapas" / nombre).write_text(svg, encoding="utf-8")
        g = indice.setdefault("general", {"titulo": titulo, "desc": desc})
        g[formato] = {"svg": nombre, "ancho": medida(alto)[0], "alto": medida(alto)[1]}
        print(f"· {formato} · general · {len(svg) / 1024:.0f} KB")

        for clave in RUTAS:
            if clave not in trazados:
                print("· falta", clave)
                continue
            base_nombre = ARCHIVOS[clave]
            svg, alto, titulo, desc = mapa_ruta(clave, trazados, perfiles, base)
            (SALIDA / "mapas" / f"mapa-{base_nombre}{sufijo}.svg").write_text(svg, encoding="utf-8")
            svg2, alto2, titulo2, desc2 = perfil_ruta(clave, perfiles)
            (SALIDA / "mapas" / f"perfil-{base_nombre}{sufijo}.svg").write_text(svg2, encoding="utf-8")
            p = perfiles[clave]
            e = indice.setdefault(clave, {
                "nombre": RUTAS[clave]["nombre"], "titulo": titulo, "desc": desc,
                "titulo_perfil": titulo2, "desc_perfil": desc2, "gpx": f"{base_nombre}.gpx",
                "km": trazados[clave]["km"], "subida": p["subida"], "max": p["max"], "min": p["min"],
                "origen": RUTAS[clave]["paso"][0],
            })
            e[formato] = {
                "mapa": {"svg": f"mapa-{base_nombre}{sufijo}.svg", "ancho": medida(alto)[0], "alto": medida(alto)[1]},
                "perfil": {"svg": f"perfil-{base_nombre}{sufijo}.svg", "ancho": medida(alto2)[0],
                           "alto": medida(alto2)[1]},
            }
            if not MOVIL:
                (SALIDA / "gpx" / f"{base_nombre}.gpx").write_text(gpx(clave, trazados, perfiles), encoding="utf-8")
            print(f"· {formato} · {clave} · mapa {len(svg) / 1024:.0f} KB · perfil {len(svg2) / 1024:.0f} KB")
    (SALIDA / "mapas" / "indice.json").write_text(json.dumps(indice, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
