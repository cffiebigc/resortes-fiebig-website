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

// Throws on invalid JSON, which is the point: search engines drop broken blocks silently.
function jsonLdBlocks(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  return blocks.map((match) => JSON.parse(match[1]));
}

module.exports = { ROOT, SITE_DIR, SITE_URL, read, readSource, attr, jsonLdBlocks };
