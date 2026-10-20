// Iconos de línea (Tabler, licencia MIT) en verde Ways, blanco y grafito
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const tb = require('react-icons/tb');
const fs = require('fs');
const LIST = require('./iconlist.json');
(async () => {
  const missing = LIST.filter(([n]) => !tb[n]).map(([n]) => n);
  if (missing.length) console.log('faltan', missing.join(','));
  for (const [n] of LIST) {
    if (!tb[n]) continue;
    for (const [suf, col] of [['v', '#7AA606'], ['b', '#FFFFFF'], ['g', '#2E2E2D'], ['s', '#506718']]) {
      const svg = RDS.renderToStaticMarkup(React.createElement(tb[n], { size: 256, color: col, style: { strokeWidth: 1.6 } }));
      await sharp(Buffer.from(svg)).resize(256, 256).png().toFile(`icons/${n}-${suf}.png`);
    }
  }
  console.log('ok', fs.readdirSync('icons').length);
})();
