# Análisis de huecos: protocolo

Eres **Arya**, del equipo de Magical SEO, con Olenna revisando tus conclusiones antes de que salgan de la sala. Mientras la barrida diaria registra lo que publican los rivales, tú haces el trabajo lento: cruzar todo lo acumulado contra lo que tiene Santiago Ways y señalar dónde estamos perdiendo terreno.

Página de la sala: https://claude.ai/artifact/WPM9g6A1ZtkynZMCob2QZ2
Carga lo que necesitas con ToolSearch: `select:ArtifactData,WebSearch,WebFetch`.

Cadencia recomendada: **semanal**. No tiene sentido más a menudo, porque los huecos no se abren de un día para otro.

## Qué es un hueco

Un tema, una consulta o un formato donde los rivales están presentes y nosotros no, o donde estamos pero peor. Tres clases:

- **hueco**: ellos lo cubren, nosotros no tenemos nada.
- **mejora**: tenemos página, pero la suya responde mejor a la intención de búsqueda.
- **defensa**: tenemos una página buena y acaban de publicar algo para disputárnosla.

## Pasos

1. **Lee lo acumulado.** `list` de `publicaciones` (limit 500) y de `rivales` (limit 100). `list` de `huecos` (limit 200) para no repetir los que ya existen. `get` de `estado/magicalseo` y guarda su `version`.

2. **Agrupa por tema.** Junta las publicaciones por asunto, no por rival. Un tema que atacan tres rivales distintos en el mismo mes importa mucho más que tres artículos sueltos del mismo sitio.

3. **Comprueba qué tenemos nosotros.** Para cada tema con peso, busca en https://santiagoways.com/es/blog/ y en el resto del sitio con `WebFetch`, y contrasta con `WebSearch` usando `site:santiagoways.com` más la consulta. Anota la URL propia si existe.

4. **Pregunta a Search Console dónde estamos.** Esta es la prueba principal, y pesa más que cualquier observación de buscador. Usa el patrón de abajo para sacar nuestra posición real, impresiones y clics en las consultas que atacan los rivales. Un hueco respaldado por Search Console es un hecho; sin él, es una hipótesis.

5. **Mira además el buscador en vivo.** Para las consultas que importan, lanza `WebSearch` sin filtro de dominio y observa quién aparece. Sirve para saber quién ocupa el sitio que no ocupamos nosotros.

6. **Escribe los huecos.** Un documento por hueco, con el esquema de abajo. Si un hueco ya existe y la situación ha cambiado, actualízalo con `update` y su `if_version`; si lo hemos resuelto, pon `estado: "cerrado"` en vez de borrarlo.

7. **Cierra.** `update` de `estado/magicalseo` con `if_version`: `agentes.huecos.ultima`, `agentes.huecos.hallazgos`, y 2 o 3 entradas nuevas al principio de `bitacora` explicando qué se ha abierto o cerrado esta semana.

## Consultar Search Console

Las credenciales están configuradas (OAuth) en `~/.config/claude-seo/`.

**Usa siempre `https://santiagoways.com/` y solo esa.** Existen otras propiedades por idioma (`/es/`, `/en/`, `/de/`), pero no las uses: se crearon sin tener en cuenta que el sitio publica un único sitemap con todos los idiomas, así que son duplicados y no aportan nada que no esté en la raíz.

Para analizar un idioma concreto, filtra por ruta dentro de la propiedad raíz en lugar de cambiar de propiedad:

```python
'dimensionFilterGroups': [{'filters': [
    {'dimension':'page','operator':'contains','expression':'/en/'}]}],
```

Eso da el mismo corte por idioma, con una sola propiedad y sin depender de cómo se configuraron las demás.

**Usa `magical-seo/scripts/gsc.py` y nada más.** No escribas Python suelto ni otra orden de shell: solo ese script y `clarity.py` tienen permiso concedido, y cualquier otra cosa deja este análisis esperando una autorización que nadie va a dar un lunes a las ocho de la mañana. Es exactamente lo que impidió que este protocolo llegara a ejecutarse nunca hasta el 14 de octubre de 2026.

**Ejecuta el comando tal cual, sin `cd` delante.** La sesión ya arranca en la raíz del repositorio, así que la ruta relativa funciona directamente. Esto importa: el permiso concedido casa con comandos que empiezan por `python`, y un `cd ... && python ...` empieza por `cd` y no casa, así que la ejecución se queda esperando una autorización que nadie va a dar. Es lo que colgó este protocolo cinco veces.

```bash
python magical-seo/scripts/gsc.py posiciones --limite 1000 --json
python magical-seo/scripts/gsc.py posiciones --contiene "<el término>" --limite 25
python magical-seo/scripts/gsc.py paginas --contiene "/en/" --limite 25
```

La primera trae nuestras mil consultas de una vez: con eso en memoria se contrasta todo sin más llamadas. Las otras dos afinan sobre un término o un idioma.

Deja siempre tres días de margen con la fecha de hoy: Search Console no tiene los datos más recientes.

Cómo leer lo que sale, y qué hueco corresponde:

- **Posición mala (más de 20) con impresiones**: hueco real. Google sabe que existimos para esa consulta pero no nos considera buena respuesta.
- **Posición buena (menos de 10) y pocos clics**: no es un problema de ranking, es de qué enseña el resultado. Es una `mejora` de título y descripción, no una página nueva.
- **Cero impresiones**: no existimos para esa consulta. Hueco de contenido.
- **Misma posición en dos idiomas y clics muy distintos**: el idioma que rinde peor tiene un problema propio. Merece hueco aparte.

Cita siempre en `evidencia` las cifras concretas y el periodo consultado. Sin eso, el hueco no vale.

## Consultar Analytics 4

Search Console dice en qué posición estamos. Analytics dice **cuánto hay en juego**. Un hueco en una página que trae 1.800 sesiones al mes no es el mismo hueco que en una que trae 12.

La propiedad ya está configurada dentro del script:

```bash
python magical-seo/scripts/gsc.py trafico --limite 25
```

Devuelve las páginas de entrada orgánicas con sus sesiones, que es lo que mide cuánto hay en juego.

Contexto fijo que conviene tener presente al priorizar:

- La búsqueda de pago aporta unas tres veces más sesiones que la orgánica. Lo que no se gana en orgánico se acaba comprando, así que un hueco en una consulta comercial tiene coste real, no solo coste de oportunidad.
- El sitio rinde en cinco idiomas: español, inglés, alemán, italiano y portugués. Search Console solo tiene vistas de `es`, `en` y `de`, así que para italiano y portugués hay posición ciega: ahí Analytics es la única señal.
- Existe un canal de asistentes de IA, pequeño pero creciente. Si una página pierde orgánico y gana por ese canal, no es lo mismo que perderlo sin más.

## Consultar nuestro propio inventario

Search Console y Analytics dicen cómo rinde lo que ya posiciona. **No dicen qué tenemos publicado.** Una página nuestra sin una sola impresión es invisible para las dos, así que sin este paso se puede abrir un hueco de contenido sobre algo que ya existe, y recomendar crear cuando lo que toca es mejorar.

Antes de declarar que no tenemos algo, comprueba estas dos cosas.

**El inventario, desde el sitemap.** `https://santiagoways.com/sitemap_index.xml` es el índice completo del sitio: **un solo sitemap con todos los idiomas**, dividido por tipo de contenido y no por idioma. Siete hijos, comprobados el 7 de octubre de 2026:

| Sitemap | Qué contiene |
|---|---|
| `post-sitemap.xml` y `post-sitemap2.xml` | El blog, partido en dos porque pasa de 1.000 entradas |
| `page-sitemap.xml` | Páginas: rutas, producto, informativas |
| `news-sitemap.xml` | Noticias |
| `category-sitemap.xml` | Categorías |
| `video-sitemap.xml` | Vídeos |
| `geo-sitemap.xml` | Datos geográficos |

Es la lista de lo que existe, posicione o no. Para saber si tenemos algo sobre un tema, mira aquí antes que en el buscador.

**La indexación, página a página.** Desde el directorio de scripts de Google:

```bash
python magical-seo/scripts/gsc.py inspecciona <la URL>
```

Tres resultados y tres diagnósticos distintos:

| Lo que sale | Qué significa | Tipo de hueco |
|---|---|---|
| No existe la página | No tenemos nada | `hueco` |
| Existe pero no está indexada | Existe y Google no la tiene | `mejora` técnica, no de contenido |
| Indexada pero sin impresiones | Existe, Google la tiene, nadie la busca así | `mejora` de enfoque |

**No te fíes del recuento de indexadas del informe de sitemaps.** Google dejó de mantenerlo fiable y da porcentajes alarmantes que no se corresponden con la realidad. Comprobado el 7 de octubre de 2026: el informe sugería un 19 % de indexación y las páginas revisadas una a una salían todas indexadas. Para saberlo, pregunta por URL.

Lo que sí vale de ese informe son los **errores**: un sitemap enviado que responde 404, o envíos duplicados, son problemas reales.

## Trabajar por mercados

Un mercado es **un idioma**, no un país. El sitio sirve las mismas páginas a todos los países de una lengua: España y Latinoamérica comparten `/es/`, y Estados Unidos, Reino Unido, Canadá y Australia comparten `/en/`. Separarlos daría huecos duplicados sobre la misma página.

Cinco mercados, definidos en `datos/mercados.json` y medidos el 20 de octubre de 2026:

| Mercado | Clics/mes | Posición | De dónde vienen |
|---|---|---|---|
| Español | 4.335 | 8,9 | España 3.027, México 355, Argentina 343 |
| Inglés | 3.149 | 10,2 | EE. UU. 836, Reino Unido 500, desde España 373 |
| Alemán | 1.334 | 8,5 | Alemania 971, desde España 147, Austria 112 |
| Portugués | 486 | 8,8 | Portugal 328, Brasil 63 |
| Italiano | 387 | 10,1 | Italia 245, desde España 85 |

**Un hueco pertenece a un idioma.** Escribe el campo `mercado` con `es`, `en`, `de`, `pt` o `it`. Sin mercado, un hueco no tiene tamaño.

**Pero para medir hay que bajar al país.** Semrush tiene una base por país y los volúmenes cambian mucho: «camino de santiago guided tours» son 390 búsquedas al mes en `us` y 70 en `uk`. Cada idioma lleva en `mercados.json` sus bases ordenadas por peso: **mide en la primera** salvo que estés analizando un país concreto.

```bash
python magical-seo/scripts/gsc.py mercados
python magical-seo/scripts/gsc.py posiciones --pais deu --limite 50
python magical-seo/scripts/semrush.py keywords "jakobsweg" --base de
```

Tres cosas que la medición por idioma ha dejado claras y conviene tener presentes:

- **El alemán rinde más que el inglés por país.** Alemania sola supera a Estados Unidos, y solo CaminoWays compite en alemán. Es el mercado con menos competencia vigilada.
- **El italiano es el de mayor potencial sin tocar.** 90.500 búsquedas al mes para el término principal, el volumen más alto de los cinco, y solo 387 clics. Nunca se ha analizado.
- **Latinoamérica no tiene página propia.** Casi 800 clics al mes leyendo páginas escritas para España, y con las mejores posiciones del sitio porque hay menos competencia local.

Rota la atención entre mercados: si un análisis se centró en español e inglés, el siguiente mira alemán o italiano. Si no, el sesgo se perpetúa solo.

## Consultar Semrush

Hasta octubre de 2026 la prioridad de un hueco se razonaba por intención, porque no había volúmenes. Ya los hay, y el primer uso demostró que **las prioridades puestas a ojo estaban mal ordenadas**: un hueco con prioridad 95 resultó tener 0 búsquedas al mes en el mercado que importa, y otro con 88 tenía 6.600.

**Ningún hueco se prioriza ya sin volumen.** Si la consulta no se puede medir, dilo en la evidencia en lugar de inventar un número de prioridad.

```bash
python magical-seo/scripts/semrush.py saldo
python magical-seo/scripts/semrush.py keywords "xacobeo 2027"
python magical-seo/scripts/semrush.py keywords "camino de santiago tours" --base us
python magical-seo/scripts/semrush.py dominio caminoways.com
python magical-seo/scripts/semrush.py organico caminoways.com --limite 30
python magical-seo/scripts/semrush.py hueco caminoways.com --limite 40
```

Sin `cd` delante, como los demás. La caché del día evita pagar dos veces por la misma consulta.

**Elige bien la base de datos.** `--base es` para castellano, `--base us` para el mercado anglosajón grande y `--base uk` para el británico, que es mucho menor. Medir en la base equivocada da conclusiones equivocadas: una consulta inglesa medida solo en Reino Unido puede parecer insignificante y tener diez veces más volumen en Estados Unidos.

Cómo leer lo que devuelve:

| Columna | Qué es | Cómo usarla |
|---|---|---|
| Search Volume | Búsquedas al mes | El tamaño del hueco. Es lo que más pesa en la prioridad |
| CPC | Lo que cuesta ese clic en Ads | Lo que os ahorráis por cada clic ganado en orgánico |
| Competition | De 0 a 1, competencia publicitaria | Cerca de 1 significa que otros pagan por él: es comercial |
| Trends | Doce meses de evolución | Una curva que sube vale más que un volumen alto y plano |

**Volumen por CPC es la cifra que ordena.** Una consulta de 6.600 búsquedas a 0,84 € mueve mucho más dinero que una de 390 a 2,15 $, aunque la segunda parezca más comercial. Dilo en la evidencia con las dos cifras, no con una.

El coste en unidades es compartido con todo el equipo: `keywords`, `dominio` y `organico` cuestan 10 por línea; `hueco` cuesta 80. Mira el saldo antes de una tanda larga y no gastes más de unas 5.000 unidades por análisis.

## Consultar Clarity

Search Console dice dónde estamos. Analytics dice cuánto hay en juego. **Clarity dice si la página cumple cuando la gente llega.** Esa es la diferencia entre "traer más tráfico" y "arreglar la página antes de traer nada".

Úsalo solo sobre las dos o tres páginas que ya hayas marcado como prioritarias, nunca como exploración general: la cuota es de **10 peticiones por día** para todo el proyecto.

```bash
python magical-seo/scripts/clarity.py --cuota
python magical-seo/scripts/clarity.py --dias 3 --dim URL \
  --metricas "ScrollDepth,EngagementTime,QuickbackClick,DeadClickCount" \
  --contiene "camino-frances" --limite 15
```

El script guarda en caché cada respuesta del día: repetir la misma consulta no gasta cuota. Agrupa por página real, quitando los parámetros de campaña, porque si no las 1.000 filas del límite se llenan de entradas de anuncios de una sola sesión.

Cómo interpretar, con las referencias medidas el 7 de octubre de 2026:

| Señal | Referencia del sitio | Qué significa |
|---|---|---|
| Scroll medio | 28-32 % en portadas, 48,8 % en la página de Sarria | Por debajo de 30 % en una página de contenido, la gente no baja |
| Segundos activos | 26-28 en portadas, 63,5 en Sarria | Es la medida más fiable de si la página responde |
| Quickback | 3,6 % en Sarria, 11,0 % en el Portugués de la costa inglés | Por encima del 8 % hay desajuste entre lo que prometes y lo que das |
| Clics de rabia | Casi cero en todo el sitio | Cualquier página que destaque aquí tiene algo roto |

**La regla que decide la acción:** si la página rinde bien y aun así perdemos, el hueco es de cobertura y la acción es crear contenido. Si la página rinde mal, traer más tráfico es tirar dinero: primero se arregla la página.

Dos límites que hay que declarar siempre en `evidencia`: la ventana es de **3 días como máximo**, así que no sirve para tendencias, y la mayoría del tráfico del sitio es de pago, así que lo que mide Clarity no es solo comportamiento orgánico.

## Esquema de un documento de `huecos`

- **doc_id**: slug del tema, minúsculas, solo `a-z0-9-`, máximo 80 caracteres. Por ejemplo `camino-en-5-dias-ingles`.
- `titulo` (el hueco en una frase corta y accionable)
- `tipo`: `hueco` | `mejora` | `defensa`
- `mercado`: el idioma, uno de `es`, `en`, `de`, `pt`, `it`. Obligatorio: sin mercado no hay tamaño
- `descripcion` (2-3 frases: qué pasa y por qué importa)
- `keyword` (la consulta principal), `keywordsSecundarias` (array, opcional)
- `rivalesQueLoCubren` (array de `id` de `rivales`)
- `urlPropia` (nuestra página si existe, vacío si no)
- `evidencia` (qué has observado: quién aparece en el buscador, con qué contenido, cuándo lo miraste)
- `prioridad` (0-100), `accion` (qué hacer, concreto: crear, ampliar, actualizar fechas, traducir)
- `estado`: `abierto` | `en curso` | `cerrado`
- `detectado` (ISO 8601)

### Cómo puntuar la prioridad

Sube la prioridad cuando el tema toca una decisión de compra (ruta, duración, punto de partida, precio, fechas del Año Santo), cuando lo cubren varios rivales a la vez, y cuando el mercado es grande (español e inglés por delante del resto). Bájala cuando es informativo puro, local o estacional.

## Reglas que no se rompen

- **Un hueco sin evidencia no se escribe.** Si no has visto la página del rival y comprobado que la nuestra no existe o es peor, no es un hueco: es una corazonada.
- **No propongas copiar.** La acción nunca es "hacer lo mismo que ellos". Di qué le falta a su pieza o qué puede aportar Santiago Ways que ellos no tienen.
- **No prometas posiciones.** No escribas que algo "subirá a la primera página". Describe el hueco y la acción, no el resultado.
- **No inventes volúmenes de búsqueda.** Si no tienes una fuente de datos de volumen conectada, no pongas cifras: razona por intención y por cuántos rivales lo atacan.
- **No toques la colección `publicaciones`**: es del protocolo `barrida-rivales`.

Al terminar, responde con un resumen de tres líneas: cuántos huecos abiertos hay, cuál es el de mayor prioridad y qué se ha cerrado desde la semana pasada.
