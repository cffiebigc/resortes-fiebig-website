const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { ROOT, read } = require("./helpers");

const GA_ID = "G-QXR092YVYG";
const PRODUCTION_HOST = "www.resortesfiebig.cl";

// Runs js/analytics.js against a minimal fake browser and exposes what it did.
function load(hostname, { withoutHasOwn = false } = {}) {
  const source = fs.readFileSync(path.join(ROOT, "js", "analytics.js"), "utf8");
  const appended = [];
  const listeners = {};
  const window = { location: { hostname } };
  const document = {
    head: { appendChild: (element) => appended.push(element) },
    createElement: (tagName) => ({ tagName }),
    addEventListener: (type, handler) => {
      listeners[type] = handler;
    },
  };

  const context = vm.createContext({ window, document });

  if (withoutHasOwn) vm.runInContext("delete Object.hasOwn;", context);
  vm.runInContext(source, context);

  function click(target) {
    const event = {
      target,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };

    listeners.click(event);

    return event;
  }

  // Values built inside the vm carry its prototypes; a JSON round trip makes them comparable.
  function events() {
    const calls = (window.dataLayer || []).map((args) => Array.from(args)).filter((args) => args[0] === "event");

    return JSON.parse(JSON.stringify(calls));
  }

  return { window, appended, listeners, click, events };
}

// A click target inside a tracked link, e.g. its <svg> icon: closest() finds the <a>.
function insideLink(dataset) {
  const link = { dataset };

  return {
    closest: (selector) => (selector === "a[data-track]" ? link : null),
  };
}

test("loads the Google tag once on the production host", () => {
  const { appended } = load(PRODUCTION_HOST);

  assert.equal(appended.length, 1);
  assert.equal(appended[0].async, true);
  assert.equal(appended[0].src, `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
});

for (const hostname of ["localhost", "127.0.0.1", "cffiebigc.github.io", "resortesfiebig.cl"]) {
  test(`loads and listens to nothing on ${hostname}`, () => {
    const { appended, listeners } = load(hostname);

    assert.equal(appended.length, 0);
    assert.equal(listeners.click, undefined);
  });
}

// gtag.js only treats dataLayer entries that are Arguments objects as commands; a rest-args refactor would silently stop GA.
test("queues the js and config commands as Arguments objects", () => {
  const { window } = load(PRODUCTION_HOST);
  const [js, config] = window.dataLayer;

  for (const entry of [js, config]) assert.equal(Object.prototype.toString.call(entry), "[object Arguments]");
  assert.equal(js[0], "js");
  assert.equal(Object.prototype.toString.call(js[1]), "[object Date]");
  assert.deepEqual(Array.from(config), ["config", GA_ID]);
});

// iOS 12 Safari (iPhone 5s and 6) has no Object.hasOwn.
test("tracks clicks on engines without Object.hasOwn", () => {
  const { click, events } = load(PRODUCTION_HOST, { withoutHasOwn: true });

  click(insideLink({ track: "whatsapp", trackLocation: "hero" }));

  assert.equal(events()[0][1], "click_whatsapp");
});

const EVENTS = [
  ["call", "click_call"],
  ["whatsapp", "click_whatsapp"],
  ["directions", "click_directions"],
  ["email", "click_email"],
];

for (const [track, eventName] of EVENTS) {
  test(`a click inside a ${track} link sends ${eventName} with its location`, () => {
    const { click, events } = load(PRODUCTION_HOST);

    click(insideLink({ track, trackLocation: "hero" }));

    assert.deepEqual(events(), [["event", eventName, { link_location: "hero", transport_type: "beacon" }]]);
  });
}

test("a link without location is reported as desconocida", () => {
  const { click, events } = load(PRODUCTION_HOST);

  click(insideLink({ track: "call" }));

  assert.equal(events()[0][2].link_location, "desconocida");
});

test("clicks outside tracked links and unknown types send nothing", () => {
  const { click, events } = load(PRODUCTION_HOST);

  click({ closest: () => null });
  click(insideLink({ track: "constructor", trackLocation: "hero" }));
  click({});

  assert.deepEqual(events(), []);
});

test("tracking never blocks the call or WhatsApp navigation", () => {
  const { click } = load(PRODUCTION_HOST);

  assert.equal(click(insideLink({ track: "call", trackLocation: "nav" })).defaultPrevented, false);
});

test("both pages load the analytics script deferred from a path that resolves there", () => {
  assert.match(read("index.html"), /<script src="js\/analytics\.js" defer><\/script>/);
  assert.match(read("404.html"), /<script src="\/js\/analytics\.js" defer><\/script>/);
});
