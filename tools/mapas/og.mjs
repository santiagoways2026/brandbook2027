/* ============================================================
   Genera la imagen para redes (og:image) de /es/mapa-camino-de-santiago/.

       node tools/mapas/og.mjs

   Facebook, LinkedIn y WhatsApp no aceptan SVG en og:image: hace falta un JPG.
   Monta una tarjeta de 1200 × 630 con el mapa general a la derecha y el titular
   a la izquierda, espera a que termine la animación y la fotografía con Playwright.
   Necesita las fuentes en tools/mapas/.cache/fuentes (las baja el LEEME).
   ============================================================ */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..');
const FUENTES = join(AQUI, '.cache', 'fuentes');
const MAPA = join(RAIZ, 'salidas', 'mapa-camino-de-santiago', 'mapas', 'mapa-caminos-de-santiago.svg');
const SALIDA = join(RAIZ, 'salidas', 'mapa-camino-de-santiago', 'og-mapa-camino-de-santiago.jpg');
const concha = readFileSync(join(AQUI, 'concha.svg'), 'utf8').match(/ d="([^"]+)"/)[1];

const fuente = (peso) =>
  `@font-face{font-family:M;font-weight:${peso};src:url(file://${FUENTES}/montserrat-latin-${peso}-normal.woff2)}`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fuente(500)}${fuente(700)}${fuente(800)}
body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:M;background:#fff;color:#2E2E2D;position:relative}
.mapa{position:absolute;right:0;top:-40px;width:640px}
.velo{position:absolute;left:560px;top:0;width:120px;height:630px;background:linear-gradient(90deg,#fff,rgba(255,255,255,0))}
.techo{position:absolute;left:560px;top:0;width:640px;height:50px;background:linear-gradient(180deg,#fff 82%,rgba(255,255,255,0))}
.txt{position:absolute;left:64px;top:96px;width:520px}
.barra{width:48px;height:6px;border-radius:3px;background:#7AA606;margin-bottom:22px}
.ante{font-weight:700;font-size:16px;letter-spacing:.15em;color:#506718;text-transform:uppercase}
h1{font-weight:800;font-size:56px;line-height:1.05;margin:14px 0 22px}
p{font-weight:500;font-size:22px;line-height:1.4;color:#6F6F6E;margin:0}
.pie{position:absolute;left:64px;bottom:56px;font-weight:700;font-size:18px;color:#506718}
svg{position:absolute;left:64px;bottom:96px;width:64px}
</style></head><body>
<img class="mapa" src="file://${MAPA}"><div class="velo"></div><div class="techo"></div>
<div class="txt"><div class="barra"></div><div class="ante">Mapa del Camino de Santiago</div>
<h1>Todas las rutas, una a una</h1><p>Ocho itinerarios con su perfil de altitud y su track GPX para descargar.</p></div>
<svg viewBox="0 0 100 82.6"><path fill="#7AA606" fill-rule="evenodd" d="${concha}"/></svg>
<div class="pie">santiagoways.com</div>
</body></html>`;

const tmp = join(mkdtempSync(join(tmpdir(), 'og-')), 'og.html');
writeFileSync(tmp, html);
const { chromium } = createRequire(import.meta.url)('playwright');
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.goto('file://' + tmp);
await pagina.waitForTimeout(6500); // la animación del mapa termina a los 5 s
await pagina.screenshot({ path: SALIDA, type: 'jpeg', quality: 88 });
await navegador.close();
console.log('og-mapa-camino-de-santiago.jpg escrita');
