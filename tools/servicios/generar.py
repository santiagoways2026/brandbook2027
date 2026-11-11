# -*- coding: utf-8 -*-
"""Tablas de servicios por etapa, como imagen, con la marca del Brandbook 2027.

    python tools/servicios/generar.py                      # todas
    python tools/servicios/generar.py norte-san-sebastian-zarautz

Lee etapas.json y escribe en salidas/servicios/<etapa>/:
    servicios-<etapa>.svg / .webp              escritorio: pueblos en filas, servicios en columnas
    servicios-<etapa>-movil.svg / .webp        móvil: la tabla girada, servicios en filas

Los WebP van a doble resolución: son los que se suben a WordPress, que no admite SVG.
Iconos: Lucide (ISC), en iconos/. Fuente: Montserrat incrustada, como en los mapas.
"""
import json
import pathlib
import re
import subprocess
import sys

from PIL import Image

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
sys.path.insert(0, str(AQUI.parent / "mapas"))
import generar as G  # noqa: E402  (Textos, concha y colores de los mapas)

SERVICIOS = ["heart-pulse", "coffee", "briefcase-medical", "credit-card", "utensils", "shopping-cart", "signpost"]
ROTULOS = {
    "en": {"titulo_col": "Towns", "servicios_col": "Services",
           "servicios": ["Healthcare", "Cafeteria", "Pharmacy", "ATM", "Restaurant", "Supermarket",
                         "Tourist information"],
           "si": "Service available", "no": "No service"},
    "es": {"titulo_col": "Pueblos", "servicios_col": "Servicios",
           "servicios": ["Centro de salud", "Cafetería", "Farmacia", "Cajero", "Restaurante", "Supermercado",
                         "Oficina de turismo"],
           "si": "Hay servicio", "no": "Sin servicio"},
}
BROTE = "#FAFFEE"


def icono(nombre, cx, cy, tam, color, grosor=2):
    """Icono de Lucide (24 × 24, de trazo) centrado en cx, cy con el tamaño pedido."""
    txt = (AQUI / "iconos" / f"{nombre}.svg").read_text()
    cuerpo = re.search(r">\s*(<(?:path|circle|rect|line|polyline|polygon|ellipse)[\s\S]*)</svg>", txt).group(1)
    s = tam / 24
    return (f'<g transform="translate({cx - tam / 2:.1f} {cy - tam / 2:.1f}) scale({s:.4f})" fill="none" '
            f'stroke="{color}" stroke-width="{grosor}" stroke-linecap="round" stroke-linejoin="round">'
            f'{cuerpo.strip()}</g>')


def marca(cx, cy, hay, r):
    if hay:
        return (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="{G.VERDE}"/>'
                + icono("check", cx, cy, r * 1.15, G.BLANCO, 3.2))
    return (f'<path d="M{cx - r * .45:.1f},{cy:.1f}H{cx + r * .45:.1f}" stroke="{G.GRIS}" stroke-opacity=".45" '
            f'stroke-width="3" stroke-linecap="round"/>')


def partir(texto, ancho, tam, peso=700):
    """Parte un rótulo en líneas que quepan en ancho."""
    lineas, actual = [], ""
    for palabra in texto.split():
        prueba = (actual + " " + palabra).strip()
        if actual and G.ancho_texto(prueba, tam, peso) > ancho:
            lineas.append(actual)
            actual = palabra
        else:
            actual = prueba
    return lineas + [actual]


def texto_lineas(T, x, y, lineas, tam, peso, color, anchor="middle", interlineado=1.2):
    out = []
    for i, l in enumerate(lineas):
        T.usar(l, peso)
        out.append(f'<text x="{x:.1f}" y="{y + i * tam * interlineado:.1f}" text-anchor="{anchor}" '
                   f'font-size="{tam}" font-weight="{peso}" fill="{color}">{G.esc(l)}</text>')
    return "".join(out)


def leyenda(T, x, y, r, rot, tam=14):
    T.usar(rot["si"], 500)
    T.usar(rot["no"], 500)
    w_si = G.ancho_texto(rot["si"], tam, 500)
    base = y + tam * 0.36
    return (marca(x, y, True, r) + f'<text x="{x + r + 10}" y="{base:.1f}" font-size="{tam}" font-weight="500" '
            f'fill="{G.GRIS}">{G.esc(rot["si"])}</text>'
            + marca(x + r + 10 + w_si + 34, y, False, r)
            + f'<text x="{x + r + 10 + w_si + 34 + r + 4}" y="{base:.1f}" font-size="{tam}" font-weight="500" '
            f'fill="{G.GRIS}">{G.esc(rot["no"])}</text>')


def envolver(ancho, alto, titulo, desc, cuerpo, T):
    G.ESCALA = 1.0
    return G.envolver(ancho, alto, titulo, desc, cuerpo, T)


def escritorio(datos, rot):
    T = G.Textos()
    W = 1200
    c0 = 260
    cw = (W - c0) / 7
    cab = 172
    fila = 84
    n = len(datos["pueblos"])
    alto_tabla = cab + n * fila
    H = alto_tabla + 64
    p = [f'<rect width="{W}" height="{H}" fill="{G.BLANCO}"/>',
         f'<clipPath id="redondo"><rect width="{W}" height="{alto_tabla}" rx="12"/></clipPath>',
         '<g clip-path="url(#redondo)">',
         f'<rect width="{W}" height="{cab}" fill="{G.SENDERO}"/>']
    for i in range(n):
        p.append(f'<rect y="{cab + i * fila}" width="{W}" height="{fila}" fill="{BROTE if i % 2 else G.BLANCO}"/>')
    p.append('</g>')
    # cabecera
    concha, _ = G.concha_svg(c0 / 2 - 26, 40, 52, G.BLANCO)
    p.append(concha)
    p.append(texto_lineas(T, c0 / 2, 134, [rot["titulo_col"]], 19, 800, G.BLANCO))
    for j, (ic, nombre) in enumerate(zip(SERVICIOS, rot["servicios"])):
        cx = c0 + cw * (j + .5)
        p.append(icono(ic, cx, 66, 54, G.BLANCO, 1.8))
        lineas = partir(nombre, cw - 16, 17)
        p.append(texto_lineas(T, cx, 126 if len(lineas) > 1 else 134, lineas, 17, 700, G.BLANCO))
    # rejilla
    for j in range(7):
        x = c0 + cw * j
        p.append(f'<path d="M{x:.1f},{cab}V{alto_tabla}" stroke="{G.NIEBLA}" stroke-width="1"/>')
        p.append(f'<path d="M{x:.1f},18V{cab - 18}" stroke="{G.BLANCO}" stroke-opacity=".25" stroke-width="1"/>')
    for i in range(1, n):
        p.append(f'<path d="M0,{cab + i * fila}H{W}" stroke="{G.NIEBLA}" stroke-width="1"/>')
    p.append(f'<rect x=".5" y=".5" width="{W - 1}" height="{alto_tabla - 1}" rx="12" fill="none" '
             f'stroke="{G.NIEBLA}" stroke-width="1"/>')
    # filas
    for i, (pueblo, servicios) in enumerate(datos["pueblos"]):
        cy = cab + i * fila + fila / 2
        p.append(texto_lineas(T, 32, cy + 8, [pueblo], 22, 700, G.GRAFITO, "start"))
        for j, hay in enumerate(servicios):
            p.append(marca(c0 + cw * (j + .5), cy, hay, 22))
    p.append(leyenda(T, 30, alto_tabla + 34, 13, rot))
    return W, H, "".join(x for x in p if x), T


def movil(datos, rot):
    T = G.Textos()
    W = 640
    c0 = 236
    pueblos = datos["pueblos"]
    cw = (W - c0) / len(pueblos)
    cab = 124
    fila = 80
    alto_tabla = cab + 7 * fila
    H = alto_tabla + 60
    p = [f'<rect width="{W}" height="{H}" fill="{G.BLANCO}"/>',
         f'<clipPath id="redondo"><rect width="{W}" height="{alto_tabla}" rx="12"/></clipPath>',
         '<g clip-path="url(#redondo)">',
         f'<rect width="{W}" height="{cab}" fill="{G.SENDERO}"/>']
    for i in range(7):
        p.append(f'<rect y="{cab + i * fila}" width="{W}" height="{fila}" fill="{BROTE if i % 2 else G.BLANCO}"/>')
    p.append('</g>')
    concha, _ = G.concha_svg(28, cab / 2 - 17, 42, G.BLANCO)
    p.append(concha)
    p.append(texto_lineas(T, 84, cab / 2 + 7, [rot["servicios_col"]], 19, 800, G.BLANCO, "start"))
    for j, (pueblo, _) in enumerate(pueblos):
        cx = c0 + cw * (j + .5)
        lineas = partir(pueblo, cw - 10, 18)
        y0 = cab / 2 + 6 - (len(lineas) - 1) * 11
        p.append(texto_lineas(T, cx, y0, lineas, 18, 700, G.BLANCO))
        if j:
            p.append(f'<path d="M{c0 + cw * j:.1f},16V{cab - 16}" stroke="{G.BLANCO}" stroke-opacity=".25"/>')
    for j in range(len(pueblos)):
        x = c0 + cw * j
        p.append(f'<path d="M{x:.1f},{cab}V{alto_tabla}" stroke="{G.NIEBLA}" stroke-width="1"/>')
    for i in range(1, 7):
        p.append(f'<path d="M0,{cab + i * fila}H{W}" stroke="{G.NIEBLA}" stroke-width="1"/>')
    p.append(f'<rect x=".5" y=".5" width="{W - 1}" height="{alto_tabla - 1}" rx="12" fill="none" '
             f'stroke="{G.NIEBLA}" stroke-width="1"/>')
    for i, (ic, nombre) in enumerate(zip(SERVICIOS, rot["servicios"])):
        cy = cab + i * fila + fila / 2
        p.append(icono(ic, 46, cy, 38, G.SENDERO, 2))
        lineas = partir(nombre, c0 - 88, 20)
        p.append(texto_lineas(T, 78, cy + 7 - (len(lineas) - 1) * 12, lineas, 20, 700, G.GRAFITO, "start"))
        for j, (_, servicios) in enumerate(pueblos):
            p.append(marca(c0 + cw * (j + .5), cy, servicios[i], 21))
    p.append(leyenda(T, 28, alto_tabla + 32, 14, rot, 18))
    return W, H, "".join(p), T


def descripcion(datos, rot):
    # en minúscula dentro de la frase, salvo las siglas (ATM)
    servicios = [s if s.isupper() else s.lower() for s in rot["servicios"]]
    if datos["idioma"] == "en":
        titulo = f"Services on the {datos['etapa']} stage of the {datos['ruta']}"
        partes = []
        for pueblo, hay in datos["pueblos"]:
            si = [s for s, h in zip(servicios, hay) if h]
            if not si:
                partes.append(f"{pueblo} has no services")
            elif len(si) == len(servicios):
                partes.append(f"{pueblo} has all seven services")
            else:
                partes.append(f"{pueblo} has {', '.join(si[:-1])} and {si[-1]}")
        desc = f"{titulo}. " + "; ".join(partes) + "."
    else:
        titulo = f"Servicios en la etapa {datos['etapa']} del {datos['ruta']}"
        partes = []
        for pueblo, hay in datos["pueblos"]:
            si = [s for s, h in zip(servicios, hay) if h]
            if not si:
                partes.append(f"{pueblo} no tiene servicios")
            elif len(si) == len(servicios):
                partes.append(f"{pueblo} tiene los siete servicios")
            else:
                partes.append(f"{pueblo} tiene {', '.join(si[:-1])} y {si[-1]}")
        desc = f"{titulo}. " + "; ".join(partes) + "."
    return titulo, desc


def main(solo):
    etapas = json.loads((AQUI / "etapas.json").read_text(encoding="utf-8"))
    for clave, datos in etapas.items():
        if solo and clave not in solo:
            continue
        rot = ROTULOS[datos["idioma"]]
        titulo, desc = descripcion(datos, rot)
        destino = RAIZ / "salidas" / "servicios" / clave
        destino.mkdir(parents=True, exist_ok=True)
        svgs = []
        for sufijo, fn in (("", escritorio), ("-movil", movil)):
            W, H, cuerpo, T = fn(datos, rot)
            ruta = destino / f"servicios-{clave}{sufijo}.svg"
            ruta.write_text(envolver(W, H, titulo, desc, cuerpo, T), encoding="utf-8")
            svgs.append(ruta)
        subprocess.run(["node", str(AQUI.parent / "mapas" / "raster.mjs"), *map(str, svgs)], check=True)
        for svg in svgs:
            png = svg.with_suffix(".png")
            Image.open(png).convert("RGB").save(svg.with_suffix(".webp"), "WEBP", quality=88, method=6)
            png.unlink()
            print(f"   {svg.with_suffix('.webp').name}: {svg.with_suffix('.webp').stat().st_size // 1024} KB")
        (destino / "alt.txt").write_text(desc + "\n", encoding="utf-8")
        print(f"· {clave}\n  alt: {desc}")


if __name__ == "__main__":
    main(set(sys.argv[1:]))
