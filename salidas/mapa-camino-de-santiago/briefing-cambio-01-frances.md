# Cambio 1 · primer mapa del Camino Francés

Sustituye **solo** la imagen `mapa-camino-santiago-frances.jpg` de la página en español
https://santiagoways.com/es/mapa-camino-de-santiago/ por el mapa nuevo en SVG. No se toca nada
más: ni texto, ni titulares, ni SEO, ni las otras imágenes, ni las otras lenguas.

## Antes de lanzar el prompt (lo haces tú, 2 minutos)

1. En WordPress, ve a **Medios › Añadir nuevo** y sube estos dos archivos, sin cambiarles el
   nombre:
   - `mapa-camino-frances.svg`
   - `mapa-camino-frances-movil.svg`
2. Abre cada uno desde la biblioteca y copia su URL. Si es
   `https://santiagoways.com/wp-content/uploads/2026/11/mapa-camino-frances.svg` y la de móvil
   igual con `-movil`, el prompt sirve tal cual. Si WordPress les cambió el nombre o la carpeta,
   sustituye las URL dentro del prompt.
3. Abre en el navegador la URL del SVG grande. Debe verse el mapa con letra Montserrat y el trazo
   animándose. Si sale sin letra o sin animación, el plugin de SVG lo ha «limpiado»: avísame
   antes de seguir.
4. Abre el editor del post en español y lanza la extensión con el prompt de abajo.

## Prompt para la extensión de Claude

```text
Estás en el panel de WordPress de santiagoways.com, editando el post en ESPAÑOL
«Mapa de las rutas del Camino de Santiago: guía oficial para elegir itinerario»
(URL pública: https://santiagoways.com/es/mapa-camino-de-santiago/).

OBJETIVO
Sustituir UNA sola imagen por un mapa nuevo. Nada más.

LA IMAGEN QUE HAY QUE CAMBIAR
- Está justo debajo del H2 «Mapa del Camino de Santiago Francés», después de sus tres párrafos.
- Su src es https://santiagoways.com/wp-content/uploads/2019/08/mapa-camino-santiago-frances.jpg
  (600 × 400, alt «Mapa-camino-santiago-frances»).
- NO la confundas con la siguiente, «mapa-recorrido-camino-santiago-frances.jpg», que va bajo el
  H3 «Recorrido de la Ruta Francesa». Esa no se toca.

ANTES DE TOCAR NADA, APUNTA Y GUÁRDAME ESTOS VALORES (para comprobar al final que no cambian):
- Título del post, slug y fecha de publicación.
- En el panel de Yoast SEO: título SEO, meta descripción, frase clave, URL canónica, imagen y
  textos de redes sociales, y la pestaña de schema.
- Imagen destacada.
- Número total de imágenes del contenido (deben ser las mismas antes y después).

PASO 1 · CSS DEL MAPA (una sola vez para todo el sitio)
Ve a Apariencia › Personalizar › CSS adicional. Si ya existe una regla «.mapa {», no hagas nada.
Si no existe, añade AL FINAL, sin borrar nada de lo que haya, este bloque:

/* Bloque mapa · Santiago Ways (mapas SVG del Camino) */
.mapa{margin:32px 0}
.mapa__media{display:block;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(46,46,45,.12)}
.mapa__media picture{display:block}
.mapa__img{display:block;width:100%;height:auto}
.mapa--vertical .mapa__media{max-width:640px;margin:0 auto}
.mapa__caption{display:flex;flex-direction:column;gap:4px;margin-top:14px;font-size:14px;line-height:1.5;color:#6F6F6E}
.mapa__title{font-size:15px;font-weight:700;color:#2E2E2D}
.mapa__text{max-width:68ch}
.mapa__links{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:6px}
.mapa__link{font-size:14px;font-weight:700;color:#506718;text-decoration:none}
.mapa__link::after{content:" →"}
.mapa__link:hover{text-decoration:underline}

Pulsa «Publicar» en el personalizador.

PASO 2 · SUSTITUIR LA IMAGEN
En el editor del post en español:
- Si es el editor de bloques: selecciona SOLO el bloque de imagen de mapa-camino-santiago-frances.jpg,
  y con «Transformar» o «Reemplazar» cámbialo por un bloque «HTML personalizado» en la misma
  posición. Si la imagen está dentro de un bloque de texto o de HTML junto a otros elementos,
  edita como HTML y cambia solo la etiqueta <img> (y su <a> o <figure> si la envuelven).
- Si es el editor clásico: pestaña «Texto», localiza la etiqueta de esa imagen y sustituye solo
  esa etiqueta (con su <a> o [caption] si los tiene).
Pega exactamente este HTML, sin añadir estilos, clases ni atributos:

<figure class="mapa">
<a class="mapa__media" href="https://santiagoways.com/wp-content/uploads/2026/11/mapa-camino-frances.svg"><picture><source media="(max-width: 760px)" srcset="https://santiagoways.com/wp-content/uploads/2026/11/mapa-camino-frances-movil.svg" width="560" height="598" /><img class="mapa__img" src="https://santiagoways.com/wp-content/uploads/2026/11/mapa-camino-frances.svg" alt="Mapa del Camino Francés de Saint-Jean-Pied-de-Port a Santiago de Compostela, por Pamplona, Logroño, Burgos, León, Ponferrada, O Cebreiro y Sarria" width="1200" height="660" loading="lazy" decoding="async" /></picture></a>
<figcaption class="mapa__caption">
<span class="mapa__links"><a class="mapa__link" href="https://santiagoways.com/wp-content/uploads/2026/11/mapa-camino-frances.svg">Ver el mapa a pantalla completa</a></span>
</figcaption>
</figure>

Antes de pegar, comprueba en Medios que las dos URL existen tal cual
(mapa-camino-frances.svg y mapa-camino-frances-movil.svg). Si alguna es distinta, usa la real.

PASO 3 · GUARDAR
- Pulsa «Actualizar». No cambies la fecha de publicación ni el estado.
- Si aparece WPML preguntando por traducciones o sincronización, NO sincronices ni dupliques: este
  cambio es solo para la versión en español.
- Si hay plugin de caché (WP Rocket, LiteSpeed, W3TC, Cloudflare…), purga la caché SOLO de esta URL.

LO QUE NO SE TOCA BAJO NINGÚN CONCEPTO
- Ningún otro bloque, párrafo, titular, enlace ni imagen del post.
- Los campos de Yoast SEO, el slug, la categoría, las etiquetas y la imagen destacada.
- Las versiones en inglés, alemán, italiano y portugués.
- El archivo antiguo mapa-camino-santiago-frances.jpg: NO lo borres de Medios (Google lo tiene
  indexado y debe seguir respondiendo).
- No instales ni actives plugins. Si algo exige hacerlo, para y avísame.

PASO 4 · COMPROBAR Y CONTARME
Abre https://santiagoways.com/es/mapa-camino-de-santiago/ en una ventana nueva y comprueba:
1. Bajo el H2 «Mapa del Camino de Santiago Francés» se ve el mapa nuevo, con esquinas redondeadas
   y sombra suave, a todo el ancho de la columna, y debajo el enlace «Ver el mapa a pantalla
   completa →».
2. Al llegar a él con el scroll, el trazo verde se dibuja de Saint-Jean-Pied-de-Port a Santiago.
3. En vista móvil (o con la ventana estrecha, menos de 760 px) carga la versión
   mapa-camino-frances-movil.svg, con la letra grande y legible.
4. La imagen del recorrido de la Ruta Francesa y todas las demás siguen igual.
5. En el código fuente de la página, el <title>, la meta description, el canonical, las etiquetas
   og: y el JSON-LD de Yoast son idénticos a los que apuntaste al principio.
6. La versión en inglés de la página no ha cambiado.

Cuando termines, dame: los valores SEO de antes y de después, las dos URL finales de los SVG,
una captura de escritorio y otra de móvil del mapa, y cualquier aviso que hayas visto.
```

## Por qué así

- **Solo cambia la imagen.** El HTML nuevo ocupa el mismo sitio que el `<img>` antiguo; los
  titulares, el texto y Yoast no se tocan, así que el SEO de la página se conserva entero.
- **Mejora el SEO de esa imagen.** El `alt` pasa de «Mapa-camino-santiago-frances» a una
  descripción real con los pueblos, y la imagen se ve nítida a cualquier tamaño.
- **El JPG antiguo se queda en Medios.** Su URL sigue respondiendo y no se pierde lo que ya
  posicionaba en Google Imágenes. Cuando estén todos los mapas, se redirige con un 301.
- **El CSS va en «CSS adicional»** porque `mapa.css` no puede ir dentro del post. Solo afecta a
  elementos con clase `mapa…`, así que no cambia nada más de la web.
- **Sin título ni texto en el pie**, a propósito: pediste cambiar solo la imagen. Si más
  adelante quieres un pie con el nombre del mapa, se añade con el módulo sin tocar lo demás.
