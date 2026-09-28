(function () {
  "use strict";

  const GA_ID = "G-QXR092YVYG";
  const PRODUCTION_HOST = "www.resortesfiebig.cl";
  const EVENT_NAMES = {
    call: "click_call",
    whatsapp: "click_whatsapp",
    directions: "click_directions",
    email: "click_email",
  };

  // Only production reports: local previews and other hosts never load the tag.
  if (window.location.hostname !== PRODUCTION_HOST) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  const tag = document.createElement("script");

  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(tag);

  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  // Contact links declare data-track (event type) and data-track-location (where on the site).
  document.addEventListener("click", (event) => {
    const target = event.target;
    const link = target && typeof target.closest === "function" ? target.closest("a[data-track]") : null;
    const track = link ? link.dataset.track : undefined;

    if (!Object.prototype.hasOwnProperty.call(EVENT_NAMES, track)) return;

    window.gtag("event", EVENT_NAMES[track], {
      link_location: link.dataset.trackLocation || "desconocida",
      transport_type: "beacon",
    });
  });
})();
