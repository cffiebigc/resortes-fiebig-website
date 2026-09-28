const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { ROOT, SITE_URL, read, readSource } = require("./helpers");
const { findKey, urlsFromSitemap, payload } = require("../scripts/indexnow");

test("the workflow tests before publishing and keeps the git history for sitemap dates", () => {
  const workflow = readSource(".github/workflows/deploy.yml");

  assert.match(workflow, /fetch-depth: 0/);
  assert.match(workflow, /path: _site/);
  assert.ok(workflow.indexOf("npm test") < workflow.indexOf("upload-pages-artifact"));
});

test("IndexNow is notified only after the deploy", () => {
  const workflow = readSource(".github/workflows/deploy.yml");

  assert.match(workflow, /indexnow:[\s\S]*needs: deploy[\s\S]*node scripts\/indexnow\.js/);
});

test("the IndexNow script finds the published key", () => {
  const key = findKey(path.join(ROOT, "src"));

  assert.equal(read(`${key}.txt`), key);
});

test("the IndexNow script sends every url of the sitemap", () => {
  assert.ok(urlsFromSitemap(read("sitemap.xml")).includes(SITE_URL));
});

test("the IndexNow payload names the host and where the key lives", () => {
  assert.deepEqual(payload("abc", [SITE_URL]), {
    host: "www.resortesfiebig.cl",
    key: "abc",
    keyLocation: "https://www.resortesfiebig.cl/abc.txt",
    urlList: [SITE_URL],
  });
});
