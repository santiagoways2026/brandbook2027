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

| Carpeta | Qué hay |
|---|---|
| `design-system/` | `tokens.css` (colores, tipografía y escala del Brandbook 2027), `catalogo.md` (índice de bloques) y `preview.html` |
| `bloques/` | Un `.html` por componente con su markup de referencia y sus reglas. `.css` cuando lo tenemos |
| `inbox/` | Buzón de entrada: HTML sin catalogar |
| `salidas/` | HTML generado |
| `emails/` | Pieza de email heredada. Fuera del alcance de este proyecto |

## Ver los bloques

Abre [`design-system/preview.html`](design-system/preview.html) en el navegador.

## Estado

| Bloque | HTML | CSS |
|---|---|---|
| `tabla-responsive` | Confirmado | ⚠️ Reconstruido · falta el original |

El CSS de `tabla-responsive` está escrito por nosotros a partir del Brandbook, porque el
original no se ha aportado. Si existe en el tema de WordPress o en una hoja personalizada,
déjalo en `inbox/` y sustituimos el nuestro.
