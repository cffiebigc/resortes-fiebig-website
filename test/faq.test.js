const test = require("node:test");
const assert = require("node:assert/strict");
const { SITE_URL, read, attr, jsonLdBlocks, visibleText } = require("./helpers");
const faq = require("../src/_data/faq");

const PAGE = "preguntas-frecuentes/index.html";
const questions = () => faq.flatMap((group) => group.items);

test("the FAQ page is published with its own title, canonical and a single h1", () => {
  const html = read(PAGE);

  assert.equal(attr(html, /<link rel="canonical" href="([^"]+)"/), `${SITE_URL}preguntas-frecuentes/`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(read("sitemap.xml").includes(`<loc>${SITE_URL}preguntas-frecuentes/</loc>`));
});

test("the FAQPage structured data says exactly what the page shows", () => {
  const html = read(PAGE);
  const schema = jsonLdBlocks(html).find((block) => block["@type"] === "FAQPage");
  const shown = [...html.matchAll(/<h3>([^<]+)<\/h3>/g)].map((match) => match[1].replaceAll("&amp;", "&"));

  assert.deepEqual(
    schema.mainEntity.map((entry) => entry.name),
    shown,
  );
  assert.deepEqual(
    schema.mainEntity.map((entry) => entry.acceptedAnswer.text),
    questions().map((item) => item.a),
  );
});

test("the FAQ keeps the approved answers", () => {
  const text = visibleText(read(PAGE));

  assert.ok(questions().length >= 12 && questions().length <= 15);
  assert.ok(
    text.includes(
      "Tráelo al taller y evaluamos la falla. Si es de material, y no por sobrecarga o mal uso, respondemos por el repuesto. Si la causa no está clara, lo conversamos.",
    ),
  );
  assert.ok(text.includes("durante el día"));
  assert.ok(text.includes("Por transferencia o con tarjeta."));
});
