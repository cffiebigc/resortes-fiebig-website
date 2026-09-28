#!/usr/bin/env node
// Tells IndexNow (Bing and others) which URLs the site publishes. Runs after each deploy.
const fs = require("node:fs");
const path = require("node:path");

const HOST = "www.resortesfiebig.cl";
const ENDPOINT = "https://api.indexnow.org/indexnow";

function findKey(dir) {
  const files = fs.readdirSync(dir).filter((file) => /^[a-f0-9]{32}\.txt$/.test(file));

  if (files.length !== 1) throw new Error(`expected one IndexNow key in ${dir}, found ${files.length}`);

  return files[0].replace(".txt", "");
}

function urlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function payload(key, urlList) {
  return {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList,
  };
}

async function main() {
  const key = findKey(path.join(__dirname, "..", "src"));
  // The query skips the CDN copy of the previous deploy.
  const xml = await (await fetch(`https://${HOST}/sitemap.xml?v=${Date.now()}`)).text();
  const urls = urlsFromSitemap(xml);
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload(key, urls)),
  });

  console.log(`IndexNow answered ${response.status} for ${urls.length} URLs`);
  if (!response.ok) process.exit(1);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { findKey, urlsFromSitemap, payload };
