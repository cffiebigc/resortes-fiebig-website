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

// Every request gives up after this long, so a hung server cannot stall the deploy run.
const TIMEOUT_MS = 15000;

// The sitemap failing means the published site is broken (throws: the run goes red);
// IndexNow failing is a third-party hiccup (warns: the run stays green).
async function notify({ fetch = globalThis.fetch, log = console } = {}) {
  const key = findKey(path.join(__dirname, "..", "src"));
  // The query skips the CDN copy of the previous deploy.
  const sitemap = await fetch(`https://${HOST}/sitemap.xml?v=${Date.now()}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!sitemap.ok) throw new Error(`the sitemap answered ${sitemap.status}`);

  const urls = urlsFromSitemap(await sitemap.text()).filter((url) => url.startsWith(`https://${HOST}/`));

  if (urls.length === 0) throw new Error("the sitemap has no URLs of the site");

  let response;

  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload(key, urls)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    log.warn(`::warning::IndexNow did not answer: ${error.message}`);

    return null;
  }

  if (response.ok) log.log(`IndexNow answered ${response.status} for ${urls.length} URLs`);
  else log.warn(`::warning::IndexNow answered ${response.status} for ${urls.length} URLs`);

  return response.status;
}

if (require.main === module) {
  notify().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { findKey, urlsFromSitemap, payload, notify };
