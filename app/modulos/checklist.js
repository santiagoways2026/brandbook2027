import { linea, normalizar, leerFichas, campo, lista } from './_comun.js';

export default {
  id: 'checklist',
  nombre: 'Listas de comprobación',
  clase: '.checklist',
  grupo: 'Listas',
  descripcion:
    'Caja verde claro con un titular, una entradilla y tarjetas blancas, cada una con su lista. Para la típica checklist de equipaje.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'El título del bloque es <h2>, no <h3>. Es el único bloque del sistema, aparte del hero, que usa ese nivel: dentro de un artículo que ya tiene <h2>, conviene bajarlo con «nivel: h3».',
    'El título de cada tarjeta es <h3>.',
    'Los emojis van escritos en el título de la tarjeta, delante del texto.',
    'La lista es un <ul> normal: las viñetas son las del navegador, el CSS solo ajusta sangría e interlineado.',
    'Las tarjetas se reparten en columnas de 220 px mínimo, así que caben bastantes por fila.',
  ],
  entrada: {
    etiqueta: 'Cabecera y una ficha por tarjeta',
    ayuda:
      'Cabecera: titulo, intro y nivel (h2 o h3). Cada tarjeta empieza por «lista:» (su título, con el emoji si lo lleva) y acumula líneas «item:».',
    filas: 16,
  },

  demo: [
    'titulo: Checklist rápida para copiar antes del Camino',
    'intro: Revisa esta lista antes de salir y asegúrate de llevar solo lo imprescindible.',
    'lista: 📄 Documentación',
    'item: DNI o pasaporte',
    'item: Credencial',
    'item: Tarjeta sanitaria o seguro',
    'lista: 👕 Ropa',
    'item: 2 camisetas técnicas',
    'item: Impermeable',
    'item: 1–2 pantalones',
    'item: Calcetines técnicos',
    'item: Ropa interior',
    'lista: 🥾 Calzado',
    'item: Zapatillas usadas',
    'item: Chanclas',
    'lista: 🧴 Higiene y botiquín',
    'item: Protector solar',
    'item: Toalla microfibra',
    'item: Apósitos para ampollas',
    'item: Antiséptico',
    'lista: 🔋 Electrónica',
    'item: Móvil',
    'item: Cargador',
    'item: Power bank',
  ].join('\n'),

  ejemplo: [
    'titulo: Qué llevar en la mochila de día',
    'intro: Con traslado de equipaje solo cargas esto durante la etapa.',
    'nivel: h3',
    'lista: 💧 Siempre',
    'item: Agua (1,5 l)',
    'item: Fruta o barritas',
    'item: Protector solar',
    'lista: 🌧️ Según el tiempo',
    'item: Chubasquero',
    'item: Gorra',
  ].join('\n'),

  render(bruto) {
    const { cabecera, grupos, avisos } = leerFichas(bruto, {
      cabecera: ['titulo', 'intro', 'nivel'],
      claveFicha: 'lista',
      ficha: ['item'],
      multilinea: ['intro', 'titulo'],
    });

    const titulo = campo(cabecera, 'titulo');
    const intro = campo(cabecera, 'intro');
    const tarjetas = grupos[0] ? grupos[0].fichas : [];

    if (!titulo) throw new Error('Falta el título. Escribe una línea «titulo: …».');
    if (!tarjetas.length) {
      throw new Error('No hay ninguna lista. Cada tarjeta empieza por una línea «lista: …».');
    }

    let nivel = normalizar(campo(cabecera, 'nivel')) || 'h2';
    if (nivel !== 'h2' && nivel !== 'h3') {
      avisos.push('«nivel: ' + nivel + '» no vale: solo h2 o h3. Se usa h2.');
      nivel = 'h2';
    }

    const out = [];
    out.push('<div class="checklist">');
    out.push('<' + nivel + ' class="checklist__title">' + linea(titulo) + '</' + nivel + '>');
    if (intro) out.push('<p class="checklist__intro">' + linea(intro) + '</p>');
    out.push('<div class="checklist__grid">');

    tarjetas.forEach((f) => {
      const nombre = campo(f, 'lista');
      const items = lista(f, 'item');
      if (!items.length) avisos.push('La lista «' + nombre + '» está vacía: no tiene ningún item.');

      out.push('<div class="checklist__card">');
      out.push('<h3 class="checklist__card-title">' + linea(nombre) + '</h3>');
      out.push('<ul class="checklist__list">');
      items.forEach((i) => out.push('<li>' + linea(i) + '</li>'));
      out.push('</ul>');
      out.push('</div>');
    });

    out.push('</div>');
    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
