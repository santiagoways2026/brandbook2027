import { esc, linea, leerCampos, campo, lista, enlace } from './_comun.js';

export default {
  id: 'gr-planner',
  nombre: 'Promo planificador',
  clase: '.gr-planner',
  grupo: 'Conversión',
  descripcion:
    'Promoción de la herramienta del planificador: a la izquierda el argumento y el botón, a la derecha una columna verde noche con una lista de ejemplo.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El orden en el HTML es head, side, body. NO head, body, side: la rejilla usa grid-template-areas, así que la columna oscura ocupa las dos filas aunque en el código vaya en medio.',
    'Las marcas de verificación de la lista las pone el CSS con ::before. No escribirlas.',
    'Las casillas de la columna oscura también son CSS: el cuadrado vacío por defecto, relleno de verde con gr-planner__item--done.',
    'Por debajo de 700 px la rejilla se deshace y el orden visual pasa a ser el del código: titular, columna oscura, cuerpo.',
    'Un solo botón: la rejilla no contempla varios.',
  ],
  entrada: {
    etiqueta: 'Un campo por línea',
    ayuda:
      'Izquierda: antetitulo, titulo, intro, punto (repetible), boton («Texto -> url») y nota. Derecha: lateral (el rótulo), item (repetible; añade «| hecho» para marcarlo) y peso.',
    filas: 16,
  },

  demo: [
    'antetitulo: Herramienta gratuita',
    'titulo: ¿No sabes qué meter en la mochila?',
    'lateral: Tu lista personalizada',
    'item: Pasaporte o DNI | hecho',
    'item: Gorra | hecho',
    'item: Bastones de trekking',
    'item: Protección solar',
    'peso: Peso objetivo **6,5 kg**',
    'intro: Responde cuatro preguntas sobre tu ruta, tu época y tu tipo de alojamiento, y te damos tu lista de equipaje personalizada.',
    'punto: Adaptada a tu ruta y a la estación del año',
    'punto: Con el peso objetivo de tu mochila en kg',
    'punto: Descárgala en PDF o úsala desde el móvil',
    'boton: Crear mi lista -> https://santiagoways.com/planificador-mochila/',
    'nota: Tarda menos de un minuto. Sin registro.',
  ].join('\n'),

  ejemplo: [
    'antetitulo: Herramienta gratuita',
    'titulo: ¿Cuántos días necesitas para tu Camino?',
    'lateral: Tu plan de etapas',
    'item: Sarria – Portomarín | hecho',
    'item: Portomarín – Palas de Rei',
    'item: Palas de Rei – Arzúa',
    'peso: Total <strong>115 km</strong>',
    'intro: Dinos tu ruta y tus días libres y te proponemos el reparto de etapas.',
    'punto: Ajustado a tu forma física',
    'punto: Con los kilómetros de cada jornada',
    'boton: Calcular mis etapas -> /planificador-etapas/',
    'nota: Sin registro.',
  ].join('\n'),

  render(bruto) {
    const PERMITIDAS = [
      'antetitulo', 'titulo', 'intro', 'punto', 'boton', 'nota',
      'lateral', 'item', 'peso',
    ];
    const { campos, avisos } = leerCampos(bruto, PERMITIDAS, ['intro', 'titulo']);

    const antetitulo = campo(campos, 'antetitulo');
    const titulo = campo(campos, 'titulo');
    const intro = campo(campos, 'intro');
    const puntos = lista(campos, 'punto');
    const boton = campo(campos, 'boton');
    const nota = campo(campos, 'nota');
    const lateral = campo(campos, 'lateral');
    const items = lista(campos, 'item');
    const peso = campo(campos, 'peso');

    if (!titulo) throw new Error('Falta el titular. Escribe una línea «titulo: …».');
    if (!boton) {
      throw new Error('Falta el botón. Es el motivo del bloque: escribe «boton: Texto -> /url».');
    }

    const par = enlace(boton);
    if (!par.url) avisos.push('El botón no tiene enlace. Escríbelo como «boton: Texto -> /url».');
    if (lista(campos, 'boton').length > 1) {
      avisos.push('Solo se usa el primer botón: la rejilla no contempla varios.');
    }
    if (!items.length) {
      avisos.push('La columna oscura va sin items: queda un rectángulo verde casi vacío.');
    }
    if (!puntos.length) avisos.push('No hay ningún punto: el bloque pierde su lista de ventajas.');

    const out = [];
    out.push('<div class="gr-planner">');
    out.push('<div class="gr-planner__row">');

    out.push('<div class="gr-planner__head">');
    if (antetitulo) out.push('<span class="gr-planner__eyebrow">' + linea(antetitulo) + '</span>');
    out.push('<h3 class="gr-planner__title">' + linea(titulo) + '</h3>');
    out.push('</div>');

    // La columna oscura va aquí en el código aunque visualmente ocupe las dos filas.
    out.push('<div class="gr-planner__side">');
    if (lateral) out.push('<div class="gr-planner__side-label">' + linea(lateral) + '</div>');
    if (items.length) {
      out.push('<div class="gr-planner__card">');
      items.forEach((i) => {
        const trozos = i.split('|').map((t) => t.trim());
        const hecho = /^(hecho|si|sí|done|x)$/i.test(trozos[1] || '');
        out.push(
          '<div class="gr-planner__item' + (hecho ? ' gr-planner__item--done' : '') + '">' +
            linea(trozos[0]) + '</div>'
        );
      });
      out.push('</div>');
    }
    if (peso) out.push('<div class="gr-planner__weight">' + linea(peso) + '</div>');
    out.push('</div>');

    out.push('<div class="gr-planner__body">');
    if (intro) out.push('<p class="gr-planner__intro">' + linea(intro) + '</p>');
    if (puntos.length) {
      out.push('<ul class="gr-planner__list">');
      puntos.forEach((p) => out.push('<li>' + linea(p) + '</li>'));
      out.push('</ul>');
    }
    out.push('<a class="gr-planner__cta" href="' + esc(par.url) + '">' + linea(par.texto) + '</a>');
    if (nota) out.push('<p class="gr-planner__note">' + linea(nota) + '</p>');
    out.push('</div>');

    out.push('</div>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
