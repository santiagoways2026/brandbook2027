import { esc, linea, leerFichas, campo } from './_comun.js';

/**
 * Parte «Nombre | 115 km | 72% -> /url».
 * No se usa enlace() porque los nombres llevan → dentro («Sarria → Santiago»)
 * y ese helper partiría por ahí.
 */
function leerRuta(bruto) {
  const m = String(bruto).match(/^(.*?)\s*->\s*(\S+)\s*$/);
  const izquierda = m ? m[1] : String(bruto);
  const url = m ? m[2] : '';
  const trozos = izquierda.split('|').map((t) => t.trim());
  const nombre = trozos[0] || '';
  const km = trozos[1] || '';
  const pct = trozos[2] || '';
  return { nombre, km, pct, url };
}

/** Primer número de un texto como «desde 315 km» -> 315. */
function kilometros(texto) {
  const m = String(texto).replace(/\./g, '').match(/(\d+(?:,\d+)?)/);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
}

export default {
  id: 'durations',
  nombre: 'Comparativa con barras',
  clase: '.durations',
  grupo: 'Rutas',
  descripcion:
    'Filas que agrupan rutas por duración. Cada ruta lleva una barra de progreso proporcional a sus kilómetros dentro de su propia fila.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'La barra se pinta con style="--pct: N%" en el propio elemento. Es el dato, no un estilo: es la única excepción permitida junto con el tema de la tabla.',
    'El porcentaje se calcula solo: la ruta más larga de cada fila es el 100% y las demás van en proporción. Se puede forzar escribiéndolo.',
    'El <span> de la barra lleva dentro un comentario HTML vacío. Sin él, algunos editores colapsan el span y la barra desaparece.',
    'El chevron › de cada ruta lo pone el CSS con ::after. No escribirlo aquí.',
    'Las proporciones son por fila, no globales: comparar entre filas distintas no tiene sentido.',
  ],
  entrada: {
    etiqueta: 'Una ficha por fila, con sus rutas',
    ayuda:
      'Cada fila empieza por «antetitulo:» y admite titular, pildora, intro y nota. Las rutas se escriben «ruta: Nombre | 115 km -> /url», y se puede añadir el porcentaje: «ruta: Nombre | 115 km | 72% -> /url».',
    filas: 14,
  },

  demo: [
    'antetitulo: Primera experiencia',
    'titular: ≈ 1 semana',
    'pildora: 100–160 km',
    'intro: Con unos siete días, el punto de inicio se vuelve decisivo. Estas son algunas de las opciones más habituales para llegar a Santiago.',
    'ruta: Sarria → Santiago | 115 km -> /?p=89222',
    'ruta: Tui → Santiago | 119 km -> /?p=89737',
    'ruta: Ferrol → Santiago | 122 km -> /?page_id=71742',
    'ruta: Baiona → Santiago | 160 km -> /?p=93262',
    'antetitulo: Más recorrido',
    'titular: 8–15 días',
    'pildora: 160–320 km',
    'intro: Con más de una semana puedes comenzar bastante más lejos y vivir una sucesión de etapas más amplia.',
    'ruta: Oporto → Santiago | 260 km -> /?page_id=70636',
    'ruta: Recorridos largos del Francés | desde 315 km -> /?page_id=12',
    'ruta: Recorridos largos del Portugués | desde 265 km -> /?page_id=11890',
    'antetitulo: El gran viaje',
    'titular: Varias semanas',
    'pildora: +700 km',
    'intro: Con varias semanas, el Camino cambia de escala y se convierte en una auténtica travesía.',
    'ruta: Saint-Jean-Pied-de-Port → Santiago | 780 km -> /?page_id=90152',
    'nota: Unos 30 días caminando',
  ].join('\n'),

  ejemplo: [
    'antetitulo: Primera experiencia',
    'titular: ≈ 1 semana',
    'pildora: 100–160 km',
    'intro: Con unos siete días, el punto de inicio se vuelve decisivo.',
    'ruta: Sarria → Santiago | 115 km -> /?p=89222',
    'ruta: Tui → Santiago | 119 km -> /?p=89737',
    'ruta: Baiona → Santiago | 160 km -> /?p=93262',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveGrupo: 'antetitulo',
      grupo: ['titular', 'pildora', 'intro', 'nota'],
      claveFicha: 'ruta',
      multilinea: ['intro'],
    });

    const filas = grupos.filter((g) => g.campos.size || g.fichas.length);
    if (!filas.length) {
      throw new Error('No hay ninguna fila. Cada una empieza por una línea «antetitulo: …».');
    }

    const out = [];
    out.push('<section class="durations">');

    filas.forEach((fila) => {
      const antetitulo = campo(fila.campos, 'antetitulo');
      const titular = campo(fila.campos, 'titular');
      const pildora = campo(fila.campos, 'pildora');
      const intro = campo(fila.campos, 'intro');
      const nota = campo(fila.campos, 'nota');

      const rutas = fila.fichas.map((f) => leerRuta(campo(f, 'ruta')));
      if (!rutas.length) {
        avisos.push('La fila «' + antetitulo + '» no tiene ninguna ruta.');
      }

      // La ruta más larga de la fila marca el 100%; el resto va en proporción.
      const medidas = rutas.map((r) => kilometros(r.km));
      const tope = Math.max.apply(null, medidas.filter((k) => k !== null).concat([0]));

      const marcadas = rutas.map((r, i) => {
        let pct = r.pct;
        if (!pct) {
          if (medidas[i] !== null && tope > 0) {
            pct = Math.round((medidas[i] / tope) * 100) + '%';
          } else {
            pct = '0%';
            avisos.push(
              'No encuentro los kilómetros de «' + r.nombre + '», así que su barra sale vacía. ' +
                'Escribe «| 115 km» o fuerza el porcentaje con «| 72%».'
            );
          }
        } else if (!/%\s*$/.test(pct)) {
          pct = pct.trim() + '%';
        }
        if (!r.url) avisos.push('La ruta «' + r.nombre + '» no tiene url.');

        return (
          '<a class="durations__link" href="' + esc(r.url) + '">' +
          '<span class="durations__name">' + linea(r.nombre) + '</span>' +
          '<span class="durations__bar" style="--pct: ' + esc(pct) + ';"><!-- --></span>' +
          '<span class="durations__km">' + linea(r.km) + '</span>' +
          '</a>'
        );
      });

      out.push('<div class="durations__row">');
      out.push('<div class="durations__summary">');
      if (antetitulo) out.push('<div class="durations__eyebrow">' + linea(antetitulo) + '</div>');
      if (titular) out.push('<div class="durations__headline">' + linea(titular) + '</div>');
      if (pildora) out.push('<span class="durations__pill">' + linea(pildora) + '</span>');
      out.push('</div>');
      out.push('<div class="durations__detail">');
      if (intro) out.push('<p class="durations__intro">' + linea(intro) + '</p>');
      out.push('<div class="durations__links">' + marcadas.join('') + '</div>');
      if (nota) out.push('<div class="durations__note">' + linea(nota) + '</div>');
      out.push('</div>');
      out.push('</div>');
    });

    out.push('</section>');

    return { html: out.join('\n'), avisos };
  },
};
