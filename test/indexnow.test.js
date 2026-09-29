const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { SITE_DIR, read } = require("./helpers");

test("there is exactly one IndexNow key file and it contains its own key", () => {
  const keyFiles = fs.readdirSync(SITE_DIR).filter((file) => /^[a-f0-9]{32}\.txt$/.test(file));

  assert.equal(keyFiles.length, 1);
  assert.equal(read(keyFiles[0]), keyFiles[0].replace(".txt", ""));
});
