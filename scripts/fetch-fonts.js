#!/usr/bin/env node
// Downloads the latin subset of the site's Google Fonts once, so the site serves them itself.
// Writes src/assets/fonts/, the inline @font-face partial and src/_data/fonts.json (files to preload).
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Archivo:wght@400;500;600&display=swap";
// A current browser user agent makes Google Fonts answer with woff2 files split by unicode-range.
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
// The hero title is the LCP element.
const PRELOAD = [{ family: "Big Shoulders Display", weight: "900" }];
const LICENSES = {
  "OFL-big-shoulders-display.txt":
    "https://raw.githubusercontent.com/google/fonts/main/ofl/bigshouldersdisplay/OFL.txt",
  "OFL-archivo.txt": "https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/OFL.txt",
};

async function download(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });

  if (!response.ok) throw new Error(`${response.status} ${url}`);

  return response;
}

async function main() {
  const css = await (await download(CSS_URL)).text();
  const faces = [...css.matchAll(/\/\* latin \*\/\s*@font-face\s*\{([^}]*)\}/g)].map(([, body]) => ({
    family: body.match(/font-family:\s*'([^']+)'/)[1],
    weight: body.match(/font-weight:\s*(\d+)/)[1],
    url: body.match(/src:\s*url\((https:[^)]+\.woff2)\)/)[1],
    range: body.match(/unicode-range:\s*([^;]+);/)[1].trim(),
  }));

  if (faces.length !== 6) throw new Error(`expected 6 latin faces, got ${faces.length}`);

  const dir = path.join(ROOT, "src", "assets", "fonts");

  fs.mkdirSync(dir, { recursive: true });

  for (const face of faces) {
    const name = path.basename(new URL(face.url).pathname);

    face.file = `/assets/fonts/${name}`;
    if (!fs.existsSync(path.join(dir, name))) {
      fs.writeFileSync(path.join(dir, name), Buffer.from(await (await download(face.url)).arrayBuffer()));
    }
  }

  for (const [name, url] of Object.entries(LICENSES)) {
    fs.writeFileSync(path.join(dir, name), await (await download(url)).text());
  }

  const rules = faces.map(
    (face) =>
      `@font-face {\n  font-family: "${face.family}";\n  font-style: normal;\n  font-weight: ${face.weight};\n` +
      `  font-display: swap;\n  src: url("${face.file}") format("woff2");\n  unicode-range: ${face.range};\n}`,
  );
  const preload = PRELOAD.map(
    ({ family, weight }) => faces.find((f) => f.family === family && f.weight === weight).file,
  );

  fs.writeFileSync(path.join(ROOT, "src", "_includes", "partials", "fonts.css"), `${rules.join("\n")}\n`);
  fs.writeFileSync(path.join(ROOT, "src", "_data", "fonts.json"), `${JSON.stringify({ preload }, null, 2)}\n`);
  console.error(`${faces.length} faces, preload: ${preload.join(", ")}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
