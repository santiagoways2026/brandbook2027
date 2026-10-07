# Catálogo de bloques · Santiago Ways

Índice semántico de los bloques: **qué es cada uno y cuándo se usa**.
La lista exacta de clases está en [`inventario.md`](inventario.md), generado desde
[`bloques.css`](bloques.css). Antes de escribir HTML hay que leer los dos.

## Estados

| Estado | Significado |
|---|---|
| `CSS ✓ HTML ✓` | Tenemos hoja de estilos y markup de referencia. Listo para generar. |
| `CSS ✓ HTML ✗` | Tenemos el CSS pero no el markup. Se puede deducir, pero hay que confirmarlo. |
| `CSS ✗ HTML ✓` | Tenemos el markup pero no el CSS original. |

---

## Los 24 bloques

| # | Bloque | Para qué | Estado |
|---|---|---|---|
| 1 | `cta-box` | Caja comercial: titular, texto y un botón | CSS ✓ HTML ⚠ |
| 2 | `steps` | Pasos numerados en vertical, unidos por una línea verde | CSS ✓ HTML ⚠ |
| 3 | `stats` | Cifras en fila: km, etapas, días, desnivel | CSS ✓ HTML ✓ |
| 4 | `roadmap` | Recorrido de etapas en línea. En móvil pasa a vertical | CSS ✓ HTML ✗ |
| 5 | `cards` | Rejilla de tarjetas con icono dentro de una caja verde claro | CSS ⚠ HTML ✓ |
| 6 | `timeline` | Línea de tiempo (años Xacobeo). **Doble marcado** | CSS ✓ HTML ✓ |
| 7a | `note` | Aviso lateral discreto. Contenido libre dentro | CSS ✓ HTML ✓ |
| 7b | `quote` | Cita destacada, centrada, con autor | CSS ✓ HTML ✓ |
| 8 | `guides` | Guías descargables: tarjetas con botón | CSS ✓ HTML ✓ |
| 9 | `features` | Características con icono en `<img>` | CSS ✓ HTML ✓ |
| 10 | `checklist` | Listas de comprobación en tarjetas | CSS ✓ HTML ✓ |
| 11 | `heroblogsw` | Cabecera de artículo con foto de fondo y overlay | CSS ✓ HTML ✓ |
| 12 | `roads` | Tarjetas de rutas con foto, banderola lima y etiquetas | CSS ⚠ HTML ✓ |
| 13 | `finder` | Selector de preguntas con enlaces de respuesta | CSS ✓ HTML ✓ |
| 14 | `durations` | Comparativa de rutas con **barras de progreso** | CSS ✓ HTML ✓ |
| 15a | `prep` | Preparación física: foto a un lado, lista numerada al otro | CSS ✓ HTML ✓ |
| 15b | `gear` | Equipamiento: rejilla de fichas con foto y enlaces | CSS ✓ HTML ✓ |
| 16 | `tips` | Consejos numerados a tres columnas | CSS ✓ HTML ✓ |
| 17 | `safety` | Seguridad: bloques con etiqueta y teléfono de emergencia | CSS ✓ HTML ✓ |
| 18 | `mistakes` | Errores frecuentes: el error y, al lado, la alternativa | CSS ✓ HTML ✓ |
| 19 | `arrival` | Dos fichas con foto a media anchura | CSS ✓ HTML ✓ |
| 20 | `gr-ficha` | Ficha de datos: foto + pares etiqueta/valor | CSS ✓ HTML ✓ |
| 21 | `gr-planner` | Promo del planificador, con columna oscura y checklist | CSS ✓ HTML ✓ |
| 22 | `tabla-responsive` | Tabla de datos. En móvil cada fila es una tarjeta | CSS ✓ HTML ✓ |

---

## Reglas que ya se deducen del CSS

Estas salen de leer `bloques.css` y hay que respetarlas sí o sí. El resto de la estructura
se confirmará cuando lleguen los HTML.

### `durations` · la barra necesita un valor inline
`.durations__bar` pinta el relleno con `linear-gradient(to right, #7AA606 var(--pct, 0%), ...)`.
Sin `--pct` la barra sale vacía. Hay que escribirlo en el propio elemento:

```html
<span class="durations__bar" style="--pct: 68%"></span>
```

Es la **única excepción** a la regla de no usar `style` inline: aquí el atributo no es estilo,
es el dato.

### `timeline` · el contenido va dos veces
`.timeline__track` se oculta por debajo de 600 px y `.timeline__vertical` se oculta por encima.
El bloque lleva las dos versiones del mismo contenido en el HTML. Si solo se escribe una, el
bloque desaparece en la mitad de las pantallas.

### `roadmap` · primer y último punto son distintos
El punto de salida usa `roadmap__dot--start`, el de llegada `roadmap__dot--end`, y ambos
llevan además `roadmap__marker--endpoint` y `roadmap__name--endpoint`.

### `roads` · la tarjeta entera es el enlace
`.roads__card` tiene `text-decoration: none` y `color: inherit`: está pensada como `<a>`,
no como `<div>` con un enlace dentro.

### `note` y `quote` · dónde va cada una
`note` admite cualquier contenido dentro (`.note > :first-child` y `:last-child` ajustan los
márgenes). `quote` espera exactamente `.quote__text` y `.quote__author`.

### Flechas y chevrons son del CSS
`.finder__link::after` pone `›`, `.durations__link::after` pone `›` y `.gear__link::after`
pone `→`. **No se escriben en el HTML**: saldrían duplicados.

### `heroblogsw` · la raíz es `<section>` y el overlay no se salta
La raíz es `<section class="heroblogsw">`, no un `<div>`. El `<img>` va pegado a la
etiqueta de apertura, en la misma línea. El `<div class="heroblogsw__overlay">` va vacío
y va siempre: es lo que oscurece la foto para que el texto blanco se lea.

El velo va de `rgba(0,0,0,.72)` a la izquierda a `rgba(0,0,0,.15)` a la derecha, así que
la foto necesita una zona despejada en el lado izquierdo.

Dentro de `__content` el orden es fijo: badge, título, actions. El título es `<h2>`; solo
se usa `<h1>` si el bloque abre la página y no hay ningún encabezado por encima.

Aquí los símbolos **sí se escriben en el HTML**: el `✔` del badge y el `→` del botón. Es
lo contrario de lo que pasa en `finder`, `durations` y `gear`, donde los pone el `::after`.

`__actions` es flex con `gap` y `flex-wrap`, así que admite más de un botón.

### Dos bloques llegaron con problemas en el HTML publicado

**`cta-box`** circula por la web con **estilos inline en lugar de las clases**. Los valores
coinciden uno a uno con `.cta-box`, así que se ve igual, pero la versión inline pierde:

- el `:hover` del botón (`#6a9205`)
- el `@media (max-width: 480px)`, que baja el padding a 20 px y pone el botón a ancho
  completo y centrado en móvil

La versión buena está en [`../bloques/cta-box.html`](../bloques/cta-box.html). El original
inline se conserva en `cta-box.original.html` solo como constancia.

**`steps`** venía envuelto en un `<div style="position: relative; margin: 32px 0;">` que
duplica lo que `.steps` ya hace en el CSS y que, además, **nunca se cierra**: falta su
`</div>`. En la referencia va sin ese envoltorio.

### `roads` · dos clases sin CSS
`.roads__subtitle` y `.roads__desc` se usan en el HTML publicado pero **no existen en
`bloques.css`**. Salen con los estilos por defecto del navegador. `.roads__body` es flex en
columna con `gap: 9px`, así que se apilan bien, pero no hay control de tamaño ni de color.
Habría que añadirlas al CSS o quitarlas del HTML.

### `durations` · el porcentaje de la barra es calculable
En la web, el `--pct` de cada barra es la proporción de sus kilómetros respecto a la ruta
más larga **de su propia fila**: 115/160 = 72 %, 119/160 = 74 %, 260/315 = 83 %. Coincide en
las ocho barras publicadas, así que el módulo lo calcula solo y solo hay que escribirlo para
forzar un valor distinto.

Las proporciones son **por fila, no globales**: comparar una barra de la primera fila con
una de la tercera no significa nada.

### El `<span>` de la barra lleva un comentario vacío dentro
`<span class="durations__bar" style="--pct: 72%;"><!-- --></span>`. El comentario está para
que el editor no colapse el span, que no tiene contenido. Si se quita, en algunos editores
la barra desaparece.

### Un `<div>` sin clase que sí hace falta
En `.prep__item` y en `.tips__item`, el segundo hijo es un `<div>` **sin clase** que envuelve
el título y el texto. No es un descuido: el contenedor es flex, y sin ese div el número, el
título y el texto se colocarían como tres columnas en vez de dos.

Lo mismo en `.gear`: cada ficha es un `<div>` sin clase que envuelve `__media` y `__body`,
y es ese div el que ocupa la celda de la rejilla.

### Qué bloques NO usan encabezados
`finder__question`, `prep__title`, `gear__title` y `durations__headline` son `<div>`.
`mistakes__title` es un `<p>`. `arrival__title`, `tips__item-title`, `prep__item-title` y
`safety__item-title` son `<strong>`. Solo `roads__title` (`<h3>`), `steps__title` (`<h3>`),
`cta-box__title` (`<h3>`) y `heroblogsw__title` (`<h2>`) son encabezados reales.

Importa para el índice de la página y para los lectores de pantalla: cambiar un `<div>` por
un `<h3>` altera la estructura del documento, así que se respeta lo que hay.

### Símbolos: unos se escriben y otros los pone el CSS

| Bloque | Símbolo | Quién lo pone |
|---|---|---|
| `finder__link` | `›` | **CSS** (`::after`) |
| `durations__link` | `›` | **CSS** (`::after`) |
| `gear__link` | `→` | **CSS** (`::after`) |
| `gr-planner__list li` | marca de verificación | **CSS** (`::before`) |
| `heroblogsw__button` | `→` | HTML |
| `heroblogsw__badge` | `✔` | HTML |
| `roads__link` | `→` | HTML |
| `quote__text` | `«»` | HTML |

Escribir un símbolo donde lo pone el CSS lo duplica; no escribirlo donde va en el HTML lo
pierde. Es el error más fácil de cometer en este sistema.

### `steps` · el paso final NO se marca solo
De los dos bloques `steps` publicados, el de la Credencial **sí** marca su último paso con
`steps__number--final` (verde oscuro) y el del traslado de equipaje **no**, aunque también
tiene cinco pasos y también acaba. Es una decisión editorial, no una regla.

Lo había deducido como automático a partir de un solo ejemplo y era falso. En el módulo se
pide a mano con `final: si` en el paso que cierre.

### `cards` · usa una clase por otra
El título de cada tarjeta lleva `cards__title`, que en el CSS es la clase del título del
**bloque** (`margin: 0 0 20px`). La pensada para la tarjeta es `cards__title-card`
(`font-size: 18px; margin: 0 0 12px`) y **no se usa en ninguna parte**: es CSS muerto.

Consecuencia: los títulos salen al tamaño del cuerpo en vez de a 18 px, y con 20 px de
separación en vez de 12. Además, el bloque no usa nunca su título propio.

Se reproduce lo publicado para no cambiar el aspecto de las páginas vivas. Cambiarlo es
un arreglo de una línea por tarjeta, pero afecta a lo que ya está publicado.

### `timeline` · los saltos son calculables
El salto de cada punto («5 años») es la diferencia con el año **siguiente**, no con el
anterior, y por eso el último punto no lleva salto. Coincide en los siete saltos publicados:
1999→2004 = 5, 2010→2021 = 11, 2027→2032 = 5. El módulo los calcula solos.

El año destacado es el único que lleva etiqueta debajo. En la vista móvil su fila mete el
año y la etiqueta dentro de un `<div>` extra que las demás filas no tienen, y el salto
lleva una flecha `↓` delante que en escritorio no aparece.

### `gr-planner` · el orden del código no es el orden visual
En el HTML van `__head`, `__side`, `__body`, en ese orden. La rejilla usa
`grid-template-areas: "head side" "body side"`, así que la columna oscura ocupa las dos
filas aunque en el código esté en medio. Por debajo de 700 px la rejilla se deshace y el
orden visual pasa a ser el del código: titular, columna oscura, cuerpo.

### `features` · el `alt=""` está bien puesto
Los iconos llevan `alt=""` **a propósito**: son decorativos y el `<h3>` que va justo debajo
ya dice lo mismo. Ponerles texto alternativo haría que los lectores de pantalla lo
repitieran dos veces. Es el único bloque donde un `alt` vacío es correcto.

Además escribe `width="40" height="40"` en el HTML aunque el CSS ya fuerce ese tamaño: eso
reserva el hueco y evita que la página salte mientras carga. Bien hecho.

### `checklist` · el único bloque con `<h2>`
`checklist__title` es un `<h2>`. Todos los demás titulares de bloque son `<h3>`, y el del
hero es `<h2>` por ser cabecera de artículo. Dentro de un artículo que ya tiene `<h2>`
conviene bajarlo a `<h3>` para no romper el índice; el módulo lo permite con `nivel: h3`.

### Imágenes sin clase
En `gr-ficha` y en `features`, el `<img>` **no lleva clase**: el CSS lo selecciona con
`.gr-ficha__media img` y `.features__icon img`. En el resto de bloques la imagen sí lleva
su clase (`roads__img`, `prep__img`, `gear__img`, `arrival__img`, `heroblogsw__img`). No
hay un criterio único; se respeta lo que hay en cada bloque.

### `tabla-responsive` · el tema se cambia desde el HTML
La tabla declara sus colores como variables en `.tabla-responsive`. Para cambiar el color
de **una** tabla concreta se redefinen en el propio elemento:

```html
<table class="tabla-responsive" style="--tabla-acento-1:#1d4ed8; --tabla-acento-2:#1e3a8a;">
```

Es la **segunda excepción** a la regla de no usar `style` inline, y está prevista por el
propio CSS. Para cambiarlo en toda la web se editan los valores de
[`tabla-responsive.css`](tabla-responsive.css), no el HTML.

Las variables: `--tabla-acento-1`, `--tabla-acento-2`, `--tabla-texto`, `--tabla-borde`,
`--tabla-cebra` y `--tabla-radio`. Están documentadas en [`inventario.md`](inventario.md).

### `tabla-responsive` · el punto de ruptura es 680 px
No 720. Y no puede ser una variable CSS: las media queries no las leen. Está escrito a
mano en `tabla-responsive.css` y hay que cambiarlo ahí si hace falta otro valor.

### `tabla-responsive` · la cabecera se oculta, no se borra
En móvil `thead` se esconde con `clip: rect(0 0 0 0)`, no con `display:none`: los lectores
de pantalla siguen leyéndola. Por eso los `<th>` tienen que llevar texto real aunque en
móvil no se vean.

---

## Lo que falta

**Un solo HTML de referencia:** `roadmap`. Déjalos en [`inbox/`](../inbox/) y pide «cataloga el inbox».
   Con ellos se confirma la estructura exacta de cada bloque y se cierra el catálogo.
`tabla-responsive` ya está completo: [`tabla-responsive.css`](tabla-responsive.css) es el
original y [`../bloques/tabla-responsive.html`](../bloques/tabla-responsive.html) el markup.
