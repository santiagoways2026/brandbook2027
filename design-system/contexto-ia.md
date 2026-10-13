# Bloques de Santiago Ways · contexto para IA

Documento autocontenido con los **24 bloques** de santiagoways.com: para qué
sirve cada uno, qué opciones admite y su marcado exacto.

**Para qué es.** Pégalo como contexto en cualquier IA. A partir de ahí basta con pedirle
«hazme un bloque de consejos con estos cinco puntos» o «pásame esta tabla a bloque» y
tendrá todo lo que necesita para devolver el HTML correcto.

Si solo vas a trabajar con uno o dos bloques, pega la sección «Reglas generales» más el
apartado de esos bloques: el documento entero es largo.

Generado el 2026-10-13 desde el código real del proyecto.

---

## Reglas generales

Estas van siempre, para cualquier bloque.

1. **No se inventan clases.** Solo existen las que aparecen en este documento. Una clase
   que no esté aquí no tiene CSS detrás y se verá como texto sin formato.
2. **No se escriben atributos `style`.** Solo hay dos excepciones, ambas documentadas en
   su bloque: `--pct` en `.durations__bar` y las variables de tema de
   `.tabla-responsive`. En los dos casos el atributo es el dato, no el estilo.
3. **No se añade `id`, `role` ni `aria-*`** que no esté en el marcado de referencia. La
   única excepción es `data-label`, obligatorio en `.tabla-responsive`.
4. **Se respeta el nivel de cada encabezado.** Muchos títulos de este sistema son `<div>`,
   `<p>` o `<strong>` a propósito, no encabezados. Cambiarlos altera el índice de la
   página y lo que leen los lectores de pantalla.
5. **Se respeta el formato.** Casi todos los bloques vienen con una etiqueta por línea y
   sin indentar. `roadmap` es la excepción: viene indentado.
6. **Nada de frameworks** (Bootstrap, Tailwind) ni clases de utilidad.
7. **Se escapan `&`, `<`, `>` y `"`** en el contenido que venga del usuario.

### Símbolos: unos los pone el CSS y otros van escritos

Es el error más fácil de cometer. Escribir un símbolo donde ya lo pone el CSS lo duplica;
no escribirlo donde toca lo pierde.

| Dónde | Símbolo | Quién lo pone |
|---|---|---|
| `.finder__link` | `›` | **CSS**, no escribir |
| `.durations__link` | `›` | **CSS**, no escribir |
| `.gear__link` | `→` | **CSS**, no escribir |
| `.gr-planner__list li` | marca de verificación | **CSS**, no escribir |
| `.gr-planner__item` | casilla | **CSS**, no escribir |
| `.heroblogsw__button` | `→` | se escribe en el HTML |
| `.heroblogsw__badge` | `✔` | se escribe en el HTML |
| `.roads__link` | `→` | se escribe en el HTML |
| `.quote__text` | `«»` | se escribe en el HTML |
| `.timeline__row-gap` | `↓` | se escribe en el HTML, y solo en la vista móvil |
| `.cards__icon`, `.checklist__card-title` | emoji | se escribe en el HTML |

### Divs sin clase que hacen falta

No son descuido. En `.prep__item` y `.tips__item` el segundo hijo es un `<div>` **sin
clase** que envuelve título y texto: el contenedor es flex y sin él las piezas se colocan
mal. En `.gear`, cada ficha es un `<div>` sin clase que envuelve `__media` y `__body`, y
es ese div el que ocupa la celda de la rejilla. En `.timeline__row--current` hay otro que
agrupa el año y su etiqueta.

### Colores

El sistema es verde. No hay azules ni rojos.

| Color | Hex | Uso |
|---|---|---|
| Verde Ways | `#7AA606` | Fondos, botones, puntos, barras. **Nunca texto sobre blanco** |
| Verde oscuro | `#668814` | Antetítulos, etiquetas, cifras, enlaces |
| Verde noche | `#184834` | Fondos oscuros y el paso final de `steps` |
| Lima | `#9DDB07` | Solo la banderola de `roads` |
| Verde claro | `#f7faf2` | Fondo de las cajas |

Todos están ya en el CSS: no hay que escribirlos nunca en el HTML.

---

## Índice

| # | Bloque | Clase | Para qué |
|---|---|---|---|
| 1 | Tabla | `.tabla-responsive` | Tabla de datos dentro de un artículo. |
| 2 | Hero de artículo | `.heroblogsw` | Cabecera de artículo: foto a sangre, velo oscuro de izquierda a derecha y, encima, etiqueta, titular y botones. |
| 3 | Tarjetas de rutas | `.roads` | Listado de rutas en tarjetas con foto, banderola lima en diagonal, etiquetas y enlace. |
| 4 | Selector de preguntas | `.finder` | Rejilla de tarjetas con una pregunta cada una y los enlaces que la responden. |
| 5 | Comparativa con barras | `.durations` | Filas que agrupan rutas por duración. |
| 6 | Preparación física | `.prep` | Foto a un lado y, al otro, un antetítulo, un título y una lista numerada de puntos separados por filetes. |
| 7 | Equipamiento | `.gear` | Rejilla de fichas con foto, antetítulo, título, texto y una lista de enlaces separados por filetes. |
| 8 | Caja comercial | `.cta-box` | Caja verde claro con titular, un párrafo y un botón. |
| 9 | Pasos numerados | `.steps` | Pasos en vertical unidos por una línea verde continua, cada uno con su círculo numerado. |
| 10 | Nota al margen | `.note` | Aviso discreto con filete verde a la izquierda. |
| 11 | Cita destacada | `.quote` | Cita centrada en cursiva sobre un degradado verde muy claro, con filete a la izquierda y autor opcional. |
| 12 | Consejos | `.tips` | Consejos numerados separados por filetes. |
| 13 | Seguridad | `.safety` | Bloques separados por filetes, cada uno con su etiqueta de color y una serie de avisos en columnas. |
| 14 | Errores frecuentes | `.mistakes` | Cada fila enfrenta un error con su alternativa: a la izquierda qué se hace mal, a la derecha, en una caja verde, qué conviene hacer. |
| 15 | Llegada | `.arrival` | Fichas con foto a media anchura, antetítulo, título y texto. |
| 16 | Ficha de datos | `.gr-ficha` | Foto grande a un lado y, al otro, una lista de pares etiqueta/valor separados por filetes. |
| 17 | Línea de tiempo | `.timeline` | Serie de años con el salto entre cada uno. |
| 18 | Tarjetas con icono | `.cards` | Rejilla de tarjetas blancas dentro de una caja verde claro. |
| 19 | Promo planificador | `.gr-planner` | Promoción de la herramienta del planificador: a la izquierda el argumento y el botón, a la derecha una columna verde noche con una lista de ejemplo. |
| 20 | Cifras | `.stats` | Fila de tarjetas con una cifra grande y su etiqueta en mayúsculas, cada una con una barrita verde arriba. |
| 21 | Guías descargables | `.guides` | Caja verde claro con un titular, una entradilla y tarjetas de guías, cada una con su botón. |
| 22 | Características | `.features` | Rejilla de tarjetas blancas con un icono en imagen, un título y una línea de texto. |
| 23 | Listas de comprobación | `.checklist` | Caja verde claro con un titular, una entradilla y tarjetas blancas, cada una con su lista. |
| 24 | Recorrido de etapas | `.roadmap` | Las paradas de una ruta sobre una línea, con la salida y la llegada destacadas. |

---

## 1. Tabla · `.tabla-responsive`

**Para qué.** Tabla de datos dentro de un artículo. Por debajo de 680 px cada fila se convierte en una tarjeta, con la primera columna como título.

**Opciones.**

Variables de tema, redefinibles en el propio elemento con `style`:

| Variable | Qué es | Por defecto |
|---|---|---|
| `--tabla-acento-1` | verde claro, inicio del degradado | `#7AA606` |
| `--tabla-acento-2` | verde oscuro, fin del degradado y etiquetas | `#668814` |
| `--tabla-texto` | color del texto de las celdas | `#111111` |
| `--tabla-borde` | líneas y bordes | `#e5e7eb` |
| `--tabla-cebra` | fondo de las filas pares | `#fafaf9` |
| `--tabla-radio` | radio de las esquinas | `16px` |

**Reglas.**

- El primer <td> no lleva data-label: hace de título de la tarjeta en móvil.
- El resto de <td> llevan data-label con el texto exacto de su <th>.
- La primera columna va siempre en <strong>.
- El salto a tarjetas ocurre a 680 px. Entre 680 px y el ancho natural de la tabla hay scroll horizontal.
- Los <th> necesitan texto real: en móvil se ocultan a la vista pero los lectores de pantalla los leen.
- Más de 4 columnas hace la tarjeta móvil muy larga.

**Contenido que necesita.** Una fila de cabecera con el nombre de cada columna y una fila por registro. La primera columna hace de título de la tarjeta en móvil, así que conviene que sea la más identificativa.

```html
<div class="tabla-responsive-wrap">
<table class="tabla-responsive">
<thead>
<tr>
<th>Fecha</th>
<th>Hito</th>
<th>Estado</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>31 dic 2026, 17:00</strong></td>
<td data-label="Hito">Apertura solemne de la Puerta Santa</td>
<td data-label="Estado"><strong>Confirmado</strong></td>
</tr>
<tr>
<td><strong>Todo 2027</strong></td>
<td data-label="Hito">Año Santo Jacobeo en vigor</td>
<td data-label="Estado"><strong>Confirmado</strong></td>
</tr>
<tr>
<td><strong>21–28 mar 2027 (aprox.)</strong></td>
<td data-label="Hito">Semana Santa</td>
<td data-label="Estado">Fechas confirmadas; programa pendiente</td>
</tr>
<tr>
<td><strong>15–25 jul 2027</strong></td>
<td data-label="Hito">Ventana religiosa crítica: novena, vísperas y solemnidad</td>
<td data-label="Estado">Pendiente de programa detallado</td>
</tr>
<tr>
<td><strong>25 jul 2027</strong></td>
<td data-label="Hito">Día del Apóstol Santiago, en domingo</td>
<td data-label="Estado"><strong>Confirmado</strong></td>
</tr>
<tr>
<td><strong>31 dic 2027</strong></td>
<td data-label="Hito">Posible clausura del Año Santo</td>
<td data-label="Estado">Pendiente de confirmación</td>
</tr>
</tbody>
</table>
</div>
```

---

## 2. Hero de artículo · `.heroblogsw`

**Para qué.** Cabecera de artículo: foto a sangre, velo oscuro de izquierda a derecha y, encima, etiqueta, titular y botones.

**Reglas.**

- La raíz es <section>, no <div>. El overlay va siempre: sin él, el texto blanco pierde contraste sobre la foto.
- El velo es más oscuro a la izquierda, así que la foto debe tener aire por ese lado.
- Los símbolos del botón (→) y de la etiqueta (✔) van escritos en el HTML: aquí el CSS no los pone.
- El titular es <h2>. Si el bloque abre la página y no hay nada por encima, usa nivel: h1.
- La foto necesita texto alternativo: ocupa todo el bloque y no es decorativa.

**Contenido que necesita.** Una foto con su texto alternativo, una etiqueta corta (opcional), un titular y hasta dos botones (opcionales).

```html
<section class="heroblogsw"><img class="heroblogsw__img" src="https://santiagoways.com/wp-content/uploads/2019/10/feature-singles.webp" alt="Peregrinos caminando por una etapa del Camino de Santiago" />
<div class="heroblogsw__overlay"></div>
<div class="heroblogsw__content">
<div class="heroblogsw__badge">✔ Actualizado 2026</div>
<h2 class="heroblogsw__title">Todo lo que necesitas saber para organizar tu Camino paso a paso</h2>
<div class="heroblogsw__actions"><a class="heroblogsw__button" href="/?page_id=11888">Ver rutas principales →</a></div>
</div>
</section>
```

---

## 3. Tarjetas de rutas · `.roads`

**Para qué.** Listado de rutas en tarjetas con foto, banderola lima en diagonal, etiquetas y enlace. La tarjeta entera es el enlace.

**Opciones.**

| Modificador | Qué cambia |
|---|---|
| `.roads--alt` | Cambia el fondo de crema (#FAF8F2) a verde claro (#F4F8EC). Para alternar cuando van dos secciones seguidas |

**Reglas.**

- .roads__card es un <a>, no un <div>: la tarjeta entera es clicable y dentro solo van <span>.
- La flecha → del enlace va escrita en el HTML: aquí el CSS no la pone.
- variante: alt pinta el fondo en verde claro (#F4F8EC) en vez de crema. Sirve para alternar secciones seguidas.
- .roads__subtitle y .roads__desc se usan en la web pero NO existen en bloques.css: salen sin estilo propio.
- La banderola va recortada en diagonal y sobresale por debajo de la foto: textos de 2 o 3 palabras.

**Contenido que necesita.** Un titular y un subtítulo para la sección y, por cada ruta: foto con alt, banderola de dos o tres palabras, nombre, descripción, una o varias etiquetas y el texto del enlace.

```html
<section class="roads">
<div class="roads__header">
<h3 class="roads__title">Cuatro Caminos, cuatro caracteres</h3>
<p class="roads__subtitle">No hay un Camino mejor. Hay el que encaja contigo.</p>
</div>
<div class="roads__grid"><a class="roads__card" href="/?page_id=12"><span class="roads__media"><img class="roads__img" src="https://santiagoways.com/wp-content/uploads/2016/10/post-ropa1.webp" alt="Peregrinos caminando por el Camino Francés" /><span class="roads__flag">El social</span></span><span class="roads__body"><span class="roads__name">Camino Francés</span><span class="roads__desc">Siempre hay alguien caminando cerca. La ruta con más vida y la mejor preparada.</span><span class="roads__tags"><span class="roads__tag">La más elegida</span></span><span class="roads__link">Ver el Camino Francés →</span></span></a><a class="roads__card" href="/?page_id=11890"><span class="roads__media"><img class="roads__img" src="https://santiagoways.com/wp-content/uploads/2026/03/feature-post-tui-sarria.webp" alt="Camino Portugués desde Tui" /><span class="roads__flag">El cómodo</span></span><span class="roads__body"><span class="roads__name">Camino Portugués</span><span class="roads__desc">119 km desde Tui, etapas amables y pueblos cada poco. Ideal para empezar.</span><span class="roads__tags"><span class="roads__tag">La que más crece</span></span><span class="roads__link">Ver el Camino Portugués →</span></span></a><a class="roads__card" href="/?page_id=22210"><span class="roads__media"><img class="roads__img" src="https://santiagoways.com/wp-content/uploads/2026/07/feature-guia-costa-baiona.webp" alt="Camino Portugués por la Costa desde Baiona" /><span class="roads__flag">El del mar</span></span><span class="roads__body"><span class="roads__name">Camino Portugués por la Costa</span><span class="roads__desc">El Atlántico te acompaña casi todo el trayecto: playas, paseos marítimos y marisco.</span><span class="roads__tags"><span class="roads__tag">Costa y paisaje marítimo</span></span><span class="roads__link">Ver el Camino Portugués por la Costa →</span></span></a><a class="roads__card" href="/?page_id=42"><span class="roads__media"><img class="roads__img" src="https://santiagoways.com/wp-content/uploads/2026/08/feature-etapas-camino-norte.webp" alt="Etapa del Camino del Norte por la costa cantábrica" width="800" height="560" /><span class="roads__flag">El salvaje</span></span><span class="roads__body"><span class="roads__name">Camino del Norte</span><span class="roads__desc">Acantilados, verde cantábrico y subidas de verdad. La más exigente de las cuatro.</span><span class="roads__tags"><span class="roads__tag">Costa, naturaleza y reto</span></span><span class="roads__link">Ver el Camino del Norte →</span></span></a></div>
</section>
```

Variante de fondo verde claro, para alternar cuando van dos seguidas: la misma
estructura con `<section class="roads roads--alt">`.

---

## 4. Selector de preguntas · `.finder`

**Para qué.** Rejilla de tarjetas con una pregunta cada una y los enlaces que la responden. Sirve para orientar al lector según lo que busca.

**Reglas.**

- Los números van escritos en el HTML, con cero delante y en orden: 01, 02, 03…
- El chevron › de cada enlace lo pone el CSS con ::after. No escribirlo aquí.
- .finder__question es un <div>, no un encabezado: no entra en el índice de la página.
- Las tarjetas se reparten en columnas de 300 px mínimo, así que el número de tarjetas por fila depende del ancho.

**Contenido que necesita.** Por cada tarjeta: una categoría corta, una pregunta, una frase de contexto y uno o varios enlaces de respuesta.

```html
<section class="finder">
<div class="finder__grid">
<div class="finder__card">
<div class="finder__meta"><span class="finder__number">01</span><span class="finder__category">Primera vez</span></div>
<div class="finder__question">¿Es tu primer Camino?</div>
<div class="finder__text">Prioriza buenas conexiones, servicios frecuentes y etapas fáciles de adaptar.</div>
<div class="finder__links"><a class="finder__link" href="/?page_id=12">Camino Francés</a><a class="finder__link" href="/?page_id=11890">Camino Portugués</a></div>
</div>
<div class="finder__card">
<div class="finder__meta"><span class="finder__number">02</span><span class="finder__category">Costa</span></div>
<div class="finder__question">¿Quieres caminar junto al mar?</div>
<div class="finder__text">El Atlántico y el Cantábrico cambian por completo el paisaje del Camino.</div>
<div class="finder__links"><a class="finder__link" href="/?page_id=22210">Portugués por la Costa</a><a class="finder__link" href="/?page_id=42">Camino del Norte</a></div>
</div>
<!-- … 3 más, mismo patrón … -->
<div class="finder__card">
<div class="finder__meta"><span class="finder__number">06</span><span class="finder__category">Ambiente peregrino</span></div>
<div class="finder__question">¿Quieres conocer gente en el Camino?</div>
<div class="finder__text">El Francés sigue siendo la referencia si valoras la parte social del viaje.</div>
<div class="finder__links"><a class="finder__link" href="/?page_id=12">Camino Francés</a></div>
</div>
</div>
</section>
```

---

## 5. Comparativa con barras · `.durations`

**Para qué.** Filas que agrupan rutas por duración. Cada ruta lleva una barra de progreso proporcional a sus kilómetros dentro de su propia fila.

**Reglas.**

- La barra se pinta con style="--pct: N%" en el propio elemento. Es el dato, no un estilo: es la única excepción permitida junto con el tema de la tabla.
- El porcentaje es la proporción de kilómetros respecto a la ruta más larga de su propia fila: 115 de 160 km son 72 %, 260 de 315 son 83 %. Se escribe redondeado al entero.
- El <span> de la barra lleva dentro un comentario HTML vacío. Sin él, algunos editores colapsan el span y la barra desaparece.
- El chevron › de cada ruta lo pone el CSS con ::after. No escribirlo aquí.
- Las proporciones son por fila, no globales: comparar entre filas distintas no tiene sentido.

**Contenido que necesita.** Por cada fila: antetítulo, titular grande, píldora con el rango, una entradilla y las rutas con su nombre, sus kilómetros y el porcentaje de la barra. Opcionalmente, una nota al pie.

```html
<section class="durations">
<div class="durations__row">
<div class="durations__summary">
<div class="durations__eyebrow">Primera experiencia</div>
<div class="durations__headline">≈ 1 semana</div>
<span class="durations__pill">100–160 km</span>
</div>
<div class="durations__detail">
<p class="durations__intro">Con unos siete días, el punto de inicio se vuelve decisivo. Estas son algunas de las opciones más habituales para llegar a Santiago.</p>
<div class="durations__links"><a class="durations__link" href="/?p=89222"><span class="durations__name">Sarria → Santiago</span><span class="durations__bar" style="--pct: 72%;"></span><span class="durations__km">115 km</span></a><a class="durations__link" href="/?p=89737"><span class="durations__name">Tui → Santiago</span><span class="durations__bar" style="--pct: 74%;"></span><span class="durations__km">119 km</span></a><a class="durations__link" href="/?page_id=71742"><span class="durations__name">Ferrol → Santiago</span><span class="durations__bar" style="--pct: 76%;"></span><span class="durations__km">122 km</span></a><a class="durations__link" href="/?p=93262"><span class="durations__name">Baiona → Santiago</span><span class="durations__bar" style="--pct: 100%;"></span><span class="durations__km">160 km</span></a></div>
</div>
</div>
<div class="durations__row">
<div class="durations__summary">
<div class="durations__eyebrow">Más recorrido</div>
<div class="durations__headline">8–15 días</div>
<span class="durations__pill">160–320 km</span>
</div>
<div class="durations__detail">
<p class="durations__intro">Con más de una semana puedes comenzar bastante más lejos y vivir una sucesión de etapas más amplia.</p>
<div class="durations__links"><a class="durations__link" href="/?page_id=70636"><span class="durations__name">Oporto → Santiago</span><span class="durations__bar" style="--pct: 83%;"></span><span class="durations__km">260 km</span></a><a class="durations__link" href="/?page_id=12"><span class="durations__name">Recorridos largos del Francés</span><span class="durations__bar" style="--pct: 100%;"></span><span class="durations__km">desde 315 km</span></a><a class="durations__link" href="/?page_id=11890"><span class="durations__name">Recorridos largos del Portugués</span><span class="durations__bar" style="--pct: 84%;"></span><span class="durations__km">desde 265 km</span></a></div>
</div>
</div>
<div class="durations__row">
<div class="durations__summary">
<div class="durations__eyebrow">El gran viaje</div>
<div class="durations__headline">Varias semanas</div>
<span class="durations__pill">+700 km</span>
</div>
<div class="durations__detail">
<p class="durations__intro">Con varias semanas, el Camino cambia de escala y se convierte en una auténtica travesía.</p>
<div class="durations__links"><a class="durations__link" href="/?page_id=90152"><span class="durations__name">Saint-Jean-Pied-de-Port → Santiago</span><span class="durations__bar" style="--pct: 100%;"></span><span class="durations__km">780 km</span></a></div>
<div class="durations__note">Unos 30 días caminando</div>
</div>
</div>
</section>
```

---

## 6. Preparación física · `.prep`

**Para qué.** Foto a un lado y, al otro, un antetítulo, un título y una lista numerada de puntos separados por filetes.

**Reglas.**

- Dentro de cada .prep__item el segundo hijo es un <div> SIN clase que envuelve el título y el texto. Sin él, el flex coloca mal las tres piezas.
- Los números van escritos en el HTML, con cero delante y en orden: 01, 02, 03…
- .prep__title es un <div>, no un encabezado: no entra en el índice de la página.
- La foto tiene min-height de 300 px y se recorta con object-fit: cover. Mejor horizontal.

**Contenido que necesita.** Una foto con alt, un antetítulo, un título y los puntos, cada uno con su título y su texto.

```html
<div class="prep">
<div class="prep__media"><img class="prep__img" src="https://santiagoways.com/wp-content/uploads/2026/02/feature-preparacion-fisica.webp" alt="Peregrinos preparándose para caminar el Camino de Santiago" /></div>
<div class="prep__content">
<div class="prep__header">
<span class="prep__eyebrow">Preparación física</span>
<div class="prep__title">Entrena para varios días, no para una sola etapa</div>
</div>
<div class="prep__item">
<div class="prep__number">01</div>
<div>
<strong class="prep__item-title">Progresa poco a poco</strong>
<p class="prep__text">Aumenta gradualmente la distancia y la duración de tus caminatas.</p>
</div>
</div>
<div class="prep__item">
<div class="prep__number">02</div>
<div>
<strong class="prep__item-title">Reproduce el terreno</strong>
<p class="prep__text">Introduce subidas y bajadas si encontrarás desnivel en tu Camino.</p>
</div>
</div>
<div class="prep__item">
<div class="prep__number">03</div>
<div>
<strong class="prep__item-title">Camina días consecutivos</strong>
<p class="prep__text">El esfuerzo acumulado forma parte del Camino. Conviene descubrir antes cómo responde tu cuerpo.</p>
</div>
</div>
</div>
</div>
```

---

## 7. Equipamiento · `.gear`

**Para qué.** Rejilla de fichas con foto, antetítulo, título, texto y una lista de enlaces separados por filetes.

**Reglas.**

- Cada ficha es un <div> SIN clase que envuelve .gear__media y .gear__body. Es ese div el que ocupa la celda de la rejilla.
- La flecha → de cada enlace la pone el CSS con ::after. No escribirla aquí.
- .gear__title es un <div>, no un encabezado.
- Suele ir justo debajo de .prep: comparten tema y se leen como un solo apartado.

**Contenido que necesita.** Por cada ficha: foto con alt, antetítulo, título, un párrafo y una lista de enlaces.

```html
<div class="gear">
<div>
<div class="gear__media"><img class="gear__img" src="https://santiagoways.com/wp-content/uploads/2026/04/post-checklist3.webp" alt="Equipamiento para hacer el Camino de Santiago" /></div>
<div class="gear__body">
<span class="gear__eyebrow">Equipaje</span>
<div class="gear__title">Lleva lo necesario</div>
<p class="gear__text">En el Camino, cada objeto ocupa espacio y puede añadir peso. Prioriza lo que realmente utilizarás durante las etapas.</p>
<div class="gear__links"><a class="gear__link" href="/?p=17560">Qué llevar al Camino</a><a class="gear__link" href="/?p=75237">Imprescindibles del Camino</a></div>
</div>
</div>
<div>
<div class="gear__media"><img class="gear__img" src="https://santiagoways.com/wp-content/uploads/2026/03/post-calzado-botas.webp" alt="Calzado y ropa para hacer el Camino de Santiago" /></div>
<div class="gear__body">
<span class="gear__eyebrow">Calzado y ropa</span>
<div class="gear__title">Prueba antes lo que vas a llevar</div>
<p class="gear__text">Prueba antes de viajar el calzado y las prendas que utilizarás durante las etapas y adapta la elección a la época del año.</p>
<div class="gear__links"><a class="gear__link" href="/?p=70798">Cómo elegir el calzado</a><a class="gear__link" href="/?p=12554">Qué ropa llevar</a></div>
</div>
</div>
</div>
```

---

## 8. Caja comercial · `.cta-box`

**Para qué.** Caja verde claro con titular, un párrafo y un botón. La llamada a la acción estándar dentro de un artículo.

**Reglas.**

- El HTML que circula por la web usa estilos inline en vez de las clases. Se ve igual, pero pierde el :hover del botón y el @media de 480 px que lo pone a ancho completo en móvil.
- Esta es la versión con clases, que es la que hay que usar a partir de ahora.
- Un solo botón: el CSS no contempla varios.
- El botón no lleva flecha en el original. Si la quieres, escríbela: el CSS no la pone.

**Contenido que necesita.** Un titular, un párrafo y un único botón.

```html
<div class="cta-box">
<h3 class="cta-box__title">¿Prefieres llegar al Camino con la logística ya organizada?</h3>
<p class="cta-box__text">En Santiago Ways organizamos <strong>Viajes Organizados autoguiados</strong> con Hoteles seleccionados, Traslado de Equipaje, Asistencia 24h y App de navegación, para que puedas caminar a tu ritmo con una parte importante del viaje preparada de antemano.</p>
<a class="cta-box__button" href="/?page_id=67170">Solicitar presupuesto</a>
</div>
```

---

## 9. Pasos numerados · `.steps`

**Para qué.** Pasos en vertical unidos por una línea verde continua, cada uno con su círculo numerado. El último se marca en verde oscuro.

**Opciones.**

| Modificador | Qué cambia |
|---|---|
| `.steps__number--final` | Pinta el círculo en verde noche. Marca el paso que cierra el recorrido. **No es automático**: se pone a mano |

**Reglas.**

- El HTML publicado venía envuelto en un <div style="position: relative; margin: 32px 0;"> que duplica lo que .steps ya hace y que además nunca se cierra. Aquí va sin él.
- steps__number--final (verde oscuro) NO es automático: de los dos bloques publicados, uno lo lleva en su último paso y el otro no. Se añade la clase al paso que cierre el recorrido, o a ninguno.
- Los números se escriben 1, 2, 3… sin cero delante, al revés que en tips y prep.
- La línea vertical va de 20 px desde arriba a 20 px desde abajo, así que con un solo paso no se ve.

**Contenido que necesita.** Por cada paso: un título y un texto.

```html
<div class="steps">
<div class="steps__item">
<div class="steps__number">1</div>
<h3 class="steps__title">Consigue la Credencial antes de comenzar</h3>
<p class="steps__text">Resuelve dónde obtener la <strong>Credencial del Peregrino</strong> antes de la primera etapa para poder registrar correctamente el recorrido desde el inicio.</p>
</div>
<div class="steps__item">
<div class="steps__number">2</div>
<h3 class="steps__title">Sella la Credencial durante el Camino</h3>
<p class="steps__text">Los sellos permiten acreditar tu paso por las diferentes etapas. Incorpora el sellado a la rutina diaria y conserva la Credencial durante todo el recorrido.</p>
</div>
<div class="steps__item">
<div class="steps__number">3</div>
<h3 class="steps__title">Comprueba los requisitos para obtener la Compostela</h3>
<p class="steps__text">Si conseguir la <strong>Compostela</strong> es importante para ti, revisa los requisitos oficiales antes de elegir el punto de inicio. La distancia, la modalidad de peregrinación y la forma de acreditar el recorrido pueden influir en su obtención.</p>
</div>
<div class="steps__item">
<div class="steps__number steps__number--final">4</div>
<h3 class="steps__title">Solicita la Compostela al llegar a Santiago</h3>
<p class="steps__text">Una vez terminada la peregrinación, podrás solicitarla en Santiago si cumples las condiciones establecidas y puedes acreditar correctamente el recorrido realizado.</p>
</div>
</div>
```

---

## 10. Nota al margen · `.note`

**Para qué.** Aviso discreto con filete verde a la izquierda. Para matices, advertencias y «ten en cuenta que…».

**Reglas.**

- El <strong> del título no lleva clase: el CSS solo estiliza el contenedor.
- El texto va en un <div>, no en un <p>: el CSS ajusta los márgenes del primer y el último hijo.
- Admite contenido libre dentro. Es el bloque más flexible del sistema.
- No lleva margen vertical propio: hereda el del flujo del artículo.

**Contenido que necesita.** Un título corto en negrita (opcional) y uno o varios párrafos.

```html
<div class="note">
<strong>Antes de viajar</strong>
<div>Los requisitos para obtener la Compostela y los procedimientos de atención pueden cambiar. Consulta siempre la información oficial actualizada antes de comenzar el Camino.</div>
</div>
```

---

## 11. Cita destacada · `.quote`

**Para qué.** Cita centrada en cursiva sobre un degradado verde muy claro, con filete a la izquierda y autor opcional.

**Reglas.**

- Las comillas angulares «» van escritas en el texto: el CSS no las pone.
- El autor es opcional. Cuando se usa, sale en mayúsculas y en verde por CSS: escríbelo en minúscula de frase.
- El texto es un <div>, no un <blockquote>.
- .quote__text lleva font-size con !important: no se puede ajustar desde fuera.

**Contenido que necesita.** El texto de la cita, con sus comillas angulares escritas, y el autor (opcional).

```html
<div class="quote">
<div class="quote__text">«Guarda energía para mañana. El Camino no se decide en una etapa, sino en la suma de muchos días caminando.»</div>
</div>
```

---

## 12. Consejos · `.tips`

**Para qué.** Consejos numerados separados por filetes. A tres columnas a partir de 768 px, en una sola columna por debajo.

**Reglas.**

- Dentro de cada .tips__item el segundo hijo es un <div> SIN clase que envuelve el título y el texto. Misma estructura que .prep__item.
- Los números van escritos en el HTML, con cero delante y en orden: 01, 02, 03…
- A tres columnas el orden de lectura es por columnas, no por filas: con un número de consejos que no sea múltiplo de 3 la última columna queda corta.
- El título es un <strong>, no un encabezado.

**Contenido que necesita.** Por cada consejo: un título y un texto.

```html
<div class="tips">
<div class="tips__item">
<div class="tips__number">01</div>
<div>
<strong class="tips__item-title">Empieza con margen</strong>
<p class="tips__text">Diseña etapas razonables, especialmente al principio. <strong>Lo importante no es lo que puedes caminar hoy, sino cómo llegarás a mañana.</strong></p>
</div>
</div>
<div class="tips__item">
<div class="tips__number">02</div>
<div>
<strong class="tips__item-title">Camina a tu ritmo</strong>
<p class="tips__text">Encontrarás peregrinos más rápidos y etapas más largas. <strong>Tu ritmo correcto es el que puedes mantener cómodamente durante varios días.</strong></p>
</div>
</div>
<!-- … 7 más, mismo patrón … -->
<div class="tips__item">
<div class="tips__number">10</div>
<div>
<strong class="tips__item-title">No busques un Camino perfecto</strong>
<p class="tips__text">Habrá lluvia, cansancio o cambios de planes. <strong>Saber adaptarte también forma parte de la experiencia.</strong></p>
</div>
</div>
</div>
```

---

## 13. Seguridad · `.safety`

**Para qué.** Bloques separados por filetes, cada uno con su etiqueta de color y una serie de avisos en columnas. Admite una caja de teléfono de emergencia.

**Opciones.**

| Modificador | Qué cambia |
|---|---|
| `.safety__item--wide` | Ensancha el aviso de 190 a 260 px. Se usa en el bloque que lleva la caja de emergencias |
| `.safety__tag--dark` | Etiqueta en verde noche sobre texto blanco. Para el momento crítico |
| `.safety__tag--soft` | Etiqueta en gris verdoso sobre texto oscuro. Para el momento intermedio |

**Reglas.**

- Los tres tonos de etiqueta marcan el momento: fuerte (verde) antes de salir, suave (gris verdoso) durante, oscuro (verde noche) si algo va mal.
- ancho: si pone safety__item--wide, que ensancha los avisos de 190 a 260 px. Se usa cuando el bloque lleva además la caja de emergencias.
- La caja de emergencias es el último hijo de .safety__items y comparte fila con los avisos.
- Los títulos son <strong>, no encabezados.

**Contenido que necesita.** Por cada bloque: la etiqueta del momento y sus avisos, con título y texto. El último puede llevar además un teléfono de emergencia con su rótulo y una nota.

```html
<div class="safety">
<div class="safety__block">
<div class="safety__tag-wrap"><span class="safety__tag">Antes de salir</span></div>
<div class="safety__items">
<div class="safety__item">
<strong class="safety__item-title">Comparte tu itinerario</strong>
<p class="safety__text">Haz que alguien conozca tu ruta general y dónde esperas terminar la etapa.</p>
</div>
<div class="safety__item">
<strong class="safety__item-title">Revisa la etapa</strong>
<p class="safety__text">Comprueba distancia, desnivel, meteorología, agua, comida y ubicación del siguiente alojamiento.</p>
</div>
<div class="safety__item">
<strong class="safety__item-title">Lleva lo esencial contigo</strong>
<p class="safety__text">Teléfono con batería, documentación y medicación personal deben viajar contigo, no en el equipaje trasladado.</p>
</div>
</div>
</div>
<div class="safety__block">
<div class="safety__tag-wrap"><span class="safety__tag safety__tag--soft">Durante la etapa</span></div>
<div class="safety__items">
<div class="safety__item">
<strong class="safety__item-title">Sigue la señalización</strong>
<p class="safety__text">Presta atención a flechas, mojones y cruces, especialmente en entradas y salidas de poblaciones.</p>
</div>
<div class="safety__item">
<strong class="safety__item-title">Comprueba tu posición si dudas</strong>
<p class="safety__text">Si dejas de ver señales durante un tiempo, verifica la ruta antes de continuar avanzando.</p>
</div>
<div class="safety__item">
<strong class="safety__item-title">Adapta el plan</strong>
<p class="safety__text">Calor, lluvia, viento o poca visibilidad pueden justificar reducir la etapa o cambiar la hora de salida.</p>
</div>
</div>
</div>
<div class="safety__block">
<div class="safety__tag-wrap"><span class="safety__tag safety__tag--dark">Si algo no va bien</span></div>
<div class="safety__items">
<div class="safety__item safety__item--wide">
<strong class="safety__item-title">Detente y valora la situación</strong>
<p class="safety__text">No continúes únicamente por cumplir el itinerario. Comprueba dónde estás y decide qué necesitas antes de seguir.</p>
</div>
<div class="safety__item safety__item--wide">
<strong class="safety__item-title">Pide ayuda cuando sea necesario</strong>
<p class="safety__text">Contacta con tu alojamiento o servicio de asistencia si el problema es logístico y busca atención profesional cuando exista una lesión o problema de salud.</p>
</div>
<div class="safety__emergency">
<div class="safety__emergency-label">Emergencias</div>
<div class="safety__emergency-number">112</div>
<p class="safety__text">España y Unión Europea.</p>
</div>
</div>
</div>
</div>
```

---

## 14. Errores frecuentes · `.mistakes`

**Para qué.** Cada fila enfrenta un error con su alternativa: a la izquierda qué se hace mal, a la derecha, en una caja verde, qué conviene hacer.

**Reglas.**

- La etiqueta «Mejor decisión» es fija: va igual en todas las filas y no se escribe.
- Los números van escritos en el HTML, con cero delante y en orden: 01, 02, 03…
- .mistakes__title es un <p>, no un encabezado, y va en peso 500: es la única pieza del sistema que no usa negrita para un título.
- La primera fila lleva un filete superior más grueso en verde noche, por CSS: no hay que marcarla.
- Las dos columnas se apilan por debajo de 280 px de ancho disponible.

**Contenido que necesita.** Por cada fila: el error, la explicación de en qué consiste y la alternativa. La etiqueta «Mejor decisión» es fija y va igual en todas.

```html
<div class="mistakes">
<div class="mistakes__item">
<div class="mistakes__main">
<div class="mistakes__head">
<span class="mistakes__number">01</span>
<p class="mistakes__title">Planificar las etapas solo por kilómetros</p>
</div>
<p class="mistakes__text">Asumir que dos etapas de 20 kilómetros tendrán una dificultad parecida simplemente porque la distancia es la misma.</p>
</div>
<div class="mistakes__better">
<div class="mistakes__better-label">Mejor decisión</div>
<p class="mistakes__text">Valora conjuntamente <strong>distancia, desnivel, terreno y acumulación de jornadas</strong> antes de cerrar cada etapa.</p>
</div>
</div>
<div class="mistakes__item">
<div class="mistakes__main">
<div class="mistakes__head">
<span class="mistakes__number">02</span>
<p class="mistakes__title">Elegir el punto de inicio solo por los días disponibles</p>
</div>
<p class="mistakes__text">Escoger dónde empezar únicamente porque el recorrido cabe dentro de las fechas de tus vacaciones.</p>
</div>
<div class="mistakes__better">
<div class="mistakes__better-label">Mejor decisión</div>
<p class="mistakes__text">Comprueba también <strong>la dificultad, las conexiones, los servicios y, si quieres obtenerla, los requisitos de la Compostela</strong>.</p>
</div>
</div>
<!-- … 3 más, mismo patrón … -->
<div class="mistakes__item">
<div class="mistakes__main">
<div class="mistakes__head">
<span class="mistakes__number">06</span>
<p class="mistakes__title">Olvidar la logística del primer y del último día</p>
</div>
<p class="mistakes__text">Contar únicamente los días de caminata sin reservar tiempo para llegar al punto de inicio y regresar desde Santiago.</p>
</div>
<div class="mistakes__better">
<div class="mistakes__better-label">Mejor decisión</div>
<p class="mistakes__text">Incluye los desplazamientos dentro del itinerario antes de cerrar las etapas. Si empiezas en Sarria, revisa previamente <a href="/?p=65546"><strong>cómo llegar a Sarria</strong></a> y cuánto tiempo necesitas.</p>
</div>
</div>
</div>
```

---

## 15. Llegada · `.arrival`

**Para qué.** Fichas con foto a media anchura, antetítulo, título y texto. Pensado para el cierre de un artículo: qué hacer al llegar.

**Reglas.**

- El antetítulo y el título van en la misma línea del HTML: el CSS pone el antetítulo en display:block y se apilan solos.
- El título es un <strong>, no un encabezado.
- Las fichas ocupan el 50% cada una, así que el bloque pide un número par.
- Las fotos se recortan a una altura fija con object-fit: cover. Mejor horizontales.

**Contenido que necesita.** Por cada ficha: foto con alt, antetítulo, título y texto.

```html
<div class="arrival">
<div class="arrival__item">
<div class="arrival__media"><img class="arrival__img" src="https://santiagoways.com/wp-content/uploads/2019/09/post-xacobeo-pareja.webp" alt="Peregrinos llegando a la Praza do Obradoiro frente a la Catedral de Santiago" /></div>
<div class="arrival__body">
<span class="arrival__eyebrow">Obradoiro</span><strong class="arrival__title">Disfruta de la llegada</strong>
<p class="arrival__text">Después de tantos kilómetros, no tengas prisa por pasar al siguiente plan. <strong>La llegada también forma parte del Camino.</strong></p>
</div>
</div>
<div class="arrival__item">
<div class="arrival__media"><img class="arrival__img" src="https://santiagoways.com/wp-content/uploads/2026/05/post-guia-sarria.webp" alt="Catedral de Santiago de Compostela" /></div>
<div class="arrival__body">
<span class="arrival__eyebrow">Catedral</span><strong class="arrival__title">Reserva tiempo para visitarla</strong>
<p class="arrival__text">La Catedral es el destino histórico de las rutas jacobeas y ayuda a entender por qué todos estos Caminos convergen en Santiago.</p>
</div>
</div>
<div class="arrival__item">
<div class="arrival__media"><img class="arrival__img" src="https://santiagoways.com/wp-content/uploads/2017/06/feature-credencial.webp" alt="Credencial del Peregrino y Compostela al finalizar el Camino de Santiago" /></div>
<div class="arrival__body">
<span class="arrival__eyebrow">Compostela</span><strong class="arrival__title">Solicítala si quieres obtenerla</strong>
<p class="arrival__text">Si has realizado el recorrido cumpliendo los requisitos establecidos, ten preparada tu <strong>Credencial del Peregrino</strong> al llegar.</p>
</div>
</div>
<div class="arrival__item">
<div class="arrival__media"><img class="arrival__img" src="https://santiagoways.com/wp-content/uploads/2020/04/camino-santiago-unesco-en.jpg" alt="Casco histórico de Santiago de Compostela después de terminar el Camino" /></div>
<div class="arrival__body">
<span class="arrival__eyebrow">Santiago</span><strong class="arrival__title">Quédate un poco más</strong>
<p class="arrival__text">Descansa, recorre el casco histórico y disfruta de la ciudad sin tener que pensar en la siguiente etapa.</p>
</div>
</div>
</div>
```

---

## 16. Ficha de datos · `.gr-ficha`

**Para qué.** Foto grande a un lado y, al otro, una lista de pares etiqueta/valor separados por filetes. Para resumir los datos de un punto de inicio o una ruta.

**Reglas.**

- El <img> NO lleva clase: el CSS lo selecciona con .gr-ficha__media img y lo coloca en absoluto dentro del contenedor.
- La foto ocupa más que el texto (flex 1.35 contra 0.65) y tiene 300 px de alto mínimo. Mejor horizontal.
- Cada dato lleva etiqueta, valor y una nota opcional en letra más pequeña.
- .gr-ficha__title es un <div>, no un encabezado.
- Por debajo de 700 px la foto pasa arriba y el texto debajo.

**Contenido que necesita.** Una foto con alt, un antetítulo, un título y los datos en tríos de etiqueta, valor y nota (la nota es opcional).

```html
<div class="gr-ficha">
<div class="gr-ficha__row">
<div class="gr-ficha__media"><img src="https://santiagoways.com/wp-content/uploads/2018/02/TUI.jpg" alt="Vista de Tui, en Pontevedra, punto de inicio del Camino Portugués" /></div>
<div class="gr-ficha__info">
<span class="gr-ficha__eyebrow">Antes de viajar</span>
<div class="gr-ficha__title">Tui de un vistazo</div>
<div class="gr-ficha__item">
<div class="gr-ficha__label">Ubicación</div>
<div class="gr-ficha__value">Pontevedra · Sur de Galicia</div>
<div class="gr-ficha__note">Junto a la frontera con Portugal</div>
</div>
<div class="gr-ficha__item">
<div class="gr-ficha__label">Principal conexión</div>
<div class="gr-ficha__value">Vigo</div>
<div class="gr-ficha__note">Un punto práctico de acceso por tren, avión y autobús</div>
</div>
<div class="gr-ficha__item">
<div class="gr-ficha__label">Ruta</div>
<div class="gr-ficha__value">Camino Portugués</div>
<div class="gr-ficha__note">Uno de sus puntos de inicio habituales en Galicia</div>
</div>
</div>
</div>
</div>
```

---

## 17. Línea de tiempo · `.timeline`

**Para qué.** Serie de años con el salto entre cada uno. Horizontal en escritorio, vertical en móvil, y uno de los años destacado.

**Opciones.**

| Modificador | Qué cambia |
|---|---|
| `.timeline__dot--current` | Punto destacado, grande y relleno. Marca el año actual |
| `.timeline__row--current` | Fila destacada con fondo verde claro. Vista móvil |
| `.timeline__row-year--current` | Año destacado dentro de la fila móvil |
| `.timeline__year--current` | Año destacado, más grande y en verde. Vista de escritorio |

**Reglas.**

- El contenido va DOS VECES en el HTML: .timeline__track para escritorio y .timeline__vertical para móvil. El CSS oculta una u otra a 600 px. Si falta una, el bloque desaparece en la mitad de las pantallas.
- El salto («5 años») es la diferencia con el año SIGUIENTE, así que el último punto no lleva salto.
- Los saltos van escritos en el HTML, uno por punto: 1999 → 2004 son «5 años».
- En la vista móvil el salto lleva una flecha ↓ delante que en escritorio no aparece.
- El año destacado es el que lleva etiqueta. En móvil su fila mete el año y la etiqueta dentro de un <div> extra que los demás no tienen.

**Contenido que necesita.** El título y los años en orden, con el salto que hay hasta el siguiente. Uno de los años lleva etiqueta y va destacado. Todo el contenido va dos veces, una por vista.

```html
<div class="timeline">
<h3 class="timeline__title">Los Años Santos siguen el patrón</h3>
<div class="timeline__track">
<div class="timeline__point">
<div class="timeline__line"></div>
<div class="timeline__gap">5 años</div>
<div class="timeline__marker">
<div class="timeline__dot"></div>
</div>
<div class="timeline__year">1999</div>
</div>
<div class="timeline__point">
<div class="timeline__line"></div>
<div class="timeline__gap">6 años</div>
<div class="timeline__marker">
<div class="timeline__dot"></div>
</div>
<div class="timeline__year">2004</div>
</div>
<!-- … 2 más, mismo patrón … -->
<div class="timeline__point">
<div class="timeline__line"></div>
<div class="timeline__gap">5 años</div>
<div class="timeline__marker">
<div class="timeline__dot timeline__dot--current"></div>
</div>
<div class="timeline__year timeline__year--current">2027</div>
<div class="timeline__label">Próximo Xacobeo</div>
</div>
<!-- … 2 más, mismo patrón … -->
<div class="timeline__point">
<div class="timeline__line"></div>
<div class="timeline__marker">
<div class="timeline__dot"></div>
</div>
<div class="timeline__year">2049</div>
</div>
</div>
<div class="timeline__vertical">
<div class="timeline__row">
<div class="timeline__row-dot"></div>
<span class="timeline__row-year">1999</span>
<span class="timeline__row-gap">↓ 5 años</span>
</div>
<div class="timeline__row">
<div class="timeline__row-dot"></div>
<span class="timeline__row-year">2004</span>
<span class="timeline__row-gap">↓ 6 años</span>
</div>
<!-- … 2 más, mismo patrón … -->
<div class="timeline__row timeline__row--current">
<div class="timeline__row-dot"></div>
<div>
<div class="timeline__row-year--current">2027</div>
<div class="timeline__row-label">Próximo Xacobeo</div>
</div>
<span class="timeline__row-gap">↓ 5 años</span>
</div>
<!-- … 2 más, mismo patrón … -->
<div class="timeline__row">
<div class="timeline__row-dot"></div>
<span class="timeline__row-year">2049</span>
</div>
</div>
</div>
```

---

## 18. Tarjetas con icono · `.cards`

**Para qué.** Rejilla de tarjetas blancas dentro de una caja verde claro. Cada tarjeta lleva un icono en un cuadrado, un título y un texto.

**Reglas.**

- El título de cada tarjeta usa .cards__title, que en el CSS es la clase del título del BLOQUE. La pensada para la tarjeta, .cards__title-card, no se usa en ninguna parte: es CSS muerto.
- Por eso los títulos salen al tamaño del cuerpo en vez de a 18 px. Se reproduce lo publicado para no cambiar el aspecto de las páginas vivas.
- El título va en un <p> y dentro lleva un <strong>: no es un encabezado.
- El icono es un emoji escrito en el HTML, dentro de un cuadrado de 42 px que pinta el CSS.
- Las tarjetas se reparten en columnas de 240 px mínimo.

**Contenido que necesita.** Por cada tarjeta: un emoji, un título y un texto.

```html
<div class="cards">
<div class="cards__grid">
<div class="cards__card">
<div class="cards__icon">🏨</div>
<p class="cards__title"><strong>El alojamiento puede agotarse antes de lo previsto</strong></p>
<p class="cards__text">Durante las fechas de mayor demanda, las plazas en las últimas etapas y en Santiago pueden agotarse con mucha antelación. No confíes en encontrar alojamiento sobre la marcha si viajas en Semana Santa, julio, agosto o principios de septiembre.</p>
</div>
<div class="cards__card">
<div class="cards__icon">🔔</div>
<p class="cards__title"><strong>Funcionamiento del Botafumeiro</strong></p>
<p class="cards__text">El <strong>Botafumeiro no funciona en todas las misas</strong>. Se utiliza en determinadas celebraciones litúrgicas o cuando ha sido solicitado previamente, por lo que ningún viaje debería presentarlo como una experiencia asegurada.</p>
</div>
<!-- … 2 más, mismo patrón … -->
<div class="cards__card">
<div class="cards__icon">📅</div>
<p class="cards__title"><strong>Horarios y programación</strong></p>
<p class="cards__text">No utilices como referencia definitiva los horarios de años anteriores. La <strong>programación religiosa y cultural de 2027</strong> se irá publicando progresivamente, por lo que conviene consultar siempre las fuentes actualizadas.</p>
</div>
</div>
</div>
```

---

## 19. Promo planificador · `.gr-planner`

**Para qué.** Promoción de la herramienta del planificador: a la izquierda el argumento y el botón, a la derecha una columna verde noche con una lista de ejemplo.

**Opciones.**

| Modificador | Qué cambia |
|---|---|
| `.gr-planner__item--done` | Marca la casilla como hecha: se rellena de verde |

**Reglas.**

- El orden en el HTML es head, side, body. NO head, body, side: la rejilla usa grid-template-areas, así que la columna oscura ocupa las dos filas aunque en el código vaya en medio.
- Las marcas de verificación de la lista las pone el CSS con ::before. No escribirlas.
- Las casillas de la columna oscura también son CSS: el cuadrado vacío por defecto, relleno de verde con gr-planner__item--done.
- Por debajo de 700 px la rejilla se deshace y el orden visual pasa a ser el del código: titular, columna oscura, cuerpo.
- Un solo botón: la rejilla no contempla varios.

**Contenido que necesita.** Antetítulo, titular, entradilla, lista de ventajas, botón y nota. Y en la columna oscura: un rótulo, una lista de ejemplo con las casillas marcadas o sin marcar, y una línea de total.

```html
<div class="gr-planner">
<div class="gr-planner__row">
<div class="gr-planner__head">
<span class="gr-planner__eyebrow">Herramienta gratuita</span>
<h3 class="gr-planner__title">¿No sabes qué meter en la mochila?</h3>
</div>
<div class="gr-planner__side">
<div class="gr-planner__side-label">Tu lista personalizada</div>
<div class="gr-planner__card">
<div class="gr-planner__item gr-planner__item--done">Pasaporte o DNI</div>
<div class="gr-planner__item gr-planner__item--done">Gorra</div>
<div class="gr-planner__item">Bastones de trekking</div>
<div class="gr-planner__item">Protección solar</div>
</div>
<div class="gr-planner__weight">Peso objetivo <strong>6,5 kg</strong></div>
</div>
<div class="gr-planner__body">
<p class="gr-planner__intro">Responde cuatro preguntas sobre tu ruta, tu época y tu tipo de alojamiento, y te damos tu lista de equipaje personalizada.</p>
<ul class="gr-planner__list">
<li>Adaptada a tu ruta y a la estación del año</li>
<li>Con el peso objetivo de tu mochila en kg</li>
<li>Descárgala en PDF o úsala desde el móvil</li>
</ul>
<a class="gr-planner__cta" href="https://santiagoways.com/planificador-mochila/">Crear mi lista</a>
<p class="gr-planner__note">Tarda menos de un minuto. Sin registro.</p>
</div>
</div>
</div>
```

---

## 20. Cifras · `.stats`

**Para qué.** Fila de tarjetas con una cifra grande y su etiqueta en mayúsculas, cada una con una barrita verde arriba. Para los datos de una etapa.

**Reglas.**

- La barrita verde superior es un <div> vacío: la pinta el CSS. Va siempre.
- El valor va antes que la etiqueta en el HTML, aunque se lean como un par.
- Las tarjetas se reparten el ancho a partes iguales con un mínimo de 120 px: con más de cuatro o cinco se vuelven estrechas.
- El valor no tiene límite de ancho: «+150 m aprox.» ya ocupa casi toda la tarjeta.

**Contenido que necesita.** Por cada tarjeta: el valor y su etiqueta.

```html
<div class="stats">
<div class="stats__card">
<div class="stats__bar"></div>
<div class="stats__body">
<div class="stats__value">16 km</div>
<div class="stats__label">Distancia</div>
</div>
</div>
<div class="stats__card">
<div class="stats__bar"></div>
<div class="stats__body">
<div class="stats__value">Fácil</div>
<div class="stats__label">Dificultad</div>
</div>
</div>
<div class="stats__card">
<div class="stats__bar"></div>
<div class="stats__body">
<div class="stats__value">+150 m aprox.</div>
<div class="stats__label">Desnivel</div>
</div>
</div>
</div>
```

---

## 21. Guías descargables · `.guides`

**Para qué.** Caja verde claro con un titular, una entradilla y tarjetas de guías, cada una con su botón. Para enlazar a contenidos largos desde dentro de un artículo.

**Reglas.**

- El título del bloque es <h3> y el de cada tarjeta <h4>: mantienen la jerarquía del documento. Es el único bloque que usa <h4>.
- Las tarjetas son flex 1 1 260px, así que a partir de tres por fila se parten solas.
- El botón no lleva flecha: el CSS no la pone y el original no la escribe.
- Las tarjetas van sobre fondo verde (#eaf3d9) dentro de una caja ya verde claro (#f7faf2): no meter más cajas dentro.

**Contenido que necesita.** Un título y una entradilla y, por cada guía: su título, una frase y un botón.

```html
<div class="guides">
<h3 class="guides__title">Antes de elegir, consulta las guías completas de cada ruta</h3>
<p class="guides__intro">Si todavía dudas entre empezar el Camino desde Sarria o desde Tui, estas guías te ayudarán a comparar etapas, kilómetros, servicios y consejos prácticos para organizar tu viaje.</p>
<div class="guides__grid">
<div class="guides__card">
<h4 class="guides__card-title">Camino Francés desde Sarria</h4>
<p class="guides__card-text">La opción más popular.</p>
<a class="guides__button" href="/?p=89222">Ver guía de Sarria</a>
</div>
<div class="guides__card">
<h4 class="guides__card-title">Camino Portugués desde Tui</h4>
<p class="guides__card-text">Una alternativa más tranquila.</p>
<a class="guides__button" href="/?p=89737">Ver guía de Tui</a>
</div>
</div>
</div>
```

---

## 22. Características · `.features`

**Para qué.** Rejilla de tarjetas blancas con un icono en imagen, un título y una línea de texto. Para resumir qué incluye un servicio.

**Reglas.**

- Los iconos llevan alt="" A PROPÓSITO: son decorativos y el título que va justo debajo ya dice lo mismo. Ponerles texto alternativo haría que los lectores de pantalla lo repitieran.
- El <img> no lleva clase: el CSS lo selecciona con .features__icon img y lo fuerza a 40 × 40.
- Aun así el original escribe width="40" height="40" en el HTML, que es lo correcto: reserva el hueco y evita que la página salte al cargar.
- El título es <h3>, un encabezado de verdad: entra en el índice de la página.
- A diferencia de cards, este bloque no va dentro de una caja: las tarjetas flotan sobre el fondo del artículo.

**Contenido que necesita.** Por cada tarjeta: la url del icono, un título y una frase.

```html
<div class="features">
<div class="features__grid">
<div class="features__card">
<div class="features__icon"><img src="https://santiagoways.com/wp-content/uploads/2026/04/brujula-1.png" alt="" width="40" height="40" /></div>
<h3 class="features__title">Organización completa</h3>
<p class="features__text">Nos encargamos de todo para que disfrutes sin preocuparte por la logística.</p>
</div>
<div class="features__card">
<div class="features__icon"><img src="https://santiagoways.com/wp-content/uploads/2026/04/hotel-1.png" alt="" width="40" height="40" /></div>
<h3 class="features__title">Alojamientos seleccionados</h3>
<p class="features__text">Hoteles y casas rurales que garantizan descanso y calidad.</p>
</div>
<!-- … 2 más, mismo patrón … -->
<div class="features__card">
<div class="features__icon"><img src="https://santiagoways.com/wp-content/uploads/2026/04/auriculares.png" alt="" width="40" height="40" /></div>
<h3 class="features__title">Asistencia durante el viaje</h3>
<p class="features__text">Te acompañamos antes y durante todo el Camino.</p>
</div>
</div>
</div>
```

---

## 23. Listas de comprobación · `.checklist`

**Para qué.** Caja verde claro con un titular, una entradilla y tarjetas blancas, cada una con su lista. Para la típica checklist de equipaje.

**Reglas.**

- El título del bloque es <h2>, no <h3>. Es el único bloque del sistema, aparte del hero, que usa ese nivel: dentro de un artículo que ya tiene <h2>, conviene usar <h3> en su lugar.
- El título de cada tarjeta es <h3>.
- Los emojis van escritos en el título de la tarjeta, delante del texto.
- La lista es un <ul> normal: las viñetas son las del navegador, el CSS solo ajusta sangría e interlineado.
- Las tarjetas se reparten en columnas de 220 px mínimo, así que caben bastantes por fila.

**Contenido que necesita.** Un título, una entradilla y, por cada tarjeta: su título con el emoji delante y los puntos de la lista.

```html
<div class="checklist">
<h2 class="checklist__title">Checklist rápida para copiar antes del Camino</h2>
<p class="checklist__intro">Revisa esta lista antes de salir y asegúrate de llevar solo lo imprescindible.</p>
<div class="checklist__grid">
<div class="checklist__card">
<h3 class="checklist__card-title">📄 Documentación</h3>
<ul class="checklist__list">
<li>DNI o pasaporte</li>
<li>Credencial</li>
<li>Tarjeta sanitaria o seguro</li>
</ul>
</div>
<div class="checklist__card">
<h3 class="checklist__card-title">👕 Ropa</h3>
<ul class="checklist__list">
<li>2 camisetas técnicas</li>
<li>Impermeable</li>
<li>1–2 pantalones</li>
<li>Calcetines técnicos</li>
<li>Ropa interior</li>
</ul>
</div>
<!-- … 2 más, mismo patrón … -->
<div class="checklist__card">
<h3 class="checklist__card-title">🔋 Electrónica</h3>
<ul class="checklist__list">
<li>Móvil</li>
<li>Cargador</li>
<li>Power bank</li>
</ul>
</div>
</div>
</div>
```

---

## 24. Recorrido de etapas · `.roadmap`

**Para qué.** Las paradas de una ruta sobre una línea, con la salida y la llegada destacadas. Horizontal en escritorio, vertical por debajo de 600 px.

**Opciones.**

| Modificador | Qué cambia |
|---|---|
| `.roadmap__dot--end` | Punto de llegada: relleno en verde oscuro y más grande |
| `.roadmap__dot--start` | Punto de salida: relleno en verde Ways y más grande |
| `.roadmap__marker--endpoint` | Ajusta el margen del marcador en salida y llegada. Va con los dos anteriores |
| `.roadmap__name--endpoint` | Nombre más grande y en negrita, para salida y llegada |

**Reglas.**

- La primera y la última parada son distintas: marker--endpoint, dot--start o dot--end, antetítulo y name--endpoint. Las intermedias no llevan antetítulo.
- Es el único bloque que viene indentado; el resto llega plano. Se respeta su formato.
- Cada parada repite su propio .roadmap__line: la línea no es una sola, son tantos tramos como paradas.
- Con muchas paradas la rejilla las parte en varias filas y los tramos de línea no se conectan entre filas. El tope cómodo son 7 u 8.
- El antetítulo usa #668814 a 12 px: es uno de los textos que no llega al contraste AA.

**Contenido que necesita.** Las paradas en orden. La primera y la última llevan además un antetítulo («Inicio» y «Meta», o lo que corresponda).

```html
<div class="roadmap">
  <div class="roadmap__track">
    <div class="roadmap__stop">
      <div class="roadmap__line"></div>
      <div class="roadmap__marker roadmap__marker--endpoint">
        <div class="roadmap__dot roadmap__dot--start"></div>
      </div>
      <div class="roadmap__eyebrow">Inicio</div>
      <div class="roadmap__name roadmap__name--endpoint">Vilalba</div>
    </div>
    <div class="roadmap__stop">
      <div class="roadmap__line"></div>
      <div class="roadmap__marker">
        <div class="roadmap__dot"></div>
      </div>
      <div class="roadmap__name">Baamonde</div>
    </div>
    <!-- … 4 más, mismo patrón … -->
    <div class="roadmap__stop">
      <div class="roadmap__line"></div>
      <div class="roadmap__marker roadmap__marker--endpoint">
        <div class="roadmap__dot roadmap__dot--end"></div>
      </div>
      <div class="roadmap__eyebrow">Meta</div>
      <div class="roadmap__name roadmap__name--endpoint">Santiago de Compostela</div>
    </div>
  </div>
</div>
```

---

