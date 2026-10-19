const { execFileSync } = require("node:child_process");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");

function findBy(list, key, value) {
  const item = list.find((entry) => entry[key] === value);

  if (!item) throw new Error(`findBy: no item with ${key} = ${value}`);

  return item;
}

// JSON for a <script type="application/ld+json"> block: a "<" in the data could otherwise end the script.
function jsonLd(value, indent = 0) {
  return JSON.stringify(value, null, indent).replaceAll("<", "\\u003c");
}

function commitDate(file) {
  const seconds = execFileSync("git", ["log", "-1", "--format=%at", "--", file], { cwd: ROOT }).toString().trim();

  return seconds ? new Date(Number(seconds) * 1000) : null;
}

// A page changes when its template does (Eleventy's git date) or when the data it shows does.
function lastModified(date, files = []) {
  const dates = files.map(commitDate).filter(Boolean);

  return new Date(Math.max(date.getTime(), ...dates.map((day) => day.getTime())));
}

module.exports = { findBy, jsonLd, lastModified };
