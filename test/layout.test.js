const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { SITE_DIR, read } = require("./helpers");

function htmlPages(dir = SITE_DIR) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) return htmlPages(full);

    return entry.name.endsWith(".html") ? [path.relative(SITE_DIR, full)] : [];
  });
}

function navHrefs(html) {
  const list = html.match(/<ul class="site-nav__list">([\s\S]*?)<\/ul>/)[1];

  return [...list.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
}

// Pages can live at any depth (and the 404 is served at any missing path), so relative paths break.
test("every page only uses root-absolute local paths", () => {
  for (const page of htmlPages()) {
    const localRefs = [...read(page).matchAll(/(?:href|src)="([^"#][^"]*)"/g)]
      .map((match) => match[1])
      .filter((url) => !/^(https?:|tel:|mailto:)/.test(url));

    for (const url of localRefs) assert.match(url, /^\//, `${page}: ${url}`);
  }
});

test("the home nav scrolls to its sections and other pages link back to them", () => {
  assert.ok(navHrefs(read("index.html")).every((href) => /^#[a-z]+$/.test(href)));
  assert.ok(navHrefs(read("404.html")).every((href) => /^\/#[a-z]+$/.test(href)));
});

test("the 404 page carries the full site chrome", () => {
  const html = read("404.html");

  for (const part of ['class="site-header"', 'class="site-nav"', 'class="site-footer"', 'class="cta-bar"']) {
    assert.ok(html.includes(part), part);
  }
});
