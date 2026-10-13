const test = require("node:test");
const assert = require("node:assert/strict");
const { htmlPages, read, visibleText } = require("./helpers");

function eachPage(check) {
  const pages = htmlPages();

  assert.ok(pages.length >= 2);
  for (const page of pages) check(page, visibleText(read(page)));
}

test("no published page states prices", () => {
  eachPage((page, text) => assert.doesNotMatch(text, /\$\s?\d|\bCLP\b|\bpesos\b|\bUF\b/i, page));
});

test("no published page promises a warranty for a period", () => {
  eachPage((page, text) => assert.doesNotMatch(text, /garant[ií]a de \d|\d+ (meses|años) de garant/i, page));
});

test("the turnaround is never phrased with the old wording", () => {
  eachPage((page, text) => assert.doesNotMatch(text, /tres cuartos de d[ií]a/i, page));
});

test("coil springs are only mentioned to rule them out", () => {
  eachPage((page, text) => {
    for (const sentence of text.split(/(?<=[.?!])\s+/)) {
      if (/espiral/i.test(sentence)) assert.match(sentence, /\bno\b/i, `${page}: ${sentence}`);
    }
  });
});
