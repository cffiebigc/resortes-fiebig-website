// Parametric leaf-spring pack. Shared by the browser (hero animation) and by
// scripts/build-spring.js (static markup baked into index.html).
(function (root) {
  const WIDTH = 900;
  const CENTER = WIDTH / 2;
  const EYE_Y = 150; // y of the main leaf ends (eyes)
  const MAIN_X0 = 70; // main leaf start x
  const LEAVES = 6;
  const STEP_X = 66; // each leaf is shorter by this on each side
  const STEP_Y = 17; // vertical stacking distance
  const THICKNESS = 14;
  const REST_SAG = 120; // vertex-to-eye height at rest
  const CLIP_X = [200, WIDTH - 200];
  const EYE_R = 17;

  function leafGeometry(i, sag) {
    const mainHalf = CENTER - MAIN_X0;
    const half = mainHalf - STEP_X * i;
    const k = sag / (mainHalf * mainHalf);
    const vertexY = EYE_Y - sag + STEP_Y * i;
    const endY = vertexY + k * half * half;
    const ctrlY = vertexY - k * half * half;

    return { x0: CENTER - half, x1: CENTER + half, endY, ctrlY, vertexY, k };
  }

  function leafY(i, sag, x) {
    const g = leafGeometry(i, sag);

    return g.vertexY + g.k * (x - CENTER) * (x - CENTER);
  }

  function leafPath(i, sag) {
    const g = leafGeometry(i, sag);
    const f = (n) => n.toFixed(1);

    return `M${f(g.x0)} ${f(g.endY)} Q${CENTER} ${f(g.ctrlY)} ${f(g.x1)} ${f(g.endY)}`;
  }

  function leavesCovering(x) {
    const out = [];

    for (let i = 0; i < LEAVES; i += 1) {
      const g = leafGeometry(i, REST_SAG);

      if (g.x0 <= x && x <= g.x1) out.push(i);
    }

    return out;
  }

  function clipRect(x, sag) {
    const covered = leavesCovering(x);
    const top = leafY(covered[0], sag, x) - THICKNESS / 2 - 4;
    const bottom = leafY(covered[covered.length - 1], sag, x) + THICKNESS / 2 + 4;

    return { x: x - 9, y: top, width: 18, height: bottom - top };
  }

  function boltRect(sag) {
    const top = leafGeometry(0, sag).vertexY - THICKNESS / 2 - 9;
    const bottom = leafGeometry(LEAVES - 1, sag).vertexY + THICKNESS / 2 + 9;

    return { x: CENTER - 4, y: top, width: 8, height: bottom - top };
  }

  function boltHeadRect(sag) {
    const top = leafGeometry(0, sag).vertexY - THICKNESS / 2 - 9;

    return { x: CENTER - 11, y: top, width: 22, height: 9 };
  }

  function boltNutRect(sag) {
    const bottom = leafGeometry(LEAVES - 1, sag).vertexY + THICKNESS / 2 + 9;

    return { x: CENTER - 11, y: bottom - 9, width: 22, height: 9 };
  }

  root.SpringGeometry = {
    WIDTH,
    CENTER,
    EYE_Y,
    MAIN_X0,
    LEAVES,
    THICKNESS,
    REST_SAG,
    CLIP_X,
    EYE_R,
    leafGeometry,
    leafY,
    leafPath,
    clipRect,
    boltRect,
    boltHeadRect,
    boltNutRect,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
