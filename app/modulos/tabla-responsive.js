import { esc, linea, sinNegrita, leerTabla } from './_comun.js';

export default {
  id: 'tabla-responsive',
  nombre: 'Tabla',
  clase: '.tabla-responsive',
  grupo: 'Datos',
  descripcion:
    'Tabla de datos dentro de un artículo. Por debajo de 680 px cada fila se convierte en una tarjeta, con la primera columna como título.',
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
      'Vale copiada de Excel, de Word, de Google Docs, en Markdown o separada por | , ; o tabulador. La primera fila son los títulos de columna. Usa **texto** para negrita y [texto](url) para un enlace.',
    filas: 10,
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
};
