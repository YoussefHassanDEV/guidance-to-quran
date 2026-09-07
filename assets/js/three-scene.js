/* Guidance to Quran — Three.js scenes (hero background + student globe)
   Requires window.THREE (loaded from CDN before this file). Fails silently without WebGL. */
(function () {
  "use strict";
  if (!window.THREE) return;
  const THREE = window.THREE;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function makeRenderer(canvas) {
    try {
      const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      return r;
    } catch (e) { return null; }
  }

  /* ------------------------------------------------------------------
     1. Hero background: floating pastel shapes + star field
  ------------------------------------------------------------------ */
  function heroScene() {
    const host = document.querySelector(".hero");
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.className = "hero-canvas"; canvas.setAttribute("aria-hidden", "true");
    host.prepend(canvas);
    const renderer = makeRenderer(canvas); if (!renderer) { canvas.remove(); return; }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 18);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(5, 8, 10); scene.add(key);
    const rim = new THREE.PointLight(0xf7b733, 1.2, 60); rim.position.set(-8, -4, 6); scene.add(rim);

    const palette = [0x7dd3fc, 0xf7b733, 0xff6b9d, 0x86efac, 0xa78bfa, 0xf26b2b, 0x1c4e9c];
    const geos = [
      new THREE.IcosahedronGeometry(1, 0), new THREE.OctahedronGeometry(1, 0), new THREE.DodecahedronGeometry(0.9, 0),
      new THREE.TorusGeometry(0.7, 0.28, 12, 28), new THREE.TetrahedronGeometry(1, 0), new THREE.TorusKnotGeometry(0.5, 0.18, 64, 8)
    ];
    const shapes = new THREE.Group(); scene.add(shapes);
    const rand = (a, b) => a + Math.random() * (b - a);
    const N = innerWidth < 700 ? 18 : 34;
    for (let i = 0; i < N; i++) {
      const g = geos[i % geos.length];
      const m = new THREE.MeshStandardMaterial({ color: palette[i % palette.length], roughness: 0.35, metalness: 0.15, transparent: true, opacity: 0.6, flatShading: true });
      const mesh = new THREE.Mesh(g, m);
      const s = rand(0.35, 1.1); mesh.scale.setScalar(s);
      mesh.position.set(rand(-18, 18), rand(-9, 9), rand(-14, -2));
      mesh.rotation.set(rand(0, 6), rand(0, 6), 0);
      mesh.userData = { spin: new THREE.Vector3(rand(-0.4, 0.4), rand(-0.4, 0.4), rand(-0.2, 0.2)), bob: rand(0.2, 0.7), phase: rand(0, 6.28), y: mesh.position.y };
      shapes.add(mesh);
    }
    // Star field
    const starGeo = new THREE.BufferGeometry();
    const count = 500, pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) { pos[i] = rand(-40, 40); pos[i + 1] = rand(-20, 20); pos[i + 2] = rand(-30, -4); }
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xf7b733, size: 0.09, transparent: true, opacity: 0.8 }));
    scene.add(stars);

    const target = new THREE.Vector2(0, 0), mouse = new THREE.Vector2(0, 0);
    if (fine) host.addEventListener("pointermove", (e) => { const r = host.getBoundingClientRect(); target.set((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5); }, { passive: true });

    const resize = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    resize(); window.addEventListener("resize", resize);

    let visible = true;
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(host);
    const clock = new THREE.Clock();
    const tick = () => {
      requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime(), dt = Math.min(clock.getDelta() || 0.016, 0.05);
      mouse.lerp(target, 0.05);
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      if (!reduce) {
        shapes.children.forEach((m) => { const u = m.userData; m.rotation.x += u.spin.x * 0.01; m.rotation.y += u.spin.y * 0.01; m.position.y = u.y + Math.sin(t * u.bob + u.phase) * 0.6; });
        stars.rotation.z = t * 0.01;
      }
      const dark = isDark();
      shapes.children.forEach((m) => { m.material.opacity = dark ? 0.5 : 0.6; });
      renderer.render(scene, camera);
    };
    tick();
  }

  /* ------------------------------------------------------------------
     2. Student globe: wireframe earth with glowing country markers
  ------------------------------------------------------------------ */
  const COUNTRIES = [
    ["United States", 38, -97], ["Canada", 56, -106], ["United Kingdom", 54, -2], ["Germany", 51, 10], ["France", 46, 2], ["Netherlands", 52, 5],
    ["Norway", 61, 9], ["Sweden", 62, 15], ["Spain", 40, -4], ["Italy", 42, 12], ["Turkey", 39, 35], ["Egypt", 27, 30], ["Saudi Arabia", 24, 45],
    ["UAE", 24, 54], ["Qatar", 25, 51], ["Kuwait", 29, 47], ["Pakistan", 30, 69], ["India", 21, 78], ["Bangladesh", 24, 90], ["Malaysia", 4, 102],
    ["Singapore", 1, 104], ["Indonesia", -2, 118], ["Australia", -25, 134], ["New Zealand", -41, 174], ["South Africa", -29, 25], ["Nigeria", 9, 8],
    ["Morocco", 32, -6], ["Brazil", -10, -55], ["Mexico", 23, -102], ["Japan", 36, 138]
  ];
  const toVec = (lat, lon, r) => { const phi = (90 - lat) * Math.PI / 180, theta = (lon + 180) * Math.PI / 180; return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)); };

  function globeScene() {
    const host = document.getElementById("globe");
    if (!host) return;
    const canvas = document.createElement("canvas"); host.appendChild(canvas);
    const label = host.querySelector(".globe-label");
    const renderer = makeRenderer(canvas); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100); camera.position.set(0, 0, 7.2);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8); sun.position.set(5, 3, 5); scene.add(sun);

    const globe = new THREE.Group(); scene.add(globe);
    const R = 2.4;
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R - 0.02, 48, 48), new THREE.MeshPhongMaterial({ color: 0x1c4e9c, transparent: true, opacity: 0.55, shininess: 30 })));
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R, 24, 24), new THREE.MeshBasicMaterial({ color: 0x7dd3fc, wireframe: true, transparent: true, opacity: 0.18 })));
    // atmosphere glow
    const glow = new THREE.Mesh(new THREE.SphereGeometry(R * 1.12, 48, 48), new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.08, side: THREE.BackSide }));
    globe.add(glow);
    // markers
    const markers = [];
    const dotGeo = new THREE.SphereGeometry(0.06, 10, 10), ringGeo = new THREE.RingGeometry(0.09, 0.14, 24);
    COUNTRIES.forEach(([name, lat, lon], i) => {
      const p = toVec(lat, lon, R + 0.02);
      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: i % 3 ? 0xf7b733 : 0xff6b9d }));
      dot.position.copy(p); globe.add(dot);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xf7b733, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
      ring.position.copy(p); ring.lookAt(p.clone().multiplyScalar(2)); globe.add(ring);
      markers.push({ dot, ring, phase: Math.random() * 6.28, name });
      // arc to Makkah (centre of the network)
      if (i % 2 === 0) {
        const a = toVec(21.4, 39.8, R), b = p.clone(), mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + a.distanceTo(b) * 0.35);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), new THREE.LineBasicMaterial({ color: 0xf7b733, transparent: true, opacity: 0.35 }));
        globe.add(line);
      }
    });
    const makkah = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), new THREE.MeshBasicMaterial({ color: 0x86efac })); makkah.position.copy(toVec(21.4, 39.8, R + 0.02)); globe.add(makkah);

    // drag to rotate
    let dragging = false, px = 0, py = 0, vx = 0.0035, vy = 0;
    const down = (e) => { dragging = true; px = e.clientX; py = e.clientY; host.classList.add("grabbing"); };
    const move = (e) => { if (!dragging) return; vx = (e.clientX - px) * 0.005; vy = (e.clientY - py) * 0.005; px = e.clientX; py = e.clientY; };
    const up = () => { dragging = false; host.classList.remove("grabbing"); };
    canvas.addEventListener("pointerdown", down); window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("pointerup", up);

    const resize = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    resize(); window.addEventListener("resize", resize);
    let visible = true, li = 0, lt = 0;
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(host);
    const clock = new THREE.Clock();
    const tick = () => {
      requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!dragging) { vx += (0.0035 - vx) * 0.02; vy *= 0.95; }
      globe.rotation.y += reduce && !dragging ? 0 : vx; globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + vy, -0.8, 0.8);
      markers.forEach((m) => { const s = 1 + 0.6 * ((Math.sin(t * 2 + m.phase) + 1) / 2); m.ring.scale.setScalar(s); m.ring.material.opacity = 0.7 - 0.5 * ((Math.sin(t * 2 + m.phase) + 1) / 2); });
      if (label && t - lt > 2.2) { lt = t; li = (li + 1) % COUNTRIES.length; label.textContent = "📍 Students in " + COUNTRIES[li][0]; label.classList.remove("pop"); void label.offsetWidth; label.classList.add("pop"); }
      renderer.render(scene, camera);
    };
    tick();
  }

  const start = () => { try { heroScene(); } catch (e) {} try { globeScene(); } catch (e) {} };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
