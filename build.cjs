// Builds the public demo website (GitHub Pages) from the sample sites in C:/Projects/haven-nation/samples.
//   node build.cjs          → refreshes ./velvet-crema and ./aurelle
// The sample pages are written as page fragments (title, styles, then content), so each one is
// wrapped here into a full HTML document with the same small reset the preview viewer adds.
const fs = require("fs");
const path = require("path");
const here = __dirname;
const SAMPLES = "C:/Projects/haven-nation/samples";

const RESET = `<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>`;
function wrap(src) {
  const s = fs.readFileSync(src, "utf8")
    .replace(/^<meta charset="utf-8">\s*/i, "")
    .replace(/<meta name="claude:[^>]*>\s*/g, "");          // preview-viewer tag, not needed on a real site
  const cut = s.indexOf("</style>") + "</style>".length;     // title, metas, fonts and styles go in <head>
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${RESET}
${s.slice(0, cut)}
</head>
<body>
${s.slice(cut).trim()}
</body>
</html>
`;
}
function copyDir(from, to, skip = () => false) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const a = path.join(from, f), b = path.join(to, f);
    if (skip(f)) continue;
    if (fs.statSync(a).isDirectory()) copyDir(a, b, skip); else fs.copyFileSync(a, b);
  }
}

// Velvet & Crema (café)
const cafe = path.join(here, "velvet-crema");
fs.rmSync(cafe, { recursive: true, force: true });
copyDir(`${SAMPLES}/cafe/site/media`, path.join(cafe, "media"));
fs.writeFileSync(path.join(cafe, "index.html"), wrap(`${SAMPLES}/cafe/site/index.html`));

// Aurelle Residences (luxury real estate)
const aur = path.join(here, "aurelle");
fs.rmSync(aur, { recursive: true, force: true });
copyDir(`${SAMPLES}/aurelle-luxury/img`, path.join(aur, "img"));
fs.writeFileSync(path.join(aur, "index.html"), wrap(`${SAMPLES}/aurelle-luxury/index.html`));

console.log("built velvet-crema and aurelle");
