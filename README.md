# Design Code HTML · Santiago Ways

Librería de bloques HTML con el CSS propio de Santiago Ways, más un transformador:
le das contenido en bruto y te devuelve el HTML ya maquetado con las clases correctas.

## La herramienta

```bash
python tools/servidor.py
```

Abre solo **http://localhost:8899/app/** . Tiene cuatro paneles:

| Panel | Qué hace |
|---|---|
| Selector (izquierda) | Los módulos, agrupados y con buscador. En gris, los que esperan su HTML |
| **El módulo** | Cómo se ve el bloque con su contenido de ejemplo |
| **Con tus datos** | El mismo bloque con lo que escribes, en vivo |
| **HTML generado** | El código listo para copiar, con los avisos |

El conmutador **Escritorio / Móvil** cambia las dos vistas a la vez. No reduce el panel:
simula una pantalla de 1120 px o de 390 px y la escala, así que los puntos de ruptura del
bloque reaccionan a la anchura de verdad.

Para añadir módulos, mira [`app/LEEME.md`](app/LEEME.md).

## Cómo se usa desde el chat

Pega el contenido en el chat y pide la transformación. Por ejemplo:

> Pásame esto a tabla:
> Fecha | Hito | Estado
> 31 dic 2026 | Apertura de la Puerta Santa | Confirmado

Devuelve:

```html
<div class="tabla-responsive-wrap">
<table class="tabla-responsive">
...
</table>
</div>
```

Funciona igual con una tabla copiada de Excel, de Word, de Google Docs o en Markdown.

## Cómo se añaden bloques nuevos

1. Deja el HTML (y el CSS si lo tienes) en [`inbox/`](inbox/).
2. Pide: **«cataloga el inbox»**.
3. Cada archivo pasa a `bloques/` con sus reglas de marcado y queda indexado en
   [`design-system/catalogo.md`](design-system/catalogo.md).

A partir de ese momento el transformador ya sabe usarlo.

## Estructura

| Archivo | Qué hay |
|---|---|
| `app/` | La herramienta: selector, vistas previas y generador |
| `design-system/bloques.css` | **La hoja de estilos original.** 23 bloques, 208 clases. Fuente de verdad |
| `design-system/inventario.md` | Lista cerrada de clases, generada desde el CSS |
| `design-system/catalogo.md` | Qué es cada bloque, cuándo se usa y sus reglas de marcado |
| `design-system/paleta.md` | Paleta real vs. Brandbook 2027, con los avisos de contraste |
| `design-system/tabla-responsive.css` | Hoja de la tabla. Se tematiza con variables CSS |
| `design-system/tokens.css` | Tokens del brandbook como referencia |
| `bloques/` | Un `.html` por componente con su markup de referencia |
| `tools/servidor.py` | Servidor de desarrollo sin caché |
| `tools/inventario.py` | Regenera el inventario cuando cambia el CSS |
| `inbox/` | Buzón de entrada: HTML sin catalogar |
| `salidas/` | HTML generado |
| `emails/` | Pieza de email heredada. Fuera del alcance de este proyecto |

## Estado

| | CSS | HTML de referencia | Módulo |
|---|---|---|---|
| 23 bloques | ✓ original | ✓ original | ✓ listo |
| `roadmap` | ✓ original | ✗ pendiente | ✗ pendiente |

Falta un solo bloque: `roadmap`.

Tres avisos sobre el HTML publicado, detallados en
[`design-system/catalogo.md`](design-system/catalogo.md):

- `cta-box` circula con estilos inline en vez de clases, y pierde el `:hover` y el
  comportamiento en móvil.
- El `steps` publicado va dentro de un `<div>` que nunca se cierra.
- `cards` usa `cards__title` donde el CSS esperaba `cards__title-card`, así que los
  títulos de tarjeta salen al tamaño del cuerpo. `cards__title-card` es CSS muerto.

Hay además **un aviso de contraste**: `#668814`, el color de texto más usado del sistema
(33 veces, casi siempre en tamaños de 11-13 px), da 4,12:1 sobre blanco y no llega al
mínimo AA de 4,5:1. Está detallado en [`design-system/paleta.md`](design-system/paleta.md).
