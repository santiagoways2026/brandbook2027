# Design Code HTML · Santiago Ways

Este proyecto convierte **contenido en bruto** (texto, tablas pegadas, Markdown, Word)
en **HTML con las clases propias de Santiago Ways**, listo para pegar en la web.

## Regla de oro

**No se inventan clases ni estilos.** Todo HTML que se genere aquí tiene que salir de un
bloque ya catalogado en [`design-system/catalogo.md`](design-system/catalogo.md).
Si el contenido no encaja con ningún bloque existente, se pregunta al usuario antes de
crear nada nuevo. Una clase inventada rompe la coherencia del sitio y no tiene CSS detrás.

## Flujo al recibir contenido

1. Leer `design-system/inventario.md` y `design-system/catalogo.md` **siempre**, antes de
   escribir una línea de HTML. El inventario se genera desde el CSS: es la lista cerrada.
2. Identificar qué bloque corresponde al contenido recibido.
3. Abrir el `bloques/<nombre>.html` de referencia y copiar su estructura exacta.
4. Sustituir solo el contenido. Nombres de clase, orden de atributos y anidamiento
   se respetan literalmente.
5. Devolver el HTML en un bloque de código y, si se pide, guardarlo en `salidas/`.

## Qué NO se hace nunca

- Añadir atributos `style=""` inline. Única excepción: `--pct` en `.durations__bar`,
  que es el dato de la barra, no un estilo.
- Renombrar, abreviar o traducir nombres de clase.
- Añadir `id`, `role`, `aria-*` o `data-*` que no estén en el bloque de referencia
  (la excepción es `data-label`, que es obligatorio en `tabla-responsive`).
- Usar frameworks (Bootstrap, Tailwind) ni utilidades genéricas.
- Meter `<style>` dentro del HTML de salida: el CSS vive en `design-system/`.

## Marca

Los valores de color, tipografía y escala salen del Brandbook 2027
(`Santiago_Ways_Brandbook_2027.pdf`) y están en [`design-system/tokens.css`](design-system/tokens.css).
Reglas que afectan al HTML:

- Titulares en **minúscula de frase**. Mayúsculas solo en antetítulos y etiquetas.
- Verde Ways `#7AA606` **nunca como color de texto sobre blanco** (contraste 2,9:1).
  Para texto en verde se usa Verde sendero `#506718`.
- **Un solo subrayado SW por pieza**, sobre una o dos palabras.
- Tono: experto cercano. Sin grandilocuencia, urgencia artificial ni promesas absolutas.

## Estructura

```
app/               la herramienta: selector de módulos y generador en el navegador
  modulos.js       el registro de módulos: ahí se añaden los bloques nuevos
design-system/
  bloques.css      hoja de estilos ORIGINAL del cliente ← la fuente de verdad
  inventario.md    lista cerrada de clases, generada desde bloques.css
  catalogo.md      qué es cada bloque, cuándo se usa y sus reglas de marcado
  paleta.md        paleta real vs. Brandbook 2027, con avisos de contraste
  tokens.css       tokens del brandbook (referencia, no se usa en producción)
  preview.html     vista previa
bloques/           un .html por componente, con su markup de referencia
tools/
  servidor.py      servidor de desarrollo sin caché
  inventario.py    regenera inventario.md desde las hojas de design-system/
inbox/             aquí deja el usuario HTML nuevo sin catalogar
salidas/           HTML generado
emails/            pieza heredada de email. Fuera del alcance de este proyecto.
```

Si cambia `bloques.css`, hay que lanzar `python tools/inventario.py`.

## La herramienta

`app/` es la versión navegable de esto mismo: `python tools/servidor.py` y
http://localhost:8899/app/ . Ese servidor manda `Cache-Control: no-store`; con
`python -m http.server` el navegador sirve el `modulos.js` antiguo y parece que los
cambios no entran. Un módulo nuevo se añade en `app/modulos.js`, y su `render()`
tiene que devolver exactamente el markup del `bloques/<id>.html` de referencia. El panel
«El módulo» se pinta con esa misma función, así que una desviación se ve al momento.
