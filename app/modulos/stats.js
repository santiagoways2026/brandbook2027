import { linea, leerFichas, campo } from './_comun.js';

export default {
  id: 'stats',
  nombre: 'Cifras',
  clase: '.stats',
  grupo: 'Datos',
  descripcion:
    'Fila de tarjetas con una cifra grande y su etiqueta en mayúsculas, cada una con una barrita verde arriba. Para los datos de una etapa.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'La barrita verde superior es un <div> vacío: la pinta el CSS. Va siempre.',
    'El valor va antes que la etiqueta en el HTML, aunque se lean como un par.',
    'Las tarjetas se reparten el ancho a partes iguales con un mínimo de 120 px: con más de cuatro o cinco se vuelven estrechas.',
    'El valor no tiene límite de ancho: «+150 m aprox.» ya ocupa casi toda la tarjeta.',
  ],
  entrada: {
    etiqueta: 'Una ficha por cifra',
    ayuda: 'Cada cifra empieza por «cifra:» (el valor) y lleva su «etiqueta:».',
    filas: 8,
  },

  demo: [
    'cifra: 16 km',
    'etiqueta: Distancia',
    'cifra: Fácil',
    'etiqueta: Dificultad',
    'cifra: +150 m aprox.',
    'etiqueta: Desnivel',
  ].join('\n'),

  ejemplo: [
    'cifra: 115 km',
    'etiqueta: Distancia',
    'cifra: 5 etapas',
    'etiqueta: Duración',
    'cifra: Media',
    'etiqueta: Dificultad',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'cifra',
      ficha: ['etiqueta'],
    });

    const cifras = grupos[0] ? grupos[0].fichas : [];
    if (!cifras.length) {
      throw new Error('No hay ninguna cifra. Cada una empieza por una línea «cifra: …».');
    }
    if (cifras.length > 5) {
      avisos.push(
        cifras.length + ' tarjetas: con el mínimo de 120 px se quedan muy estrechas y las ' +
          'etiquetas en mayúsculas empiezan a partirse. Cuatro o cinco es el tope cómodo.'
      );
    }

    const out = [];
    out.push('<div class="stats">');

    cifras.forEach((f) => {
      const valor = campo(f, 'cifra');
      const etiqueta = campo(f, 'etiqueta');
      if (!etiqueta) avisos.push('La cifra «' + valor + '» no tiene etiqueta: no se sabe qué mide.');
      if (valor.length > 16) {
        avisos.push('«' + valor + '» es largo para una tarjeta de cifras: se parte en dos líneas.');
      }

      out.push('<div class="stats__card">');
      out.push('<div class="stats__bar"></div>');
      out.push('<div class="stats__body">');
      out.push('<div class="stats__value">' + linea(valor) + '</div>');
      out.push('<div class="stats__label">' + linea(etiqueta) + '</div>');
      out.push('</div>');
      out.push('</div>');
    });

    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
