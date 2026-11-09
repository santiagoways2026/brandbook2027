# tools/mapas · mapas del Camino en SVG

Genera los mapas, los perfiles de altitud y los tracks GPX de
[/es/mapa-camino-de-santiago/](https://santiagoways.com/es/mapa-camino-de-santiago/), con los
colores, la tipografía y la concha del Brandbook 2027.

## Uso

```bash
pip install fonttools brotli
```

```bash
python tools/mapas/descargar.py
```

```bash
python tools/mapas/generar.py
```

```bash
python tools/mapas/articulo.py
```

```bash
node tools/mapas/og.mjs
```

`descargar.py` solo hace falta si cambian las rutas o se quieren datos frescos de OpenStreetMap.
Lo procesado ya está en `datos/`, así que `generar.py` funciona sin red. Las fuentes de
Montserrat se bajan a `.cache/fuentes/` desde Fontsource (`@fontsource/montserrat`, pesos 500,
700 y 800, subconjunto latin).

## Qué hace cada pieza

| Archivo | Qué hace |
|---|---|
| `rutas.py` | Las ocho rutas: relaciones de OSM, puntos de paso, pueblos que se marcan y correcciones a mano |
| `descargar.py` | Baja los trazados, elige el camino más corto que pasa por los puntos de paso, mide la altitud cada 200 m y prepara la base cartográfica |
| `generar.py` | Dibuja los SVG (versión web y versión móvil), los perfiles y los GPX |
| `articulo.py` | Monta el artículo con los bloques `mapa`, `stats`, `tabla-responsive` y `cta-box` |
| `og.mjs` | La imagen de 1200 × 630 para redes |
| `concha.svg` | El isotipo, vectorizado desde el PDF del brandbook |
| `datos/` | Lo procesado: trazados, perfiles, lugares y base. Se sube al repositorio |
| `.cache/` | Lo descargado en bruto. No se sube |

## Fuentes y licencias

| Dato | Fuente | Licencia y atribución |
|---|---|---|
| Trazados y pueblos | OpenStreetMap, relaciones de las rutas señalizadas | ODbL. «© colaboradores de OpenStreetMap» en cada mapa y en los GPX |
| Altitud | OpenTopoData, modelo EU-DEM 25 m | Uso libre con atribución a Copernicus |
| Costa, fronteras y provincias | Eurostat GISCO 1:1 millón | «© EuroGeographics» en cada mapa |
| Ríos | Natural Earth 1:10 millones | Dominio público |
| Tipografía | Montserrat | SIL Open Font License |

Las atribuciones ya van dentro de cada SVG. No se pueden quitar.

## Decisiones que conviene conocer

- **El trazado no se dibuja a mano.** Se calcula como el camino más corto sobre las vías de la
  ruta que pasa por los puntos de `paso`. Así se descartan variantes sin editar datos. Si una
  ruta sale rara, el arreglo está en `paso`, no en el SVG.
- **Los pueblos se colocan sobre el trazado.** Nominatim devuelve a veces el centro del
  municipio o una aldea homónima. Se elige el candidato más cercano a la ruta y los que fallan
  van fijados en `MANUAL`, dentro de `rutas.py`. Sobrado dos Monxes caía junto a Arzúa y metía
  20 km de rodeo en el Camino del Norte.
- **El techo de cada perfil es el dato sin suavizar.** El perfil se suaviza 600 m para quitar el
  ruido del modelo. Los desniveles acumulados son aproximados y en el texto se redondean a la
  centena.
- **Dos versiones de cada SVG.** La web se compone a 1200 px. La móvil se compone en un lienzo de
  487 unidades y se declara a 560 px, sin leyenda ni localizador. Así, en un teléfono la letra se
  lee a 11-12 px en vez de a 5.
- **La animación va dentro del SVG.** Es CSS: el trazo se dibuja en 3,2 s y los pueblos aparecen
  cuando la línea pasa por ellos. Arranca cuando el navegador carga la imagen, y con
  `loading="lazy"` eso pasa al acercarse a ella. Sin animación, el SVG se ve completo.
- **Números con la ortografía de la RAE.** Sin separador hasta 9999 y con espacio fino a partir
  de 10 000.
