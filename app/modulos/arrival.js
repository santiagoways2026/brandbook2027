import { esc, linea, leerFichas, campo, avisarAlt } from './_comun.js';

export default {
  id: 'arrival',
  nombre: 'Llegada',
  clase: '.arrival',
  grupo: 'Rejillas',
  descripcion:
    'Fichas con foto a media anchura, antetítulo, título y texto. Pensado para el cierre de un artículo: qué hacer al llegar.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El antetítulo y el título van en la misma línea del HTML: el CSS pone el antetítulo en display:block y se apilan solos.',
    'El título es un <strong>, no un encabezado.',
    'Las fichas ocupan el 50% cada una, así que el bloque pide un número par.',
    'Las fotos se recortan a una altura fija con object-fit: cover. Mejor horizontales.',
  ],
  entrada: {
    etiqueta: 'Una ficha por tarjeta',
    ayuda:
      'Cada tarjeta empieza por «antetitulo:» y admite titulo, texto, imagen y alt. Usa **texto** para negrita.',
    filas: 12,
  },

  demo: [
    'antetitulo: Obradoiro',
    'titulo: Disfruta de la llegada',
    'texto: Después de tantos kilómetros, no tengas prisa por pasar al siguiente plan. **La llegada también forma parte del Camino.**',
    'imagen: https://santiagoways.com/wp-content/uploads/2019/09/post-xacobeo-pareja.webp',
    'alt: Peregrinos llegando a la Praza do Obradoiro frente a la Catedral de Santiago',
    'antetitulo: Catedral',
    'titulo: Reserva tiempo para visitarla',
    'texto: La Catedral es el destino histórico de las rutas jacobeas y ayuda a entender por qué todos estos Caminos convergen en Santiago.',
    'imagen: https://santiagoways.com/wp-content/uploads/2026/05/post-guia-sarria.webp',
    'alt: Catedral de Santiago de Compostela',
    'antetitulo: Compostela',
    'titulo: Solicítala si quieres obtenerla',
    'texto: Si has realizado el recorrido cumpliendo los requisitos establecidos, ten preparada tu **Credencial del Peregrino** al llegar.',
    'imagen: https://santiagoways.com/wp-content/uploads/2017/06/feature-credencial.webp',
    'alt: Credencial del Peregrino y Compostela al finalizar el Camino de Santiago',
    'antetitulo: Santiago',
    'titulo: Quédate un poco más',
    'texto: Descansa, recorre el casco histórico y disfruta de la ciudad sin tener que pensar en la siguiente etapa.',
    'imagen: https://santiagoways.com/wp-content/uploads/2020/04/camino-santiago-unesco-en.jpg',
    'alt: Casco histórico de Santiago de Compostela después de terminar el Camino',
  ].join('\n'),

  ejemplo: [
    'antetitulo: Obradoiro',
    'titulo: Disfruta de la llegada',
    'texto: No tengas prisa por pasar al siguiente plan. **La llegada también forma parte del Camino.**',
    'imagen: https://santiagoways.com/wp-content/uploads/2019/09/post-xacobeo-pareja.webp',
    'alt: Peregrinos llegando a la Praza do Obradoiro',
    'antetitulo: Compostela',
    'titulo: Solicítala si quieres obtenerla',
    'texto: Ten preparada tu **Credencial del Peregrino** al llegar.',
    'imagen: https://santiagoways.com/wp-content/uploads/2017/06/feature-credencial.webp',
    'alt: Credencial del Peregrino y Compostela',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'antetitulo',
      ficha: ['titulo', 'texto', 'imagen', 'alt'],
      multilinea: ['texto', 'titulo', 'alt'],
    });

    const fichas = grupos[0] ? grupos[0].fichas : [];
    if (!fichas.length) {
      throw new Error('No hay ninguna tarjeta. Cada una empieza por una línea «antetitulo: …».');
    }
    if (fichas.length % 2 !== 0) {
      avisos.push(
        (fichas.length === 1 ? 'Una sola tarjeta' : fichas.length + ' tarjetas') +
          ': como van a media anchura, la última queda sola en su fila. Un número par cuadra mejor.'
      );
    }

    const out = [];
    out.push('<div class="arrival">');

    fichas.forEach((f) => {
      const antetitulo = campo(f, 'antetitulo');
      const titulo = campo(f, 'titulo');
      const texto = campo(f, 'texto');
      const imagen = campo(f, 'imagen');
      const alt = campo(f, 'alt');

      if (!titulo) avisos.push('La tarjeta «' + antetitulo + '» no tiene título.');
      if (!imagen) avisos.push('La tarjeta «' + antetitulo + '» no tiene imagen.');
      else avisarAlt(avisos, alt, '«' + antetitulo + '»');

      out.push('<div class="arrival__item">');
      if (imagen) {
        out.push(
          '<div class="arrival__media"><img class="arrival__img" src="' + esc(imagen) +
            '" alt="' + esc(alt) + '" /></div>'
        );
      }
      out.push('<div class="arrival__body">');
      out.push(
        '<span class="arrival__eyebrow">' + linea(antetitulo) + '</span>' +
          '<strong class="arrival__title">' + linea(titulo) + '</strong>'
      );
      if (texto) out.push('<p class="arrival__text">' + linea(texto) + '</p>');
      out.push('</div>');
      out.push('</div>');
    });

    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
