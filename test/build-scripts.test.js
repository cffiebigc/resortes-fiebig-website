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
