# Plantilla de Word

Formato único para cualquier documento de Word de Santiago Ways, según el Brandbook 2027.

| Archivo | Para qué |
|---|---|
| `Plantilla_Santiago_Ways.dotx` | La plantilla. Al abrirla con doble clic, Word crea un documento nuevo sin tocar la plantilla. |
| `Documento_en_blanco_Santiago_Ways.docx` | Portada y una página en blanco, lista para escribir. |
| `Plantilla_Santiago_Ways.docx` | Muestra con Lorem Ipsum de todos los estilos: títulos, listas, tabla, caja de nota, dato destacado y cita. |
| `vista-previa/` | Las páginas renderizadas, para ver el resultado sin abrir Word. |
| `generador/` | Scripts con los que se genera la plantilla (ver abajo). |

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
| Título | Título de portada | ExtraBold 40 pt, grafito |
| Título 1 | Apertura de apartado | ExtraBold 28 pt, grafito |
| Título 2 | Sección | ExtraBold 20 pt, grafito |
| Título 3 | Subapartado | Bold 14 pt, verde sendero |
| Antetítulo | Encima de los títulos | Bold 8 pt, mayúsculas, +0,15 em, verde sendero |
| Entradilla | Primer párrafo del apartado | Regular 13 pt |
| Normal | Texto de lectura | Regular 10,5 pt, interlineado 1,5, grafito |
| Lista SW | Viñetas y pasos | Viñeta verde Ways, números en sendero |
| Cita SW / Autor de cita | Citas y testimonios | Bold 14 pt sendero con filete verde Ways |
| Tabla cabecera / Tabla texto | Tablas de datos | Cabecera blanca sobre verde Ways, filas alternas en brote |
| Leyenda SW | Título y fuente de tablas e imágenes | Regular 8 pt, gris |
| Texto legal | Notas y avisos legales | Regular 7 pt, gris |

- **Índice:** *Referencias › Tabla de contenido*. Los títulos ya están preparados.
- **Portada:** antetítulo, título, subtítulo y datos de autor, área, fecha y versión. Foto: clic derecho › *Cambiar imagen*.
- **Cabecera:** doble clic para escribir el título del documento.
- **Subrayado Ways:** una o dos palabras del título con sombreado verde Ways `#7AA606` y letra blanca. Una sola vez por título. En Word va recto.
- **Cajas:** la caja de nota (brote con filete verde) y la caja destacada (verde Ways) se copian desde la muestra con Lorem Ipsum. Una caja destacada por documento como máximo.

## Regenerar la plantilla

Si cambia algo del brandbook, se edita `generador/build.js` y se vuelve a generar:

```bash
cd plantillas/word/generador
npm install docx
# poner Montserrat-400.ttf, Montserrat-700.ttf y Montserrat-800.ttf (Google Fonts) en generador/fonts/
node build.js lorem raw.docx && python3 post.py raw.docx ../Plantilla_Santiago_Ways.docx
node build.js blanco rawb.docx && python3 post.py rawb.docx ../Documento_en_blanco_Santiago_Ways.docx
python3 post.py rawb.docx ../Plantilla_Santiago_Ways.dotx
```

`build.js` crea el documento con los estilos; `post.py` incrusta Montserrat y, si la salida es `.dotx`, lo convierte en plantilla.
