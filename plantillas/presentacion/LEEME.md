# Plantilla de presentación

Presentación 16:9 montada como la del brandbook y el plan Xacobeo 27: fotos a sangre, tarjetas blancas con sombra suave, subrayado Ways, diapositivas en verde y en sendero, y la concha. Se abre en PowerPoint, Keynote y Presentaciones de Google.

| Archivo | Para qué |
|---|---|
| `Presentacion_Santiago_Ways.pptx` | La plantilla, con 35 diapositivas de ejemplo ordenadas en secciones. |
| `GUIA-IA.md` | Cómo pedir a una IA una presentación con la plantilla, con las instrucciones listas para copiar. |
| `vista-previa/` | Las 35 diapositivas renderizadas. |
| `generador/` | Script con el que se genera (`build.js`, con pptxgenjs), fotos, concha, logos e iconos. |

## Diapositivas

| Sección | Diapositivas |
|---|---|
| Portadas | 1 Foto a sangre con título grande · 2 Foto con tarjeta blanca (como el brandbook) · 3 Verde con foto y concha |
| Estructura | 4 Índice · 5 Apertura de bloque con foto · 6 Apertura de bloque en verde |
| Bloques de contenido | 7 Tres objetivos · 8 Tres miradas y una conclusión · 9 Diapositiva verde con tarjetas · 10 Tarjetas con cabecera verde · 11 Diapositiva sendero · 12 Embudo por fases · 13 Dos mensajes · 14 Tres columnas con cabecera · 15 Rejilla con foto · 16 Fase con etiqueta · 17 Proceso · 18 Línea de tiempo · 19 Comparativa · 20 Ficha de ruta · 21 Galería · 22 Cita sobre foto · 23 Frase destacada · 24 Equipo · 25 Preguntas frecuentes |
| Datos | 26 Cifras clave · 27 Tabla · 28 Gráfico · 29 Tablero de tareas |
| Recursos de marca | 30 La concha · 31 Cajas, etiquetas y verdes · 32 Iconos |
| Contraportadas | 33 Foto con «Gracias» · 34 Verde con la concha · 35 Blanca con logo vertical |

## Reglas

- **Un único estilo de tabla y de gráfico:** los de las diapositivas 27 y 28. Se cambian los datos, nunca el estilo.
- **Subrayado Ways:** como mucho uno por título, en la palabra clave. Verde Ways sobre blanco, sendero sobre verde y verde Ways sobre sendero. Es un bloque aparte: si cambia la palabra, se ajusta el ancho.
- **Letra blanca** sobre cualquier verde.
- **La concha** siempre entera, nunca recortada ni girada. Como marca de agua, grande y muy suave.
- **Logo** a color sobre blanco; en blanco sobre foto o verde.
- **Iconos:** se copian de la diapositiva 32 (iconos de línea Tabler, licencia MIT).

## Uso

- **Fuente:** Montserrat (títulos en ExtraBold). En Google ya está incluida; en PowerPoint hay que instalarla desde [Google Fonts](https://fonts.google.com/specimen/Montserrat).
- **Duplicar:** clic derecho › *Duplicar diapositiva* y cambiar el texto.
- **Fotos:** son de ejemplo; sustitúyelas por las que apliquen en cada caso con clic derecho › *Cambiar imagen*. **Gráfico:** clic derecho › *Editar datos*.
- **Google:** sube el `.pptx` a Drive y ábrelo con Presentaciones de Google.

## Regenerar

`generador/build.js` usa [pptxgenjs](https://gitbrent.github.io/PptxGenJS/). Necesita:

- Montserrat 400, 700 y 800 en `generador/fonts/` (`Montserrat-400.ttf`, `-700.ttf`, `-800.ttf`), que `measure.py` usa para medir los subrayados.
- Una función `applyTheme` en `apply_theme.js` (o en la ruta de la variable `APPLY_THEME`) que escriba los colores del tema en `ppt/theme/theme1.xml`.
- Los iconos se generan con `icons.js` (react-icons y sharp) a partir de `iconlist.json`.

Después de escribir el archivo, el script convierte en degradado (135°, `#7AA606` a `#628A04`) las formas llamadas «Degradado…» y redondea las esquinas de las fotos llamadas «FotoR…».
