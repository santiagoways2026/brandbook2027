# Cómo montar un documento con IA usando la plantilla de Word

La plantilla está pensada para que una IA (Claude, ChatGPT, Copilot en Word…) pueda montar un documento nuevo a partir de ella. Funciona mejor cuando la IA **edita el archivo de la plantilla** que cuando intenta imitarlo desde cero.

## Paso a paso

1. Abre un chat con una IA que pueda leer y crear archivos de Word (por ejemplo, Claude).
2. Adjunta `Paginas_tipo_Santiago_Ways.docx`.
3. Copia el texto de instrucciones de abajo, añade tu contenido al final (o adjúntalo como otro archivo) y envíalo.
4. Revisa el resultado: cifras, nombres, fechas y que no quede ningún «Lorem ipsum».

**Con Copilot dentro de Word:** crea el documento desde la plantilla, copia las páginas tipo que quieras y pide a Copilot que reescriba el texto de cada página con tu contenido («Reescribe esta página con…»). Así se mantiene el diseño.

## Instrucciones para pegar en la IA

```
Eres el maquetador de documentos de Santiago Ways. Te adjunto
Paginas_tipo_Santiago_Ways.docx, la plantilla de Word de la marca. Crea un
documento Word (.docx) con mi contenido siguiendo estas reglas:

1. Trabaja sobre el archivo adjunto. Conserva sus estilos, cabecera, pie,
   márgenes, fuentes incrustadas y colores. No cambies tipografías, tamaños
   ni colores.
2. Elige las páginas tipo que mejor encajen con mi contenido, en el orden que
   tenga sentido. Puedes repetir una página tipo y debes borrar las que no
   uses. Páginas disponibles: portada tipográfica, portada con foto, índice,
   separador de capítulo, resumen ejecutivo, página de texto, texto con tabla,
   infografía (cifras, barras y proceso), listas, imágenes, itinerario día a
   día, comparativa de opciones, plan de trabajo (cronograma), testimonios,
   preguntas frecuentes, presupuesto, equipo y contactos, modelo de carta y
   contraportada.
3. Usa una sola portada: la tipográfica por defecto, o la de foto si el
   documento es para clientes.
4. Sustituye todo el texto de ejemplo (Lorem ipsum, «Nombre Apellido»,
   precios, cifras, fechas) por mi contenido. No dejes texto de ejemplo.
5. Escribe solo con los estilos de la plantilla: Título, Título 1, Título 2,
   Título 3, Normal, Antetítulo, Entradilla, Lista SW, Cita SW, Autor de cita,
   Tabla cabecera, Tabla texto, Leyenda SW y Texto legal. Nada de formato a
   mano.
6. Las tablas, las barras de la infografía y el cronograma son tablas de
   Word: cambia el texto, añade o quita filas y ajusta el ancho de las barras
   según los datos. Mantén sus bordes y colores.
7. Reglas de marca: títulos en minúscula de frase; mayúsculas solo en los
   antetítulos; sin subrayados de color ni cajas verdes; el verde solo como
   acento (filetes, viñetas, antetítulos y números); el logo de la portada
   siempre a color.
8. Pon el título del documento en la cabecera y actualiza el índice con los
   capítulos y las páginas reales (o sustitúyelo por Referencias › Tabla de
   contenido).
9. Si te falta un dato, escribe [PENDIENTE: qué falta] en lugar de
   inventarlo.
10. Escribe en español de España, con un tono cercano y claro, y sin guiones
    largos.

Mi contenido:
[pega aquí el texto, los datos o adjunta el documento de origen]
```

## Qué página usar para cada cosa

| Necesito… | Página tipo |
|---|---|
| Abrir un documento interno | Portada tipográfica |
| Abrir un dossier o propuesta para clientes | Portada con foto |
| Ordenar un documento largo | Índice y separadores de capítulo |
| Contar lo esencial en una página | Resumen ejecutivo |
| Texto corrido, con alguna cita | Página de texto |
| Datos en filas y columnas | Texto con tabla |
| Cifras, porcentajes o un proceso | Infografía |
| Qué incluye y qué no, ideas clave, pasos | Listas |
| Mostrar lugares o experiencias | Imágenes |
| Detallar una ruta | Itinerario día a día |
| Comparar planes, proveedores u opciones | Comparativa |
| Planificar por meses | Plan de trabajo |
| Opiniones de clientes | Testimonios |
| Resolver dudas | Preguntas frecuentes |
| Pasar precios a un cliente | Presupuesto |
| Quién es quién | Equipo y contactos |
| Una comunicación formal | Modelo de carta |
| Cerrar el documento | Contraportada |

## Límites

- Una IA que no puede leer el archivo adjunto solo imitará el estilo de memoria y el resultado no saldrá igual. Siempre adjunta la plantilla.
- Revisa siempre las cifras y los datos: la IA puede equivocarse al pasar números a una tabla.
- Si la IA cambia fuentes o colores, pídele que vuelva a aplicar los estilos de la plantilla.
