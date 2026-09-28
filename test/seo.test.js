const test = require("node:test");
const assert = require("node:assert/strict");
const { SITE_URL, read, attr } = require("./helpers");

const PUBLIC_FILES = ["index.html", "robots.txt", "sitemap.xml"];

test("no public file points at the apex domain", () => {
  for (const file of PUBLIC_FILES) {
    assert.doesNotMatch(read(file), /https?:\/\/resortesfiebig\.cl/, file);
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
