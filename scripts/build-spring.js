#!/usr/bin/env node
// Prints the static SVG markup of the leaf-spring pack. Usage:
//   node scripts/build-spring.js hero    > hero markup
//   node scripts/build-spring.js diagram > services diagram (with callouts)
require("../js/spring.js");

const S = globalThis.SpringGeometry;
const variant = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "hero";
const sag = S.REST_SAG;
const f = (n) => Number(n.toFixed(1));
const rect = (cls, r, extra = "") =>
  `<rect class="${cls}" x="${f(r.x)}" y="${f(r.y)}" width="${f(r.width)}" height="${f(r.height)}" rx="2"${extra}/>`;

const leaves = [];
for (let i = 0; i < S.LEAVES; i += 1) {
  const cls = i === 0 ? "spring__leaf spring__leaf--main" : "spring__leaf";
  leaves.push(`<path class="${cls}" data-leaf="${i}" d="${S.leafPath(i, sag)}"/>`);
}

const eyes = [S.MAIN_X0 - 22, S.WIDTH - S.MAIN_X0 + 22]
  .map((cx) => `<circle class="spring__eye" cx="${cx}" cy="${S.EYE_Y}" r="${S.EYE_R}"/>`)
  .join("\n    ");

const clips = S.CLIP_X.map((x) => rect("spring__clip", S.clipRect(x, sag), ` data-clip="${x}"`)).join("\n    ");

const bolt = [
  rect("spring__bolt", S.boltRect(sag), ' data-bolt="shaft"'),
  rect("spring__bolt", S.boltHeadRect(sag), ' data-bolt="head"'),
  rect("spring__bolt", S.boltNutRect(sag), ' data-bolt="nut"'),
].join("\n    ");

const body = `  <g class="spring__leaves">
    ${leaves.join("\n    ")}
  </g>
  <g class="spring__eyes">
    ${eyes}
  </g>
  <g class="spring__bolt-group">
    ${bolt}
  </g>
  <g class="spring__clips">
    ${clips}
  </g>`;

const inject = process.argv.includes("--inject");

if (inject) {
  // handled below
} else if (variant === "hero") {
  console.log(`<svg class="spring" viewBox="0 0 ${S.WIDTH} ${S.HEIGHT}" preserveAspectRatio="xMidYMax meet" data-animate="hero" aria-hidden="true" focusable="false">
${body}
</svg>`);
} else {
  // Callouts: anchor (ax, ay) on the part, bubble (bx, by) in clear space.
  // Eyes up, main leaf on top, shorter leaves stacked below it.
  const g3 = S.leafGeometry(3, sag);
  const clip = S.clipRect(S.CLIP_X[1], sag);
  const callouts = [
    { n: 1, ax: 300, ay: S.leafY(0, sag, 300) - 7, bx: 300, by: 58 },
    { n: 2, ax: S.MAIN_X0 - 22, ay: S.EYE_Y - S.EYE_R - 6, bx: S.MAIN_X0 - 22, by: -22 },
    { n: 3, ax: g3.x1 + 4, ay: g3.endY, bx: 690, by: 250 },
    { n: 4, ax: S.CENTER, ay: S.boltHeadRect(sag).y - 2, bx: S.CENTER, by: 78 },
    { n: 5, ax: clip.x + clip.width + 2, ay: clip.y + clip.height / 2, bx: 800, by: 200 },
  ];
  const marks = callouts
    .map(
      (c) => `  <g class="spring__callout">
    <line x1="${f(c.ax)}" y1="${f(c.ay)}" x2="${f(c.bx)}" y2="${f(c.by)}"/>
    <circle cx="${f(c.bx)}" cy="${f(c.by)}" r="15"/>
    <text x="${f(c.bx)}" y="${f(c.by)}" dy="0.36em" text-anchor="middle">${c.n}</text>
  </g>`,
    )
    .join("\n");

  console.log(`<svg class="spring spring--diagram" viewBox="0 -45 ${S.WIDTH} 315" role="img" aria-labelledby="diagram-title">
  <title id="diagram-title">Partes de un paquete de resortes: hoja madre, ojos, hojas graduadas, perno centro y abrazaderas</title>
${body}
${marks}
</svg>`);
}

// --inject: rewrite index.html in place, replacing the blocks between
// <!-- spring:<variant>:start --> and <!-- spring:<variant>:end -->
if (process.argv.includes("--inject")) {
  const fs = require("fs");
  const path = require("path");
  const file = path.join(__dirname, "..", "index.html");
  let html = fs.readFileSync(file, "utf8");
  const { execFileSync } = require("child_process");

  for (const v of ["hero", "diagram"]) {
    const markup = execFileSync(process.execPath, [__filename, v]).toString().trim();
    const re = new RegExp(`(<!-- spring:${v}:start -->)[\\s\\S]*?(<!-- spring:${v}:end -->)`);

    html = html.replace(re, `$1\n${markup}\n$2`);
  }

  fs.writeFileSync(file, html);
  console.error("index.html updated");
}
