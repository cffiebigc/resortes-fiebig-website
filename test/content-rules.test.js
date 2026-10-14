const test = require("node:test");
const assert = require("node:assert/strict");
const { htmlPages, read, visibleText } = require("./helpers");

const RUT = /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/g;

// Visible text plus the title and meta contents, which also reach search results and link previews.
function publishedText(html) {
  const meta = [...html.matchAll(/<title>([^<]*)<\/title>|<meta [^>]*content="([^"]*)"/g)].map(
    (match) => match[1] ?? match[2],
  );

  return `${visibleText(html)} ${meta.join(" ")}`;
}

function eachPage(check) {
  const pages = htmlPages();

  assert.ok(pages.length >= 2);
  for (const page of pages) check(page, publishedText(read(page)));
}

test("no published page states prices", () => {
  eachPage((page, text) =>
    assert.doesNotMatch(
      text.replace(RUT, ""),
      /\$\s?\d|\bCLP\b|\bpesos\b|\bUF\b|\d+\s*mil\b|\b\d{1,3}(?:\.\d{3})+\b/i,
      page,
    ),
  );
});

// There is no warranty; the approved FAQ explains how a failure is handled without using the word.
test("no published page talks about a warranty", () => {
  eachPage((page, text) => assert.doesNotMatch(text, /garant[ií]a/i, page));
});

test("the turnaround is never phrased with the old wording", () => {
  eachPage((page, text) => assert.doesNotMatch(text, /tres cuartos de d[ií]a/i, page));
});

// A question may name them as long as the answer right after it says no.
test("coil springs are only mentioned to rule them out", () => {
  eachPage((page, text) => {
    const sentences = text.split(/(?<=[.?!])\s+/);

    sentences.forEach((sentence, index) => {
      if (!/espiral/i.test(sentence)) return;

      const denial = sentence.trim().endsWith("?")
        ? /^No\b/.test(sentences[index + 1] ?? "")
        : /\bno (?:las |los )?trabaja/i.test(sentence);

      assert.ok(denial, `${page}: ${sentence}`);
    });
  });
});
