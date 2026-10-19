const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { SITE_DIR, read } = require("./helpers");

test("there is exactly one IndexNow key file and it contains its own key", () => {
  const keyFiles = fs.readdirSync(SITE_DIR).filter((file) => /^[a-f0-9]{32}\.txt$/.test(file));

  assert.equal(keyFiles.length, 1);
  assert.equal(read(keyFiles[0]), keyFiles[0].replace(".txt", ""));
});

const { notify } = require("../scripts/indexnow");

const SITEMAP = `<urlset><url><loc>https://www.resortesfiebig.cl/</loc></url>
<url><loc>https://www.resortesfiebig.cl/preguntas-frecuentes/</loc></url></urlset>`;

// A fetch double: answers the sitemap and IndexNow from the given replies and records each call.
function fakeFetch({ sitemap = { status: 200, body: SITEMAP }, indexnow = { status: 200 } } = {}) {
  const calls = [];
  const fetch = async (url, options = {}) => {
    calls.push({ url, options });
    const reply = url.includes("sitemap.xml") ? sitemap : indexnow;

    if (reply instanceof Error) throw reply;

    return { ok: reply.status >= 200 && reply.status < 300, status: reply.status, text: async () => reply.body ?? "" };
  };

  return { fetch, calls };
}

function fakeLog() {
  const lines = { log: [], warn: [] };

  return { lines, log: (line) => lines.log.push(line), warn: (line) => lines.warn.push(line) };
}

test("notify sends the sitemap URLs to IndexNow, with a timeout on every request", async () => {
  const { fetch, calls } = fakeFetch();
  const log = fakeLog();

  assert.equal(await notify({ fetch, log }), 200);
  assert.deepEqual(JSON.parse(calls[1].options.body).urlList, [
    "https://www.resortesfiebig.cl/",
    "https://www.resortesfiebig.cl/preguntas-frecuentes/",
  ]);
  for (const call of calls) assert.ok(call.options.signal instanceof AbortSignal, call.url);
  assert.deepEqual(log.lines.warn, []);
});

// A broken sitemap right after a deploy means the published site is broken: the run has to go red.
test("notify fails when the published sitemap is missing or empty", async () => {
  await assert.rejects(
    notify({ fetch: fakeFetch({ sitemap: { status: 404 } }).fetch, log: fakeLog() }),
    /sitemap.*404/,
  );
  await assert.rejects(
    notify({ fetch: fakeFetch({ sitemap: { status: 200, body: "<html></html>" } }).fetch, log: fakeLog() }),
    /no URLs/,
  );
});

// IndexNow being down says nothing about the site, so it only warns.
test("notify only warns when IndexNow rejects or does not answer", async () => {
  for (const indexnow of [{ status: 503 }, new Error("The operation was aborted due to timeout")]) {
    const log = fakeLog();

    await notify({ fetch: fakeFetch({ indexnow }).fetch, log });
    assert.equal(log.lines.warn.length, 1);
    assert.match(log.lines.warn[0], /^::warning::IndexNow/);
  }
});
