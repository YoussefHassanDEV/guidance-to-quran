/* Hedaya Academy — Three.js art scenes
   1. Hero: morphing particle constellation (crescent → star → Quran → mosque) over a nebula shader
   2. Stats band: animated 8-fold Islamic geometric pattern (fragment shader)
   3. Courses banner: floating Arabic letters
   4. Globe: student world map (draggable)
   5. Floating 3D motifs (stars / crescents / gems / hearts) — data-scene="crystals"
   6. CTA band golden vortex — data-scene="cta"
   7. Footer night sky with crescent moon and shooting stars
   Scenes 5–7 mount lazily (no WebGL context until the host scrolls near).
   Requires window.THREE (r128 UMD). Fails silently without WebGL. */
(function () {
  "use strict";
  if (!window.THREE) return;
  const THREE = window.THREE;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mobile = innerWidth < 700;
  const rand = (a, b) => a + Math.random() * (b - a);

  function makeRenderer(canvas, opts = {}) {
    try {
      const r = new THREE.WebGLRenderer(Object.assign({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" }, opts));
      r.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2));
      return r;
    } catch (e) { return null; }
  }
  function observeVisible(el, cb) { new IntersectionObserver((es) => cb(es[0].isIntersecting), { rootMargin: "80px" }).observe(el); }
  function fit(renderer, camera, host) { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); if (camera) { camera.aspect = w / h; camera.updateProjectionMatrix(); } }

  // Soft glow sprite for particles
  function glowTexture() {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.3, "rgba(255,255,255,.8)"); grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  /* ------------------------------------------------------------------
     Shape samplers: each returns N points (x,y) in a ~8x8 unit box
  ------------------------------------------------------------------ */
  const SHAPES = {
    crescent(n) {
      const pts = []; let guard = 0;
      while (pts.length < n * 2 && guard++ < n * 40) {
        const x = rand(-4, 4), y = rand(-4, 4);
        const inOuter = x * x + y * y <= 16, inInner = (x - 1.6) * (x - 1.6) + (y - 0.4) * (y - 0.4) <= 11.5;
        if (inOuter && !inInner) pts.push(x, y);
      }
      return pts;
    },
    star(n) {
      const inSquare = (x, y, a) => { const c = Math.cos(a), s = Math.sin(a), u = x * c + y * s, v = -x * s + y * c; return Math.abs(u) <= 2.9 && Math.abs(v) <= 2.9; };
      const pts = []; let guard = 0;
      while (pts.length < n * 2 && guard++ < n * 30) {
        const x = rand(-4.2, 4.2), y = rand(-4.2, 4.2);
        if ((inSquare(x, y, 0) || inSquare(x, y, Math.PI / 4)) && Math.hypot(x, y) > 1.1) pts.push(x, y);
      }
      return pts;
    },
    book(n) {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const side = i % 2 ? 1 : -1, u = rand(0.15, 3.6), v = rand(-2.2, 2.2);
        const lift = (u / 3.6) * (u / 3.6) * 0.9 - 0.3;
        const line = Math.round(v / 0.55) * 0.55, yy = Math.random() < 0.55 ? line : v;
        pts.push(side * u, yy + lift * 0.4);
      }
      for (let i = 0; i < Math.floor(n * 0.03); i++) pts[Math.floor(rand(0, n)) * 2] = rand(-0.12, 0.12);
      return pts;
    },
    mosque(n) {
      const pts = []; let guard = 0;
      while (pts.length < n * 2 && guard++ < n * 30) {
        const x = rand(-4.5, 4.5), y = rand(-3.5, 4.2);
        const dome = x * x + (y - 0.2) * (y - 0.2) <= 5.3 && y > 0.2;
        const hall = Math.abs(x) <= 2.6 && y <= 0.4 && y >= -2.8;
        const minL = Math.abs(x + 3.7) <= 0.32 && y <= 3.4 && y >= -2.8, minR = Math.abs(x - 3.7) <= 0.32 && y <= 3.4 && y >= -2.8;
        const capL = (x + 3.7) * (x + 3.7) + (y - 3.4) * (y - 3.4) <= 0.36 && y > 3.4, capR = (x - 3.7) * (x - 3.7) + (y - 3.4) * (y - 3.4) <= 0.36 && y > 3.4;
        const door = Math.abs(x) <= 0.55 && y <= -0.6 && y >= -2.8;
        const moon = Math.hypot(x, y - 3.1) <= 0.5 && Math.hypot(x - 0.25, y - 3.2) > 0.4;
        if ((dome || hall || minL || minR || capL || capR || moon) && !door) pts.push(x, y);
      }
      return pts;
    }
  };
  const ORDER = ["crescent", "star", "book", "mosque"];

  /* ------------------------------------------------------------------
     1. Hero particle constellation + nebula
  ------------------------------------------------------------------ */
  function heroScene() {
    const host = document.querySelector(".hero");
    if (!host) return;
    const canvas = document.createElement("canvas"); canvas.className = "hero-canvas"; canvas.setAttribute("aria-hidden", "true");
    host.prepend(canvas);
    const renderer = makeRenderer(canvas); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); camera.position.set(0, 0, 15);

    const nebula = new THREE.Mesh(new THREE.PlaneGeometry(60, 34), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uDark: { value: 0 }, uA: { value: new THREE.Color(0xe9b93a) }, uB: { value: new THREE.Color(0xf1d9a8) }, uC: { value: new THREE.Color(0xd98a4a) } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `
        varying vec2 vUv; uniform float uTime; uniform float uDark; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
        float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.1; a*=0.5; } return v; }
        void main(){
          vec2 uv = vUv * vec2(3.0, 1.8);
          float t = uTime * 0.04;
          float n1 = fbm(uv + vec2(t, -t*0.6));
          float n2 = fbm(uv * 1.7 + vec2(-t*0.8, t*0.5) + n1);
          vec3 col = mix(uA, uB, smoothstep(0.3, 0.8, n1));
          col = mix(col, uC, smoothstep(0.55, 0.95, n2) * 0.6);
          float alpha = smoothstep(0.35, 0.85, n2) * (0.22 + 0.16 * uDark);
          float d = distance(vUv, vec2(0.5)); alpha *= smoothstep(0.85, 0.25, d);
          gl_FragColor = vec4(col, alpha);
        }`
    }));
    nebula.position.z = -12; scene.add(nebula);

    const N = mobile ? 1800 : 4200;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), seed = new Float32Array(N);
    const palette = [new THREE.Color(0xe9b93a), new THREE.Color(0xf3d27a), new THREE.Color(0xf1d9a8), new THREE.Color(0xd98a4a), new THREE.Color(0xffffff)];
    for (let i = 0; i < N; i++) {
      pos[i * 3] = rand(-12, 12); pos[i * 3 + 1] = rand(-7, 7); pos[i * 3 + 2] = rand(-3, 3);
      const c = palette[Math.random() < 0.55 ? 0 : Math.floor(rand(0, palette.length))];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; seed[i] = Math.random();
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const baseSize = mobile ? 0.16 : 0.13;
    const mat = new THREE.PointsMaterial({ size: baseSize, map: glowTexture(), vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    const points = new THREE.Points(geo, mat);

    const targets = {};
    ORDER.forEach((k) => { const p = SHAPES[k](N); const arr = new Float32Array(N * 3); for (let i = 0; i < N; i++) { arr[i * 3] = p[i * 2] || 0; arr[i * 3 + 1] = p[i * 2 + 1] || 0; arr[i * 3 + 2] = rand(-0.6, 0.6); } targets[k] = arr; });
    const scatter = new Float32Array(N * 3); for (let i = 0; i < N * 3; i++) scatter[i] = rand(-9, 9);

    let shapeIdx = 0, target = targets[ORDER[0]], nextSwitch = 7, exploding = false;
    for (let i = 0; i < N * 3; i++) pos[i] = target[i] + rand(-0.25, 0.25); // first frame already reads as the crescent
    const group = new THREE.Group(); group.add(points); scene.add(group);
    const baseX = mobile ? 0 : 2.8, baseY = mobile ? -4.6 : 2.3;
    group.position.set(baseX, baseY, 0); group.scale.setScalar(mobile ? 0.5 : 0.78);

    const targetMouse = new THREE.Vector2(), mouse = new THREE.Vector2();
    if (fine) host.addEventListener("pointermove", (e) => { const r = host.getBoundingClientRect(); targetMouse.set((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5); }, { passive: true });

    fit(renderer, camera, host); window.addEventListener("resize", () => fit(renderer, camera, host));
    let visible = true; observeVisible(host, (v) => visible = v);
    const clock = new THREE.Clock();
    const pa = geo.attributes.position.array;
    const frame = (t, force) => {
      nebula.material.uniforms.uTime.value = t; nebula.material.uniforms.uDark.value = isDark() ? 1 : 0;
      if ((!reduce || force) && t > nextSwitch) {
        if (!exploding) { exploding = true; target = scatter; nextSwitch = t + 1.1; }
        else { exploding = false; shapeIdx = (shapeIdx + 1) % ORDER.length; target = targets[ORDER[shapeIdx]]; nextSwitch = t + 7.5; }
      }
      const k = exploding ? 0.06 : 0.045;
      for (let i = 0; i < N; i++) {
        const j = i * 3, s = seed[i], wob = 0.06 * Math.sin(t * (0.8 + s) + s * 20), e = k * (0.6 + s * 0.8);
        pa[j] += (target[j] + wob - pa[j]) * e;
        pa[j + 1] += (target[j + 1] + wob * 0.8 - pa[j + 1]) * e;
        pa[j + 2] += (target[j + 2] - pa[j + 2]) * k;
      }
      geo.attributes.position.needsUpdate = true;
      const dark = isDark();
      if (mat.userData.dark !== dark) { mat.userData.dark = dark; mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending; mat.color.set(dark ? 0xffffff : 0x6b4a2e); mat.needsUpdate = true; }
      mat.opacity = dark ? 1 : 0.8; mat.size = baseSize * (dark ? 1 : 1.25) * (1 + 0.15 * Math.sin(t * 1.3));
      mouse.lerp(targetMouse, 0.05);
      group.rotation.y = mouse.x * 0.35 + Math.sin(t * 0.15) * 0.08; group.rotation.x = -mouse.y * 0.25;
      group.position.y = baseY - Math.min(scrollY, 600) * 0.004;
      renderer.render(scene, camera);
    };
    const tick = () => { requestAnimationFrame(tick); if (visible) frame(clock.getElapsedTime(), false); };
    tick();
    window.GTQ_hero = { step: (n, jump) => { let t = clock.getElapsedTime(); if (jump) nextSwitch = t - 1; for (let i = 0; i < n; i++) frame(t + i / 60, true); }, shape: () => ORDER[shapeIdx] };
  }

  /* ------------------------------------------------------------------
     2. Islamic geometric pattern shader (stats band background)
  ------------------------------------------------------------------ */
  function patternScene() {
    const host = document.querySelector(".stats");
    if (!host) return;
    const canvas = document.createElement("canvas"); canvas.className = "pattern-canvas"; canvas.setAttribute("aria-hidden", "true");
    host.prepend(canvas);
    const renderer = makeRenderer(canvas); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } },
      vertexShader: "void main(){ gl_Position = vec4(position, 1.0); }",
      fragmentShader: `
        uniform float uTime; uniform vec2 uRes;
        #define PI 3.14159265
        float lines(vec2 p, float w){ vec2 g = abs(fract(p) - 0.5); return smoothstep(w, w*0.4, min(g.x, g.y)); }
        void main(){
          vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
          float t = uTime * 0.05;
          float a = atan(uv.y, uv.x), r = length(uv);
          float seg = PI / 4.0; a = mod(a, seg); a = abs(a - seg*0.5);
          vec2 p = vec2(cos(a), sin(a)) * r * 6.0;
          float m = lines(p + t, 0.08);
          vec2 q = mat2(0.7071,-0.7071,0.7071,0.7071) * p;
          m = max(m, lines(q - t*0.7, 0.08) * 0.8);
          float stars = smoothstep(0.35, 0.0, abs(sin(p.x*PI)*sin(p.y*PI)) - 0.05) * 0.35;
          float glow = smoothstep(1.2, 0.0, r) * 0.25;
          vec3 gold = vec3(0.97, 0.72, 0.2), sky = vec3(0.49, 0.83, 0.99);
          vec3 col = mix(sky, gold, 0.5 + 0.5*sin(r*3.0 - uTime*0.4));
          float alpha = (m * 0.55 + stars + glow) * 0.5;
          gl_FragColor = vec4(col, alpha);
        }`
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    const resize = () => { fit(renderer, null, host); mat.uniforms.uRes.value.set(canvas.width, canvas.height); };
    resize(); window.addEventListener("resize", resize);
    let visible = true; observeVisible(host, (v) => visible = v);
    const clock = new THREE.Clock();
    const tick = () => { requestAnimationFrame(tick); if (!visible) return; mat.uniforms.uTime.value = reduce ? 10 : clock.getElapsedTime(); renderer.render(scene, camera); };
    tick();
  }

  /* ------------------------------------------------------------------
     3. Floating Arabic letters (Courses banner)
  ------------------------------------------------------------------ */
  function lettersScene() {
    const host = document.querySelector(".page-hero.photo .banner");
    if (!host) return;
    const canvas = document.createElement("canvas"); canvas.className = "letters-canvas"; canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const renderer = makeRenderer(canvas); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50); camera.position.z = 12;
    const letters = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
    const texFor = (ch, color) => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); g.font = "bold 84px Amiri, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = color; g.shadowBlur = 18; g.fillStyle = color; g.fillText(ch, 64, 70); return new THREE.CanvasTexture(c); };
    const colors = ["#e9b93a", "#f1d9a8", "#ffffff", "#d98a4a", "#f4e7d2"];
    const sprites = [], count = mobile ? 16 : 34;
    for (let i = 0; i < count; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: texFor(letters[i % letters.length], colors[i % colors.length]), transparent: true, opacity: 0, depthWrite: false }));
      const s = rand(0.6, 1.5); sp.scale.set(s, s, 1);
      sp.position.set(rand(-9, 9), rand(-5, 5), rand(-4, 2));
      sp.userData = { vy: rand(0.15, 0.45), rot: rand(-0.4, 0.4), phase: rand(0, 6.28), sway: rand(0.3, 1) };
      scene.add(sp); sprites.push(sp);
    }
    fit(renderer, camera, host); window.addEventListener("resize", () => fit(renderer, camera, host));
    let visible = true; observeVisible(host, (v) => visible = v);
    const clock = new THREE.Clock();
    const tick = () => {
      requestAnimationFrame(tick); if (!visible) return;
      const t = clock.getElapsedTime(), dt = 1 / 60;
      sprites.forEach((sp) => { const u = sp.userData;
        if (!reduce) { sp.position.y += u.vy * dt; sp.position.x += Math.sin(t * u.sway + u.phase) * 0.004; sp.material.rotation += u.rot * dt; }
        const fade = Math.min(1, (sp.position.y + 5) / 1.5) * Math.min(1, (5.5 - sp.position.y) / 1.5); sp.material.opacity = Math.max(0, fade) * 0.85;
        if (sp.position.y > 5.6) { sp.position.y = -5.4; sp.position.x = rand(-9, 9); } });
      renderer.render(scene, camera);
    };
    tick();
  }

  /* ------------------------------------------------------------------
     4. Student globe
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
    const renderer = makeRenderer(canvas, { antialias: true }); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100); camera.position.set(0, 0, 6.9);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8); sun.position.set(5, 3, 5); scene.add(sun);
    const globe = new THREE.Group(); scene.add(globe);
    const R = 2.4;
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R - 0.02, 48, 48), new THREE.MeshPhongMaterial({ color: 0x5a3612, transparent: true, opacity: 0.55, shininess: 30 })));
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R, 24, 24), new THREE.MeshBasicMaterial({ color: 0xf1d9a8, wireframe: true, transparent: true, opacity: 0.18 })));
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.12, 48, 48), new THREE.MeshBasicMaterial({ color: 0xf1d9a8, transparent: true, opacity: 0.08, side: THREE.BackSide })));
    const haloGeo = new THREE.BufferGeometry(), hp = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) { const a = rand(0, 6.28), r = R * rand(1.25, 1.6); hp[i * 3] = Math.cos(a) * r; hp[i * 3 + 1] = rand(-0.4, 0.4); hp[i * 3 + 2] = Math.sin(a) * r; }
    haloGeo.setAttribute("position", new THREE.BufferAttribute(hp, 3));
    const halo = new THREE.Points(haloGeo, new THREE.PointsMaterial({ color: 0xe9b93a, size: 0.05, transparent: true, opacity: 0.7, map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.rotation.x = 0.4; scene.add(halo);
    const markers = [];
    const dotGeo = new THREE.SphereGeometry(0.06, 10, 10), ringGeo = new THREE.RingGeometry(0.09, 0.14, 24);
    COUNTRIES.forEach(([name, lat, lon], i) => {
      const p = toVec(lat, lon, R + 0.02);
      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: i % 3 ? 0xe9b93a : 0xd98a4a })); dot.position.copy(p); globe.add(dot);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xe9b93a, transparent: true, opacity: 0.6, side: THREE.DoubleSide })); ring.position.copy(p); ring.lookAt(p.clone().multiplyScalar(2)); globe.add(ring);
      markers.push({ dot, ring, phase: Math.random() * 6.28, name });
      if (i % 2 === 0) { const a = toVec(21.4, 39.8, R), b = p.clone(), mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + a.distanceTo(b) * 0.35);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), new THREE.LineBasicMaterial({ color: 0xe9b93a, transparent: true, opacity: 0.35 }))); }
    });
    const makkah = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), new THREE.MeshBasicMaterial({ color: 0x86efac })); makkah.position.copy(toVec(21.4, 39.8, R + 0.02)); globe.add(makkah);
    let dragging = false, px = 0, py = 0, vx = 0.0035, vy = 0;
    canvas.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; host.classList.add("grabbing"); });
    window.addEventListener("pointermove", (e) => { if (!dragging) return; vx = (e.clientX - px) * 0.005; vy = (e.clientY - py) * 0.005; px = e.clientX; py = e.clientY; }, { passive: true });
    window.addEventListener("pointerup", () => { dragging = false; host.classList.remove("grabbing"); });
    fit(renderer, camera, host); window.addEventListener("resize", () => fit(renderer, camera, host));
    let visible = true, li = 0, lt = 0; observeVisible(host, (v) => visible = v);
    const clock = new THREE.Clock();
    const tick = () => {
      requestAnimationFrame(tick); if (!visible) return;
      const t = clock.getElapsedTime();
      if (!dragging) { vx += (0.0035 - vx) * 0.02; vy *= 0.95; }
      globe.rotation.y += reduce && !dragging ? 0 : vx; globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + vy, -0.8, 0.8);
      halo.rotation.y = -t * 0.08;
      markers.forEach((m) => { const s = 1 + 0.6 * ((Math.sin(t * 2 + m.phase) + 1) / 2); m.ring.scale.setScalar(s); m.ring.material.opacity = 0.7 - 0.5 * ((Math.sin(t * 2 + m.phase) + 1) / 2); });
      if (label && t - lt > 2.2) { lt = t; li = (li + 1) % COUNTRIES.length; label.textContent = "📍 Students in " + COUNTRIES[li][0]; label.classList.remove("pop"); void label.offsetWidth; label.classList.add("pop"); }
      renderer.render(scene, camera);
    };
    tick();
  }


  /* ------------------------------------------------------------------
     Shared: lazy scene mounting (a WebGL context is only created when the
     host first scrolls near the viewport) and a small geometry library of
     extruded Islamic motifs: 5-point star, crescent, gem, heart.
  ------------------------------------------------------------------ */
  function lazy(host, init) {
    let done = false;
    const go = () => { if (done) return; done = true; io.disconnect(); removeEventListener("scroll", onScroll); try { init(); } catch (e) { console.warn("scene failed", e); } };
    const near = () => { const r = host.getBoundingClientRect(); return r.bottom > -200 && r.top < innerHeight + 200; };
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) go(); }, { rootMargin: "200px" });
    // Some embedded / background contexts never deliver IntersectionObserver updates: poll on scroll as a fallback.
    const onScroll = () => { if (near()) go(); };
    io.observe(host); addEventListener("scroll", onScroll, { passive: true }); setTimeout(onScroll, 300);
  }
  function mountCanvas(host, cls) {
    const canvas = document.createElement("canvas"); canvas.className = "scene-canvas " + (cls || ""); canvas.setAttribute("aria-hidden", "true");
    host.classList.add("scene-host"); host.prepend(canvas); return canvas;
  }
  function starShape(outer = 1, inner = 0.45, points = 5) {
    const sh = new THREE.Shape();
    for (let i = 0; i < points * 2; i++) { const r = i % 2 ? inner : outer, a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
    sh.closePath(); return sh;
  }
  function crescentShape(r = 1) {
    // Outer circle (radius r) minus an offset inner circle: two arcs joined at their intersections.
    const sh = new THREE.Shape(), a = 0.896, b = 1.35;
    sh.absarc(0, 0, r, a, Math.PI * 2 - a, false);
    sh.absarc(0.45 * r, 0, 0.8 * r, -b, b, true);
    return sh;
  }
  const extrude = (shape, depth) => { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: depth * 0.4, bevelSize: depth * 0.35, bevelSegments: 3, curveSegments: 24 }); g.center(); return g; };
  let _geo;
  function motifGeometries() {
    if (_geo) return _geo;
    const heart = new THREE.Shape(); heart.moveTo(0, -0.9); heart.bezierCurveTo(0.9, -0.3, 1.1, 0.5, 0.5, 0.9); heart.bezierCurveTo(0.2, 1.1, 0, 0.8, 0, 0.6); heart.bezierCurveTo(0, 0.8, -0.2, 1.1, -0.5, 0.9); heart.bezierCurveTo(-1.1, 0.5, -0.9, -0.3, 0, -0.9);
    _geo = { star: extrude(starShape(1, 0.48), 0.35), crescent: extrude(crescentShape(1), 0.3), gem: new THREE.OctahedronGeometry(0.9, 0), heart: extrude(heart, 0.3) };
    return _geo;
  }
  const PALETTE = { gold: 0xe9b93a, orange: 0xa8601f, sky: 0xf1d9a8, pink: 0xd98a4a, mint: 0x86efac, white: 0xffffff };

  /* ------------------------------------------------------------------
     5. Floating 3D motifs: gold stars, crescents, gems and hearts drifting
        with glow dust behind course cards, plans, forms, values...
        Host: any element with data-scene="crystals"
        Variants (data-scene-variant): stars | gems | hearts | mixed (default)
  ------------------------------------------------------------------ */
  function crystalsScene(host) {
    const variant = host.dataset.sceneVariant || "mixed";
    const canvas = mountCanvas(host, "crystals-canvas");
    const renderer = makeRenderer(canvas, { antialias: !mobile }); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80); camera.position.set(0, 0, 18);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xfff3d6, 1.1); key.position.set(4, 6, 8); scene.add(key);
    const rim = new THREE.PointLight(PALETTE.sky, 1.2, 40); rim.position.set(-8, -4, 6); scene.add(rim);
    const G = motifGeometries();
    const kinds = { stars: ["star", "star", "crescent"], gems: ["gem", "gem", "star"], hearts: ["heart", "star", "heart"], mixed: ["star", "crescent", "gem"] }[variant] || ["star", "crescent", "gem"];
    const cols = { stars: [PALETTE.gold, PALETTE.gold, PALETTE.white], gems: [PALETTE.sky, PALETTE.pink, PALETTE.gold], hearts: [PALETTE.pink, PALETTE.gold, PALETTE.orange], mixed: [PALETTE.gold, PALETTE.gold, PALETTE.sky] }[variant] || [PALETTE.gold, PALETTE.gold, PALETTE.sky];
    const n = mobile ? 7 : 14, meshes = [];
    const spread = () => { const w = Math.max(6, host.clientWidth / Math.max(1, host.clientHeight) * 8.5); return { x: rand(-w, w), y: rand(-9, 9) }; };
    for (let i = 0; i < n; i++) {
      const k = i % kinds.length;
      const mat = new THREE.MeshStandardMaterial({ color: cols[k], metalness: 0.7, roughness: 0.25, transparent: true, opacity: 0.85, emissive: cols[k], emissiveIntensity: 0.12 });
      const m = new THREE.Mesh(G[kinds[k]], mat); const p = spread(); const s = rand(0.3, 0.7);
      m.position.set(p.x, p.y, rand(-7, -1)); m.scale.setScalar(s); m.rotation.set(rand(0, 6), rand(0, 6), rand(0, 6));
      m.userData = { rx: rand(-0.4, 0.4), ry: rand(-0.6, 0.6), vy: rand(0.12, 0.4), sway: rand(0.2, 0.7), phase: rand(0, 6.28), base: p.x };
      scene.add(m); meshes.push(m);
    }
    const pc = mobile ? 60 : 140, pos = new Float32Array(pc * 3);
    for (let i = 0; i < pc; i++) { const p = spread(); pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = rand(-8, 0); }
    const dustG = new THREE.BufferGeometry(); dustG.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(dustG, new THREE.PointsMaterial({ map: glowTexture(), color: variant === "hearts" ? PALETTE.pink : PALETTE.gold, size: mobile ? 0.35 : 0.45, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(dust);
    const resize = () => fit(renderer, camera, host); resize(); window.addEventListener("resize", resize);
    let visible = true; observeVisible(host, (v) => visible = v);
    const clock = new THREE.Clock();
    const tick = () => {
      requestAnimationFrame(tick); if (!visible) return;
      const dt = Math.min(0.05, clock.getDelta() || 0.016), t = clock.getElapsedTime();
      if (!reduce) {
        meshes.forEach((m) => { const u = m.userData; m.rotation.x += u.rx * dt; m.rotation.y += u.ry * dt; m.position.y += u.vy * dt; m.position.x = u.base + Math.sin(t * u.sway + u.phase) * 0.8; if (m.position.y > 10) m.position.y = -10; });
        dust.rotation.z = t * 0.02; dust.position.y = Math.sin(t * 0.3) * 0.5;
      }
      renderer.render(scene, camera);
    };
    tick();
  }

  /* ------------------------------------------------------------------
     6. CTA band: a golden vortex of sparkles around a spinning 3D star
  ------------------------------------------------------------------ */
  function ctaScene(host) {
    const canvas = mountCanvas(host, "cta-canvas");
    const renderer = makeRenderer(canvas); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60); camera.position.z = 14;
    const n = mobile ? 250 : 700, pos = new Float32Array(n * 3), seeds = [];
    for (let i = 0; i < n; i++) seeds.push({ a: rand(0, 6.28), r: rand(1, 12), y: rand(-4, 4), sp: rand(0.2, 0.8), w: rand(0.4, 1.2) });
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ map: glowTexture(), color: 0xffffff, size: mobile ? 0.28 : 0.34, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(pts);
    const star = new THREE.Mesh(motifGeometries().star, new THREE.MeshStandardMaterial({ color: 0xfff1c9, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.35 }));
    star.scale.setScalar(mobile ? 2.2 : 3.2); star.position.set(mobile ? 0 : 6, 0, -4); scene.add(star);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8)); const l = new THREE.DirectionalLight(0xffffff, 1); l.position.set(3, 5, 6); scene.add(l);
    const resize = () => fit(renderer, camera, host); resize(); window.addEventListener("resize", resize);
    let visible = true; observeVisible(host, (v) => visible = v);
    const clock = new THREE.Clock();
    const tick = () => {
      requestAnimationFrame(tick); if (!visible) return;
      const t = reduce ? 3 : clock.getElapsedTime(), ar = host.clientWidth / Math.max(1, host.clientHeight);
      const arr = g.attributes.position.array;
      seeds.forEach((s, i) => { const a = s.a + t * s.sp, r = s.r; arr[i * 3] = Math.cos(a) * r * Math.max(1, ar * 0.5); arr[i * 3 + 1] = Math.sin(a * 0.5) * 2 + s.y * 0.6 + Math.sin(t * s.w + i) * 0.4; arr[i * 3 + 2] = Math.sin(a) * 2 - 2; });
      g.attributes.position.needsUpdate = true;
      if (!reduce) { star.rotation.y = t * 0.35; star.rotation.x = Math.sin(t * 0.5) * 0.3; }
      renderer.render(scene, camera);
    };
    tick();
  }

  /* ------------------------------------------------------------------
     7. Footer: night sky with a star-field, crescent moon and shooting stars
  ------------------------------------------------------------------ */
  function footerScene(host) {
    const canvas = mountCanvas(host, "sky-canvas");
    const renderer = makeRenderer(canvas); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100); camera.position.z = 20;
    const n = mobile ? 180 : 420, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = rand(-40, 40); pos[i * 3 + 1] = rand(-14, 14); pos[i * 3 + 2] = rand(-30, 0); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({ map: glowTexture(), color: 0xffe6bf, size: 0.32, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(stars);
    const moon = new THREE.Mesh(motifGeometries().crescent, new THREE.MeshStandardMaterial({ color: PALETTE.gold, emissive: PALETTE.gold, emissiveIntensity: 0.35, metalness: 0.4, roughness: 0.4 }));
    moon.rotation.z = 0.4; scene.add(moon);
    // Keep the moon in an empty corner: top-left on wide screens where the centred container leaves a margin,
    // otherwise small and tucked into the top-right corner so it never sits behind the footer text.
    const placeMoon = () => {
      const wide = host.clientWidth >= 1300, halfH = Math.tan(THREE.MathUtils.degToRad(30)) * 26, halfW = halfH * (host.clientWidth / Math.max(1, host.clientHeight));
      moon.scale.setScalar(wide ? 1.9 : 1.2);
      moon.position.set(wide ? -halfW * 0.94 : halfW * 0.9, wide ? halfH * 0.66 : halfH * 0.9, -6);
    };
    scene.add(new THREE.AmbientLight(0xffffff, 0.6)); const l = new THREE.DirectionalLight(0xffffff, 0.8); l.position.set(-3, 5, 8); scene.add(l);
    const shooters = [];
    for (let i = 0; i < (mobile ? 2 : 4); i++) {
      const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2.5, 0.9, 0)]);
      const ln = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })); scene.add(ln);
      shooters.push({ ln, t0: rand(0, 8), life: 0 });
    }
    const resize = () => { fit(renderer, camera, host); placeMoon(); }; resize(); window.addEventListener("resize", resize);
    let visible = true; observeVisible(host, (v) => visible = v);
    const clock = new THREE.Clock();
    const tick = () => {
      requestAnimationFrame(tick); if (!visible) return;
      const t = clock.getElapsedTime();
      if (!reduce) {
        stars.rotation.z = t * 0.004; stars.material.opacity = 0.75 + Math.sin(t * 1.3) * 0.15;
        moon.rotation.y = Math.sin(t * 0.3) * 0.25;
        shooters.forEach((s) => { if (t > s.t0) { s.life += 0.02; const p = s.life; s.ln.position.set(18 - p * 40, 10 - p * 14, -5); s.ln.material.opacity = Math.sin(Math.min(1, p) * Math.PI) * 0.9; if (p >= 1) { s.life = 0; s.t0 = t + rand(3, 9); s.ln.material.opacity = 0; } } });
      }
      renderer.render(scene, camera);
    };
    tick();
  }

  function mountDataScenes() {
    document.querySelectorAll('[data-scene="crystals"]').forEach((h) => { if (mobile && h.dataset.sceneVariant === "hearts") return; lazy(h, () => crystalsScene(h)); });
    document.querySelectorAll('[data-scene="cta"]').forEach((h) => lazy(h, () => ctaScene(h)));
    const footer = document.querySelector(".footer"); if (footer) lazy(footer, () => footerScene(footer));
  }

  const start = () => { [heroScene, patternScene, lettersScene, globeScene, mountDataScenes].forEach((f) => { try { f(); } catch (e) { console.warn("scene failed", e); } }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
