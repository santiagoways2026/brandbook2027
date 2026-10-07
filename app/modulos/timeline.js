import { linea, leerCampos, campo, lista } from './_comun.js';

/** «2027 | Próximo Xacobeo» -> { anio: '2027', etiqueta: 'Próximo Xacobeo' } */
function leerAnio(bruto) {
  const trozos = String(bruto).split('|').map((t) => t.trim());
  return { anio: trozos[0] || '', etiqueta: trozos[1] || '' };
}

/** Primer número de «2021*» -> 2021. */
function numero(texto) {
  const m = String(texto).match(/(\d{1,4})/);
  return m ? parseInt(m[1], 10) : null;
}

export default {
  id: 'timeline',
  nombre: 'Línea de tiempo',
  clase: '.timeline',
  grupo: 'Datos',
  descripcion:
    'Serie de años con el salto entre cada uno. Horizontal en escritorio, vertical en móvil, y uno de los años destacado.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El contenido va DOS VECES en el HTML: .timeline__track para escritorio y .timeline__vertical para móvil. El CSS oculta una u otra a 600 px. Si falta una, el bloque desaparece en la mitad de las pantallas.',
    'El salto («5 años») es la diferencia con el año SIGUIENTE, así que el último punto no lleva salto.',
    'Los saltos se calculan solos a partir de los años: no se escriben.',
    'En la vista móvil el salto lleva una flecha ↓ delante que en escritorio no aparece.',
    'El año destacado es el que lleva etiqueta. En móvil su fila mete el año y la etiqueta dentro de un <div> extra que los demás no tienen.',
  ],
  entrada: {
    etiqueta: 'El título y un año por línea',
    ayuda:
      'Campos: titulo y anio (repetible). Para destacar un año, añádele su etiqueta detrás de una barra: «anio: 2027 | Próximo Xacobeo». Los saltos entre años se calculan solos.',
    filas: 11,
  },

  demo: [
    'titulo: Los Años Santos siguen el patrón',
    'anio: 1999',
    'anio: 2004',
    'anio: 2010',
    'anio: 2021*',
    'anio: 2027 | Próximo Xacobeo',
    'anio: 2032',
    'anio: 2038',
    'anio: 2049',
  ].join('\n'),

  ejemplo: [
    'titulo: Los Años Santos de esta generación',
    'anio: 2010',
    'anio: 2021*',
    'anio: 2027 | Próximo Xacobeo',
    'anio: 2032',
    'anio: 2038',
  ].join('\n'),

  render(bruto) {
    const { campos, avisos } = leerCampos(bruto, ['titulo', 'anio'], ['titulo']);

    const titulo = campo(campos, 'titulo');
    const puntos = lista(campos, 'anio').map(leerAnio);

    if (!puntos.length) {
      throw new Error('No hay ningún año. Escribe una línea «anio: …» por cada uno.');
    }

    const destacados = puntos.filter((p) => p.etiqueta);
    if (destacados.length > 1) {
      avisos.push(
        'Hay ' + destacados.length + ' años con etiqueta. El CSS solo contempla uno destacado: ' +
          'los demás saldrán igual de grandes y se pierde la jerarquía.'
      );
    }

    // El salto es la diferencia con el año siguiente; el último no lleva.
    const saltos = puntos.map((p, i) => {
      if (i === puntos.length - 1) return '';
      const a = numero(p.anio);
      const b = numero(puntos[i + 1].anio);
      if (a === null || b === null) {
        avisos.push('No encuentro el año en «' + p.anio + '» o «' + puntos[i + 1].anio + '», así que ese salto se queda vacío.');
        return '';
      }
      const d = b - a;
      if (d <= 0) {
        avisos.push('«' + puntos[i + 1].anio + '» no es posterior a «' + p.anio + '». Revisa el orden.');
        return '';
      }
      return d + (d === 1 ? ' año' : ' años');
    });

    const out = [];
    out.push('<div class="timeline">');
    if (titulo) out.push('<h3 class="timeline__title">' + linea(titulo) + '</h3>');

    // ---- escritorio ----
    out.push('<div class="timeline__track">');
    puntos.forEach((p, i) => {
      const actual = !!p.etiqueta;
      out.push('<div class="timeline__point">');
      out.push('<div class="timeline__line"></div>');
      if (saltos[i]) out.push('<div class="timeline__gap">' + saltos[i] + '</div>');
      out.push('<div class="timeline__marker">');
      out.push('<div class="timeline__dot' + (actual ? ' timeline__dot--current' : '') + '"></div>');
      out.push('</div>');
      out.push(
        '<div class="timeline__year' + (actual ? ' timeline__year--current' : '') + '">' +
          linea(p.anio) + '</div>'
      );
      if (actual) out.push('<div class="timeline__label">' + linea(p.etiqueta) + '</div>');
      out.push('</div>');
    });
    out.push('</div>');

    // ---- móvil ----
    out.push('<div class="timeline__vertical">');
    puntos.forEach((p, i) => {
      const actual = !!p.etiqueta;
      out.push('<div class="timeline__row' + (actual ? ' timeline__row--current' : '') + '">');
      out.push('<div class="timeline__row-dot"></div>');
      if (actual) {
        out.push('<div>');
        out.push('<div class="timeline__row-year--current">' + linea(p.anio) + '</div>');
        out.push('<div class="timeline__row-label">' + linea(p.etiqueta) + '</div>');
        out.push('</div>');
      } else {
        out.push('<span class="timeline__row-year">' + linea(p.anio) + '</span>');
      }
      if (saltos[i]) out.push('<span class="timeline__row-gap">↓ ' + saltos[i] + '</span>');
      out.push('</div>');
    });
    out.push('</div>');

    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
