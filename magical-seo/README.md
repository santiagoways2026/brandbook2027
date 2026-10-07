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
```

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
| Marina | Blogs rivales: artículos nuevos, ritmo y ángulos | Diario |
| Bruno | Páginas de ruta, producto y precio | Diario |
| Iván | Señales técnicas: fechas, autoría, datos estructurados, idiomas | Diario |
| Olivia | Buscadores: nuestra posición en lo que ellos atacan | Semanal |
| Noelia | Analítica: cuánto tráfico hay en juego en cada página | Semanal |
| Nerea | Huecos: lo que cubren ellos y nosotros no | Semanal |
| Valeria | Jefa: prioriza, puntúa la amenaza y escribe la bitácora | Ambos |

No son personas ni procesos separados: son el reparto de atención dentro de cada ejecución. Sirven para que la bitácora se lea como un parte de equipo en vez de como un volcado de datos, y para que ninguna parcela se quede sin mirar.

---

## 5. Las fuentes de datos

| Fuente | Estado | Qué aporta |
|---|---|---|
| Webs y blogs rivales | Activa | Qué publican y cuándo. Gratis |
| Google Search Console | Activa desde el 7 oct 2026 | Nuestra posición, impresiones y clics reales |
| Google Analytics 4 | Activa desde el 7 oct 2026 | Tráfico en juego por página y por canal |
| Semrush | **Bloqueada** | Volúmenes de búsqueda |

### Credenciales de Google

Viven en `~/.config/claude-seo/`:

| Archivo | Qué es |
|---|---|
| `client_secret.json` | Cliente OAuth del proyecto de Google Cloud |
| `oauth-token.json` | Token de acceso y refresco |
| `google-api.json` | Configuración: propiedades por defecto |

- **Propiedad de Search Console:** `https://santiagoways.com/`, con vistas adicionales en `/es/`, `/en/` y `/de/`
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

**Publicaciones.** Lo que han publicado, lo más reciente arriba. La franja de color del borde izquierdo es la amenaza: roja alta, ámbar media, verde baja. Los filtros de arriba acotan por amenaza, por tipo y por Xacobeo 2027. El buscador entra en títulos, temas y palabras clave.

**Rivales.** Una ficha por competidor, con cuántas publicaciones le hemos detectado y cuándo fue la última. Los `propuesto` llevan sello ámbar: son los que esperan tu validación.

**Huecos.** Lo accionable. Ordenados por prioridad. Cada uno lleva su evidencia y una acción concreta.

**Bitácora.** El relato. Útil cuando vuelves después de unos días y quieres saber qué ha pasado sin leer cuarenta fichas.

---

## 7. Operaciones

### Lanzar una barrida a mano

```
Sigue magical-seo/agentes/barrida-rivales/AGENTE.md y haz una barrida completa
```

### Validar un rival propuesto

Dile a Claude que cambie su `estado` a `vigilado` en la colección `rivales`. A partir de la siguiente barrida entra en el recorrido.

### Añadir un rival nuevo

Pásale la URL. Claude verifica que la web existe, localiza su blog y lo da de alta. Actualiza también `datos/rivales.json` para que quede en el repositorio.

### Cerrar un hueco

Cuando se haya resuelto, ponle `estado: "cerrado"` en vez de borrarlo. El histórico sirve: dentro de seis meses querrás saber qué se hizo y si funcionó.

### Cambiar la cadencia

Las tareas están en `~/.claude/scheduled-tasks/`. Se gestionan desde la sección de tareas programadas de la aplicación.

**Importante:** las tareas programadas corren mientras la aplicación de Claude está abierta. Si está cerrada a las 6:06, la barrida se lanza al abrirla. No se pierde, se retrasa.

---

## 8. Lo que no hace

- **No mide volúmenes de búsqueda.** Hasta que Semrush tenga unidades, la prioridad se razona por intención, por posición y por cuántos rivales atacan el tema.
- **No sabe en qué posición están ellos**, solo nosotros. Search Console es un espejo de nuestro sitio, no del suyo.
- **No cubre italiano ni portugués en posiciones.** Hay tráfico orgánico en italiano, pero Search Console solo tiene vistas de `es`, `en` y `de`. Se arregla creando esas vistas.
- **No vigila sus redes sociales ni su publicidad.** Solo web, blog y señales de búsqueda.
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
| Un rival deja de dar resultados | Cambió la estructura de su blog | Actualizar su campo `blog` en la colección `rivales` |
