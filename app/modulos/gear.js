import { esc, linea, leerFichas, campo, lista, enlace, avisarAlt } from './_comun.js';

export default {
  id: 'gear',
  nombre: 'Equipamiento',
  clase: '.gear',
  grupo: 'Rejillas',
  descripcion:
    'Rejilla de fichas con foto, antetítulo, título, texto y una lista de enlaces separados por filetes.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'Cada ficha es un <div> SIN clase que envuelve .gear__media y .gear__body. Es ese div el que ocupa la celda de la rejilla.',
    'La flecha → de cada enlace la pone el CSS con ::after. No escribirla aquí.',
    '.gear__title es un <div>, no un encabezado.',
    'Suele ir justo debajo de .prep: comparten tema y se leen como un solo apartado.',
  ],
  entrada: {
    etiqueta: 'Una ficha por tarjeta',
    ayuda:
      'Cada tarjeta empieza por «imagen:» y admite alt, antetitulo, titulo, texto y enlace (repetible, «Texto -> url»).',
    filas: 12,
  },

  demo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2026/04/post-checklist3.webp',
    'alt: Equipamiento para hacer el Camino de Santiago',
    'antetitulo: Equipaje',
    'titulo: Lleva lo necesario',
    'texto: En el Camino, cada objeto ocupa espacio y puede añadir peso. Prioriza lo que realmente utilizarás durante las etapas.',
    'enlace: Qué llevar al Camino -> /?p=17560',
    'enlace: Imprescindibles del Camino -> /?p=75237',
    'imagen: https://santiagoways.com/wp-content/uploads/2026/03/post-calzado-botas.webp',
    'alt: Calzado y ropa para hacer el Camino de Santiago',
    'antetitulo: Calzado y ropa',
    'titulo: Prueba antes lo que vas a llevar',
    'texto: Prueba antes de viajar el calzado y las prendas que utilizarás durante las etapas y adapta la elección a la época del año.',
    'enlace: Cómo elegir el calzado -> /?p=70798',
    'enlace: Qué ropa llevar -> /?p=12554',
  ].join('\n'),

  ejemplo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2026/04/post-checklist3.webp',
    'alt: Mochila preparada para el Camino',
    'antetitulo: Mochila',
    'titulo: Ocho kilos como tope',
    'texto: Con traslado de equipaje solo cargas la mochila de día: agua, chubasquero y poco más.',
    'enlace: Qué llevar al Camino -> /?p=17560',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'imagen',
      ficha: ['alt', 'antetitulo', 'titulo', 'texto', 'enlace'],
      multilinea: ['texto', 'titulo', 'alt'],
    });

    const fichas = grupos[0] ? grupos[0].fichas : [];
    if (!fichas.length) {
      throw new Error('No hay ninguna ficha. Cada una empieza por una línea «imagen: …».');
    }

    const out = [];
    out.push('<div class="gear">');

    fichas.forEach((f) => {
      const imagen = campo(f, 'imagen');
      const alt = campo(f, 'alt');
      const antetitulo = campo(f, 'antetitulo');
      const titulo = campo(f, 'titulo');
      const texto = campo(f, 'texto');
      const enlaces = lista(f, 'enlace');

      if (!titulo) avisos.push('Una de las fichas no tiene título.');
      avisarAlt(avisos, alt, '«' + (titulo || imagen) + '»');

      out.push('<div>');
      out.push(
        '<div class="gear__media"><img class="gear__img" src="' + esc(imagen) +
          '" alt="' + esc(alt) + '" /></div>'
      );
      out.push('<div class="gear__body">');
      if (antetitulo) out.push('<span class="gear__eyebrow">' + linea(antetitulo) + '</span>');
      if (titulo) out.push('<div class="gear__title">' + linea(titulo) + '</div>');
      if (texto) out.push('<p class="gear__text">' + linea(texto) + '</p>');
      if (enlaces.length) {
        const marcados = enlaces.map((e) => {
          const par = enlace(e);
          if (!par.url) avisos.push('El enlace «' + par.texto + '» no tiene url.');
          return '<a class="gear__link" href="' + esc(par.url) + '">' + linea(par.texto) + '</a>';
        });
        out.push('<div class="gear__links">' + marcados.join('') + '</div>');
      }
      out.push('</div>');
      out.push('</div>');
    });

    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
