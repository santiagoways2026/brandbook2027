/* ============================================================
   Registro de módulos.

   Para añadir uno: crea su archivo en esta carpeta, impórtalo aquí
   y mételo en MODULOS. Luego quítalo de PENDIENTES, si estaba.
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
import grFicha from './gr-ficha.js';
import timeline from './timeline.js';
import cards from './cards.js';
import grPlanner from './gr-planner.js';
import stats from './stats.js';
import guides from './guides.js';
import features from './features.js';
import checklist from './checklist.js';

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
  grFicha,
  timeline,
  cards,
  grPlanner,
  stats,
  guides,
  features,
  checklist,
];

/* Bloques que tienen CSS pero todavía no tienen módulo.
   Se listan en el selector en gris para saber qué queda. */
export const PENDIENTES = [
  { id: 'roadmap', nombre: 'Recorrido de etapas', grupo: 'Rutas' },
];
