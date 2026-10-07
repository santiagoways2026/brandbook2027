---
name: sw-bloque
description: Convierte contenido en bruto (una tabla pegada, texto, Markdown, un listado) en HTML con las clases propias de Santiago Ways, usando los bloques catalogados en design-system/catalogo.md. Úsalo siempre que el usuario pegue contenido y pida maquetarlo, transformarlo, pasarlo a HTML o "ponerlo con el CSS personalizado".
---

# sw-bloque · transformar contenido a HTML de marca

## 1. Cargar el catálogo

Lee **siempre** `design-system/catalogo.md` antes de escribir HTML. Es la lista cerrada de
bloques disponibles. Lee también el `bloques/<nombre>.html` del bloque que vayas a usar:
ese archivo es el patrón literal.

## 2. Identificar el bloque

| Contenido recibido | Bloque |
|---|---|
| Tabla, cuadro comparativo, calendario, lista de precios, itinerario por etapas | `tabla-responsive` |
| Cualquier otra cosa | ver catálogo; si no hay bloque, **preguntar** |

Si el contenido no encaja con ningún bloque catalogado: **no inventes clases**. Dilo en una
frase, propón qué bloque haría falta y pregunta si lo creamos.

## 3. Transformar

- Copia la estructura del bloque de referencia **carácter a carácter** en cuanto a clases,
  anidamiento y atributos. Solo cambia el contenido.
- Mantén el formato del archivo de referencia: una etiqueta por línea, sin indentar las
  filas dentro de `<tbody>` (así está el original del cliente).
- No añadas `style`, `id`, `width`, `border` ni comentarios dentro del HTML de salida.

### Reglas específicas de `tabla-responsive`

1. Envolver en `<div class="tabla-responsive-wrap">`.
2. `<thead>` con un `<th>` por columna. Sin `data-label`.
3. En `<tbody>`, cada `<td>` **salvo el primero** lleva `data-label` con el **texto exacto
   del `<th>`** de su columna.
4. El primer `<td>` no lleva `data-label` y su contenido va en `<strong>`.
5. Valores definitivos o cerrados → `<strong>`. Valores pendientes o aproximados → texto plano.
6. Si la tabla de origen tiene más de 4 columnas, avisa: en móvil la tarjeta se hace larga.
   Sugiere fusionar columnas, pero genera igualmente lo pedido.
7. Si la tabla de origen no tiene cabecera, pregunta por los títulos de columna: sin `<th>`
   no se pueden generar los `data-label`.

## 4. Entregar

Devuelve el HTML en un bloque de código ```html listo para copiar. Si el usuario lo pide o
la pieza es larga, guárdalo además en `salidas/<nombre-descriptivo>.html` y enlázalo.

Añade después, como mucho **dos líneas**, solo si hay algo real que avisar (columnas de más,
cabecera ausente, un dato que parecía un título y lo has tratado como fila). Si no hay nada
que avisar, no escribas nada más.
