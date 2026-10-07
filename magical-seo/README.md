# Magical SEO

Sala de vigilancia del contenido que publican los operadores rivales del Camino de Santiago: artículos de blog, páginas de ruta, señales de posicionamiento y los huecos que dejan abiertos.

- **Interfaz en vivo:** https://claude.ai/artifact/WPM9g6A1ZtkynZMCob2QZ2 (fuente: `index.html`)
- **Datos:** base de datos compartida del artifact, colecciones `rivales`, `publicaciones`, `huecos` y el documento `estado/magicalseo`

## Qué hay aquí

| Archivo | Contenido |
|---|---|
| `index.html` | La sala. Publicaciones detectadas, fichas de rivales, huecos abiertos y bitácora. |
| `agentes/barrida-rivales/AGENTE.md` | Protocolo de la barrida diaria: recorre las webs rivales y registra lo nuevo. |
| `agentes/analisis-huecos/AGENTE.md` | Protocolo semanal: cruza lo acumulado contra nuestro sitio y señala dónde perdemos. |
| `datos/rivales.json` | Lista de partida de rivales, con web, blog e idiomas. Copia en disco de la colección `rivales`. |

## Los rivales

Siete vigilados, fijados el 7 de octubre de 2026:

| Rival | Blog | Nota |
|---|---|---|
| CaminoWays | `caminoways.com/blog` | El más fuerte en contenido. Casi diario, con fechas, ya publica Año Santo 2027 |
| Follow the Camino | `followthecamino.com/en/blog/` | 20 años, autoría firmada, cubre temas administrativos |
| Viaje Camino de Santiago | `viajecaminodesantiago.com/blog/` | Santiago, contenido estacional y local, sin fechas |
| MundiCamino | `mundicamino.com/category/noticias/` | Burgos, con fechas, pero diluye el nicho con destinos ajenos |
| Pilgrim | `pilgrim.es/blog/` | Enfocado a puntos de partida, sin fechas |
| Tee Travel | `tee-travel.com/blog/` | Senderismo general, compite solo en parte del espacio |
| Tu Buen Camino | sin blog | Compite en producto, no en contenido. Vigilar por si lo abre |

Dos propuestos por el equipo, a la espera de validación: **Galiwonders** (ataca el mercado anglosajón desde Galicia) y **Macs Adventure** (operador británico con mucha autoridad de dominio).

Los `vigilado` los decide una persona. El agente solo puede añadir `propuesto`.

## Cómo funciona

La barrida diaria lee los blogs de los rivales, compara con lo ya registrado y escribe en `publicaciones` todo lo que no estaba. Puntúa cada pieza por relevancia y por amenaza, y deja constancia en la bitácora de qué ha visto cada miembro del equipo.

El análisis de huecos va más despacio. Una vez por semana agrupa lo acumulado por tema en lugar de por rival, comprueba qué tenemos nosotros y escribe en `huecos` los sitios donde los rivales están y nosotros no.

Las dos cosas están separadas a propósito: detectar es barato y conviene hacerlo a diario; concluir es caro y conviene hacerlo con perspectiva.

## Cuándo se ejecuta

| Tarea | Cadencia | Protocolo |
|---|---|---|
| `magical-seo-barrida-rivales` | Cada día a las 6:06 | `agentes/barrida-rivales/AGENTE.md` |
| `magical-seo-analisis-huecos` | Lunes a las 8:13 | `agentes/analisis-huecos/AGENTE.md` |

Las tareas programadas se ejecutan mientras la aplicación de Claude está abierta. Si está cerrada a la hora prevista, la barrida se lanza al abrirla.

## Lanzar una barrida a mano

Pide a Claude que siga el protocolo:

```
Sigue magical-seo/agentes/barrida-rivales/AGENTE.md y haz una barrida completa
```

## Estado

- La sala está publicada, con los rivales cargados y las dos tareas programadas.
- Primera barrida hecha el 7 de octubre de 2026: 13 publicaciones de CaminoWays y Follow the Camino, tres de amenaza alta.
- Los huecos se llenan con la primera ejecución del protocolo semanal.
- La interfaz solo muestra datos en vivo abierta desde claude.ai con la sesión iniciada. Abierta como archivo local enseña el estado vacío.

## Fuentes de datos conectadas

| Fuente | Estado | Qué aporta |
|---|---|---|
| Web y blogs de los rivales | Activa | Qué publican y cuándo. Gratis, vía lectura directa |
| Google Search Console | Activa desde el 7 de octubre de 2026 | Nuestra posición, impresiones y clics reales en las consultas que ellos atacan |
| Semrush | Pendiente | Volúmenes de búsqueda. Bloqueado: la subcuenta no tiene unidades de API asignadas |
| Google Analytics 4 | Pendiente | Tráfico orgánico por página. Falta el ID de propiedad |

Las credenciales de Google viven en `~/.config/claude-seo/` (OAuth, nivel 1). La propiedad por defecto es `https://santiagoways.com/`, con tres vistas por idioma disponibles: `/es/`, `/en/` y `/de/`.

## Lo que esta sala todavía no hace

- **No mide volúmenes de búsqueda.** Hasta que Semrush tenga unidades, la prioridad de un hueco se razona por intención, por posición en Search Console y por cuántos rivales lo atacan.
- **No vigila sus redes ni su publicidad.** Solo web, blog y señales de búsqueda.
- **No sabe qué posición ocupan ellos**, solo la nuestra. Search Console es un espejo de nuestro sitio, no de los suyos.
