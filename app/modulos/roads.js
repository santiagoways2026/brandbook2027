import { esc, linea, normalizar, leerFichas, campo, lista, tamano, avisarAlt } from './_comun.js';

export default {
  id: 'roads',
  nombre: 'Tarjetas de rutas',
  clase: '.roads',
  grupo: 'Rutas',
  descripcion:
    'Listado de rutas en tarjetas con foto, banderola lima en diagonal, etiquetas y enlace. La tarjeta entera es el enlace.',
  estado: { texto: 'HTML y CSS originales · 2 clases sin CSS', tono: 'aviso' },
  reglas: [
    '.roads__card es un <a>, no un <div>: la tarjeta entera es clicable y dentro solo van <span>.',
    'La flecha → del enlace va escrita en el HTML: aquí el CSS no la pone.',
    'variante: alt pinta el fondo en verde claro (#F4F8EC) en vez de crema. Sirve para alternar secciones seguidas.',
    '.roads__subtitle y .roads__desc se usan en la web pero NO existen en bloques.css: salen sin estilo propio.',
    'La banderola va recortada en diagonal y sobresale por debajo de la foto: textos de 2 o 3 palabras.',
  ],
  entrada: {
    etiqueta: 'Cabecera y una ficha por ruta',
    ayuda:
      'Cabecera: titulo, subtitulo, variante. Cada ruta empieza por «ruta:» y admite url, imagen, alt, tamano, banderola, texto, etiqueta (repetible) y enlace.',
    filas: 16,
  },

  demo: [
    'titulo: Cuatro Caminos, cuatro caracteres',
    'subtitulo: No hay un Camino mejor. Hay el que encaja contigo.',
    'ruta: Camino Francés',
    'url: /?page_id=12',
    'imagen: https://santiagoways.com/wp-content/uploads/2016/10/post-ropa1.webp',
    'alt: Peregrinos caminando por el Camino Francés',
    'banderola: El social',
    'texto: Siempre hay alguien caminando cerca. La ruta con más vida y la mejor preparada.',
    'etiqueta: La más elegida',
    'enlace: Ver el Camino Francés →',
    'ruta: Camino Portugués',
    'url: /?page_id=11890',
    'imagen: https://santiagoways.com/wp-content/uploads/2026/03/feature-post-tui-sarria.webp',
    'alt: Camino Portugués desde Tui',
    'banderola: El cómodo',
    'texto: 119 km desde Tui, etapas amables y pueblos cada poco. Ideal para empezar.',
    'etiqueta: La que más crece',
    'enlace: Ver el Camino Portugués →',
    'ruta: Camino Portugués por la Costa',
    'url: /?page_id=22210',
    'imagen: https://santiagoways.com/wp-content/uploads/2026/07/feature-guia-costa-baiona.webp',
    'alt: Camino Portugués por la Costa desde Baiona',
    'banderola: El del mar',
    'texto: El Atlántico te acompaña casi todo el trayecto: playas, paseos marítimos y marisco.',
    'etiqueta: Costa y paisaje marítimo',
    'enlace: Ver el Camino Portugués por la Costa →',
    'ruta: Camino del Norte',
    'url: /?page_id=42',
    'imagen: https://santiagoways.com/wp-content/uploads/2026/08/feature-etapas-camino-norte.webp',
    'alt: Etapa del Camino del Norte por la costa cantábrica',
    'tamano: 800x560',
    'banderola: El salvaje',
    'texto: Acantilados, verde cantábrico y subidas de verdad. La más exigente de las cuatro.',
    'etiqueta: Costa, naturaleza y reto',
    'enlace: Ver el Camino del Norte →',
  ].join('\n'),

  ejemplo: [
    'titulo: Otras rutas que merece la pena conocer',
    'subtitulo: Hay Caminos que se eligen precisamente por ser diferentes.',
    'variante: alt',
    'ruta: Camino Primitivo',
    'url: /?page_id=14072',
    'imagen: https://santiagoways.com/wp-content/uploads/2026/01/3-scaled.png',
    'alt: Peregrino caminando por el Camino Primitivo',
    'banderola: El montañero',
    'texto: Montaña, desniveles y naturaleza. Una ruta con carácter para quienes buscan un Camino físicamente más exigente.',
    'etiqueta: montaña y reto',
    'enlace: Ver el Camino Primitivo →',
    'ruta: Camino Inglés',
    'url: /?page_id=71742',
    'imagen: https://santiagoways.com/wp-content/uploads/2026/05/post-etapas-camino-ingles2.webp',
    'alt: Ferrol, punto de inicio del Camino Inglés',
    'tamano: 950x394',
    'banderola: El breve',
    'texto: Un Camino compacto desde Ferrol, ideal para quienes quieren llegar a Santiago y disponen de pocos días.',
    'etiqueta: Ideal con pocos días',
    'enlace: Ver el Camino Inglés →',
  ].join('\n'),

  render(bruto) {
    const { cabecera, grupos, avisos } = leerFichas(bruto, {
      cabecera: ['titulo', 'subtitulo', 'variante'],
      claveFicha: 'ruta',
      ficha: ['url', 'imagen', 'alt', 'tamano', 'banderola', 'texto', 'etiqueta', 'enlace'],
      multilinea: ['texto', 'subtitulo', 'alt'],
    });

    const titulo = campo(cabecera, 'titulo');
    const subtitulo = campo(cabecera, 'subtitulo');
    const variante = normalizar(campo(cabecera, 'variante'));
    const rutas = grupos[0] ? grupos[0].fichas : [];

    if (!rutas.length) {
      throw new Error('No hay ninguna ruta. Cada tarjeta empieza por una línea «ruta: …».');
    }
    if (variante && variante !== 'alt') {
      avisos.push('«variante: ' + variante + '» no vale: la única variante es «alt». Se ignora.');
    }

    const clase = variante === 'alt' ? 'roads roads--alt' : 'roads';

    const tarjetas = rutas.map((f) => {
      const nombre = campo(f, 'ruta');
      const url = campo(f, 'url');
      const imagen = campo(f, 'imagen');
      const alt = campo(f, 'alt');
      const banderola = campo(f, 'banderola');
      const texto = campo(f, 'texto');
      const etiquetas = lista(f, 'etiqueta');
      const verMas = campo(f, 'enlace');

      if (!url) avisos.push('La ruta «' + nombre + '» no tiene url. Añade una línea «url: …».');
      if (!imagen) avisos.push('La ruta «' + nombre + '» no tiene imagen.');
      else avisarAlt(avisos, alt, '«' + nombre + '»');
      if (verMas && !/[→>]\s*$/.test(verMas)) {
        avisos.push('El enlace de «' + nombre + '» no acaba en →. En la web todas las tarjetas lo llevan.');
      }

      const partes = [];
      partes.push('<a class="roads__card" href="' + esc(url) + '">');
      partes.push('<span class="roads__media">');
      if (imagen) {
        partes.push('<img class="roads__img" src="' + esc(imagen) + '" alt="' + esc(alt) + '"' + tamano(campo(f, 'tamano')) + ' />');
      }
      if (banderola) partes.push('<span class="roads__flag">' + linea(banderola) + '</span>');
      partes.push('</span>');
      partes.push('<span class="roads__body">');
      partes.push('<span class="roads__name">' + linea(nombre) + '</span>');
      if (texto) partes.push('<span class="roads__desc">' + linea(texto) + '</span>');
      if (etiquetas.length) {
        partes.push(
          '<span class="roads__tags">' +
            etiquetas.map((e) => '<span class="roads__tag">' + linea(e) + '</span>').join('') +
            '</span>'
        );
      }
      if (verMas) partes.push('<span class="roads__link">' + linea(verMas) + '</span>');
      partes.push('</span>');
      partes.push('</a>');
      return partes.join('');
    });

    const out = [];
    out.push('<section class="' + clase + '">');
    if (titulo || subtitulo) {
      out.push('<div class="roads__header">');
      if (titulo) out.push('<h3 class="roads__title">' + linea(titulo) + '</h3>');
      if (subtitulo) out.push('<p class="roads__subtitle">' + linea(subtitulo) + '</p>');
      out.push('</div>');
    }
    out.push('<div class="roads__grid">' + tarjetas.join('') + '</div>');
    out.push('</section>');

    return { html: out.join('\n'), avisos };
  },
};
