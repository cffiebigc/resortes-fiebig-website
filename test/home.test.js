const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { SITE_DIR, SITE_URL, read, htmlPages, jsonLdBlocks } = require("./helpers");
const services = require("../src/_data/services");

test("every home service card links to its published page", () => {
  const cards = [
    ...read("index.html").matchAll(/<article class="service">\s*<h3><a href="([^"]+)">([^<]+)<\/a><\/h3>/g),
  ];

  assert.deepEqual(
    cards.map(([, href, name]) => [href, name]),
    services.map((service) => [`/servicios/${service.slug}/`, service.card]),
  );
  for (const [, href] of cards) assert.ok(fs.existsSync(path.join(SITE_DIR, href, "index.html")), href);
});

test("every page links to the FAQ from the menu", () => {
  for (const page of htmlPages()) assert.match(read(page), /<a href="\/preguntas-frecuentes\/">Preguntas<\/a>/, page);
});

test("the home tells the turnaround and why it matters", () => {
  const html = read("index.html");

  assert.match(html.match(/<p class="hero__lead">([\s\S]*?)<\/p>/)[1], /durante el día/);
  assert.match(html, /<h3>Tu camión vuelve a trabajar rápido<\/h3>/);
});

test("the home offer catalog links each service to its page", () => {
  const business = jsonLdBlocks(read("index.html"))[0]["@graph"].find((node) => node["@type"] === "AutoRepair");

  assert.deepEqual(
    business.hasOfferCatalog.itemListElement.map((offer) => offer.itemOffered.url),
    services.map((service) => `${SITE_URL}servicios/${service.slug}/`),
  );
});

test("llms.txt lists every service page and the FAQ", () => {
  const text = read("llms.txt");

  for (const service of services) assert.ok(text.includes(`${SITE_URL}servicios/${service.slug}/`), service.slug);
  assert.ok(text.includes(`${SITE_URL}preguntas-frecuentes/`));
});

// On touch screens there is no hover, so each card needs a link that looks like one.
test("every home service card shows a visible link to its page", () => {
  const cards = read("index.html").split('<article class="service">').slice(1);

  assert.equal(cards.length, services.length);
  cards.forEach((card, index) => {
    assert.match(
      card,
      new RegExp(`<p class="service__more"><a href="/servicios/${services[index].slug}/">Ver servicio`),
    );
  });
});
