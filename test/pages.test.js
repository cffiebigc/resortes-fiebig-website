const test = require("node:test");
const assert = require("node:assert/strict");
const { SITE_URL, read } = require("./helpers");

test("the 404 page is noindex and offers call, whatsapp and home", () => {
  const html = read("404.html");

  assert.match(html, /<meta name="robots" content="noindex" \/>/);
  assert.match(html, /href="tel:\+56652263566"/);
  assert.match(html, /href="https:\/\/wa\.me\/56995190145/);
  assert.match(html, /<a[^>]+href="\/"/);
});

// GitHub Pages serves 404.html at any missing path, e.g. /servicios/x/y, where relative paths break.
test("the 404 page only uses root-absolute local paths", () => {
  const localRefs = [...read("404.html").matchAll(/(?:href|src)="([^"#][^"]*)"/g)]
    .map((match) => match[1])
    .filter((url) => !/^(https?:|tel:|mailto:)/.test(url));

  assert.ok(localRefs.length > 0);
  for (const url of localRefs) assert.match(url, /^\//, url);
});

test("llms.txt states the canonical contact data and no prices", () => {
  const text = read("llms.txt");
  const facts = [
    SITE_URL,
    "+56 65 226 3566",
    "Génesis 39, Parque Industrial Recondo, Puerto Montt",
    "Lunes a viernes, 8:00 a 12:00 y 14:00 a 18:00",
  ];

  for (const fact of facts) assert.ok(text.includes(fact), fact);
  assert.doesNotMatch(text, /\$/);
});
