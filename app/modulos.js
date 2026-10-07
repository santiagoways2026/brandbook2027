/* ============================================================
   Registro de módulos
   ------------------------------------------------------------
   Cada módulo describe un bloque de design-system/bloques.css:
   cómo se ve, qué datos acepta y cómo se convierten en HTML.

   Para añadir un módulo nuevo, copia la plantilla del final de
   este archivo y mételo en el array MODULOS. Nada más.
   ============================================================ */

/* ---------- utilidades compartidas ---------- */

/** Escapa el texto para que entre seguro en el HTML. */
function esc(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Convierte el marcado ligero que se admite en los campos de texto.
 * Solo dos cosas, a propósito: negrita y enlaces.
 *   **texto**        -> <strong>texto</strong>
 *   [texto](url)     -> <a href="url">texto</a>
 */
function linea(texto) {
  return esc(texto)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Quita los ** de un texto: para campos que ya van siempre en negrita. */
function sinNegrita(texto) {
  return String(texto).replace(/\*\*/g, '');
}

/**
 * Lee una tabla pegada desde Excel, Word, Markdown o CSV.
 * Devuelve { cabeceras: [], filas: [[]], avisos: [] } o lanza un Error
 * con el motivo si el contenido no sirve.
 */
function leerTabla(bruto) {
  const lineas = String(bruto)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    // Fila separadora de Markdown: |---|:--:|---|
    .filter((l) => !/^\|?[\s:|-]+\|?$/.test(l) || !/-/.test(l));

  if (lineas.length === 0) throw new Error('No hay contenido que convertir.');

  // Delimitador: el primero que aparezca en la línea de cabecera.
  const cabecera = lineas[0];
  let separador;
  if (cabecera.includes('|')) separador = '|';
  else if (cabecera.includes('\t')) separador = '\t';
  else if (cabecera.includes(';')) separador = ';';
  else if (cabecera.includes(',')) separador = ',';
  else throw new Error('No encuentro columnas. Separa con | , ; o tabulador.');

  const partir = (l) => {
    let celdas = l.split(separador).map((c) => c.trim());
    if (separador === '|') {
      if (celdas.length && celdas[0] === '') celdas.shift();
      if (celdas.length && celdas[celdas.length - 1] === '') celdas.pop();
    }
    return celdas;
  };

  const cabeceras = partir(lineas[0]);
  if (cabeceras.length < 2) throw new Error('Hacen falta al menos dos columnas.');

  const filas = lineas.slice(1).map(partir);
  if (filas.length === 0) throw new Error('Solo hay cabecera: falta alguna fila de datos.');

  // Normaliza el ancho de cada fila al de la cabecera, avisando de los ajustes:
  // una fila descuadrada casi siempre es un separador mal escrito o una celda
  // con el delimitador dentro, y en silencio se perdería el dato.
  const cortas = [];
  const largas = [];
  filas.forEach((f, i) => {
    if (f.length < cabeceras.length) cortas.push(i + 2);
    if (f.length > cabeceras.length) largas.push(i + 2);
    while (f.length < cabeceras.length) f.push('');
    f.length = cabeceras.length;
  });

  const avisos = [];
  if (largas.length) {
    avisos.push(
      'Sobran celdas en ' + (largas.length === 1 ? 'la línea ' : 'las líneas ') +
        largas.join(', ') + ': se han recortado al número de columnas de la cabecera. ' +
        'Suele pasar cuando el texto de una celda lleva dentro el separador.'
    );
  }
  if (cortas.length) {
    avisos.push(
      'Faltan celdas en ' + (cortas.length === 1 ? 'la línea ' : 'las líneas ') +
        cortas.join(', ') + ': se han rellenado vacías.'
    );
  }

  return { cabeceras, filas, avisos };
}

/** Normaliza un nombre de campo: minúsculas y sin tildes. */
function normalizar(clave) {
  return String(clave)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Lee un bloque de campos «clave: valor», uno por línea.
 *
 * Solo se abre campo nuevo si la clave está en `permitidas`; así una URL con
 * «https:» dentro no se confunde con una clave.
 *
 * Una línea que no abre campo se pega a la anterior SOLO si ese campo está en
 * `multilinea`, que son los de texto corrido. Pegarla a una URL o a un botón
 * rompería el dato en silencio, así que ahí se avisa en vez de adivinar.
 *
 * Una clave puede repetirse: el valor se acumula en una lista.
 * Devuelve { campos, avisos }, donde campos es un Map clave -> [valores].
 */
function leerCampos(bruto, permitidas, multilinea) {
  const seguidas = multilinea || [];
  const campos = new Map();
  const avisos = [];
  const sueltas = [];
  let ultima = null;

  String(bruto).split(/\r?\n/).forEach((cruda) => {
    const l = cruda.trim();
    if (!l) return;

    const corte = l.indexOf(':');
    const posible = corte > 0 ? normalizar(l.slice(0, corte)) : null;

    if (posible && permitidas.indexOf(posible) !== -1) {
      ultima = posible;
      if (!campos.has(ultima)) campos.set(ultima, []);
      campos.get(ultima).push(l.slice(corte + 1).trim());
      return;
    }

    if (ultima && seguidas.indexOf(ultima) !== -1) {
      // Continuación del campo anterior: párrafo partido en varias líneas.
      const lista = campos.get(ultima);
      lista[lista.length - 1] = (lista[lista.length - 1] + ' ' + l).trim();
      return;
    }

    sueltas.push(l);
  });

  if (sueltas.length) {
    avisos.push(
      'No sé dónde poner ' + (sueltas.length === 1 ? 'esta línea' : 'estas líneas') +
        ': «' + sueltas.slice(0, 2).join('», «') + '»' +
        (sueltas.length > 2 ? ' y ' + (sueltas.length - 2) + ' más' : '') +
        '. Los campos de este módulo son: ' + permitidas.join(', ') + '.'
    );
  }

  return { campos, avisos };
}

/** Primer valor de un campo, o '' si no está. */
function campo(campos, clave) {
  const v = campos.get(clave);
  return v && v.length ? v[0] : '';
}

/**
 * Parte «Texto -> url» en { texto, url }. Acepta ->, → y |.
 * Sin separador, todo es texto y la url queda vacía.
 */
function enlace(bruto) {
  const m = String(bruto).match(/^([\s\S]*?)\s*(?:->|\u2192|\|)\s*(\S+)$/);
  if (!m) return { texto: String(bruto).trim(), url: '' };
  return { texto: m[1].trim(), url: m[2].trim() };
}

/* ---------- módulos ---------- */

const MODULOS = [
  {
    id: 'tabla-responsive',
    nombre: 'Tabla',
    clase: '.tabla-responsive',
    grupo: 'Datos',
    descripcion:
      'Tabla de datos dentro de un artículo. En móvil cada fila se convierte en una tarjeta, con la primera columna como título.',
    estado: { texto: 'HTML y CSS originales', tono: 'ok' },
    reglas: [
      'El primer <td> no lleva data-label: hace de título de la tarjeta en móvil.',
      'El resto de <td> llevan data-label con el texto exacto de su <th>.',
      'La primera columna va siempre en <strong>.',
      'El salto a tarjetas ocurre a 680 px. Entre 680 px y el ancho natural de la tabla hay scroll horizontal.',
      'Los <th> necesitan texto real: en móvil se ocultan a la vista pero los lectores de pantalla los leen.',
      'Más de 4 columnas hace la tarjeta móvil muy larga.',
    ],
    entrada: {
      etiqueta: 'Pega tu tabla',
      ayuda:
        'Vale copiada de Excel, de Word, de Google Docs, en Markdown o separada por | , ; o tabulador. La primera fila son los títulos de columna. Usa **texto** para poner algo en negrita y [texto](url) para un enlace.',
      filas: 12,
    },

    demo: [
      'Fecha | Hito | Estado',
      '31 dic 2026, 17:00 | Apertura solemne de la Puerta Santa | **Confirmado**',
      'Todo 2027 | Año Santo Jacobeo en vigor | **Confirmado**',
      '21–28 mar 2027 (aprox.) | Semana Santa | Fechas confirmadas; programa pendiente',
      '15–25 jul 2027 | Ventana religiosa crítica: novena, vísperas y solemnidad | Pendiente de programa detallado',
      '25 jul 2027 | Día del Apóstol Santiago, en domingo | **Confirmado**',
      '31 dic 2027 | Posible clausura del Año Santo | Pendiente de confirmación',
    ].join('\n'),

    ejemplo: [
      'Ruta | Etapas | Distancia | Dificultad',
      'Camino Francés desde Sarria | 5 | **115 km** | Media',
      'Camino Portugués desde Tui | 6 | **120 km** | Baja',
      'Camino Primitivo desde Lugo | 5 | **101 km** | Alta',
    ].join('\n'),

    render(bruto) {
      const { cabeceras, filas, avisos } = leerTabla(bruto);

      if (cabeceras.length > 4) {
        avisos.push(
          `${cabeceras.length} columnas: en móvil cada tarjeta tendrá ${cabeceras.length - 1} ` +
            'campos apilados y quedará larga. Valora fusionar columnas.'
        );
      }

      const out = [];
      out.push('<div class="tabla-responsive-wrap">');
      out.push('<table class="tabla-responsive">');
      out.push('<thead>');
      out.push('<tr>');
      cabeceras.forEach((c) => out.push(`<th>${linea(sinNegrita(c))}</th>`));
      out.push('</tr>');
      out.push('</thead>');
      out.push('<tbody>');
      filas.forEach((fila) => {
        out.push('<tr>');
        fila.forEach((celda, i) => {
          if (i === 0) {
            // Título de la tarjeta: sin data-label y siempre en negrita.
            out.push(`<td><strong>${linea(sinNegrita(celda))}</strong></td>`);
          } else {
            out.push(`<td data-label="${esc(sinNegrita(cabeceras[i]))}">${linea(celda)}</td>`);
          }
        });
        out.push('</tr>');
      });
      out.push('</tbody>');
      out.push('</table>');
      out.push('</div>');

      return { html: out.join('\n'), avisos };
    },
  },

  {
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
      filas: 9,
    },

    demo: [
      'imagen: https://santiagoways.com/wp-content/uploads/2019/10/feature-singles.webp',
      'alt: Peregrinos caminando por una etapa del Camino de Santiago',
      'etiqueta: \u2714 Actualizado 2026',
      'titulo: Todo lo que necesitas saber para organizar tu Camino paso a paso',
      'boton: Ver rutas principales \u2192 -> /?page_id=11888',
    ].join('\n'),

    ejemplo: [
      'imagen: https://santiagoways.com/wp-content/uploads/2019/10/feature-singles.webp',
      'alt: Peregrina cruzando un puente de piedra al amanecer',
      'etiqueta: \u2714 Año Santo 2027',
      'titulo: El Camino Francés desde Sarria, etapa a etapa',
      'boton: Ver la ruta \u2192 -> /camino-frances-desde-sarria',
      'boton: Pedir presupuesto \u2192 -> /contacto',
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
      const botones = (campos.get('boton') || []).filter((b) => b.trim());

      if (!imagen) throw new Error('Falta la imagen. Escribe una línea «imagen: https://…».');
      if (!titulo) throw new Error('Falta el titular. Escribe una línea «titulo: …».');

      // Nivel del encabezado: h1 solo si se pide a mano.
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
      if (etiqueta) {
        out.push('<div class="heroblogsw__badge">' + linea(etiqueta) + '</div>');
      }
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
  },

  /* ============================================================
     PLANTILLA para los módulos que faltan.
     Descomenta, rellena y añádelo al array. El orden del array es
     el orden del selector.

  {
    id: 'cta-box',
    nombre: 'Caja comercial',
    clase: '.cta-box',
    grupo: 'Conversión',
    descripcion: 'Titular, texto y un botón.',
    estado: { texto: 'Pendiente del HTML de referencia', tono: 'pendiente' },
    reglas: ['...'],
    entrada: { etiqueta: '...', ayuda: '...', filas: 6 },
    demo: '...',        // contenido con el que se ve el módulo de referencia
    ejemplo: '...',     // contenido de arranque del panel editable
    render(bruto) {
      // Devuelve { html: '<div class="cta-box">...</div>', avisos: [] }
      // o lanza un Error con el motivo si el contenido no sirve.
    },
  },

     ============================================================ */
];

/* Bloques que ya tienen CSS pero todavía no tienen módulo.
   Se listan en el selector en gris para saber qué queda. */
const PENDIENTES = [
  { id: 'cta-box', nombre: 'Caja comercial', grupo: 'Conversión' },
  { id: 'guides', nombre: 'Guías descargables', grupo: 'Conversión' },
  { id: 'gr-planner', nombre: 'Promo planificador', grupo: 'Conversión' },
  { id: 'quote', nombre: 'Cita destacada', grupo: 'Texto' },
  { id: 'note', nombre: 'Nota al margen', grupo: 'Texto' },
  { id: 'steps', nombre: 'Pasos numerados', grupo: 'Listas' },
  { id: 'tips', nombre: 'Consejos', grupo: 'Listas' },
  { id: 'checklist', nombre: 'Listas de comprobación', grupo: 'Listas' },
  { id: 'mistakes', nombre: 'Errores frecuentes', grupo: 'Listas' },
  { id: 'cards', nombre: 'Tarjetas con icono', grupo: 'Rejillas' },
  { id: 'features', nombre: 'Características', grupo: 'Rejillas' },
  { id: 'arrival', nombre: 'Llegada', grupo: 'Rejillas' },
  { id: 'gear', nombre: 'Equipamiento', grupo: 'Rejillas' },
  { id: 'prep', nombre: 'Preparación física', grupo: 'Rejillas' },
  { id: 'roads', nombre: 'Tarjetas de rutas', grupo: 'Rutas' },
  { id: 'roadmap', nombre: 'Recorrido de etapas', grupo: 'Rutas' },
  { id: 'durations', nombre: 'Comparativa con barras', grupo: 'Rutas' },
  { id: 'gr-ficha', nombre: 'Ficha de datos', grupo: 'Rutas' },
  { id: 'stats', nombre: 'Cifras', grupo: 'Datos' },
  { id: 'timeline', nombre: 'Línea de tiempo', grupo: 'Datos' },
  { id: 'finder', nombre: 'Selector de preguntas', grupo: 'Datos' },
  { id: 'safety', nombre: 'Seguridad', grupo: 'Datos' },
];
