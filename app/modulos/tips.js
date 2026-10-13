import { linea, leerFichas, campo, dosDigitos } from './_comun.js';

export default {
  id: 'tips',
  nombre: 'Consejos',
  clase: '.tips',
  grupo: 'Listas',
  descripcion:
    'Consejos numerados separados por filetes. A tres columnas a partir de 768 px, en una sola columna por debajo.',
  estado: { texto: 'HTML y CSS originales', tono: 'ok' },
  reglas: [
    'Dentro de cada .tips__item el segundo hijo es un <div> SIN clase que envuelve el título y el texto. Misma estructura que .prep__item.',
    'Los números (01, 02…) se generan solos según el orden: no se escriben.',
    'A tres columnas el orden de lectura es por columnas, no por filas: con un número de consejos que no sea múltiplo de 3 la última columna queda corta.',
    'El título es un <strong>, no un encabezado.',
  ],
  entrada: {
    etiqueta: 'Una ficha por consejo',
    ayuda: 'Cada consejo empieza por «titulo:» y lleva su «texto:». Usa **texto** para negrita.',
    filas: 12,
  },

  demo: [
    'titulo: Empieza con margen',
    'texto: Diseña etapas razonables, especialmente al principio. **Lo importante no es lo que puedes caminar hoy, sino cómo llegarás a mañana.**',
    'titulo: Camina a tu ritmo',
    'texto: Encontrarás peregrinos más rápidos y etapas más largas. **Tu ritmo correcto es el que puedes mantener cómodamente durante varios días.**',
    'titulo: Cuida tus pies desde el principio',
    'texto: Atiende los primeros roces y molestias antes de que condicionen las siguientes etapas. **El Camino no es el lugar para estrenar calzado.**',
    'titulo: Escucha las molestias',
    'texto: El cansancio es esperable; un dolor que aumenta o modifica tu forma de caminar merece atención. **Parar a tiempo puede salvar las siguientes etapas.**',
    'titulo: Come y bebe con regularidad',
    'texto: No esperes a tener mucha sed o estar agotado. Lleva agua y **comprueba antes de salir dónde podrás reponerla o encontrar comida**.',
    'titulo: Consulta el tiempo cada día',
    'texto: Convierte la previsión de la siguiente etapa en una rutina. **Calor, lluvia o viento pueden cambiar la hora de salida y cómo planteas la jornada.**',
    'titulo: Desconfía de los «por si acaso»',
    'texto: Cada objeto innecesario viajará contigo durante kilómetros. **Lleva lo que realmente vas a utilizar.**',
    'titulo: Decide qué quieres improvisar',
    'texto: No todo tiene que estar reservado, pero tampoco todo tiene que quedar abierto. **Deja resuelto aquello que para ti sea importante.**',
    'titulo: Deja espacio para parar',
    'texto: No conviertas cada etapa en una carrera hacia el siguiente alojamiento. **Parte del Camino ocurre precisamente entre el inicio y el final.**',
    'titulo: No busques un Camino perfecto',
    'texto: Habrá lluvia, cansancio o cambios de planes. **Saber adaptarte también forma parte de la experiencia.**',
  ].join('\n'),

  ejemplo: [
    'titulo: Empieza con margen',
    'texto: Diseña etapas razonables, especialmente al principio. **Lo importante no es lo que puedes caminar hoy, sino cómo llegarás a mañana.**',
    'titulo: Camina a tu ritmo',
    'texto: Encontrarás peregrinos más rápidos y etapas más largas.',
    'titulo: Cuida tus pies desde el principio',
    'texto: **El Camino no es el lugar para estrenar calzado.**',
  ].join('\n'),

  render(bruto) {
    const { grupos, avisos } = leerFichas(bruto, {
      claveFicha: 'titulo',
      ficha: ['texto'],
      multilinea: ['texto', 'titulo'],
    });

    const consejos = grupos[0] ? grupos[0].fichas : [];
    if (!consejos.length) {
      throw new Error('No hay ningún consejo. Cada uno empieza por una línea «titulo: …».');
    }
    if (consejos.length % 3 !== 0) {
      const huecos = 3 - (consejos.length % 3);
      avisos.push(
        consejos.length + ' consejos: a tres columnas la última queda ' +
          (huecos === 1 ? 'un hueco' : huecos + ' huecos') +
          ' más corta. Un múltiplo de 3 cuadra mejor.'
      );
    }

    const out = [];
    out.push('<div class="tips">');

    consejos.forEach((f, i) => {
      const titulo = campo(f, 'titulo');
      const texto = campo(f, 'texto');
      if (!texto) avisos.push('El consejo «' + titulo + '» no tiene texto.');

      out.push('<div class="tips__item">');
      out.push('<div class="tips__number">' + dosDigitos(i + 1) + '</div>');
      out.push('<div>');
      out.push('<strong class="tips__item-title">' + linea(titulo) + '</strong>');
      if (texto) out.push('<p class="tips__text">' + linea(texto) + '</p>');
      out.push('</div>');
      out.push('</div>');
    });

    out.push('</div>');

    return { html: out.join('\n'), avisos };
  },
};
