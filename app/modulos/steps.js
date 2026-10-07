import { linea, leerFichas, campo } from './_comun.js';

export default {
  id: 'steps',
  nombre: 'Pasos numerados',
  clase: '.steps',
  grupo: 'Listas',
  descripcion:
    'Pasos en vertical unidos por una línea verde continua, cada uno con su círculo numerado. El último se marca en verde oscuro.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El HTML publicado venía envuelto en un <div style="position: relative; margin: 32px 0;"> que duplica lo que .steps ya hace y que además nunca se cierra. Aquí va sin él.',
    'steps__number--final (verde oscuro) NO es automático: de los dos bloques publicados, uno lo lleva en su último paso y el otro no. Se marca a mano con «final: si».',
    'Los números se escriben 1, 2, 3… sin cero delante, al revés que en tips y prep.',
    'La línea vertical va de 20 px desde arriba a 20 px desde abajo, así que con un solo paso no se ve.',
  ],
  entrada: {
    etiqueta: 'Una ficha por paso',
    ayuda:
      'Cada paso empieza por «titulo:» y lleva su «texto:». Añade «final: si» al paso que cierra el recorrido para pintarlo en verde oscuro. Usa **texto** para negrita.',
    filas: 10,
  },

  demo: [
    'titulo: Consigue la Credencial antes de comenzar',
    'texto: Resuelve dónde obtener la **Credencial del Peregrino** antes de la primera etapa para poder registrar correctamente el recorrido desde el inicio.',
    'titulo: Sella la Credencial durante el Camino',
    'texto: Los sellos permiten acreditar tu paso por las diferentes etapas. Incorpora el sellado a la rutina diaria y conserva la Credencial durante todo el recorrido.',
    'titulo: Comprueba los requisitos para obtener la Compostela',
    'texto: Si conseguir la **Compostela** es importante para ti, revisa los requisitos oficiales antes de elegir el punto de inicio. La distancia, la modalidad de peregrinación y la forma de acreditar el recorrido pueden influir en su obtención.',
    'titulo: Solicita la Compostela al llegar a Santiago',
    'texto: Una vez terminada la peregrinación, podrás solicitarla en Santiago si cumples las condiciones establecidas y puedes acreditar correctamente el recorrido realizado.',
    'final: si',
  ].join('\n'),

  ejemplo: [
    'titulo: Elige la ruta y las fechas',
    'texto: Te ayudamos a ajustar etapas y días según tu forma física.',
    'titulo: Reserva con el precio garantizado',
    'texto: En Año Santo los hoteles del Camino se llenan antes de lo habitual.',
    'titulo: Recibe tu documentación',
    'texto: Itinerario, credencial y acceso a la app con navegación sin cobertura.',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'titulo',
      ficha: ['texto', 'final'],
      multilinea: ['texto', 'titulo'],
    });

    const pasos = grupos[0] ? grupos[0].fichas : [];
    if (!pasos.length) {
      throw new Error('No hay ningún paso. Cada uno empieza por una línea «titulo: …».');
    }
    if (pasos.length === 1) {
      avisos.push('Con un solo paso la línea vertical no llega a verse. El bloque pide tres o más.');
    }

    const out = [];
    out.push('<div class="steps">');

    pasos.forEach((f, i) => {
      const titulo = campo(f, 'titulo');
      const texto = campo(f, 'texto');
      // No es automático: de los dos bloques publicados, uno marca su último
      // paso y el otro no. Se pide a mano.
      const final = /^(si|sí|yes|true|1)$/i.test(campo(f, 'final').trim());
      if (!texto) avisos.push('El paso «' + titulo + '» no tiene texto.');

      out.push('<div class="steps__item">');
      out.push(
        '<div class="steps__number' + (final ? ' steps__number--final' : '') + '">' +
          (i + 1) + '</div>'
      );
      out.push('<h3 class="steps__title">' + linea(titulo) + '</h3>');
      if (texto) out.push('<p class="steps__text">' + linea(texto) + '</p>');
      out.push('</div>');
    });

    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
