(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Navigation --------------------------------------------------------------

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav-principal");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");

      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const navLinks = Array.from(document.querySelectorAll(".site-nav__list a[href^='#']"));
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);

        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Mobile call bar: only once the hero's own buttons have scrolled away
  const ctaBar = document.querySelector(".cta-bar");
  const heroActions = document.querySelector(".hero__actions");

  if (ctaBar && heroActions && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(([entry]) => {
      ctaBar.classList.toggle("is-visible", !entry.isIntersecting && entry.boundingClientRect.top < 0);
    });

    barObserver.observe(heroActions);
  } else if (ctaBar) {
    ctaBar.classList.add("is-visible");
  }

  const year = document.querySelector("[data-year]");

  if (year) year.textContent = String(new Date().getFullYear());

  // Hero spring: leaves stack in straight, bend into shape, then one flex under load.

  const spring = document.querySelector(".spring[data-animate='hero']");
  const S = window.SpringGeometry;

  if (!spring || !S) return;

  const leaves = Array.from(spring.querySelectorAll(".spring__leaf"));
  const clips = Array.from(spring.querySelectorAll(".spring__clip"));
  const eyes = Array.from(spring.querySelectorAll(".spring__eye"));
  const boltShaft = spring.querySelector("[data-bolt='shaft']");
  const boltHead = spring.querySelector("[data-bolt='head']");
  const boltNut = spring.querySelector("[data-bolt='nut']");
  const setRect = (el, r) => {
    el.setAttribute("y", r.y.toFixed(1));
    el.setAttribute("height", r.height.toFixed(1));
  };

  function render(sag) {
    leaves.forEach((leaf) => leaf.setAttribute("d", S.leafPath(Number(leaf.dataset.leaf), sag)));
    clips.forEach((clip) => setRect(clip, S.clipRect(Number(clip.dataset.clip), sag)));
    eyes.forEach((eye) => eye.setAttribute("cy", S.eyeY(sag).toFixed(1)));
    setRect(boltShaft, S.boltRect(sag));
    setRect(boltHead, S.boltHeadRect(sag));
    setRect(boltNut, S.boltNutRect(sag));
  }

  // Until the entry sequence has bent the pack into shape, clicks do nothing.
  let animating = true;

  function animate(duration, sagAt, done) {
    animating = true;
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);

      render(sagAt(t));

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        animating = false;
        if (done) done();
      }
    }

    requestAnimationFrame(frame);
  }

  // Straight leaves curve into their rest arc, like in the press.
  function bend(duration, done) {
    animate(duration, (t) => (S.REST_SAG * (1 - Math.cos(Math.PI * t))) / 2, done);
  }

  function flex(depth, duration) {
    if (animating) return;

    animate(duration, (t) => {
      // compress fast, release with a small rebound
      const load = t < 0.35 ? Math.sin((t / 0.35) * Math.PI * 0.5) : Math.cos(((t - 0.35) / 0.65) * Math.PI * 0.5);
      const rebound = t > 0.35 ? Math.sin(((t - 0.35) / 0.65) * Math.PI) * 0.12 : 0;

      return S.REST_SAG - depth * load + depth * rebound;
    });
  }

  if (reducedMotion) {
    spring.classList.add("is-in");
    return;
  }

  render(0);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => spring.classList.add("is-in"));
  });

  window.setTimeout(() => {
    bend(1000, () => window.setTimeout(() => flex(46, 1200), 600));
  }, 1200);

  spring.addEventListener("click", () => flex(46, 1200));
})();
