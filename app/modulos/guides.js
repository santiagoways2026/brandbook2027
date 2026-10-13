import { esc, linea, leerFichas, campo, enlace } from './_comun.js';

export default {
  id: 'guides',
  nombre: 'Guías descargables',
  clase: '.guides',
  grupo: 'Conversión',
  descripcion:
    'Caja verde claro con un titular, una entradilla y tarjetas de guías, cada una con su botón. Para enlazar a contenidos largos desde dentro de un artículo.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El título del bloque es <h3> y el de cada tarjeta <h4>: mantienen la jerarquía del documento. Es el único bloque que usa <h4>.',
    'Las tarjetas son flex 1 1 260px, así que a partir de tres por fila se parten solas.',
    'El botón no lleva flecha: el CSS no la pone y el original no la escribe.',
    'Las tarjetas van sobre fondo verde (#eaf3d9) dentro de una caja ya verde claro (#f7faf2): no meter más cajas dentro.',
  ],
  entrada: {
    etiqueta: 'Cabecera y una ficha por guía',
    ayuda:
      'Cabecera: titulo e intro. Cada guía empieza por «guia:» (su título) y lleva «texto:» y «boton:» («Texto -> url»).',
    filas: 11,
  },

  demo: [
    'titulo: Antes de elegir, consulta las guías completas de cada ruta',
    'intro: Si todavía dudas entre empezar el Camino desde Sarria o desde Tui, estas guías te ayudarán a comparar etapas, kilómetros, servicios y consejos prácticos para organizar tu viaje.',
    'guia: Camino Francés desde Sarria',
    'texto: La opción más popular.',
    'boton: Ver guía de Sarria -> /?p=89222',
    'guia: Camino Portugués desde Tui',
    'texto: Una alternativa más tranquila.',
    'boton: Ver guía de Tui -> /?p=89737',
  ].join('\n'),

  ejemplo: [
    'titulo: Guías para preparar tu mochila',
    'intro: Dos lecturas cortas que resuelven casi todas las dudas de equipaje.',
    'guia: Qué llevar al Camino',
    'texto: La lista completa, por estaciones.',
    'boton: Ver la guía -> /?p=17560',
    'guia: Cómo elegir el calzado',
    'texto: Botas, zapatillas y cuándo usar cada cosa.',
    'boton: Ver la guía -> /?p=70798',
  ].join('\n'),

  render(bruto) {
    const { cabecera, grupos, avisos } = leerFichas(bruto, {
      cabecera: ['titulo', 'intro'],
      claveFicha: 'guia',
      ficha: ['texto', 'boton'],
      multilinea: ['intro', 'texto', 'titulo'],
    });

    const titulo = campo(cabecera, 'titulo');
    const intro = campo(cabecera, 'intro');
    const guias = grupos[0] ? grupos[0].fichas : [];

    if (!titulo) throw new Error('Falta el título. Escribe una línea «titulo: …».');
    if (!guias.length) {
      throw new Error('No hay ninguna guía. Cada una empieza por una línea «guia: …».');
    }
    if (guias.length > 3) {
      avisos.push(
        guias.length + ' guías: con el mínimo de 260 px se parten en varias filas y la caja ' +
          'se hace muy alta. Dos o tres funciona mejor.'
      );
    }

    const out = [];
    out.push('<div class="guides">');
    out.push('<h3 class="guides__title">' + linea(titulo) + '</h3>');
    if (intro) out.push('<p class="guides__intro">' + linea(intro) + '</p>');
    out.push('<div class="guides__grid">');

    guias.forEach((f) => {
      const nombre = campo(f, 'guia');
      const texto = campo(f, 'texto');
      const boton = campo(f, 'boton');
      const par = enlace(boton);

      if (!boton) {
        avisos.push('La guía «' + nombre + '» no tiene botón: la tarjeta no lleva a ninguna parte.');
      } else if (!par.url) {
        avisos.push('El botón de «' + nombre + '» no tiene enlace. Escríbelo como «Texto -> /url».');
      }

      out.push('<div class="guides__card">');
      out.push('<h4 class="guides__card-title">' + linea(nombre) + '</h4>');
      if (texto) out.push('<p class="guides__card-text">' + linea(texto) + '</p>');
      if (boton) {
        out.push('<a class="guides__button" href="' + esc(par.url) + '">' + linea(par.texto) + '</a>');
      }
      out.push('</div>');
    });

    out.push('</div>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
