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

test("llms.txt states the canonical contact data", () => {
  const text = read("llms.txt");
  const facts = [
    SITE_URL,
    "+56 65 226 3566",
    "Génesis 39, Parque Industrial Recondo, Puerto Montt",
    "Lunes a viernes, 8:00 a 12:00 y 14:00 a 18:00",
  ];

  for (const fact of facts) assert.ok(text.includes(fact), fact);
});

test("llms.txt never states prices or warranty terms", () => {
  const text = read("llms.txt");

  assert.doesNotMatch(text, /\$|CLP|\bUF\b|pesos|\d{1,3}\.\d{3}/i);
  assert.doesNotMatch(text, /garant[ií]a/i);
});

test("llms.txt only mentions coil springs to rule them out", () => {
  const text = read("llms.txt");

  assert.equal(text.match(/espiral/gi).length, 1);
  assert.match(text, /No trabaja resortes espirales\./);
});
