# Design Code HTML · Santiago Ways

Librería de bloques HTML con el CSS propio de Santiago Ways, más un transformador:
le das contenido en bruto y te devuelve el HTML ya maquetado con las clases correctas.

## Cómo se usa

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
| `design-system/bloques.css` | **La hoja de estilos original.** 23 bloques, 208 clases. Fuente de verdad |
| `design-system/inventario.md` | Lista cerrada de clases, generada desde el CSS |
| `design-system/catalogo.md` | Qué es cada bloque, cuándo se usa y sus reglas de marcado |
| `design-system/paleta.md` | Paleta real vs. Brandbook 2027, con los avisos de contraste |
| `design-system/tokens.css` | Tokens del brandbook como referencia |
| `bloques/` | Un `.html` por componente con su markup de referencia |
| `tools/inventario.py` | Regenera el inventario cuando cambia `bloques.css` |
| `inbox/` | Buzón de entrada: HTML sin catalogar |
| `salidas/` | HTML generado |
| `emails/` | Pieza de email heredada. Fuera del alcance de este proyecto |

## Ver los bloques

Abre [`design-system/preview.html`](design-system/preview.html) en el navegador.

## Estado

| | CSS | HTML de referencia |
|---|---|---|
| Los 23 bloques de `bloques.css` | ✓ original | ✗ pendiente |
| `tabla-responsive` | ✗ reconstruido | ✓ original |

Falta el markup de referencia de los 23 bloques y el CSS de `tabla-responsive`, que no
está en `bloques.css`.

Hay además **un aviso de contraste**: `#668814`, el color de texto más usado de la hoja
(32 veces, casi siempre en tamaños de 11-13 px), da 4,12:1 sobre blanco y no llega al
mínimo AA de 4,5:1. Está detallado en [`design-system/paleta.md`](design-system/paleta.md).
