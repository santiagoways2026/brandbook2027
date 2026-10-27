#!/usr/bin/env python3
"""Genera rrss.html (edificio RRSS · Santiago Ways) a partir de index.html (Salas del Camino). Mismo código; solo cambia la meta edificio y el título."""
import pathlib
src=pathlib.Path(__file__).with_name('index.html').read_text(encoding='utf-8')
out=src.replace('<title>Salas del Camino</title>','<title>RRSS · Santiago Ways</title>\n<meta name="edificio" content="rrss">',1)
assert out!=src
pathlib.Path(__file__).with_name('rrss.html').write_text(out,encoding='utf-8')
print('rrss.html',len(out))
