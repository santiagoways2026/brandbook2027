# Cómo añadir un módulo

Un módulo es la receta para convertir contenido en bruto en un bloque de
`design-system/bloques.css`. Todo vive en [`modulos.js`](modulos.js): no hay que tocar
el HTML ni el CSS de la herramienta.

## Los campos

```js
{
  id: 'cta-box',              // el id del bloque, igual que en el catálogo
  nombre: 'Caja comercial',   // lo que se lee en el selector
  clase: '.cta-box',          // la clase raíz, se muestra en la cabecera
  grupo: 'Conversión',        // agrupa en el selector
  descripcion: 'Titular, texto y un botón.',
  estado: { texto: 'HTML original', tono: 'ok' },   // tonos: ok, aviso, pendiente
  reglas: ['...'],            // lo que hay que saber del marcado
  entrada: { etiqueta: 'Pega el texto', ayuda: '...', filas: 8 },
  demo: '...',                // contenido fijo del panel «El módulo»
  ejemplo: '...',             // contenido de arranque del panel editable
  render(bruto) {
    // Devuelve { html: '...', avisos: [] }
    // o lanza un Error con el motivo si el contenido no sirve.
  },
}
```

Al añadirlo al array `MODULOS`, quítalo de `PENDIENTES` (ahí están los bloques que
tienen CSS pero todavía no tienen módulo; salen en gris en el selector).

## Lo que tiene que cumplir `render`

1. **Devolver el markup exacto** del `bloques/<id>.html` de referencia: mismas clases,
   mismo anidamiento, mismo salto de línea. El panel «El módulo» se pinta con esa misma
   función y la demo, así que si el render se desvía, se ve al instante.
2. **Escapar el contenido** con `esc()`. Para los campos donde se admite marcado ligero,
   usar `linea()`: convierte `**negrita**` y `[texto](url)` y escapa el resto.
3. **Lanzar un `Error`** con un mensaje en castellano cuando el contenido no sirva.
   El mensaje se enseña tal cual al usuario.
4. **Rellenar `avisos`** con lo que haya que advertir sin impedir la generación:
   demasiadas columnas, filas descuadradas, un campo que se ha dejado vacío.

## Utilidades disponibles

| Función | Para qué |
|---|---|
| `esc(texto)` | Escapa `& < > "` |
| `linea(texto)` | Escapa y convierte `**negrita**` y `[texto](url)` |
| `sinNegrita(texto)` | Quita los `**` de campos que ya van siempre en negrita |
| `leerTabla(bruto)` | Lee una tabla de Excel, Word, Markdown o CSV. Devuelve `{ cabeceras, filas, avisos }` |

## Comprobar que el render es fiel

Con la herramienta abierta, en la consola del navegador:

```js
const mod = MODULOS.find(m => m.id === 'tabla-responsive');
const generado = mod.render(mod.demo).html.trim();
const ref = await fetch('/bloques/tabla-responsive.html').then(r => r.text());
generado === ref.replace(/<!--[\s\S]*?-->/g, '').trim();   // tiene que dar true
```
