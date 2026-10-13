---
name: sw-bloque
description: Convierte contenido en bruto (una tabla pegada, texto, Markdown, un listado) en HTML con las clases propias de Santiago Ways, usando los bloques de design-system/bloques.css. Úsalo siempre que el usuario pegue contenido y pida maquetarlo, transformarlo, pasarlo a HTML o "ponerlo con el CSS personalizado".
---

# sw-bloque · transformar contenido a HTML de marca

## 1. Cargar el sistema

Antes de escribir una sola línea de HTML, leer:

1. `design-system/inventario.md` · la **lista cerrada** de clases. Generada desde el CSS.
   Si una clase no está ahí, no existe.
2. `design-system/catalogo.md` · qué es cada bloque, cuándo se usa y las reglas de marcado
   ya deducidas del CSS.
3. El `bloques/<nombre>.html` del bloque elegido, si existe: ese archivo manda sobre
   cualquier deducción.

Si no hay `bloques/<nombre>.html` para el bloque que toca, el markup se deduce del CSS.
En ese caso hay que **decirlo en una línea** al entregar: la estructura está sin confirmar.

## 2. Elegir el bloque

| Contenido recibido | Bloque |
|---|---|
| Tabla, cuadro comparativo, calendario, lista de precios | `tabla-responsive` |
| Llamada a la acción con botón | `cta-box` |
| Proceso por pasos, "cómo funciona" | `steps` |
| Cifras sueltas: km, etapas, días | `stats` |
| Recorrido de etapas de una ruta | `roadmap` |
| Ventajas o servicios con icono | `cards` o `features` |
| Años, fechas Xacobeo, cronología | `timeline` |
| Aviso, matiz, nota al margen | `note` |
| Cita de alguien, testimonio | `quote` |
| Guías o PDF descargables | `guides` |
| Qué llevar, qué comprobar | `checklist` |
| Cabecera de artículo con foto | `heroblogsw` |
| Listado de rutas con foto | `roads` |
| Preguntas tipo "¿cuál elijo?" | `finder` |
| Comparar rutas por km o días | `durations` |
| Entrenamiento previo | `prep` |
| Mochila, botas, bastones | `gear` |
| Consejos numerados | `tips` |
| Seguridad, emergencias | `safety` |
| Errores y qué hacer en su lugar | `mistakes` |
| Llegada a Santiago, Compostela | `arrival` |
| Datos de una ruta en pares etiqueta/valor | `gr-ficha` |
| Promo del planificador | `gr-planner` |

Si no encaja con ninguno: **no inventes clases**. Dilo en una frase, propón qué bloque
haría falta y pregunta si lo creamos.

## 3. Transformar

- Copia la estructura del bloque de referencia carácter a carácter en cuanto a clases,
  anidamiento y atributos. Solo cambia el contenido.
- No añadas `style`, `id`, `width`, `border` ni comentarios dentro del HTML de salida.
- No escribas las flechas ni los chevrons: los pone el CSS con `::after` en
  `.finder__link`, `.durations__link` y `.gear__link`. Si los escribes salen dos veces.

### Excepciones y trampas

| Bloque | Qué tener en cuenta |
|---|---|
| `durations` | `.durations__bar` necesita `style="--pct: N%"` en el propio elemento. Es el dato, no un estilo: aquí sí va inline |
| `timeline` | El contenido va **dos veces**: `.timeline__track` (escritorio) y `.timeline__vertical` (móvil). Si falta una, el bloque desaparece en esas pantallas |
| `roadmap` | Primer punto: `roadmap__dot--start`. Último: `roadmap__dot--end`. Ambos con `roadmap__marker--endpoint` y `roadmap__name--endpoint` |
| `roads` | `.roads__card` es un `<a>`, no un `<div>` |
| `quote` | Espera exactamente `.quote__text` y `.quote__author` |
| `note` | Admite cualquier contenido dentro |

### Reglas de `tabla-responsive`

1. Envolver en `<div class="tabla-responsive-wrap">`.
2. `<thead>` con un `<th>` por columna. Sin `data-label`.
3. En `<tbody>`, cada `<td>` **salvo el primero** lleva `data-label` con el **texto exacto
   del `<th>`** de su columna.
4. El primer `<td>` no lleva `data-label` y su contenido va en `<strong>`.
5. Valores definitivos o cerrados → `<strong>`. Pendientes o aproximados → texto plano.
6. Más de 4 columnas: avisa de que la tarjeta móvil se hace larga, pero genera lo pedido.
7. Sin cabecera en el origen: pregunta por los títulos de columna. Sin `<th>` no hay `data-label`.

## 4. Entregar

Devuelve el HTML en un bloque de código ```html listo para copiar. Si lo pide el usuario o
la pieza es larga, guárdalo además en `salidas/<nombre-descriptivo>.html` y enlázalo.

Después, como mucho **dos líneas**, y solo si hay algo real que avisar: estructura sin
confirmar, columnas de más, un dato ambiguo. Si no hay nada que avisar, no escribas nada más.
