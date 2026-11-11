# Tabla de servicios · Camino del Norte, San Sebastián a Zarautz

Sustituye la imagen de la tabla de servicios de la página en inglés de esta etapa. Mismos datos
que la antigua, con iconos y marcas mucho más grandes, y una versión girada para móvil.

| Archivo | Para qué |
|---|---|
| `servicios-norte-san-sebastian-zarautz.webp` | Escritorio, 2400 × 1144 (se muestra a 1200 × 572) |
| `servicios-norte-san-sebastian-zarautz-movil.webp` | Móvil, 1280 × 1488 (se muestra a 640 × 744) |
| `cambio.html` | El HTML que sustituye a la imagen antigua |
| `alt.txt` | El texto alternativo, con todos los datos de la tabla |

## Cómo cambiarla

1. Sube los dos WebP en Medios › Añadir nuevo, sin cambiarles el nombre.
2. Si sus URL no quedan en `https://santiagoways.com/wp-content/uploads/2026/11/`, cámbialas en `cambio.html`.
3. En el editor de la página en inglés, sustituye solo el bloque de la imagen antigua de la tabla
   por un bloque «HTML personalizado» con el contenido de `cambio.html`.
4. No toques el H2 «Services on the San Sebastián to Zarautz stage», su entradilla ni Yoast.
   No borres la imagen antigua de Medios.

Si se prefiere no usar HTML, basta con «Reemplazar» la imagen del bloque por la versión de
escritorio y pegar el texto de `alt.txt` como texto alternativo. Se pierde la versión móvil.

Se regenera con `python tools/servicios/generar.py` a partir de `tools/servicios/etapas.json`.
