/* ============================================================
   Registro de módulos.

   Para añadir uno: crea su archivo en esta carpeta, impórtalo aquí
   y mételo en MODULOS. Luego quítalo de PENDIENTES.
   El orden de MODULOS no importa: el selector agrupa por `grupo`.
   ============================================================ */

import tablaResponsive from './tabla-responsive.js';
import heroblogsw from './heroblogsw.js';
import roads from './roads.js';
import finder from './finder.js';
import durations from './durations.js';
import prep from './prep.js';
import gear from './gear.js';
import ctaBox from './cta-box.js';
import steps from './steps.js';
import note from './note.js';
import quote from './quote.js';
import tips from './tips.js';
import safety from './safety.js';
import mistakes from './mistakes.js';
import arrival from './arrival.js';

export const MODULOS = [
  tablaResponsive,
  heroblogsw,
  roads,
  finder,
  durations,
  prep,
  gear,
  ctaBox,
  steps,
  note,
  quote,
  tips,
  safety,
  mistakes,
  arrival,
];

/* Bloques que ya tienen CSS pero todavía no tienen módulo.
   Se listan en el selector en gris para saber qué queda. */
export const PENDIENTES = [
  { id: 'guides', nombre: 'Guías descargables', grupo: 'Conversión' },
  { id: 'gr-planner', nombre: 'Promo planificador', grupo: 'Conversión' },
  { id: 'checklist', nombre: 'Listas de comprobación', grupo: 'Listas' },
  { id: 'cards', nombre: 'Tarjetas con icono', grupo: 'Rejillas' },
  { id: 'features', nombre: 'Características', grupo: 'Rejillas' },
  { id: 'roadmap', nombre: 'Recorrido de etapas', grupo: 'Rutas' },
  { id: 'gr-ficha', nombre: 'Ficha de datos', grupo: 'Rutas' },
  { id: 'stats', nombre: 'Cifras', grupo: 'Datos' },
  { id: 'timeline', nombre: 'Línea de tiempo', grupo: 'Datos' },
];
