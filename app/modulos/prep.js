import { esc, linea, leerFichas, campo, dosDigitos, avisarAlt } from './_comun.js';

export default {
  id: 'prep',
  nombre: 'Preparación física',
  clase: '.prep',
  grupo: 'Rejillas',
  descripcion:
    'Foto a un lado y, al otro, un antetítulo, un título y una lista numerada de puntos separados por filetes.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'Dentro de cada .prep__item el segundo hijo es un <div> SIN clase que envuelve el título y el texto. Sin él, el flex coloca mal las tres piezas.',
    'Los números (01, 02…) se generan solos según el orden: no se escriben.',
    '.prep__title es un <div>, no un encabezado: no entra en el índice de la página.',
    'La foto tiene min-height de 300 px y se recorta con object-fit: cover. Mejor horizontal.',
  ],
  entrada: {
    etiqueta: 'Cabecera y un punto por ficha',
    ayuda:
      'Cabecera: imagen, alt, antetitulo, titulo. Cada punto empieza por «punto:» y lleva su «texto:».',
    filas: 12,
  },

  demo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2026/02/feature-preparacion-fisica.webp',
    'alt: Peregrinos preparándose para caminar el Camino de Santiago',
    'antetitulo: Preparación física',
    'titulo: Entrena para varios días, no para una sola etapa',
    'punto: Progresa poco a poco',
    'texto: Aumenta gradualmente la distancia y la duración de tus caminatas.',
    'punto: Reproduce el terreno',
    'texto: Introduce subidas y bajadas si encontrarás desnivel en tu Camino.',
    'punto: Camina días consecutivos',
    'texto: El esfuerzo acumulado forma parte del Camino. Conviene descubrir antes cómo responde tu cuerpo.',
  ].join('\n'),

  ejemplo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2026/02/feature-preparacion-fisica.webp',
    'alt: Peregrina entrenando por un camino de tierra',
    'antetitulo: Antes de salir',
    'titulo: Tres semanas bastan para llegar cómodo',
    'punto: Sal a caminar tres días por semana',
    'texto: Empieza por una hora y sube hasta tres de forma progresiva.',
    'punto: Estrena las botas en casa',
    'texto: Que lleguen al Camino con al menos 50 km hechos.',
  ].join('\n'),

  render(bruto) {
    const { cabecera, grupos, avisos } = leerFichas(bruto, {
      cabecera: ['imagen', 'alt', 'antetitulo', 'titulo'],
      claveFicha: 'punto',
      ficha: ['texto'],
      multilinea: ['texto', 'titulo', 'alt'],
    });

    const imagen = campo(cabecera, 'imagen');
    const alt = campo(cabecera, 'alt');
    const antetitulo = campo(cabecera, 'antetitulo');
    const titulo = campo(cabecera, 'titulo');
    const puntos = grupos[0] ? grupos[0].fichas : [];

    if (!titulo) throw new Error('Falta el título. Escribe una línea «titulo: …».');
    if (!puntos.length) {
      throw new Error('No hay ningún punto. Cada uno empieza por una línea «punto: …».');
    }
    if (imagen) avisarAlt(avisos, alt, 'este bloque');
    else avisos.push('Sin imagen, el bloque queda a media anchura y descompensado. Añade «imagen: …».');

    const out = [];
    out.push('<div class="prep">');
    if (imagen) {
      out.push(
        '<div class="prep__media"><img class="prep__img" src="' + esc(imagen) +
          '" alt="' + esc(alt) + '" /></div>'
      );
    }
    out.push('<div class="prep__content">');
    out.push('<div class="prep__header">');
    if (antetitulo) out.push('<span class="prep__eyebrow">' + linea(antetitulo) + '</span>');
    out.push('<div class="prep__title">' + linea(titulo) + '</div>');
    out.push('</div>');

    puntos.forEach((f, i) => {
      const nombre = campo(f, 'punto');
      const texto = campo(f, 'texto');
      if (!texto) avisos.push('El punto «' + nombre + '» no tiene texto.');
      out.push('<div class="prep__item">');
      out.push('<div class="prep__number">' + dosDigitos(i + 1) + '</div>');
      out.push('<div>');
      out.push('<strong class="prep__item-title">' + linea(nombre) + '</strong>');
      if (texto) out.push('<p class="prep__text">' + linea(texto) + '</p>');
      out.push('</div>');
      out.push('</div>');
    });

    out.push('</div>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
