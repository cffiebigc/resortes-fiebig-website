const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { SITE_DIR, read } = require("./helpers");

function fontFaces(html) {
  return [...html.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((match) => match[1]);
}

test("no page loads third-party fonts", () => {
  for (const page of ["index.html", "404.html"]) {
    assert.doesNotMatch(read(page), /fonts\.(googleapis|gstatic)\.com/, page);
  }
});

test("every font face points to a published file and covers accents, ñ, ¿ and ¡", () => {
  const faces = fontFaces(read("index.html"));

  assert.equal(faces.length, 6);
  for (const face of faces) {
    const file = face.match(/url\("([^"]+)"\)/)[1];

    assert.ok(fs.existsSync(path.join(SITE_DIR, file)), file);
    assert.match(face, /unicode-range:[^;]*U\+0000-00FF/);
  }
});

test("the hero title font is preloaded", () => {
  const html = read("index.html");
  const preload = html.match(/<link rel="preload" href="([^"]+)" as="font" type="font\/woff2" crossorigin \/>/);
  const heroFace = fontFaces(html).find((face) => face.includes("Big Shoulders Display") && face.includes("900"));

  assert.ok(preload, "no font preload");
  assert.ok(heroFace.includes(preload[1]), preload[1]);
});
