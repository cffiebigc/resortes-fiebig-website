const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { ROOT, readSource } = require("./helpers");

function springMarkup(variant) {
  return execFileSync(process.execPath, [path.join(ROOT, "scripts", "build-spring.js"), variant])
    .toString()
    .trim();
}

test("the spring partials match what build-spring generates", () => {
  for (const variant of ["hero", "diagram"]) {
    assert.equal(readSource(`src/_includes/partials/spring-${variant}.njk`).trim(), springMarkup(variant), variant);
  }
});

test("build-spring --write targets the partials, not index.html", () => {
  const source = readSource("scripts/build-spring.js");

  assert.match(source, /src\/_includes\/partials|"_includes", "partials"/);
  assert.doesNotMatch(source, /"index\.html"/);
});

test("build-logo writes its assets and the mark partial under src", () => {
  const source = readSource("scripts/build-logo.js");

  assert.match(source, /"src", "assets"|src\/assets/);
  assert.match(source, /logo-mark\.njk/);
  assert.doesNotMatch(source, /"index\.html"/);
});

const fs = require("node:fs");
const os = require("node:os");
const { removeOrphans } = require("../scripts/fetch-fonts");

// When Google ships new font versions the old files would otherwise stay published forever.
test("fetch-fonts removes woff2 files the new @font-face no longer uses", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fonts-"));

  for (const name of ["keep.woff2", "old.woff2", "OFL-archivo.txt"]) fs.writeFileSync(path.join(dir, name), "");

  assert.deepEqual(removeOrphans(dir, ["keep.woff2"]), ["old.woff2"]);
  assert.deepEqual(fs.readdirSync(dir).sort(), ["OFL-archivo.txt", "keep.woff2"]);
});

// A run that fails halfway must not leave fonts.css pointing at files it already deleted.
test("fetch-fonts deletes old files only after writing the new @font-face", () => {
  const source = readSource("scripts/fetch-fonts.js");
  const main = source.slice(source.indexOf("async function main"));

  assert.ok(main.indexOf("removeOrphans(") > main.indexOf('"fonts.css"'));
  assert.ok(main.indexOf("removeOrphans(") > main.indexOf('"fonts.json"'));
});
