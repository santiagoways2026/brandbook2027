# Plantilla de presentación

Presentación 16:9 con el estilo sobrio de la marca: blanco, texto en grafito y el verde solo como acento. Se abre en PowerPoint, Keynote y Presentaciones de Google.

| Archivo | Para qué |
|---|---|
| `Presentacion_Santiago_Ways.pptx` | La plantilla: 11 diseños de diapositiva y 17 diapositivas de ejemplo con Lorem Ipsum. |
| `vista-previa/` | Las 17 diapositivas renderizadas. |
| `generador/` | Script con el que se genera (`build.js`, con pptxgenjs) y sus imágenes. |

## Diseños de diapositiva

En PowerPoint aparecen en *Inicio › Nueva diapositiva*: Portada, Portada con foto, Separador, Título solo, Título y texto, Dos columnas, Texto e imagen, Foto a sangre, Gráfico y comentario, Cita y Cierre.

## Diapositivas de ejemplo

| | Diapositiva | Diseño |
|---|---|---|
| 1 | Portada tipográfica | Portada |
| 2 | Portada con foto | Portada con foto |
| 3 | Índice | Título solo |
| 4 | Separador de capítulo | Separador |
| 5 | Resumen con dato clave | Título y texto |
| 6 | Dos columnas | Dos columnas |
| 7 | Texto e imagen | Texto e imagen |
| 8 | Titular sobre foto | Foto a sangre |
| 9 | Cifras clave | Título solo |
| 10 | Gráfico de barras nativo | Gráfico y comentario |
| 11 | Tabla | Título solo |
| 12 | Comparativa de opciones | Título solo |
| 13 | Proceso en cuatro pasos | Título solo |
| 14 | Plan de trabajo | Título solo |
| 15 | Cita con foto | Cita |
| 16 | Próximos pasos | Título solo |
| 17 | Cierre | Cierre |

## Uso

- **Fuente:** Montserrat (títulos en ExtraBold). En Google ya está incluida; en PowerPoint hay que instalarla desde [Google Fonts](https://fonts.google.com/specimen/Montserrat).
- **Fotos:** clic derecho › *Cambiar imagen*.
- **Gráficos:** son nativos; clic derecho › *Editar datos*.
- **Google:** sube el `.pptx` a Drive y ábrelo con Presentaciones de Google, o usa *Archivo › Importar diapositivas* en una presentación existente.
- **Con IA:** ver `../GUIA-IA-presentacion-y-hoja.md`.

## Regenerar

`generador/build.js` usa [pptxgenjs](https://gitbrent.github.io/PptxGenJS/). Después de escribir el archivo, los colores del tema (grafito, blanco, sendero, niebla, verde Ways…) se escriben en `ppt/theme/theme1.xml`; el script espera una función `applyTheme` en `apply_theme.js` (o en la ruta de la variable `APPLY_THEME`) que haga ese paso.
