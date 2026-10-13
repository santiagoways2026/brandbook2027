import { linea, sinNegrita, leerFichas, campo } from './_comun.js';

export default {
  id: 'cards',
  nombre: 'Tarjetas con icono',
  clase: '.cards',
  grupo: 'Rejillas',
  descripcion:
    'Rejilla de tarjetas blancas dentro de una caja verde claro. Cada tarjeta lleva un icono en un cuadrado, un título y un texto.',
  estado: { texto: 'HTML y CSS originales · usa una clase por otra', tono: 'aviso' },
  reglas: [
    'El título de cada tarjeta usa .cards__title, que en el CSS es la clase del título del BLOQUE. La pensada para la tarjeta, .cards__title-card, no se usa en ninguna parte: es CSS muerto.',
    'Por eso los títulos salen al tamaño del cuerpo en vez de a 18 px. Se reproduce lo publicado para no cambiar el aspecto de las páginas vivas.',
    'El título va en un <p> y dentro lleva un <strong>: no es un encabezado.',
    'El icono es un emoji escrito en el HTML, dentro de un cuadrado de 42 px que pinta el CSS.',
    'Las tarjetas se reparten en columnas de 240 px mínimo.',
  ],
  entrada: {
    etiqueta: 'Una ficha por tarjeta',
    ayuda:
      'Cada tarjeta empieza por «icono:» (un emoji) y lleva «titulo:» y «texto:». Usa **texto** para negrita dentro del texto.',
    filas: 12,
  },

  demo: [
    'icono: 🏨',
    'titulo: El alojamiento puede agotarse antes de lo previsto',
    'texto: Durante las fechas de mayor demanda, las plazas en las últimas etapas y en Santiago pueden agotarse con mucha antelación. No confíes en encontrar alojamiento sobre la marcha si viajas en Semana Santa, julio, agosto o principios de septiembre.',
    'icono: 🔔',
    'titulo: Funcionamiento del Botafumeiro',
    'texto: El **Botafumeiro no funciona en todas las misas**. Se utiliza en determinadas celebraciones litúrgicas o cuando ha sido solicitado previamente, por lo que ningún viaje debería presentarlo como una experiencia asegurada.',
    'icono: ⛪',
    'titulo: No existe una visita papal confirmada',
    'texto: A día de hoy, **no existe una visita papal confirmada para 2027**. Desconfía de cualquier información que la presente como segura mientras no haya un anuncio oficial.',
    'icono: ✓',
    'titulo: Uso de la palabra «oficial»',
    'texto: El uso de la marca **Xacobeo 2027** está regulado, pero disponer de autorización para utilizarla no convierte automáticamente a una empresa en organizador oficial, patrocinador o entidad financiada por el Año Santo.',
    'icono: 📅',
    'titulo: Horarios y programación',
    'texto: No utilices como referencia definitiva los horarios de años anteriores. La **programación religiosa y cultural de 2027** se irá publicando progresivamente, por lo que conviene consultar siempre las fuentes actualizadas.',
  ].join('\n'),

  ejemplo: [
    'icono: 🏨',
    'titulo: Hotel con habitación privada cada noche',
    'texto: Nada de literas: **duermes y descansas** para la etapa siguiente.',
    'icono: 🎒',
    'titulo: Tu maleta te espera al llegar',
    'texto: La trasladamos de hotel a hotel. Tú caminas con lo del día.',
    'icono: 📞',
    'titulo: Asistencia 24 horas',
    'texto: Un teléfono al que llamar si surge cualquier cosa.',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'icono',
      ficha: ['titulo', 'texto'],
      multilinea: ['texto', 'titulo'],
    });

    const tarjetas = grupos[0] ? grupos[0].fichas : [];
    if (!tarjetas.length) {
      throw new Error('No hay ninguna tarjeta. Cada una empieza por una línea «icono: …».');
    }

    const out = [];
    out.push('<div class="cards">');
    out.push('<div class="cards__grid">');

    tarjetas.forEach((f) => {
      const icono = campo(f, 'icono');
      const titulo = campo(f, 'titulo');
      const texto = campo(f, 'texto');

      if (!titulo) avisos.push('Una de las tarjetas no tiene título.');
      if (icono.length > 4) {
        avisos.push(
          'El icono «' + icono + '» ocupa más de un emoji. El cuadrado es de 42 px ' +
            'y el texto se sale.'
        );
      }

      out.push('<div class="cards__card">');
      out.push('<div class="cards__icon">' + linea(icono) + '</div>');
      // Se usa cards__title, no cards__title-card, para reproducir lo publicado.
      out.push('<p class="cards__title"><strong>' + linea(sinNegrita(titulo)) + '</strong></p>');
      if (texto) out.push('<p class="cards__text">' + linea(texto) + '</p>');
      out.push('</div>');
    });

    out.push('</div>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
