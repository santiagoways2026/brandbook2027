// Plantilla Word Santiago Ways (Brandbook 2027)
// Uso: node build.js lorem|blanco salida.docx
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, AlignmentType,
  HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  LevelFormat, PageNumber, PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo,
  PositionalTabLeader, PageBreak, TabStopType, VerticalAlign, TableLayoutType,
} = require('docx');

const MODE = process.argv[2] || 'lorem';
const OUT = process.argv[3] || 'plantilla.docx';
const D = __dirname;

const C = {
  ways: '7AA606', sendero: '506718', grafito: '2E2E2D', gris: '6F6F6E',
  niebla: 'E8E8E6', brote: 'FAFFEE', blanco: 'FFFFFF',
};
const F = 'Montserrat';
const FX = 'Montserrat ExtraBold';
const W = 9638; // ancho útil A4 con márgenes de 2 cm

const logo = fs.readFileSync(path.join(D, 'logo.png'));
const foto = fs.readFileSync(path.join(D, 'portada.jpg'));

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE };

const SHORT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet.';
const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla.',
  'Maecenas sed diam eget risus varius blandit sit amet non magna. Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur.',
  'Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
];

// ---------- helpers ----------
const p = (text, opts = {}) => new Paragraph({ children: [new TextRun(text)], ...opts });
const eyebrow = (t) => new Paragraph({ style: 'Antetitulo', children: [new TextRun(t)] });
const h = (lvl, parts) => new Paragraph({
  heading: lvl,
  children: (Array.isArray(parts) ? parts : [parts]).map((x) =>
    typeof x === 'string' ? new TextRun(x) : x),
});
// Subrayado Ways: bloque verde Ways detrás de una o dos palabras, letra blanca
const sub = (t, fill = C.ways) => new TextRun({
  text: ' ' + t + ' ', color: C.blanco,
  shading: { type: ShadingType.CLEAR, color: 'auto', fill },
});
const bullet = (t, lvl = 0) => new Paragraph({ style: 'Lista', numbering: { reference: 'vinetas', level: lvl }, children: [new TextRun(t)] });
const num = (t) => new Paragraph({ style: 'Lista', numbering: { reference: 'numeros', level: 0 }, children: [new TextRun(t)] });

function box(children, { fill, left, pad = 280 }) {
  const b = { ...noBorders };
  if (left) b.left = { style: BorderStyle.SINGLE, size: 36, color: left };
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W], layout: TableLayoutType.FIXED,
    borders: { ...noBorders, insideHorizontal: NONE, insideVertical: NONE },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: W, type: WidthType.DXA }, borders: b,
      shading: { type: ShadingType.CLEAR, color: 'auto', fill },
      margins: { top: pad, bottom: pad, left: pad + 60, right: pad + 60 },
      children,
    })] })],
  });
}

function dataTable(head, rows, widths) {
  const line = { style: BorderStyle.SINGLE, size: 4, color: C.niebla };
  const cell = (t, i, r) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    borders: { top: NONE, left: NONE, right: NONE, bottom: r < 0 ? NONE : line },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: r < 0 ? C.ways : (r % 2 ? C.brote : C.blanco) },
    margins: { top: 110, bottom: 110, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      style: r < 0 ? 'TablaCabecera' : 'TablaTexto',
      alignment: i > 0 && /^[\d.,\s€%]+$/.test(rows[0][i]) ? AlignmentType.RIGHT : AlignmentType.LEFT,
      children: [new TextRun(t)],
    })],
  });
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    borders: { ...noBorders, insideHorizontal: NONE, insideVertical: NONE },
    rows: [
      new TableRow({ tableHeader: true, children: head.map((t, i) => cell(t, i, -1)) }),
      ...rows.map((r, ri) => new TableRow({ children: r.map((t, i) => cell(t, i, ri)) })),
    ],
  });
}

// ---------- portada ----------
const metaRun = (k, v) => [
  new TextRun({ text: k.toUpperCase() + '  ', bold: true, color: C.sendero, size: 14, characterSpacing: 30 }),
  new TextRun({ text: v, color: C.grafito, size: 17 }),
];
const cover = [
  new Paragraph({ spacing: { after: 0 }, children: [new ImageRun({ type: 'png', data: logo, transformation: { width: 250, height: 40 } })] }),
  new Paragraph({ spacing: { before: 3000 }, style: 'Antetitulo', children: [new TextRun('Tipo de documento · 2027')] }),
  new Paragraph({ style: 'Title', children: [new TextRun('Título del '), sub('documento')] }),
  new Paragraph({ style: 'Subtitulo', children: [new TextRun('Subtítulo o descripción breve del documento en una o dos líneas.')] }),
  new Paragraph({ spacing: { before: 520, after: 520 }, children: [new ImageRun({ type: 'jpg', data: foto, transformation: { width: 642, height: 420 } })] }),
  new Paragraph({ spacing: { before: 200, after: 0 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.niebla, space: 10 } }, children: [
    ...metaRun('Autor', 'Nombre Apellido'), new TextRun({ text: '      ' }),
    ...metaRun('Área', 'Marketing'), new TextRun({ text: '      ' }),
    ...metaRun('Fecha', 'dd/mm/aaaa'), new TextRun({ text: '      ' }),
    ...metaRun('Versión', '1.0'),
  ] }),
];

// ---------- cuerpo con Lorem Ipsum ----------
const lorem = [
  eyebrow('Apartado 01'),
  h(HeadingLevel.HEADING_1, ['Introducción al ', sub('documento')]),
  new Paragraph({ style: 'Entradilla', children: [new TextRun('Entradilla: un párrafo algo más grande que resume de qué trata el documento. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.')] }),
  p(LOREM[0]),
  h(HeadingLevel.HEADING_2, 'Título de sección'),
  p(LOREM[2]),
  bullet('Primer punto de la lista con viñeta en verde Ways.'),
  bullet('Segundo punto: lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
  bullet('Subpunto de segundo nivel con viñeta en verde sendero.', 1),
  bullet('Tercer punto de la lista.'),
  h(HeadingLevel.HEADING_3, 'Subtítulo de apartado'),
  p(SHORT),
  num('Primer paso numerado.'),
  num('Segundo paso: maecenas sed diam eget risus varius blandit.'),
  num('Tercer paso numerado.'),
  new Paragraph({ spacing: { after: 120 }, children: [] }),
  box([
    new Paragraph({ style: 'Antetitulo', spacing: { after: 80 }, children: [new TextRun('A tener en cuenta')] }),
    new Paragraph({ style: 'CajaTexto', children: [new TextRun('Caja de nota sobre brote con filete verde Ways. Para avisos, recordatorios o datos que el lector no debe pasar por alto. Lorem ipsum dolor sit amet.')] }),
  ], { fill: C.brote, left: C.ways }),

  new Paragraph({ children: [new PageBreak()] }),
  eyebrow('Apartado 02'),
  h(HeadingLevel.HEADING_1, 'Datos y tablas'),
  p(SHORT),
  new Paragraph({ style: 'Leyenda', spacing: { before: 200 }, children: [new TextRun('Tabla 1. Título de la tabla en minúscula de frase.')] }),
  dataTable(
    ['Ruta', 'Etapas', 'Km', 'Precio desde'],
    [
      ['Camino Francés desde Sarria', '5', '115', '695 €'],
      ['Camino Portugués desde Tui', '6', '118', '725 €'],
      ['Camino Inglés desde Ferrol', '5', '113', '680 €'],
      ['Camino del Norte desde Ribadeo', '8', '193', '1.050 €'],
    ],
    [4238, 1600, 1600, 2200],
  ),
  new Paragraph({ style: 'Leyenda', spacing: { before: 100, after: 280 }, children: [new TextRun('Fuente: datos de ejemplo. Lorem ipsum dolor sit amet.')] }),
  h(HeadingLevel.HEADING_2, 'Dato destacado'),
  p(SHORT),
  box([
    new Paragraph({ style: 'DestacadoCifra', children: [new TextRun('100.000')] }),
    new Paragraph({ style: 'DestacadoTexto', children: [new TextRun('Caja destacada en verde Ways para una cifra o un mensaje clave. Letra siempre en blanco. Una por documento como máximo.')] }),
  ], { fill: C.ways, pad: 360 }),
  new Paragraph({ spacing: { after: 120 }, children: [] }),
  h(HeadingLevel.HEADING_2, 'Cita o testimonio'),
  new Paragraph({ style: 'Cita', children: [new TextRun('«Texto de una cita o de la opinión de un cliente. Lorem ipsum dolor sit amet, consectetur adipiscing elit.»')] }),
  new Paragraph({ style: 'CitaAutor', children: [new TextRun('Nombre Apellido · Camino Francés 2026')] }),
  new Paragraph({ style: 'Legal', spacing: { before: 240 }, children: [new TextRun('Texto legal o nota al pie del documento. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Santiago Ways · santiagoways.com')] }),
];

const blank = [
  eyebrow('Apartado 01'),
  h(HeadingLevel.HEADING_1, 'Título del apartado'),
  p('Escribe aquí el texto del documento.'),
];

// ---------- cabecera y pie ----------
const header = new Header({ children: [new Paragraph({
  spacing: { after: 0 }, tabStops: [{ type: TabStopType.RIGHT, position: W }],
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.niebla, space: 8 } },
  children: [
    new ImageRun({ type: 'png', data: logo, transformation: { width: 125, height: 20 } }),
    new TextRun({ text: '\t' }),
    new TextRun({ text: 'Título del documento', color: C.gris, size: 15 }),
  ],
})] });
const footer = new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: W }],
  children: [
    new TextRun({ text: 'santiagoways.com', color: C.gris, size: 15 }),
    new TextRun({ text: '\t' }),
    new TextRun({ children: [PageNumber.CURRENT], bold: true, color: C.sendero, size: 16 }),
  ],
})] });
const emptyHF = { default: new Header({ children: [new Paragraph('')] }) };
const emptyF = { default: new Footer({ children: [new Paragraph('')] }) };

const page = {
  size: { width: 11906, height: 16838 },
  margin: { top: 1418, bottom: 1134, left: 1134, right: 1134, header: 567, footer: 567 },
};

// ---------- estilos ----------
const ps = (id, name, run, para, extra = {}) => ({
  id, name, basedOn: 'Normal', next: 'Normal', quickFormat: true, run, paragraph: para, ...extra,
});

const doc = new Document({
  creator: 'Santiago Ways', title: 'Plantilla Santiago Ways', description: 'Plantilla de documento Word según el Brandbook 2027',
  styles: {
    default: {
      document: { run: { font: F, size: 21, color: C.grafito }, paragraph: { spacing: { after: 160, line: 360, lineRule: 'auto' } } },
      title: { run: { font: FX, size: 80, color: C.grafito }, paragraph: { spacing: { before: 0, after: 240, line: 276, lineRule: 'auto' } } },
      heading1: { run: { font: FX, size: 56, color: C.grafito }, paragraph: { spacing: { before: 120, after: 240, line: 276, lineRule: 'auto' }, keepNext: true } },
      heading2: { run: { font: FX, size: 40, color: C.grafito }, paragraph: { spacing: { before: 360, after: 160, line: 276, lineRule: 'auto' }, keepNext: true } },
      heading3: { run: { font: F, size: 28, bold: true, color: C.sendero }, paragraph: { spacing: { before: 280, after: 120, line: 276, lineRule: 'auto' }, keepNext: true } },
      heading4: { run: { font: F, size: 24, bold: true, color: C.grafito }, paragraph: { spacing: { before: 200, after: 80 }, keepNext: true } },
      listParagraph: { run: { font: F, size: 21 } },
    },
    paragraphStyles: [
      ps('Antetitulo', 'Antetítulo', { font: F, size: 16, bold: true, color: C.sendero, allCaps: true, characterSpacing: 30 }, { spacing: { before: 0, after: 100, line: 240, lineRule: 'auto' }, keepNext: true }),
      ps('Subtitulo', 'Subtítulo SW', { font: F, size: 28, color: C.gris }, { spacing: { after: 200, line: 300, lineRule: 'auto' } }),
      ps('Entradilla', 'Entradilla', { font: F, size: 26, color: C.grafito }, { spacing: { after: 240, line: 336, lineRule: 'auto' } }),
      ps('Lista', 'Lista SW', { font: F, size: 21 }, { spacing: { after: 80, line: 336, lineRule: 'auto' } }),
      ps('CajaTexto', 'Texto en caja', { font: F, size: 20, color: C.grafito }, { spacing: { after: 0, line: 312, lineRule: 'auto' } }),
      ps('DestacadoCifra', 'Destacado cifra', { font: FX, size: 64, color: C.blanco }, { spacing: { after: 60, line: 240, lineRule: 'auto' } }),
      ps('DestacadoTexto', 'Destacado texto', { font: F, size: 22, bold: true, color: C.blanco }, { spacing: { after: 0, line: 312, lineRule: 'auto' } }),
      ps('Cita', 'Cita SW', { font: F, size: 28, bold: true, color: C.sendero }, { spacing: { before: 120, after: 80, line: 336, lineRule: 'auto' }, indent: { left: 340 }, border: { left: { style: BorderStyle.SINGLE, size: 24, color: C.ways, space: 12 } } }),
      ps('CitaAutor', 'Autor de cita', { font: F, size: 17, color: C.gris }, { spacing: { after: 240 }, indent: { left: 340 } }),
      ps('TablaCabecera', 'Tabla cabecera', { font: F, size: 17, bold: true, color: C.blanco }, { spacing: { after: 0, line: 240, lineRule: 'auto' } }),
      ps('TablaTexto', 'Tabla texto', { font: F, size: 18, color: C.grafito }, { spacing: { after: 0, line: 264, lineRule: 'auto' } }),
      ps('Leyenda', 'Leyenda SW', { font: F, size: 16, color: C.gris }, { spacing: { after: 100, line: 240, lineRule: 'auto' } }),
      ps('Legal', 'Texto legal', { font: F, size: 14, color: C.gris }, { spacing: { after: 0, line: 240, lineRule: 'auto' } }),
    ],
  },
  numbering: { config: [
    { reference: 'vinetas', levels: [
      { level: 0, format: LevelFormat.BULLET, text: '●', alignment: AlignmentType.LEFT,
        style: { run: { font: 'Arial', color: C.ways, size: 16 }, paragraph: { indent: { left: 400, hanging: 300 } } } },
      { level: 1, format: LevelFormat.BULLET, text: '●', alignment: AlignmentType.LEFT,
        style: { run: { font: 'Arial', color: C.sendero, size: 12 }, paragraph: { indent: { left: 800, hanging: 300 } } } },
    ] },
    { reference: 'numeros', levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { run: { color: C.sendero, bold: true }, paragraph: { indent: { left: 400, hanging: 400 } } } },
    ] },
  ] },
  sections: [
    { properties: { page }, headers: emptyHF, footers: emptyF, children: cover },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: MODE === 'blanco' ? blank : lorem },
  ],
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log('ok', OUT, b.length); });
