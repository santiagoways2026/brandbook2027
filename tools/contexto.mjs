/* ============================================================
   Genera design-system/contexto-ia.md

       node tools/contexto.mjs

   El documento es autocontenido: está pensado para pegarlo en otra IA
   como contexto, de forma que pueda producir el HTML de un bloque solo
   con que se le diga su nombre.

   Se construye desde las fuentes reales (los módulos y los
   bloques/<id>.html), así que no se desincroniza. Si cambia un bloque,
   se vuelve a lanzar.
   ============================================================ */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const { MODULOS } = await import('file://' + join(RAIZ, 'app/modulos/index.js'));

/* ---------- modificadores y variables, leídos del CSS ---------- */

const CSS = ['design-system/bloques.css', 'design-system/tabla-responsive.css']
  .map((f) => readFileSync(join(RAIZ, f), 'utf8'))
  .join('\n');

const ALIAS = { 'tabla-responsive-wrap': 'tabla-responsive' };
const raizDe = (clase) => {
  const base = clase.split(/__|--/)[0];
  return ALIAS[base] || base;
};

const modificadores = {};
for (const m of CSS.matchAll(/\.([A-Za-z][A-Za-z0-9_-]*--[A-Za-z0-9_-]+)/g)) {
  const r = raizDe(m[1]);
  (modificadores[r] = modificadores[r] || new Set()).add(m[1]);
}

/* Qué hace cada modificador, para la tabla de opciones de su bloque. */
const PIE = {
  'steps__number--final': 'Pinta el círculo en verde noche. Marca el paso que cierra el recorrido. **No es automático**: se pone a mano',
  'roads--alt': 'Cambia el fondo de crema (#FAF8F2) a verde claro (#F4F8EC). Para alternar cuando van dos secciones seguidas',
  'roadmap__dot--start': 'Punto de salida: relleno en verde Ways y más grande',
  'roadmap__dot--end': 'Punto de llegada: relleno en verde oscuro y más grande',
  'roadmap__marker--endpoint': 'Ajusta el margen del marcador en salida y llegada. Va con los dos anteriores',
  'roadmap__name--endpoint': 'Nombre más grande y en negrita, para salida y llegada',
  'safety__tag--soft': 'Etiqueta en gris verdoso sobre texto oscuro. Para el momento intermedio',
  'safety__tag--dark': 'Etiqueta en verde noche sobre texto blanco. Para el momento crítico',
  'safety__item--wide': 'Ensancha el aviso de 190 a 260 px. Se usa en el bloque que lleva la caja de emergencias',
  'timeline__dot--current': 'Punto destacado, grande y relleno. Marca el año actual',
  'timeline__year--current': 'Año destacado, más grande y en verde. Vista de escritorio',
  'timeline__row--current': 'Fila destacada con fondo verde claro. Vista móvil',
  'timeline__row-year--current': 'Año destacado dentro de la fila móvil',
  'gr-planner__item--done': 'Marca la casilla como hecha: se rellena de verde',
};

/* Las reglas de los módulos están escritas para la herramienta, que genera
   sola los números y los porcentajes. Quien escriba el HTML a mano sí tiene
   que ponerlos, así que esas frases se reescriben. */
const REESCRIBE = [
  [
    'El número (01, 02…) se genera solo según el orden: no se escribe.',
    'Los números van escritos en el HTML, con cero delante y en orden: 01, 02, 03…',
  ],
  [
    'Los números (01, 02…) se generan solos según el orden: no se escriben.',
    'Los números van escritos en el HTML, con cero delante y en orden: 01, 02, 03…',
  ],
  [
    'Los números (01, 02…) se generan solos según el orden.',
    'Los números van escritos en el HTML, con cero delante y en orden: 01, 02, 03…',
  ],
  [
    'El porcentaje se calcula solo: la ruta más larga de cada fila es el 100% y las demás van en proporción. Se puede forzar escribiéndolo.',
    'El porcentaje es la proporción de kilómetros respecto a la ruta más larga de su propia fila: 115 de 160 km son 72 %, 260 de 315 son 83 %. Se escribe redondeado al entero.',
  ],
  [
    // La regla anterior ya explica qué es el salto; aquí solo falta decir
    // que va escrito, porque la herramienta sí lo calcula sola.
    'Los saltos se calculan solos a partir de los años: no se escriben.',
    'Los saltos van escritos en el HTML, uno por punto: 1999 → 2004 son «5 años».',
  ],
  [
    'Se marca a mano con «final: si».',
    'Se añade la clase al paso que cierre el recorrido, o a ninguno.',
  ],
  [
    'conviene bajarlo con «nivel: h3».',
    'conviene usar <h3> en su lugar.',
  ],
];

/* Qué contenido necesita cada bloque, en términos de la pieza, no del
   formato de entrada de la herramienta. */
const PIEZAS = {
  'tabla-responsive':
    'Una fila de cabecera con el nombre de cada columna y una fila por registro. La primera columna hace de título de la tarjeta en móvil, así que conviene que sea la más identificativa.',
  heroblogsw:
    'Una foto con su texto alternativo, una etiqueta corta (opcional), un titular y hasta dos botones (opcionales).',
  roads:
    'Un titular y un subtítulo para la sección y, por cada ruta: foto con alt, banderola de dos o tres palabras, nombre, descripción, una o varias etiquetas y el texto del enlace.',
  finder:
    'Por cada tarjeta: una categoría corta, una pregunta, una frase de contexto y uno o varios enlaces de respuesta.',
  durations:
    'Por cada fila: antetítulo, titular grande, píldora con el rango, una entradilla y las rutas con su nombre, sus kilómetros y el porcentaje de la barra. Opcionalmente, una nota al pie.',
  prep:
    'Una foto con alt, un antetítulo, un título y los puntos, cada uno con su título y su texto.',
  gear:
    'Por cada ficha: foto con alt, antetítulo, título, un párrafo y una lista de enlaces.',
  'cta-box': 'Un titular, un párrafo y un único botón.',
  steps: 'Por cada paso: un título y un texto.',
  note: 'Un título corto en negrita (opcional) y uno o varios párrafos.',
  quote: 'El texto de la cita, con sus comillas angulares escritas, y el autor (opcional).',
  tips: 'Por cada consejo: un título y un texto.',
  safety:
    'Por cada bloque: la etiqueta del momento y sus avisos, con título y texto. El último puede llevar además un teléfono de emergencia con su rótulo y una nota.',
  mistakes:
    'Por cada fila: el error, la explicación de en qué consiste y la alternativa. La etiqueta «Mejor decisión» es fija y va igual en todas.',
  arrival: 'Por cada ficha: foto con alt, antetítulo, título y texto.',
  'gr-ficha':
    'Una foto con alt, un antetítulo, un título y los datos en tríos de etiqueta, valor y nota (la nota es opcional).',
  timeline:
    'El título y los años en orden, con el salto que hay hasta el siguiente. Uno de los años lleva etiqueta y va destacado. Todo el contenido va dos veces, una por vista.',
  cards: 'Por cada tarjeta: un emoji, un título y un texto.',
  'gr-planner':
    'Antetítulo, titular, entradilla, lista de ventajas, botón y nota. Y en la columna oscura: un rótulo, una lista de ejemplo con las casillas marcadas o sin marcar, y una línea de total.',
  stats: 'Por cada tarjeta: el valor y su etiqueta.',
  guides: 'Un título y una entradilla y, por cada guía: su título, una frase y un botón.',
  features: 'Por cada tarjeta: la url del icono, un título y una frase.',
  checklist:
    'Un título, una entradilla y, por cada tarjeta: su título con el emoji delante y los puntos de la lista.',
  roadmap:
    'Las paradas en orden. La primera y la última llevan además un antetítulo («Inicio» y «Meta», o lo que corresponda).',
};

const VARIABLES = {
  'tabla-responsive': [
    ['--tabla-acento-1', 'verde claro, inicio del degradado', '#7AA606'],
    ['--tabla-acento-2', 'verde oscuro, fin del degradado y etiquetas', '#668814'],
    ['--tabla-texto', 'color del texto de las celdas', '#111111'],
    ['--tabla-borde', 'líneas y bordes', '#e5e7eb'],
    ['--tabla-cebra', 'fondo de las filas pares', '#fafaf9'],
    ['--tabla-radio', 'radio de las esquinas', '16px'],
  ],
};

/* ---------- lectura y recorte del markup ---------- */

function referencia(id) {
  return readFileSync(join(RAIZ, 'bloques', id + '.html'), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}

/* Clase del elemento que se repite dentro de cada bloque. Cuando hay
   muchos, el markup se recorta: para explicar el patrón bastan dos. */
const REPETIDO = {
  finder: ['finder__card'],
  steps: ['steps__item'],
  tips: ['tips__item'],
  mistakes: ['mistakes__item'],
  arrival: ['arrival__item'],
  cards: ['cards__card'],
  features: ['features__card'],
  checklist: ['checklist__card'],
  roadmap: ['roadmap__stop'],
  timeline: ['timeline__point', 'timeline__row'],
};

/**
 * Deja los dos primeros elementos, todos los que lleven modificador y el
 * último, y marca con un comentario lo que se ha quitado. Los que llevan
 * modificador se conservan porque son justo los casos especiales.
 */
function recortar(html, clases) {
  let lineas = html.split('\n');

  for (const clase of clases) {
    const abre = new RegExp('^(\\s*)<[a-z]+ class="' + clase + '(?:[ "])');
    const indices = [];
    lineas.forEach((l, i) => { if (abre.test(l)) indices.push(i); });
    if (indices.length <= 4) continue;

    const trozos = indices.map((ini, n) => ({
      ini,
      fin: n + 1 < indices.length ? indices[n + 1] : null,
    }));
    const finReal = (t) => (t.fin === null ? lineas.length : t.fin);

    // El último trozo llega hasta donde empiezan los cierres del contenedor.
    const ultimo = trozos[trozos.length - 1];
    let corte = lineas.length;
    const sangria = lineas[ultimo.ini].match(/^\s*/)[0];
    for (let i = ultimo.ini + 1; i < lineas.length; i++) {
      if (lineas[i] === sangria + '</div>') { corte = i + 1; break; }
    }

    const conservar = new Set([0, 1, trozos.length - 1]);
    trozos.forEach((t, n) => {
      const cuerpo = lineas.slice(t.ini, n === trozos.length - 1 ? corte : finReal(t)).join('\n');
      if (cuerpo.includes('--')) conservar.add(n);
    });

    const salida = lineas.slice(0, indices[0]);
    let omitidos = 0;
    trozos.forEach((t, n) => {
      const hasta = n === trozos.length - 1 ? corte : finReal(t);
      if (conservar.has(n)) {
        if (omitidos) {
          salida.push(sangria + `<!-- … ${omitidos} más, mismo patrón … -->`);
          omitidos = 0;
        }
        salida.push(...lineas.slice(t.ini, hasta));
      } else {
        omitidos++;
      }
    });
    salida.push(...lineas.slice(corte));
    lineas = salida;
  }

  return lineas.join('\n');
}

/* ---------- documento ---------- */

const hoy = new Date().toISOString().slice(0, 10);
const doc = [];

doc.push(`# Bloques de Santiago Ways · contexto para IA

Documento autocontenido con los **${MODULOS.length} bloques** de santiagoways.com: para qué
sirve cada uno, qué opciones admite y su marcado exacto.

**Para qué es.** Pégalo como contexto en cualquier IA. A partir de ahí basta con pedirle
«hazme un bloque de consejos con estos cinco puntos» o «pásame esta tabla a bloque» y
tendrá todo lo que necesita para devolver el HTML correcto.

Si solo vas a trabajar con uno o dos bloques, pega la sección «Reglas generales» más el
apartado de esos bloques: el documento entero es largo.

Generado el ${hoy} desde el código real del proyecto.

---

## Reglas generales

Estas van siempre, para cualquier bloque.

1. **No se inventan clases.** Solo existen las que aparecen en este documento. Una clase
   que no esté aquí no tiene CSS detrás y se verá como texto sin formato.
2. **No se escriben atributos \`style\`.** Solo hay dos excepciones, ambas documentadas en
   su bloque: \`--pct\` en \`.durations__bar\` y las variables de tema de
   \`.tabla-responsive\`. En los dos casos el atributo es el dato, no el estilo.
3. **No se añade \`id\`, \`role\` ni \`aria-*\`** que no esté en el marcado de referencia. La
   única excepción es \`data-label\`, obligatorio en \`.tabla-responsive\`.
4. **Se respeta el nivel de cada encabezado.** Muchos títulos de este sistema son \`<div>\`,
   \`<p>\` o \`<strong>\` a propósito, no encabezados. Cambiarlos altera el índice de la
   página y lo que leen los lectores de pantalla.
5. **Se respeta el formato.** Casi todos los bloques vienen con una etiqueta por línea y
   sin indentar. \`roadmap\` es la excepción: viene indentado.
6. **Nada de frameworks** (Bootstrap, Tailwind) ni clases de utilidad.
7. **Se escapan \`&\`, \`<\`, \`>\` y \`"\`** en el contenido que venga del usuario.

### Símbolos: unos los pone el CSS y otros van escritos

Es el error más fácil de cometer. Escribir un símbolo donde ya lo pone el CSS lo duplica;
no escribirlo donde toca lo pierde.

| Dónde | Símbolo | Quién lo pone |
|---|---|---|
| \`.finder__link\` | \`›\` | **CSS**, no escribir |
| \`.durations__link\` | \`›\` | **CSS**, no escribir |
| \`.gear__link\` | \`→\` | **CSS**, no escribir |
| \`.gr-planner__list li\` | marca de verificación | **CSS**, no escribir |
| \`.gr-planner__item\` | casilla | **CSS**, no escribir |
| \`.heroblogsw__button\` | \`→\` | se escribe en el HTML |
| \`.heroblogsw__badge\` | \`✔\` | se escribe en el HTML |
| \`.roads__link\` | \`→\` | se escribe en el HTML |
| \`.quote__text\` | \`«»\` | se escribe en el HTML |
| \`.timeline__row-gap\` | \`↓\` | se escribe en el HTML, y solo en la vista móvil |
| \`.cards__icon\`, \`.checklist__card-title\` | emoji | se escribe en el HTML |

### Divs sin clase que hacen falta

No son descuido. En \`.prep__item\` y \`.tips__item\` el segundo hijo es un \`<div>\` **sin
clase** que envuelve título y texto: el contenedor es flex y sin él las piezas se colocan
mal. En \`.gear\`, cada ficha es un \`<div>\` sin clase que envuelve \`__media\` y \`__body\`, y
es ese div el que ocupa la celda de la rejilla. En \`.timeline__row--current\` hay otro que
agrupa el año y su etiqueta.

### Colores

El sistema es verde. No hay azules ni rojos.

| Color | Hex | Uso |
|---|---|---|
| Verde Ways | \`#7AA606\` | Fondos, botones, puntos, barras. **Nunca texto sobre blanco** |
| Verde oscuro | \`#668814\` | Antetítulos, etiquetas, cifras, enlaces |
| Verde noche | \`#184834\` | Fondos oscuros y el paso final de \`steps\` |
| Lima | \`#9DDB07\` | Solo la banderola de \`roads\` |
| Verde claro | \`#f7faf2\` | Fondo de las cajas |

Todos están ya en el CSS: no hay que escribirlos nunca en el HTML.

---

## Índice

| # | Bloque | Clase | Para qué |
|---|---|---|---|`);

MODULOS.forEach((m, i) => {
  doc.push(`| ${i + 1} | ${m.nombre} | \`${m.clase}\` | ${m.descripcion.split('.')[0]}. |`);
});

doc.push('\n---\n');

MODULOS.forEach((m, i) => {
  doc.push(`## ${i + 1}. ${m.nombre} · \`${m.clase}\`\n`);
  doc.push(`**Para qué.** ${m.descripcion}\n`);

  const mods = [...(modificadores[m.id] || [])].sort();
  const vars = VARIABLES[m.id];
  if (mods.length || vars) {
    doc.push('**Opciones.**\n');
    if (mods.length) {
      doc.push('| Modificador | Qué cambia |');
      doc.push('|---|---|');
      for (const mod of mods) doc.push(`| \`.${mod}\` | ${PIE[mod] || 'ver reglas'} |`);
      doc.push('');
    }
    if (vars) {
      doc.push('Variables de tema, redefinibles en el propio elemento con `style`:\n');
      doc.push('| Variable | Qué es | Por defecto |');
      doc.push('|---|---|---|');
      for (const [v, q, d] of vars) doc.push(`| \`${v}\` | ${q} | \`${d}\` |`);
      doc.push('');
    }
  }

  doc.push('**Reglas.**\n');
  for (const r of m.reglas) {
    let texto = r;
    for (const [viejo, nuevo] of REESCRIBE) texto = texto.replace(viejo, nuevo);
    doc.push(`- ${texto}`);
  }
  doc.push('');

  doc.push('**Contenido que necesita.** ' + (PIEZAS[m.id] || '') + '\n');

  const clases = REPETIDO[m.id];
  const html = clases ? recortar(referencia(m.id), clases) : referencia(m.id);
  doc.push('```html');
  doc.push(html);
  doc.push('```\n');

  if (m.id === 'roads') {
    doc.push('Variante de fondo verde claro, para alternar cuando van dos seguidas: la misma');
    doc.push('estructura con `<section class="roads roads--alt">`.\n');
  }
  doc.push('---\n');
});

writeFileSync(join(RAIZ, 'design-system/contexto-ia.md'), doc.join('\n') + '\n', 'utf8');
console.log(
  'design-system/contexto-ia.md: ' + MODULOS.length + ' bloques, ' +
  doc.join('\n').split('\n').length + ' líneas'
);
