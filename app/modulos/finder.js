import { esc, linea, leerFichas, campo, lista, enlace, dosDigitos } from './_comun.js';

export default {
  id: 'finder',
  nombre: 'Selector de preguntas',
  clase: '.finder',
  grupo: 'Datos',
  descripcion:
    'Rejilla de tarjetas con una pregunta cada una y los enlaces que la responden. Sirve para orientar al lector según lo que busca.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El número (01, 02…) se genera solo según el orden: no se escribe.',
    'El chevron › de cada enlace lo pone el CSS con ::after. No escribirlo aquí.',
    '.finder__question es un <div>, no un encabezado: no entra en el índice de la página.',
    'Las tarjetas se reparten en columnas de 300 px mínimo, así que el número de tarjetas por fila depende del ancho.',
  ],
  entrada: {
    etiqueta: 'Una ficha por pregunta',
    ayuda:
      'Cada tarjeta empieza por «categoria:» y admite pregunta, texto y enlace (repetible, «Texto -> url»).',
    filas: 14,
  },

  demo: [
    'categoria: Primera vez',
    'pregunta: ¿Es tu primer Camino?',
    'texto: Prioriza buenas conexiones, servicios frecuentes y etapas fáciles de adaptar.',
    'enlace: Camino Francés -> /?page_id=12',
    'enlace: Camino Portugués -> /?page_id=11890',
    'categoria: Costa',
    'pregunta: ¿Quieres caminar junto al mar?',
    'texto: El Atlántico y el Cantábrico cambian por completo el paisaje del Camino.',
    'enlace: Portugués por la Costa -> /?page_id=22210',
    'enlace: Camino del Norte -> /?page_id=42',
    'categoria: Reto físico',
    'pregunta: ¿Buscas montaña y desafío?',
    'texto: Si el desnivel forma parte de lo que buscas, el Primitivo destaca claramente.',
    'enlace: Camino Primitivo -> /?page_id=14072',
    'categoria: Una semana',
    'pregunta: ¿Tienes unos siete días?',
    'texto: Con una semana lo que decides no es la ruta, es el punto de inicio.',
    'enlace: Francés desde Sarria -> /?p=89222',
    'enlace: Portugués desde Tui -> /?p=89737',
    'enlace: Camino Inglés -> /?page_id=71742',
    'categoria: Tranquilidad',
    'pregunta: ¿Prefieres menos peregrinos?',
    'texto: Rutas con menos gente, más silencio y sensación de camino propio.',
    'enlace: Camino Primitivo -> /?page_id=14072',
    'enlace: Camino del Norte -> /?page_id=42',
    'enlace: Vía de la Plata desde Ourense -> /?page_id=73036',
    'categoria: Ambiente peregrino',
    'pregunta: ¿Quieres conocer gente en el Camino?',
    'texto: El Francés sigue siendo la referencia si valoras la parte social del viaje.',
    'enlace: Camino Francés -> /?page_id=12',
  ].join('\n'),

  ejemplo: [
    'categoria: Primera vez',
    'pregunta: ¿Es tu primer Camino?',
    'texto: Prioriza buenas conexiones, servicios frecuentes y etapas fáciles de adaptar.',
    'enlace: Camino Francés -> /?page_id=12',
    'enlace: Camino Portugués -> /?page_id=11890',
    'categoria: Presupuesto',
    'pregunta: ¿Quieres ajustar el gasto?',
    'texto: Las rutas cortas reducen noches de hotel y desplazamientos hasta el inicio.',
    'enlace: Camino Inglés -> /?page_id=71742',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'categoria',
      ficha: ['pregunta', 'texto', 'enlace'],
      multilinea: ['texto', 'pregunta'],
    });

    const fichas = grupos[0] ? grupos[0].fichas : [];
    if (!fichas.length) {
      throw new Error('No hay ninguna tarjeta. Cada una empieza por una línea «categoria: …».');
    }

    const out = [];
    out.push('<section class="finder">');
    out.push('<div class="finder__grid">');

    fichas.forEach((f, i) => {
      const categoria = campo(f, 'categoria');
      const pregunta = campo(f, 'pregunta');
      const texto = campo(f, 'texto');
      const enlaces = lista(f, 'enlace');

      if (!pregunta) avisos.push('La tarjeta «' + categoria + '» no tiene pregunta.');
      if (!enlaces.length) {
        avisos.push('La tarjeta «' + categoria + '» no tiene ningún enlace: no lleva a ninguna parte.');
      }

      out.push('<div class="finder__card">');
      out.push(
        '<div class="finder__meta"><span class="finder__number">' + dosDigitos(i + 1) +
          '</span><span class="finder__category">' + linea(categoria) + '</span></div>'
      );
      if (pregunta) out.push('<div class="finder__question">' + linea(pregunta) + '</div>');
      if (texto) out.push('<div class="finder__text">' + linea(texto) + '</div>');
      if (enlaces.length) {
        const marcados = enlaces.map((e) => {
          const par = enlace(e);
          if (!par.url) avisos.push('El enlace «' + par.texto + '» no tiene url.');
          return '<a class="finder__link" href="' + esc(par.url) + '">' + linea(par.texto) + '</a>';
        });
        out.push('<div class="finder__links">' + marcados.join('') + '</div>');
      }
      out.push('</div>');
    });

    out.push('</div>');
    out.push('</section>');

    return { html: out.join('\n'), avisos };
  },
};
