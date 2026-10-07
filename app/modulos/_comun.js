/* ============================================================
   Utilidades compartidas por todos los módulos.
   ============================================================ */

/** Escapa el texto para que entre seguro en el HTML. */
export function esc(texto) {
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
export function linea(texto) {
  return esc(texto)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Quita los ** de un texto: para campos que ya van siempre en negrita. */
export function sinNegrita(texto) {
  return String(texto).replace(/\*\*/g, '');
}

/** Normaliza un nombre de campo: minúsculas y sin tildes. */
export function normalizar(clave) {
  return String(clave)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** 1 -> «01». Para los numeradores de finder, tips, prep y mistakes. */
export function dosDigitos(n) {
  return String(n).padStart(2, '0');
}

/**
 * Parte «Texto -> url» en { texto, url }. Acepta ->, → y |.
 * Sin separador, todo es texto y la url queda vacía.
 */
export function enlace(bruto) {
  const m = String(bruto).match(/^([\s\S]*?)\s*(?:->|→|\|)\s*(\S+)$/);
  if (!m) return { texto: String(bruto).trim(), url: '' };
  return { texto: m[1].trim(), url: m[2].trim() };
}

/** Primer valor de un campo, o '' si no está. */
export function campo(mapa, clave) {
  const v = mapa.get(clave);
  return v && v.length ? v[0] : '';
}

/** Todos los valores de un campo, sin vacíos. */
export function lista(mapa, clave) {
  return (mapa.get(clave) || []).filter((v) => String(v).trim());
}

function meter(mapa, clave, valor) {
  if (!mapa.has(clave)) mapa.set(clave, []);
  mapa.get(clave).push(valor);
}

/* ------------------------------------------------------------
   Lector de tablas
   ------------------------------------------------------------ */

/**
 * Lee una tabla pegada desde Excel, Word, Markdown o CSV.
 * Devuelve { cabeceras, filas, avisos } o lanza un Error con el motivo.
 */
export function leerTabla(bruto) {
  const lineas = String(bruto)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    // Fila separadora de Markdown: |---|:--:|---|
    .filter((l) => !/^\|?[\s:|-]+\|?$/.test(l) || !/-/.test(l));

  if (lineas.length === 0) throw new Error('No hay contenido que convertir.');

  const cabecera = lineas[0];
  let separador;
  if (cabecera.includes('|')) separador = '|';
  else if (cabecera.includes('\t')) separador = '\t';
  else if (cabecera.includes(';')) separador = ';';
  else if (cabecera.includes(',')) separador = ',';
  else throw new Error('No encuentro columnas. Separa con | , ; o tabulador.');

  const partir = (l) => {
    const celdas = l.split(separador).map((c) => c.trim());
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

  // Normaliza el ancho de cada fila avisando de los ajustes: una fila
  // descuadrada casi siempre es un separador dentro de una celda, y en
  // silencio se perdería el dato.
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

/* ------------------------------------------------------------
   Lector de campos «clave: valor»
   ------------------------------------------------------------ */

/**
 * Lee un bloque plano de campos «clave: valor», uno por línea.
 *
 * Solo se abre campo nuevo si la clave está en `permitidas`; así una URL con
 * «https:» dentro no se confunde con una clave.
 *
 * Una línea que no abre campo se pega a la anterior SOLO si ese campo está en
 * `multilinea`, que son los de texto corrido. Pegarla a una URL rompería el
 * dato en silencio, así que ahí se avisa en vez de adivinar.
 */
export function leerCampos(bruto, permitidas, multilinea) {
  const r = leerFichas(bruto, {
    cabecera: permitidas,
    claveFicha: null,
    multilinea: multilinea || [],
  });
  return { campos: r.cabecera, avisos: r.avisos };
}

/**
 * Lector general. Entiende tres niveles:
 *
 *   cabecera   campos sueltos del bloque entero
 *   grupo      se abre cada vez que aparece `claveGrupo`
 *   ficha      se abre cada vez que aparece `claveFicha`
 *
 * Si no hay `claveGrupo`, todo cae en un grupo implícito. Si tampoco hay
 * `claveFicha`, solo se usa la cabecera.
 *
 * Devuelve { cabecera: Map, grupos: [{ campos: Map, fichas: [Map] }], avisos }.
 */
export function leerFichas(bruto, opciones) {
  const cabeceraClaves = opciones.cabecera || [];
  const grupoClaves = opciones.grupo || [];
  const fichaClaves = opciones.ficha || [];
  const claveGrupo = opciones.claveGrupo || null;
  const claveFicha = opciones.claveFicha || null;
  const multilinea = opciones.multilinea || [];

  const conocidas = []
    .concat(cabeceraClaves, grupoClaves, fichaClaves)
    .concat(claveGrupo ? [claveGrupo] : [])
    .concat(claveFicha ? [claveFicha] : []);

  const cabecera = new Map();
  const grupos = [];
  const avisos = [];
  const sueltas = [];

  let grupoActual = null;
  let fichaActual = null;
  let mapaActual = cabecera;
  let claveActual = null;

  const nuevoGrupo = () => {
    grupoActual = { campos: new Map(), fichas: [] };
    grupos.push(grupoActual);
    fichaActual = null;
    return grupoActual;
  };

  if (!claveGrupo) nuevoGrupo();

  String(bruto).split(/\r?\n/).forEach((cruda) => {
    const l = cruda.trim();
    if (!l) return;

    const corte = l.indexOf(':');
    const clave = corte > 0 ? normalizar(l.slice(0, corte)) : null;
    const valor = corte > 0 ? l.slice(corte + 1).trim() : '';

    if (clave && conocidas.indexOf(clave) !== -1) {
      if (claveGrupo && clave === claveGrupo) {
        nuevoGrupo();
        mapaActual = grupoActual.campos;
      } else if (claveFicha && clave === claveFicha) {
        if (!grupoActual) nuevoGrupo();
        fichaActual = new Map();
        grupoActual.fichas.push(fichaActual);
        mapaActual = fichaActual;
      } else if (fichaActual && fichaClaves.indexOf(clave) !== -1) {
        mapaActual = fichaActual;
      } else if (grupoActual && grupoClaves.indexOf(clave) !== -1) {
        mapaActual = grupoActual.campos;
      } else if (cabeceraClaves.indexOf(clave) !== -1) {
        mapaActual = cabecera;
      } else {
        // Clave conocida pero fuera de sitio: p. ej. un campo de ficha antes
        // de abrir ninguna ficha.
        sueltas.push(l);
        return;
      }
      meter(mapaActual, clave, valor);
      claveActual = clave;
      return;
    }

    if (claveActual && multilinea.indexOf(claveActual) !== -1) {
      const acumulado = mapaActual.get(claveActual);
      acumulado[acumulado.length - 1] = (acumulado[acumulado.length - 1] + ' ' + l).trim();
      return;
    }

    sueltas.push(l);
  });

  if (sueltas.length) {
    avisos.push(
      'No sé dónde poner ' + (sueltas.length === 1 ? 'esta línea' : 'estas líneas') +
        ': «' + sueltas.slice(0, 2).join('», «') + '»' +
        (sueltas.length > 2 ? ' y ' + (sueltas.length - 2) + ' más' : '') +
        '. Los campos de este módulo son: ' + conocidas.join(', ') + '.'
    );
  }

  return { cabecera, grupos, avisos };
}

/* ------------------------------------------------------------
   Imágenes
   ------------------------------------------------------------ */

/**
 * Construye el atributo de tamaño a partir de «800x560».
 * Devuelve ' width="800" height="560"' o '' si no se indica.
 */
export function tamano(bruto) {
  if (!bruto) return '';
  const m = String(bruto).match(/^\s*(\d+)\s*[x×]\s*(\d+)\s*$/);
  if (!m) return '';
  return ' width="' + m[1] + '" height="' + m[2] + '"';
}

/** Avisa si una ficha con imagen no trae texto alternativo. */
export function avisarAlt(avisos, alt, dondeDescripcion) {
  if (!String(alt).trim()) {
    avisos.push(
      'La imagen de ' + dondeDescripcion + ' va sin texto alternativo. ' +
        'Añade una línea «alt: …» describiendo lo que se ve.'
    );
  }
}
