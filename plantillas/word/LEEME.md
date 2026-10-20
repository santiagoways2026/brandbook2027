# Plantilla de Word

Formato único para los documentos de Word de Santiago Ways, según el Brandbook 2027. Estilo sobrio: blanco, texto en grafito y el verde solo como acento.

| Archivo | Para qué |
|---|---|
| `Plantilla_Santiago_Ways.dotx` | La plantilla para el día a día: portada y una página en blanco con cabecera y pie. Al abrirla con doble clic, Word crea un documento nuevo sin tocar la plantilla. |
| `Documento_en_blanco_Santiago_Ways.docx` | Lo mismo, como documento normal. |
| `Paginas_tipo_Santiago_Ways.docx` | Diecinueve páginas tipo con Lorem Ipsum para inspirarse, copiar la que haga falta o pasárselas a una IA. |
| `GUIA-IA.md` | Cómo pedir a una IA que monte un documento con la plantilla, con las instrucciones listas para copiar. |
| `vista-previa/` | Las diecinueve páginas renderizadas, para verlas sin abrir Word. |
| `generador/` | Scripts con los que se genera todo (ver abajo). |

## Páginas tipo

| | Página | Contenido |
|---|---|---|
| 1 | Portada tipográfica | Logo a color, filete verde, título y datos del documento al pie. |
| 2 | Portada con foto | Foto a sangre arriba y el título debajo. |
| 3 | Índice | Capítulos numerados con descripción y página. |
| 4 | Separador | Apertura de capítulo con número grande. |
| 5 | Resumen ejecutivo | Tres claves, recomendación, próximos pasos y caja de decisión. |
| 6 | Solo texto | Entradilla, secciones y cita destacada entre filetes. |
| 7 | Texto y tabla | Tabla de datos con leyenda y fuente, y caja de nota. |
| 8 | Infografía | Cifras clave, gráfico de barras y proceso en cuatro pasos. |
| 9 | Listas | «Incluido» / «No incluido», ideas numeradas y pasos. |
| 10 | Imágenes | Foto a ancho completo con pie y foto con texto al lado. |
| 11 | Itinerario | Datos de la ruta y tabla de etapas día a día. |
| 12 | Comparativa | Tres opciones frente a frente con la recomendada resaltada. |
| 13 | Plan de trabajo | Cronograma por meses e hitos. |
| 14 | Testimonios | Opiniones en dos columnas y una destacada. |
| 15 | Preguntas frecuentes | Preguntas y respuestas separadas por filetes. |
| 16 | Presupuesto | Datos del cliente, conceptos, total y condiciones. |
| 17 | Equipo y contactos | Personas, cargos, contacto y oficina. |
| 18 | Modelo de carta | Comunicación formal con membrete. |
| 19 | Contraportada | Logo a color, frase de cierre, datos de contacto y aviso legal. Hace pareja con la portada tipográfica. |

Las tablas, barras, cifras y el cronograma son tablas de Word: se editan escribiendo encima, y las barras se alargan arrastrando su borde. Las fotos son de ejemplo: sustitúyelas por las que apliquen en cada caso con clic derecho › *Cambiar imagen*.

## Instalar la plantilla (una sola vez)

- **Windows:** copia el `.dotx` en *Documentos › Plantillas personalizadas de Office*. Después: *Archivo › Nuevo › Personal*.
- **Mac:** abre el `.dotx` en Word y guárdalo con *Archivo › Guardar como plantilla*. Después: *Archivo › Nuevo desde plantilla*.

## Tipografía

- Montserrat Regular, Bold y ExtraBold van **incrustadas**: el documento se ve bien aunque el ordenador no tenga la fuente.
- Conviene instalarla igualmente desde [Google Fonts](https://fonts.google.com/specimen/Montserrat).
- Si al guardar Word pregunta por las fuentes, deja activada la opción *Incrustar fuentes en el archivo*.

## Estilos

Todo se escribe con los estilos de la pestaña Inicio, nunca con formato a mano.

| Estilo | Uso | Formato |
|---|---|---|
| Título | Título de portada | ExtraBold 36 pt, grafito |
| Título 1 | Apertura de apartado | ExtraBold 28 pt, grafito |
| Título 2 | Sección | ExtraBold 16 pt, grafito |
| Título 3 | Subapartado | Bold 12 pt, grafito |
| Antetítulo | Encima de los títulos | Bold 7,5 pt, mayúsculas, +0,15 em, verde sendero |
| Entradilla | Primer párrafo del apartado | Regular 12,5 pt |
| Normal | Texto de lectura | Regular 10 pt, interlineado 1,45, grafito |
| Lista SW | Viñetas y pasos | Viñeta verde Ways, números en sendero |
| Cita SW / Autor de cita | Frase destacada o testimonio | Bold 14 pt entre filetes finos |
| Tabla cabecera / Tabla texto | Tablas de datos | Cabecera en mayúsculas con filete grafito, filas con filete niebla |
| Leyenda SW | Título y fuente de tablas, gráficos e imágenes | Regular 7,5 pt, gris |
| Texto legal | Notas y avisos legales | Regular 7 pt, gris |

El Título 2 y el Título 3 son algo menores que en la escala de impresión del brandbook (20 y 14 pt) para que el documento quede más sobrio.

## Reglas para el Word

- Blanco, texto en grafito y el verde solo como acento: filetes, viñetas, antetítulos y números.
- **Sin subrayados de color ni cajas verdes** (feedback).
- Títulos en minúscula de frase. Mayúsculas solo en el antetítulo.
- En la portada, el logo siempre a color.
- Índice automático: *Referencias › Tabla de contenido*. Los títulos ya están preparados.

## Regenerar la plantilla

Si cambia algo del brandbook, se edita `generador/build.js` y se vuelve a generar:

```bash
cd plantillas/word/generador
npm install docx
# poner Montserrat-400.ttf, Montserrat-700.ttf y Montserrat-800.ttf (Google Fonts) en generador/fonts/
node build.js recursos raw.docx && python3 post.py raw.docx ../Paginas_tipo_Santiago_Ways.docx
node build.js blanco rawb.docx && python3 post.py rawb.docx ../Documento_en_blanco_Santiago_Ways.docx
python3 post.py rawb.docx ../Plantilla_Santiago_Ways.dotx
```

`build.js` crea el documento con los estilos y las páginas; `post.py` incrusta Montserrat y, si la salida es `.dotx`, lo convierte en plantilla.
