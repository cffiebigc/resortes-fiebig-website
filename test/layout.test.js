const test = require("node:test");
const assert = require("node:assert/strict");
const { read, readSource, htmlPages } = require("./helpers");

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
  assert.ok(navHrefs(read("index.html")).every((href) => /^#[a-z]+$|^\/[a-z-]+\/$/.test(href)));
  assert.ok(navHrefs(read("404.html")).every((href) => /^\/#[a-z]+$|^\/[a-z-]+\/$/.test(href)));
});

test("the 404 page carries the full site chrome", () => {
  const html = read("404.html");

  for (const part of ['class="site-header"', 'class="site-nav"', 'class="site-footer"', 'class="cta-bar"']) {
    assert.ok(html.includes(part), part);
  }
});

// Below the inline menu the phone lives inside the collapsed menu, so the call bar has to stay until then.
test("the mobile call bar stays visible until the inline menu with the phone appears", () => {
  const blocks = [...readSource("src/css/styles.css").matchAll(/@media \(min-width: ([\d.]+rem)\) \{([\s\S]*?)\n\}/g)];
  const hiddenFrom = (selector) =>
    blocks.find(([, , body]) => new RegExp(`${selector} \\{\\s*display: none;`).test(body))?.[1];

  assert.ok(hiddenFrom("\\.nav-toggle"));
  assert.equal(hiddenFrom("\\.cta-bar"), hiddenFrom("\\.nav-toggle"));
});

test("the nav marks the FAQ link as the current page only on the FAQ page", () => {
  const current = (html) =>
    [
      ...html
        .match(/<ul class="site-nav__list">([\s\S]*?)<\/ul>/)[1]
        .matchAll(/<a [^>]*aria-current="page"[^>]*>([^<]+)</g),
    ].map((match) => match[1]);

  for (const page of htmlPages()) {
    assert.deepEqual(current(read(page)), page === "preguntas-frecuentes/index.html" ? ["Preguntas"] : [], page);
  }
});

// The page background is light and the footer dark: room left for the fixed call bar on the body shows as a light strip.
test("the room for the mobile call bar belongs to the footer", () => {
  const css = readSource("src/css/styles.css");
  const desktop = [...css.matchAll(/@media \(min-width: 70rem\) \{([\s\S]*?)\n\}/g)].map((match) => match[1]).join("");

  assert.doesNotMatch(css, /\nbody \{\s*padding-bottom:/);
  assert.match(
    css.match(/\n\.site-footer \{([^}]*)\}/)[1],
    /padding-bottom: calc\(2\.5rem \+ 4\.5rem \+ env\(safe-area-inset-bottom\)\);/,
  );
  assert.match(desktop, /\.site-footer \{\s*padding-bottom: 2\.5rem;\s*\}/);
});
