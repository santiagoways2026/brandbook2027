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
  { id: 'heroblogsw', nombre: 'Hero de artículo', grupo: 'Cabeceras' },
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
