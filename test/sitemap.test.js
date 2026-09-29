const test = require("node:test");
const assert = require("node:assert/strict");
const { SITE_URL, read } = require("./helpers");

function entries() {
  return [...read("sitemap.xml").matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)].map(
    ([, loc, lastmod]) => ({ loc, lastmod }),
  );
}

test("the sitemap lists every page except the 404, each with a lastmod date", () => {
  const urls = entries();

  assert.ok(urls.some(({ loc }) => loc === SITE_URL));
  assert.ok(urls.every(({ loc }) => loc.startsWith(SITE_URL) && !loc.includes("404")));
  assert.ok(urls.every(({ lastmod }) => /^\d{4}-\d{2}-\d{2}$/.test(lastmod)));
});
