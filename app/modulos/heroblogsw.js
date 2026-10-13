import { esc, linea, normalizar, leerCampos, campo, lista, enlace } from './_comun.js';

export default {
  id: 'heroblogsw',
  nombre: 'Hero de artículo',
  clase: '.heroblogsw',
  grupo: 'Cabeceras',
  descripcion:
    'Cabecera de artículo: foto a sangre, velo oscuro de izquierda a derecha y, encima, etiqueta, titular y botones.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'La raíz es <section>, no <div>. El overlay va siempre: sin él, el texto blanco pierde contraste sobre la foto.',
    'El velo es más oscuro a la izquierda, así que la foto debe tener aire por ese lado.',
    'Los símbolos del botón (→) y de la etiqueta (✔) van escritos en el HTML: aquí el CSS no los pone.',
    'El titular es <h2>. Si el bloque abre la página y no hay nada por encima, usa nivel: h1.',
    'La foto necesita texto alternativo: ocupa todo el bloque y no es decorativa.',
  ],
  entrada: {
    etiqueta: 'Un campo por línea',
    ayuda:
      'Campos: imagen, alt, etiqueta, titulo, boton, nivel. El botón se escribe «Texto -> url». Puedes repetir boton para poner varios. Etiqueta y botón son opcionales; imagen y titulo, no.',
    filas: 8,
  },

  demo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2019/10/feature-singles.webp',
    'alt: Peregrinos caminando por una etapa del Camino de Santiago',
    'etiqueta: ✔ Actualizado 2026',
    'titulo: Todo lo que necesitas saber para organizar tu Camino paso a paso',
    'boton: Ver rutas principales → -> /?page_id=11888',
  ].join('\n'),

  ejemplo: [
    'imagen: https://santiagoways.com/wp-content/uploads/2019/10/feature-singles.webp',
    'alt: Peregrina cruzando un puente de piedra al amanecer',
    'etiqueta: ✔ Año Santo 2027',
    'titulo: El Camino Francés desde Sarria, etapa a etapa',
    'boton: Ver la ruta → -> /camino-frances-desde-sarria',
    'boton: Pedir presupuesto → -> /contacto',
  ].join('\n'),

  render(bruto) {
    const PERMITIDAS = ['imagen', 'alt', 'etiqueta', 'titulo', 'boton', 'nivel'];
    // Solo el texto corrido admite partirse en varias líneas.
    const MULTILINEA = ['titulo', 'alt'];
    const { campos, avisos } = leerCampos(bruto, PERMITIDAS, MULTILINEA);

    const imagen = campo(campos, 'imagen');
    const alt = campo(campos, 'alt');
    const etiqueta = campo(campos, 'etiqueta');
    const titulo = campo(campos, 'titulo');
    const botones = lista(campos, 'boton');

    if (!imagen) throw new Error('Falta la imagen. Escribe una línea «imagen: https://…».');
    if (!titulo) throw new Error('Falta el titular. Escribe una línea «titulo: …».');

    let nivel = normalizar(campo(campos, 'nivel')) || 'h2';
    if (nivel !== 'h1' && nivel !== 'h2') {
      avisos.push('«nivel: ' + nivel + '» no vale: solo h1 o h2. Se usa h2.');
      nivel = 'h2';
    }

    if (!alt) {
      avisos.push(
        'La foto va sin texto alternativo. Ocupa todo el bloque y no es decorativa: ' +
          'añade una línea «alt: …» describiendo lo que se ve.'
      );
    }
    if (titulo.length > 100) {
      avisos.push(
        'El titular tiene ' + titulo.length + ' caracteres. A 56 px en escritorio ocupará ' +
          'varias líneas y empujará los botones fuera de la foto.'
      );
    }
    if (botones.length > 2) {
      avisos.push(botones.length + ' botones: en móvil se apilan y tapan la foto. Dos como mucho.');
    }

    const out = [];
    out.push(
      '<section class="heroblogsw"><img class="heroblogsw__img" src="' +
        esc(imagen) + '" alt="' + esc(alt) + '" />'
    );
    out.push('<div class="heroblogsw__overlay"></div>');
    out.push('<div class="heroblogsw__content">');
    if (etiqueta) out.push('<div class="heroblogsw__badge">' + linea(etiqueta) + '</div>');
    out.push('<' + nivel + ' class="heroblogsw__title">' + linea(titulo) + '</' + nivel + '>');
    if (botones.length) {
      const marcados = botones.map((b) => {
        const par = enlace(b);
        if (!par.url) {
          avisos.push('El botón «' + par.texto + '» no tiene enlace. Escríbelo como «Texto -> /ruta».');
        }
        return '<a class="heroblogsw__button" href="' + esc(par.url) + '">' + linea(par.texto) + '</a>';
      });
      out.push('<div class="heroblogsw__actions">' + marcados.join('') + '</div>');
    }
    out.push('</div>');
    out.push('</section>');

    return { html: out.join('\n'), avisos };
  },
};
