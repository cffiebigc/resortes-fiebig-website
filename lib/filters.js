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

// Null when git has no date for the file or is not available (e.g. a ZIP download): the template date stands.
function commitDate(file) {
  try {
    const seconds = execFileSync("git", ["log", "-1", "--format=%at", "--", file], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

    return seconds ? new Date(Number(seconds) * 1000) : null;
  } catch {
    return null;
  }
}

// A page changes when its template does (Eleventy's git date) or when the data it shows does.
function lastModified(date, files = []) {
  const dates = files.map(commitDate).filter(Boolean);

  return new Date(Math.max(date.getTime(), ...dates.map((day) => day.getTime())));
}

module.exports = { findBy, jsonLd, lastModified };
