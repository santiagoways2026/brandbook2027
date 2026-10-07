# Cómo añadir un módulo

Un módulo es la receta para convertir contenido en bruto en un bloque de
`design-system/bloques.css`. Cada uno vive en su propio archivo dentro de
[`modulos/`](modulos/). No hay que tocar el HTML ni el CSS de la herramienta.

## Los tres pasos

1. Guarda el HTML original del cliente en `bloques/<id>.html`, literal.
2. Crea `app/modulos/<id>.js` con la ficha y el `render()`.
3. Impórtalo en [`modulos/index.js`](modulos/index.js), mételo en `MODULOS` y quítalo
   de `PENDIENTES`.

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

El archivo exporta la ficha por defecto:

```js
import { esc, linea, leerFichas, campo } from './_comun.js';

export default { /* la ficha de arriba */ };
```

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

Todas salen de [`modulos/_comun.js`](modulos/_comun.js).

| Función | Para qué |
|---|---|
| `esc(texto)` | Escapa `& < > "` |
| `linea(texto)` | Escapa y convierte `**negrita**` y `[texto](url)` |
| `sinNegrita(texto)` | Quita los `**` de campos que ya van siempre en negrita |
| `normalizar(clave)` | Minúsculas y sin tildes |
| `dosDigitos(n)` | `1` → `01`, para los numeradores |
| `leerTabla(bruto)` | Lee una tabla de Excel, Word, Markdown o CSV |
| `leerCampos(bruto, permitidas, multilinea)` | Campos sueltos «clave: valor» |
| `leerFichas(bruto, opciones)` | Lo mismo pero con dos niveles: grupos y fichas |
| `campo(mapa, clave)` / `lista(mapa, clave)` | Primer valor / todos los valores |
| `enlace(bruto)` | Parte «Texto -> url» en `{ texto, url }` |
| `tamano(bruto)` | `800x560` → ` width="800" height="560"` |
| `avisarAlt(avisos, alt, donde)` | Aviso estándar de falta de texto alternativo |

### `leerFichas`, el caso general

```js
const { cabecera, grupos, avisos } = leerFichas(bruto, {
  cabecera: ['titulo', 'subtitulo'],   // campos sueltos del bloque entero
  claveGrupo: 'bloque',                // abre grupo (opcional)
  grupo: ['tono', 'ancho'],
  claveFicha: 'aviso',                 // abre ficha dentro del grupo
  ficha: ['texto'],
  multilinea: ['texto'],               // campos que admiten varias líneas
});
```

Sin `claveGrupo` todo cae en un grupo implícito: `grupos[0].fichas`.

Una línea que no abre campo solo se pega a la anterior si ese campo está en `multilinea`.
En el resto avisa, porque pegarla a una URL rompería el dato en silencio.

## Comprobar que el render es fiel

Con la herramienta abierta, en la consola del navegador:

```js
const mod = MODULOS.find(m => m.id === 'tabla-responsive');
const generado = mod.render(mod.demo).html.trim();
const ref = await fetch('/bloques/tabla-responsive.html').then(r => r.text());
generado === ref.replace(/<!--[\s\S]*?-->/g, '').trim();   // tiene que dar true
```
