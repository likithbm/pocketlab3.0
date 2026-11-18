
/*
======================================================
POCKETLAB 3D EXPERIMENT VIEWER
Physics | Chemistry | Biology | Mathematics

- Interactive rotating 3D-style models
- Mouse drag to rotate
- Scroll wheel to zoom
- Animated components
- Start / Pause / Reset
- Activity slider
- Works without external libraries or internet
- Does not replace existing experiments
======================================================
*/

(() => {
  "use strict";

  if (window.PocketLab3D) return;

  const CSS = `
    .pl3d-open {
      background:linear-gradient(105deg,#0eafa9,#5762e8)!important;
      color:white!important;
      border:1px solid #6ae5f1!important;
      border-radius:9px;
      padding:9px 13px;
      font-size:12px;
      font-weight:850;
      cursor:pointer;
      margin:5px;
    }

    .pl3d-open:hover {
      filter:brightness(1.18);
    }

    #pl3d-modal {
      position:fixed;
      inset:0;
      z-index:2147483645;
      background:#020916ed;
      display:grid;
      place-items:center;
      padding:14px;
      color:#eaf5ff;
      font:14px system-ui,Segoe UI,Arial,sans-serif;
    }

    #pl3d-modal[hidden] {
      display:none!important;
    }

    .pl3d-window {
      width:min(1120px,100%);
      max-height:94vh;
      overflow:auto;
      background:#0d1d35;
      border:1px solid #3f7e9e;
      border-radius:20px;
      box-shadow:0 26px 90px #0009;
    }

    .pl3d-header,
    .pl3d-bottom {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      flex-wrap:wrap;
      padding:15px 20px;
    }

    .pl3d-header h2 {
      margin:4px 0;
      font-size:23px;
    }

    .pl3d-small {
      font-size:12px;
      color:#a6c6dc;
    }

    .pl3d-close {
      background:#203c58;
      border:1px solid #578cac;
      color:white;
      border-radius:9px;
      padding:10px 15px;
      cursor:pointer;
      font-weight:800;
    }

    .pl3d-canvaswrap {
      position:relative;
      background:#061326;
      border-block:1px solid #28516e;
    }

    #pl3d-canvas {
      display:block;
      width:100%;
      height:clamp(290px,54vh,550px);
      touch-action:none;
      cursor:grab;
    }

    #pl3d-canvas:active {
      cursor:grabbing;
    }

    .pl3d-hint {
      position:absolute;
      bottom:12px;
      left:14px;
      background:#07192bbb;
      border:1px solid #3e6689;
      border-radius:9px;
      padding:7px 10px;
      font-size:11px;
      color:#cce8f6;
      pointer-events:none;
    }

    .pl3d-controls {
      display:flex;
      gap:12px;
      align-items:center;
      flex-wrap:wrap;
    }

    .pl3d-controls label {
      font-size:12px;
      color:#c4d9ed;
      display:flex;
      align-items:center;
      gap:9px;
    }

    .pl3d-controls input {
      accent-color:#38d5e4;
      width:140px;
    }

    #pl3d-message {
      padding:0 20px 18px;
      color:#97b7d2;
      font-size:12px;
      line-height:1.5;
    }

    @media(max-width:600px) {
      .pl3d-header h2 {
        font-size:18px;
      }

      .pl3d-controls input {
        width:105px;
      }
    }
  `;

  let modal;
  let canvas;
  let context;
  let active = null;

  let frame = 0;
  let running = true;
  let yaw = -0.6;
  let pitch = -0.38;
  let zoom = 0;
  let activity = 55;

  let frameId = 0;
  let pointer = null;
  let lastTime = 0;

  let shapes = [];
  let WIDTH = 900;
  let HEIGHT = 480;

  const TWO_PI = Math.PI * 2;

  const palette = [
    "#59dbee",
    "#977afa",
    "#ffbc65",
    "#70e5a4",
    "#fc839b",
    "#95aafa"
  ];

  /* ====================================
     IDENTIFY EXPERIMENT TYPE
  ==================================== */

  function classify(subject, title, key) {
    const t = `${title} ${key}`.toLowerCase();

    if (/biology|bio/.test(subject)) {
      if (/dna|genetic|chromosome|heredit|rna/.test(t)) {
        return "dna";
      }

      if (/plant|photosynth|transpir|seed|flower/.test(t)) {
        return "plant";
      }

      if (/cell|mitosis|division|osmosis|diffusion/.test(t)) {
        return "cell";
      }

      if (/respirat|lung|breath|heart|blood|circulat/.test(t)) {
        return "organs";
      }

      return "cell";
    }

    if (/chem/.test(subject)) {
      if (/periodic|atom|electron|orbital/.test(t)) {
        return "atom";
      }

      if (/bond|molecul|compound|structure/.test(t)) {
        return "molecule";
      }

      if (/matter|solid|liquid|gas|phase/.test(t)) {
        return "particles";
      }

      if (/ph|acid|base|titration|neutral|reaction|rate|separat|distill|filter/.test(t)) {
        return "beaker";
      }

      return "molecule";
    }

    if (/math/.test(subject)) {
      if (/graph|function|parabol|surface|calculus|derivative/.test(t)) {
        return "surface";
      }

      if (/vector|matrix|coordinate|transformation/.test(t)) {
        return "vectors";
      }

      if (/trigon|sin|cos|wave/.test(t)) {
        return "wave";
      }

      return "geometry";
    }

    if (/pendul/.test(t)) return "pendulum";

    if (/car|motion|speed|velocity|accel|collision|ramp|friction|wheel/.test(t)) {
      return "car";
    }

    if (/induct|magnet|solenoid|electromagnet|faraday/.test(t)) {
      return "induction";
    }

    if (/light|optic|reflect|refract|lens|prism|photoelectric/.test(t)) {
      return "optics";
    }

    if (/sound|wave|vibration|frequency/.test(t)) {
      return "wave";
    }

    if (/thermal|heat|temperat|expansion|conduction/.test(t)) {
      return "heat";
    }

    if (/pulley|lever|force|work|energy|gravity/.test(t)) {
      return "mechanics";
    }

    return "circuit";
  }

  function details(card) {
    const raw =
      card?.dataset.category ||
      card?.dataset.subject ||
      "";

    const subject = /math/.test(raw)
      ? "Mathematics"
      : (raw || "Physics");

    const title =
      card?.querySelector("h3,h4,.pl-experiment-title")
        ?.textContent?.trim() ||
      document.querySelector("#activeExperimentTitle")
        ?.textContent?.trim() ||
      "PocketLab Experiment";

    const key =
      card?.querySelector("[data-experiment],[data-chem4],[data-pmath]")
        ?.dataset.experiment ||
      card?.dataset.experiment ||
      title;

    return {
      title,
      subject,
      kind: classify(subject.toLowerCase(), title, key),
      card
    };
  }

  /* ====================================
     BUILD THE 3D USER INTERFACE
  ==================================== */

  function ensureUI() {
    if (modal) return;

    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    modal = document.createElement("div");
    modal.id = "pl3d-modal";
    modal.hidden = true;

    modal.innerHTML = `
      <div class="pl3d-window"
           role="dialog"
           aria-modal="true"
           aria-label="PocketLab interactive 3D">

        <div class="pl3d-header">
          <div>
            <span class="pl3d-small" id="pl3d-subject">
              POCKETLAB 3D
            </span>

            <h2 id="pl3d-title">
              Interactive 3D
            </h2>
          </div>

          <button
            type="button"
            class="pl3d-close"
            id="pl3d-close">
            ✕ Close
          </button>
        </div>

        <div class="pl3d-canvaswrap">
          <canvas id="pl3d-canvas"></canvas>

          <div class="pl3d-hint">
            Drag to rotate • Scroll to zoom • Move slider
          </div>
        </div>

        <div class="pl3d-bottom">
          <div class="pl3d-controls">

            <button
              type="button"
              class="pl3d-close"
              id="pl3d-play">
              ⏸ Pause
            </button>

            <button
              type="button"
              class="pl3d-close"
              id="pl3d-reset">
              ↺ Reset
            </button>

            <label>
              Activity

              <input
                id="pl3d-activity"
                type="range"
                min="0"
                max="100"
                value="55">

              <span id="pl3d-activity-value">
                55%
              </span>
            </label>

          </div>

          <button
            type="button"
            class="pl3d-open"
            id="pl3d-original">
            Open original experiment ↗
          </button>
        </div>

        <div id="pl3d-message"></div>
      </div>
    `;

    document.body.appendChild(modal);

    canvas = document.getElementById("pl3d-canvas");
    context = canvas.getContext("2d");

    document.getElementById("pl3d-close").onclick = close;

    modal.addEventListener("click", e => {
      if (e.target === modal) close();
    });

    document.getElementById("pl3d-play").onclick = () => {
      running = !running;

      document.getElementById("pl3d-play").textContent =
        running ? "⏸ Pause" : "▶ Start";

      lastTime = 0;
    };

    document.getElementById("pl3d-reset").onclick = () => {
      yaw = -0.6;
      pitch = -0.38;
      zoom = 0;
      activity = 55;
      frame = 0;
      running = true;

      document.getElementById("pl3d-play").textContent =
        "⏸ Pause";

      document.getElementById("pl3d-activity").value =
        "55";

      document.getElementById("pl3d-activity-value").textContent =
        "55%";

      draw();
    };

    document.getElementById("pl3d-activity").oninput = e => {
      activity = Number(e.target.value);

      document.getElementById("pl3d-activity-value").textContent =
        activity + "%";

      draw();
    };

    document.getElementById("pl3d-original").onclick = () => {
      const card = active?.card;

      const start = card?.querySelector(
        "[data-experiment],.pl-experiment-start,[data-chem4],[data-pmath]"
      );

      close();

      if (start) start.click();
    };

    /* Rotate using mouse or touch */

    canvas.addEventListener("pointerdown", e => {
      pointer = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY
      };

      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener("pointermove", e => {
      if (!pointer || pointer.id !== e.pointerId) return;

      yaw += (e.clientX - pointer.x) * 0.012;

      pitch = Math.max(
        -1.35,
        Math.min(
          1.35,
          pitch + (e.clientY - pointer.y) * 0.01
        )
      );

      pointer.x = e.clientX;
      pointer.y = e.clientY;

      draw();
    });

    for (const eventName of ["pointerup", "pointercancel"]) {
      canvas.addEventListener(eventName, () => {
        pointer = null;
      });
    }

    /* Zoom */

    canvas.addEventListener(
      "wheel",
      e => {
        e.preventDefault();

        zoom = Math.max(
          -2,
          Math.min(
            7,
            zoom + Math.sign(e.deltaY) * 0.55
          )
        );

        draw();
      },
      { passive: false }
    );

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !modal.hidden) {
        close();
      }
    });
  }

  function open(card) {
    ensureUI();

    active = details(card);
    modal.hidden = false;

    document.getElementById("pl3d-title").textContent =
      active.title;

    document.getElementById("pl3d-subject").textContent =
      `POCKETLAB 3D · ${active.subject.toUpperCase()}`;

    document.getElementById("pl3d-message").textContent =
      "Interactive 3D concept visualization. " +
      "Use the original experiment for formulas, " +
      "measurements, MCQs and completion tracking.";

    document.getElementById("pl3d-original").hidden =
      !card;

    yaw = -0.6;
    pitch = -0.38;
    zoom = 0;
    frame = 0;
    running = true;
    activity = 55;
    lastTime = 0;

    document.getElementById("pl3d-play").textContent =
      "⏸ Pause";

    document.getElementById("pl3d-activity").value =
      55;

    document.getElementById("pl3d-activity-value").textContent =
      "55%";

    resize();
    loop(0);
  }

  function close() {
    if (!modal) return;

    modal.hidden = true;
    active = null;

    cancelAnimationFrame(frameId);

    frameId = 0;
    pointer = null;
  }

  /* ====================================
     3D CAMERA / PROJECTION
  ==================================== */

  function resize() {
    if (!canvas) return;

    const r = canvas.getBoundingClientRect();

    const d = Math.min(
      2,
      window.devicePixelRatio || 1
    );

    WIDTH = Math.max(300, r.width);
    HEIGHT = Math.max(280, r.height);

    canvas.width = Math.round(WIDTH * d);
    canvas.height = Math.round(HEIGHT * d);

    context.setTransform(d, 0, 0, d, 0, 0);

    draw();
  }

  function project(x, y, z) {
    const sy = Math.sin(yaw);
    const cy = Math.cos(yaw);

    const sp = Math.sin(pitch);
    const cp = Math.cos(pitch);

    const xx = x * cy - z * sy;
    const zz = x * sy + z * cy;

    const yy = y * cp - zz * sp;
    const depth = y * sp + zz * cp;

    const scale =
      Math.min(WIDTH / 9, HEIGHT / 5.5) *
      7 / (7 + zoom + depth * 0.43);

    return {
      x: WIDTH * 0.5 + xx * scale,
      y: HEIGHT * 0.53 - yy * scale,
      s: scale,
      d: depth
    };
  }

  function add(type, positions, color, size = 1, label = "") {
    const projected = positions.map(p => project(...p));

    shapes.push({
      type,
      ps: projected,
      color,
      size,
      label,
      depth:
        projected.reduce((v, p) => v + p.d, 0) /
        projected.length
    });
  }

  const ball = (x, y, z, r, c, l = "") =>
    add("ball", [[x, y, z]], c, r, l);

  const tube = (a, b, c, w = 0.065) =>
    add("tube", [a, b], c, w);

  const poly = (points, c) =>
    add("poly", points, c);

  const mark = (x, y, z, text, c = "#c5eafb") =>
    add("text", [[x, y, z]], c, 1, text);

  function box(x, y, z, w, h, d, color) {
    const p = [
      [-1,-1,-1],
      [1,-1,-1],
      [1,1,-1],
      [-1,1,-1],
      [-1,-1,1],
      [1,-1,1],
      [1,1,1],
      [-1,1,1]
    ].map(([a, b, c]) => [
      x + a * w / 2,
      y + b * h / 2,
      z + c * d / 2
    ]);

    const faces = [
      [0,1,2,3],
      [4,5,6,7],
      [0,1,5,4],
      [2,3,7,6],
      [1,2,6,5],
      [0,3,7,4]
    ];

    for (const face of faces) {
      poly(face.map(i => p[i]), color);
    }

    const edges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];

    for (const [a, b] of edges) {
      tube(p[a], p[b], "#a4d9e8", 0.018);
    }
  }

  function ring(
    x, y, z, rx, rz, c,
    orientation = "horizontal",
    n = 40
  ) {
    let prev = null;

    for (let i = 0; i <= n; i++) {
      const a = TWO_PI * i / n;

      const p =
        orientation === "vertical"
          ? [
              x + Math.cos(a) * rx,
              y + Math.sin(a) * rz,
              z
            ]
          : orientation === "side"
            ? [
                x,
                y + Math.cos(a) * rx,
                z + Math.sin(a) * rz
              ]
            : [
                x + Math.cos(a) * rx,
                y,
                z + Math.sin(a) * rz
              ];

      if (prev) {
        tube(prev, p, c, 0.045);
      }

      prev = p;
    }
  }

  function spiral(x, y, z, loops, len, r, c) {
    let prev = null;

    for (let i = 0; i <= loops * 26; i++) {
      const t = i / (loops * 26);
      const a = t * TWO_PI * loops;

      const p = [
        x + (t - 0.5) * len,
        y + Math.cos(a) * r,
        z + Math.sin(a) * r
      ];

      if (prev) {
        tube(prev, p, c, 0.035);
      }

      prev = p;
    }
  }

  function grid() {
    for (let n = -4; n <= 4; n++) {
      tube(
        [n, -1.65, -4],
        [n, -1.65, 4],
        "#173650",
        0.012
      );

      tube(
        [-4, -1.65, n],
        [4, -1.65, n],
        "#173650",
        0.012
      );
    }
  }

  /* ====================================
     PHYSICS 3D MODELS
  ==================================== */

  function circuit() {
    const corners = [
      [-2, -0.75, -1.1],
      [2, -0.75, -1.1],
      [2, -0.75, 1.1],
      [-2, -0.75, 1.1]
    ];

    for (let i = 0; i < 4; i++) {
      tube(
        corners[i],
        corners[(i + 1) % 4],
        "#f6ba72",
        0.06
      );
    }

    box(
      -2, -0.55, 0,
      0.48, 1.05, 0.72,
      "#3f79c5"
    );

    mark(-2, 0.15, 0, "BATTERY");

    box(
      0.45, -0.72, -1.1,
      1, 0.32, 0.33,
      "#d48d52"
    );

    mark(0.45, -0.24, -1.1, "RESISTOR");

    ball(
      2, -0.4, 0,
      0.44,
      `rgba(255,210,110,${0.4 + 0.005 * activity})`
    );

    mark(2, 0.25, 0, "BULB");

    for (let i = 0; i < 9; i++) {
      const p = ((frame * 0.28 + i / 9) % 1) * 4;

      ball(
        -1.85 + p,
        -0.75,
        -1.1,
        0.055,
        "#51e9f5"
      );
    }
  }

  function induction() {
    spiral(
      0.15, 0.05, 0,
      10, 2.7, 0.65,
      "#ffba69"
    );

    box(
      -1.85, 0.05, 0,
      1.25, 0.78, 0.92,
      "#e86875"
    );

    box(
      -1.43, 0.05, 0,
      0.45, 0.8, 0.95,
      "#477ff1"
    );

    mark(-1.65, 0.8, 0, "N / S");

    for (let i = 0; i < 5; i++) {
      const a = i * TWO_PI / 5 + frame * 0.13;

      ring(
        0.1, 0.05, 0,
        0.95 + 0.11 * i,
        0.95 + 0.11 * i,
        `rgba(71,222,242,${0.55 - i * 0.07})`,
        "side",
        36
      );

      ball(
        1.85,
        Math.cos(a) * 0.7,
        Math.sin(a) * 0.7,
        0.07,
        "#51deeb"
      );
    }

    mark(0.2, 1.32, 0, "COIL + MAGNET");
  }

  function pendulum() {
    tube(
      [-1.5, 1.55, 0],
      [1.5, 1.55, 0],
      "#a6cadb",
      0.11
    );

    const a =
      Math.sin(frame * 0.55) *
      (activity / 100) *
      0.9;

    const end = [
      Math.sin(a) * 1.8,
      1.55 - Math.cos(a) * 1.8,
      0
    ];

    tube(
      [0, 1.55, 0],
      end,
      "#e8effd",
      0.047
    );

    ball(...end, 0.32, "#fbbd69");

    tube(
      [0, 1.55, 0],
      [0, -0.7, 0],
      "#2c5068",
      0.015
    );

    mark(0, 2, 0, "PENDULUM");
  }

  function car() {
    box(
      0, -0.22, 0,
      2.4, 0.58, 1.28,
      "#3476d7"
    );

    box(
      -0.35, 0.25, 0,
      1.25, 0.5, 1,
      "#6bdde7"
    );

    for (const x of [-0.84, 0.84]) {
      for (const z of [-0.69, 0.69]) {
        ring(
          x, -0.64, z,
          0.34, 0.34,
          "#101927",
          "vertical"
        );

        ring(
          x, -0.64, z,
          0.16, 0.16,
          "#80a5bd",
          "vertical"
        );
      }
    }

    for (let i = 0; i < 7; i++) {
      const x =
        ((i * 1.2 - frame * 0.35) % 9 + 9) % 9 - 4.5;

      tube(
        [x, -1.15, 1.8],
        [x + 0.45, -1.15, 1.8],
        "#f8ca85",
        0.055
      );
    }

    mark(0, 1.24, 0, "MOTION & FORCE");
  }

  function optics() {
    poly(
      [
        [-0.35, -0.85, 0],
        [0.55, -0.85, 0],
        [0.12, 0.75, 0]
      ],
      "#5fa8d4"
    );

    for (let i = -2; i <= 2; i++) {
      const h = i * 0.23;

      tube(
        [-2.6, h, -0.45],
        [-0.12, h, -0.1],
        "#f7d971",
        0.055
      );

      tube(
        [-0.12, h, -0.1],
        [2.1, h + i * 0.25, 0.55],
        "#6ce9f8",
        0.055
      );
    }

    mark(0.25, 1.28, 0, "LIGHT & OPTICS");
  }

  function wave() {
    for (let j = 0; j < 3; j++) {
      let prev = null;

      for (let i = 0; i <= 95; i++) {
        const x = -3.1 + i * 6.2 / 95;

        const p = [
          x,
          0.52 *
            Math.sin(x * 2.3 - frame * 0.6 + j * 0.7) *
            (activity / 100 + 0.2),
          j * 0.55 - 0.55
        ];

        if (prev) {
          tube(prev, p, palette[j], 0.045);
        }

        prev = p;
      }
    }

    mark(0, 1.7, 0, "WAVE MOTION");
  }

  function heat() {
    box(
      0, -0.25, 0,
      3, 0.44, 0.65,
      "#e88c56"
    );

    for (let i = 0; i < 20; i++) {
      const x = -1.45 + (i % 10) * 0.31;
      const y = -0.1 + Math.sin(frame * 0.8 + i) * 0.18;
      const z = (Math.floor(i / 10) - 0.5) * 0.3;

      ball(
        x, y, z,
        0.13,
        i % 3 ? "#fac17e" : "#f06a58"
      );
    }

    for (let i = 0; i < 8; i++) {
      ball(
        -1.2 + i * 0.35,
        0.42 + Math.sin(frame * 0.65 + i) * 0.2,
        0,
        0.06,
        "#ffd270"
      );
    }

    mark(0, 1.3, 0, "HEATING & EXPANSION");
  }

  function mechanics() {
    box(
      -1.5, -0.52, 0,
      1, 0.85, 1,
      "#4c9bd5"
    );

    box(
      1.55, -0.55, 0,
      0.75, 1.2, 0.8,
      "#dc935c"
    );

    ring(
      0, 1.05, 0,
      0.5, 0.5,
      "#8de3f1",
      "vertical"
    );

    tube(
      [-1.5, 0.1, 0],
      [-0.5, 1.05, 0],
      "#f6cd80",
      0.04
    );

    tube(
      [0.5, 1.05, 0],
      [1.55, 0.15, 0],
      "#f6cd80",
      0.04
    );

    mark(0, 1.95, 0, "FORCES & PULLEY");
  }

  /* ====================================
     CHEMISTRY 3D MODELS
  ==================================== */

  function atom() {
    ball(0, 0, 0, 0.38, "#ffad7e");

    for (let j = 0; j < 3; j++) {
      const a = j * Math.PI / 3;
      let previous = null;

      for (let i = 0; i <= 72; i++) {
        const theta = i * TWO_PI / 72;

        const x = Math.cos(theta) * 1.75;
        const y = Math.sin(theta) * 1.05 * Math.cos(a);
        const z = Math.sin(theta) * 1.05 * Math.sin(a);

        const p = [x, y, z];

        if (previous) {
          tube(previous, p, palette[j], 0.035);
        }

        previous = p;
      }

      const theta = frame * 0.4 + j * 2.12;

      ball(
        Math.cos(theta) * 1.75,
        Math.sin(theta) * 1.05 * Math.cos(a),
        Math.sin(theta) * 1.05 * Math.sin(a),
        0.12,
        "#6ff3ff"
      );
    }

    mark(0, 2, 0, "ATOMIC STRUCTURE");
  }

  function molecule() {
    const atoms = [
      [0, 0, 0, 0.48, "#fc777f"],
      [-1.35, 0.75, 0, 0.33, "#e9f3ff"],
      [1.35, 0.75, 0, 0.33, "#e9f3ff"],
      [0, -1.15, 0.65, 0.23, "#69d6ef"]
    ];

    for (let i = 1; i < atoms.length; i++) {
      tube(
        atoms[0].slice(0, 3),
        atoms[i].slice(0, 3),
        "#b2cbe2",
        0.13
      );
    }

    for (const a of atoms) {
      ball(a[0], a[1], a[2], a[3], a[4]);
    }

    mark(0, 1.7, 0, "MOLECULAR BONDS");
  }

  function particles() {
    box(
      0, 0, 0,
      3.15, 2.7, 2.2,
      "#2e698d"
    );

    const motion = activity / 100;

    for (let i = 0; i < 34; i++) {
      const x = ((i * 137) % 29) / 29 * 2.6 - 1.3;
      const y = ((i * 57) % 23) / 23 * 2.15 - 1.05;
      const z = ((i * 71) % 19) / 19 * 1.7 - 0.85;

      ball(
        x + Math.sin(frame + i) * 0.3 * motion,
        y + Math.cos(frame * 0.7 + i) * 0.3 * motion,
        z,
        0.1,
        palette[i % 4]
      );
    }

    mark(0, 1.75, 0, "PARTICLE MOTION");
  }

  function beaker() {
    const b = [
      [-1, -1.35, -0.8],
      [1, -1.35, -0.8],
      [1, -1.35, 0.8],
      [-1, -1.35, 0.8],
      [-1, 0.95, -0.8],
      [1, 0.95, -0.8],
      [1, 0.95, 0.8],
      [-1, 0.95, 0.8]
    ];

    const edges = [
      [0,4],[1,5],[2,6],[3,7],
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4]
    ];

    for (const [a, c] of edges) {
      tube(
        b[a],
        b[c],
        "#76cdec",
        0.044
      );
    }

    poly(
      [
        [-0.9, -0.6, -0.7],
        [0.9, -0.6, -0.7],
        [0.9, -0.6, 0.7],
        [-0.9, -0.6, 0.7]
      ],
      "#2bbaa6"
    );

    for (let i = 0; i < 15; i++) {
      const x = (i % 5) * 0.35 - 0.7;
      const z = Math.floor(i / 5) * 0.46 - 0.45;

      ball(
        x,
        -0.8 + Math.sin(frame * 0.6 + i) * 0.16,
        z,
        0.12,
        palette[i % 5]
      );
    }

    mark(0, 1.55, 0, "CHEMICAL EXPERIMENT");
  }

  /* ====================================
     BIOLOGY 3D MODELS
  ==================================== */

  function dna() {
    let prevA = null;
    let prevB = null;

    for (let i = 0; i <= 40; i++) {
      const y = -1.75 + i * 0.09;
      const a = i * 0.28 + frame * 0.14;

      const left = [
        Math.cos(a) * 0.75,
        y,
        Math.sin(a) * 0.75
      ];

      const right = [
        -left[0],
        y,
        -left[2]
      ];

      if (prevA) {
        tube(prevA, left, "#64d7f2", 0.075);
        tube(prevB, right, "#e39afa", 0.075);
      }

      if (i % 3 === 0) {
        tube(
          left,
          right,
          i % 2 ? "#f6bf80" : "#80e3b0",
          0.075
        );
      }

      prevA = left;
      prevB = right;
    }

    mark(0, 2.1, 0, "DNA DOUBLE HELIX");
  }

  function cell() {
    ball(
      0, 0, 0,
      1.65,
      "rgba(68,185,181,0.48)"
    );

    ring(
      0, 0, 0,
      1.65, 1.65,
      "#7ce2d9",
      "side"
    );

    ball(
      -0.24, 0, 0,
      0.63,
      "#8f80e8"
    );

    ball(
      -0.18, 0, 0.45,
      0.22,
      "#f7a5ce"
    );

    for (let i = 0; i < 12; i++) {
      const a = i * TWO_PI / 12;
      const t = i * 1.27;

      ball(
        Math.cos(a) * 1.1,
        Math.sin(t) * 0.75,
        Math.sin(a) * 0.9,
        0.16,
        palette[i % 4]
      );
    }

    mark(0, 2, 0, "CELL STRUCTURE");
  }

  function plant() {
    tube(
      [0, -1.6, 0],
      [0, 1.5, 0],
      "#65d797",
      0.17
    );

    for (let i = 0; i < 7; i++) {
      const y = -0.9 + i * 0.35;
      const side = i % 2 ? 1 : -1;

      tube(
        [0, y, 0],
        [side * 0.85, y + 0.27, 0.2],
        "#63d4a0",
        0.06
      );

      ball(
        side * 0.95,
        y + 0.29,
        0.2,
        0.31,
        "#4bc888"
      );
    }

    ball(
      0, 1.5, 0,
      0.32,
      "#f7bc75"
    );

    for (let i = 0; i < 6; i++) {
      const a = i * TWO_PI / 6;

      ball(
        Math.cos(a) * 0.45,
        1.5 + Math.sin(a) * 0.45,
        0,
        0.24,
        "#fa83bc"
      );
    }

    mark(0, 2.3, 0, "PLANT LIFE");
  }

  function organs() {
    tube(
      [0, 1.6, 0],
      [0, 0.15, 0],
      "#acdff0",
      0.18
    );

    tube(
      [0, 0.15, 0],
      [-0.7, -0.3, 0],
      "#acdff0",
      0.12
    );

    tube(
      [0, 0.15, 0],
      [0.7, -0.3, 0],
      "#acdff0",
      0.12
    );

    ball(
      -0.9, -0.43, 0,
      0.81,
      "rgba(230,112,140,0.58)"
    );

    ball(
      0.9, -0.43, 0,
      0.81,
      "rgba(230,112,140,0.58)"
    );

    const r =
      0.95 +
      Math.sin(frame * 0.35) *
      0.07 *
      activity / 70;

    ring(
      -0.9, -0.45, 0.1,
      r * 0.75,
      r * 0.75,
      "#ef9fa6",
      "vertical"
    );

    ring(
      0.9, -0.45, 0.1,
      r * 0.75,
      r * 0.75,
      "#ef9fa6",
      "vertical"
    );

    mark(0, 2.2, 0, "BODY SYSTEMS");
  }

  /* ====================================
     MATHEMATICS 3D MODELS
  ==================================== */

  function geometry() {
    box(
      -0.8, 0, 0,
      1.7, 1.7, 1.7,
      "#587bd1"
    );

    const tip = [1.65, 1.25, 0];

    const base = [
      [0.95, -1, -0.85],
      [2.5, -1, -0.85],
      [2.5, -1, 0.85],
      [0.95, -1, 0.85]
    ];

    for (let i = 0; i < 4; i++) {
      tube(
        base[i],
        base[(i + 1) % 4],
        "#e7b977",
        0.06
      );

      tube(
        base[i],
        tip,
        "#e7b977",
        0.06
      );
    }

    mark(0, 2.1, 0, "3D GEOMETRY");
  }

  function surface() {
    for (let j = -12; j <= 12; j++) {
      let prev = null;

      for (let i = -16; i <= 16; i++) {
        const x = i * 0.17;
        const z = j * 0.17;

        const y =
          0.66 *
          Math.sin(x * 1.5 + frame * 0.1) *
          Math.cos(z * 1.35);

        const p = [x, y, z];

        if (prev) {
          tube(
            prev,
            p,
            palette[(j + 12) % 3],
            0.018
          );
        }

        prev = p;
      }
    }

    for (let i = -16; i <= 16; i += 2) {
      let prev = null;

      for (let j = -12; j <= 12; j++) {
        const x = i * 0.17;
        const z = j * 0.17;

        const p = [
          x,
          0.66 *
            Math.sin(x * 1.5 + frame * 0.1) *
            Math.cos(z * 1.35),
          z
        ];

        if (prev) {
          tube(prev, p, "#57b8c7", 0.02);
        }

        prev = p;
      }
    }

    mark(0, 1.9, 0, "3D FUNCTION SURFACE");
  }

  function vectors() {
    const axes = [
      [[2.5, 0, 0], "#ff817d", "X"],
      [[0, 2.2, 0], "#83e1a9", "Y"],
      [[0, 0, 2.3], "#7ea9ff", "Z"]
    ];

    for (const [end, color, label] of axes) {
      tube(
        [0, 0, 0],
        end,
        color,
        0.07
      );

      ball(...end, 0.12, color);
      mark(...end, label, color);
    }

    const p = [1.65, 1.45, 1.15];

    tube(
      [0, 0, 0],
      p,
      "#ffd376",
      0.11
    );

    ball(...p, 0.17, "#ffd376");
    mark(...p, "v");
  }

  /* ====================================
     REGISTER ALL MODEL RENDERERS
  ==================================== */

  const renderers = {
    circuit,
    induction,
    pendulum,
    car,
    optics,
    wave,
    heat,
    mechanics,
    atom,
    molecule,
    particles,
    beaker,
    dna,
    cell,
    plant,
    organs,
    geometry,
    surface,
    vectors
  };

  /* ====================================
     DRAW THE 3D MODEL
  ==================================== */

  function paint(shape) {
    const {
      type,
      ps,
      color,
      size,
      label
    } = shape;

    const ctx = context;

    if (type === "tube") {
      const [a, b] = ps;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(
        1,
        size * (a.s + b.s) / 2
      );

      ctx.lineCap = "round";
      ctx.stroke();

      return;
    }

    if (type === "poly") {
      ctx.beginPath();

      ps.forEach((p, i) => {
        if (i) {
          ctx.lineTo(p.x, p.y);
        } else {
          ctx.moveTo(p.x, p.y);
        }
      });

      ctx.closePath();

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.38;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      return;
    }

    const p = ps[0];

    if (type === "text") {
      ctx.font = "700 12px system-ui,Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = color;

      ctx.fillText(
        label,
        p.x,
        p.y
      );

      return;
    }

    const r = Math.max(
      1.1,
      p.s * size
    );

    const g = ctx.createRadialGradient(
      p.x - r * 0.35,
      p.y - r * 0.35,
      r * 0.06,
      p.x,
      p.y,
      r
    );

    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.18, color);
    g.addColorStop(1, "#142338");

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      r,
      0,
      TWO_PI
    );

    ctx.fillStyle = g;
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, r * 0.055);
    ctx.stroke();
  }

  function draw() {
    if (!context || !active || modal.hidden) return;

    const ctx = context;

    ctx.clearRect(
      0, 0,
      WIDTH, HEIGHT
    );

    const bg = ctx.createRadialGradient(
      WIDTH * 0.5,
      HEIGHT * 0.42,
      30,
      WIDTH * 0.5,
      HEIGHT * 0.5,
      WIDTH * 0.72
    );

    bg.addColorStop(0, "#123a56");
    bg.addColorStop(0.48, "#0b243c");
    bg.addColorStop(1, "#040b1c");

    ctx.fillStyle = bg;

    ctx.fillRect(
      0, 0,
      WIDTH, HEIGHT
    );

    shapes = [];

    grid();

    const renderer =
      renderers[active.kind] ||
      circuit;

    renderer();

    shapes.sort(
      (a, b) => b.depth - a.depth
    );

    for (const shape of shapes) {
      paint(shape);
    }

    ctx.fillStyle = "#84aac9";
    ctx.font = "12px system-ui,Arial";
    ctx.textAlign = "left";

    ctx.fillText(
      `3D MODEL: ${active.kind.toUpperCase()}  •  ACTIVITY ${activity}%`,
      18,
      25
    );
  }

  function loop(t) {
    if (!active || modal.hidden) return;

    if (running && lastTime) {
      frame +=
        (Math.min(50, t - lastTime) / 1000) *
        (0.35 + activity / 65);
    }

    lastTime = t;

    draw();

    frameId = requestAnimationFrame(loop);
  }

  /* ====================================
     ADD 3D BUTTONS TO EXPERIMENT CARDS
  ==================================== */

  function decorate() {
    const cards = document.querySelectorAll(
      ".experiment-card"
    );

    for (const card of cards) {
      if (card.querySelector(".pl3d-open")) {
        continue;
      }

      const button = document.createElement("button");

      button.type = "button";
      button.className = "pl3d-open";
      button.textContent = "🧊 View in 3D";

      button.setAttribute(
        "aria-label",
        "Open interactive 3D visualization"
      );

      button.addEventListener("click", e => {
        e.stopPropagation();
        e.preventDefault();

        open(card);
      });

      const target =
        card.querySelector(".pl-experiment-footer") ||
        card;

      target.appendChild(button);
    }
  }

  function init() {
    ensureUI();
    decorate();

    const observer = new MutationObserver(() => {
      decorate();
    });

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

    window.addEventListener("resize", () => {
      if (active) {
        resize();
      }
    });

    console.info(
      "PocketLab 3D ready — experiment cards upgraded."
    );
  }

  window.PocketLab3D = {
    open,
    close
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }
})();
