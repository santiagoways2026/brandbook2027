/* ============================================================
   Lógica de la herramienta.
   Los módulos se declaran en modulos/; aquí solo se pintan.
   ============================================================ */

import { MODULOS, PENDIENTES } from './modulos/index.js';

/* La raíz del proyecto, calculada desde la propia página: app/ cuelga un nivel
   por debajo. Con rutas absolutas desde el dominio («/design-system/…») esto
   solo funcionaría en local: en GitHub Pages el sitio no está en la raíz del
   dominio sino en /<repositorio>/, y todo daría 404. */
const RAIZ = new URL('../', document.baseURI).href;

/* Hojas que se cargan DENTRO de cada iframe de vista previa.
   La herramienta necesita servirse por HTTP (python tools/servidor.py),
   no abrirse con doble clic. */
const HOJAS = [
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
  RAIZ + 'design-system/tokens.css',
  RAIZ + 'design-system/bloques.css',
  RAIZ + 'design-system/tabla-responsive.css',
];

/* Anchura de pantalla que simula cada vista. 1120 cae por encima de todos
   los puntos de ruptura del sistema; 390 es un móvil normal. */
const ANCHURAS = { escritorio: 1120, movil: 390 };

const $ = (sel) => document.querySelector(sel);

const el = {
  busqueda: $('#busqueda'),
  lista: $('#lista'),
  titulo: $('#titulo'),
  clase: $('#clase'),
  insignia: $('#insignia'),
  descripcion: $('#descripcion'),
  reglas: $('#reglas'),
  marcoRef: $('#marco-referencia'),
  marcoNuevo: $('#marco-nuevo'),
  vistaRef: $('#vista-referencia'),
  vistaNuevo: $('#vista-nuevo'),
  etiqueta: $('#etiqueta-datos'),
  datos: $('#datos'),
  ayuda: $('#ayuda'),
  codigo: $('#codigo'),
  avisos: $('#avisos'),
  copiar: $('#copiar'),
  restaurar: $('#restaurar'),
  vaciar: $('#vaciar'),
  anchoSimulado: $('#ancho-simulado'),
};

let actual = null;
let anchura = 'escritorio';

/* Para poder comprobar cosas desde la consola del navegador. */
window.MODULOS = MODULOS;

/* ---------- vista previa aislada ---------- */

/** Construye el documento completo que vive dentro del iframe. */
function documento(html) {
  const enlaces = HOJAS.map((h) => `<link rel="stylesheet" href="${h}">`).join('\n');
  return [
    '<!doctype html>',
    '<html lang="es"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    enlaces,
    '<style>',
    'html,body{margin:0;background:#fff;}',
    'body{padding:20px;font-family:var(--sw-fuente,Montserrat,Arial,sans-serif);',
    'font-size:16px;line-height:1.5;color:#2E2E2D;}',
    'body > :first-child{margin-top:0;}',
    'body > :last-child{margin-bottom:0;}',
    '</style>',
    '</head><body>',
    html,
    '</body></html>',
  ].join('\n');
}

/**
 * Ajusta un iframe: le da la anchura simulada, lo escala para que quepa en su
 * panel y recorta el lienzo a la altura real del contenido.
 *
 * El iframe NO se estira al ancho del panel: así los media queries del bloque
 * reaccionan a la anchura de pantalla que estamos simulando y no a lo ancho que
 * resulte ser el panel de la herramienta.
 */
function ajustar(marco) {
  const lienzo = marco.parentElement;
  const vista = lienzo.parentElement;
  const disponible = vista.clientWidth - 28; // menos el padding de .vista
  const ancho = ANCHURAS[anchura];
  const escala = Math.min(1, disponible / ancho);

  marco.style.width = ancho + 'px';
  marco.style.transform = 'scale(' + escala + ')';

  // scrollHeight nunca baja de la altura del propio iframe, así que hay que
  // encogerlo antes de medir: si no, el marco se queda con la altura del
  // contenido anterior cuando el nuevo es más corto.
  marco.style.height = '0px';

  let alto = 420;
  try {
    alto = marco.contentDocument.documentElement.scrollHeight;
  } catch (e) { /* aún cargando */ }

  marco.style.height = alto + 'px';
  lienzo.style.width = Math.round(ancho * escala) + 'px';
  lienzo.style.height = Math.round(alto * escala) + 'px';
}

/** Pinta el HTML en un iframe y lo ajusta cuando termina de cargar. */
function pintar(marco, html) {
  marco.srcdoc = documento(html);
  marco.onload = function () {
    ajustar(marco);
    // Las fuentes y las fotos cambian la altura al terminar de cargar.
    const doc = marco.contentDocument;
    if (doc && doc.fonts) doc.fonts.ready.then(() => ajustar(marco));
    if (doc) {
      doc.querySelectorAll('img').forEach((img) => {
        if (!img.complete) img.addEventListener('load', () => ajustar(marco), { once: true });
      });
    }
  };
}

function ajustarTodo() {
  el.anchoSimulado.textContent = ANCHURAS[anchura] + ' px';
  [el.marcoRef, el.marcoNuevo].forEach(ajustar);
}

/* ---------- avisos ---------- */

function limpiarAvisos() {
  el.avisos.innerHTML = '';
}

function avisar(texto, tipo) {
  const div = document.createElement('div');
  div.className = 'aviso aviso--' + (tipo || 'atencion');
  div.textContent = texto;
  el.avisos.appendChild(div);
}

/* ---------- selector ---------- */

function pintarLista() {
  const filtro = el.busqueda.value.trim().toLowerCase();
  const coincide = (m) =>
    !filtro ||
    m.nombre.toLowerCase().includes(filtro) ||
    m.id.toLowerCase().includes(filtro) ||
    (m.grupo || '').toLowerCase().includes(filtro);

  const listos = MODULOS.filter(coincide).map((m) => ({ ...m, listo: true }));
  const faltan = PENDIENTES.filter(coincide).map((m) => ({ ...m, listo: false }));
  const todos = listos.concat(faltan);

  el.lista.innerHTML = '';

  if (todos.length === 0) {
    const p = document.createElement('p');
    p.className = 'lista__nota';
    p.textContent = 'Ningún módulo coincide con «' + el.busqueda.value.trim() + '».';
    el.lista.appendChild(p);
    return;
  }

  const grupos = [];
  todos.forEach((m) => {
    const g = m.grupo || 'Otros';
    let bloque = grupos.find((x) => x.nombre === g);
    if (!bloque) {
      bloque = { nombre: g, items: [] };
      grupos.push(bloque);
    }
    bloque.items.push(m);
  });

  grupos.forEach((grupo) => {
    const titulo = document.createElement('p');
    titulo.className = 'lista__grupo';
    titulo.textContent = grupo.nombre;
    el.lista.appendChild(titulo);

    grupo.items.forEach((m) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'modulo';
      boton.innerHTML = '<span class="modulo__punto"></span><span class="modulo__nombre"></span>';
      boton.querySelector('.modulo__nombre').textContent = m.nombre;

      if (m.listo) {
        boton.setAttribute('aria-current', String(actual && actual.id === m.id));
        boton.addEventListener('click', () => seleccionar(m.id));
      } else {
        boton.disabled = true;
        boton.title = 'Pendiente del HTML de referencia';
      }
      el.lista.appendChild(boton);
    });
  });

  const nota = document.createElement('p');
  nota.className = 'lista__nota';
  nota.textContent =
    MODULOS.length + ' de ' + (MODULOS.length + PENDIENTES.length) +
    ' módulos listos. Los grises esperan su HTML de referencia.';
  el.lista.appendChild(nota);
}

/* ---------- módulo activo ---------- */

/**
 * Trae el HTML de referencia del bloque: el markup real del cliente, no lo que
 * genera el módulo. Así el panel de la izquierda enseña la verdad y comparar
 * los dos paneles basta para ver si el render se ha desviado.
 */
async function referencia(id) {
  const r = await fetch(RAIZ + 'bloques/' + id + '.html');
  if (!r.ok) throw new Error('No encuentro bloques/' + id + '.html');
  return (await r.text()).replace(/<!--[\s\S]*?-->/g, '').trim();
}

async function seleccionar(id) {
  const modulo = MODULOS.find((m) => m.id === id);
  if (!modulo) return;
  actual = modulo;

  el.titulo.textContent = modulo.nombre;
  el.clase.textContent = modulo.clase;
  el.descripcion.textContent = modulo.descripcion;

  el.insignia.textContent = modulo.estado.texto;
  el.insignia.className = 'insignia insignia--' + modulo.estado.tono;

  el.reglas.innerHTML = '';
  (modulo.reglas || []).forEach((r) => {
    const li = document.createElement('li');
    li.textContent = r;
    el.reglas.appendChild(li);
  });
  el.reglas.classList.toggle('oculto', !(modulo.reglas || []).length);

  el.etiqueta.textContent = modulo.entrada.etiqueta;
  el.ayuda.textContent = modulo.entrada.ayuda;
  el.datos.rows = modulo.entrada.filas || 10;
  el.datos.value = modulo.ejemplo || '';

  generar();
  pintarLista();
  history.replaceState(null, '', '#' + modulo.id);

  // El panel de referencia enseña el HTML original del cliente.
  try {
    pintar(el.marcoRef, await referencia(modulo.id));
  } catch (e) {
    pintar(el.marcoRef, '<p style="font:14px/1.5 Arial;color:#8A2A1F">' + e.message + '</p>');
  }
}

/* ---------- generación ---------- */

function generar() {
  if (!actual) return;
  limpiarAvisos();

  const bruto = el.datos.value;

  if (!bruto.trim()) {
    el.codigo.textContent = '';
    pintar(el.marcoNuevo, '');
    avisar('Escribe o pega contenido para ver el resultado.', 'atencion');
    return;
  }

  let resultado;
  try {
    resultado = actual.render(bruto);
  } catch (e) {
    el.codigo.textContent = '';
    pintar(el.marcoNuevo, '');
    avisar(e.message, 'error');
    return;
  }

  el.codigo.textContent = resultado.html;
  pintar(el.marcoNuevo, resultado.html);
  (resultado.avisos || []).forEach((a) => avisar(a, 'atencion'));
}

/* ---------- anchura de las vistas ---------- */

function aplicarAnchura() {
  [el.vistaRef, el.vistaNuevo].forEach((v) => {
    v.classList.toggle('vista--movil', anchura === 'movil');
  });
  ajustarTodo();
}

document.querySelectorAll('[data-anchura]').forEach((boton) => {
  boton.addEventListener('click', () => {
    anchura = boton.dataset.anchura;
    document.querySelectorAll('[data-anchura]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.anchura === anchura));
    });
    aplicarAnchura();
  });
});

/* ---------- acciones ---------- */

let temporizador;
el.datos.addEventListener('input', () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(generar, 250);
});

el.busqueda.addEventListener('input', pintarLista);

el.restaurar.addEventListener('click', () => {
  if (!actual) return;
  el.datos.value = actual.ejemplo || '';
  generar();
});

el.vaciar.addEventListener('click', () => {
  el.datos.value = '';
  el.datos.focus();
  generar();
});

el.copiar.addEventListener('click', () => {
  const texto = el.codigo.textContent;
  if (!texto) return;
  navigator.clipboard.writeText(texto).then(
    () => {
      const antes = el.copiar.textContent;
      el.copiar.textContent = 'Copiado';
      setTimeout(() => { el.copiar.textContent = antes; }, 1400);
    },
    () => avisar('El navegador no ha dejado copiar. Selecciona el código a mano.', 'error')
  );
});

let reajuste;
window.addEventListener('resize', () => {
  clearTimeout(reajuste);
  reajuste = setTimeout(ajustarTodo, 120);
});

/* ---------- arranque ---------- */

const inicial = location.hash.replace('#', '');
el.anchoSimulado.textContent = ANCHURAS[anchura] + ' px';
pintarLista();
seleccionar(MODULOS.some((m) => m.id === inicial) ? inicial : MODULOS[0].id);
