const test = require("node:test");
const assert = require("node:assert/strict");
const { read, htmlPages } = require("./helpers");
const services = require("../src/_data/services");

const FIXED_LOCATIONS = ["nav", "hero", "contacto", "barra-movil", "404", "preguntas"];
const SERVICE_LOCATIONS = services.map((service) => `servicio-${service.slug}`);
const isKnownLocation = (location) => [...FIXED_LOCATIONS, ...SERVICE_LOCATIONS].includes(location);

function expectedTrack(href) {
  if (href.startsWith("tel:")) return "call";
  if (href.startsWith("https://wa.me/")) return "whatsapp";
  if (href.startsWith("https://www.google.com/maps/")) return "directions";
  if (href.startsWith("mailto:")) return "email";

  return null;
}

test("every contact link declares its event type and location", () => {
  let checked = 0;

  for (const page of htmlPages()) {
    for (const [tag] of read(page).matchAll(/<a\b[^>]*>/g)) {
      const href = tag.match(/href="([^"]+)"/)?.[1] ?? "";
      const track = expectedTrack(href);

      if (!track) continue;

      checked += 1;
      assert.match(tag, new RegExp(`data-track="${track}"`), `${page}: ${tag}`);
      assert.ok(isKnownLocation(tag.match(/data-track-location="([^"]+)"/)?.[1]), `${page}: ${tag}`);
    }
  }

  assert.ok(checked >= 15, `only ${checked} contact links found`);
});

test("only contact links carry data-track", () => {
  for (const page of htmlPages()) {
    for (const [tag] of read(page).matchAll(/<a\b[^>]*data-track=[^>]*>/g)) {
      assert.ok(expectedTrack(tag.match(/href="([^"]+)"/)?.[1] ?? ""), `${page}: ${tag}`);
    }
  }
});

// Locations each part of a page may report; the main content depends on the page.
function expectedLocations(page) {
  if (page === "index.html") return { main: ["hero", "contacto"] };
  if (page === "404.html") return { main: ["404"] };
  if (page === "preguntas-frecuentes/index.html") return { main: ["preguntas"] };

  return { main: [`servicio-${page.split("/")[1]}`] };
}

function locations(html) {
  return [...html.matchAll(/data-track-location="([^"]+)"/g)].map((match) => match[1]);
}

test("each contact link reports the part of the page it sits in", () => {
  for (const page of htmlPages()) {
    const html = read(page);
    const header = html.match(/<header class="site-header">[\s\S]*?<\/header>/)[0];
    const main = html.match(/<main[\s\S]*?<\/main>/)[0];
    const bar = html.match(/<div class="cta-bar">[\s\S]*?<\/div>/)[0];

    assert.ok(
      locations(header).every((location) => location === "nav"),
      page,
    );
    assert.ok(
      locations(bar).every((location) => location === "barra-movil"),
      page,
    );
    assert.ok(locations(main).length > 0, page);
    assert.ok(
      locations(main).every((location) => expectedLocations(page).main.includes(location)),
      page,
    );
  }

  const [beforeContact, contact] = read("index.html").split('id="contacto"');

  assert.ok(locations(beforeContact.split("<main")[1]).every((location) => location === "hero"));
  assert.ok(locations(contact.split("</main>")[0]).every((location) => location === "contacto"));
});
