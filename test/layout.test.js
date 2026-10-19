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
    const html = read(page);
    const refs = [
      ...[...html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)].map((match) => match[1]),
      ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((match) =>
        match[1].split(",").map((part) => part.trim().split(" ")[0]),
      ),
      ...[...html.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => match[1]),
    ];
    const localRefs = refs.filter((url) => !/^(https?:|tel:|mailto:|data:)/.test(url));

    assert.ok(localRefs.length > 0, page);
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

  // Same specificity: the reset only wins when it comes after the base rule.
  const base = css.indexOf("\n.site-footer {");
  const reset = css.search(/@media \(min-width: 70rem\) \{\s*\.site-footer \{\s*padding-bottom: 2\.5rem;/);

  assert.ok(reset > base, "the desktop footer reset comes before the base rule");
});

// The alt-text form of content (Safari 17.4+) is dropped whole by older browsers, which would lose the separator.
test("breadcrumb separators have a fallback for older browsers", () => {
  const rule = readSource("src/css/styles.css").match(/\.breadcrumb li \+ li::before \{([^}]*)\}/)[1];

  assert.match(rule, /content: "›";\s*content: "›" \/ "";/);
});

// Contact data lives only in src/_data/site.js: a copy in a template would go stale when it changes.
test("templates read contact data from site.js instead of repeating it", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const sources = (dir) =>
    fs.readdirSync(path.join(__dirname, "..", dir), { withFileTypes: true }).flatMap((entry) => {
      const file = path.join(dir, entry.name);

      if (entry.isDirectory()) return sources(file);

      return /\.(njk|js|txt)$/.test(entry.name) && file !== path.join("src", "_data", "site.js") ? [file] : [];
    });

  for (const file of sources("src")) {
    assert.doesNotMatch(
      readSource(file),
      /Génesis 39|G%C3%A9nesis|226 3566|226-3566|56652263566|9519 ?0145|56995190145|8:00 a 12:00 y 14:00|contacto@resortesfiebig/,
      file,
    );
  }
});
