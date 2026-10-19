const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { SITE_DIR, SITE_URL, read, attr, jsonLdBlocks, visibleText, decodeEntities } = require("./helpers");
const services = require("../src/_data/services");
const faq = require("../src/_data/faq");
const site = require("../src/_data/site");

const pageOf = (service) => `servicios/${service.slug}/index.html`;
const urlOf = (service) => `${SITE_URL}servicios/${service.slug}/`;

test("there is one published page per service", () => {
  assert.equal(services.length, 6);
  for (const service of services) assert.ok(fs.existsSync(path.join(SITE_DIR, pageOf(service))), service.slug);
});

test("each service page has its own title, description, canonical and a single h1", () => {
  const titles = new Set();

  for (const service of services) {
    const html = read(pageOf(service));
    const title = attr(html, /<title>([^<]+)<\/title>/);

    assert.ok(service.title.length <= 60 && service.description.length <= 155, service.slug);
    assert.equal(attr(html, /<link rel="canonical" href="([^"]+)"/), urlOf(service));
    assert.equal((html.match(/<h1\b/g) || []).length, 1, service.slug);
    titles.add(title);
  }

  assert.equal(titles.size, services.length);
});

test("each service page opens WhatsApp with the message for that service", () => {
  for (const service of services) {
    const main = read(pageOf(service)).split("<main")[1];
    const href = main.match(/href="(https:\/\/wa\.me\/[^"]+)"/)[1].replaceAll("&amp;", "&");

    assert.equal(new URL(href).searchParams.get("text"), service.whatsapp, service.slug);
  }
});

test("each service page describes the service, its provider and its breadcrumb", () => {
  for (const service of services) {
    const html = read(pageOf(service));
    const graph = jsonLdBlocks(html).flatMap((block) => block["@graph"] ?? [block]);
    const node = graph.find((item) => item["@type"] === "Service");
    const crumbs = graph.find((item) => item["@type"] === "BreadcrumbList").itemListElement;
    const scripts = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g).join("");

    assert.equal(node.url, urlOf(service));
    assert.equal(node.provider["@id"], `${SITE_URL}#taller`);
    assert.deepEqual(
      crumbs.map((crumb) => [crumb.position, crumb.name, crumb.item]),
      [
        [1, "Inicio", SITE_URL],
        [2, "Servicios", `${SITE_URL}#servicios`],
        [3, service.card, urlOf(service)],
      ],
    );
    assert.doesNotMatch(scripts, /&amp;|price/i, service.slug);
  }
});

test("related links point to other published service pages", () => {
  const slugs = services.map((service) => service.slug);

  for (const service of services) {
    const html = read(pageOf(service));

    for (const related of service.related) {
      assert.ok(slugs.includes(related) && related !== service.slug, `${service.slug} → ${related}`);
      assert.ok(html.includes(`href="/servicios/${related}/"`), `${service.slug} → ${related}`);
    }
  }
});

test("every service page is in the sitemap", () => {
  const sitemap = read("sitemap.xml");

  for (const service of services) assert.ok(sitemap.includes(`<loc>${urlOf(service)}</loc>`), service.slug);
});

test("service titles and descriptions are escaped exactly once", () => {
  for (const service of services) {
    const html = read(pageOf(service));

    assert.equal(decodeEntities(attr(html, /<title>([^<]+)<\/title>/)), service.title);
    assert.equal(decodeEntities(attr(html, /<meta name="description" content="([^"]+)"/)), service.description);
    assert.equal(decodeEntities(attr(html, /<meta property="og:title" content="([^"]+)"/)), service.title);
  }
});

// The workshop installs parts as part of the repair; it does not sell them loose.
test("the parts page is framed as a repair service, not as a parts sale", () => {
  const parts = services.find((service) => service.slug === "bujes-pernos-y-abrazaderas");

  assert.match(parts.title, /^Cambio de/);
  assert.match(parts.h1, /^Cambio de/);
  assert.doesNotMatch(parts.intro, /Tenemos en el taller los repuestos/);
});

// Text of each breadcrumb item, in order, with its markup.
function breadcrumb(html) {
  const nav = html.match(/<nav class="breadcrumb"[^>]*>([\s\S]*?)<\/nav>/)[1];

  assert.match(nav, /^\s*<ol>/);

  return [...nav.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, item]) => ({
    text: decodeEntities(item.replace(/<[^>]+>/g, "").trim()),
    markup: item,
  }));
}

test("the visible breadcrumb matches the structured one and marks the current page", () => {
  for (const service of services) {
    const items = breadcrumb(read(pageOf(service)));

    assert.deepEqual(
      items.map((item) => item.text),
      ["Inicio", "Servicios", service.card],
      service.slug,
    );
    assert.match(items[0].markup, /href="\/"/);
    assert.match(items[1].markup, /href="\/#servicios"/);
    assert.match(items[2].markup, /aria-current="page"/);
    assert.doesNotMatch(items[2].markup, /href=/);
  }
});

test("questions shared with the FAQ page give the same answer", () => {
  const approved = new Map(faq.flatMap((group) => group.items).map((item) => [item.q, item.a]));
  let shared = 0;

  for (const service of services) {
    for (const { q, a } of service.faqs) {
      if (!approved.has(q)) continue;

      shared += 1;
      assert.equal(a, approved.get(q), `${service.slug}: ${q}`);
    }
  }

  assert.ok(shared > 0);
});

// Same-day turnaround is a selling point, but only for regular pickups and trucks.
test("service pages that promise same-day work say bigger jobs take longer", () => {
  let promised = 0;

  for (const service of services) {
    const text = visibleText(read(pageOf(service)));

    if (!text.includes("durante el día")) continue;

    promised += 1;
    assert.ok(text.includes("Los vehículos más grandes o los trabajos complicados toman más."), service.slug);
  }

  assert.ok(promised > 0);
});

test("a list item that points to another service links to it", () => {
  const html = read(pageOf(services.find((service) => service.slug === "fabricacion-de-paquetes-de-resortes")));
  const item = html.match(/<li>Necesitas más capacidad de carga[\s\S]*?<\/li>/)[0];

  assert.match(item, /\(ver <a href="\/servicios\/refuerzo-de-resortes\/">refuerzos<\/a>\)\.<\/li>$/);
});

function ctaBarWhatsapp(html) {
  const bar = html.match(/<div class="cta-bar">([\s\S]*?)<\/div>/)[1];

  return bar.match(/href="(https:\/\/wa\.me\/[^"]+)"/)[1].replaceAll("&amp;", "&");
}

test("the mobile call bar on a service page asks about that service", () => {
  for (const service of services) {
    assert.equal(
      new URL(ctaBarWhatsapp(read(pageOf(service)))).searchParams.get("text"),
      service.whatsapp,
      service.slug,
    );
  }

  assert.equal(ctaBarWhatsapp(read("index.html")), site.whatsapp);
});
