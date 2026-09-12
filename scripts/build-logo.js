#!/usr/bin/env node
// Builds the Resortes Fiebig mark and lockup as SVG.
//
// The mark modernises the original Fiebig logo, which stacks three things:
// a half gear on top, the leaf-spring pack across the middle and an anvil at
// the bottom carrying the city name. The same three pieces are kept, drawn as
// flat vector shapes in the same orientation as the hero spring (eyes up,
// main leaf on top).
//
// Outputs:
//   assets/logo-mark.svg   mark, light background
//   assets/logo.svg        horizontal lockup, light background (text as paths)
//   assets/logo-dark.svg   horizontal lockup, dark background
//   assets/favicon.svg     mark on a dark rounded square
// and rewrites the <!-- logo:mark:start/end --> blocks in index.html.
//
// Requires `npm install` (opentype.js). Fonts are fetched from Google Fonts
// into scripts/.fonts on first run.
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");

const ROOT = path.join(__dirname, "..");
const FONT_DIR = path.join(__dirname, ".fonts");
const FONT_UA = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0";
const FONTS = {
  display: {
    family: "Big Shoulders Display",
    weight: 800,
    file: "big-shoulders-display-800.woff",
  },
  body: { family: "Archivo", weight: 500, file: "archivo-500.woff" },
};

const COLORS = {
  light: {
    gear: "#33414d",
    anvil: "#1e2a35",
    spring: "#e8651a",
    text: "#1e2a35",
    subtext: "#55636f",
  },
  dark: {
    gear: "#b9c3cc",
    anvil: "#ffffff",
    spring: "#e8651a",
    text: "#ffffff",
    subtext: "#b9c3cc",
  },
};

const f = (n) => Number(n.toFixed(2));

// Mark geometry, in a 120 x 120 box ------------------------------------------

const BOX = 120;
const GEAR = { cx: 60, cy: 58, outer: 50, root: 44, hole: 33, teeth: 10 };
// Three leaves on one parabola family: eyes on the gear's base line, main leaf
// on top, shorter leaves stacked below.
const SPRING = { eyeY: 58, eyeX: [11, 109], sag: 20, step: 8.5, thickness: 5.5, eyeR: 5, eyeStroke: 4.5 };

function polar(cx, cy, r, angle) {
  return [f(cx + r * Math.cos(angle)), f(cy + r * Math.sin(angle))];
}

// Upper half of a ring gear: toothed outer edge from 180° to 360°, straight
// cut along the diameter, inner arc back.
function gearPath() {
  const { cx, cy, outer, root, hole, teeth } = GEAR;
  const pitch = Math.PI / teeth;
  const tipHalf = pitch * 0.2;
  const rootHalf = pitch * 0.3;
  const pts = [polar(cx, cy, root, Math.PI)];

  for (let j = 0; j < teeth; j += 1) {
    const a = Math.PI + (j + 0.5) * pitch;

    pts.push(polar(cx, cy, root, a - rootHalf));
    pts.push(polar(cx, cy, outer, a - tipHalf));
    pts.push(polar(cx, cy, outer, a + tipHalf));
    pts.push(polar(cx, cy, root, a + rootHalf));
  }

  pts.push(polar(cx, cy, root, 2 * Math.PI));
  const outerEdge = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const [ix, iy] = polar(cx, cy, hole, 2 * Math.PI);
  const [jx, jy] = polar(cx, cy, hole, Math.PI);

  return `${outerEdge} L${ix} ${iy} A${hole} ${hole} 0 0 0 ${jx} ${jy} Z`;
}

// Classic anvil, horn to the left.
function anvilPath() {
  return "M96 97 H40 L18 101 L40 106 H46 V111 H32 V120 H100 V111 H88 V106 H96 Z";
}

function springMarkup(cls) {
  const cx = BOX / 2;
  const mainHalf = cx - SPRING.eyeX[0] - SPRING.eyeR - 1;
  const k = SPRING.sag / (mainHalf * mainHalf);
  const leaves = [];

  for (let i = 0; i < 3; i += 1) {
    const half = mainHalf - 14 * i;
    const vertexY = SPRING.eyeY + SPRING.sag + SPRING.step * i;
    const endY = vertexY - k * half * half;
    const ctrlY = vertexY + k * half * half;

    leaves.push(
      `<path class="${cls}__leaf" d="M${f(cx - half)} ${f(endY)} Q${cx} ${f(ctrlY)} ${f(cx + half)} ${f(endY)}"/>`,
    );
  }

  const eyes = SPRING.eyeX
    .map((x) => `<circle class="${cls}__eye" cx="${x}" cy="${SPRING.eyeY}" r="${SPRING.eyeR}"/>`)
    .join("");

  return `<g fill="none" stroke-linecap="round">${leaves.join("")}${eyes}</g>`;
}

function markMarkup(cls = "logo") {
  return [
    `<path class="${cls}__gear" d="${gearPath()}"/>`,
    `<path class="${cls}__anvil" d="${anvilPath()}"/>`,
    springMarkup(cls),
  ].join("\n");
}

function markStyle(theme, cls = "logo") {
  const c = COLORS[theme];

  return `.${cls}__gear{fill:${c.gear}}.${cls}__anvil{fill:${c.anvil}}.${cls}__leaf{stroke:${c.spring};stroke-width:${SPRING.thickness}}.${cls}__eye{stroke:${c.spring};stroke-width:${SPRING.eyeStroke}}`;
}

// Text as paths --------------------------------------------------------------

async function loadFont(key) {
  const spec = FONTS[key];
  const file = path.join(FONT_DIR, spec.file);

  if (!fs.existsSync(file)) {
    fs.mkdirSync(FONT_DIR, { recursive: true });
    const family = spec.family.replace(/ /g, "+");
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${spec.weight}`, {
      headers: { "User-Agent": FONT_UA },
    }).then((r) => r.text());
    const url = css.match(/url\((https:[^)]+)\)/)[1];
    const bytes = await fetch(url).then((r) => r.arrayBuffer());

    fs.writeFileSync(file, Buffer.from(bytes));
  }

  return opentype.parse(fs.readFileSync(file).buffer.slice(0));
}

function textPath(font, text, x, y, size, letterSpacing = 0) {
  const p = font.getPath(text, x, y, size, { kerning: true, letterSpacing });

  return {
    d: p.toPathData(2),
    width: font.getAdvanceWidth(text, size, { kerning: true, letterSpacing }),
  };
}

// Files ----------------------------------------------------------------------

function markSvg(theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX} ${BOX}" role="img" aria-label="Resortes Fiebig">
<style>${markStyle(theme)}</style>
${markMarkup()}
</svg>
`;
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX} ${BOX}">
<style>${markStyle("dark")}</style>
<rect width="${BOX}" height="${BOX}" rx="20" fill="#1e2a35"/>
<g transform="translate(9 9) scale(0.85)">
${markMarkup()}
</g>
</svg>
`;
}

function lockupSvg(theme, fonts) {
  const c = COLORS[theme];
  const gap = 22;
  const title = textPath(fonts.display, "RESORTES FIEBIG", BOX + gap, 66, 66, 0.01);
  const sub = textPath(fonts.body, "Fábrica de resortes, Puerto Montt", BOX + gap + 1, 94, 19);
  const width = f(BOX + gap + Math.max(title.width, sub.width) + 8);
  const bg = theme === "dark" ? `<rect width="${width}" height="${BOX}" fill="#1e2a35"/>\n` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${BOX}" role="img" aria-label="Resortes Fiebig, fábrica de resortes, Puerto Montt">
<style>${markStyle(theme)}</style>
${bg}${markMarkup()}
<path fill="${c.text}" d="${title.d}"/>
<path fill="${c.subtext}" d="${sub.d}"/>
</svg>
`;
}

function injectInline() {
  const file = path.join(ROOT, "index.html");
  let html = fs.readFileSync(file, "utf8");
  const markup = `<svg class="logo" viewBox="0 0 ${BOX} ${BOX}" aria-hidden="true" focusable="false">\n${markMarkup()}\n</svg>`;
  const re = /(<!-- logo:mark:start -->)[\s\S]*?(<!-- logo:mark:end -->)/g;
  let count = 0;

  html = html.replace(re, () => {
    count += 1;

    return `<!-- logo:mark:start -->\n${markup}\n<!-- logo:mark:end -->`;
  });
  fs.writeFileSync(file, html);
  console.error(`index.html: ${count} mark block(s) updated`);
}

async function main() {
  const fonts = {
    display: await loadFont("display"),
    body: await loadFont("body"),
  };
  const out = (name, content) => {
    fs.writeFileSync(path.join(ROOT, "assets", name), content);
    console.error(`assets/${name}`);
  };

  out("logo-mark.svg", markSvg("light"));
  out("logo.svg", lockupSvg("light", fonts));
  out("logo-dark.svg", lockupSvg("dark", fonts));
  out("favicon.svg", faviconSvg());
  injectInline();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
