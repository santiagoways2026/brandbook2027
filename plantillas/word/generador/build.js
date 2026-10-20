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
const num = (t) => new Paragraph({ style: 'Lista', numbering: { reference: 'numeros', level: 0 }, children: [run(t)] });
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
function dataTable(head, rows, widths, foot) {
  const isNum = (i) => i > 0 && /^[\d.,\s€%]+$/.test(rows[0][i]);
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
  gap(0, 5400),
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
  ['01', 'Introducción', 'Página de texto con entradilla y cita destacada.', '4'],
  ['02', 'Datos y tablas', 'Página de texto con tabla y caja de nota.', '6'],
  ['03', 'Cifras clave', 'Infografía: cifras, barras y proceso.', '7'],
  ['04', 'Puntos clave', 'Listas en dos columnas e ideas numeradas.', '8'],
  ['05', 'Imagen y texto', 'Foto a ancho completo y foto con texto.', '9'],
];
const indice = [
  eyebrow('Contenido'),
  H1('Índice'),
  gap(240),
  grid([1100, W - 2000, 900], indexRows.map(([n, t, d, pg]) => [
    cell([S('IndiceNumero', n)], 1100, { borders: { bottom: hair() }, margins: { top: 260, bottom: 260, left: 0, right: 0 } }),
    cell([S('IndiceTitulo', t), S('IndiceTexto', d)], W - 2000, { borders: { bottom: hair() }, margins: { top: 260, bottom: 260, left: 0, right: 200 } }),
    cell([S('IndiceNumero', pg, { alignment: AlignmentType.RIGHT })], 900, { borders: { bottom: hair() }, margins: { top: 260, bottom: 260, left: 0, right: 0 } }),
  ])),
];

// 4 · Separador de capítulo
const separador = [
  gap(0, 4600),
  S('SeparadorNumero', '01'),
  rule(680, C.ways, 18),
  H1('Introducción'),
  S('Entradilla', 'Texto breve que presenta el capítulo. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.', { indent: { right: 2200 } }),
];

// 5 · Solo texto
const soloTexto = [
  eyebrow('Capítulo 01 · Introducción'),
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
  newPage('Capítulo 02 · Datos y tablas'),
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
  newPage('Capítulo 03 · Cifras clave'),
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
  newPage('Capítulo 04 · Puntos clave'),
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
  newPage('Capítulo 05 · Imagen y texto'),
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

// 10 · Contraportada
const contra = [
  gap(0, 5600),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 }, children: [new ImageRun({ type: 'png', data: logoV, transformation: { width: 150, height: 135 } })] }),
  S('ContraWeb', 'santiagoways.com', { alignment: AlignmentType.CENTER }),
  S('ContraTexto', 'Dirección · Teléfono · Correo electrónico', { alignment: AlignmentType.CENTER }),
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
const contraFooter = { default: new Footer({ children: [S('Legal', '© 2027 Santiago Ways. Todos los derechos reservados.', { alignment: AlignmentType.CENTER })] }) };

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
      ...soloTexto, ...textoTabla, ...infografia, ...bullets, ...imagen,
    ] },
    { properties: { page }, headers: emptyH, footers: contraFooter, children: contra },
  ],
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log('ok', OUT, b.length); });
