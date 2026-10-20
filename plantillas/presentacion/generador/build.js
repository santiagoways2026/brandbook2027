// Plantilla de presentación Santiago Ways (Brandbook 2027) · versión sobria
// Uso: node build.js salida.pptx
const path = require('path');
const pptxgen = require('pptxgenjs');
const { applyTheme } = require(process.env.APPLY_THEME || './apply_theme.js');

const OUT = process.argv[2] || 'Presentacion_Santiago_Ways.pptx';
const D = __dirname;
const f = (n) => path.join(D, n);

const THEME = {
  name: 'Santiago Ways',
  headFontFace: 'Montserrat ExtraBold',
  bodyFontFace: 'Montserrat',
  colors: {
    dk1: '2E2E2D', lt1: 'FFFFFF', dk2: '506718', lt2: 'E8E8E6',
    accent1: '7AA606', accent2: '506718', accent3: '6F6F6E', accent4: 'A9C95A', accent5: 'FAFFEE', accent6: '2E2E2D',
    hlink: '506718', folHlink: '6F6F6E',
  },
};
const HEX = { grafito: '2E2E2D', gris: '6F6F6E', niebla: 'E8E8E6', ways: '7AA606', sendero: '506718', brote: 'FAFFEE', claro: 'B9B9B6', pista: 'F3F3F1' };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13,333 × 7,5 in
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'Plantilla Santiago Ways';
pres.author = 'Santiago Ways';
pres.company = 'Santiago Ways';
const C = pres.SchemeColor;

const SW = 13.333, SH = 7.5, M = 0.75, CW = SW - 2 * M;
const HEAD = '+mj-lt'; // fuente de títulos del tema (Montserrat ExtraBold)
const LOGO_R = 1080 / 173;

// ---------- piezas de layout ----------
const ph = (name, type, o, text) => ({ placeholder: { options: { name, type, margin: 0, align: 'left', ...o }, text } });
const eyebrowPh = (o = {}) => ph('antetitulo', 'body', { x: M, y: 0.6, w: CW, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2, valign: 'top', ...o }, 'ANTETÍTULO');
const titlePh = (o = {}) => ph('title', 'title', { x: M, y: 0.92, w: CW, h: 0.8, fontSize: 32, color: C.text1, valign: 'top', ...o }, 'Título de la diapositiva');
const footer = [
  { image: { x: M, y: 6.86, w: 1.3, h: 1.3 / LOGO_R, path: f('logo.png') } },
];
const slideNum = { x: SW - M - 0.6, y: 6.8, w: 0.6, h: 0.3, fontSize: 10, color: HEX.grafito, align: 'right', bold: true };
const shortRule = (x, y) => ({ rect: { x, y, w: 0.55, h: 0.055, fill: { color: C.accent1 }, line: { type: 'none' } } });

// 1 · Portada
pres.defineSlideMaster({
  title: 'Portada', background: { color: 'FFFFFF' },
  objects: [
    { image: { x: M, y: 0.7, w: 2.5, h: 2.5 / LOGO_R, path: f('logo.png') } },
    shortRule(M, 3.0),
    ph('antetitulo', 'body', { x: M, y: 3.25, w: 9, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2 }, 'TIPO DE DOCUMENTO · 2027'),
    ph('title', 'title', { x: M, y: 3.62, w: 10.5, h: 1.6, fontSize: 44, color: C.text1, valign: 'top' }, 'Título de la presentación'),
    ph('subtitulo', 'body', { x: M, y: 5.25, w: 9, h: 0.5, fontSize: 18, color: C.accent3, valign: 'top' }, 'Subtítulo o descripción breve'),
    ph('datos', 'body', { x: M, y: 6.55, w: 9, h: 0.35, fontSize: 11, color: C.accent3, valign: 'top' }, 'Nombre Apellido · Área · dd/mm/aaaa'),
  ],
});
// 2 · Portada con foto
pres.defineSlideMaster({
  title: 'Portada con foto', background: { color: 'FFFFFF' },
  objects: [
    { image: { x: M, y: 0.7, w: 2.3, h: 2.3 / LOGO_R, path: f('logo.png') } },
    shortRule(M, 3.0),
    ph('antetitulo', 'body', { x: M, y: 3.25, w: 5.2, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2 }, 'TIPO DE DOCUMENTO · 2027'),
    ph('title', 'title', { x: M, y: 3.62, w: 5.4, h: 1.75, fontSize: 32, color: C.text1, valign: 'top' }, 'Título de la presentación'),
    ph('subtitulo', 'body', { x: M, y: 5.5, w: 5.2, h: 0.75, fontSize: 16, color: C.accent3, valign: 'top' }, 'Subtítulo o descripción breve'),
    ph('datos', 'body', { x: M, y: 6.55, w: 5.2, h: 0.35, fontSize: 11, color: C.accent3, valign: 'top' }, 'Nombre Apellido · Área · dd/mm/aaaa'),
    ph('foto', 'pic', { x: 6.667, y: 0, w: 6.666, h: 7.5, color: C.text1 }, 'Foto'),
  ],
});
// 3 · Separador
pres.defineSlideMaster({
  title: 'Separador', background: { color: 'FFFFFF' },
  objects: [
    ph('numero', 'body', { x: M, y: 1.35, w: 6, h: 1.9, fontSize: 120, fontFace: HEAD, color: C.accent2, valign: 'bottom' }, '01'),
    shortRule(M, 3.55),
    ph('title', 'title', { x: M, y: 3.85, w: 9.5, h: 0.95, fontSize: 40, color: C.text1, valign: 'top' }, 'Título del capítulo'),
    ph('texto', 'body', { x: M, y: 4.9, w: 7.2, h: 1.0, fontSize: 18, color: C.accent3, valign: 'top' }, 'Texto breve que presenta el capítulo'),
    ...footer,
  ],
  slideNumber: slideNum,
});
// 4 · Título solo (para componer encima)
pres.defineSlideMaster({
  title: 'Título solo', background: { color: 'FFFFFF' },
  objects: [eyebrowPh(), titlePh(), ...footer],
  slideNumber: slideNum,
});
// 5 · Título y texto
pres.defineSlideMaster({
  title: 'Título y texto', background: { color: 'FFFFFF' },
  objects: [
    eyebrowPh(), titlePh(),
    ph('body', 'body', { x: M, y: 2.0, w: 7.3, h: 4.4, fontSize: 16, color: C.text1, valign: 'top', lineSpacingMultiple: 1.3 }, 'Texto de la diapositiva'),
    ...footer,
  ],
  slideNumber: slideNum,
});
// 6 · Dos columnas
const colW = (CW - 0.6) / 2;
pres.defineSlideMaster({
  title: 'Dos columnas', background: { color: 'FFFFFF' },
  objects: [
    eyebrowPh(), titlePh(),
    { line: { x: M, y: 2.0, w: colW, h: 0, line: { color: C.text1, width: 0.75 } } },
    { line: { x: M + colW + 0.6, y: 2.0, w: colW, h: 0, line: { color: C.text1, width: 0.75 } } },
    ph('subtitulo1', 'body', { x: M, y: 2.2, w: colW, h: 0.45, fontSize: 18, bold: true, color: C.text1, valign: 'top' }, 'Subtítulo'),
    ph('texto1', 'body', { x: M, y: 2.75, w: colW, h: 3.6, fontSize: 16, color: C.text1, valign: 'top', lineSpacingMultiple: 1.3 }, 'Texto de la columna'),
    ph('subtitulo2', 'body', { x: M + colW + 0.6, y: 2.2, w: colW, h: 0.45, fontSize: 18, bold: true, color: C.text1, valign: 'top' }, 'Subtítulo'),
    ph('texto2', 'body', { x: M + colW + 0.6, y: 2.75, w: colW, h: 3.6, fontSize: 16, color: C.text1, valign: 'top', lineSpacingMultiple: 1.3 }, 'Texto de la columna'),
    ...footer,
  ],
  slideNumber: slideNum,
});
// 7 · Texto e imagen
pres.defineSlideMaster({
  title: 'Texto e imagen', background: { color: 'FFFFFF' },
  objects: [
    eyebrowPh({ w: 5.4 }), titlePh({ w: 5.4, h: 1.3 }),
    ph('body', 'body', { x: M, y: 2.45, w: 5.4, h: 3.9, fontSize: 16, color: C.text1, valign: 'top', lineSpacingMultiple: 1.3 }, 'Texto de la diapositiva'),
    ph('foto', 'pic', { x: 6.9, y: 0, w: 6.433, h: 7.5, color: C.text1 }, 'Foto'),
    ...footer,
  ],
});
// 8 · Foto a sangre
pres.defineSlideMaster({
  title: 'Foto a sangre', background: { color: '2E2E2D' },
  objects: [
    ph('foto', 'pic', { x: 0, y: 0, w: SW, h: SH, color: C.background1 }, 'Foto'),
  ],
});
// 9 · Gráfico y comentario
pres.defineSlideMaster({
  title: 'Gráfico y comentario', background: { color: 'FFFFFF' },
  objects: [
    eyebrowPh(), titlePh(),
    { line: { x: 9.0, y: 2.0, w: SW - M - 9.0, h: 0, line: { color: C.text1, width: 0.75 } } },
    ph('comentario', 'body', { x: 9.0, y: 2.2, w: SW - M - 9.0, h: 4.1, fontSize: 14, color: C.text1, valign: 'top', lineSpacingMultiple: 1.3 }, 'Comentario del gráfico'),
    ...footer,
  ],
  slideNumber: slideNum,
});
// 10 · Cita
pres.defineSlideMaster({
  title: 'Cita', background: { color: 'FFFFFF' },
  objects: [
    shortRule(M, 1.7),
    ph('cita', 'body', { x: M, y: 2.0, w: 7.0, h: 3.0, fontSize: 28, bold: true, color: C.text1, valign: 'top', lineSpacingMultiple: 1.15 }, '«Texto de la cita»'),
    ph('autor', 'body', { x: M, y: 5.2, w: 7.0, h: 0.4, fontSize: 14, color: C.accent3, valign: 'top' }, 'Nombre Apellido · Ruta y año'),
    ph('foto', 'pic', { x: 8.6, y: 0, w: SW - 8.6, h: SH, color: C.text1 }, 'Foto'),
    ...footer,
  ],
});
// 11 · Cierre
pres.defineSlideMaster({
  title: 'Cierre', background: { color: 'FFFFFF' },
  objects: [
    { image: { x: M, y: 0.7, w: 2.5, h: 2.5 / LOGO_R, path: f('logo.png') } },
    shortRule(M, 3.0),
    ph('title', 'title', { x: M, y: 3.3, w: 10.5, h: 1.5, fontSize: 40, color: C.text1, valign: 'top' }, 'Frase de cierre'),
    ph('texto', 'body', { x: M, y: 4.85, w: 8, h: 0.8, fontSize: 18, color: C.accent3, valign: 'top' }, 'Texto breve opcional'),
  ],
});

// ---------- ayudas para componer ----------
let n = 0;
const name = (s) => `${s}-${++n}`;
const tb = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: 'top', objectName: name('texto'), ...o });
const hline = (slide, x, y, w, color, width = 0.75) => slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width }, objectName: name('filete') });
const meta = (slide, items, y, x0 = M, w = CW) => {
  const cw = w / items.length;
  hline(slide, x0, y, w, C.text1, 0.75);
  items.forEach(([k, v], i) => {
    tb(slide, [
      { text: k.toUpperCase(), options: { fontSize: 10, bold: true, color: C.accent3, charSpacing: 1.5, breakLine: true } },
      { text: v, options: { fontSize: 12, color: C.text1 } },
    ], { x: x0 + i * cw, y: y + 0.12, w: cw - 0.2, h: 0.6, paraSpaceAfter: 2 });
  });
};
const bullets = (items, o = {}) => items.map((t, i) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: i < items.length - 1, paraSpaceAfter: 8, ...o } }));
const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.';

// ================= DIAPOSITIVAS =================

// Portadas
pres.addSection({ title: 'Portadas' });
let s = pres.addSlide({ masterName: 'Portada', sectionTitle: 'Portadas' });
s.addText('INFORME · 2027', { placeholder: 'antetitulo' });
s.addText('Título de la presentación en una o dos líneas', { placeholder: 'title' });
s.addText('Subtítulo o descripción breve del contenido.', { placeholder: 'subtitulo' });
s.addText('Nombre Apellido · Marketing · dd/mm/aaaa', { placeholder: 'datos' });

s = pres.addSlide({ masterName: 'Portada con foto', sectionTitle: 'Portadas' });
s.addText('PROPUESTA · 2027', { placeholder: 'antetitulo' });
s.addText('Título de la presentación en una o dos líneas', { placeholder: 'title' });
s.addText('Subtítulo o descripción breve del contenido.', { placeholder: 'subtitulo' });
s.addText('Nombre Apellido · Marketing · dd/mm/aaaa', { placeholder: 'datos' });
s.addImage({ placeholder: 'foto', path: f('f-portada.jpg'), x: 6.667, y: 0, w: 6.666, h: 7.5 });

// Estructura
pres.addSection({ title: 'Estructura' });
s = pres.addSlide({ masterName: 'Título solo', sectionTitle: 'Estructura' });
s.addText('CONTENIDO', { placeholder: 'antetitulo' });
s.addText('Índice', { placeholder: 'title' });
const idx = [['01', 'Resumen', 'Lo más importante en una diapositiva'], ['02', 'Contexto', 'Dónde estamos y por qué'], ['03', 'Datos', 'Cifras, gráficos y tablas'], ['04', 'Propuesta', 'Opciones y recomendación'], ['05', 'Plan', 'Proceso y calendario'], ['06', 'Próximos pasos', 'Qué decidimos hoy']];
idx.forEach(([num, t, d], i) => {
  const col = i < 3 ? 0 : 1, row = i % 3;
  const x = M + col * (colW + 0.6), y = 2.0 + row * 1.4;
  hline(s, x, y, colW, C.background2, 0.75);
  tb(s, num, { x, y: y + 0.22, w: 0.9, h: 0.6, fontSize: 24, fontFace: HEAD, color: C.accent2 });
  tb(s, [{ text: t, options: { fontSize: 20, bold: true, color: C.text1, breakLine: true } }, { text: d, options: { fontSize: 14, color: C.accent3 } }], { x: x + 1.0, y: y + 0.22, w: colW - 1.0, h: 0.95, paraSpaceAfter: 4 });
});

s = pres.addSlide({ masterName: 'Separador', sectionTitle: 'Estructura' });
s.addText('01', { placeholder: 'numero' });
s.addText('Resumen', { placeholder: 'title' });
s.addText('Texto breve que presenta el capítulo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', { placeholder: 'texto' });

// Contenido
pres.addSection({ title: 'Contenido' });
s = pres.addSlide({ masterName: 'Título y texto', sectionTitle: 'Contenido' });
s.addText('CAPÍTULO 01 · RESUMEN', { placeholder: 'antetitulo' });
s.addText('Lo más importante en una diapositiva', { placeholder: 'title' });
s.addText([
  { text: 'Entradilla: una o dos frases que resumen el mensaje principal de la presentación.', options: { fontSize: 20, breakLine: true, paraSpaceAfter: 14 } },
  ...bullets(['Primera idea clave: lorem ipsum dolor sit amet.', 'Segunda idea clave: consectetur adipiscing elit.', 'Tercera idea clave: integer posuere erat a ante.']),
], { placeholder: 'body' });
s.addShape(pres.shapes.RECTANGLE, { x: 8.75, y: 2.0, w: SW - M - 8.75, h: 4.4, fill: { color: C.accent5 }, line: { type: 'none' }, objectName: name('caja-dato') });
tb(s, 'DATO CLAVE', { x: 9.1, y: 2.35, w: 3.1, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2 });
tb(s, '115 km', { x: 9.1, y: 3.6, w: 3.3, h: 1.0, fontSize: 54, fontFace: HEAD, color: C.text1, valign: 'bottom' });
tb(s, 'Distancia mínima a pie para conseguir la Compostela.', { x: 9.1, y: 4.75, w: 3.1, h: 1.2, fontSize: 14, color: C.accent3 });

s = pres.addSlide({ masterName: 'Dos columnas', sectionTitle: 'Contenido' });
s.addText('CAPÍTULO 02 · CONTEXTO', { placeholder: 'antetitulo' });
s.addText('Dónde estamos y adónde vamos', { placeholder: 'title' });
s.addText('Situación actual', { placeholder: 'subtitulo1' });
s.addText([{ text: LOREM, options: { breakLine: true, paraSpaceAfter: 10 } }, ...bullets(['Lorem ipsum dolor sit amet.', 'Consectetur adipiscing elit.', 'Integer posuere erat a ante.'])], { placeholder: 'texto1' });
s.addText('Objetivo para 2027', { placeholder: 'subtitulo2' });
s.addText([{ text: LOREM, options: { breakLine: true, paraSpaceAfter: 10 } }, ...bullets(['Maecenas sed diam eget risus.', 'Vestibulum id ligula porta felis.', 'Nullam quis risus eget urna.'])], { placeholder: 'texto2' });

s = pres.addSlide({ masterName: 'Texto e imagen', sectionTitle: 'Contenido' });
s.addText('CAPÍTULO 02 · CONTEXTO', { placeholder: 'antetitulo' });
s.addText('Una diapositiva con texto y foto', { placeholder: 'title' });
s.addText([{ text: LOREM + ' Cras mattis consectetur purus sit amet fermentum.', options: { breakLine: true, paraSpaceAfter: 12 } }, ...bullets(['Primer punto destacado.', 'Segundo punto destacado.', 'Tercer punto destacado.'])], { placeholder: 'body' });
s.addImage({ placeholder: 'foto', path: f('f-texto.jpg'), x: 6.9, y: 0, w: 6.433, h: 7.5 });

s = pres.addSlide({ masterName: 'Foto a sangre', sectionTitle: 'Contenido' });
s.addImage({ placeholder: 'foto', path: f('f-sangre.jpg'), x: 0, y: 0, w: SW, h: SH });
s.addImage({ path: f('overlay.png'), x: 0, y: 0, w: SW, h: SH, objectName: name('degradado') });
tb(s, 'SANTIAGO DE COMPOSTELA', { x: M, y: 5.0, w: 9, h: 0.3, fontSize: 11, bold: true, color: C.background1, charSpacing: 2 });
tb(s, 'Un titular corto sobre una foto a sangre', { x: M, y: 5.35, w: 9.5, h: 1.3, fontSize: 36, fontFace: HEAD, color: C.background1 });

// Datos
pres.addSection({ title: 'Datos' });
s = pres.addSlide({ masterName: 'Título solo', sectionTitle: 'Datos' });
s.addText('CAPÍTULO 03 · DATOS', { placeholder: 'antetitulo' });
s.addText('Cifras clave', { placeholder: 'title' });
const kpis = [['115 km', 'Distancia mínima a pie para la Compostela'], ['5 a 8', 'Etapas en una ruta habitual'], ['100.000', 'Seguidores en Instagram'], ['2027', 'Año Santo Compostelano']];
const kw = (CW - 3 * 0.4) / 4;
kpis.forEach(([k, t], i) => {
  const x = M + i * (kw + 0.4);
  s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: kw, h: 0.06, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: name('filete-cifra') });
  tb(s, k, { x, y: 2.6, w: kw, h: 0.9, fontSize: 40, fontFace: HEAD, color: C.text1 });
  tb(s, t, { x, y: 3.55, w: kw - 0.2, h: 0.8, fontSize: 14, color: C.accent3 });
});
tb(s, 'Datos de ejemplo. Una frase que explique qué significan las cifras y de dónde salen. ' + LOREM, { x: M, y: 5.0, w: 8.5, h: 1.0, fontSize: 16, color: C.text1, lineSpacingMultiple: 1.3 });

s = pres.addSlide({ masterName: 'Gráfico y comentario', sectionTitle: 'Datos' });
s.addText('CAPÍTULO 03 · DATOS', { placeholder: 'antetitulo' });
s.addText('Peregrinos por ruta', { placeholder: 'title' });
s.addChart(pres.charts.BAR, [{ name: 'Peregrinos (%)', labels: ['Camino Francés', 'Camino Portugués', 'Camino del Norte', 'Camino Primitivo', 'Camino Inglés'], values: [52, 21, 9, 6, 5] }], {
  x: M, y: 2.0, w: 7.8, h: 4.3, barDir: 'bar', barGapWidthPct: 70,
  chartColors: [HEX.ways], showLegend: false, showTitle: false,
  showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0" %"', dataLabelFontFace: '+mn-lt', dataLabelFontSize: 12, dataLabelColor: HEX.grafito, dataLabelFontBold: true,
  catAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 13, catAxisLabelColor: HEX.grafito, catAxisOrientation: 'maxMin', catAxisLineShow: false,
  valAxisHidden: true, valAxisMaxVal: 60, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, objectName: name('grafico'),
});
s.addText([
  { text: 'Qué nos dice', options: { bold: true, fontSize: 16, breakLine: true, paraSpaceAfter: 8 } },
  { text: 'El Camino Francés concentra la mitad de los peregrinos. ' + LOREM, options: { breakLine: true, paraSpaceAfter: 10 } },
  { text: 'Fuente: datos de ejemplo.', options: { fontSize: 11, color: C.accent3 } },
], { placeholder: 'comentario' });

s = pres.addSlide({ masterName: 'Título solo', sectionTitle: 'Datos' });
s.addText('CAPÍTULO 03 · DATOS', { placeholder: 'antetitulo' });
s.addText('Rutas más solicitadas', { placeholder: 'title' });
const bTop = { type: 'none' }, bHair = { type: 'solid', pt: 0.75, color: HEX.niebla }, bDark = { type: 'solid', pt: 1, color: HEX.grafito };
const head = (t, al = 'left') => ({ text: t.toUpperCase(), options: { bold: true, fontSize: 11, color: C.text1, charSpacing: 1, align: al, border: [bTop, bTop, bDark, bTop], margin: [0, 0.1, 0.08, 0] } });
const cellT = (t, al = 'left', o = {}) => ({ text: t, options: { fontSize: 14, color: C.text1, align: al, border: [bTop, bTop, bHair, bTop], margin: [0, 0.1, 0, 0], ...o } });
const rows = [['Camino Francés desde Sarria', '5', '115', '695 €'], ['Camino Portugués desde Tui', '6', '118', '725 €'], ['Camino Inglés desde Ferrol', '5', '113', '680 €'], ['Camino del Norte desde Ribadeo', '8', '193', '1.050 €'], ['Camino Primitivo desde Lugo', '5', '100', '710 €']];
s.addTable([
  [head('Ruta'), head('Etapas', 'right'), head('Km', 'right'), head('Precio desde', 'right')],
  ...rows.map((r) => [cellT(r[0]), cellT(r[1], 'right'), cellT(r[2], 'right'), cellT(r[3], 'right')]),
], { x: M, y: 2.05, w: CW, colW: [6.0, 1.9, 1.9, 2.033], rowH: 0.55, valign: 'middle', objectName: name('tabla') });
tb(s, 'Precios de ejemplo, por persona.', { x: M, y: 5.6, w: 6, h: 0.3, fontSize: 11, color: C.accent3 });

// Propuesta
pres.addSection({ title: 'Propuesta' });
s = pres.addSlide({ masterName: 'Título solo', sectionTitle: 'Propuesta' });
s.addText('CAPÍTULO 04 · PROPUESTA', { placeholder: 'antetitulo' });
s.addText('Comparativa de opciones', { placeholder: 'title' });
const plans = [['Esencial', 'desde 695 €', ''], ['Confort', 'desde 845 €', 'RECOMENDADO'], ['Premium', 'desde 1.190 €', '']];
const feats = [['Alojamiento en cada etapa', 1, 1, 1], ['Traslado de equipaje', 1, 1, 1], ['Desayunos', 0, 1, 1], ['Cenas en ruta', 0, 0, 1], ['Seguro de viaje', 0, 1, 1], ['Guía acompañante', 0, 0, 1]];
const FW = 4.733, PWd = (CW - FW) / 3;
s.addShape(pres.shapes.RECTANGLE, { x: M + FW + PWd, y: 1.95, w: PWd, h: 4.6, fill: { color: C.accent5 }, line: { type: 'none' }, objectName: name('columna-recomendada') });
plans.forEach(([p, pr, tag], i) => {
  const x = M + FW + i * PWd;
  if (tag) tb(s, tag, { x, y: 2.1, w: PWd, h: 0.25, fontSize: 10, bold: true, color: C.accent2, charSpacing: 2, align: 'center' });
  tb(s, [{ text: p, options: { fontSize: 18, bold: true, color: C.text1, breakLine: true } }, { text: pr, options: { fontSize: 12, color: C.accent3 } }], { x, y: 2.4, w: PWd, h: 0.75, align: 'center' });
});
hline(s, M, 3.25, CW, C.text1, 1);
feats.forEach(([t, ...v], r) => {
  const y = 3.3 + r * 0.53;
  tb(s, t, { x: M, y: y + 0.12, w: FW - 0.2, h: 0.3, fontSize: 14, color: C.text1 });
  v.forEach((on, i) => tb(s, on ? '●' : '○', { x: M + FW + i * PWd, y: y + 0.04, w: PWd, h: 0.42, fontSize: 20, fontFace: 'Arial', color: on ? HEX.ways : HEX.claro, align: 'center' }));
  hline(s, M, y + 0.53, CW, C.background2, 0.75);
});

s = pres.addSlide({ masterName: 'Título solo', sectionTitle: 'Propuesta' });
s.addText('CAPÍTULO 04 · PROPUESTA', { placeholder: 'antetitulo' });
s.addText('Cómo funciona', { placeholder: 'title' });
const steps = [['01', 'Elige tu ruta', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'], ['02', 'Reserva', 'Integer posuere erat a ante venenatis dapibus.'], ['03', 'Prepárate', 'Cras mattis consectetur purus sit amet fermentum.'], ['04', 'Camina', 'Donec ullamcorper nulla non metus auctor fringilla.']];
const sw = (CW - 3 * 0.4) / 4;
steps.forEach(([num, t, d], i) => {
  const x = M + i * (sw + 0.4);
  s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: sw, h: 0.06, fill: { color: i === 0 ? C.accent1 : C.background2 }, line: { type: 'none' }, objectName: name('filete-paso') });
  tb(s, num, { x, y: 2.6, w: sw, h: 0.6, fontSize: 28, fontFace: HEAD, color: C.accent2 });
  tb(s, t, { x, y: 3.3, w: sw, h: 0.45, fontSize: 20, bold: true, color: C.text1 });
  tb(s, d, { x, y: 3.85, w: sw - 0.2, h: 1.3, fontSize: 14, color: C.accent3, lineSpacingMultiple: 1.25 });
});

// Plan
pres.addSection({ title: 'Plan' });
s = pres.addSlide({ masterName: 'Título solo', sectionTitle: 'Plan' });
s.addText('CAPÍTULO 05 · PLAN', { placeholder: 'antetitulo' });
s.addText('Plan de trabajo', { placeholder: 'title' });
const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'];
const tasks = [['Definición de la campaña', 0, 1], ['Producción de contenidos', 1, 3], ['Lanzamiento', 3, 3, 1], ['Campaña en redes', 3, 5], ['Medición y ajustes', 4, 5], ['Informe final', 5, 5, 1]];
const TX = M + 3.4, MW = (SW - M - TX) / 6;
months.forEach((m, i) => tb(s, m, { x: TX + i * MW, y: 2.0, w: MW, h: 0.3, fontSize: 11, bold: true, color: C.text1, charSpacing: 1.5, align: 'center' }));
hline(s, M, 2.38, CW, C.text1, 1);
tb(s, 'TAREA', { x: M, y: 2.0, w: 3, h: 0.3, fontSize: 11, bold: true, color: C.text1, charSpacing: 1.5 });
tasks.forEach(([t, a, b, hito], r) => {
  const y = 2.5 + r * 0.6;
  tb(s, t, { x: M, y: y + 0.13, w: 3.3, h: 0.32, fontSize: 14, color: C.text1 });
  s.addShape(pres.shapes.RECTANGLE, { x: TX + a * MW + 0.04, y: y + 0.14, w: (b - a + 1) * MW - 0.08, h: 0.3, fill: { color: hito ? C.accent2 : C.accent1 }, line: { type: 'none' }, objectName: name('barra') });
  hline(s, M, y + 0.58, CW, C.background2, 0.75);
});
s.addShape(pres.shapes.RECTANGLE, { x: M, y: 6.28, w: 0.16, h: 0.16, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: name('leyenda') });
tb(s, 'Tarea', { x: M + 0.25, y: 6.22, w: 1, h: 0.3, fontSize: 11, color: C.accent3 });
s.addShape(pres.shapes.RECTANGLE, { x: M + 1.2, y: 6.28, w: 0.16, h: 0.16, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: name('leyenda') });
tb(s, 'Hito', { x: M + 1.45, y: 6.22, w: 1, h: 0.3, fontSize: 11, color: C.accent3 });

s = pres.addSlide({ masterName: 'Cita', sectionTitle: 'Plan' });
s.addText('«Una opinión de un cliente o una frase que resuma el espíritu de la propuesta. Lorem ipsum dolor sit amet.»', { placeholder: 'cita' });
s.addText('Nombre Apellido · Camino Francés 2026', { placeholder: 'autor' });
s.addImage({ placeholder: 'foto', path: f('f-cita.jpg'), x: 8.6, y: 0, w: SW - 8.6, h: SH });

// Cierre
pres.addSection({ title: 'Cierre' });
s = pres.addSlide({ masterName: 'Título solo', sectionTitle: 'Cierre' });
s.addText('CAPÍTULO 06 · PRÓXIMOS PASOS', { placeholder: 'antetitulo' });
s.addText('Qué decidimos hoy', { placeholder: 'title' });
const next = [['01', 'Primera decisión', 'Responsable · fecha'], ['02', 'Segunda decisión', 'Responsable · fecha'], ['03', 'Tercera decisión', 'Responsable · fecha']];
next.forEach(([num, t, d], r) => {
  const y = 2.0 + r * 1.3;
  hline(s, M, y, CW, C.background2, 0.75);
  tb(s, num, { x: M, y: y + 0.25, w: 1, h: 0.6, fontSize: 28, fontFace: HEAD, color: C.accent2 });
  tb(s, [{ text: t, options: { fontSize: 20, bold: true, color: C.text1, breakLine: true } }, { text: d, options: { fontSize: 14, color: C.accent3 } }], { x: M + 1.2, y: y + 0.25, w: 8, h: 0.9, paraSpaceAfter: 4 });
});
hline(s, M, 2.0 + 3 * 1.3, CW, C.background2, 0.75);

s = pres.addSlide({ masterName: 'Cierre', sectionTitle: 'Cierre' });
s.addText('Frase de cierre de la presentación', { placeholder: 'title' });
s.addText('Gracias. Texto breve opcional con el siguiente paso.', { placeholder: 'texto' });
meta(s, [['Web', 'santiagoways.com'], ['Correo', 'correo@santiagoways.com'], ['Teléfono', '+34 000 000 000'], ['Contacto', 'Nombre Apellido']], 6.2);

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('ok', OUT);
})();
