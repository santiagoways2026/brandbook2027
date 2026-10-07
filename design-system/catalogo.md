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
| 11 | `heroblogsw` | Cabecera de artículo con foto de fondo y overlay | CSS ✓ HTML ✗ |
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
| 22 | `tabla-responsive` | Tabla de datos. En móvil cada fila es una tarjeta | **CSS ✗** HTML ✓ |

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

---

## Lo que falta

1. **Los 21 HTML de referencia.** Déjalos en [`inbox/`](../inbox/) y pide «cataloga el inbox».
   Con ellos se confirma la estructura exacta de cada bloque y se cierra el catálogo.
2. **El CSS de `tabla-responsive`.** No está en `bloques.css`. Mientras tanto se usa la
   reconstrucción de [`../bloques/tabla-responsive.css`](../bloques/tabla-responsive.css),
   que **no es la tuya**.
