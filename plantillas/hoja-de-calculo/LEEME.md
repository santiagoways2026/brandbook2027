# Plantilla de hoja de cálculo

Hoja de cálculo con el estilo de la marca. Se abre en Excel y en Hojas de cálculo de Google.

| Archivo | Para qué |
|---|---|
| `Hoja_Santiago_Ways.xlsx` | La plantilla, con 6 pestañas de ejemplo. |
| `vista-previa/` | Las pestañas renderizadas. |
| `generador/hoja.py` | Script con el que se genera (openpyxl). |

## Pestañas

| Pestaña | Contenido |
|---|---|
| Portada | Logo, título, datos del archivo y cómo usar la plantilla. |
| Datos | Tabla de reservas por ruta con ingresos, porcentajes y total calculados. Con filtros y paneles fijos. |
| Presupuesto | Datos del cliente, conceptos, subtotal, descuento y total. |
| Plan | Cronograma de 12 meses: al escribir el mes de inicio y de fin, la barra se pinta sola (en verde sendero si es un hito). |
| Resumen | Cifras clave y gráfico de ingresos por ruta, calculados desde Datos. |
| Colores | La paleta de la marca y su uso. |

## Uso

- **Celdas en verde claro (brote):** son las que se rellenan. El resto son fórmulas.
- **Fuente:** Montserrat. En Google ya está incluida; en Excel hay que instalarla desde [Google Fonts](https://fonts.google.com/specimen/Montserrat).
- **Google:** sube el `.xlsx` a Drive y ábrelo con Hojas de cálculo de Google.
- **Datos de ejemplo:** las cifras son inventadas; sustitúyelas por las reales.
- **Con IA:** ver `../GUIA-IA-presentacion-y-hoja.md`.
