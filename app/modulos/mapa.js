import { esc, linea, leerFichas, campo, avisarAlt, normalizar } from './_comun.js';

const SI = (v) => ['si', 'sí', 'yes', 'true', '1'].indexOf(normalizar(v)) !== -1;

export default {
  id: 'mapa',
  nombre: 'Mapa o perfil',
  clase: '.mapa',
  grupo: 'Rutas',
  descripcion:
    'Mapa o perfil de altitud de una ruta, en SVG, sobre tarjeta con sombra y con su pie: título, texto y enlaces al track GPX y a la vista a pantalla completa. Los SVG salen de tools/mapas/generar.py.',
  estado: { texto: 'Bloque nuevo · CSS en mapa.css', tono: 'aviso' },
  reglas: [
    'La imagen es un <img> con el SVG, no un SVG pegado en el HTML: así Google Imágenes la indexa y el SVG trae dentro su fuente y su animación.',
    'width y height son las medidas reales del SVG. Sin ellas la página salta mientras carga.',
    'loading="lazy" en todos menos en el primero de la página, que va con «primero: sí» (eager y fetchpriority alto).',
    'El enlace de la imagen abre el SVG a pantalla completa: en móvil es la manera de hacer zoom.',
    'Si el mapa es más de un 10 % más alto que ancho se añade mapa--vertical, que en escritorio lo limita a 640 px. El módulo lo pone solo.',
    'Cada SVG tiene su versión -movil, compuesta para leerse en un teléfono. Va en un <source> del <picture> hasta 760 px, con sus propios width y height.',
    'La flecha de .mapa__link la pone el CSS (::after). No se escribe.',
  ],
  entrada: {
    etiqueta: 'Un campo por línea',
    ayuda:
      'imagen, alt, ancho, alto, movil, ancho_movil, alto_movil, titulo, texto y, opcionales, gpx (url del track) y primero (sí, solo en el primer mapa de la página). Las medidas están en salidas/mapa-camino-de-santiago/mapas/indice.json.',
    filas: 12,
  },

  demo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2026/11/mapa-camino-frances.svg',
    'alt: Mapa del Camino Francés de Saint-Jean-Pied-de-Port a Santiago de Compostela, por Pamplona, Logroño, Burgos, León, Ponferrada, O Cebreiro y Sarria',
    'ancho: 1200',
    'alto: 660',
    'movil: https://santiagoways.com/wp-content/uploads/2026/11/mapa-camino-frances-movil.svg',
    'ancho_movil: 560',
    'alto_movil: 598',
    'titulo: Mapa del Camino Francés',
    'texto: 766 km de Saint-Jean-Pied-de-Port a Santiago de Compostela por el norte peninsular.',
    'gpx: https://santiagoways.com/wp-content/uploads/2026/11/camino-frances.gpx',
  ].join('\n'),

  ejemplo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2026/11/perfil-camino-primitivo.svg',
    'alt: Perfil de altitud del Camino Primitivo, con el Puerto del Palo como punto más alto',
    'ancho: 1200',
    'alto: 470',
    'movil: https://santiagoways.com/wp-content/uploads/2026/11/perfil-camino-primitivo-movil.svg',
    'ancho_movil: 560',
    'alto_movil: 460',
    'titulo: Perfil de altitud del Camino Primitivo',
    'texto: 312 km y unos 6780 m de desnivel positivo acumulado.',
  ].join('\n'),

  render(bruto) {
    const { cabecera, avisos } = leerFichas(bruto, {
      cabecera: ['imagen', 'alt', 'ancho', 'alto', 'movil', 'ancho_movil', 'alto_movil', 'titulo', 'texto', 'gpx', 'primero'],
      multilinea: ['alt', 'texto'],
    });

    const imagen = campo(cabecera, 'imagen');
    const alt = campo(cabecera, 'alt');
    const ancho = parseInt(campo(cabecera, 'ancho'), 10);
    const alto = parseInt(campo(cabecera, 'alto'), 10);
    const titulo = campo(cabecera, 'titulo');
    const texto = campo(cabecera, 'texto');
    const gpx = campo(cabecera, 'gpx');
    const primero = SI(campo(cabecera, 'primero'));
    const movil = campo(cabecera, 'movil');
    const anchoMovil = parseInt(campo(cabecera, 'ancho_movil'), 10);
    const altoMovil = parseInt(campo(cabecera, 'alto_movil'), 10);

    if (!imagen) throw new Error('Falta la imagen. Escribe una línea «imagen: …» con la url del SVG.');
    if (!ancho || !alto) {
      throw new Error('Faltan «ancho:» y «alto:». Son las medidas del SVG y evitan que la página salte al cargar.');
    }
    avisarAlt(avisos, alt, 'este mapa');
    if (!/\.svg(\?|$)/i.test(imagen)) {
      avisos.push('La imagen no es un SVG: se verá, pero pierde la animación y la nitidez al hacer zoom.');
    }
    if (!movil) {
      avisos.push('Sin «movil:» el teléfono recibe el mapa grande reducido a 360 px: los rótulos quedan en 5 px.');
    } else if (!anchoMovil || !altoMovil) {
      throw new Error('Faltan «ancho_movil:» y «alto_movil:», las medidas de la versión móvil.');
    }
    if (!titulo) avisos.push('Sin «titulo:» el pie queda sin nombre: Google lo usa para entender la imagen.');

    const clase = alto > ancho * 1.1 ? 'mapa mapa--vertical' : 'mapa';
    const carga = primero
      ? 'loading="eager" fetchpriority="high" decoding="async"'
      : 'loading="lazy" decoding="async"';

    const out = [];
    out.push('<figure class="' + clase + '">');
    const img =
      '<img class="mapa__img" src="' + esc(imagen) + '" alt="' + esc(alt) + '" width="' + ancho +
      '" height="' + alto + '" ' + carga + ' />';
    const fuente = movil
      ? '<picture><source media="(max-width: 760px)" srcset="' + esc(movil) + '" width="' + anchoMovil +
        '" height="' + altoMovil + '" />' + img + '</picture>'
      : img;
    out.push('<a class="mapa__media" href="' + esc(imagen) + '">' + fuente + '</a>');
    out.push('<figcaption class="mapa__caption">');
    if (titulo) out.push('<span class="mapa__title">' + linea(titulo) + '</span>');
    if (texto) out.push('<span class="mapa__text">' + linea(texto) + '</span>');
    const enlaces = [];
    if (gpx) enlaces.push('<a class="mapa__link" href="' + esc(gpx) + '" download>Descargar el track GPX</a>');
    enlaces.push('<a class="mapa__link" href="' + esc(imagen) + '">Ver el mapa a pantalla completa</a>');
    out.push('<span class="mapa__links">' + enlaces.join('') + '</span>');
    out.push('</figcaption>');
    out.push('</figure>');

    return { html: out.join('\n'), avisos };
  },
};
