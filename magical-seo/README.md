# Magical SEO

Sala de vigilancia competitiva de Santiago Ways. Observa lo que publican los operadores rivales del Camino de Santiago, mide qué posición ocupamos nosotros en lo que ellos atacan y señala dónde estamos perdiendo terreno.

**Entrar:** https://claude.ai/artifact/WPM9g6A1ZtkynZMCob2QZ2

Está fijada en la barra lateral de claude.ai. Hay que abrirla desde ahí, con la sesión iniciada: es lo que le da acceso a los datos. Si abres el `index.html` de este repositorio en el navegador verás la sala vacía, solo la cáscara.

---

## 1. La idea

Un rival publica un artículo. Por sí solo, ese dato no dice nada: puede ser irrelevante o puede estar quitándonos una venta. Para saber cuál de las dos cosas es, hacen falta tres piezas a la vez:

1. **Qué han publicado** y cuándo
2. **En qué posición estamos nosotros** para esa búsqueda
3. **Cuánto tráfico hay en juego** en la página que nos disputan

Magical SEO junta las tres. Sin la primera no sabes que te atacan; sin la segunda no sabes si te duele; sin la tercera no sabes si merece la pena responder.

---

## 2. Cómo está montado

```
magical-seo/
├── index.html                          la sala (publicada como artifact)
├── agentes/
│   ├── barrida-rivales/AGENTE.md       protocolo diario
│   └── analisis-huecos/AGENTE.md       protocolo semanal
├── datos/
│   └── rivales.json                    lista de partida, copia en disco
├── scripts/
│   └── clarity.py                      consulta a Clarity, con cache de cuota
└── README.md                           este archivo
```

Tres partes que funcionan por separado:

**La sala** (`index.html`) es solo una ventana. No tiene datos dentro: los lee en vivo de la base de datos del artifact. Por eso se puede republicar sin perder nada.

**La base de datos** vive en el artifact y es la memoria del sistema. Sobrevive a cualquier cambio de la interfaz.

**Los agentes** son archivos de instrucciones en Markdown. No son programas: son protocolos que Claude lee y sigue. Cambiar el comportamiento del sistema es editar un `.md`, no tocar código.

Esa separación es deliberada. Si mañana quieres otra interfaz, la cambias y los datos siguen. Si quieres que el agente mire otra cosa, editas el protocolo y la interfaz sigue.

---

## 3. Las colecciones

| Colección | Quién escribe | Qué guarda |
|---|---|---|
| `rivales` | Persona (vigilados) y agente (propuestos) | Quién compite, su web, su blog, sus idiomas |
| `publicaciones` | Barrida diaria | Cada artículo o página nueva detectada |
| `huecos` | Análisis semanal | Dónde perdemos y qué hacer |
| `estado/magicalseo` | Ambos | Última barrida, estado de cada agente y la bitácora |

### `rivales`

```
id, nombre, web, blog, pais, idiomas[], orden, notas
estado: vigilado | propuesto
```

**Regla importante:** solo una persona puede poner `vigilado`. El agente, cuando detecta un competidor recurrente que no está en la lista, lo crea como `propuesto` y espera validación. Esto evita que la lista crezca sola hasta volverse ruido.

### `publicaciones`

```
titulo, url, rival, tipo, idioma, publicado, detectado
resumen, porque, tema, keywords[], senales, agente
relevancia: 0-100
amenaza: alta | media | baja
nuestraPosicion, nuestraConsulta, nuestraUrl, verificar
```

Los cuatro últimos son la **triangulación**: dónde estamos nosotros en lo que esa pieza ataca. La barrida los rellena cruzando las palabras clave de cada publicación con nuestras posiciones reales de Search Console, y ajusta la amenaza con eso. Una pieza rival sobre una consulta que ya defendemos no vale lo mismo que una sobre una donde no aparecemos.

La sala lo muestra en cada ficha con un color: verde si defendemos (posición 1 a 10), ámbar si estamos pero no nos ven (11 a 30), rojo si ahí no competimos (más de 30). Cuando la barrida no ha podido comprobarlo, lo dice en gris y lo deja pendiente del análisis semanal en lugar de suponerlo.

Cuesta **dos llamadas para toda la barrida**, no una por publicación: una consulta trae nuestras mil consultas principales y el cruce se hace en memoria.

`relevancia` se guarda pero **no se muestra en la sala**. Se quitó de la vista porque, a diferencia de la amenaza, no tiene un baremo escrito: el agente la asigna a ojo, así que aparentaba más precisión de la que tenía. El dato se sigue registrando por si algún día se le define un criterio; mientras tanto, la señal buena es la amenaza.

`tipo` es uno de: `blog`, `ruta`, `producto`, `precio`, `landing`, `home`, `otro`.

**Cómo se puntúa la amenaza:**

- **alta**: ataca de frente una consulta que nos vende (una ruta, un punto de partida, una duración, precios, Xacobeo 2027), o usa un formato que no tenemos
- **media**: contenido informativo que cubrimos peor o no hemos actualizado
- **baja**: nicho, local, estacional o fuera de nuestro espacio comercial

### `huecos`

```
titulo, descripcion, keyword, keywordsSecundarias[]
rivalesQueLoCubren[], urlPropia, evidencia, accion
tipo: hueco | mejora | defensa
prioridad: 0-100
estado: abierto | en curso | cerrado
```

Tres clases de hueco:

- **hueco**: ellos lo cubren, nosotros no tenemos nada
- **mejora**: tenemos página, pero la suya responde mejor
- **defensa**: tenemos una página buena y acaban de publicar para disputárnosla

El campo `evidencia` no es opcional. Un hueco sin cifras concretas y periodo citado no vale: es una corazonada, y de esas ya tenemos bastantes.

---

## 4. Los dos agentes

### Barrida de rivales, cada día a las 6:06

Recorre el blog de cada rival vigilado, compara con lo ya registrado y guarda lo que no estaba. Completa con búsquedas sobre rutas, puntos de partida, duraciones y Año Santo, en español y en inglés.

Usa solo lectura web y búsqueda: no gasta ningún crédito de API de pago. Por eso puede permitirse ser diaria.

### Análisis de huecos, lunes a las 8:13

Va más despacio y piensa más. Agrupa lo acumulado **por tema en lugar de por rival**, porque un asunto que atacan tres rivales distintos en un mes importa mucho más que tres artículos del mismo sitio.

Para cada tema con peso, consulta Search Console (qué posición tenemos) y Analytics (cuánto tráfico hay en juego), y escribe el hueco con las cifras.

**Por qué están separados:** detectar es barato y conviene a diario; concluir es caro y conviene con perspectiva. Mezclarlos daría cuarenta conclusiones precipitadas a la semana en vez de cinco buenas.

### El equipo

Siete especialistas, repartidos entre los dos protocolos:

| Quién | Qué mira | Protocolo |
|---|---|---|
| Varys | Blogs rivales: artículos nuevos, ritmo y ángulos | Diario |
| Davos | Páginas de ruta, producto y precio | Diario |
| Samwell | Señales técnicas: fechas, autoría, datos estructurados, idiomas | Diario |
| Bran | Buscadores: nuestra posición en lo que ellos atacan | Semanal |
| Baelish | Analítica: cuánto tráfico hay en juego en cada página | Semanal |
| Arya | Huecos: lo que cubren ellos y nosotros no | Semanal |
| Olenna | Jefa: prioriza, puntúa la amenaza y escribe la bitácora | Ambos |

No son personas ni procesos separados: son el reparto de atención dentro de cada ejecución. Sirven para que la bitácora se lea como un parte de equipo en vez de como un volcado de datos, y para que ninguna parcela se quede sin mirar.

---

## 5. Las fuentes de datos

| Fuente | Estado | Qué aporta |
|---|---|---|
| Webs y blogs rivales | Activa | Qué publican y cuándo. Gratis |
| Google Search Console | Activa desde el 7 oct 2026 | Nuestra posición, impresiones y clics reales |
| Google Analytics 4 | Activa desde el 7 oct 2026 | Tráfico en juego por página y por canal |
| Microsoft Clarity | Activa desde el 7 oct 2026 | Si la página cumple cuando la gente llega |
| Semrush | **Bloqueada** | Volúmenes de búsqueda |

### Credenciales de Google

Viven en `~/.config/claude-seo/`:

| Archivo | Qué es |
|---|---|
| `client_secret.json` | Cliente OAuth del proyecto de Google Cloud |
| `oauth-token.json` | Token de acceso y refresco |
| `google-api.json` | Configuración: propiedades por defecto |

- **Propiedad de Search Console:** `https://santiagoways.com/`, y solo esa. Existen propiedades por idioma (`/es/`, `/en/`, `/de/`) pero son duplicados: se crearon sin tener en cuenta que el sitio publica un único sitemap con todos los idiomas. Para analizar un idioma, filtra por ruta dentro de la raíz
- **Sitemap:** `https://santiagoways.com/sitemap_index.xml`, un único índice con todos los idiomas, dividido por tipo de contenido en siete hijos
- **Propiedad de Analytics:** `properties/309135189`
- **Nivel de credenciales:** 2

Comprobar que sigue todo en pie:

```bash
python C:\Users\swcan\.claude\skills\seo\scripts\google_auth.py --check
```

Se autorizó por OAuth y no por cuenta de servicio porque la organización tiene una política que impide crear claves de cuenta de servicio. La aplicación de Google Cloud es **Interna**, lo cual importa: en modo externo sin verificar, el token de refresco caducaría cada 7 días y las barridas empezarían a fallar en silencio.

### Semrush

El conector está instalado y autenticado, pero devuelve `no_api_units`: la cuenta es corporativa y las unidades de API viven en la cuenta madre. Hay que pedir al propietario de la cuenta de Semrush que **asigne unidades a la subcuenta**. Con 10.000 para empezar basta.

Cuando las haya, Semrush entra **solo en el protocolo semanal**, nunca en el diario. Nueve rivales consultados cada día agotarían la bolsa en semanas.

---

## 6. Cómo leer la sala

Cuatro vistas, y cada una se puede marcar directamente en el navegador añadiendo `#pubs`, `#rivales`, `#huecos` o `#bitacora` al final de la dirección.

**La barra de progreso.** Aparece en la cabecera solo mientras hay una barrida en curso, y desaparece sola al terminar. Muestra la etapa en la que está, el paso de ocho, cuántos rivales lleva recorridos, cuántas publicaciones nuevas ha encontrado y el tiempo transcurrido. El tiempo restante solo sale cuando hay histórico de barridas anteriores para estimarlo; en las primeras lo dice abiertamente en lugar de inventar una cifra.

Si una barrida muere a medias sin cerrar su estado, la sala la da por caducada a los 45 minutos y oculta la barra.

**Publicaciones.** Lo que han publicado, lo más reciente arriba. La franja de color del borde izquierdo es la amenaza: roja alta, ámbar media, verde baja. Los filtros de arriba acotan por amenaza, por tipo y por Xacobeo 2027. El buscador entra en títulos, temas y palabras clave.

**Rivales.** Una ficha por competidor, con cuántas publicaciones le hemos detectado y cuándo fue la última. Los `propuesto` llevan sello ámbar: son los que esperan tu validación.

**Huecos.** Lo accionable. Ordenados por prioridad. Cada uno lleva su evidencia y una acción concreta.

**Bitácora.** El relato. Útil cuando vuelves después de unos días y quieres saber qué ha pasado sin leer cuarenta fichas.

---

## 7. Operaciones

### Lanzar una barrida a mano

Tres formas, de más directa a menos:

**1. Ejecutar ahora, en la tarea programada.** En la sección de tareas programadas de la aplicación de Claude, la tarea `magical-seo-barrida-rivales` tiene un botón de ejecución inmediata. Lanza exactamente lo mismo que lanzaría a las 6:06. Es el disparo de verdad.

**2. Pedírselo a Claude** en cualquier sesión abierta sobre este repositorio:

```
Sigue magical-seo/agentes/barrida-rivales/AGENTE.md y haz una barrida completa
```

La sala no tiene botón de lanzar barrida, y no es un olvido: **una página publicada no puede ejecutar agentes ni tareas programadas**. Solo puede leer y escribir en su base de datos. Un botón que lo prometiera estaría mintiendo.

La primera vez conviene usar la ejecución inmediata: **los permisos de herramientas que concedas durante una ejecución quedan guardados en la tarea** y se aplican a las siguientes. Sin eso, una barrida de madrugada puede quedarse esperando un permiso que nadie va a conceder.

### Validar un rival propuesto

En la pestaña **Rivales**, las fichas con sello ámbar llevan dos botones:

- **Vigilar**: entra en el recorrido de la siguiente barrida. Se le asigna el orden siguiente al último vigilado.
- **Descartar**: queda registrado como descartado y el agente no lo volverá a proponer. Si cambias de idea, la ficha ofrece **Recuperar**.

El cambio se guarda al momento y la sala se repinta sola. No hace falta pasar por Claude.

Este es el único punto del sistema donde una persona decide y el agente no puede: el agente propone, tú dispones. Es a propósito, para que la lista no crezca sola hasta volverse ruido.

### Añadir un rival nuevo

Pásale la URL. Claude verifica que la web existe, localiza su blog y lo da de alta. Actualiza también `datos/rivales.json` para que quede en el repositorio.

### Cerrar un hueco

Cuando se haya resuelto, ponle `estado: "cerrado"` en vez de borrarlo. El histórico sirve: dentro de seis meses querrás saber qué se hizo y si funcionó.

### Cambiar la cadencia

Las tareas están en `~/.claude/scheduled-tasks/`. Se gestionan desde la sección de tareas programadas de la aplicación.

**Horas.** Todo se guarda en UTC y la sala lo muestra en **hora de Canarias** (`Atlantic/Canary`), sea cual sea el navegador desde el que se abra. Las tareas programadas corren con la hora local de la máquina, que es la de Canarias.

Cuidado al calcular la próxima barrida: Canarias es UTC+1 en verano y UTC+0 en invierno, con cambio el último domingo de octubre y el último de marzo. Las 6:06 de Canarias son las 05:06 UTC en verano y las 06:06 UTC en invierno.

**Importante:** las tareas programadas corren mientras la aplicación de Claude está abierta. Si está cerrada a las 6:06, la barrida se lanza al abrirla. No se pierde, se retrasa.

---

## 8. Lo que no hace

- **No mide volúmenes de búsqueda.** Hasta que Semrush tenga unidades, la prioridad se razona por intención, por posición y por cuántos rivales atacan el tema.
- **No sabe en qué posición están ellos**, solo nosotros. Search Console es un espejo de nuestro sitio, no del suyo.
- **No separa por idioma de serie.** La propiedad raíz cubre los cinco idiomas, así que para analizar uno concreto hay que filtrar por ruta. No hace falta crear propiedades nuevas: las que hay por idioma ya son duplicados.
- **No vigila sus redes sociales ni su publicidad.** Solo web, blog y señales de búsqueda.
- **Clarity solo ve 3 días.** Sirve para decidir sobre una página concreta, no para medir evolución. Y su cuota es de 10 peticiones diarias para todo el proyecto.
- **No promete posiciones.** Describe huecos y acciones, nunca resultados garantizados.

---

## 9. Estado y hallazgos iniciales

Montado el 7 de octubre de 2026. Primera barrida y primer análisis ejecutados ese mismo día.

**Lo que salió, y conviene no perder de vista:**

**Compramos tres veces más tráfico del que ganamos.** La búsqueda de pago aporta 149.285 sesiones al mes frente a 48.471 de la orgánica. Esto cambia cómo hay que leer cada hueco: lo que no se gana en orgánico se acaba comprando. Un hueco en una consulta comercial es una línea de gasto, no solo una oportunidad perdida.

**Estamos fuera de juego en "guided tours" en inglés.** Posiciones entre la 31 y la 88, cero clics, en una familia de consultas de preventa pura. Follow the Camino publicó un artículo dedicado a eso el 1 de octubre. Prioridad 95.

**El Año Santo rinde diez veces menos en inglés que en español**, con posiciones casi idénticas (5,5 frente a 5,6). No es problema de ranking sino de qué enseñamos en el resultado. Y es justo donde CaminoWays y Galiwonders ya han publicado.

**Sarria a Santiago está cercada.** Es nuestra página de contenido número uno, con 1.834 sesiones orgánicas al mes. CaminoWays no la ataca de frente: está cubriendo el corredor pueblo a pueblo (Melide, Lavacolla). Si acaban teniendo página de cada pueblo y nosotros solo la del tramo, las búsquedas de pueblo se van con ellos.

**Nuestro blog no muestra fechas de publicación.** CaminoWays, Follow the Camino y MundiCamino sí. Es una diferencia de señal de frescura que está en nuestra mano corregir.

---

## 10. Si algo se rompe

| Síntoma | Causa probable | Arreglo |
|---|---|---|
| La sala sale vacía | Abierta en local o sin sesión | Abrirla desde claude.ai con la sesión iniciada |
| Las barridas no corren | La aplicación estaba cerrada | Se lanzan al abrirla. Si no, revisar tareas programadas |
| Error 401 o 403 en Google | Token caducado | Volver a autorizar con `google_auth.py --auth --creds ~/.config/claude-seo/client_secret.json` |
| Error 400 en Analytics | `dimensionFilterGroups` en vez de `dimensionFilter` | Analytics usa el singular. El plural es de Search Console |
| `no_api_units` en Semrush | Subcuenta sin unidades | Pedir asignación al propietario de la cuenta |
| Clarity devuelve 429 | Gastadas las 10 peticiones del día | Esperar a mañana. `clarity.py --cuota` dice cuántas quedan |
| Clarity devuelve mil filas de anuncios | Consulta sin agrupar | Usar `clarity.py`, que agrupa por página real quitando los utm |
| Un rival deja de dar resultados | Cambió la estructura de su blog | Actualizar su campo `blog` en la colección `rivales` |
