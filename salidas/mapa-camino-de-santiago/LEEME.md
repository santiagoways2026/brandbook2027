# Mapas nuevos de /es/mapa-camino-de-santiago/

Sustituyen los 16 JPG de 2019 por 17 mapas y perfiles en SVG, cada uno con versión para móvil,
8 tracks GPX y el artículo reescrito para aprovecharlos en SEO.

## Qué hay en esta carpeta

| Archivo | Para qué |
|---|---|
| `articulo.html` | El cuerpo del post. Se pega entero en un bloque «HTML personalizado» de WordPress |
| `schema.html` | El JSON-LD. Va en la cabecera o en el campo de schema del plugin de SEO, no en el post |
| `og-mapa-camino-de-santiago.jpg` | La imagen para redes y para la imagen destacada del post, a 1200 × 630 |
| `mapas/` | Los 50 SVG: 17 mapas y perfiles más 8 mapas satélite (`satelite-…`), cada uno con su versión `-movil` |
| `briefing-cambio-01-frances.md` | Prompt para la extensión de Claude en WordPress: cambia solo el primer mapa del Francés |
| `cambio-01-mapa-frances.html` | El HTML de ese cambio |
| `gpx/` | Los 8 tracks GPX |
| `vista-previa.html` | El artículo montado en local, para revisarlo antes de publicar |
| `animacion-camino-frances.gif` | Muestra de cómo se anima un mapa al cargar. No se publica |

## Los mapas antiguos, uno a uno

La página tenía 16 imágenes JPG de 2019, a 600 px de ancho y con el texto ilegible.

| Mapa antiguo | Qué era | Problema | Lo sustituye |
|---|---|---|---|
| `mapa-general-camino-santiago.jpg` | Europa y la península con unas veinte rutas | Rótulos de 6 px, todas las rutas iguales, sin jerarquía | Mapa general con las 8 rutas de la guía rotuladas |
| `mapa-camino-santiago-frances.jpg` | Situación del Francés en la península | Repite el mismo fondo que otros cuatro mapas | Mapa del Francés, con localizador y el resto de rutas en gris |
| `mapa-recorrido-camino-santiago-frances.jpg` | Recorrido del Francés | Tierra en verde y ruta en amarillo, colores fuera de la paleta. 251 px de alto | Mapa del Francés |
| `mapa-perfil-camino-santiago-frances.jpg` | Perfil del Francés | Se lee de derecha a izquierda; rótulos verticales ilegibles | Perfil del Francés |
| `mapa-camino-santiago-portugues-central.jpg` | Situación del Portugués | Mismo fondo repetido | Mapa del Portugués Central |
| `mapa-recorrido-camino-portugues-central.jpg` | Recorrido del Portugués | 229 × 400 px; tierra verde, ruta amarilla | Mapa del Portugués Central |
| `mapa-perfil-camino-portugues-central-1.jpg` | Perfil del Portugués | Al revés, de Santiago a Lisboa; ilegible | Perfil del Portugués Central |
| `mapa-camino-portugues-costa.jpg` | Situación de la Costa | Mismo fondo repetido | Mapa de la Costa |
| `mapa-recorrido-camino-portugues-costa.jpg` | Recorrido de la Costa | Tierra verde, ruta amarilla | Mapa de la Costa |
| `mapa-perfil-camino-portugues-costa.jpg` | Perfil de la Costa | Al revés, de Santiago a Oporto | Perfil de la Costa |
| `mapa-camino-santiago-norte.jpg` | Situación del Norte | Mismo fondo repetido | Mapa del Norte |
| `mapa-recorrido-camino-santiago-norte.jpg` | Recorrido del Norte | Tierra verde, ruta amarilla | Mapa del Norte |
| `mapa-perfil-camino-santiago-norte.jpg` | Perfil del Norte | Al revés y con el alt de otra ruta: «perfil camino santiago costa» | Perfil del Norte |
| `mapa-camino-santiago-primitivo.jpg` | Situación del Primitivo | Mismo fondo repetido | Mapa del Primitivo |
| `mapa-recorrido-camino-primitivo.jpg` | Recorrido del Primitivo | Tierra verde, ruta amarilla | Mapa del Primitivo |
| `mapa-perfil-camino-santiago-primitivo.jpg` | Perfil del Primitivo | Al revés; ilegible | Perfil del Primitivo |

Además, la Vía de la Plata, el Camino Inglés y el de Finisterre y Muxía no tenían mapa. Ahora
tienen mapa, perfil y GPX, porque también se buscan.

## Por qué SVG propio y no Google Maps

- **Velocidad.** Cada mapa incrustado de Google carga en torno a 1 MB de JavaScript. Con 17, la
  página sería lentísima y Google la penaliza por ello. Cada SVG pesa entre 40 y 150 KB, con
  fuente y animación incluidas, y se carga solo al acercarse a él.
- **Google Imágenes.** Un iframe no posiciona; un `<img>` con buen nombre de archivo y buen
  `alt` sí. La consulta «mapa camino de santiago» enseña imágenes arriba del todo.
- **Cookies.** El mapa de Google pone cookies y exige consentimiento. El SVG no.
- **Marca.** Mismo verde, misma letra y misma concha que el resto de la web.
- **Google Maps sigue disponible.** Cada ruta tiene su GPX y el artículo explica cómo abrirlo en
  Google My Maps.

## Para publicar

1. **Permitir SVG en WordPress.** WordPress los bloquea por defecto. Instala el plugin Safe SVG,
   que los sanea al subirlos, o súbelos por FTP a `wp-content/uploads/2026/11/`.
2. **Subir los archivos** de `mapas/`, de `gpx/` y la imagen `og-…jpg` a la biblioteca de medios.
   Si no se suben en noviembre de 2026, cambia `UPLOADS` en `tools/mapas/articulo.py` y lanza el
   script de nuevo: las URL llevan el año y el mes.
3. **Subir `design-system/mapa.css`** a la hoja del tema, junto a `bloques.css`. Sin ella los
   mapas salen sin tarjeta y los pies sin formato.
4. **Pegar `articulo.html`** en el post, sustituyendo todo el contenido actual.
5. **Pegar `schema.html`** en el campo de schema del plugin de SEO o en la cabecera de la
   página.
6. **Redirigir las imágenes antiguas.** Con el plugin Redirection, haz un 301 de cada JPG
   antiguo a su sustituto de la tabla de arriba. Así no se pierde lo que ya posicionaban en
   Google Imágenes.
7. **Pedir la indexación** de la URL en Search Console.

## SEO de la página

| Campo | Ahora | Propuesta |
|---|---|---|
| Título SEO | Mapa del Camino de Santiago: rutas, etapas y cuál elegir | Mapa del Camino de Santiago: todas las rutas, perfiles y GPX |
| H1 | Mapa de las rutas del Camino de Santiago: guía oficial para elegir itinerario | Mapa del Camino de Santiago: todas las rutas, perfiles y tracks GPX |
| Meta descripción | Descubre el mapa del Camino de Santiago con todas las rutas… | Mapas de las ocho rutas del Camino de Santiago, con perfil de altitud, distancias y track GPX para descargar. Compara y elige tu ruta. |
| Imagen para redes | JPG de 415 × 290 | `og-mapa-camino-de-santiago.jpg`, 1200 × 630 |

- El H1 actual dice «guía oficial» y no lo es. Es una promesa que el brandbook pide evitar.
- Las secciones del Norte y del Primitivo colgaban como H3 del Portugués. Ahora cada ruta es un
  H2 y la jerarquía es limpia.
- Los enlaces internos llevaban parámetros `utm_` del propio blog. Ensucian la analítica y
  crean URL duplicadas. Se han quitado.
- La tabla comparativa y las preguntas frecuentes están pensadas para fragmentos destacados y
  para «Otras preguntas de los usuarios».
- Los GPX descargables son un recurso que otras webs enlazan. Conviene moverlo en foros y
  grupos de peregrinos.

## Los vídeos de «VFX DE MARCA»

En Drive están las animaciones de cada ruta, en horizontal y en vertical. Pesan unos 40 MB cada
una y son privadas, así que no se han podido incluir aquí. Lo que mejor rinde con ellas:

- **YouTube.** Subir «TODOS LOS CAMINOS» como «Mapa animado del Camino de Santiago: todas las
  rutas», con enlace a esta página en la descripción. Las verticales, como Shorts.
- **Páginas de cada ruta.** El vídeo de su ruta, en las fichas de producto.
- **En esta página, como mucho uno**, el general, y con carga diferida. Google solo destaca el
  vídeo principal de una página, y varios vídeos pesados frenarían la carga.
