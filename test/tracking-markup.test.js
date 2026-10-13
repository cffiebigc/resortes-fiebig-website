const test = require("node:test");
const assert = require("node:assert/strict");
const { read, htmlPages } = require("./helpers");

const FIXED_LOCATIONS = ["nav", "hero", "contacto", "barra-movil", "404", "preguntas"];
const isKnownLocation = (location) => FIXED_LOCATIONS.includes(location) || /^servicio-[a-z-]+$/.test(location ?? "");

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
