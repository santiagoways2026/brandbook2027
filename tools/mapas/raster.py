# -*- coding: utf-8 -*-
"""Versión WebP de los SVG, para subirlos a WordPress cuando no admite SVG.

    python tools/mapas/raster.py mapa-camino-frances mapa-camino-frances-movil

Recibe nombres de salidas/mapa-camino-de-santiago/mapas/ sin extensión (sin nada, todos).
Escribe <nombre>.webp a doble resolución, con el estado final de la animación.
"""
import pathlib
import subprocess
import sys

from PIL import Image

AQUI = pathlib.Path(__file__).resolve().parent
MAPAS = AQUI.parent.parent / "salidas" / "mapa-camino-de-santiago" / "mapas"

nombres = sys.argv[1:] or sorted(p.stem for p in MAPAS.glob("*.svg"))
svgs = [str(MAPAS / f"{n}.svg") for n in nombres]
subprocess.run(["node", str(AQUI / "raster.mjs"), *svgs], check=True)
for n in nombres:
    png = MAPAS / f"{n}.png"
    destino = MAPAS / f"{n}.webp"
    Image.open(png).convert("RGB").save(destino, "WEBP", quality=86, method=6)
    png.unlink()
    print(f"{destino.name}: {destino.stat().st_size // 1024} KB")
