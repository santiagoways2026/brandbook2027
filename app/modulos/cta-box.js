import { esc, linea, leerCampos, campo, enlace } from './_comun.js';

export default {
  id: 'cta-box',
  nombre: 'Caja comercial',
  clase: '.cta-box',
  grupo: 'Conversión',
  descripcion:
    'Caja verde claro con titular, un párrafo y un botón. La llamada a la acción estándar dentro de un artículo.',
  estado: { texto: 'CSS original · HTML publicado con estilos inline', tono: 'aviso' },
  reglas: [
    'El HTML que circula por la web usa estilos inline en vez de las clases. Se ve igual, pero pierde el :hover del botón y el @media de 480 px que lo pone a ancho completo en móvil.',
    'Esta es la versión con clases, que es la que hay que usar a partir de ahora.',
    'Un solo botón: el CSS no contempla varios.',
    'El botón no lleva flecha en el original. Si la quieres, escríbela: el CSS no la pone.',
  ],
  entrada: {
    etiqueta: 'Un campo por línea',
    ayuda: 'Campos: titulo, texto y boton («Texto -> url»). Usa **texto** para negrita.',
    filas: 7,
  },

  demo: [
    'titulo: ¿Prefieres llegar al Camino con la logística ya organizada?',
    'texto: En Santiago Ways organizamos **Viajes Organizados autoguiados** con Hoteles seleccionados, Traslado de Equipaje, Asistencia 24h y App de navegación, para que puedas caminar a tu ritmo con una parte importante del viaje preparada de antemano.',
    'boton: Solicitar presupuesto -> /?page_id=67170',
  ].join('\n'),

  ejemplo: [
    'titulo: ¿Quieres que organicemos tu Camino?',
    'texto: Hoteles seleccionados, traslado de equipaje y asistencia 24 h. Tú solo caminas.',
    'boton: Pedir presupuesto -> /?page_id=67170',
  ].join('\n'),

  render(bruto) {
    const { campos, avisos } = leerCampos(
      bruto,
      ['titulo', 'texto', 'boton'],
      ['titulo', 'texto']
    );

    const titulo = campo(campos, 'titulo');
    const texto = campo(campos, 'texto');
    const boton = campo(campos, 'boton');

    if (!titulo) throw new Error('Falta el titular. Escribe una línea «titulo: …».');
    if (!boton) {
      throw new Error('Falta el botón. Sin él la caja no lleva a ninguna parte: escribe «boton: Texto -> /url».');
    }

    const par = enlace(boton);
    if (!par.url) avisos.push('El botón no tiene enlace. Escríbelo como «boton: Texto -> /url».');
    if ((campos.get('boton') || []).length > 1) {
      avisos.push('Solo se usa el primer botón: el CSS de esta caja no contempla varios.');
    }
    if (!texto) avisos.push('La caja va sin texto: queda el titular pegado al botón.');

    const out = [];
    out.push('<div class="cta-box">');
    out.push('<h3 class="cta-box__title">' + linea(titulo) + '</h3>');
    if (texto) out.push('<p class="cta-box__text">' + linea(texto) + '</p>');
    out.push('<a class="cta-box__button" href="' + esc(par.url) + '">' + linea(par.texto) + '</a>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
