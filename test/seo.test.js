const test = require("node:test");
const assert = require("node:assert/strict");
const { SITE_URL, read, attr } = require("./helpers");

const PUBLIC_FILES = ["index.html", "404.html", "robots.txt", "sitemap.xml", "llms.txt", "README.md"];
const XML_NAMESPACES = /http:\/\/www\.(w3\.org|sitemaps\.org)\//g;

test("no public file points at the apex domain or at plain http", () => {
  for (const file of PUBLIC_FILES) {
    const text = read(file);

    assert.doesNotMatch(text, /https?:\/\/resortesfiebig\.cl/, file);
    assert.doesNotMatch(text.replace(XML_NAMESPACES, ""), /http:\/\//, file);
  }
});

test("canonical and og:url are the www home", () => {
  const html = read("index.html");

  assert.equal(attr(html, /<link rel="canonical" href="([^"]+)"/), SITE_URL);
  assert.equal(attr(html, /<meta property="og:url" content="([^"]+)"/), SITE_URL);
});

test("title leads with the search and fits in 60 characters", () => {
  const title = attr(read("index.html"), /<title>([^<]+)<\/title>/);

  assert.equal(title, "Paquetes de resortes en Puerto Montt | Resortes Fiebig");
  assert.ok(title.length <= 60);
});

test("robots.txt and the sitemap point at the www home", () => {
  assert.match(read("robots.txt"), /^Sitemap: https:\/\/www\.resortesfiebig\.cl\/sitemap\.xml$/m);
  assert.match(read("sitemap.xml"), /<loc>https:\/\/www\.resortesfiebig\.cl\/<\/loc>/);
});
