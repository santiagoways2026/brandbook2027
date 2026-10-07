# Catálogo de bloques · Santiago Ways

Índice único de componentes HTML. **Antes de generar cualquier HTML hay que leer este
archivo**: si el contenido encaja con un bloque de aquí, se usa ese bloque tal cual.
Si no encaja con ninguno, hay que preguntar, no improvisar clases.

## Estados

| Estado | Significado |
|---|---|
| `CONFIRMADO` | Markup aportado por el cliente. Se reproduce literal, sin tocar nombres de clase. |
| `RECONSTRUIDO` | El markup es real pero el CSS lo hemos escrito nosotros. Pendiente de sustituir por el original. |
| `PROPUESTO` | Lo hemos diseñado nosotros desde el Brandbook. Pendiente de validación. |

---

## Bloques disponibles

### `tabla-responsive` · CONFIRMADO (HTML) · RECONSTRUIDO (CSS)
- **Archivos:** [bloques/tabla-responsive.html](bloques/tabla-responsive.html) · [bloques/tabla-responsive.css](bloques/tabla-responsive.css)
- **Cuándo:** toda tabla de datos dentro de un artículo o página.
- **Clases:** `.tabla-responsive-wrap` (div envolvente) + `.tabla-responsive` (table).
- **Reglas de marcado:**
  1. `<div class="tabla-responsive-wrap">` envuelve siempre a `<table class="tabla-responsive">`.
  2. `<thead>` con un `<th>` por columna, sin `data-label`.
  3. En `<tbody>`, **cada `<td>` salvo el primero** lleva `data-label="<texto exacto del th>"`.
  4. El **primer `<td>` no lleva `data-label`** y su contenido va dentro de `<strong>`:
     es el título de la tarjeta en móvil.
  5. Valores cerrados o definitivos (`Confirmado`, `Incluido`, un precio final) van en
     `<strong>`; los pendientes o aproximados, en texto plano.
  6. Sin atributos `style`, sin `border`, sin `width`, sin `<colgroup>`.
- **Markup de referencia:**

```html
<div class="tabla-responsive-wrap">
<table class="tabla-responsive">
<thead>
<tr>
<th>Col 1</th>
<th>Col 2</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Valor 1</strong></td>
<td data-label="Col 2">Valor 2</td>
</tr>
</tbody>
</table>
</div>
```

---

## Pendientes de catalogar

Deja los HTML en [`inbox/`](../inbox/) y pide «cataloga el inbox». Por cada archivo se creará
su entrada aquí, su `bloques/<nombre>.html` y, si viene el CSS, su `bloques/<nombre>.css`.
