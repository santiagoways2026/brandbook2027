// Plantilla de presentación Santiago Ways · Brandbook 2027
// Inspirada en la presentación del brandbook y en el plan Xacobeo 27.
// Uso: node build.js salida.pptx
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const pptxgen = require('pptxgenjs');
const JSZip = require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));
const { applyTheme } = require(process.env.APPLY_THEME || './apply_theme.js');

const OUT = process.argv[2] || 'Presentacion_Santiago_Ways.pptx';
const D = __dirname;
const img = (n) => path.join(D, 'img', n);
const icon = (n, c = 'v') => path.join(D, 'icons', `${n}-${c}.png`);

const THEME = {
  name: 'Santiago Ways', headFontFace: 'Montserrat ExtraBold', bodyFontFace: 'Montserrat',
  colors: { dk1: '2E2E2D', lt1: 'FFFFFF', dk2: '506718', lt2: 'E8E8E6', accent1: '7AA606', accent2: '506718', accent3: '6F6F6E', accent4: 'A9C95A', accent5: 'FAFFEE', accent6: '2E2E2D', hlink: '506718', folHlink: '6F6F6E' },
};
const X = { ways: '7AA606', ways2: '628A04', sendero: '506718', grafito: '2E2E2D', gris: '6F6F6E', niebla: 'E8E8E6', brote: 'FAFFEE', blanco: 'FFFFFF', borde: 'ECECEA' };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'Plantilla Santiago Ways';
pres.author = 'Santiago Ways';
pres.company = 'Santiago Ways';
const C = pres.SchemeColor;
const HEAD = '+mj-lt';

const SW = 13.333, SH = 7.5, M = 0.7, CW = SW - 2 * M;
const CT = 2.05, CB = 6.55; // zona de contenido
const ISO = 1.192; // proporción del isotipo

// ---------- medidas de texto (Montserrat real) ----------
const cache = {};
function tw(text, pt, weight = 800) {
  const k = `${weight}|${pt}|${text}`;
  if (!(k in cache)) cache[k] = parseFloat(execFileSync('python3', [path.join(D, 'measure.py'), String(weight), String(pt), text]).toString());
  return cache[k];
}

// ---------- layouts ----------
const ph = (name, type, o, text) => ({ placeholder: { options: { name, type, margin: 0, align: 'left', valign: 'top', ...o }, text } });
const head = (dark) => {
  const col = dark ? C.background1 : null;
  return [
    ph('antetitulo', 'body', { x: M, y: 0.55, w: 9.5, h: 0.25, fontSize: 10, bold: true, color: col || C.accent2, charSpacing: 1.5 }, 'ANTETÍTULO · SECCIÓN'),
    ph('title', 'title', { x: M, y: 0.82, w: 10.8, h: 0.55, fontSize: 28, color: col || C.text1 }, 'Título de la diapositiva'),
    ph('subtitulo', 'body', { x: M, y: 1.42, w: 10.8, h: 0.4, fontSize: 13, color: col || C.accent3 }, 'Una frase que explica la diapositiva'),
    ph('pie', 'body', { x: M, y: 6.95, w: 10, h: 0.25, fontSize: 9, color: col || C.accent3 }, 'Nota al pie o fuente'),
  ];
};
const isoObj = (white) => ({ image: { x: SW - M - 0.4, y: 0.45, w: 0.4, h: 0.4 / ISO, path: img(white ? 'iso-blanco.png' : 'iso-verde.png') } });
const num = (white) => ({ x: SW - M - 0.6, y: 6.93, w: 0.6, h: 0.25, fontSize: 9, color: white ? 'FFFFFF' : X.gris, align: 'right' });

pres.defineSlideMaster({ title: 'Contenido', background: { color: 'FFFFFF' }, objects: [isoObj(false), ...head(false)], slideNumber: num(false) });
pres.defineSlideMaster({ title: 'Contenido verde', background: { path: img('fondo-verde.png') }, objects: [isoObj(true), ...head(true)], slideNumber: num(true) });
pres.defineSlideMaster({ title: 'Contenido sendero', background: { color: X.sendero }, objects: [isoObj(true), ...head(true)], slideNumber: num(true) });
pres.defineSlideMaster({ title: 'Foto a sangre', background: { color: X.grafito }, objects: [ph('foto', 'pic', { x: 0, y: 0, w: SW, h: SH, color: C.background1 }, 'Foto')] });
pres.defineSlideMaster({ title: 'En blanco', background: { color: 'FFFFFF' }, objects: [] });
pres.defineSlideMaster({ title: 'Fondo verde', background: { path: img('fondo-verde.png') }, objects: [] });

// ---------- ayudas ----------
let n = 0;
const nm = (s) => `${s} ${++n}`;
const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, valign: 'top', fontSize: 12, color: C.text1, objectName: nm('Texto'), ...o });
const shadow = () => ({ type: 'outer', color: X.grafito, opacity: 0.12, blur: 14, offset: 3, angle: 90 });
function card(s, x, y, w, h, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: o.r ?? 0.12,
    fill: { color: o.fill || 'FFFFFF' },
    line: o.line ? { color: o.line, width: 0.75 } : { type: 'none' },
    shadow: o.shadow === false ? undefined : shadow(),
    objectName: nm(o.grad ? 'Degradado' : (o.name || 'Tarjeta')),
  });
}
function grad(s, x, y, w, h, o = {}) { card(s, x, y, w, h, { ...o, fill: X.ways, grad: true }); }
// subrayado Ways: bloque de color girado −1,5° con el texto dentro
function sub(s, text, x, y, pt, o = {}) {
  const w = tw(text, pt) + pt / 72 * 0.42, h = pt / 72 * 1.28;
  s.addText(text, { shape: pres.shapes.RECTANGLE, x, y, w, h, rotate: -1.5, fill: { color: o.fill || X.ways }, line: { type: 'none' }, margin: 0, align: 'center', valign: 'middle', fontSize: pt, fontFace: HEAD, color: o.color || 'FFFFFF', objectName: nm('Subrayado Ways') });
  return w;
}
// etiqueta (píldora)
function pill(s, text, x, y, o = {}) {
  const pt = o.pt || 8.5;
  const w = tw(text.toUpperCase(), pt, 700) * 1.12 + 0.24;
  s.addText(text.toUpperCase(), { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.05, x, y, w, h: o.h || 0.24, fill: { color: o.fill || X.ways }, line: o.line ? { color: o.line, width: 0.75 } : { type: 'none' }, margin: 0, align: 'center', valign: 'middle', fontSize: pt, bold: true, charSpacing: 0.8, color: o.color || 'FFFFFF', objectName: nm('Etiqueta') });
  return w;
}
// cabecera de la diapositiva: antetítulo, título (con subrayado opcional), subtítulo y pie
function header(s, eyebrow, title, subtitle, foot, o = {}) {
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { placeholder: 'antetitulo' });
  if (o.hl) {
    s.addText(title, { placeholder: 'title' });
    const x1 = M + tw(title + ' ', 28) - 0.03;
    const w = sub(s, o.hl, x1, 0.8, 28, { fill: o.subFill || (o.dark ? X.sendero : X.ways) });
    if (o.after) T(s, o.after, { x: x1 + w + tw(' ', 28), y: 0.82, w: 6, h: 0.55, fontSize: 28, fontFace: HEAD, color: o.dark ? C.background1 : C.text1 });
  } else if (title) s.addText(title, { placeholder: 'title' });
  if (subtitle) s.addText(subtitle, { placeholder: 'subtitulo' });
  if (foot) s.addText(foot, { placeholder: 'pie' });
}
const line = (s, x, y, w, h, color, width = 1, o = {}) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color, width, ...o }, objectName: nm('Línea') });
const pic = (s, file, x, y, w, h, round = true) => s.addImage({ path: img(file), x, y, w, h, objectName: nm(round ? 'FotoR' : 'Foto') });
const ico = (s, name, x, y, size, c = 'v') => s.addImage({ path: icon(name, c), x, y, w: size, h: size, objectName: nm('Icono') });
const check = (s, x, y, d = 0.22) => {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: X.ways }, line: { type: 'none' }, objectName: nm('Check') });
  ico(s, 'TbCheck', x + d * 0.17, y + d * 0.17, d * 0.66, 'b');
};
const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const LOREM2 = 'Integer posuere erat a ante venenatis dapibus, posuere velit aliquet.';
const sec = (t) => pres.addSection({ title: t });
const slide = (layout, section) => pres.addSlide({ masterName: layout, sectionTitle: section });

// ================= PORTADAS =================
sec('Portadas');
// P1 · Foto a sangre, título grande con subrayado
let s = slide('Foto a sangre', 'Portadas');
s.addImage({ placeholder: 'foto', path: img('catedral.jpg'), x: 0, y: 0, w: SW, h: SH });
s.addImage({ path: img('sombra-foto.png'), x: 0, y: 0, w: SW, h: SH, objectName: nm('Sombra') });
s.addImage({ path: img('logo-blanco.png'), x: M, y: 0.6, w: 2.4, h: 2.4 * 173 / 1080, objectName: nm('Logo') });
T(s, 'PRESENTACIÓN · 2027', { x: M, y: 4.05, w: 8, h: 0.3, fontSize: 12, bold: true, color: C.background1, charSpacing: 2 });
T(s, 'Título de la', { x: M, y: 4.4, w: 10, h: 0.95, fontSize: 60, fontFace: HEAD, color: C.background1 });
sub(s, 'presentación', M, 5.38, 60);
T(s, 'Subtítulo o descripción breve · dd/mm/aaaa', { x: M, y: 6.65, w: 9, h: 0.3, fontSize: 13, color: C.background1 });

// P2 · Foto a sangre con tarjeta blanca (como el brandbook)
s = slide('Foto a sangre', 'Portadas');
s.addImage({ placeholder: 'foto', path: img('catedral-azul.jpg'), x: 0, y: 0, w: SW, h: SH });
card(s, 0.55, 1.6, 5.9, 4.3, { r: 0.16 });
s.addImage({ path: img('logo-verde.png'), x: 0.98, y: 2.05, w: 2.6, h: 2.6 * 173 / 1080, objectName: nm('Logo') });
T(s, 'Título de la', { x: 0.98, y: 2.75, w: 5.2, h: 0.8, fontSize: 46, fontFace: HEAD });
sub(s, 'presentación', 0.98, 3.55, 46);
T(s, 'Subtítulo o descripción breve de la presentación en una o dos líneas.', { x: 0.98, y: 4.55, w: 5.0, h: 0.6, fontSize: 13, color: C.accent3, lineSpacingMultiple: 1.3 });
T(s, 'Nombre Apellido · dd/mm/aaaa', { x: 0.98, y: 5.35, w: 5.0, h: 0.3, fontSize: 10, bold: true, color: C.accent2 });

// P3 · Verde a sangre con la concha y foto
s = slide('Fondo verde', 'Portadas');
s.addImage({ path: img('concha-agua-blanca.png'), x: 3.7, y: 3.25, w: 4.0, h: 4.0 / ISO, objectName: nm('Concha marca de agua') });
s.addImage({ path: img('catedral-v.jpg'), x: 7.95, y: 0, w: SW - 7.95, h: SH, objectName: nm('Foto') });
s.addImage({ path: img('logo-blanco.png'), x: M, y: 0.6, w: 2.4, h: 2.4 * 173 / 1080, objectName: nm('Logo') });
T(s, 'PROPUESTA · 2027', { x: M, y: 2.55, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.background1, charSpacing: 2 });
T(s, 'Título de la', { x: M, y: 2.9, w: 7, h: 0.85, fontSize: 50, fontFace: HEAD, color: C.background1 });
sub(s, 'presentación', M, 3.75, 50, { fill: X.sendero });
T(s, 'Subtítulo o descripción breve de la presentación en una o dos líneas.', { x: M, y: 4.95, w: 6.4, h: 0.65, fontSize: 14, color: C.background1, lineSpacingMultiple: 1.3 });
T(s, 'Nombre Apellido · dd/mm/aaaa', { x: M, y: 6.65, w: 6, h: 0.3, fontSize: 11, bold: true, color: C.background1 });

// ================= ESTRUCTURA =================
sec('Estructura');
// Índice
s = slide('Contenido', 'Estructura');
header(s, 'Contenido', 'Qué vamos a', null, 'Seis bloques, una sola historia', { hl: 'ver' });
s.addText('Un recorrido en seis bloques, de la situación de partida a los próximos pasos.', { placeholder: 'subtitulo' });
const idx = [['01', 'Punto de partida', 'Dónde estamos y por qué'], ['02', 'Objetivos', 'Qué queremos conseguir'], ['03', 'Públicos y mensajes', 'A quién hablamos y cómo'], ['04', 'Plan', 'Fases, acciones y calendario'], ['05', 'Medición', 'Cifras, KPI y seguimiento'], ['06', 'Próximos pasos', 'Qué decidimos hoy']];
const iw = (CW - 2 * 0.3) / 3, ih = 1.95;
idx.forEach(([k, t, d], i) => {
  const x = M + (i % 3) * (iw + 0.3), y = CT + 0.15 + Math.floor(i / 3) * (ih + 0.3);
  card(s, x, y, iw, ih);
  T(s, k, { x: x + 0.3, y: y + 0.28, w: 1, h: 0.5, fontSize: 26, fontFace: HEAD, color: C.accent2 });
  T(s, t, { x: x + 0.3, y: y + 0.9, w: iw - 0.6, h: 0.35, fontSize: 15, bold: true });
  T(s, d, { x: x + 0.3, y: y + 1.27, w: iw - 0.6, h: 0.4, fontSize: 12, color: C.accent3 });
});

// Apertura de bloque con foto y tarjeta (brandbook)
s = slide('Foto a sangre', 'Estructura');
s.addImage({ placeholder: 'foto', path: img('llegada.jpg'), x: 0, y: 0, w: SW, h: SH });
s.addImage({ path: img('iso-blanco.png'), x: SW - M - 0.5, y: 0.45, w: 0.5, h: 0.5 / ISO, objectName: nm('Isotipo') });
card(s, 7.55, 3.55, 5.15, 3.05, { r: 0.16 });
T(s, 'BLOQUE 01 DE 06', { x: 7.95, y: 3.9, w: 4, h: 0.25, fontSize: 10, bold: true, color: C.accent2, charSpacing: 1 });
T(s, 'Punto de', { x: 7.95, y: 4.2, w: 4.6, h: 0.65, fontSize: 36, fontFace: HEAD });
sub(s, 'partida', 7.95, 4.85, 36);
T(s, 'Dónde estamos, qué funciona y qué hay que cambiar.', { x: 7.95, y: 5.6, w: 4.5, h: 0.35, fontSize: 12, color: C.accent3 });
for (let i = 0; i < 6; i++) s.addShape(pres.shapes.RECTANGLE, { x: 7.95 + i * 0.38, y: 6.1, w: 0.3, h: 0.05, fill: { color: i === 0 ? X.ways : X.niebla }, line: { type: 'none' }, objectName: nm('Progreso') });

// Apertura de bloque en verde
s = slide('Fondo verde', 'Estructura');
s.addImage({ path: img('concha-agua-blanca.png'), x: 7.2, y: 1.35, w: 5.4, h: 5.4 / ISO, objectName: nm('Concha marca de agua') });
s.addImage({ path: img('iso-blanco.png'), x: SW - M - 0.4, y: 0.45, w: 0.4, h: 0.4 / ISO, objectName: nm('Isotipo') });
T(s, '02', { x: M, y: 1.35, w: 4, h: 1.6, fontSize: 120, fontFace: HEAD, color: C.background1 });
T(s, 'BLOQUE 02 DE 06', { x: M, y: 3.25, w: 4, h: 0.25, fontSize: 11, bold: true, color: C.background1, charSpacing: 1.5 });
T(s, 'Qué queremos', { x: M, y: 3.55, w: 8, h: 0.75, fontSize: 42, fontFace: HEAD, color: C.background1 });
sub(s, 'conseguir', M, 4.32, 42, { fill: X.sendero });
T(s, 'Objetivos, públicos y mensajes de la campaña.', { x: M, y: 5.25, w: 6, h: 0.4, fontSize: 14, color: C.background1 });

// ================= BLOQUES DE CONTENIDO =================
sec('Bloques de contenido');
// Tres tarjetas numeradas (Xacobeo)
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Objetivos', 'Qué queremos', null, 'Tres objetivos, una campaña', { hl: 'conseguir' });
s.addText('Una frase que resume el objetivo general. ' + LOREM, { placeholder: 'subtitulo' });
const ob = [['Posicionar la marca', LOREM + ' ' + LOREM2], ['Más contactos y reservas', LOREM + ' ' + LOREM2], ['Repetición y recomendación', LOREM + ' ' + LOREM2]];
const ow = (CW - 2 * 0.3) / 3;
ob.forEach(([t, d], i) => {
  const x = M + i * (ow + 0.3), y = CT + 0.2;
  card(s, x, y, ow, 3.2);
  T(s, String(i + 1), { x: x + 0.32, y: y + 0.3, w: 1, h: 0.5, fontSize: 28, fontFace: HEAD });
  T(s, t, { x: x + 0.32, y: y + 0.95, w: ow - 0.64, h: 0.4, fontSize: 15, bold: true, color: C.accent2 });
  T(s, d, { x: x + 0.32, y: y + 1.45, w: ow - 0.64, h: 1.5, fontSize: 12, color: C.accent3, lineSpacingMultiple: 1.3 });
});

// Tres tarjetas que llevan a una conclusión (brandbook)
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Método', 'Cómo hemos llegado a esta propuesta', null, 'Tres miradas, una sola propuesta');
s.addText('Tres análisis que se cruzan en una sola conclusión.', { placeholder: 'subtitulo' });
const tri = [['01', 'Mercado', 'Benchmark de competencia', 'Qué ofrece ya el mercado y dónde se parecen todos.', 'Lo que ya existe'], ['02', 'Santiago Ways', 'Análisis interno', 'Qué hacemos bien hoy y qué podemos hacer mejor que nadie.', 'Lo que hacemos bien'], ['03', 'Cliente', 'Clusterización del target', 'Quién es nuestro cliente potencial y qué necesita de verdad.', 'Lo que quiere y necesita']];
const tw3 = (CW - 2 * 0.3) / 3;
tri.forEach(([k, tag, t, d, f], i) => {
  const x = M + i * (tw3 + 0.3), y = CT + 0.05;
  card(s, x, y, tw3, 2.35);
  T(s, k, { x: x + 0.3, y: y + 0.25, w: 1, h: 0.45, fontSize: 24, fontFace: HEAD, color: C.accent2 });
  const pw = tw(tag, 9, 700) + 0.3;
  s.addText(tag, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.11, x: x + tw3 - 0.3 - pw, y: y + 0.3, w: pw, h: 0.26, fill: { color: X.brote }, line: { color: X.borde, width: 0.75 }, margin: 0, align: 'center', valign: 'middle', fontSize: 9, bold: true, color: C.text1, objectName: nm('Etiqueta') });
  T(s, t, { x: x + 0.3, y: y + 0.85, w: tw3 - 0.6, h: 0.35, fontSize: 15, bold: true });
  T(s, d, { x: x + 0.3, y: y + 1.25, w: tw3 - 0.6, h: 0.55, fontSize: 11.5, color: C.accent3, lineSpacingMultiple: 1.25 });
  T(s, f, { x: x + 0.3, y: y + 1.88, w: tw3 - 0.6, h: 0.25, fontSize: 11, bold: true, color: C.accent2 });
  line(s, x + tw3 / 2, y + 2.35, 0, 0.35, X.ways, 1.5);
});
line(s, M + tw3 / 2, CT + 2.75, 2 * (tw3 + 0.3), 0, X.ways, 1.5);
line(s, SW / 2, CT + 2.75, 0, 0.25, X.ways, 1.5);
grad(s, 3.3, CT + 3.0, SW - 6.6, 1.2);
T(s, 'Propuesta de valor', { x: 3.3, y: CT + 3.17, w: SW - 6.6, h: 0.4, fontSize: 20, bold: true, color: C.background1, align: 'center' });
T(s, 'Nace del cruce entre lo que el mercado no cubre, lo que hacemos bien y lo que el cliente necesita.', { x: 3.6, y: CT + 3.6, w: SW - 7.2, h: 0.5, fontSize: 12, color: C.background1, align: 'center' });

// Diapositiva verde con tarjetas blancas (Xacobeo)
s = slide('Contenido verde', 'Bloques de contenido');
header(s, 'Punto de partida', '2027 es', null, 'Cinco motivos para empezar ya', { hl: 'Año Santo', after: 'y cambia el Camino', dark: true });
s.addText('Una frase que explica por qué este momento es distinto. ' + LOREM, { placeholder: 'subtitulo' });
const five = [['Más peregrinos', 'El Año Santo trae un récord de peregrinos a todas las rutas.'], ['Hoteles saturados', 'Encontrar alojamiento por libre se vuelve difícil.'], ['Opción sensata', 'Con hotel y servicio asegurados, el viaje organizado gana.'], ['Fechas clave', 'Mayo y septiembre se llenan antes que nunca.'], ['Una ventana única', 'El siguiente Año Santo no llega hasta 2032.']];
const fw = (CW - 4 * 0.22) / 5;
five.forEach(([t, d], i) => {
  const x = M + i * (fw + 0.22), y = CT + 0.35;
  card(s, x, y, fw, 2.6, { shadow: false });
  ico(s, ['TbUsers', 'TbBed', 'TbShieldCheck', 'TbCalendar', 'TbClock'][i], x + 0.25, y + 0.28, 0.42);
  T(s, t, { x: x + 0.25, y: y + 0.9, w: fw - 0.45, h: 0.6, fontSize: 14, bold: true, color: C.accent2 });
  T(s, d, { x: x + 0.25, y: y + 1.5, w: fw - 0.45, h: 0.95, fontSize: 11, color: C.accent3, lineSpacingMultiple: 1.25 });
});
T(s, 'Dato o conclusión que acompaña a las tarjetas. ' + LOREM, { x: M, y: 5.6, w: 9, h: 0.4, fontSize: 13, bold: true, color: C.background1 });

// Tarjetas con cabecera verde (Xacobeo)
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Mensaje', 'Cómo se lo contamos a', null, 'Cambian la idea central, la prueba que la respalda y lo que le pedimos', { hl: 'cada público' });
s.addText('Una misma campaña, cuatro maneras de contarla.', { placeholder: 'subtitulo' });
const pub = [['Explorador económico', 'ES, PT, IT'], ['Aspiracional de ultramar', 'LATAM'], ['Premium global', 'US, AU, CA'], ['European trekker', 'DE, UK, IE']];
const pw4 = (CW - 3 * 0.25) / 4;
pub.forEach(([t, m], i) => {
  const x = M + i * (pw4 + 0.25), y = CT + 0.05;
  card(s, x, y, pw4, 4.3);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: pw4, h: 0.75, rectRadius: 0.12, fill: { color: X.ways }, line: { type: 'none' }, objectName: nm('Degradado cabecera') });
  s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.55, w: pw4, h: 0.2, fill: { color: X.ways }, line: { type: 'none' }, objectName: nm('Degradado cabecera') });
  T(s, t, { x: x + 0.22, y: y + 0.14, w: pw4 - 0.44, h: 0.3, fontSize: 13, bold: true, color: C.background1 });
  T(s, m, { x: x + 0.22, y: y + 0.44, w: pw4 - 0.44, h: 0.22, fontSize: 9, bold: true, color: C.background1, charSpacing: 1 });
  [['Lo decimos', 'Una frase con el mensaje principal para este público.'], ['Lo demostramos con', 'Datos, testimonios o garantías que lo prueban.'], ['Le pedimos', 'La acción concreta que esperamos.']].forEach(([k, v], j) => {
    T(s, k, { x: x + 0.22, y: y + 0.98 + j * 1.07, w: pw4 - 0.44, h: 0.25, fontSize: 10.5, bold: true, color: C.accent2 });
    T(s, v, { x: x + 0.22, y: y + 1.24 + j * 1.07, w: pw4 - 0.44, h: 0.7, fontSize: 11, color: C.text1, lineSpacingMultiple: 1.2 });
  });
});

// Diapositiva sendero con tres reglas (Xacobeo)
s = slide('Contenido sendero', 'Bloques de contenido');
header(s, 'Mensaje', 'Tres reglas para todos los', null, 'Aplican a todos los mercados y a todos los canales', { hl: 'mensajes', dark: true, subFill: X.ways });
s.addText('Lo que no cambia, hablemos con quien hablemos.', { placeholder: 'subtitulo' });
const rules3 = [['Primero disponibilidad, después precio', 'La urgencia se construye sobre la disponibilidad. ' + LOREM2], ['Prueba antes que claim', 'Cada mensaje lleva un dato o un testimonio que lo respalde. ' + LOREM2], ['El nombre lo decide el dato', 'Usamos el término que más se busca en cada país. ' + LOREM2]];
const rw = (CW - 2 * 0.5) / 3;
rules3.forEach(([t, d], i) => {
  const x = M + i * (rw + 0.5), y = CT + 0.5;
  T(s, String(i + 1), { x, y, w: 1, h: 0.75, fontSize: 48, fontFace: HEAD, color: C.background1 });
  s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.95, w: 0.5, h: 0.05, fill: { color: X.ways }, line: { type: 'none' }, objectName: nm('Filete') });
  T(s, t, { x, y: y + 1.2, w: rw, h: 0.7, fontSize: 17, bold: true, color: C.background1 });
  T(s, d, { x, y: y + 2.0, w: rw - 0.2, h: 1.3, fontSize: 12, color: C.background1, lineSpacingMultiple: 1.35 });
});

// Embudo por fases (Xacobeo)
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Plan', 'El plan en', null, 'Cada fase del embudo tiene un objetivo propio', { hl: 'cinco fases' });
s.addText('Cada fase tiene su objetivo y sus acciones.', { placeholder: 'subtitulo' });
const fun = [['01 · Posicionamiento', 'Que cada mercado sepa por qué 2027 es especial'], ['02 · Captación', 'Convertir esa intención en contactos'], ['03 · Conversión', 'Ayudar a decidir y reservar'], ['04 · CRM', 'Reactivar a clientes y contactos anteriores'], ['05 · Fidelización', 'Que el viaje salga bien y se recomiende']];
fun.forEach(([t, d], i) => {
  const w = 11.0 - i * 1.15, x = M + i * 0.575, y = CT + 0.1 + i * 0.83;
  if (i < 4) grad(s, x, y, w, 0.66, { shadow: false, r: 0.1 }); else card(s, x, y, w, 0.66, { fill: X.grafito, shadow: false, r: 0.1 });
  T(s, t, { x: x + 0.3, y: y + 0.2, w: 2.6, h: 0.3, fontSize: 12, bold: true, color: C.background1 });
  T(s, d, { x: x + 2.75, y: y + 0.2, w: w - 2.95, h: 0.3, fontSize: 12, color: C.background1 });
});

// Dos mensajes: tarjeta blanca y tarjeta con degradado (brandbook)
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Propósito', 'Misión y visión', null, 'La misión dice qué hacemos hoy; la visión, hacia dónde crecemos');
s.addText('Dos mensajes que conviene leer juntos.', { placeholder: 'subtitulo' });
const hw = (CW - 0.3) / 2;
card(s, M, CT, hw, 3.6);
pill(s, 'Misión', M + 0.4, CT + 0.4);
T(s, 'Por qué existimos', { x: M + 0.4, y: CT + 0.85, w: hw - 0.8, h: 0.3, fontSize: 12, bold: true, color: C.accent3 });
T(s, 'Ayudar a personas de todo el mundo a descubrir y vivir la riqueza del Camino de Santiago, con confort, autonomía y cuidado personal.', { x: M + 0.4, y: CT + 1.3, w: hw - 0.8, h: 2.0, fontSize: 19, bold: true, lineSpacingMultiple: 1.3 });
grad(s, M + hw + 0.3, CT, hw, 3.6);
pill(s, 'Visión', M + hw + 0.7, CT + 0.4, { fill: 'FFFFFF', color: X.sendero });
T(s, 'Adónde vamos', { x: M + hw + 0.7, y: CT + 0.85, w: hw - 0.8, h: 0.3, fontSize: 12, bold: true, color: C.background1 });
T(s, 'Ser la marca de referencia internacional del Camino de Santiago organizado, inspirando a descubrir todas sus posibilidades.', { x: M + hw + 0.7, y: CT + 1.3, w: hw - 0.8, h: 2.0, fontSize: 19, bold: true, color: C.background1, lineSpacingMultiple: 1.3 });

// Tres columnas con cabecera de color (brandbook)
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Punto de partida', 'De dónde partimos y qué cambia', null, 'Conservamos lo que funciona, corregimos lo que confunde y construimos lo que falta');
s.addText('Tres columnas para ordenar un cambio.', { placeholder: 'subtitulo' });
const cols3 = [['01', 'Conservamos', 'Lo que ya funciona', X.ways, ['El verde Ways, ya reconocido.', 'El isotipo de la concha.', 'El logo actual.', 'La jerarquía de dos verdes.']], ['02', 'Corregimos', 'Lo que hoy falla', X.sendero, ['Ratio 50/30/10 entre colores.', 'Montserrat en todas las piezas.', 'Paleta cerrada y códigos únicos.']], ['03', 'Construimos', 'Lo que falta', X.grafito, ['Reglas comunes para todas las piezas.', 'Un bloque propio para la imagen.', 'Plantillas por canal.']]];
const cw3 = (CW - 2 * 0.25) / 3;
cols3.forEach(([k, t, d, col, items], i) => {
  const x = M + i * (cw3 + 0.25), y = CT;
  card(s, x, y, cw3, 3.65);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw3, h: 0.85, rectRadius: 0.12, fill: { color: col }, line: { type: 'none' }, objectName: nm(i === 0 ? 'Degradado cabecera' : 'Cabecera') });
  s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.6, w: cw3, h: 0.25, fill: { color: col }, line: { type: 'none' }, objectName: nm(i === 0 ? 'Degradado cabecera' : 'Cabecera') });
  T(s, [{ text: k + '  ', options: { fontSize: 11, bold: true } }, { text: t, options: { fontSize: 17, bold: true } }], { x: x + 0.25, y: y + 0.13, w: cw3 - 0.5, h: 0.38, color: C.background1, valign: 'middle' });
  T(s, d, { x: x + 0.56, y: y + 0.52, w: cw3 - 0.8, h: 0.25, fontSize: 10, color: C.background1 });
  items.forEach((it, j) => {
    const yy = y + 1.15 + j * 0.62;
    if (i === 0) check(s, x + 0.25, yy + 0.02); else ico(s, 'TbArrowRight', x + 0.22, yy - 0.01, 0.27, i === 1 ? 's' : 'g');
    T(s, it, { x: x + 0.6, y: yy, w: cw3 - 0.85, h: 0.5, fontSize: 12, bold: true, lineSpacingMultiple: 1.15 });
  });
});

// Rejilla de tarjetas con foto (brandbook)
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Valores', 'Siete valores, una forma de hacer el Camino', null, 'Cada valor, traducido a lo que implica para Santiago Ways');
s.addText('Siete tarjetas y una foto: una rejilla para listas de 6 a 8 elementos.', { placeholder: 'subtitulo' });
const vals = ['Dedicación al Camino', 'Cuidado de las personas', 'Raíces locales, mirada internacional', 'Bienestar en movimiento', 'Respeto por el territorio', 'Fiabilidad y coherencia', 'Curiosidad y mejora continua'];
const vw = (CW - 3 * 0.22) / 4, vh = 2.0;
vals.forEach((t, i) => {
  const x = M + (i % 4) * (vw + 0.22), y = CT + Math.floor(i / 4) * (vh + 0.22);
  card(s, x, y, vw, vh);
  T(s, String(i + 1).padStart(2, '0'), { x: x + 0.25, y: y + 0.22, w: 1, h: 0.4, fontSize: 20, fontFace: HEAD, color: C.accent2 });
  T(s, t, { x: x + 0.25, y: y + 0.68, w: vw - 0.5, h: 0.55, fontSize: 13, bold: true });
  T(s, 'Una línea que explica el valor.', { x: x + 0.25, y: y + 1.3, w: vw - 0.5, h: 0.5, fontSize: 10.5, color: C.accent3 });
});
pic(s, 'mirador-c.jpg', M + 3 * (vw + 0.22), CT + vh + 0.22, vw, vh);

// Fase con etiqueta: texto en columnas e imagen (Xacobeo)
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Fase 01 de 05', '', null, 'Las acciones de cada fase, con qué hacemos y para qué');
sub(s, 'Posicionamiento', M, 0.8, 28);
s.addText('Objetivo: que cada mercado entienda por qué 2027 es un año especial para hacer el Camino y lo asocie con Santiago Ways.', { placeholder: 'subtitulo' });
pill(s, 'Posicionamiento', SW - M - 2.4, 0.5, { pt: 8 });
const acts = [['01', 'PR por mercado'], ['02', 'Autoridad externa'], ['03', 'Redes y contenido']];
acts.forEach(([k, t], i) => {
  const y = CT + 0.05 + i * 1.45;
  T(s, [{ text: k + '  ', options: { color: C.accent2, bold: true, fontSize: 11 } }, { text: t, options: { bold: true, fontSize: 14 } }], { x: M, y, w: 6.6, h: 0.3 });
  T(s, [{ text: 'Qué hacemos. ', options: { bold: true, color: C.accent2 } }, { text: LOREM + ' ' + LOREM2, options: { breakLine: true } }, { text: 'Para qué. ', options: { bold: true, color: C.accent2 } }, { text: 'Que la marca aparezca donde el cliente busca.' }], { x: M, y: y + 0.38, w: 6.6, h: 0.95, fontSize: 11, color: C.text1, lineSpacingMultiple: 1.25 });
});
pic(s, 'tejados-g.jpg', 8.0, CT + 0.05, SW - M - 8.0, 3.35);
T(s, 'Pie de imagen: qué muestra la captura o la foto.', { x: 8.0, y: CT + 3.5, w: SW - M - 8.0, h: 0.3, fontSize: 9.5, color: C.accent3 });

// Proceso con flechas
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Proceso', 'Cómo funciona,', null, 'Del primer contacto al regreso a casa', { hl: 'paso a paso' });
s.addText('Cuatro pasos con icono, título y texto. Se pueden añadir o quitar pasos.', { placeholder: 'subtitulo' });
const steps = [['TbRoute', 'Elige tu ruta', 'Te ayudamos a encontrar la ruta y las fechas que mejor encajan contigo.'], ['TbTicket', 'Reserva', 'Confirmamos alojamientos y servicios en menos de 48 horas.'], ['TbBackpack', 'Prepárate', 'Recibes la documentación, la credencial y consejos para el viaje.'], ['TbTrekking', 'Camina', 'Tu equipaje viaja solo y tienes asistencia durante todo el Camino.']];
const sw4 = (CW - 3 * 0.55) / 4;
steps.forEach(([ic, t, d], i) => {
  const x = M + i * (sw4 + 0.55), y = CT + 0.3;
  card(s, x, y, sw4, 3.4);
  s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.35, w: 0.75, h: 0.75, fill: { color: X.brote }, line: { color: X.borde, width: 0.75 }, objectName: nm('Círculo') });
  ico(s, ic, x + 0.45, y + 0.5, 0.45);
  T(s, `PASO ${i + 1}`, { x: x + 0.3, y: y + 1.35, w: 2, h: 0.25, fontSize: 9.5, bold: true, color: C.accent2, charSpacing: 1.2 });
  T(s, t, { x: x + 0.3, y: y + 1.63, w: sw4 - 0.6, h: 0.35, fontSize: 15, bold: true });
  T(s, d, { x: x + 0.3, y: y + 2.05, w: sw4 - 0.55, h: 1.1, fontSize: 11.5, color: C.accent3, lineSpacingMultiple: 1.25 });
  if (i < 3) ico(s, 'TbArrowRight', x + sw4 + 0.1, y + 1.55, 0.35, 'v');
});

// Línea de tiempo
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Calendario', 'Los hitos de', null, 'Fechas orientativas', { hl: '2027' });
s.addText('Una línea de tiempo para fechas clave, lanzamientos o etapas.', { placeholder: 'subtitulo' });
const ms = [['Nov 2026', 'Lanzamiento', 'Abrimos reservas para el Año Santo.'], ['Ene 2027', 'Ultramar', 'Arrancan los mercados lejanos.'], ['Mar 2027', 'Temporada alta', 'Mayo y junio, casi completos.'], ['Jul 2027', 'Día de Santiago', 'Acción especial el 25 de julio.'], ['Dic 2027', 'Balance', 'Cierre del Año Santo y resultados.']];
const ly = CT + 2.0, lx = M + 0.3, lw = CW - 0.6;
s.addShape(pres.shapes.RECTANGLE, { x: lx, y: ly, w: lw, h: 0.06, fill: { color: X.niebla }, line: { type: 'none' }, objectName: nm('Línea de tiempo') });
s.addShape(pres.shapes.RECTANGLE, { x: lx, y: ly, w: lw * 0.42, h: 0.06, fill: { color: X.ways }, line: { type: 'none' }, objectName: nm('Avance') });
ms.forEach(([d, t, x2], i) => {
  const cx = lx + i * (lw / 4), up = i % 2 === 0;
  s.addShape(pres.shapes.OVAL, { x: cx - 0.14, y: ly - 0.11, w: 0.28, h: 0.28, fill: { color: i <= 1 ? X.ways : 'FFFFFF' }, line: { color: X.ways, width: 2 }, objectName: nm('Hito') });
  const bx = Math.min(Math.max(cx - 1.15, M), SW - M - 2.3);
  card(s, bx, up ? ly - 1.85 : ly + 0.45, 2.3, 1.4);
  T(s, d.toUpperCase(), { x: bx + 0.2, y: (up ? ly - 1.85 : ly + 0.45) + 0.18, w: 1.9, h: 0.22, fontSize: 9.5, bold: true, color: C.accent2, charSpacing: 1 });
  T(s, t, { x: bx + 0.2, y: (up ? ly - 1.85 : ly + 0.45) + 0.43, w: 1.95, h: 0.3, fontSize: 13, bold: true });
  T(s, x2, { x: bx + 0.2, y: (up ? ly - 1.85 : ly + 0.45) + 0.76, w: 1.95, h: 0.5, fontSize: 10.5, color: C.accent3 });
});

// Comparativa de opciones
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Propuesta', 'Tres opciones,', null, 'Precios de ejemplo, por persona', { hl: 'una recomendada' });
s.addText('Para comparar planes, proveedores o escenarios.', { placeholder: 'subtitulo' });
const plans = [['Esencial', '695 €', ['Alojamiento en cada etapa', 'Traslado de equipaje', 'Asistencia durante el viaje']], ['Confort', '845 €', ['Todo lo de Esencial', 'Desayunos incluidos', 'Habitación con baño privado', 'Seguro de viaje']], ['Premium', '1.190 €', ['Todo lo de Confort', 'Cenas en ruta', 'Hoteles con encanto', 'Guía acompañante']]];
const pw3 = (CW - 2 * 0.35) / 3;
plans.forEach(([t, p, items], i) => {
  const hi = i === 1, x = M + i * (pw3 + 0.35), y = hi ? CT - 0.1 : CT + 0.15, h = hi ? 4.5 : 4.0;
  if (hi) grad(s, x, y, pw3, h); else card(s, x, y, pw3, h);
  const tc = hi ? C.background1 : C.text1, sc = hi ? C.background1 : C.accent3;
  if (hi) pill(s, 'Recomendado', x + 0.35, y + 0.35, { fill: 'FFFFFF', color: X.sendero });
  T(s, t, { x: x + 0.35, y: y + (hi ? 0.78 : 0.4), w: pw3 - 0.7, h: 0.4, fontSize: 18, bold: true, color: tc });
  T(s, [{ text: 'desde ', options: { fontSize: 11, color: sc } }, { text: p, options: { fontSize: 30, fontFace: HEAD, color: tc } }], { x: x + 0.35, y: y + (hi ? 1.2 : 0.82), w: pw3 - 0.7, h: 0.6, valign: 'bottom' });
  line(s, x + 0.35, y + (hi ? 1.98 : 1.6), pw3 - 0.7, 0, hi ? 'FFFFFF' : X.niebla, 0.75);
  items.forEach((it, j) => {
    const yy = y + (hi ? 2.18 : 1.8) + j * 0.48;
    ico(s, 'TbCheck', x + 0.33, yy - 0.01, 0.24, hi ? 'b' : 'v');
    T(s, it, { x: x + 0.68, y: yy, w: pw3 - 1.0, h: 0.3, fontSize: 12, color: tc });
  });
});

// Ficha de ruta
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Ruta', 'Camino Francés', null, 'Distancias aproximadas; desniveles orientativos', { hl: 'desde Sarria' });
s.addText('Una ficha para presentar una ruta, un producto o un proyecto.', { placeholder: 'subtitulo' });
pic(s, 'puente.jpg', M, CT, 4.6, 4.1);
pill(s, 'Más vendida', M + 0.25, CT + 0.25, { fill: 'FFFFFF', color: X.sendero });
const kd = [['TbRoute', '115 km', 'Distancia'], ['TbCalendar', '7 días', '6 noches'], ['TbMountain', 'Media', 'Dificultad'], ['TbCurrencyEuro', '695 €', 'Desde, por persona']];
const kx = M + 4.95, kw2 = (SW - M - kx - 3 * 0.18) / 4;
kd.forEach(([ic, v, l], i) => {
  const x = kx + i * (kw2 + 0.18);
  card(s, x, CT, kw2, 1.3, { fill: X.brote, shadow: false, line: X.borde });
  ico(s, ic, x + 0.2, CT + 0.2, 0.32);
  T(s, v, { x: x + 0.2, y: CT + 0.6, w: kw2 - 0.3, h: 0.35, fontSize: 17, fontFace: HEAD });
  T(s, l, { x: x + 0.2, y: CT + 0.95, w: kw2 - 0.3, h: 0.25, fontSize: 9.5, color: C.accent3 });
});
const et = [['Sarria', 'Portomarín', '22 km'], ['Portomarín', 'Palas de Rei', '25 km'], ['Palas de Rei', 'Arzúa', '29 km'], ['Arzúa', 'O Pedrouzo', '19 km'], ['O Pedrouzo', 'Santiago', '20 km']];
T(s, 'ETAPAS', { x: kx, y: CT + 1.6, w: 3, h: 0.25, fontSize: 9.5, bold: true, color: C.accent2, charSpacing: 1.2 });
line(s, kx + 0.11, CT + 2.05, 0, 0.5 * 4, X.ways, 1.5);
et.forEach(([a, b, k], i) => {
  const y = CT + 1.95 + i * 0.5;
  s.addShape(pres.shapes.OVAL, { x: kx, y: y + 0.02, w: 0.22, h: 0.22, fill: { color: i === 4 ? X.ways : 'FFFFFF' }, line: { color: X.ways, width: 2 }, objectName: nm('Etapa') });
  T(s, [{ text: `Etapa ${i + 1}  `, options: { bold: true, color: C.accent2, fontSize: 10.5 } }, { text: `${a} › ${b}`, options: { fontSize: 12.5 } }], { x: kx + 0.4, y, w: 4.8, h: 0.3 });
  T(s, k, { x: SW - M - 1.2, y, w: 1.2, h: 0.3, fontSize: 12.5, bold: true, align: 'right' });
  if (i < 4) line(s, kx + 0.4, y + 0.42, SW - M - kx - 0.4, 0, X.niebla, 0.75);
});

// Galería
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Imagen', 'Momentos del', null, 'Fotos con pie: lugar y momento', { hl: 'Camino' });
s.addText('Tres fotos con esquinas redondeadas y pie. Clic derecho › Cambiar imagen.', { placeholder: 'subtitulo' });
const gal = [['conchas.jpg', 'La concha', 'El símbolo que acompaña a cada peregrino.'], ['mojon.jpg', 'El mojón', 'Cada kilómetro, una señal hacia Santiago.'], ['llegada-g.jpg', 'La llegada', 'El abrazo en el Obradoiro.']];
const gw = (CW - 2 * 0.3) / 3;
gal.forEach(([f, t, d], i) => {
  const x = M + i * (gw + 0.3);
  pic(s, f, x, CT + 0.05, gw, 2.75);
  T(s, t, { x, y: CT + 3.0, w: gw, h: 0.3, fontSize: 14, bold: true });
  T(s, d, { x, y: CT + 3.32, w: gw, h: 0.3, fontSize: 11, color: C.accent3 });
});

// Cita sobre foto
s = slide('Foto a sangre', 'Bloques de contenido');
s.addImage({ placeholder: 'foto', path: img('mirador.jpg'), x: 0, y: 0, w: SW, h: SH });
s.addImage({ path: img('iso-blanco.png'), x: SW - M - 0.5, y: 0.45, w: 0.5, h: 0.5 / ISO, objectName: nm('Isotipo') });
card(s, M, 3.2, 6.2, 3.4, { r: 0.16 });
T(s, '«', { x: M + 0.4, y: 3.3, w: 1, h: 0.8, fontSize: 60, fontFace: HEAD, color: C.accent1 });
T(s, 'Una opinión de un cliente o una frase que resuma el espíritu de la propuesta, en dos o tres líneas como mucho.', { x: M + 0.4, y: 4.05, w: 5.4, h: 1.5, fontSize: 18, bold: true, lineSpacingMultiple: 1.25 });
T(s, 'Nombre Apellido · Camino Francés 2026', { x: M + 0.4, y: 5.8, w: 5.4, h: 0.3, fontSize: 11, color: C.accent3 });

// Frase destacada
s = slide('Contenido', 'Bloques de contenido');
s.addText('IDEA CLAVE', { placeholder: 'antetitulo' });
s.addImage({ path: img('concha-agua-verde.png'), x: 8.6, y: 2.4, w: 4.4, h: 4.4 / ISO, objectName: nm('Concha marca de agua') });
T(s, 'Una frase grande para', { x: M, y: 2.3, w: 11, h: 0.85, fontSize: 48, fontFace: HEAD });
sub(s, 'quedarse', M, 3.18, 48);
T(s, 'con la idea principal.', { x: M, y: 4.05, w: 11, h: 0.85, fontSize: 48, fontFace: HEAD });
T(s, 'Texto de apoyo opcional. ' + LOREM, { x: M, y: 5.25, w: 7, h: 0.5, fontSize: 14, color: C.accent3 });
s.addText('Para una sola idea por diapositiva', { placeholder: 'pie' });

// Equipo
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Equipo', 'Quién está detrás de', null, 'Contactos de ejemplo', { hl: 'tu viaje' });
s.addText('Personas, cargos y cómo contactar. Sustituye las iniciales por una foto si la hay.', { placeholder: 'subtitulo' });
const team = [['NA', 'Nombre Apellido', 'Dirección'], ['NA', 'Nombre Apellido', 'Atención al viajero'], ['NA', 'Nombre Apellido', 'Operaciones'], ['NA', 'Nombre Apellido', 'Marketing']];
const tw4 = (CW - 3 * 0.3) / 4;
team.forEach(([ini, nme, role], i) => {
  const x = M + i * (tw4 + 0.3), y = CT + 0.15;
  card(s, x, y, tw4, 3.6);
  s.addText(ini, { shape: pres.shapes.OVAL, x: x + (tw4 - 1.3) / 2, y: y + 0.35, w: 1.3, h: 1.3, fill: { color: X.brote }, line: { color: X.ways, width: 1.5 }, align: 'center', valign: 'middle', fontSize: 26, fontFace: HEAD, color: C.accent2, objectName: nm('Foto o iniciales') });
  T(s, nme, { x: x + 0.2, y: y + 1.9, w: tw4 - 0.4, h: 0.3, fontSize: 14, bold: true, align: 'center' });
  T(s, role, { x: x + 0.2, y: y + 2.22, w: tw4 - 0.4, h: 0.25, fontSize: 11, color: C.accent3, align: 'center' });
  pill(s, 'Contacto', x + (tw4 - 1.0) / 2, y + 2.75, { fill: X.brote, color: X.sendero, line: X.borde });
});

// Preguntas frecuentes
s = slide('Contenido', 'Bloques de contenido');
header(s, 'Dudas', 'Preguntas', null, 'Respuestas de ejemplo', { hl: 'frecuentes' });
s.addText('Seis tarjetas de pregunta y respuesta.', { placeholder: 'subtitulo' });
const qs = ['¿Qué nivel físico hace falta?', '¿Cuál es la mejor época?', '¿Cómo llega la maleta?', '¿Puedo ir solo o sola?', '¿Y si un día no puedo caminar?', '¿Cómo consigo la Compostela?'];
const qw = (CW - 2 * 0.25) / 3, qh = 1.95;
qs.forEach((q, i) => {
  const x = M + (i % 3) * (qw + 0.25), y = CT + Math.floor(i / 3) * (qh + 0.25);
  card(s, x, y, qw, qh);
  s.addText('?', { shape: pres.shapes.OVAL, x: x + 0.25, y: y + 0.25, w: 0.38, h: 0.38, fill: { color: X.ways }, line: { type: 'none' }, align: 'center', valign: 'middle', fontSize: 14, fontFace: HEAD, color: 'FFFFFF', objectName: nm('Pregunta') });
  T(s, q, { x: x + 0.75, y: y + 0.27, w: qw - 1.0, h: 0.4, fontSize: 13, bold: true });
  T(s, LOREM + ' ' + LOREM2, { x: x + 0.25, y: y + 0.85, w: qw - 0.5, h: 0.95, fontSize: 11, color: C.accent3, lineSpacingMultiple: 1.25 });
});

// ================= DATOS =================
sec('Datos');
// Cifras clave
s = slide('Contenido', 'Datos');
header(s, 'Medición', 'Las cifras', null, 'Datos de ejemplo', { hl: 'clave' });
s.addText('Cuatro datos destacados con icono y una línea de contexto.', { placeholder: 'subtitulo' });
const kp = [['TbTrendingUp', '+35 %', 'Reservas frente a 2025'], ['TbUsers', '100.000', 'Seguidores en Instagram'], ['TbStar', '4,8', 'Valoración media de clientes'], ['TbCalendar', '2027', 'Año Santo Compostelano']];
const kw4 = (CW - 3 * 0.3) / 4;
kp.forEach(([ic, v, l], i) => {
  const x = M + i * (kw4 + 0.3), y = CT + 0.3;
  if (i === 0) grad(s, x, y, kw4, 2.8); else card(s, x, y, kw4, 2.8);
  const tc = i === 0 ? C.background1 : C.text1;
  ico(s, ic, x + 0.3, y + 0.3, 0.45, i === 0 ? 'b' : 'v');
  T(s, v, { x: x + 0.3, y: y + 1.0, w: kw4 - 0.4, h: 0.8, fontSize: 34, fontFace: HEAD, color: tc });
  T(s, l, { x: x + 0.3, y: y + 1.9, w: kw4 - 0.5, h: 0.6, fontSize: 12, color: i === 0 ? C.background1 : C.accent3 });
});
T(s, 'Una frase que explique qué significan las cifras y de dónde salen. ' + LOREM, { x: M, y: CT + 3.45, w: 9, h: 0.5, fontSize: 13 });

// Tabla (estilo único)
s = slide('Contenido', 'Datos');
header(s, 'Medición', 'Los', null, 'Todas las tablas siguen este estilo: cabecera en mayúsculas, filetes finos y la cifra a la derecha', { hl: 'KPI', after: 'de la campaña' });
s.addText('Un objetivo medible por fase. Periodo de medición: de noviembre a marzo.', { placeholder: 'subtitulo' });
const bN = { type: 'none' }, bH = { type: 'solid', pt: 0.75, color: X.niebla }, bD = { type: 'solid', pt: 1.25, color: X.grafito };
const th = (t, al = 'left') => ({ text: t.toUpperCase(), options: { bold: true, fontSize: 9, color: X.gris, charSpacing: 1, align: al, border: [bD, bN, bH, bN], margin: [0.1, 0.12, 0.1, 0.12], fill: { color: 'FFFFFF' } } });
const td = (t, o = {}) => ({ text: t, options: { fontSize: 12, color: X.grafito, border: [bN, bN, bH, bN], margin: [0.1, 0.12, 0.1, 0.12], ...o } });
const kpi = [['Posicionamiento', 'Aumento de búsquedas de marca', '+5 %'], ['Captación', 'Contactos que piden presupuesto', '+5 %'], ['Captación', 'Contactos directos desde el blog', '200'], ['Conversión', 'Conversión frente a 2025 en los leads del plan', '+1 pto'], ['CRM', 'Reservas de clientes anteriores', '200'], ['Fidelización', 'Nuevas opiniones', '+3.000'], ['Fidelización', 'Puntuación media mantenida', '4,7']];
s.addTable([
  [th('Fase'), th('Indicador'), th('Objetivo', 'right')],
  ...kpi.map(([f, i2, o], r) => [td(r > 0 && kpi[r - 1][0] === f ? '' : f, { bold: true, color: X.sendero }), td(i2), td(o, { bold: true, align: 'right' })]),
], { x: M, y: CT, w: CW, colW: [2.8, CW - 4.6, 1.8], rowH: 0.48, valign: 'middle', objectName: nm('Tabla') });

// Gráfico (estilo único)
s = slide('Contenido', 'Datos');
header(s, 'Medición', 'Reservas por', null, 'Todos los gráficos siguen este estilo: verde Ways, sin rejilla y con el valor encima. Datos de ejemplo', { hl: 'mes' });
s.addText('Un gráfico nativo: clic derecho › Editar datos.', { placeholder: 'subtitulo' });
card(s, M, CT, 8.2, 4.4);
s.addChart(pres.charts.BAR, [{ name: 'Reservas', labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'], values: [120, 150, 210, 340, 520, 480, 390, 360, 450, 280] }], {
  x: M + 0.3, y: CT + 0.3, w: 7.6, h: 3.8, barDir: 'col', barGapWidthPct: 55,
  chartColors: [X.ways], showLegend: false, showTitle: false,
  showValue: true, dataLabelPosition: 'outEnd', dataLabelFontFace: '+mn-lt', dataLabelFontSize: 10, dataLabelColor: X.grafito, dataLabelFontBold: true,
  catAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 10, catAxisLabelColor: X.gris, catAxisLineShow: true, catAxisLineColor: X.niebla,
  valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, objectName: nm('Gráfico'),
});
card(s, M + 8.5, CT, CW - 8.5, 4.4, { fill: X.brote, shadow: false, line: X.borde });
pill(s, 'Lectura', M + 8.85, CT + 0.35);
T(s, 'Mayo es el mes fuerte', { x: M + 8.85, y: CT + 0.8, w: CW - 9.2, h: 0.65, fontSize: 18, bold: true });
T(s, 'Explica aquí qué muestra el gráfico y qué conclusión sacamos. ' + LOREM, { x: M + 8.85, y: CT + 1.55, w: CW - 9.2, h: 1.6, fontSize: 12, color: C.accent3, lineSpacingMultiple: 1.3 });
T(s, 'Fuente: datos de ejemplo.', { x: M + 8.85, y: CT + 3.75, w: CW - 9.2, h: 0.3, fontSize: 9.5, color: C.accent3 });

// Tablero de tareas (Xacobeo)
s = slide('Contenido', 'Datos');
header(s, 'Seguimiento', 'Tareas y', null, 'Estados: borrador, en curso y hecho', { hl: 'estado' });
s.addText('Un tablero por fases para seguir el plan.', { placeholder: 'subtitulo' });
const kb = [['01 Posicionamiento', [['PR por mercado', 'Borrador'], ['Redes y contenido', 'Hecho'], ['Autoridad externa', 'En curso']]], ['02 Captación', [['Guía Xacobeo 2027', 'Hecho'], ['Landing de Meta Ads', 'Borrador'], ['Contactos B2B', 'En curso']]], ['03 Conversión', [['Briefing comercial', 'Borrador'], ['PDF de la ruta', 'Borrador']]], ['04 CRM', [['Email segmentado', 'Borrador'], ['Retargeting', 'En curso']]], ['05 Fidelización', [['Email de expectativas', 'Borrador'], ['Protocolo de reseñas', 'Borrador']]]];
const kw5 = (CW - 4 * 0.2) / 5;
const st = { Borrador: [X.ways, 'FFFFFF'], 'En curso': [X.grafito, 'FFFFFF'], Hecho: [X.brote, X.sendero] };
kb.forEach(([t, items], i) => {
  const x = M + i * (kw5 + 0.2), y = CT;
  s.addText(t, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x, y, w: kw5, h: 0.42, fill: { color: X.ways }, line: { type: 'none' }, margin: [0, 0.15, 0, 0.15], align: 'left', valign: 'middle', fontSize: 11, bold: true, color: 'FFFFFF', objectName: nm('Degradado columna') });
  items.forEach(([it, e], j) => {
    const yy = y + 0.6 + j * 1.05;
    card(s, x, yy, kw5, 0.9);
    T(s, it, { x: x + 0.15, y: yy + 0.13, w: kw5 - 0.3, h: 0.3, fontSize: 11, bold: true });
    pill(s, e, x + 0.15, yy + 0.5, { fill: st[e][0], color: st[e][1], pt: 7.5, h: 0.22, line: e === 'Hecho' ? X.borde : null });
  });
});

// ================= RECURSOS DE MARCA =================
sec('Recursos de marca');
// La concha, nuestro sello
s = slide('Contenido', 'Recursos de marca');
header(s, 'El concepto', 'La concha, nuestro sello', null, 'La concha es un recurso de marca con el que jugar');
s.addText('Como el sello de la credencial del peregrino, identifica la pieza como nuestra.', { placeholder: 'subtitulo' });
[['Siempre entera: nunca recortada, girada ni usada como trama.'], ['Cuando firma una pieza, va arriba a la derecha.'], ['En verde Ways sobre blanco; en blanco sobre foto o color.'], ['Como marca de agua, muy suave y grande.']].forEach(([t], i) => {
  check(s, M, CT + 0.15 + i * 0.55);
  T(s, t, { x: M + 0.4, y: CT + 0.13 + i * 0.55, w: 5.8, h: 0.3, fontSize: 12.5 });
});
card(s, M, CT + 2.55, 6.1, 1.25, { fill: X.brote, shadow: false, line: X.borde });
T(s, 'UN RECURSO PARA JUGAR', { x: M + 0.25, y: CT + 2.75, w: 5, h: 0.25, fontSize: 9.5, bold: true, color: C.accent2, charSpacing: 1 });
T(s, 'Las cajas de esta página llevan la concha como marca de agua: cópialas y cambia el texto.', { x: M + 0.25, y: CT + 3.05, w: 5.6, h: 0.55, fontSize: 11.5, lineSpacingMultiple: 1.25 });
// tres usos de la concha
card(s, 7.3, CT, 2.55, 2.0);
s.addImage({ path: img('concha-agua-verde.png'), x: 7.65, y: CT + 0.45, w: 1.85, h: 1.85 / ISO, objectName: nm('Concha marca de agua') });
T(s, 'Tu Camino, sin prisas.', { x: 7.55, y: CT + 0.3, w: 2.1, h: 0.75, fontSize: 15, fontFace: HEAD });
grad(s, 10.08, CT, 2.55, 2.0);
s.addImage({ path: img('concha-agua-blanca.png'), x: 10.43, y: CT + 0.45, w: 1.85, h: 1.85 / ISO, objectName: nm('Concha marca de agua') });
T(s, 'Tu Camino, sin prisas.', { x: 10.33, y: CT + 0.3, w: 2.1, h: 0.75, fontSize: 15, fontFace: HEAD, color: C.background1 });
card(s, 7.3, CT + 2.25, 2.55, 1.55, { fill: X.sendero });
s.addImage({ path: img('iso-blanco.png'), x: 8.2, y: CT + 2.6, w: 0.75, h: 0.75 / ISO, objectName: nm('Isotipo') });
card(s, 10.08, CT + 2.25, 2.55, 1.55);
s.addImage({ path: img('iso-verde.png'), x: 10.98, y: CT + 2.6, w: 0.75, h: 0.75 / ISO, objectName: nm('Isotipo') });
T(s, 'Marca de agua sobre blanco y sobre verde, e isotipo en sus dos colores.', { x: 7.3, y: CT + 3.95, w: 5.4, h: 0.3, fontSize: 9.5, color: C.accent3 });

// Cajas, etiquetas y verdes
s = slide('Contenido', 'Recursos de marca');
header(s, 'Recursos', 'Cajas, etiquetas y', null, 'Copia y pega la pieza que necesites; cambia solo el texto', { hl: 'verdes' });
s.addText('Los formatos de la marca, listos para copiar.', { placeholder: 'subtitulo' });
const bx = (CW - 3 * 0.25) / 4, by = 1.6;
const boxes = [
  ['Verde Ways', 'Caja plana para destacar.', (x, y) => card(s, x, y, bx, by, { fill: X.ways, shadow: false }), true],
  ['Degradado', 'Solo en cajas de verde Ways.', (x, y) => grad(s, x, y, bx, by), true],
  ['Verde sendero', 'Para resaltar y para fondos.', (x, y) => card(s, x, y, bx, by, { fill: X.sendero, shadow: false }), true],
  ['Grafito', 'Un resalte muy puntual.', (x, y) => card(s, x, y, bx, by, { fill: X.grafito, shadow: false }), true],
  ['Tarjeta blanca', 'Con sombra suave.', (x, y) => card(s, x, y, bx, by), false],
  ['Brote', 'Notas y avisos.', (x, y) => card(s, x, y, bx, by, { fill: X.brote, shadow: false, line: X.borde }), false],
  ['Con cabecera', 'Para columnas.', (x, y) => { card(s, x, y, bx, by); s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: bx, h: 0.45, rectRadius: 0.12, fill: { color: X.ways }, line: { type: 'none' }, objectName: nm('Degradado cabecera') }); s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.3, w: bx, h: 0.15, fill: { color: X.ways }, line: { type: 'none' }, objectName: nm('Degradado cabecera') }); }, false, true],
  ['Con marca de agua', 'La concha, muy suave.', (x, y) => { card(s, x, y, bx, by); s.addImage({ path: img('concha-agua-verde.png'), x: x + bx - 1.45, y: y + 0.3, w: 1.35, h: 1.35 / ISO, objectName: nm('Concha marca de agua') }); }, false],
];
boxes.forEach(([t, d, draw, dark, headed], i) => {
  const x = M + (i % 4) * (bx + 0.25), y = CT - 0.05 + Math.floor(i / 4) * (by + 0.2);
  draw(x, y);
  T(s, t, { x: x + 0.22, y: y + (headed ? 0.08 : 0.22), w: bx - 0.44, h: 0.3, fontSize: 13, bold: true, color: dark || headed ? C.background1 : C.text1 });
  T(s, d, { x: x + 0.22, y: y + (headed ? 0.65 : 0.58), w: bx - 0.44, h: 0.5, fontSize: 10.5, color: dark ? C.background1 : C.accent3 });
});
// fila de etiquetas y subrayados
let px = M; const py = CT + 2 * (by + 0.2) - 0.05 + 0.05;
px += pill(s, 'Etiqueta', px, py) + 0.15;
px += pill(s, 'Sendero', px, py, { fill: X.sendero }) + 0.15;
px += pill(s, 'Brote', px, py, { fill: X.brote, color: X.sendero, line: X.borde }) + 0.15;
px += pill(s, 'En curso', px, py, { fill: X.grafito }) + 0.4;
px += sub(s, 'Subrayado Ways', px, py - 0.06, 16) + 0.25;
px += sub(s, 'En sendero', px, py - 0.06, 16, { fill: X.sendero }) + 0.35;
check(s, px, py + 0.01); px += 0.4;
s.addShape(pres.shapes.RECTANGLE, { x: px, y: py + 0.1, w: 0.5, h: 0.05, fill: { color: X.ways }, line: { type: 'none' }, objectName: nm('Filete') });

// Iconos
s = slide('Contenido', 'Recursos de marca');
header(s, 'Recursos', 'Iconos para', null, 'Iconos de línea (Tabler, licencia MIT). Cópialos y cambia el tamaño sin deformarlos', { hl: 'copiar y pegar' });
s.addText('Sesenta iconos en verde Ways. Debajo, cómo usarlos sobre fondo de color.', { placeholder: 'subtitulo' });
const ICONS = JSON.parse(fs.readFileSync(path.join(D, 'iconlist.json')));
const cols = 15, cwI = CW / cols, rowH = 0.85;
ICONS.forEach(([nmI, lab], i) => {
  const cx = M + (i % cols) * cwI, cy = CT - 0.05 + Math.floor(i / cols) * rowH;
  ico(s, nmI, cx + (cwI - 0.4) / 2, cy, 0.4);
  T(s, lab, { x: cx, y: cy + 0.45, w: cwI, h: 0.22, fontSize: 7.5, color: C.accent3, align: 'center' });
});
const fy = CT + 4 * rowH + 0.05;
T(s, 'FORMATOS', { x: M, y: fy + 0.12, w: 1.3, h: 0.25, fontSize: 9, bold: true, color: C.accent2, charSpacing: 1 });
const fmts = [['TbBed', X.ways, 'b', null], ['TbLuggage', X.sendero, 'b', null], ['TbRoute', X.brote, 'v', X.borde], ['TbStar', X.grafito, 'b', null], ['TbHeart', 'FFFFFF', 'v', X.borde]];
fmts.forEach(([ic, fill, c, ln], i) => {
  const x = M + 1.4 + i * 0.7;
  s.addShape(pres.shapes.OVAL, { x, y: fy, w: 0.5, h: 0.5, fill: { color: fill }, line: ln ? { color: ln, width: 0.75 } : { type: 'none' }, objectName: nm('Círculo de icono') });
  ico(s, ic, x + 0.11, fy + 0.11, 0.28, c);
});

// ================= CONTRAPORTADAS =================
sec('Contraportadas');
// C1 · Foto a sangre con «Gracias» (Xacobeo)
s = slide('Foto a sangre', 'Contraportadas');
s.addImage({ placeholder: 'foto', path: img('fuegos.jpg'), x: 0, y: 0, w: SW, h: SH });
s.addImage({ path: img('sombra-foto.png'), x: 0, y: 0, w: SW, h: SH, objectName: nm('Sombra') });
s.addImage({ path: img('logo-blanco.png'), x: M, y: 0.6, w: 2.4, h: 2.4 * 173 / 1080, objectName: nm('Logo') });
sub(s, 'Gracias', M, 4.9, 64);
T(s, 'santiagoways.com', { x: M, y: 6.25, w: 6, h: 0.4, fontSize: 18, bold: true, color: C.background1 });

// C2 · Verde con la concha y contacto
s = slide('Fondo verde', 'Contraportadas');
s.addImage({ path: img('concha-agua-blanca.png'), x: 7.3, y: 1.0, w: 5.4, h: 5.4 / ISO, objectName: nm('Concha marca de agua') });
s.addImage({ path: img('logo-blanco.png'), x: M, y: 0.6, w: 2.4, h: 2.4 * 173 / 1080, objectName: nm('Logo') });
T(s, 'Tu Camino', { x: M, y: 2.6, w: 8, h: 0.95, fontSize: 54, fontFace: HEAD, color: C.background1 });
sub(s, 'empieza aquí', M, 3.55, 54, { fill: X.sendero });
const ct = [['Web', 'santiagoways.com'], ['Correo', 'correo@santiagoways.com'], ['Teléfono', '+34 000 000 000']];
ct.forEach(([k, v], i) => {
  const x = M + i * 3.2;
  line(s, x, 5.55, 2.9, 0, 'FFFFFF', 0.75);
  T(s, k.toUpperCase(), { x, y: 5.7, w: 2.9, h: 0.22, fontSize: 9, bold: true, color: C.background1, charSpacing: 1.2 });
  T(s, v, { x, y: 5.95, w: 2.9, h: 0.3, fontSize: 13, color: C.background1 });
});

// C3 · Blanca con logo vertical y concha
s = slide('En blanco', 'Contraportadas');
s.addImage({ path: img('concha-agua-verde.png'), x: SW - M - 3.0, y: SH - 0.55 - 3.0 / ISO, w: 3.0, h: 3.0 / ISO, objectName: nm('Concha marca de agua') });
s.addImage({ path: img('logo-vertical.png'), x: (SW - 2.1) / 2, y: 2.05, w: 2.1, h: 2.1 * 307 / 340, objectName: nm('Logo') });
T(s, 'Gracias por tu tiempo', { x: 2, y: 4.25, w: SW - 4, h: 0.6, fontSize: 28, fontFace: HEAD, align: 'center' });
T(s, 'santiagoways.com · correo@santiagoways.com · +34 000 000 000', { x: 2, y: 4.95, w: SW - 4, h: 0.3, fontSize: 12, color: C.accent3, align: 'center' });

// ---------- escribir, aplicar tema y retoques ----------
(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  // degradado 135° en las cajas «Degradado» y esquinas redondeadas en las fotos «FotoR»
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  const GRAD = '<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:srgbClr val="7AA606"/></a:gs><a:gs pos="100000"><a:srgbClr val="628A04"/></a:gs></a:gsLst><a:lin ang="2700000" scaled="0"/></a:gradFill>';
  for (const f of Object.keys(zip.files).filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))) {
    let x = await zip.file(f).async('string');
    x = x.replace(/(<p:sp>(?:(?!<\/p:sp>).)*?name="Degradado[^"]*"(?:(?!<\/p:sp>).)*?<p:spPr>(?:(?!<\/p:spPr>).)*?)<a:solidFill>(?:(?!<\/a:solidFill>).)*<\/a:solidFill>/gs, `$1${GRAD}`);
    x = x.replace(/(<p:pic>(?:(?!<\/p:pic>).)*?name="FotoR[^"]*"(?:(?!<\/p:pic>).)*?)<a:prstGeom prst="rect">\s*<a:avLst\s*\/>\s*<\/a:prstGeom>/gs, '$1<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 5000"/></a:avLst></a:prstGeom>');
    x = x.replace(/(<p:pic>(?:(?!<\/p:pic>).)*?name="FotoR[^"]*"(?:(?!<\/p:pic>).)*?)<a:prstGeom prst="rect"><a:avLst><\/a:avLst><\/a:prstGeom>/gs, '$1<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 5000"/></a:avLst></a:prstGeom>');
    zip.file(f, x);
  }
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('ok', OUT);
})();
