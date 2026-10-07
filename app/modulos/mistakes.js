import { linea, leerFichas, campo, dosDigitos } from './_comun.js';

export default {
  id: 'mistakes',
  nombre: 'Errores frecuentes',
  clase: '.mistakes',
  grupo: 'Listas',
  descripcion:
    'Cada fila enfrenta un error con su alternativa: a la izquierda qué se hace mal, a la derecha, en una caja verde, qué conviene hacer.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'La etiqueta «Mejor decisión» es fija: va igual en todas las filas y no se escribe.',
    'Los números (01, 02…) se generan solos según el orden.',
    '.mistakes__title es un <p>, no un encabezado, y va en peso 500: es la única pieza del sistema que no usa negrita para un título.',
    'La primera fila lleva un filete superior más grueso en verde noche, por CSS: no hay que marcarla.',
    'Las dos columnas se apilan por debajo de 280 px de ancho disponible.',
  ],
  entrada: {
    etiqueta: 'Una ficha por error',
    ayuda:
      'Cada error empieza por «error:» y lleva «texto:» (en qué consiste) y «mejor:» (la alternativa). Usa **texto** para negrita y [texto](url) para enlaces.',
    filas: 12,
  },

  demo: [
    'error: Planificar las etapas solo por kilómetros',
    'texto: Asumir que dos etapas de 20 kilómetros tendrán una dificultad parecida simplemente porque la distancia es la misma.',
    'mejor: Valora conjuntamente **distancia, desnivel, terreno y acumulación de jornadas** antes de cerrar cada etapa.',
    'error: Elegir el punto de inicio solo por los días disponibles',
    'texto: Escoger dónde empezar únicamente porque el recorrido cabe dentro de las fechas de tus vacaciones.',
    'mejor: Comprueba también **la dificultad, las conexiones, los servicios y, si quieres obtenerla, los requisitos de la Compostela**.',
    'error: Llevar más equipaje del necesario',
    'texto: Llenar la mochila de objetos «por si acaso» que probablemente no utilizarás durante el viaje.',
    'mejor: Lleva únicamente aquello que tenga una función clara. Nuestra [**guía sobre qué llevar al Camino**](/?p=17560) puede ayudarte a hacer la selección.',
    'error: Dar por hecho que siempre habrá servicios cerca',
    'texto: Empezar una etapa suponiendo que encontrarás agua, comida, una tienda o una cafetería justo cuando lo necesites.',
    'mejor: Revisa antes de salir **las localidades y puntos de servicio de la jornada** y lleva suficiente agua y comida para los tramos necesarios.',
    'error: Improvisar aquello que necesitas tener asegurado',
    'texto: Pensar que dejarlo todo abierto hará necesariamente que el Camino sea más auténtico o más flexible.',
    'mejor: Decide qué quieres improvisar y qué necesitas tener resuelto. Si el alojamiento es importante para ti, consulta nuestra [**guía de alojamiento en el Camino de Santiago**](/?p=64722).',
    'error: Olvidar la logística del primer y del último día',
    'texto: Contar únicamente los días de caminata sin reservar tiempo para llegar al punto de inicio y regresar desde Santiago.',
    'mejor: Incluye los desplazamientos dentro del itinerario antes de cerrar las etapas. Si empiezas en Sarria, revisa previamente [**cómo llegar a Sarria**](/?p=65546) y cuánto tiempo necesitas.',
  ].join('\n'),

  ejemplo: [
    'error: Planificar las etapas solo por kilómetros',
    'texto: Asumir que dos etapas de 20 km tendrán la misma dificultad solo porque miden lo mismo.',
    'mejor: Valora conjuntamente **distancia, desnivel, terreno y acumulación de jornadas**.',
    'error: Llevar más equipaje del necesario',
    'texto: Llenar la mochila de objetos «por si acaso».',
    'mejor: Lleva solo lo que tenga una función clara. Nuestra [**guía de equipaje**](/?p=17560) ayuda.',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'error',
      ficha: ['texto', 'mejor'],
      multilinea: ['texto', 'mejor', 'error'],
    });

    const errores = grupos[0] ? grupos[0].fichas : [];
    if (!errores.length) {
      throw new Error('No hay ningún error. Cada uno empieza por una línea «error: …».');
    }

    const out = [];
    out.push('<div class="mistakes">');

    errores.forEach((f, i) => {
      const titulo = campo(f, 'error');
      const texto = campo(f, 'texto');
      const mejor = campo(f, 'mejor');

      if (!texto) avisos.push('El error «' + titulo + '» no explica en qué consiste. Falta «texto:».');
      if (!mejor) {
        avisos.push(
          'El error «' + titulo + '» no tiene alternativa. Falta «mejor:»: sin ella la fila ' +
            'queda coja y la caja verde sale vacía.'
        );
      }

      out.push('<div class="mistakes__item">');
      out.push('<div class="mistakes__main">');
      out.push('<div class="mistakes__head">');
      out.push('<span class="mistakes__number">' + dosDigitos(i + 1) + '</span>');
      out.push('<p class="mistakes__title">' + linea(titulo) + '</p>');
      out.push('</div>');
      if (texto) out.push('<p class="mistakes__text">' + linea(texto) + '</p>');
      out.push('</div>');
      out.push('<div class="mistakes__better">');
      out.push('<div class="mistakes__better-label">Mejor decisión</div>');
      if (mejor) out.push('<p class="mistakes__text">' + linea(mejor) + '</p>');
      out.push('</div>');
      out.push('</div>');
    });

    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
