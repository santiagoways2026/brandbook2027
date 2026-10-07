import { linea, normalizar, leerFichas, campo } from './_comun.js';

const TONOS = {
  fuerte: 'safety__tag',
  suave: 'safety__tag safety__tag--soft',
  oscuro: 'safety__tag safety__tag--dark',
};

export default {
  id: 'safety',
  nombre: 'Seguridad',
  clase: '.safety',
  grupo: 'Datos',
  descripcion:
    'Bloques separados por filetes, cada uno con su etiqueta de color y una serie de avisos en columnas. Admite una caja de teléfono de emergencia.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'Los tres tonos de etiqueta marcan el momento: fuerte (verde) antes de salir, suave (gris verdoso) durante, oscuro (verde noche) si algo va mal.',
    'ancho: si pone safety__item--wide, que ensancha los avisos de 190 a 260 px. Se usa cuando el bloque lleva además la caja de emergencias.',
    'La caja de emergencias es el último hijo de .safety__items y comparte fila con los avisos.',
    'Los títulos son <strong>, no encabezados.',
  ],
  entrada: {
    etiqueta: 'Un bloque por momento, con sus avisos',
    ayuda:
      'Cada bloque empieza por «bloque:» (el texto de la etiqueta) y admite tono (fuerte, suave u oscuro), ancho (si/no), emergencia (el número), emergenciatexto y emergencianota. Dentro, cada aviso empieza por «aviso:» y lleva su «texto:».',
    filas: 16,
  },

  demo: [
    'bloque: Antes de salir',
    'tono: fuerte',
    'aviso: Comparte tu itinerario',
    'texto: Haz que alguien conozca tu ruta general y dónde esperas terminar la etapa.',
    'aviso: Revisa la etapa',
    'texto: Comprueba distancia, desnivel, meteorología, agua, comida y ubicación del siguiente alojamiento.',
    'aviso: Lleva lo esencial contigo',
    'texto: Teléfono con batería, documentación y medicación personal deben viajar contigo, no en el equipaje trasladado.',
    'bloque: Durante la etapa',
    'tono: suave',
    'aviso: Sigue la señalización',
    'texto: Presta atención a flechas, mojones y cruces, especialmente en entradas y salidas de poblaciones.',
    'aviso: Comprueba tu posición si dudas',
    'texto: Si dejas de ver señales durante un tiempo, verifica la ruta antes de continuar avanzando.',
    'aviso: Adapta el plan',
    'texto: Calor, lluvia, viento o poca visibilidad pueden justificar reducir la etapa o cambiar la hora de salida.',
    'bloque: Si algo no va bien',
    'tono: oscuro',
    'ancho: si',
    'emergencia: 112',
    'emergenciatexto: Emergencias',
    'emergencianota: España y Unión Europea.',
    'aviso: Detente y valora la situación',
    'texto: No continúes únicamente por cumplir el itinerario. Comprueba dónde estás y decide qué necesitas antes de seguir.',
    'aviso: Pide ayuda cuando sea necesario',
    'texto: Contacta con tu alojamiento o servicio de asistencia si el problema es logístico y busca atención profesional cuando exista una lesión o problema de salud.',
  ].join('\n'),

  ejemplo: [
    'bloque: Antes de salir',
    'tono: fuerte',
    'aviso: Comparte tu itinerario',
    'texto: Haz que alguien conozca tu ruta y dónde esperas terminar la etapa.',
    'aviso: Revisa la etapa',
    'texto: Distancia, desnivel, meteorología, agua y comida.',
    'bloque: Si algo no va bien',
    'tono: oscuro',
    'ancho: si',
    'emergencia: 112',
    'emergenciatexto: Emergencias',
    'emergencianota: España y Unión Europea.',
    'aviso: Detente y valora la situación',
    'texto: No continúes únicamente por cumplir el itinerario.',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveGrupo: 'bloque',
      grupo: ['tono', 'ancho', 'emergencia', 'emergenciatexto', 'emergencianota'],
      claveFicha: 'aviso',
      ficha: ['texto'],
      multilinea: ['texto', 'emergencianota'],
    });

    const bloques = grupos.filter((g) => g.campos.size || g.fichas.length);
    if (!bloques.length) {
      throw new Error('No hay ningún bloque. Cada uno empieza por una línea «bloque: …».');
    }

    const out = [];
    out.push('<div class="safety">');

    bloques.forEach((b) => {
      const etiqueta = campo(b.campos, 'bloque');
      const tono = normalizar(campo(b.campos, 'tono')) || 'fuerte';
      const ancho = normalizar(campo(b.campos, 'ancho'));
      const emergencia = campo(b.campos, 'emergencia');
      const emergenciaTexto = campo(b.campos, 'emergenciatexto') || 'Emergencias';
      const emergenciaNota = campo(b.campos, 'emergencianota');

      if (!TONOS[tono]) {
        avisos.push('«tono: ' + tono + '» no vale: usa fuerte, suave u oscuro. Se usa fuerte.');
      }
      if (!b.fichas.length) avisos.push('El bloque «' + etiqueta + '» no tiene ningún aviso.');

      const claseItem = ancho === 'si' ? 'safety__item safety__item--wide' : 'safety__item';

      out.push('<div class="safety__block">');
      out.push(
        '<div class="safety__tag-wrap"><span class="' + (TONOS[tono] || TONOS.fuerte) + '">' +
          linea(etiqueta) + '</span></div>'
      );
      out.push('<div class="safety__items">');

      b.fichas.forEach((f) => {
        const titulo = campo(f, 'aviso');
        const texto = campo(f, 'texto');
        if (!texto) avisos.push('El aviso «' + titulo + '» no tiene texto.');
        out.push('<div class="' + claseItem + '">');
        out.push('<strong class="safety__item-title">' + linea(titulo) + '</strong>');
        if (texto) out.push('<p class="safety__text">' + linea(texto) + '</p>');
        out.push('</div>');
      });

      if (emergencia) {
        out.push('<div class="safety__emergency">');
        out.push('<div class="safety__emergency-label">' + linea(emergenciaTexto) + '</div>');
        out.push('<div class="safety__emergency-number">' + linea(emergencia) + '</div>');
        if (emergenciaNota) out.push('<p class="safety__text">' + linea(emergenciaNota) + '</p>');
        out.push('</div>');
      }

      out.push('</div>');
      out.push('</div>');
    });

    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
