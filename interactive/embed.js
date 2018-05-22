var env = require('dotenv').config().parsed;
var manifest = require('./build/asset-manifest.json');
var fs = require('fs');

jsTemplate = `$$.getScript("$base$js");`;
const base = env["PUBLIC_URL"];
const css = manifest['main.css'];
const js = manifest['main.js'];

fs.writeFileSync('build/embed.js', `$.getScript("${base}${js}")`);
fs.writeFileSync('build/embed.css', `@import url("${base}${css}")`);

