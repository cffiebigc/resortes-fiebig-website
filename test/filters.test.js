const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { ROOT, readSource } = require("./helpers");
const { findBy, jsonLd, lastModified } = require("../lib/filters");

const commitDate = (file) =>
  new Date(Number(execFileSync("git", ["log", "-1", "--format=%at", "--", file], { cwd: ROOT }).toString()) * 1000);

test("findBy returns the item whose key matches", () => {
  assert.deepEqual(findBy([{ slug: "a" }, { slug: "b" }], "slug", "b"), { slug: "b" });
});

// A typo in a related slug would otherwise publish a link to /servicios//.
test("findBy fails the build when nothing matches", () => {
  assert.throws(() => findBy([{ slug: "a" }], "slug", "nope"), /slug.*nope/);
});

test("jsonLd escapes < so a value can never close the script tag", () => {
  const value = { text: "</script><script>alert(1)</script>" };
  const out = jsonLd(value);

  assert.doesNotMatch(out, /</);
  assert.deepEqual(JSON.parse(out), value);
});

test("lastModified takes the newest of the page date and the data files it shows", () => {
  const data = commitDate("src/_data/services.js");
  const future = new Date("2100-01-01T00:00:00Z");

  assert.equal(lastModified(new Date(0), ["src/_data/services.js"]).getTime(), data.getTime());
  assert.equal(lastModified(future, ["src/_data/services.js"]).getTime(), future.getTime());
  assert.equal(lastModified(future).getTime(), future.getTime());
});

test("structured data goes through the escaping filter", () => {
  for (const file of ["business", "service", "faq"]) {
    const source = readSource(`src/_includes/schema/${file}.njk`);

    assert.doesNotMatch(source, /\|\s*dump/, file);
    assert.match(source, /\|\s*jsonLd/, file);
  }
});

// Today every date lands on the same day, so the sitemap test alone would not notice the filter going away.
test("the sitemap dates pages with the data they declare", () => {
  assert.match(readSource("src/sitemap.njk"), /entry\.date \| lastModified\(entry\.data\.dataSources\) \| isoDate/);
});

test("lastModified keeps the page date when git is not available", () => {
  const previous = process.env.GIT_DIR;
  const date = new Date("2026-01-01T00:00:00Z");

  process.env.GIT_DIR = "/nonexistent";
  try {
    assert.equal(lastModified(date, ["src/_data/services.js"]).getTime(), date.getTime());
  } finally {
    if (previous === undefined) delete process.env.GIT_DIR;
    else process.env.GIT_DIR = previous;
  }
});
