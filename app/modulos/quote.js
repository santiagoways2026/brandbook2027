import { linea, leerCampos, campo } from './_comun.js';

export default {
  id: 'quote',
  nombre: 'Cita destacada',
  clase: '.quote',
  grupo: 'Texto',
  descripcion:
    'Cita centrada en cursiva sobre un degradado verde muy claro, con filete a la izquierda y autor opcional.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'Las comillas angulares «» van escritas en el texto: el CSS no las pone.',
    'El autor es opcional. Cuando se usa, sale en mayúsculas y en verde por CSS: escríbelo en minúscula de frase.',
    'El texto es un <div>, no un <blockquote>.',
    '.quote__text lleva font-size con !important: no se puede ajustar desde fuera.',
  ],
  entrada: {
    etiqueta: 'Un campo por línea',
    ayuda: 'Campos: texto (obligatorio) y autor (opcional). Escribe tú las comillas «».',
    filas: 6,
  },

  demo: [
    'texto: «Guarda energía para mañana. El Camino no se decide en una etapa, sino en la suma de muchos días caminando.»',
  ].join('\n'),

  ejemplo: [
    'texto: «Llegué a Santiago sin una sola ampolla. El secreto fue no intentar ganarle a nadie.»',
    'autor: Marta, Camino Francés desde Sarria',
  ].join('\n'),

  render(bruto) {
    const { campos, avisos } = leerCampos(bruto, ['texto', 'autor'], ['texto']);

    const texto = campo(campos, 'texto');
    const autor = campo(campos, 'autor');

    if (!texto) throw new Error('Falta la cita. Escribe una línea «texto: …».');
    if (!/^[«"“]/.test(texto.trim())) {
      avisos.push('La cita no empieza por comillas. En la web todas llevan « » escritas en el texto.');
    }
    if (texto.length > 220) {
      avisos.push(
        'La cita tiene ' + texto.length + ' caracteres. A 1,5 rem y centrada, por encima de 200 ' +
          'deja de leerse como cita y pasa a parecer un párrafo.'
      );
    }

    const out = [];
    out.push('<div class="quote">');
    out.push('<div class="quote__text">' + linea(texto) + '</div>');
    if (autor) out.push('<p class="quote__author">' + linea(autor) + '</p>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
