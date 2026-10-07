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
| 1 | `cta-box` | Caja comercial: titular, texto y un botón | CSS ✓ HTML ✗ |
| 2 | `steps` | Pasos numerados en vertical, unidos por una línea verde | CSS ✓ HTML ✗ |
| 3 | `stats` | Cifras en fila: km, etapas, días, desnivel | CSS ✓ HTML ✗ |
| 4 | `roadmap` | Recorrido de etapas en línea. En móvil pasa a vertical | CSS ✓ HTML ✗ |
| 5 | `cards` | Rejilla de tarjetas con icono dentro de una caja verde claro | CSS ✓ HTML ✗ |
| 6 | `timeline` | Línea de tiempo (años Xacobeo). **Doble marcado** | CSS ✓ HTML ✗ |
| 7a | `note` | Aviso lateral discreto. Contenido libre dentro | CSS ✓ HTML ✗ |
| 7b | `quote` | Cita destacada, centrada, con autor | CSS ✓ HTML ✗ |
| 8 | `guides` | Guías descargables: tarjetas con botón | CSS ✓ HTML ✗ |
| 9 | `features` | Características con icono en `<img>` | CSS ✓ HTML ✗ |
| 10 | `checklist` | Listas de comprobación en tarjetas | CSS ✓ HTML ✗ |
| 11 | `heroblogsw` | Cabecera de artículo con foto de fondo y overlay | CSS ✓ HTML ✓ |
| 12 | `roads` | Tarjetas de rutas con foto, banderola lima y etiquetas | CSS ✓ HTML ✗ |
| 13 | `finder` | Selector de preguntas con enlaces de respuesta | CSS ✓ HTML ✗ |
| 14 | `durations` | Comparativa de rutas con **barras de progreso** | CSS ✓ HTML ✗ |
| 15a | `prep` | Preparación física: foto a un lado, lista numerada al otro | CSS ✓ HTML ✗ |
| 15b | `gear` | Equipamiento: rejilla de fichas con foto y enlaces | CSS ✓ HTML ✗ |
| 16 | `tips` | Consejos numerados a tres columnas | CSS ✓ HTML ✗ |
| 17 | `safety` | Seguridad: bloques con etiqueta y teléfono de emergencia | CSS ✓ HTML ✗ |
| 18 | `mistakes` | Errores frecuentes: el error y, al lado, la alternativa | CSS ✓ HTML ✗ |
| 19 | `arrival` | Dos fichas con foto a media anchura | CSS ✓ HTML ✗ |
| 20 | `gr-ficha` | Ficha de datos: foto + pares etiqueta/valor | CSS ✓ HTML ✗ |
| 21 | `gr-planner` | Promo del planificador, con columna oscura y checklist | CSS ✓ HTML ✗ |
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

**Los 21 HTML de referencia que faltan.** Déjalos en [`inbox/`](../inbox/) y pide «cataloga el inbox».
   Con ellos se confirma la estructura exacta de cada bloque y se cierra el catálogo.
`tabla-responsive` ya está completo: [`tabla-responsive.css`](tabla-responsive.css) es el
original y [`../bloques/tabla-responsive.html`](../bloques/tabla-responsive.html) el markup.
