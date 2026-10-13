import { linea, leerCampos, campo, lista } from './_comun.js';

export default {
  id: 'note',
  nombre: 'Nota al margen',
  clase: '.note',
  grupo: 'Texto',
  descripcion:
    'Aviso discreto con filete verde a la izquierda. Para matices, advertencias y «ten en cuenta que…».',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El <strong> del título no lleva clase: el CSS solo estiliza el contenedor.',
    'El texto va en un <div>, no en un <p>: el CSS ajusta los márgenes del primer y el último hijo.',
    'Admite contenido libre dentro. Es el bloque más flexible del sistema.',
    'No lleva margen vertical propio: hereda el del flujo del artículo.',
  ],
  entrada: {
    etiqueta: 'Un campo por línea',
    ayuda: 'Campos: titulo (opcional) y texto (repetible, un párrafo por línea).',
    filas: 6,
  },

  demo: [
    'titulo: Antes de viajar',
    'texto: Los requisitos para obtener la Compostela y los procedimientos de atención pueden cambiar. Consulta siempre la información oficial actualizada antes de comenzar el Camino.',
  ].join('\n'),

  ejemplo: [
    'titulo: Ojo con las fechas',
    'texto: En Año Santo los hoteles del Camino se llenan antes de lo habitual. Si viajas en julio o agosto, reserva con varios meses de margen.',
  ].join('\n'),

  render(bruto) {
    const { campos, avisos } = leerCampos(bruto, ['titulo', 'texto'], ['texto', 'titulo']);

    const titulo = campo(campos, 'titulo');
    const textos = lista(campos, 'texto');

    if (!titulo && !textos.length) {
      throw new Error('La nota está vacía. Escribe al menos una línea «texto: …».');
    }
    if (!textos.length) avisos.push('La nota solo tiene título: queda un aviso sin contenido.');

    const out = [];
    out.push('<div class="note">');
    if (titulo) out.push('<strong>' + linea(titulo) + '</strong>');
    textos.forEach((t) => out.push('<div>' + linea(t) + '</div>'));
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
