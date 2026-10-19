const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { ROOT, SITE_URL, read } = require("./helpers");
const services = require("../src/_data/services");

// Day (UTC) of the newest commit among the files, as Eleventy reads them from git.
function commitDay(...files) {
  const seconds = files.map((file) =>
    Number(execFileSync("git", ["log", "-1", "--format=%at", "--", file], { cwd: ROOT }).toString()),
  );

  return new Date(Math.max(...seconds) * 1000).toISOString().slice(0, 10);
}

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

test("the sitemap lists exactly the published pages, each dated by its template and the data it shows", () => {
  const expected = {
    [SITE_URL]: commitDay("src/index.njk", "src/_data/services.js", "src/_data/site.js"),
    [`${SITE_URL}preguntas-frecuentes/`]: commitDay(
      "src/preguntas-frecuentes.njk",
      "src/_data/faq.js",
      "src/_data/site.js",
    ),
  };

  for (const service of services) {
    expected[`${SITE_URL}servicios/${service.slug}/`] = commitDay(
      "src/servicios.njk",
      "src/_data/services.js",
      "src/_data/site.js",
    );
  }

  assert.deepEqual(Object.fromEntries(entries().map(({ loc, lastmod }) => [loc, lastmod])), expected);
});
