// Plantilla Word Santiago Ways (Brandbook 2027) · versión sobria
// Uso: node build.js recursos|blanco salida.docx
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, AlignmentType,
  HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  LevelFormat, PageNumber, PageBreak, TabStopType, VerticalAlign, TableLayoutType, HeightRule,
} = require('docx');

const MODE = process.argv[2] || 'recursos';
const OUT = process.argv[3] || 'plantilla.docx';
const D = __dirname;
const img = (f) => fs.readFileSync(path.join(D, f));

const C = {
  ways: '7AA606', sendero: '506718', grafito: '2E2E2D', gris: '6F6F6E',
  niebla: 'E8E8E6', brote: 'FAFFEE', blanco: 'FFFFFF',
};
const F = 'Montserrat';
const FX = 'Montserrat ExtraBold';
const PW = 11906, PH = 16838, ML = 1418;
const W = PW - 2 * ML; // 9070: ancho útil

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NB = { top: NONE, bottom: NONE, left: NONE, right: NONE };
const TB = { ...NB, insideHorizontal: NONE, insideVertical: NONE };
const hair = (color = C.niebla, size = 4) => ({ style: BorderStyle.SINGLE, size, color });

const LOREM = {
  a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla.',
  b: 'Maecenas sed diam eget risus varius blandit sit amet non magna. Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur.',
  c: 'Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
  s: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet.',
  xs: 'Donec ullamcorper nulla non metus auctor fringilla.',
};

// ---------- helpers ----------
const run = (text, o = {}) => new TextRun({ text, ...o });
const P = (text, o = {}) => new Paragraph({ children: [run(text)], ...o });
const S = (style, text, o = {}) => new Paragraph({ style, children: [run(text)], ...o });
const eyebrow = (t, o = {}) => S('Antetitulo', t, o);
const newPage = (t) => S('Antetitulo', t, { pageBreakBefore: true });
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(t)] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(t)] });
const H3 = (t, o = {}) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [run(t)], ...o });
const bullet = (t, ref = 'vinetas') => new Paragraph({ style: 'Lista', numbering: { reference: ref, level: 0 }, children: [run(t)] });
const num = (t, instance = 0) => new Paragraph({ style: 'Lista', numbering: { reference: 'numeros', level: 0, instance }, children: [run(t)] });
const gap = (after = 0, before = 0) => new Paragraph({ spacing: { before, after, line: 240, lineRule: 'auto' }, children: [run('', { size: 4 })] });
// filete corto: borde inferior de un párrafo con sangría derecha
const rule = (len = 680, color = C.ways, size = 18) => new Paragraph({
  spacing: { before: 0, after: 280, line: 120, lineRule: 'exact' }, indent: { right: W - len },
  border: { bottom: { style: BorderStyle.SINGLE, size, color, space: 0 } }, children: [],
});
const pageBreak = () => new Paragraph({ spacing: { after: 0 }, children: [new PageBreak()] });

function cell(children, width, o = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA }, borders: { ...NB, ...(o.borders || {}) },
    margins: o.margins || { top: 0, bottom: 0, left: 0, right: 0 },
    verticalAlign: o.v || VerticalAlign.TOP,
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
    children,
  });
}
function grid(widths, rows, o = {}) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths,
    layout: TableLayoutType.FIXED, borders: TB, indent: o.indent,
    rows: rows.map((r) => new TableRow({ children: r, cantSplit: true, height: o.height })),
  });
}

// ---------- imágenes ----------
const logoH = img('logo.png');
const logoV = img('logo-vertical.png');
const LOGO = (w) => new ImageRun({ type: 'png', data: logoH, transformation: { width: w, height: Math.round(w * 173 / 1080) } });

// ---------- tabla de datos ----------
function dataTable(head, rows, widths, foot, aligns) {
  const isNum = (i) => (aligns ? aligns[i] === 'r' : i > 0 && /^[\d.,\s€%]+$/.test(rows[0][i]));
  const c = (t, i, kind) => cell([new Paragraph({
    style: kind === 'h' ? 'TablaCabecera' : 'TablaTexto',
    alignment: isNum(i) ? AlignmentType.RIGHT : AlignmentType.LEFT,
    children: [run(t, kind === 'f' ? { bold: true } : {})],
  })], widths[i], {
    v: VerticalAlign.CENTER,
    margins: { top: 120, bottom: 120, left: i === 0 ? 0 : 120, right: i === widths.length - 1 ? 0 : 120 },
    borders: kind === 'h' ? { bottom: hair(C.grafito, 8) } : kind === 'f' ? { top: hair(C.grafito, 8) } : { bottom: hair() },
  });
  const all = [
    new TableRow({ tableHeader: true, children: head.map((t, i) => c(t, i, 'h')) }),
    ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((t, i) => c(t, i, 'r')) })),
  ];
  if (foot) all.push(new TableRow({ children: foot.map((t, i) => c(t, i, 'f')) }));
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED, borders: TB, rows: all });
}

// ---------- caja de nota (brote con filete fino) ----------
function note(title, text) {
  return grid([W], [[cell([
    S('Antetitulo', title, { spacing: { after: 60 } }),
    S('CajaTexto', text),
  ], W, { fill: C.brote, borders: { left: hair(C.sendero, 12) }, margins: { top: 220, bottom: 220, left: 300, right: 300 } })]]);
}

// ---------- metadatos de portada ----------
function metaTable(indent) {
  const items = [['Autor', 'Nombre Apellido'], ['Área', 'Marketing'], ['Fecha', 'dd/mm/aaaa'], ['Versión', '1.0']];
  const w = W / 4;
  return grid(items.map(() => w), [items.map(([k, v]) => cell([
    S('MetaEtiqueta', k), S('MetaValor', v),
  ], w, { borders: { top: hair(C.grafito, 6) }, margins: { top: 160, bottom: 0, left: 0, right: 200 } }))], { indent });
}

// ================= PÁGINAS =================

// 1 · Portada A, tipográfica
const portadaA = [
  new Paragraph({ spacing: { after: 0 }, children: [LOGO(200)] }),
  gap(0, 4300),
  rule(680, C.ways, 18),
  eyebrow('Informe · 2027'),
  new Paragraph({ style: 'Title', children: [run('Título del documento en una o dos líneas')] }),
  S('Subtitulo', 'Subtítulo o descripción breve del contenido del documento.'),
];

// 2 · Portada B, con foto a sangre
const IND = { left: ML, right: ML };
const portadaB = [
  new Paragraph({ spacing: { after: 0 }, children: [new ImageRun({ type: 'jpg', data: img('f-portada.jpg'), transformation: { width: 794, height: 540 } })] }),
  new Paragraph({ indent: IND, spacing: { before: 720, after: 0 }, children: [LOGO(170)] }),
  gap(0, 1100),
  eyebrow('Dossier · 2027', { indent: IND }),
  new Paragraph({ style: 'Title', indent: IND, children: [run('Título del documento en una o dos líneas')] }),
  S('Subtitulo', 'Subtítulo o descripción breve del contenido del documento.', { indent: IND }),
];

// 3 · Índice
const indexRows = [
  ['01', 'Resumen ejecutivo', 'Separador y página de resumen con ideas clave.', '4'],
  ['02', 'Introducción', 'Página de texto con entradilla y cita.', '6'],
  ['03', 'Datos y tablas', 'Tabla de datos y caja de nota.', '7'],
  ['04', 'Cifras clave', 'Infografía: cifras, barras y proceso.', '8'],
  ['05', 'Puntos clave', 'Listas en dos columnas e ideas numeradas.', '9'],
  ['06', 'Imagen y texto', 'Foto ancha y foto con texto al lado.', '10'],
  ['07', 'Itinerario', 'Ficha de ruta día a día.', '11'],
  ['08', 'Comparativa', 'Tabla para comparar opciones.', '12'],
  ['09', 'Plan de trabajo', 'Cronograma por meses e hitos.', '13'],
  ['10', 'Testimonios', 'Opiniones de viajeros.', '14'],
  ['11', 'Preguntas frecuentes', 'Preguntas y respuestas.', '15'],
  ['12', 'Presupuesto', 'Conceptos, importes y condiciones.', '16'],
  ['13', 'Equipo y contactos', 'Personas, cargos y datos de contacto.', '17'],
];
const indice = [
  eyebrow('Contenido'),
  H1('Índice'),
  gap(120),
  grid([1100, W - 2000, 900], indexRows.map(([n, t, d, pg]) => [
    cell([S('IndiceNumero', n)], 1100, { borders: { bottom: hair() }, margins: { top: 150, bottom: 150, left: 0, right: 0 } }),
    cell([S('IndiceTitulo', t), S('IndiceTexto', d)], W - 2000, { borders: { bottom: hair() }, margins: { top: 150, bottom: 150, left: 0, right: 200 } }),
    cell([S('IndiceNumero', pg, { alignment: AlignmentType.RIGHT })], 900, { borders: { bottom: hair() }, margins: { top: 150, bottom: 150, left: 0, right: 0 } }),
  ])),
];

// 4 · Separador de capítulo
const separador = [
  gap(0, 4600),
  S('SeparadorNumero', '01'),
  rule(680, C.ways, 18),
  H1('Resumen ejecutivo'),
  S('Entradilla', 'Texto breve que presenta el capítulo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.', { indent: { right: 2200 } }),
];

// 5 · Solo texto
const soloTexto = [
  newPage('Capítulo 02 · Introducción'),
  H1('Página de texto'),
  S('Entradilla', 'Entradilla: un párrafo algo más grande que resume de qué trata el apartado. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
  P(LOREM.a), P(LOREM.b),
  H2('Título de sección'),
  P(LOREM.c),
  new Paragraph({ style: 'Cita', children: [run('«Una frase destacada del texto o la opinión de un cliente. Lorem ipsum dolor sit amet, consectetur adipiscing elit.»')] }),
  S('CitaAutor', 'Nombre Apellido · Camino Francés 2026'),
  P(LOREM.a),
  H3('Subtítulo de apartado'),
  P(LOREM.b),
];

// 6 · Texto + tabla
const textoTabla = [
  newPage('Capítulo 03 · Datos y tablas'),
  H1('Página con tabla'),
  P(LOREM.a),
  S('Leyenda', 'Tabla 1. Rutas más solicitadas', { spacing: { before: 240, after: 60 } }),
  dataTable(
    ['Ruta', 'Etapas', 'Km', 'Precio desde'],
    [
      ['Camino Francés desde Sarria', '5', '115', '695 €'],
      ['Camino Portugués desde Tui', '6', '118', '725 €'],
      ['Camino Inglés desde Ferrol', '5', '113', '680 €'],
      ['Camino del Norte desde Ribadeo', '8', '193', '1.050 €'],
      ['Camino Primitivo desde Lugo', '5', '100', '710 €'],
    ],
    [4270, 1500, 1500, 1800],
  ),
  S('Leyenda', 'Fuente: datos de ejemplo.', { spacing: { before: 100, after: 360 } }),
  H2('Comentario de los datos'),
  P(LOREM.b),
  P(LOREM.s),
  gap(120),
  note('Nota', 'Caja para avisos o datos que el lector no debe pasar por alto. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'),
];

// 7 · Infografía + texto
const kpis = [['115 km', 'Distancia mínima a pie para la Compostela'], ['5 a 8', 'Etapas en una ruta habitual'], ['100.000', 'Seguidores en Instagram'], ['2027', 'Año Santo Compostelano']];
const KW = 2120, KG = (W - 4 * KW) / 3;
const kpiRow = grid([KW, KG, KW, KG, KW, KG, KW], [kpis.flatMap(([n, t], i) => {
  const c = cell([S('CifraNumero', n), S('CifraTexto', t)], KW, { borders: { top: hair(C.ways, 18) }, margins: { top: 200, bottom: 0, left: 0, right: 0 } });
  return i < 3 ? [c, cell([P('')], KG)] : [c];
})]);
const bars = [['Camino Francés', 52], ['Camino Portugués', 21], ['Camino del Norte', 9], ['Camino Primitivo', 6], ['Camino Inglés', 5]];
const LBL = 2500, VAL = 900, BAR = W - LBL - VAL;
const barRows = bars.flatMap(([t, v], i) => {
  const bw = Math.round(BAR * v / 60);
  return [
    grid([LBL, bw, BAR - bw, VAL], [[
      cell([S('BarraEtiqueta', t)], LBL, { v: VerticalAlign.CENTER }),
      cell([new Paragraph({ spacing: { after: 0, line: 200, lineRule: 'exact' }, children: [] })], bw, { fill: i === 0 ? C.sendero : C.ways }),
      cell([new Paragraph({ spacing: { after: 0, line: 200, lineRule: 'exact' }, children: [] })], BAR - bw, { fill: 'F3F3F1' }),
      cell([S('BarraValor', v + ' %')], VAL, { v: VerticalAlign.CENTER }),
    ]], { height: { value: 340, rule: HeightRule.EXACT } }),
    gap(0, 0),
  ];
});
const steps = [['01', 'Elige tu ruta', 'Lorem ipsum dolor sit amet, consectetur.'], ['02', 'Reserva', 'Integer posuere erat a ante venenatis.'], ['03', 'Prepárate', 'Cras mattis consectetur purus sit amet.'], ['04', 'Camina', 'Donec ullamcorper nulla non metus.']];
const SW = W / 4;
const stepRow = grid(steps.map(() => SW), [steps.map(([n, t, d]) => cell([
  S('PasoNumero', n), S('PasoTitulo', t), S('PasoTexto', d),
], SW, { borders: { top: hair(C.niebla, 12) }, margins: { top: 180, bottom: 0, left: 0, right: 280 } }))]);
const infografia = [
  newPage('Capítulo 04 · Cifras clave'),
  H1('Página de infografía'),
  P(LOREM.s),
  gap(200),
  kpiRow,
  gap(0, 300),
  H2('Distribución por ruta'),
  S('Leyenda', 'Porcentaje de peregrinos por ruta. Datos de ejemplo.', { spacing: { after: 200 } }),
  ...barRows,
  H2('Cómo funciona'),
  stepRow,
  gap(0, 200),
  P(LOREM.b),
];

// 8 · Bullet points
const HW = (W - 600) / 2;
const twoLists = grid([HW, 600, HW], [[
  cell([H3('Incluido', { spacing: { before: 0, after: 120 } }), ...['Alojamiento seleccionado en cada etapa', 'Traslado de equipaje diario', 'Desayunos incluidos', 'Credencial del peregrino', 'Asistencia durante el viaje'].map((t) => bullet(t))], HW, { borders: { top: hair(C.grafito, 6) }, margins: { top: 200, bottom: 0, left: 0, right: 0 } }),
  cell([P('')], 600),
  cell([H3('No incluido', { spacing: { before: 0, after: 120 } }), ...['Transporte hasta el inicio', 'Comidas y cenas', 'Seguro de cancelación', 'Gastos personales'].map((t) => bullet(t, 'vinetas-gris'))], HW, { borders: { top: hair(C.grafito, 6) }, margins: { top: 200, bottom: 0, left: 0, right: 0 } }),
]]);
const ideas = [['01', 'Primera idea', LOREM.s], ['02', 'Segunda idea', LOREM.s], ['03', 'Tercera idea', LOREM.s]];
const ideasTable = grid([1000, W - 1000], ideas.map(([n, t, d]) => [
  cell([S('IdeaNumero', n)], 1000, { borders: { bottom: hair() }, margins: { top: 220, bottom: 220, left: 0, right: 0 } }),
  cell([S('IdeaTitulo', t), S('IdeaTexto', d)], W - 1000, { borders: { bottom: hair() }, margins: { top: 220, bottom: 220, left: 0, right: 0 } }),
]));
const bullets = [
  newPage('Capítulo 05 · Puntos clave'),
  H1('Página de listas'),
  P(LOREM.s),
  gap(200),
  twoLists,
  gap(0, 360),
  H2('Tres ideas para recordar'),
  ideasTable,
  gap(0, 300),
  H3('Pasos numerados'),
  num('Primer paso: lorem ipsum dolor sit amet.'),
  num('Segundo paso: consectetur adipiscing elit.'),
  num('Tercer paso: integer posuere erat a ante.'),
];

// 9 · Imagen + texto
const IW = 4300, IG = 500, TW = W - IW - IG;
const imagen = [
  newPage('Capítulo 06 · Imagen y texto'),
  H1('Página con imágenes'),
  P(LOREM.s),
  new Paragraph({ spacing: { before: 160, after: 80 }, children: [new ImageRun({ type: 'jpg', data: img('f-ancha.jpg'), transformation: { width: 605, height: 287 } })] }),
  S('Leyenda', 'Pie de foto: lugar y descripción breve de la imagen.', { spacing: { after: 360 } }),
  grid([IW, IG, TW], [[
    cell([new Paragraph({ spacing: { after: 0 }, children: [new ImageRun({ type: 'jpg', data: img('f-lateral.jpg'), transformation: { width: 287, height: 319 } })] })], IW),
    cell([P('')], IG),
    cell([H3('Foto con texto al lado', { spacing: { before: 0, after: 120 } }), P(LOREM.b), bullet('Primer punto destacado.'), bullet('Segundo punto destacado.')], TW),
  ]]),
];

// ---------- piezas reutilizables de las páginas nuevas ----------
const kpiRowOf = (items) => grid([KW, KG, KW, KG, KW, KG, KW], [items.flatMap(([n, t], i) => {
  const c = cell([S('CifraNumero', n), S('CifraTexto', t)], KW, { borders: { top: hair(C.ways, 18) }, margins: { top: 200, bottom: 0, left: 0, right: 0 } });
  return i < items.length - 1 ? [c, cell([P('')], KG)] : [c];
})]);
const metaRowOf = (items, widths) => {
  const ws = widths || items.map(() => W / items.length);
  return grid(ws, [items.map(([k, ...v], i) => cell([
    S('MetaEtiqueta', k), ...v.map((x) => S('MetaValor', x, { spacing: { after: 40 } })),
  ], ws[i], { borders: { top: hair(C.grafito, 6) }, margins: { top: 160, bottom: 0, left: 0, right: 200 } }))]);
};
const colsOf = (n, gutter, content) => {
  const w = (W - gutter * (n - 1)) / n;
  const widths = []; for (let i = 0; i < n; i++) { widths.push(w); if (i < n - 1) widths.push(gutter); }
  return grid(widths, content.map((r) => r.flatMap((c, i) => (i < n - 1 ? [cell(c, w, r.opts), cell([P('')], gutter)] : [cell(c, w, r.opts)]))));
};

// 5 · Resumen ejecutivo
const resumen = [
  eyebrow('Capítulo 01 · Resumen'),
  H1('Lo más importante en una página'),
  S('Entradilla', 'Entradilla que resume la conclusión principal del documento en dos o tres líneas. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
  gap(120),
  colsOf(3, 400, [Object.assign([['01', 'Primera clave'], ['02', 'Segunda clave'], ['03', 'Tercera clave']].map(([n, t]) => [
    S('PasoNumero', n), S('PasoTitulo', t), S('PasoTexto', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis.'),
  ]), { opts: { borders: { top: hair(C.grafito, 6) }, margins: { top: 200, bottom: 0, left: 0, right: 0 } } })]),
  H2('Recomendación'),
  P(LOREM.b),
  P(LOREM.s),
  H2('Próximos pasos'),
  num('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1),
  num('Integer posuere erat a ante venenatis dapibus.', 1),
  num('Cras mattis consectetur purus sit amet fermentum.', 1),
  gap(200),
  note('Decisión necesaria', 'Qué se necesita aprobar y para cuándo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'),
];

// 11 · Itinerario día a día
const itinerario = [
  newPage('Capítulo 07 · Itinerario'),
  H1('Itinerario día a día'),
  P(LOREM.s),
  gap(160),
  kpiRowOf([['115 km', 'Distancia total'], ['7 días', '6 noches de alojamiento'], ['5 etapas', 'Entre 19 y 29 km'], ['Media', 'Dificultad general']]),
  S('Leyenda', 'Tabla 2. Camino Francés desde Sarria', { spacing: { before: 480, after: 60 } }),
  dataTable(
    ['Día', 'Recorrido', 'Km', 'Dificultad'],
    [
      ['1', 'Llegada a Sarria y entrega de la documentación', '', ''],
      ['2', 'Sarria › Portomarín', '22', 'Media'],
      ['3', 'Portomarín › Palas de Rei', '25', 'Media'],
      ['4', 'Palas de Rei › Arzúa', '29', 'Alta'],
      ['5', 'Arzúa › O Pedrouzo', '19', 'Baja'],
      ['6', 'O Pedrouzo › Santiago de Compostela', '20', 'Media'],
      ['7', 'Desayuno y fin de los servicios', '', ''],
    ],
    [1000, 5270, 1100, 1700],
    ['', 'Total', '115', ''],
    ['l', 'l', 'r', 'l'],
  ),
  S('Leyenda', 'Distancias aproximadas.', { spacing: { before: 100, after: 280 } }),
  H2('Qué hay que saber'),
  P(LOREM.b),
];

// 12 · Comparativa de opciones
const yes = () => new Paragraph({ style: 'Celda', children: [run('●', { font: 'Arial', color: C.ways, size: 20 })] });
const no = () => new Paragraph({ style: 'Celda', children: [run('○', { font: 'Arial', color: 'B9B9B6', size: 20 })] });
const FC = 3670, PC = 1800;
const plans = [['Esencial', 'desde 695 €'], ['Confort', 'desde 845 €', 'Recomendado'], ['Premium', 'desde 1.190 €']];
const feats = [
  ['Alojamiento en cada etapa', 1, 1, 1], ['Traslado de equipaje', 1, 1, 1], ['Desayunos', 0, 1, 1],
  ['Cenas en ruta', 0, 0, 1], ['Seguro de viaje', 0, 1, 1], ['Habitación con baño privado', 0, 1, 1],
  ['Guía acompañante', 0, 0, 1], ['Asistencia durante el viaje', 1, 1, 1],
];
const hl = (i) => (i === 1 ? C.brote : undefined);
const compTable = new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [FC, PC, PC, PC], layout: TableLayoutType.FIXED, borders: TB,
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell([S('TablaCabecera', 'Qué incluye')], FC, { v: VerticalAlign.BOTTOM, borders: { bottom: hair(C.grafito, 8) }, margins: { top: 160, bottom: 140, left: 0, right: 0 } }),
      ...plans.map(([n, pr, tag], i) => cell([
        S('Antetitulo', tag || ' ', { alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
        S('PlanNombre', n, { alignment: AlignmentType.CENTER }),
        S('PlanPrecio', pr, { alignment: AlignmentType.CENTER }),
      ], PC, { fill: hl(i), v: VerticalAlign.BOTTOM, borders: { bottom: hair(C.grafito, 8) }, margins: { top: 200, bottom: 140, left: 80, right: 80 } })),
    ] }),
    ...feats.map(([f, ...v]) => new TableRow({ cantSplit: true, children: [
      cell([S('TablaTexto', f)], FC, { v: VerticalAlign.CENTER, borders: { bottom: hair() }, margins: { top: 130, bottom: 130, left: 0, right: 0 } }),
      ...v.map((x, i) => cell([x ? yes() : no()], PC, { fill: hl(i), v: VerticalAlign.CENTER, borders: { bottom: hair() }, margins: { top: 130, bottom: 130, left: 0, right: 0 } })),
    ] })),
  ],
});
const comparativa = [
  newPage('Capítulo 08 · Comparativa'),
  H1('Comparativa de opciones'),
  P(LOREM.s),
  gap(200),
  compTable,
  new Paragraph({ style: 'Leyenda', spacing: { before: 120, after: 320 }, children: [
    run('●', { font: 'Arial', color: C.ways }), run('  Incluido      '),
    run('○', { font: 'Arial', color: 'B9B9B6' }), run('  No incluido      Precios de ejemplo.'),
  ] }),
  H2('Cómo elegir'),
  P(LOREM.b),
];

// 13 · Plan de trabajo (cronograma)
const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const TC = 3070, MC = 1000;
const tasks = [
  ['Definición de la campaña', 0, 1], ['Producción de contenidos', 1, 3], ['Lanzamiento', 3, 3, 'hito'],
  ['Campaña en redes', 3, 5], ['Medición y ajustes', 4, 5], ['Informe final', 5, 5, 'hito'],
];
const WHITE = { style: BorderStyle.SINGLE, size: 36, color: C.blanco };
const gantt = new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [TC, ...months.map(() => MC)], layout: TableLayoutType.FIXED, borders: TB,
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell([S('TablaCabecera', 'Tarea')], TC, { borders: { bottom: hair(C.grafito, 8) }, margins: { top: 0, bottom: 120, left: 0, right: 0 } }),
      ...months.map((m) => cell([S('TablaCabecera', m, { alignment: AlignmentType.CENTER })], MC, { borders: { bottom: hair(C.grafito, 8) }, margins: { top: 0, bottom: 120, left: 0, right: 0 } })),
    ] }),
    ...tasks.map(([t, a, b, kind]) => new TableRow({ cantSplit: true, height: { value: 520, rule: HeightRule.EXACT }, children: [
      cell([S('TablaTexto', t)], TC, { v: VerticalAlign.CENTER, borders: { bottom: hair() } }),
      ...months.map((m, i) => cell([new Paragraph({ spacing: { after: 0, line: 200, lineRule: 'exact' }, children: [] })], MC, {
        fill: i >= a && i <= b ? (kind ? C.sendero : C.ways) : undefined,
        borders: { top: WHITE, bottom: WHITE, left: i === 0 ? NONE : { style: BorderStyle.SINGLE, size: 2, color: C.blanco } },
      })),
    ] })),
  ],
});
const milestones = [['Abril', 'Lanzamiento', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'], ['Mayo', 'Revisión de resultados', 'Integer posuere erat a ante venenatis dapibus.'], ['Junio', 'Informe final', 'Cras mattis consectetur purus sit amet fermentum.']];
const cronograma = [
  newPage('Capítulo 09 · Plan de trabajo'),
  H1('Plan de trabajo'),
  P(LOREM.s),
  gap(200),
  gantt,
  new Paragraph({ style: 'Leyenda', spacing: { before: 160, after: 320 }, children: [
    run('■', { font: 'Arial', color: C.ways }), run('  Tarea      '),
    run('■', { font: 'Arial', color: C.sendero }), run('  Hito'),
  ] }),
  H2('Hitos'),
  grid([1600, W - 1600], milestones.map(([d, t, x]) => [
    cell([S('PasoNumero', d.toUpperCase())], 1600, { borders: { top: hair() }, margins: { top: 180, bottom: 180, left: 0, right: 0 } }),
    cell([S('IdeaTitulo', t), S('IdeaTexto', x)], W - 1600, { borders: { top: hair() }, margins: { top: 160, bottom: 160, left: 0, right: 0 } }),
  ])),
];

// 14 · Testimonios
const quote = (t) => [S('TestimonioTexto', '«' + t + '»'), S('TestimonioAutor', 'Nombre Apellido · Ruta y año')];
const testimonios = [
  newPage('Capítulo 10 · Testimonios'),
  H1('Lo que cuentan los viajeros'),
  P(LOREM.s),
  gap(240),
  colsOf(2, 600, [
    Object.assign([quote('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.'), quote('Maecenas sed diam eget risus varius blandit sit amet non magna. Vestibulum id ligula porta.')], { opts: { borders: { top: hair(C.grafito, 6) }, margins: { top: 260, bottom: 480, left: 0, right: 0 } } }),
    Object.assign([quote('Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod.'), quote('Donec ullamcorper nulla non metus auctor fringilla. Cras mattis consectetur purus sit amet.')], { opts: { borders: { top: hair(C.grafito, 6) }, margins: { top: 260, bottom: 480, left: 0, right: 0 } } }),
  ]),
  new Paragraph({ style: 'Cita', children: [run('«Una opinión más larga para destacar a ancho completo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.»')] }),
  S('CitaAutor', 'Nombre Apellido · Camino Portugués 2026'),
];

// 15 · Preguntas frecuentes
const qa = [
  ['¿Qué nivel físico hace falta?', LOREM.s],
  ['¿Cuál es la mejor época para hacer el Camino?', LOREM.s],
  ['¿Cómo llega la maleta a cada alojamiento?', LOREM.s],
  ['¿Puedo hacer el Camino solo o sola?', LOREM.s],
  ['¿Qué pasa si un día no puedo caminar?', LOREM.s],
  ['¿Cómo se consigue la Compostela?', LOREM.s],
];
const faq = [
  newPage('Capítulo 11 · Preguntas frecuentes'),
  H1('Preguntas frecuentes'),
  P(LOREM.s, { spacing: { after: 320 } }),
  grid([W], qa.map(([q, a]) => [cell([S('Pregunta', q), P(a, { spacing: { after: 0 } })], W, { borders: { top: hair() }, margins: { top: 220, bottom: 220, left: 0, right: 0 } })])),
];

// 16 · Presupuesto
const presupuesto = [
  newPage('Capítulo 12 · Presupuesto'),
  H1('Presupuesto'),
  gap(120),
  metaRowOf([['Cliente', 'Nombre Apellido', 'Empresa'], ['Presupuesto n.º', '0000'], ['Fecha', 'dd/mm/aaaa'], ['Válido hasta', 'dd/mm/aaaa']]),
  gap(0, 480),
  dataTable(
    ['Concepto', 'Cantidad', 'Precio', 'Importe'],
    [
      ['Camino Francés desde Sarria · 7 días', '2', '695 €', '1.390 €'],
      ['Suplemento habitación individual', '1', '180 €', '180 €'],
      ['Cenas en ruta (5 noches)', '2', '120 €', '240 €'],
      ['Seguro de cancelación', '2', '35 €', '70 €'],
    ],
    [4570, 1300, 1600, 1600],
    ['Total', '', '', '1.880 €'],
    ['l', 'r', 'r', 'r'],
  ),
  S('Leyenda', 'Precios de ejemplo, por persona salvo indicación.', { spacing: { before: 100, after: 320 } }),
  H2('Condiciones'),
  bullet('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
  bullet('Integer posuere erat a ante venenatis dapibus.'),
  bullet('Cras mattis consectetur purus sit amet fermentum.'),
  gap(0, 240),
  S('Legal', 'Texto legal del presupuesto. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
];

// 17 · Equipo y contactos
const equipo = [
  newPage('Capítulo 13 · Equipo y contactos'),
  H1('Equipo y contactos'),
  P(LOREM.s),
  gap(200),
  dataTable(
    ['Nombre', 'Cargo', 'Teléfono', 'Correo'],
    [
      ['Nombre Apellido', 'Dirección', '+34 000 000 000', 'nombre@santiagoways.com'],
      ['Nombre Apellido', 'Marketing', '+34 000 000 000', 'nombre@santiagoways.com'],
      ['Nombre Apellido', 'Atención al viajero', '+34 000 000 000', 'nombre@santiagoways.com'],
      ['Nombre Apellido', 'Operaciones', '+34 000 000 000', 'nombre@santiagoways.com'],
      ['Nombre Apellido', 'Ventas', '+34 000 000 000', 'nombre@santiagoways.com'],
      ['Nombre Apellido', 'Producto', '+34 000 000 000', 'nombre@santiagoways.com'],
    ],
    [2270, 1850, 1900, 3050],
    null,
    ['l', 'l', 'l', 'l'],
  ),
  gap(0, 480),
  H2('Oficina'),
  gap(80),
  metaRowOf([['Dirección', 'Calle y número', 'Código postal y ciudad'], ['Horario', 'Lunes a viernes', '00:00 a 00:00'], ['Teléfono', '+34 000 000 000'], ['Web', 'santiagoways.com']]),
];

// 18 · Modelo de carta
const carta = [
  P('Santiago de Compostela, dd de mes de aaaa', { alignment: AlignmentType.RIGHT, pageBreakBefore: true, spacing: { before: 400, after: 600 } }),
  new Paragraph({ spacing: { after: 0 }, children: [run('Nombre Apellido', { bold: true })] }),
  S('TablaTexto', 'Cargo · Empresa'),
  S('TablaTexto', 'Calle y número'),
  S('TablaTexto', 'Código postal y ciudad'),
  gap(0, 600),
  S('CartaAsunto', 'Asunto: lorem ipsum dolor sit amet'),
  P('Estimado/a Nombre:'),
  P(LOREM.a), P(LOREM.b), P(LOREM.c),
  P('Un saludo,', { spacing: { before: 120, after: 0 } }),
  gap(0, 900),
  new Paragraph({ spacing: { after: 20 }, children: [run('Nombre Apellido', { bold: true })] }),
  S('IndiceTexto', 'Cargo · Santiago Ways'),
];

// 19 · Contraportada
const contra = [
  new Paragraph({ spacing: { after: 0 }, children: [LOGO(200)] }),
  gap(0, 4300),
  rule(680, C.ways, 18),
  S('Cierre', 'Frase de cierre del documento en una o dos líneas'),
  S('Subtitulo', 'Texto breve opcional: un agradecimiento, una invitación o el siguiente paso.', { indent: { right: 1800 } }),
];

const blank = [
  eyebrow('Capítulo 01'),
  H1('Título del apartado'),
  P('Escribe aquí el texto del documento.'),
];

// ---------- cabeceras y pies ----------
const tabs = [{ type: TabStopType.RIGHT, position: W }];
const header = new Header({ children: [new Paragraph({
  spacing: { after: 0 }, tabStops: tabs,
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.niebla, space: 10 } },
  children: [LOGO(110), run('\t'), run('Título del documento', { color: C.gris, size: 14 })],
})] });
const footer = new Footer({ children: [new Paragraph({
  tabStops: tabs,
  children: [run('santiagoways.com', { color: C.gris, size: 14 }), run('\t'), new TextRun({ children: [PageNumber.CURRENT], bold: true, color: C.grafito, size: 15 })],
})] });
const emptyH = { default: new Header({ children: [new Paragraph('')] }) };
const emptyF = { default: new Footer({ children: [new Paragraph('')] }) };
const coverFooter = (indent) => ({ default: new Footer({ children: [metaTable(indent), new Paragraph({ spacing: { after: 0 }, children: [] })] }) });
const contraFooter = { default: new Footer({ children: [
  metaRowOf([['Web', 'santiagoways.com'], ['Correo', 'correo@santiagoways.com'], ['Teléfono', '+34 000 000 000'], ['Dirección', 'Calle y número', 'Código postal y ciudad']], [2000, 2870, 1900, 2300]),
  S('Legal', '© 2027 Santiago Ways. Todos los derechos reservados.', { spacing: { before: 360, after: 0 } }),
] }) };

const page = { size: { width: PW, height: PH }, margin: { top: 1701, bottom: 1418, left: ML, right: ML, header: 709, footer: 709 } };
const pageCover = { size: { width: PW, height: PH }, margin: { top: 1701, bottom: 1985, left: ML, right: ML, header: 709, footer: 1134 } };
const pageBleed = { size: { width: PW, height: PH }, margin: { top: 0, bottom: 1985, left: 0, right: 0, header: 0, footer: 1134 } };

// ---------- estilos ----------
const sp = (after, line, before = 0) => ({ spacing: { before, after, line, lineRule: 'auto' } });
const ps = (id, name, r, para) => ({ id, name, basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: F, ...r }, paragraph: para });

const styles = {
  default: {
    document: { run: { font: F, size: 20, color: C.grafito }, paragraph: sp(160, 348) },
    title: { run: { font: FX, size: 72, color: C.grafito }, paragraph: sp(240, 252) },
    heading1: { run: { font: FX, size: 56, color: C.grafito }, paragraph: { ...sp(280, 252), keepNext: true } },
    heading2: { run: { font: FX, size: 32, color: C.grafito }, paragraph: { ...sp(140, 264, 360), keepNext: true } },
    heading3: { run: { font: F, size: 24, bold: true, color: C.grafito }, paragraph: { ...sp(100, 276, 280), keepNext: true } },
    listParagraph: { run: { font: F, size: 20 } },
  },
  paragraphStyles: [
    ps('Antetitulo', 'Antetítulo', { size: 15, bold: true, color: C.sendero, allCaps: true, characterSpacing: 30 }, { ...sp(160, 240), keepNext: true }),
    ps('Subtitulo', 'Subtítulo SW', { size: 26, color: C.gris }, sp(0, 312)),
    ps('Entradilla', 'Entradilla', { size: 25, color: C.grafito }, sp(280, 336)),
    ps('Lista', 'Lista SW', { size: 20 }, sp(80, 300)),
    ps('CajaTexto', 'Texto en caja', { size: 19 }, sp(0, 300)),
    ps('Cita', 'Cita SW', { font: F, size: 28, bold: true, color: C.grafito }, { ...sp(100, 312, 200), border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.niebla, space: 12 } } }),
    ps('CitaAutor', 'Autor de cita', { size: 16, color: C.gris }, { ...sp(240, 240), border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.niebla, space: 12 } } }),
    ps('TablaCabecera', 'Tabla cabecera', { size: 15, bold: true, color: C.grafito, allCaps: true, characterSpacing: 16 }, sp(0, 240)),
    ps('TablaTexto', 'Tabla texto', { size: 18 }, sp(0, 252)),
    ps('Leyenda', 'Leyenda SW', { size: 15, color: C.gris }, sp(80, 240)),
    ps('Legal', 'Texto legal', { size: 14, color: C.gris }, sp(0, 240)),
    ps('MetaEtiqueta', 'Portada etiqueta', { size: 13, bold: true, color: C.gris, allCaps: true, characterSpacing: 24 }, sp(40, 240)),
    ps('MetaValor', 'Portada dato', { size: 17 }, sp(0, 240)),
    ps('IndiceNumero', 'Índice número', { font: FX, size: 26, color: C.sendero }, sp(0, 240)),
    ps('IndiceTitulo', 'Índice título', { size: 24, bold: true }, sp(40, 252)),
    ps('IndiceTexto', 'Índice texto', { size: 17, color: C.gris }, sp(0, 252)),
    ps('SeparadorNumero', 'Separador número', { font: FX, size: 160, color: C.sendero }, sp(200, 240)),
    ps('CifraNumero', 'Cifra', { font: FX, size: 44, color: C.grafito }, sp(60, 240)),
    ps('CifraTexto', 'Cifra texto', { size: 16, color: C.gris }, sp(0, 252)),
    ps('BarraEtiqueta', 'Barra etiqueta', { size: 17 }, sp(0, 240)),
    ps('BarraValor', 'Barra valor', { size: 17, bold: true }, { ...sp(0, 240), alignment: AlignmentType.RIGHT }),
    ps('PasoNumero', 'Paso número', { size: 16, bold: true, color: C.sendero, characterSpacing: 20 }, sp(80, 240)),
    ps('PasoTitulo', 'Paso título', { size: 20, bold: true }, sp(60, 252)),
    ps('PasoTexto', 'Paso texto', { size: 17, color: C.gris }, sp(0, 264)),
    ps('IdeaNumero', 'Idea número', { font: FX, size: 36, color: C.sendero }, sp(0, 240)),
    ps('IdeaTitulo', 'Idea título', { size: 22, bold: true }, sp(40, 252)),
    ps('IdeaTexto', 'Idea texto', { size: 18, color: C.gris }, sp(0, 276)),
    ps('ContraWeb', 'Contraportada web', { size: 22, bold: true }, sp(80, 240)),
    ps('ContraTexto', 'Contraportada texto', { size: 16, color: C.gris }, sp(0, 240)),
    ps('Cierre', 'Frase de cierre', { font: FX, size: 52, color: C.grafito }, sp(240, 252)),
    ps('PlanNombre', 'Plan nombre', { size: 22, bold: true }, sp(20, 240)),
    ps('PlanPrecio', 'Plan precio', { size: 16, color: C.gris }, sp(0, 240)),
    ps('Celda', 'Celda centrada', { size: 18 }, { ...sp(0, 240), alignment: AlignmentType.CENTER }),
    ps('Pregunta', 'Pregunta', { size: 22, bold: true }, { ...sp(80, 276, 0), keepNext: true }),
    ps('TestimonioTexto', 'Testimonio', { size: 24, bold: true }, sp(160, 300)),
    ps('TestimonioAutor', 'Testimonio autor', { size: 16, color: C.gris }, sp(0, 240)),
    ps('CartaAsunto', 'Carta asunto', { size: 20, bold: true }, sp(280, 300, 0)),
  ],
};

const bulletLevel = (color) => [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
  style: { run: { font: 'Arial', color, size: 20 }, paragraph: { indent: { left: 340, hanging: 340 } } } }];

const doc = new Document({
  creator: 'Santiago Ways', title: 'Plantilla Santiago Ways', description: 'Plantilla de documento Word según el Brandbook 2027',
  styles,
  numbering: { config: [
    { reference: 'vinetas', levels: bulletLevel(C.ways) },
    { reference: 'vinetas-gris', levels: bulletLevel(C.gris) },
    { reference: 'numeros', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
      style: { run: { color: C.sendero, bold: true }, paragraph: { indent: { left: 340, hanging: 340 } } } }] },
  ] },
  sections: MODE === 'blanco' ? [
    { properties: { page: pageCover }, headers: emptyH, footers: coverFooter(), children: portadaA },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: blank },
  ] : [
    { properties: { page: pageCover }, headers: emptyH, footers: coverFooter(), children: portadaA },
    { properties: { page: pageBleed }, headers: emptyH, footers: coverFooter({ size: ML, type: WidthType.DXA }), children: portadaB },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: indice },
    { properties: { page }, headers: emptyH, footers: emptyF, children: separador },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: [
      ...resumen, ...soloTexto, ...textoTabla, ...infografia, ...bullets, ...imagen,
      ...itinerario, ...comparativa, ...cronograma, ...testimonios, ...faq, ...presupuesto, ...equipo, ...carta,
    ] },
    { properties: { page: pageCover }, headers: emptyH, footers: contraFooter, children: contra },
  ],
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log('ok', OUT, b.length); });
