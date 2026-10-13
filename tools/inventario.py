# -*- coding: utf-8 -*-
"""Genera design-system/inventario.md leyendo las hojas de design-system/.

El inventario es la lista cerrada de clases disponibles. Se regenera con:
    python tools/inventario.py
Cada vez que cambie bloques.css hay que volver a lanzarlo.
"""
import re
import pathlib
import collections

RAIZ = pathlib.Path(__file__).resolve().parent.parent
HOJAS = [
    RAIZ / "design-system" / "bloques.css",
    RAIZ / "design-system" / "tabla-responsive.css",
]
SALIDA = RAIZ / "design-system" / "inventario.md"

# Nombre humano de cada raíz, tomado de los comentarios numerados del CSS.
NOMBRES = {
    "cta-box":      "Bloque comercial · caja con titular, texto y botón",
    "steps":        "Pasos verticales numerados con línea de unión",
    "stats":        "Cajas de cifras (km, etapas, días)",
    "roadmap":      "Recorrido de etapas · puntos en línea, vertical en móvil",
    "cards":        "Rejilla de tarjetas con icono",
    "timeline":     "Línea de tiempo · doble marcado, horizontal y vertical",
    "note":         "Nota lateral discreta · contenido libre dentro",
    "quote":        "Cita destacada centrada con autor",
    "guides":       "Guías descargables · tarjetas con botón",
    "features":     "Rejilla de características con icono en imagen",
    "checklist":    "Caja de listas de comprobación",
    "heroblogsw":   "Hero de artículo con imagen de fondo y overlay",
    "roads":        "Tarjetas de rutas con imagen, banderola y etiquetas",
    "finder":       "Selector de preguntas con enlaces",
    "durations":    "Comparativa de duraciones con barras de progreso",
    "prep":         "Preparación física · imagen + lista numerada",
    "gear":         "Equipamiento · rejilla de fichas con imagen y enlaces",
    "tips":         "Consejos numerados a tres columnas",
    "safety":       "Seguridad · bloques con etiqueta y teléfono de emergencia",
    "mistakes":     "Errores frecuentes · error a la izquierda, alternativa a la derecha",
    "arrival":      "Llegada · dos fichas con imagen a media anchura",
    "gr-ficha":     "Ficha de datos · imagen + pares etiqueta/valor",
    "gr-planner":   "Promo del planificador · columna oscura con checklist",
    "tabla-responsive": "Tabla de datos · en móvil cada fila es una tarjeta",
}

# Raíces que conviven en el mismo apartado del CSS.
PAREJAS = {"note": "quote", "prep": "gear"}

# Variables CSS que un bloque expone para que se le cambie el tema.
VARIABLES = {
    "tabla-responsive": [
        ("--tabla-acento-1", "verde claro, inicio del degradado · #7AA606"),
        ("--tabla-acento-2", "verde oscuro, fin del degradado y color de las etiquetas · #668814"),
        ("--tabla-texto", "color del texto de las celdas · #111111"),
        ("--tabla-borde", "líneas y bordes · #e5e7eb"),
        ("--tabla-cebra", "fondo de las filas pares · #fafaf9"),
        ("--tabla-radio", "radio de las esquinas · 16px"),
    ],
}

# Clases cuyo nombre no empieza por su raíz y hay que reagrupar a mano.
ALIAS = {"tabla-responsive-wrap": "tabla-responsive"}


def raiz_de(clase):
    base = re.split(r"__|--", clase, maxsplit=1)[0]
    return ALIAS.get(base, base)


def main():
    css = chr(10).join(h.read_text(encoding="utf-8") for h in HOJAS)
    # Solo selectores de clase, ignorando el interior de los valores.
    css_sin_valores = re.sub(r":[^;{}]*;", ";", css)
    clases = sorted(set(re.findall(r"\.([A-Za-z][A-Za-z0-9_-]*)", css_sin_valores)))

    por_raiz = collections.defaultdict(list)
    for clase in clases:
        por_raiz[raiz_de(clase)].append(clase)

    lineas = [
        "# Inventario de clases",
        "",
        "**Generado automáticamente.** No editar a mano: se regenera con `python tools/inventario.py`",
        "a partir de " + " y ".join(f"[`{h.name}`]({h.name})" for h in HOJAS) + ".",
        "",
        "Esta es la **lista cerrada**: cualquier clase que no aparezca aquí no existe y no se puede usar.",
        "",
        f"{len(por_raiz)} bloques · {len(clases)} clases.",
        "",
        "| Bloque | Clases | Modificadores |",
        "|---|---:|---|",
    ]

    for raiz in sorted(por_raiz):
        mods = [c for c in por_raiz[raiz] if "--" in c]
        mods_txt = ", ".join("`" + m + "`" for m in mods) if mods else "—"
        lineas.append(f"| `{raiz}` | {len(por_raiz[raiz])} | {mods_txt} |")

    lineas += ["", "---", ""]

    for raiz in sorted(por_raiz):
        lineas.append(f"## `.{raiz}`")
        lineas.append("")
        lineas.append(NOMBRES.get(raiz, "_Sin descripción. Añadir en tools/inventario.py._"))
        if raiz in PAREJAS:
            lineas.append("")
            lineas.append(f"Comparte apartado del CSS con `.{PAREJAS[raiz]}`.")
        lineas.append("")
        for clase in por_raiz[raiz]:
            marca = " · **modificador**" if "--" in clase else ""
            lineas.append(f"- `.{clase}`{marca}")
        if raiz in VARIABLES:
            lineas.append("")
            lineas.append("Variables de tema, redefinibles en el propio elemento:")
            for var, nota in VARIABLES[raiz]:
                lineas.append(f"- `{var}` · {nota}")
        lineas.append("")

    SALIDA.write_text("\n".join(lineas) + "\n", encoding="utf-8")
    print(f"{SALIDA.relative_to(RAIZ)}: {len(por_raiz)} bloques, {len(clases)} clases")


if __name__ == "__main__":
    main()
