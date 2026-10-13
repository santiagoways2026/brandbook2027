import { esc, linea, leerFichas, campo, avisarAlt } from './_comun.js';

export default {
  id: 'gr-ficha',
  nombre: 'Ficha de datos',
  clase: '.gr-ficha',
  grupo: 'Rutas',
  descripcion:
    'Foto grande a un lado y, al otro, una lista de pares etiqueta/valor separados por filetes. Para resumir los datos de un punto de inicio o una ruta.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El <img> NO lleva clase: el CSS lo selecciona con .gr-ficha__media img y lo coloca en absoluto dentro del contenedor.',
    'La foto ocupa más que el texto (flex 1.35 contra 0.65) y tiene 300 px de alto mínimo. Mejor horizontal.',
    'Cada dato lleva etiqueta, valor y una nota opcional en letra más pequeña.',
    '.gr-ficha__title es un <div>, no un encabezado.',
    'Por debajo de 700 px la foto pasa arriba y el texto debajo.',
  ],
  entrada: {
    etiqueta: 'Cabecera y un dato por ficha',
    ayuda:
      'Cabecera: imagen, alt, antetitulo, titulo. Cada dato empieza por «dato:» (la etiqueta) y lleva «valor:» y, si hace falta, «nota:».',
    filas: 13,
  },

  demo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2018/02/TUI.jpg',
    'alt: Vista de Tui, en Pontevedra, punto de inicio del Camino Portugués',
    'antetitulo: Antes de viajar',
    'titulo: Tui de un vistazo',
    'dato: Ubicación',
    'valor: Pontevedra · Sur de Galicia',
    'nota: Junto a la frontera con Portugal',
    'dato: Principal conexión',
    'valor: Vigo',
    'nota: Un punto práctico de acceso por tren, avión y autobús',
    'dato: Ruta',
    'valor: Camino Portugués',
    'nota: Uno de sus puntos de inicio habituales en Galicia',
  ].join('\n'),

  ejemplo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2026/05/post-guia-sarria.webp',
    'alt: Calle del casco antiguo de Sarria',
    'antetitulo: Antes de viajar',
    'titulo: Sarria de un vistazo',
    'dato: Ubicación',
    'valor: Lugo · Interior de Galicia',
    'nota: A 115 km de Santiago',
    'dato: Principal conexión',
    'valor: Lugo',
    'nota: Tren directo desde Madrid y autobús desde A Coruña',
  ].join('\n'),

  render(bruto) {
    const { cabecera, grupos, avisos } = leerFichas(bruto, {
      cabecera: ['imagen', 'alt', 'antetitulo', 'titulo'],
      claveFicha: 'dato',
      ficha: ['valor', 'nota'],
      multilinea: ['nota', 'titulo', 'alt'],
    });

    const imagen = campo(cabecera, 'imagen');
    const alt = campo(cabecera, 'alt');
    const antetitulo = campo(cabecera, 'antetitulo');
    const titulo = campo(cabecera, 'titulo');
    const datos = grupos[0] ? grupos[0].fichas : [];

    if (!titulo) throw new Error('Falta el título. Escribe una línea «titulo: …».');
    if (!datos.length) {
      throw new Error('No hay ningún dato. Cada uno empieza por una línea «dato: …».');
    }
    if (imagen) avisarAlt(avisos, alt, 'este bloque');
    else avisos.push('Sin imagen, el bloque queda descompensado: la foto ocupa casi dos tercios.');

    const out = [];
    out.push('<div class="gr-ficha">');
    out.push('<div class="gr-ficha__row">');
    if (imagen) {
      out.push(
        '<div class="gr-ficha__media"><img src="' + esc(imagen) +
          '" alt="' + esc(alt) + '" /></div>'
      );
    }
    out.push('<div class="gr-ficha__info">');
    if (antetitulo) out.push('<span class="gr-ficha__eyebrow">' + linea(antetitulo) + '</span>');
    out.push('<div class="gr-ficha__title">' + linea(titulo) + '</div>');

    datos.forEach((f) => {
      const etiqueta = campo(f, 'dato');
      const valor = campo(f, 'valor');
      const nota = campo(f, 'nota');
      if (!valor) avisos.push('El dato «' + etiqueta + '» no tiene valor. Falta «valor:».');

      out.push('<div class="gr-ficha__item">');
      out.push('<div class="gr-ficha__label">' + linea(etiqueta) + '</div>');
      out.push('<div class="gr-ficha__value">' + linea(valor) + '</div>');
      if (nota) out.push('<div class="gr-ficha__note">' + linea(nota) + '</div>');
      out.push('</div>');
    });

    out.push('</div>');
    out.push('</div>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
