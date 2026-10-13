const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { SITE_DIR, SITE_URL, read, attr, jsonLdBlocks } = require("./helpers");
const services = require("../src/_data/services");

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
      crumbs.map((crumb) => crumb.item),
      [SITE_URL, urlOf(service)],
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
