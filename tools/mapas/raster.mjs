/* ============================================================
   Versión en imagen (PNG a doble resolución) de los SVG, para cuando
   WordPress no deja subir SVG. raster.py la pasa luego a WebP.

       node tools/mapas/raster.mjs <svg> [<svg> …]

   Abre cada SVG como documento, apaga la animación para que salga el
   estado final y lo fotografía a 2x. Escribe <nombre>.png junto al SVG.
   ============================================================ */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright');
const navegador = await chromium.launch();
for (const svg of process.argv.slice(2)) {
  const txt = readFileSync(svg, 'utf8');
  const ancho = +txt.match(/width="(\d+)"/)[1];
  const alto = +txt.match(/height="(\d+)"/)[1];
  const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 2 });
  await pagina.goto('file://' + svg);
  await pagina.evaluate(() => {
    const css = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    css.textContent = '*{animation:none!important}';
    document.documentElement.appendChild(css);
  });
  await pagina.waitForTimeout(400);
  await pagina.screenshot({ path: svg.replace(/\.svg$/, '.png') });
  await pagina.close();
  console.log(svg.split('/').pop(), '→', ancho * 2, '×', alto * 2);
}
await navegador.close();
