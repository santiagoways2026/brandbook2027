import { linea, leerCampos, campo, lista } from './_comun.js';

export default {
  id: 'roadmap',
  nombre: 'Recorrido de etapas',
  clase: '.roadmap',
  grupo: 'Rutas',
  descripcion:
    'Las paradas de una ruta sobre una línea, con la salida y la llegada destacadas. Horizontal en escritorio, vertical por debajo de 600 px.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'La primera y la última parada son distintas: marker--endpoint, dot--start o dot--end, antetítulo y name--endpoint. Las intermedias no llevan antetítulo.',
    'Es el único bloque que viene indentado; el resto llega plano. Se respeta su formato.',
    'Cada parada repite su propio .roadmap__line: la línea no es una sola, son tantos tramos como paradas.',
    'Con muchas paradas la rejilla las parte en varias filas y los tramos de línea no se conectan entre filas. El tope cómodo son 7 u 8.',
    'El antetítulo usa #668814 a 12 px: es uno de los textos que no llega al contraste AA.',
  ],
  entrada: {
    etiqueta: 'Las paradas, una por línea',
    ayuda:
      'Campos: parada (repetible) y, si quieres cambiarlos, inicio y meta, que son los antetítulos de la primera y la última. Por defecto, «Inicio» y «Meta».',
    filas: 10,
  },

  demo: [
    'inicio: Inicio',
    'meta: Meta',
    'parada: Vilalba',
    'parada: Baamonde',
    'parada: Miraz',
    'parada: Sobrado dos Monxes',
    'parada: Arzúa',
    'parada: O Pedrouzo',
    'parada: Santiago de Compostela',
  ].join('\n'),

  ejemplo: [
    'inicio: Salida',
    'meta: Llegada',
    'parada: Sarria',
    'parada: Portomarín',
    'parada: Palas de Rei',
    'parada: Arzúa',
    'parada: O Pedrouzo',
    'parada: Santiago de Compostela',
  ].join('\n'),

  render(bruto) {
    const { campos, avisos } = leerCampos(bruto, ['parada', 'inicio', 'meta'], []);

    const paradas = lista(campos, 'parada');
    const inicio = campo(campos, 'inicio') || 'Inicio';
    const meta = campo(campos, 'meta') || 'Meta';

    if (!paradas.length) {
      throw new Error('No hay ninguna parada. Escribe una línea «parada: …» por cada una.');
    }
    if (paradas.length < 2) {
      throw new Error('Hacen falta al menos dos paradas: una de salida y una de llegada.');
    }
    if (paradas.length > 8) {
      avisos.push(
        paradas.length + ' paradas: la rejilla las parte en varias filas y los tramos de ' +
          'línea no se conectan entre filas. El tope cómodo son 7 u 8.'
      );
    }
    const largas = paradas.filter((p) => p.length > 22);
    if (largas.length) {
      avisos.push(
        'Nombres largos («' + largas[0] + '»): con columnas de 96 px se parten en varias ' +
          'líneas y descuadran la altura de las paradas.'
      );
    }

    // Indentado a propósito: es como viene el bloque original.
    const out = [];
    out.push('<div class="roadmap">');
    out.push('  <div class="roadmap__track">');

    paradas.forEach((nombre, i) => {
      const esInicio = i === 0;
      const esMeta = i === paradas.length - 1;
      const extremo = esInicio || esMeta;

      out.push('    <div class="roadmap__stop">');
      out.push('      <div class="roadmap__line"></div>');
      out.push(
        '      <div class="roadmap__marker' + (extremo ? ' roadmap__marker--endpoint' : '') + '">'
      );
      out.push(
        '        <div class="roadmap__dot' +
          (esInicio ? ' roadmap__dot--start' : esMeta ? ' roadmap__dot--end' : '') + '"></div>'
      );
      out.push('      </div>');
      if (extremo) {
        out.push('      <div class="roadmap__eyebrow">' + linea(esInicio ? inicio : meta) + '</div>');
      }
      out.push(
        '      <div class="roadmap__name' + (extremo ? ' roadmap__name--endpoint' : '') + '">' +
          linea(nombre) + '</div>'
      );
      out.push('    </div>');
    });

    out.push('  </div>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
