const test = require("node:test");
const assert = require("node:assert/strict");
const { SITE_URL, read, jsonLdBlocks } = require("./helpers");

const BUSINESS_ID = `${SITE_URL}#taller`;

function graph() {
  const blocks = jsonLdBlocks(read("index.html"));

  assert.equal(blocks.length, 1);

  return blocks[0]["@graph"];
}

function node(type) {
  return graph().find((item) => [].concat(item["@type"]).includes(type));
}

test("the business node has a stable id, www urls, a logo and its public profiles", () => {
  const business = node("AutoRepair");

  assert.equal(business["@id"], BUSINESS_ID);
  assert.equal(business.url, SITE_URL);
  assert.equal(business.logo, `${SITE_URL}assets/apple-touch-icon.png`);
  assert.equal(business.image, `${SITE_URL}assets/og.png`);
  assert.deepEqual(business.sameAs, ["https://www.facebook.com/resortes.fiebig"]);
});

test("no structured data node states prices", () => {
  assert.doesNotMatch(JSON.stringify(graph()), /price/i);
});

test("the offer catalog lists the six services shown on the page", () => {
  const html = read("index.html");
  const pageServices = [...html.matchAll(/<article class="service">\s*<h3>([^<]+)<\/h3>/g)].map((m) => m[1]);
  const catalog = node("AutoRepair").hasOfferCatalog.itemListElement.map((offer) => offer.itemOffered.name);

  assert.equal(pageServices.length, 6);
  assert.deepEqual(catalog, pageServices);
});

test("the website node names the business as publisher", () => {
  const website = node("WebSite");

  assert.equal(website.url, SITE_URL);
  assert.equal(website.inLanguage, "es-CL");
  assert.deepEqual(website.publisher, { "@id": BUSINESS_ID });
});
