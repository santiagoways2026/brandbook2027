import { esc, linea, leerFichas, campo, tamano } from './_comun.js';

export default {
  id: 'features',
  nombre: 'Características',
  clase: '.features',
  grupo: 'Rejillas',
  descripcion:
    'Rejilla de tarjetas blancas con un icono en imagen, un título y una línea de texto. Para resumir qué incluye un servicio.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'Los iconos llevan alt="" A PROPÓSITO: son decorativos y el título que va justo debajo ya dice lo mismo. Ponerles texto alternativo haría que los lectores de pantalla lo repitieran.',
    'El <img> no lleva clase: el CSS lo selecciona con .features__icon img y lo fuerza a 40 × 40.',
    'Aun así el original escribe width="40" height="40" en el HTML, que es lo correcto: reserva el hueco y evita que la página salte al cargar.',
    'El título es <h3>, un encabezado de verdad: entra en el índice de la página.',
    'A diferencia de cards, este bloque no va dentro de una caja: las tarjetas flotan sobre el fondo del artículo.',
  ],
  entrada: {
    etiqueta: 'Una ficha por característica',
    ayuda:
      'Cada tarjeta empieza por «titulo:» y lleva «texto:» e «icono:» (la url de la imagen). El tamaño por defecto es 40x40; cámbialo con «tamano: 48x48».',
    filas: 12,
  },

  demo: [
    'titulo: Organización completa',
    'texto: Nos encargamos de todo para que disfrutes sin preocuparte por la logística.',
    'icono: https://santiagoways.com/wp-content/uploads/2026/04/brujula-1.png',
    'titulo: Alojamientos seleccionados',
    'texto: Hoteles y casas rurales que garantizan descanso y calidad.',
    'icono: https://santiagoways.com/wp-content/uploads/2026/04/hotel-1.png',
    'titulo: Transporte de equipaje',
    'texto: Camina sin peso y disfruta mucho más cada etapa.',
    'icono: https://santiagoways.com/wp-content/uploads/2026/04/mochila-1.png',
    'titulo: Rutas personalizadas',
    'texto: Adaptamos el Camino a tu nivel y a tu tiempo disponible.',
    'icono: https://santiagoways.com/wp-content/uploads/2026/04/marca-de-ubicacion.png',
    'titulo: Asistencia durante el viaje',
    'texto: Te acompañamos antes y durante todo el Camino.',
    'icono: https://santiagoways.com/wp-content/uploads/2026/04/auriculares.png',
  ].join('\n'),

  ejemplo: [
    'titulo: Habitación privada cada noche',
    'texto: Hoteles visitados y seleccionados por nuestro equipo.',
    'icono: https://santiagoways.com/wp-content/uploads/2026/04/hotel-1.png',
    'titulo: Transporte de equipaje',
    'texto: Camina ligero y encuentra tu maleta al llegar.',
    'icono: https://santiagoways.com/wp-content/uploads/2026/04/mochila-1.png',
    'titulo: Asistencia 24 horas',
    'texto: Te acompañamos antes y durante todo el Camino.',
    'icono: https://santiagoways.com/wp-content/uploads/2026/04/auriculares.png',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'titulo',
      ficha: ['texto', 'icono', 'tamano'],
      multilinea: ['texto', 'titulo'],
    });

    const fichas = grupos[0] ? grupos[0].fichas : [];
    if (!fichas.length) {
      throw new Error('No hay ninguna característica. Cada una empieza por una línea «titulo: …».');
    }

    const out = [];
    out.push('<div class="features">');
    out.push('<div class="features__grid">');

    fichas.forEach((f) => {
      const titulo = campo(f, 'titulo');
      const texto = campo(f, 'texto');
      const icono = campo(f, 'icono');
      const medida = tamano(campo(f, 'tamano')) || ' width="40" height="40"';

      if (!icono) {
        avisos.push('La característica «' + titulo + '» no tiene icono: la tarjeta queda coja.');
      }
      if (!texto) avisos.push('La característica «' + titulo + '» no tiene texto.');

      out.push('<div class="features__card">');
      if (icono) {
        // alt vacío a propósito: el icono es decorativo y el <h3> ya lo nombra.
        out.push(
          '<div class="features__icon"><img src="' + esc(icono) + '" alt=""' + medida + ' /></div>'
        );
      }
      out.push('<h3 class="features__title">' + linea(titulo) + '</h3>');
      if (texto) out.push('<p class="features__text">' + linea(texto) + '</p>');
      out.push('</div>');
    });

    out.push('</div>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
