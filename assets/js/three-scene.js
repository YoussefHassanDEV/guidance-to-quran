/* Guidance to Quran — Three.js art scenes
   1. Hero: morphing particle constellation (crescent → star → Quran → mosque) over a nebula shader
   2. Stats band: animated 8-fold Islamic geometric pattern (fragment shader)
   3. Courses banner: floating Arabic letters
   4. Globe: student world map (draggable)
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
      uniforms: { uTime: { value: 0 }, uDark: { value: 0 }, uA: { value: new THREE.Color(0xf7b733) }, uB: { value: new THREE.Color(0x7dd3fc) }, uC: { value: new THREE.Color(0xff6b9d) } },
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
    const palette = [new THREE.Color(0xf7b733), new THREE.Color(0xffd166), new THREE.Color(0x7dd3fc), new THREE.Color(0xff6b9d), new THREE.Color(0xffffff)];
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
      if (mat.userData.dark !== dark) { mat.userData.dark = dark; mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending; mat.color.set(dark ? 0xffffff : 0x2b4a7a); mat.needsUpdate = true; }
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
    if (!host || document.body.dataset.page !== "courses") return;
    const canvas = document.createElement("canvas"); canvas.className = "letters-canvas"; canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const renderer = makeRenderer(canvas); if (!renderer) { canvas.remove(); return; }
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50); camera.position.z = 12;
    const letters = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
    const texFor = (ch, color) => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); g.font = "bold 84px Amiri, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = color; g.shadowBlur = 18; g.fillStyle = color; g.fillText(ch, 64, 70); return new THREE.CanvasTexture(c); };
    const colors = ["#f7b733", "#7dd3fc", "#ffffff", "#ff6b9d", "#86efac"];
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
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R - 0.02, 48, 48), new THREE.MeshPhongMaterial({ color: 0x1c4e9c, transparent: true, opacity: 0.55, shininess: 30 })));
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R, 24, 24), new THREE.MeshBasicMaterial({ color: 0x7dd3fc, wireframe: true, transparent: true, opacity: 0.18 })));
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.12, 48, 48), new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.08, side: THREE.BackSide })));
    const haloGeo = new THREE.BufferGeometry(), hp = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) { const a = rand(0, 6.28), r = R * rand(1.25, 1.6); hp[i * 3] = Math.cos(a) * r; hp[i * 3 + 1] = rand(-0.4, 0.4); hp[i * 3 + 2] = Math.sin(a) * r; }
    haloGeo.setAttribute("position", new THREE.BufferAttribute(hp, 3));
    const halo = new THREE.Points(haloGeo, new THREE.PointsMaterial({ color: 0xf7b733, size: 0.05, transparent: true, opacity: 0.7, map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.rotation.x = 0.4; scene.add(halo);
    const markers = [];
    const dotGeo = new THREE.SphereGeometry(0.06, 10, 10), ringGeo = new THREE.RingGeometry(0.09, 0.14, 24);
    COUNTRIES.forEach(([name, lat, lon], i) => {
      const p = toVec(lat, lon, R + 0.02);
      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: i % 3 ? 0xf7b733 : 0xff6b9d })); dot.position.copy(p); globe.add(dot);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xf7b733, transparent: true, opacity: 0.6, side: THREE.DoubleSide })); ring.position.copy(p); ring.lookAt(p.clone().multiplyScalar(2)); globe.add(ring);
      markers.push({ dot, ring, phase: Math.random() * 6.28, name });
      if (i % 2 === 0) { const a = toVec(21.4, 39.8, R), b = p.clone(), mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + a.distanceTo(b) * 0.35);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), new THREE.LineBasicMaterial({ color: 0xf7b733, transparent: true, opacity: 0.35 }))); }
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

  const start = () => { [heroScene, patternScene, lettersScene, globeScene].forEach((f) => { try { f(); } catch (e) { console.warn("scene failed", e); } }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
