const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SITE_DIR = path.join(ROOT, "_site");
const SITE_URL = "https://www.resortesfiebig.cl/";

// Tests read the published artifact, not the sources.
function read(file) {
  return fs.readFileSync(path.join(SITE_DIR, file), "utf8");
}

function readSource(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function attr(html, pattern) {
  const match = html.match(pattern);

  return match ? match[1] : null;
}

function htmlPages(dir = SITE_DIR) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) return htmlPages(full);

    return entry.name.endsWith(".html") ? [path.relative(SITE_DIR, full)] : [];
  });
}

// Visible text only: what a visitor or a crawler reads on the page.
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

// Undo the HTML escaping the templates apply, to compare published text with its data.
function decodeEntities(text) {
  return text
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

// Throws on invalid JSON, which is the point: search engines drop broken blocks silently.
function jsonLdBlocks(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  return blocks.map((match) => JSON.parse(match[1]));
}

module.exports = {
  ROOT,
  SITE_DIR,
  SITE_URL,
  read,
  readSource,
  attr,
  jsonLdBlocks,
  htmlPages,
  visibleText,
  decodeEntities,
};
