
/* =====================================================
   POCKETLAB MATHEMATICS
   STEM FOR IMPACT 2026
   COMPLETE maths.js
   PHYSICS-STYLE UNIFORM DESIGN
   ===================================================== */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const TAU = Math.PI * 2;

  const LABS = [
    {
      id: "graph",
      icon: "📈",
      title: "Graph Explorer",
      desc: "Explore linear, quadratic and sine functions.",
      formula: "Linear: y = mx + c; Quadratic: y = ax² + bx + c",
      explanation: "A mathematical graph illustrates how one variable changes with another. Change the coefficients to observe different curves.",
      controls: [
        ["kind", "Graph Type", 1, 3, 1, 1, ""],
        ["a", "Coefficient a", 1, 5, 2, 0.5, ""],
        ["b", "Coefficient b", -5, 5, 1, 0.5, ""]
      ],
      quiz: [
        ["What is the graph of a linear function?", "Straight line", "Circle", "Parabola", "Ellipse"],
        ["What shape does a quadratic function produce?", "Parabola", "Square", "Triangle", "Cube"],
        ["Which function is periodic?", "Sine", "Linear", "Quadratic", "Constant"],
        ["What does m mean in y = mx + c?", "Slope", "Radius", "Area", "Volume"],
        ["What is the y-intercept of y = 2x + 3?", "3", "2", "5", "0"]
      ]
    },
    {
      id: "quadratic",
      icon: "📉",
      title: "Quadratic Equations",
      desc: "Visualize roots, the vertex and the discriminant.",
      formula: "x = (−b ± √(b² − 4ac)) / 2a",
      explanation: "A quadratic graph is a parabola. The discriminant b² − 4ac determines the number of distinct real roots.",
      controls: [
        ["a", "Coefficient a", 1, 5, 1, 1, ""],
        ["b", "Coefficient b", -8, 8, -2, 1, ""],
        ["c", "Coefficient c", -8, 8, -3, 1, ""]
      ],
      quiz: [
        ["What is the highest power in a quadratic equation?", "2", "1", "3", "4"],
        ["A quadratic graph is a...", "Parabola", "Circle", "Straight line", "Hyperbola always"],
        ["What is the discriminant?", "b² − 4ac", "a + b", "2a", "b² + 4ac"],
        ["A positive discriminant gives...", "Two distinct real roots", "No real roots", "One repeated root", "Four roots"],
        ["What is the vertex?", "Turning point", "Always the origin", "Y-axis", "Radius"]
      ]
    },
    {
      id: "geometry",
      icon: "📐",
      title: "Interactive Geometry",
      desc: "Explore the area and circumference of circles.",
      formula: "Area = πr²; Circumference = 2πr",
      explanation: "The radius determines the size of a circle. Doubling the radius doubles the circumference but multiplies the area by four.",
      controls: [
        ["radius", "Radius", 1, 10, 5, 0.5, " units"]
      ],
      quiz: [
        ["What is the area of a circle?", "πr²", "2πr", "r²", "πd²"],
        ["What is the circumference formula?", "2πr", "πr²", "r³", "2r²"],
        ["The diameter is...", "Twice the radius", "Half the radius", "Equal to area", "Equal to volume"],
        ["If radius doubles, area becomes...", "Four times", "Twice", "Half", "Eight times"],
        ["Approximately what is π?", "3.14", "2.14", "4.13", "1.41"]
      ]
    },
    {
      id: "trig",
      icon: "📊",
      title: "Trigonometry Simulator",
      desc: "Explore sine, cosine and tangent on a unit circle.",
      formula: "sin θ = opposite/hypotenuse; cos θ = adjacent/hypotenuse",
      explanation: "Trigonometric functions relate angles to ratios of sides in right triangles. The unit circle also shows sine and cosine as coordinates.",
      controls: [
        ["angle", "Angle", 0, 360, 45, 5, "°"]
      ],
      quiz: [
        ["sin θ is...", "Opposite/Hypotenuse", "Adjacent/Hypotenuse", "Opposite/Adjacent", "Hypotenuse/Opposite"],
        ["cos 0° equals...", "1", "0", "-1", "2"],
        ["sin 90° equals...", "1", "0", "-1", "0.5"],
        ["tan 45° equals...", "1", "0", "2", "Undefined"],
        ["Which units are commonly used for angles?", "Degrees and radians", "Metres only", "Litres", "Kilograms"]
      ]
    },
    {
      id: "pythagoras",
      icon: "📏",
      title: "Pythagoras Theorem",
      desc: "Change the sides of a right triangle.",
      formula: "a² + b² = c²",
      explanation: "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.",
      controls: [
        ["a", "Side a", 2, 12, 3, 1, " units"],
        ["b", "Side b", 2, 12, 4, 1, " units"]
      ],
      quiz: [
        ["Pythagoras theorem is...", "a² + b² = c²", "a + b = c", "ab = c", "a² − b² = c²"],
        ["The longest side is called...", "Hypotenuse", "Radius", "Diameter", "Base always"],
        ["For sides 3 and 4, hypotenuse is...", "5", "6", "7", "12"],
        ["The theorem applies to...", "Right triangles", "All circles", "All quadrilaterals", "All triangles equally"],
        ["A right angle measures...", "90°", "45°", "180°", "60°"]
      ]
    },
    {
      id: "probability",
      icon: "🎲",
      title: "Probability Laboratory",
      desc: "Run animated coin tosses and compare outcomes.",
      formula: "Experimental P(H) = Heads / Total tosses",
      explanation: "Probability measures the likelihood of an event. For a fair coin, the theoretical probability of heads is 1/2. Experimental values may differ.",
      controls: [
        ["speed", "Tosses per second", 1, 10, 3, 1, ""]
      ],
      quiz: [
        ["Probability of heads for a fair coin?", "1/2", "1", "0", "1/4"],
        ["Probability must lie between...", "0 and 1", "1 and 10", "-5 and 5", "2 and 5"],
        ["What is an impossible event's probability?", "0", "1", "0.5", "2"],
        ["What is a certain event's probability?", "1", "0", "0.5", "10"],
        ["More coin tosses often bring experimental probability closer to...", "Theoretical probability", "Always zero", "Always one", "Negative one"]
      ]
    },
    {
      id: "statistics",
      icon: "📊",
      title: "Statistics Visualizer",
      desc: "Explore bar charts, mean, median and range.",
      formula: "Mean = Sum of observations / Number of observations",
      explanation: "Statistics helps describe data. Mean is an arithmetic average, median is the middle value of sorted data, and range is maximum minus minimum.",
      controls: [
        ["value", "Change third data value", 1, 20, 8, 1, ""]
      ],
      quiz: [
        ["What is the mean?", "Arithmetic average", "Largest value", "Smallest value", "Range"],
        ["What is the median?", "Middle sorted value", "Always largest value", "Total sum", "Count"],
        ["What is the range?", "Maximum − Minimum", "Maximum + Minimum", "Sum/Count", "Median/2"],
        ["Mean of 2, 4 and 6 is...", "4", "6", "3", "12"],
        ["Which graph compares categories?", "Bar chart", "Only a circle", "Number line only", "None"]
      ]
    },
    {
      id: "transform",
      icon: "🔄",
      title: "Geometric Transformations",
      desc: "Translate, rotate and scale a shape.",
      formula: "Rotation: x′ = x cosθ − y sinθ; y′ = x sinθ + y cosθ",
      explanation: "Transformations change the position, size or orientation of shapes. Translation shifts, rotation turns, and scaling changes size.",
      controls: [
        ["rotation", "Rotation", 0, 360, 45, 5, "°"],
        ["scale", "Scale", 0.5, 2, 1, 0.1, "×"],
        ["shift", "Horizontal Translation", -5, 5, 0, 1, " units"]
      ],
      quiz: [
        ["Which transformation turns a shape?", "Rotation", "Translation", "Reflection only", "Addition"],
        ["Which transformation changes size?", "Scaling", "Translation", "Rotation", "Reflection"],
        ["Translation means...", "Moving without turning or resizing", "Always rotating", "Changing colour", "Finding area"],
        ["A 90° rotation is...", "Quarter turn", "Half turn", "Full turn", "Three full turns"],
        ["A scale factor of 2...", "Doubles side lengths", "Halves lengths", "Only moves shape", "Makes area unchanged"]
      ]
    },
    {
      id: "calculus",
      icon: "📈",
      title: "Calculus — Derivatives",
      desc: "Watch tangent lines change along a curve.",
      formula: "If f(x) = x², then f′(x) = 2x",
      explanation: "A derivative measures instantaneous rate of change. Its value represents the slope of the tangent line at a point.",
      controls: [
        ["x", "Position x", -5, 5, 2, 0.5, ""]
      ],
      quiz: [
        ["Derivative of x² is...", "2x", "x", "x³", "2"],
        ["A derivative represents...", "Instantaneous rate of change", "Only total area", "Only volume", "Probability"],
        ["Derivative of a constant is...", "0", "1", "x", "∞"],
        ["Slope of tangent to y=x² at x=3?", "6", "3", "9", "12"],
        ["At x=0, derivative of x² is...", "0", "1", "2", "-1"]
      ]
    },
    {
      id: "fractions",
      icon: "🍕",
      title: "Fractions Visualizer",
      desc: "Compare fractions using coloured circular sectors.",
      formula: "Fraction = Numerator / Denominator",
      explanation: "Fractions represent parts of a whole. A fraction can be displayed as a portion of a circle divided into equal sectors.",
      controls: [
        ["num", "Numerator", 0, 10, 2, 1, ""],
        ["den", "Denominator", 1, 10, 5, 1, ""]
      ],
      quiz: [
        ["In 3/4, the numerator is...", "3", "4", "7", "1"],
        ["In 3/4, the denominator is...", "4", "3", "7", "1"],
        ["1/2 equals...", "0.5", "0.25", "2", "0.1"],
        ["Which is equivalent to 1/2?", "2/4", "1/4", "3/4", "1/3"],
        ["A proper fraction has...", "Numerator smaller than denominator", "Larger numerator always", "Denominator zero", "No numerator"]
      ]
    }
  ];

  const labById = Object.fromEntries(
    LABS.map(lab => [lab.id, lab])
  );

  let active = null;
  let animationId = null;
  let previousTime = 0;
  let originalChildren = [];

  function safe(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  /* =========================================
     SAME VISUAL STYLE AS PHYSICS
     ========================================= */

  function installStyles() {
    if ($("pmathStyles")) return;

    const style = document.createElement("style");
    style.id = "pmathStyles";

    style.textContent = `
      .pmath-card {
        min-height:375px;
        padding:15px;
        display:flex;
        flex-direction:column;
        gap:13px;
        box-sizing:border-box;
        color:#eff7ff;
        background:linear-gradient(145deg,#112640,#0b192e);
        border:1px solid #315b83;
        border-radius:16px;
      }
      .pmath-card .pmath-preview {
        height:145px;
        border-radius:12px;
        border:1px solid #287eac;
        background:radial-gradient(circle,#174e77,#071a32);
        display:grid;
        place-items:center;
      }
      .pmath-card .pmath-orb {
        width:112px;
        height:112px;
        border-radius:50%;
        border:1px solid #2a6a96;
        box-shadow:0 0 35px #138cda44;
        display:grid;
        place-items:center;
        font-size:53px;
      }
      .pmath-card .pmath-tag {
        color:#42efb9;
        font-size:11px;
        font-weight:800;
        letter-spacing:.04em;
      }
      .pmath-card h3 {
        margin:0;
        font-size:17px;
        color:#ffffff;
      }
      .pmath-card p {
        margin:0;
        font-size:13px;
        line-height:1.6;
        color:#acc2d8;
      }
      .pmath-card .pmath-footer {
        margin-top:auto;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:8px;
      }
      .pmath-card small {
        font-size:10px;
        color:#adc6dc;
      }
      .pmath-card button {
        padding:11px 16px;
        border-radius:9px;
        border:1px solid #69bfff;
        background:linear-gradient(90deg,#168dff,#2962df);
        color:white;
        font-size:13px;
        font-weight:800;
        cursor:pointer;
        white-space:nowrap;
        box-shadow:0 0 12px #138dff44;
      }
      #pmathWorkspace {
        max-width:1450px;
        margin:auto;
        padding:18px 12px;
        color:#f2f7ff;
      }
      #pmathBack {
        display:inline-block;
        padding:8px 0;
        margin-bottom:20px;
        border:0;
        background:transparent;
        color:#4ae7f3;
        font-size:14px;
        font-weight:800;
        cursor:pointer;
      }
      .pmath-eyebrow {
        font-size:11px;
        color:#47e8f3;
        letter-spacing:.17em;
        font-weight:800;
      }
      #pmathWorkspace h1 {
        font-size:clamp(27px,3vw,40px);
        margin:15px 0;
      }
      .pmath-intro {
        color:#afc5d9;
        margin-bottom:28px;
      }
      .pmath-layout {
        display:grid;
        grid-template-columns:minmax(0,1.6fr) minmax(320px,1fr);
        align-items:start;
        gap:22px;
      }
      .pmath-panel {
        min-width:0;
        border:1px solid #315c80;
        border-radius:19px;
        padding:23px;
        background:linear-gradient(145deg,#152741,#0e1c32);
      }
      .pmath-head {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:8px;
        padding-bottom:17px;
        margin-bottom:16px;
        border-bottom:1px solid #294a69;
        font-size:17px;
        font-weight:800;
      }
      .pmath-live {
        color:#47eabb;
        font-size:11px;
        font-weight:800;
      }
      #pmathCanvas {
        width:100%;
        height:auto;
        display:block;
        background:#0b2544;
        border-radius:15px;
        border:1px solid #287ba7;
      }
      .pmath-buttons {
        margin-top:15px;
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:10px;
      }
      .pmath-btn {
        padding:12px 17px;
        border-radius:9px;
        border:1px solid #69bfff;
        color:white;
        background:#2678e5;
        font-weight:800;
        cursor:pointer;
      }
      .pmath-btn:disabled {
        opacity:.4;
        cursor:not-allowed;
      }
      .pmath-start {background:#06ae9e}
      .pmath-pause {background:#245789}
      .pmath-stop {background:#d5404b}
      .pmath-reset {background:#35546e}
      .pmath-control {margin:17px 0 26px}
      .pmath-control label {
        display:block;
        margin-bottom:12px;
        font-size:13px;
        font-weight:700;
        color:#c4d9ec;
      }
      .pmath-control input {
        width:100%;
        accent-color:#208eff;
        cursor:pointer;
      }
      .pmath-readings {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:11px;
        background:#102d4a;
        border:1px solid #2b6285;
        padding:15px;
        border-radius:14px;
      }
      .pmath-reading {
        min-height:83px;
        padding:13px;
        border:1px solid #2e698f;
        border-radius:11px;
        background:#0e2b47;
        overflow-wrap:anywhere;
      }
      .pmath-reading small {
        display:block;
        font-size:12px;
        color:#bfd3e6;
      }
      .pmath-reading strong {
        display:block;
        font-size:19px;
        margin-top:12px;
        color:#47e6f0;
      }
      .pmath-formula {
        margin-top:22px;
        padding:19px;
        border:1px solid #2b7494;
        border-radius:13px;
        background:#102e49;
      }
      .pmath-formula h3 {color:#65ede8}
      #pmathFormula {
        display:block;
        font-size:20px;
        color:#ffdd79;
        line-height:1.7;
        overflow-wrap:anywhere;
      }
      .pmath-complete {
        display:block;
        width:100%;
        margin-top:15px;
        padding:14px;
        border:0;
        border-radius:9px;
        background:linear-gradient(90deg,#937afa,#6955e1);
        color:#fff;
        font-weight:800;
        cursor:pointer;
      }
      .pmath-bottom {
        margin-top:20px;
        padding:23px;
        background:#102742;
        border:1px solid #2b6a90;
        border-radius:17px;
        line-height:1.7;
      }
      .pmath-bottom h3 {color:#65f0e7}
      .pmath-option {
        display:block;
        width:100%;
        padding:14px;
        margin:8px 0;
        text-align:left;
        border-radius:9px;
        border:1px solid #4185ad;
        background:#1c4366;
        color:white;
        cursor:pointer;
      }
      .pmath-option:disabled {cursor:default}
      .pmath-chat {
        padding:13px;
        margin:9px 0;
        border-radius:9px;
        background:#1d4465;
        white-space:pre-wrap;
      }
      #pmathAskText {
        box-sizing:border-box;
        width:100%;
        min-height:85px;
        padding:12px;
        border:1px solid #39749a;
        background:#091f35;
        color:white;
        border-radius:10px;
        resize:vertical;
      }
      @media(max-width:900px) {
        .pmath-layout {grid-template-columns:1fr}
        .pmath-panel {padding:14px}
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     CREATE UNIFORM MATHS CARDS
     ========================================= */

  function createCards() {
    const page = $("laboratory");
    if (!page) return;

    const existingCards = [
      ...page.querySelectorAll(".experiment-card")
    ];

    // Find the original Graph Explorer.
    const original = existingCards.find(card =>
      card.dataset.category === "mathematics" &&
      /Graph Explorer/i.test(card.textContent)
    );

    let grid = original?.parentElement ||
      existingCards[0]?.parentElement;

    if (!grid) {
      grid = $("pmathFallback");

      if (!grid) {
        grid = document.createElement("div");
        grid.id = "pmathFallback";
        grid.style.cssText =
          "display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px";
        page.appendChild(grid);
      }
    }

    LABS.forEach(lab => {
      let card = $("pmathCard-" + lab.id);

      if (!card && lab.id === "graph" && original) {
        card = original;
      }

      if (!card) {
        card = document.createElement("article");
        grid.appendChild(card);
      }

      card.id = "pmathCard-" + lab.id;
      card.className = "experiment-card pmath-card";
      card.dataset.category = "mathematics";
      card.dataset.recommended =
        "primary middle secondary senior college";

      card.innerHTML = `
        <div class="pmath-preview">
          <div class="pmath-orb">${lab.icon}</div>
        </div>

        <span class="pmath-tag">● ANIMATED LAB</span>

        <h3>${safe(lab.title)}</h3>
        <p>${safe(lab.desc)}</p>

        <div class="pmath-footer">
          <small>Mathematics · Live Animation</small>
          <button type="button" data-pmath="${lab.id}">
            ▶ Start
          </button>
        </div>
      `;
    });

    updateFilter();
  }

  function updateFilter() {
    const subject = $("experimentFilter")?.value || "all";

    document.querySelectorAll(".pmath-card")
      .forEach(card => {
        const visible =
          subject === "all" || subject === "mathematics";

        card.classList.toggle("hidden", !visible);
        card.style.display = visible ? "flex" : "none";
      });
  }

  /* =========================================
     EXPERIMENT WORKSPACE
     ========================================= */

  function pause() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    previousTime = 0;
    if (active) active.running = false;
  }

  function restore() {
    pause();

    originalChildren.forEach(item => {
      item.node.style.display = item.display;
    });

    originalChildren = [];
    $("pmathWorkspace")?.remove();
    active = null;
  }

  function createWorkspace() {
    const page = $("experimentWorkspace");
    if (!page) return false;
    if ($("pmathWorkspace")) return true;

    originalChildren = Array.from(page.children).map(node => ({
      node,
      display: node.style.display
    }));

    originalChildren.forEach(item => {
      item.node.style.display = "none";
    });

    const root = document.createElement("div");
    root.id = "pmathWorkspace";

    root.innerHTML = `
      <button id="pmathBack" type="button">
        ← Back to Laboratory
      </button>

      <div class="pmath-eyebrow">
        INTERACTIVE VIRTUAL EXPERIMENT
      </div>

      <h1 id="pmathTitle"></h1>
      <p class="pmath-intro" id="pmathDescription"></p>

      <div class="pmath-layout">
        <section class="pmath-panel">
          <div class="pmath-head">
            <span>Simulation Workspace</span>
            <span class="pmath-live">● INTERACTIVE</span>
          </div>

          <canvas id="pmathCanvas"
            width="1000" height="500"></canvas>

          <div class="pmath-buttons">
            <button class="pmath-btn pmath-start"
              data-pmath-action="start">▶ Start</button>

            <button class="pmath-btn pmath-pause"
              data-pmath-action="pause">⏸ Pause</button>

            <button class="pmath-btn pmath-stop"
              data-pmath-action="stop">■ Stop</button>

            <button class="pmath-btn pmath-reset"
              data-pmath-action="reset">↻ Reset</button>
          </div>
        </section>

        <section class="pmath-panel">
          <div class="pmath-head">
            <span>Experiment Controls</span>
            <span class="pmath-live">● LIVE</span>
          </div>

          <div id="pmathControls"></div>
          <div class="pmath-readings" id="pmathReadings"></div>

          <p style="font-size:12px;color:#aec4d9">
            Adjust the controls to investigate the
            mathematical relationships.
          </p>

          <div class="pmath-formula">
            <h3>📐 Experiment Formula</h3>
            <strong id="pmathFormula"></strong>
            <p id="pmathFormulaNote"></p>
          </div>

          <button class="pmath-complete"
            id="pmathComplete">
            Complete Experiment ✓
          </button>
        </section>
      </div>

      <section class="pmath-bottom">
        <h3>📖 Mathematics Behind the Experiment</h3>
        <p id="pmathScience"></p>
      </section>

      <section class="pmath-bottom">
        <h3>🧠 Five Quick MCQs</h3>

        <p id="pmathQuizProgress"></p>
        <h3 id="pmathQuizTitle"></h3>
        <div id="pmathQuizOptions"></div>
        <p id="pmathQuizFeedback"></p>

        <button class="pmath-btn"
          id="pmathNext" disabled>
          Next question →
        </button>

        <hr style="border:0;border-top:1px solid #315b7c;margin:25px 0">

        <h3>💬 Ask PocketLab Tutor</h3>
        <p>Offline Mathematics help about this experiment.</p>

        <div id="pmathChat"></div>

        <form id="pmathTutorForm">
          <textarea id="pmathAskText" required
            maxlength="500"
            placeholder="Ask about the formula, variables or results..."></textarea>

          <button type="submit" class="pmath-btn">
            ➤ Send
          </button>
        </form>
      </section>
    `;

    page.appendChild(root);

    $("pmathBack").onclick = () => {
      restore();

      if (typeof navigate === "function") {
        navigate("laboratory");
      } else {
        document.querySelectorAll(".page")
          .forEach(page => page.classList.remove("active"));

        $("laboratory")?.classList.add("active");
      }
    };

    root.addEventListener("click", event => {
      const button = event.target.closest("[data-pmath-action]");
      if (!button) return;

      const action = button.dataset.pmathAction;

      if (action === "start") play();
      if (action === "pause") pause();

      if (action === "stop") {
        pause();

        if (active) {
          active.time = 0;
          active.tosses = 0;
          active.heads = 0;
        }

        draw();
      }

      if (action === "reset") {
        reset();
      }
    });

    $("pmathNext").onclick = nextQuestion;

    $("pmathTutorForm").onsubmit = event => {
      event.preventDefault();
      answerStudent();
    };

    $("pmathComplete").onclick = () => {
      if (!active) return;

      try {
        localStorage.setItem(
          "pocketlab-maths-" + active.lab.id,
          "complete"
        );
      } catch (_) {}

      $("pmathComplete").textContent =
        "Experiment Completed ✓";
    };

    return true;
  }

  function openLab(id) {
    const lab = labById[id];
    if (!lab) return;

    pause();
    if (!createWorkspace()) return;

    active = {
      lab,
      p: {},
      time: 0,
      running: false,
      quizIndex: 0,
      score: 0,
      answered: false,
      tosses: 0,
      heads: 0
    };

    lab.controls.forEach(control => {
      active.p[control[0]] = control[4];
    });

    $("pmathTitle").textContent = lab.title;
    $("pmathDescription").textContent = lab.desc;
    $("pmathFormula").textContent = lab.formula;
    $("pmathFormulaNote").textContent = lab.explanation;
    $("pmathScience").textContent = lab.explanation;
    $("pmathChat").innerHTML = "";

    $("pmathComplete").textContent =
      "Complete Experiment ✓";

    const controls = $("pmathControls");
    controls.innerHTML = "";

    lab.controls.forEach(
      ([key, label, min, max, value, step, unit]) => {
        const group = document.createElement("div");
        group.className = "pmath-control";

        const title = document.createElement("label");
        const input = document.createElement("input");

        input.type = "range";
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = value;

        const updateTitle = () => {
          let display = input.value + unit;

          if (lab.id === "graph" && key === "kind") {
            display = ["", "Linear", "Quadratic", "Sine"][+input.value];
          }

          title.textContent = label + ": " + display;
        };

        input.oninput = () => {
          if (!active) return;

          active.p[key] = Number(input.value);

          if (lab.id === "fractions") {
            active.p.num = Math.min(
              active.p.num, active.p.den
            );
          }

          updateTitle();
          draw();
        };

        updateTitle();
        group.append(title, input);
        controls.appendChild(group);
      }
    );

    showQuestion();
    draw();

    if (typeof navigate === "function") {
      navigate("experimentWorkspace");
    } else {
      document.querySelectorAll(".page")
        .forEach(page => page.classList.remove("active"));

      $("experimentWorkspace")?.classList.add("active");
    }
  }

  /* =========================================
     ANIMATION ENGINE
     ========================================= */

  function play() {
    if (!active || active.running) return;

    active.running = true;
    previousTime = 0;
    animationId = requestAnimationFrame(tick);
  }

  function tick(timestamp) {
    if (!active || !active.running) return;

    if (previousTime) {
      const dt = Math.min(
        (timestamp - previousTime) / 1000,
        0.05
      );

      const previous = active.time;
      active.time += dt;

      if (active.lab.id === "probability") {
        const speed = active.p.speed;

        const before = Math.floor(previous * speed);
        const after = Math.floor(active.time * speed);

        for (let i = before; i < after; i++) {
          active.tosses++;

          if (Math.random() < 0.5) {
            active.heads++;
          }
        }
      }
    }

    previousTime = timestamp;

    draw();
    animationId = requestAnimationFrame(tick);
  }

  function reset() {
    if (!active) return;

    const id = active.lab.id;
    pause();
    openLab(id);
  }

  /* =========================================
     MATHEMATICAL VISUALIZATIONS
     ========================================= */

  function draw() {
    if (!active) return;

    const canvas = $("pmathCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const s = active;
    const p = s.p;
    const t = s.time;

    const W = 1000;
    const H = 500;

    ctx.clearRect(0, 0, W, H);

    const background = ctx.createRadialGradient(
      500, 240, 30, 500, 240, 650
    );

    background.addColorStop(0, "#164971");
    background.addColorStop(1, "#07182f");

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#2e628044";
    ctx.lineWidth = 1;

    for (let x = 0; x < W; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    for (let y = 0; y < H; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    function circle(x, y, radius, fill, stroke = "#a5eaff") {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function line(x, y, xx, yy, color = "#89eaff", width = 3) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(xx, yy);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    function text(value, x, y, size = 21, color = "#effaff") {
      ctx.font = `bold ${size}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(String(value), x, y);
    }

    function reading(label, value) {
      return `
        <div class="pmath-reading">
          <small>${safe(label)}</small>
          <strong>${safe(value)}</strong>
        </div>
      `;
    }

    function axes(scale = 45) {
      line(90, 250, 910, 250, "#70b4e3", 2);
      line(500, 70, 500, 435, "#70b4e3", 2);

      text("x", 929, 257, 17);
      text("y", 500, 57, 17);

      return {
        X: value => 500 + value * scale,
        Y: value => 250 - value * scale
      };
    }

    function plot(fn, color = "#64eaff", scale = 45) {
      const a = axes(scale);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;

      let started = false;

      for (let x = -9; x <= 9; x += 0.035) {
        const y = fn(x);
        const px = a.X(x);
        const py = a.Y(y);

        if (!Number.isFinite(py) || Math.abs(py) > 5000) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }

      ctx.stroke();
    }

    let readings = "";

    /* GRAPH EXPLORER */

    if (s.lab.id === "graph") {
      text("FUNCTION GRAPH EXPLORER",
        500, 42, 26, "#91efff");

      let equation;

      if (p.kind === 1) {
        equation = x => p.a * x + p.b;
      } else if (p.kind === 2) {
        equation = x => p.a * x * x + p.b * x;
      } else {
        equation = x => p.a * Math.sin(x) + p.b;
      }

      plot(equation, "#66eeff");

      const markerX = Math.sin(t) * 4;
      const markerY = equation(markerX);

      circle(
        500 + markerX * 45,
        250 - markerY * 45,
        10,
        "#ffe477"
      );

      readings += reading("Function",
        ["", "Linear", "Quadratic", "Sine"][p.kind]);

      readings += reading("Coefficient a", p.a);
      readings += reading("Coefficient b", p.b);
      readings += reading("f(0)", equation(0).toFixed(2));
    }

    /* QUADRATIC EQUATIONS */

    if (s.lab.id === "quadratic") {
      text("QUADRATIC EQUATION",
        500, 42, 26, "#91efff");

      const fn = x => p.a * x * x + p.b * x + p.c;

      plot(fn, "#6af0ff", 40);

      const D = p.b * p.b - 4 * p.a * p.c;
      const vertexX = -p.b / (2 * p.a);
      const vertexY = fn(vertexX);

      circle(
        500 + vertexX * 40,
        250 - vertexY * 40,
        9,
        "#ffe27b"
      );

      readings += reading("Discriminant", D.toFixed(2));
      readings += reading("Vertex x", vertexX.toFixed(2));
      readings += reading("Vertex y", vertexY.toFixed(2));
      readings += reading("Real roots",
        D > 0 ? "2 distinct" : D === 0 ? "1 repeated" : "None");
    }

    /* GEOMETRY */

    if (s.lab.id === "geometry") {
      text("AREA AND CIRCUMFERENCE",
        500, 42, 26, "#91efff");

      const r = p.radius;
      const radiusPx = r * 19;

      circle(500, 260, radiusPx, "#226da877", "#62e6ff");
      line(500, 260, 500 + radiusPx, 260, "#ffe17c", 5);

      text("r = " + r, 500 + radiusPx / 2,
        245, 19, "#ffe17c");

      readings += reading("Radius", r + " units");
      readings += reading("Diameter", (2 * r).toFixed(2));
      readings += reading("Area", (PI * r * r).toFixed(2));
      readings += reading("Circumference",
        (2 * PI * r).toFixed(2));
    }

    /* TRIGONOMETRY */

    if (s.lab.id === "trig") {
      text("TRIGONOMETRY UNIT CIRCLE",
        500, 42, 26, "#91efff");

      const radius = 165;
      const theta = p.angle * PI / 180;

      circle(500, 270, radius, "#155b8b22", "#69e5ff");

      line(290, 270, 710, 270, "#8dc4e9", 2);
      line(500, 90, 500, 455, "#8dc4e9", 2);

      const px = 500 + radius * Math.cos(theta);
      const py = 270 - radius * Math.sin(theta);

      line(500, 270, px, py, "#ffe17b", 5);
      line(px, py, px, 270, "#ff6b9f", 3);
      line(500, 270, px, 270, "#67e6d6", 3);
      circle(px, py, 10, "#ffe17b");

      readings += reading("Angle", p.angle + "°");
      readings += reading("sin θ",
        Math.sin(theta).toFixed(3));
      readings += reading("cos θ",
        Math.cos(theta).toFixed(3));

      readings += reading("tan θ",
        Math.abs(Math.cos(theta)) < 1e-10
          ? "Undefined"
          : Math.tan(theta).toFixed(3));
    }

    /* PYTHAGORAS */

    if (s.lab.id === "pythagoras") {
      text("PYTHAGORAS THEOREM",
        500, 42, 26, "#91efff");

      const factor = 230 / Math.max(p.a, p.b, 1);

      const ax = 330;
      const ay = 410;
      const bx = ax + p.a * factor;
      const cy = ay - p.b * factor;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, ay);
      ctx.lineTo(ax, cy);
      ctx.closePath();

      ctx.fillStyle = "#2779b455";
      ctx.fill();
      ctx.strokeStyle = "#70edff";
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.strokeRect(ax, ay - 22, 22, 22);

      const hyp = Math.sqrt(p.a * p.a + p.b * p.b);

      text("a = " + p.a, (ax + bx) / 2, ay + 28, 20);
      text("b = " + p.b, ax - 55, (ay + cy) / 2, 20);
      text("c = " + hyp.toFixed(2), (ax + bx) / 2,
        (ay + cy) / 2 - 18, 20, "#ffe17b");

      readings += reading("Side a", p.a);
      readings += reading("Side b", p.b);
      readings += reading("Hypotenuse", hyp.toFixed(3));
      readings += reading("a² + b²",
        p.a * p.a + p.b * p.b);
    }

    /* PROBABILITY */

    if (s.lab.id === "probability") {
      text("COIN TOSS PROBABILITY",
        500, 42, 26, "#91efff");

      const result = s.tosses === 0
        ? "?"
        : (s.heads + (s.tosses - s.heads)) % 2 === 0
          ? "H" : "T";

      const width = 125 + Math.abs(Math.sin(t * 9)) * 35;

      ctx.save();
      ctx.translate(500, 230);
      ctx.scale(width / 155, 1);
      circle(0, 0, 125, "#e4b848", "#ffe59d");
      text(result, 0, 16, 60, "#573b15");
      ctx.restore();

      const tails = s.tosses - s.heads;

      readings += reading("Total tosses", s.tosses);
      readings += reading("Heads", s.heads);
      readings += reading("Tails", tails);

      readings += reading("Experimental P(H)",
        s.tosses
          ? (s.heads / s.tosses).toFixed(3)
          : "—");
    }

    /* STATISTICS */

    if (s.lab.id === "statistics") {
      text("STATISTICS BAR CHART",
        500, 42, 26, "#91efff");

      const values = [4, 7, p.value, 12, 6];
      const labels = ["A", "B", "C", "D", "E"];

      values.forEach((value, i) => {
        const h = value * 15;
        const x = 180 + i * 142;

        ctx.fillStyle = ["#52c4fa", "#48d5ae",
          "#ffe078", "#aa83f4", "#ff879e"][i];

        ctx.fillRect(x, 395 - h, 85, h);

        text(String(value), x + 42, 385 - h, 19);
        text(labels[i], x + 42, 425, 19);
      });

      const sorted = [...values].sort((a, b) => a - b);
      const total = values.reduce((a, b) => a + b, 0);

      readings += reading("Mean", (total / 5).toFixed(2));
      readings += reading("Median", sorted[2]);
      readings += reading("Range",
        Math.max(...values) - Math.min(...values));
      readings += reading("Total", total);
    }

    /* TRANSFORMATIONS */

    if (s.lab.id === "transform") {
      text("GEOMETRIC TRANSFORMATIONS",
        500, 42, 26, "#91efff");

      const theta = p.rotation * PI / 180;

      // Original shape
      ctx.beginPath();
      ctx.moveTo(250, 330);
      ctx.lineTo(370, 330);
      ctx.lineTo(310, 205);
      ctx.closePath();
      ctx.fillStyle = "#5f90df55";
      ctx.fill();
      ctx.strokeStyle = "#71b9ff";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Transformed shape
      const points = [
        [-60, 60], [60, 60], [0, -65]
      ];

      ctx.beginPath();

      points.forEach(([x, y], i) => {
        const xx = (x * Math.cos(theta) -
          y * Math.sin(theta)) * p.scale;

        const yy = (x * Math.sin(theta) +
          y * Math.cos(theta)) * p.scale;

        const sx = 700 + p.shift * 20 + xx;
        const sy = 265 + yy;

        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });

      ctx.closePath();
      ctx.fillStyle = "#56e0bc66";
      ctx.fill();
      ctx.strokeStyle = "#6cf4d5";
      ctx.lineWidth = 5;
      ctx.stroke();

      text("Original", 310, 395, 20);
      text("Transformed", 700, 395, 20);

      readings += reading("Rotation", p.rotation + "°");
      readings += reading("Scale factor", p.scale + "×");
      readings += reading("Translation", p.shift);
      readings += reading("Area scale", (p.scale ** 2).toFixed(2) + "×");
    }

    /* CALCULUS */

    if (s.lab.id === "calculus") {
      text("DERIVATIVES AND TANGENTS",
        500, 42, 26, "#91efff");

      const scale = 35;

      plot(x => x * x, "#64e9ff", scale);

      const x = p.x;
      const y = x * x;
      const slope = 2 * x;

      const X = value => 500 + value * scale;
      const Y = value => 250 - value * scale;

      line(
        X(x - 3), Y(y - slope * 3),
        X(x + 3), Y(y + slope * 3),
        "#ffe171", 5
      );

      circle(X(x), Y(y), 10, "#ffe171");

      readings += reading("x", x);
      readings += reading("f(x)", y.toFixed(2));
      readings += reading("f′(x)", slope.toFixed(2));
      readings += reading("Tangent slope", slope.toFixed(2));
    }

    /* FRACTIONS */

    if (s.lab.id === "fractions") {
      text("FRACTIONS VISUALIZER",
        500, 42, 26, "#91efff");

      const den = p.den;
      const num = Math.min(p.num, den);
      const radius = 170;

      for (let i = 0; i < den; i++) {
        const start = -PI / 2 + i * TAU / den;
        const end = start + TAU / den;

        ctx.beginPath();
        ctx.moveTo(500, 260);
        ctx.arc(500, 260, radius, start, end);
        ctx.closePath();

        ctx.fillStyle =
          i < num ? "#45d5e4" : "#183b61";

        ctx.fill();
        ctx.strokeStyle = "#e6f9ff";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      text(num + " / " + den, 500, 470, 29, "#ffe17b");

      readings += reading("Numerator", num);
      readings += reading("Denominator", den);
      readings += reading("Decimal", (num / den).toFixed(3));
      readings += reading("Percentage",
        (num / den * 100).toFixed(1) + "%");
    }

    readings += reading("Status",
      s.running ? "Running" : "Ready");

    $("pmathReadings").innerHTML = readings;
  }

  /* =========================================
     FIVE SEQUENTIAL MCQs
     ========================================= */

  function showQuestion() {
    if (!active) return;

    const s = active;

    if (s.quizIndex >= 5) {
      $("pmathQuizProgress").textContent =
        "Quiz completed";

      $("pmathQuizTitle").textContent =
        "🏆 Final Score: " + s.score + "/5";

      $("pmathQuizOptions").innerHTML = "";
      $("pmathQuizFeedback").textContent =
        s.score === 5
          ? "Excellent! All answers correct."
          : "Review and try again.";

      $("pmathNext").textContent = "Try Again ↻";
      $("pmathNext").disabled = false;
      return;
    }

    const q = s.lab.quiz[s.quizIndex];

    $("pmathQuizProgress").textContent =
      `Question ${s.quizIndex + 1} of 5 · Score ${s.score}/5`;

    $("pmathQuizTitle").textContent = q[0];
    $("pmathQuizOptions").innerHTML = "";
    $("pmathQuizFeedback").textContent =
      "Choose one answer.";

    s.answered = false;

    $("pmathNext").disabled = true;
    $("pmathNext").textContent =
      s.quizIndex === 4
        ? "See Score →"
        : "Next question →";

    const choices = q.slice(1);
    const shift = s.quizIndex % choices.length;

    const ordered = choices.slice(shift).concat(
      choices.slice(0, shift)
    );

    ordered.forEach((answer, i) => {
      const button = document.createElement("button");

      button.className = "pmath-option";
      button.type = "button";
      button.textContent = "ABCD"[i] + ". " + answer;

      button.onclick = () => {
        if (s.answered) return;

        s.answered = true;

        const correct = answer === q[1];
        if (correct) s.score++;

        $("pmathQuizFeedback").textContent =
          correct
            ? "✅ Correct answer!"
            : "❌ Correct answer: " + q[1];

        $("pmathQuizOptions")
          .querySelectorAll("button")
          .forEach(option => {
            option.disabled = true;

            if (option.textContent.slice(3) === q[1]) {
              option.style.background = "#176d54";
            } else if (option === button) {
              option.style.background = "#853d51";
            }
          });

        $("pmathNext").disabled = false;
      };

      $("pmathQuizOptions").appendChild(button);
    });
  }

  function nextQuestion() {
    if (!active) return;

    if (active.quizIndex >= 5) {
      active.quizIndex = 0;
      active.score = 0;
      showQuestion();
      return;
    }

    if (!active.answered) return;

    active.quizIndex++;
    showQuestion();
  }

  /* =========================================
     MATHEMATICS TUTOR
     ========================================= */

  function answerStudent() {
    if (!active) return;

    const input = $("pmathAskText");
    const question = input.value.trim();

    if (!question) return;

    const lower = question.toLowerCase();
    const lab = active.lab;

    let answer = lab.explanation;

    if (/formula|equation|rule|theorem/.test(lower)) {
      answer = lab.formula;
    } else if (/how|why|explain|what/.test(lower)) {
      answer = lab.explanation;
    }

    if (lab.id === "pythagoras" &&
        /hypotenuse|side|calculate/.test(lower)) {
      const p = active.p;

      answer = `For sides ${p.a} and ${p.b}, ` +
        `the hypotenuse is √(${p.a ** 2} + ${p.b ** 2}) = ` +
        Math.sqrt(p.a ** 2 + p.b ** 2).toFixed(3);
    }

    if (lab.id === "geometry" &&
        /area|circumference|radius/.test(lower)) {
      answer = `For radius ${active.p.radius}, ` +
        `area = ${(PI * active.p.radius ** 2).toFixed(2)} ` +
        `and circumference = ${(2 * PI * active.p.radius).toFixed(2)}.`;
    }

    if (lab.id === "calculus" &&
        /derivative|slope|tangent/.test(lower)) {
      answer = `The derivative of x² is 2x. ` +
        `At x = ${active.p.x}, the tangent slope is ${2 * active.p.x}.`;
    }

    const student = document.createElement("div");
    student.className = "pmath-chat";
    student.textContent = "Student: " + question;

    const reply = document.createElement("div");
    reply.className = "pmath-chat";
    reply.textContent = "PocketLab Tutor: " + answer;

    $("pmathChat").append(student, reply);
    input.value = "";
  }

  /* =========================================
     STARTUP AND NAVIGATION
     ========================================= */

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-pmath]");

    if (button) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openLab(button.dataset.pmath);
      return;
    }

    if (
      active &&
      event.target.closest(
        ".experiment-card [data-experiment]"
      )
    ) {
      restore();
    }
  }, true);

  document.addEventListener("click", event => {
    const nav = event.target.closest("[data-page]");

    if (
      active &&
      nav &&
      nav.dataset.page !== "experimentWorkspace"
    ) {
      restore();
    }
  }, true);

  function initialize() {
    installStyles();
    createCards();

    const filter = $("experimentFilter");

    if (filter) {
      filter.addEventListener("change", updateFilter);
      filter.addEventListener("input", updateFilter);
    }

    console.log(
      "✅ PocketLab Mathematics ready: 10 experiments"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();

/* POCKETLAB MATHS - PI CONSTANT FIX */
window.PI = Math.PI;

/* ============================================================
   POCKETLAB MATHEMATICS
   REAL 3D + SELECTABLE EXPERIMENT CONTROLS

   PASTE AT THE VERY BOTTOM OF maths.js
   AFTER: window.PI = Math.PI;

   All 10 Mathematics experiments supported.
   Existing formulas, quizzes, results and buttons preserved.
============================================================ */

(() => {
  "use strict";

  if (window.__POCKETLAB_MATH_3D_DROPDOWN__) return;
  window.__POCKETLAB_MATH_3D_DROPDOWN__ = true;

  const $ = (s, root = document) =>
    root.querySelector(s);

  const clamp = (x, a, b) =>
    Math.max(a, Math.min(b, x));

  const TYPES = {
    "Graph Explorer": [
      "graph", ["kind", "a", "b"]
    ],
    "Quadratic Equations": [
      "quadratic", ["a", "b", "c"]
    ],
    "Interactive Geometry": [
      "geometry", ["radius"]
    ],
    "Trigonometry Simulator": [
      "trig", ["angle"]
    ],
    "Pythagoras Theorem": [
      "pythagoras", ["a", "b"]
    ],
    "Probability Laboratory": [
      "probability", ["speed"]
    ],
    "Statistics Visualizer": [
      "statistics", ["value"]
    ],
    "Geometric Transformations": [
      "transform", ["rotation", "scale", "shift"]
    ],
    "Calculus — Derivatives": [
      "calculus", ["x"]
    ],
    "Fractions Visualizer": [
      "fractions", ["num", "den"]
    ]
  };

  let instance = null;
  let mounting = false;
  let threePromise = null;
  let retryAfter = 0;

  const remembered = {};

  /* ========== STYLES ========== */

  const css = document.createElement("style");

  css.textContent = `
    #pmathControls .pmath3-picker-label {
      display:block;
      font-size:13px;
      font-weight:700;
      color:#bcd9f2;
      margin-bottom:9px;
    }

    #pmathControls .pmath3-picker {
      display:block;
      width:100%;
      padding:12px 13px;
      background:#122e4f;
      border:1px solid #3783bb;
      color:#e5f5ff;
      border-radius:9px;
      font:600 14px Arial;
      cursor:pointer;
    }

    #pmathControls .pmath3-picker:focus {
      outline:2px solid #55d6fb;
    }

    #pmathControls .pmath3-hint {
      margin:9px 0 15px;
      color:#8cbbd6;
      font-size:12px;
    }

    #pmathControls .pmath-control[hidden] {
      display:none!important;
    }

    .pmath3-host {
      position:relative;
      width:100%;
      overflow:hidden;
      background:#081b31;
      border:1px solid #287ba7;
      border-radius:15px;
    }

    .pmath3-host > #pmathCanvas {
      display:block;
      width:100%;
      height:auto;
      border:0;
      border-radius:0;
    }

    .pmath3-view {
      position:absolute;
      inset:0;
      z-index:2;
      touch-action:none;
    }

    .pmath3-view > canvas {
      display:block;
      width:100%;
      height:100%;
      cursor:grab;
      touch-action:none;
    }

    .pmath3-caption {
      position:absolute;
      top:12px;
      left:13px;
      right:13px;
      pointer-events:none;
      color:#d5efff;
      text-shadow:0 1px 5px #000;
      font:12px/1.5 Arial;
    }

    .pmath3-caption strong {
      display:block;
      color:#7aeefe;
      font-size:15px;
    }

    .pmath3-help {
      position:absolute;
      left:13px;
      bottom:10px;
      color:#b4d7eb;
      font:11px Arial;
      pointer-events:none;
    }
  `;

  document.head.appendChild(css);

  /* ========== IDENTIFY LAB ========== */

  function currentLab() {
    const root = $("#pmathWorkspace");

    if (
      !root ||
      !root.isConnected ||
      !$("#experimentWorkspace")
        ?.classList.contains("active")
    ) return null;

    const name = $("#pmathTitle", root)
      ?.textContent.trim();

    const def = TYPES[name];

    const canvas = $("#pmathCanvas", root);

    return def && canvas
      ? {
          root,
          canvas,
          key: def[0],
          keys: def[1],
          name
        }
      : null;
  }

  function sliders(lab) {
    const groups = [
      ...$("#pmathControls", lab.root)
        .querySelectorAll(".pmath-control")
    ];

    const p = {};

    lab.keys.forEach((key, i) => {
      const value = Number(
        $('input[type="range"]', groups[i])
          ?.value
      );

      p[key] = Number.isFinite(value)
        ? value
        : 0;
    });

    return p;
  }

  /* ========================================
     SELECT EXPERIMENT CONTROL DROPDOWN
     Only selected slider is visible.
  ======================================== */

  function ensureDropdown(lab) {
    const controls = $(
      "#pmathControls",
      lab.root
    );

    const groups = [
      ...controls.querySelectorAll(
        ":scope > .pmath-control"
      )
    ];

    if (!groups.length) return;

    let picker = $(
      ".pmath3-picker",
      controls
    );

    if (
      picker &&
      picker._firstGroup === groups[0] &&
      picker.options.length === groups.length
    ) return;

    picker?.closest(
      ".pmath3-picker-wrap"
    )?.remove();

    const wrap = document.createElement("div");
    wrap.className = "pmath3-picker-wrap";

    const label = document.createElement("label");
    label.className = "pmath3-picker-label";
    label.textContent = "Select experiment control";

    picker = document.createElement("select");
    picker.className = "pmath3-picker";
    picker.id = "pmath3-control-select";

    picker.setAttribute(
      "aria-label",
      "Select experiment control"
    );

    label.htmlFor = picker.id;

    groups.forEach((group, i) => {
      const option = document.createElement("option");

      option.value = String(i);

      option.textContent =
        $("label", group)
          ?.textContent.split(":")[0]
          .trim() ||
        "Control " + (i + 1);

      picker.appendChild(option);
    });

    const hint = document.createElement("p");
    hint.className = "pmath3-hint";

    hint.textContent =
      "Select one setting. Other values remain saved.";

    wrap.append(label, picker, hint);

    controls.prepend(wrap);

    picker._firstGroup = groups[0];

    picker.value = String(
      clamp(
        remembered[lab.key] ?? 0,
        0,
        groups.length - 1
      )
    );

    const show = () => {
      const selected = Number(picker.value);

      remembered[lab.key] = selected;

      groups.forEach((group, i) => {
        group.hidden = i !== selected;
      });
    };

    picker.addEventListener("change", show);

    show();
  }

  /* ========== THREE.JS ========== */

  async function loadThree() {
    if (!threePromise) {
      threePromise = import("./three.module.js")
        .catch(() =>
          import(
            "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"
          )
        );
    }

    return threePromise;
  }

  /* ========== REAL 3D MODEL HELPERS ========== */

  function build(T, scene, key) {
    const root = new T.Group();
    scene.add(root);

    const mat = (color, opts = {}) =>
      new T.MeshStandardMaterial({
        color,
        roughness: 0.48,
        metalness: 0.10,
        ...opts
      });

    function mesh(
      parent,
      geometry,
      color,
      x = 0,
      y = 0,
      z = 0,
      opts = {}
    ) {
      const m = new T.Mesh(
        geometry,
        mat(color, opts)
      );

      m.position.set(x, y, z);

      m.castShadow = true;
      m.receiveShadow = true;

      parent.add(m);

      return m;
    }

    const box = (
      p, w, h, d, c,
      x = 0, y = 0, z = 0,
      opts = {}
    ) => mesh(
      p,
      new T.BoxGeometry(w, h, d),
      c, x, y, z, opts
    );

    const ball = (
      p, r, c,
      x = 0, y = 0, z = 0
    ) => mesh(
      p,
      new T.SphereGeometry(r, 24, 16),
      c, x, y, z
    );

    const cyl = (
      p, r, h, c,
      x = 0, y = 0, z = 0
    ) => mesh(
      p,
      new T.CylinderGeometry(r, r, h, 48),
      c, x, y, z
    );

    function rod(p, c, r = 0.035) {
      return mesh(
        p,
        new T.CylinderGeometry(r, r, 1, 12),
        c
      );
    }

    function setRod(o, a, b) {
      const A = new T.Vector3(...a);
      const B = new T.Vector3(...b);

      const D = B.clone().sub(A);
      const length = D.length();

      o.position.copy(A)
        .add(B)
        .multiplyScalar(0.5);

      if (length > 0.000001) {
        o.quaternion.setFromUnitVectors(
          new T.Vector3(0, 1, 0),
          D.normalize()
        );
      } else {
        o.quaternion.identity();
      }

      o.scale.y = Math.max(
        0.001,
        length
      );
    }

    function segment(
      p, a, b, c, r = 0.035
    ) {
      const object = rod(p, c, r);
      setRod(object, a, b);
      return object;
    }

    function dynamicCurve(
      color,
      count = 130
    ) {
      const geo = new T.BufferGeometry();

      geo.setAttribute(
        "position",
        new T.BufferAttribute(
          new Float32Array(count * 3),
          3
        )
      );

      const line = new T.Line(
        geo,
        new T.LineBasicMaterial({
          color
        })
      );

      line.frustumCulled = false;
      root.add(line);

      return fn => {
        const attr = geo.getAttribute(
          "position"
        );

        for (let i = 0; i < count; i++) {
          const x =
            -3.25 +
            6.5 * i / (count - 1);

          const [y, z] = fn(x);

          attr.setXYZ(
            i,
            x,
            y,
            z || 0
          );
        }

        attr.needsUpdate = true;
      };
    }

    function makeAxes() {
      segment(
        root,
        [-3.5, 1.15, 0],
        [3.5, 1.15, 0],
        0x81bce7,
        0.018
      );

      segment(
        root,
        [0, 0.25, 0],
        [0, 4, 0],
        0x81bce7,
        0.018
      );

      segment(
        root,
        [0, 1.15, -2.6],
        [0, 1.15, 2.6],
        0x456c98,
        0.016
      );
    }

    let update = () => "";

    /* ========================================
       1. GRAPH EXPLORER
       2. QUADRATIC EQUATIONS
       9. CALCULUS — DERIVATIVES
    ======================================== */

    if (
      key === "graph" ||
      key === "quadratic" ||
      key === "calculus"
    ) {
      makeAxes();

      const drawCurve = dynamicCurve(
        0x65eaff, 150
      );

      const marker = ball(
        root,
        0.125,
        0xffd366
      );

      const tangent =
        key === "calculus"
          ? segment(
              root,
              [0, 0, 0],
              [1, 1, 0],
              0xff8da8,
              0.04
            )
          : null;

      let signature = "";

      update = (t, p) => {
        const graphFunction =
          key === "graph"
            ? (
                x => p.kind === 1
                  ? p.a * x + p.b
                  : p.kind === 2
                  ? p.a * x * x + p.b * x
                  : p.a * Math.sin(x) + p.b
              )
            : key === "quadratic"
            ? (
                x =>
                  p.a * x * x +
                  p.b * x +
                  p.c
              )
            : (x => x * x);

        const fn = x => graphFunction(x);

        const scale =
          key === "graph" && p.kind === 3
            ? 0.45
            : key === "graph" && p.kind === 2
            ? 0.08
            : key === "graph"
            ? 0.23
            : key === "quadratic"
            ? 0.075
            : 0.115;

        const sig = JSON.stringify(p);

        if (sig !== signature) {
          drawCurve(x => [
            1.15 + clamp(
              fn(x) * scale,
              -0.7,
              2.6
            ),
            0
          ]);

          signature = sig;
        }

        const xValue =
          key === "calculus"
            ? clamp(
                p.x * 0.62,
                -3.1, 3.1
              )
            : key === "quadratic"
            ? clamp(
                -p.b /
                (2 * Math.max(p.a, 0.001)),
                -3.1, 3.1
              )
            : Math.sin(t) * 2.5;

        const y =
          1.15 + clamp(
            fn(xValue) * scale,
            -0.7, 2.6
          );

        marker.position.set(
          xValue,
          y,
          0.10
        );

        if (tangent) {
          const slope =
            2 * xValue * scale;

          setRod(
            tangent,
            [
              xValue - 1,
              y - slope,
              0.11
            ],
            [
              xValue + 1,
              y + slope,
              0.11
            ]
          );
        }

        if (key === "calculus") {
          return (
            `Position x=${p.x} · ` +
            `f'(x)=${(2 * p.x).toFixed(2)}`
          );
        }

        if (key === "quadratic") {
          return (
            `Discriminant ` +
            (
              p.b * p.b -
              4 * p.a * p.c
            ).toFixed(2)
          );
        }

        const type = [
          "",
          "Linear",
          "Quadratic",
          "Sine"
        ][p.kind];

        return (
          `${type} · a=${p.a}, b=${p.b}`
        );
      };
    }

    /* ========================================
       3. INTERACTIVE GEOMETRY
    ======================================== */

    if (key === "geometry") {
      const disk = cyl(
        root,
        1,
        0.16,
        0x338bd0,
        0, 1.15, 0
      );

      const border = mesh(
        root,
        new T.TorusGeometry(
          1,
          0.045,
          10,
          64
        ),
        0x7df2ff,
        0, 1.25, 0
      );

      border.rotation.x = Math.PI / 2;

      const radiusRod = rod(
        root,
        0xffdf83,
        0.038
      );

      update = (t, p) => {
        const r = p.radius * 0.245;

        disk.scale.set(
          r, 1, r
        );

        border.scale.set(
          r, r, 1
        );

        const theta = t * 0.13;

        setRod(
          radiusRod,
          [0, 1.3, 0],
          [
            Math.cos(theta) * r,
            1.3,
            Math.sin(theta) * r
          ]
        );

        return (
          `Radius ${p.radius} · ` +
          `Area ${(Math.PI * p.radius * p.radius).toFixed(2)} · ` +
          `Circumference ${(2 * Math.PI * p.radius).toFixed(2)}`
        );
      };
    }

    /* ========================================
       4. TRIGONOMETRY
    ======================================== */

    if (key === "trig") {
      mesh(
        root,
        new T.TorusGeometry(
          1.8, 0.035, 9, 90
        ),
        0x61dfff,
        0, 2, 0
      );

      const hyp = rod(
        root, 0xffdc6d, 0.055
      );

      const sin = rod(
        root, 0xf886a8, 0.043
      );

      const cos = rod(
        root, 0x6df3d9, 0.043
      );

      const point = ball(
        root, 0.12, 0xffd367
      );

      segment(
        root,
        [-2.4, 2, 0],
        [2.4, 2, 0],
        0x799fce,
        0.02
      );

      segment(
        root,
        [0, 0.1, 0],
        [0, 4, 0],
        0x799fce,
        0.02
      );

      update = (t, p) => {
        const a =
          p.angle * Math.PI / 180;

        const x =
          1.8 * Math.cos(a);

        const y =
          2 + 1.8 * Math.sin(a);

        setRod(
          hyp,
          [0, 2, 0.05],
          [x, y, 0.05]
        );

        setRod(
          sin,
          [x, 2, 0.06],
          [x, y, 0.06]
        );

        setRod(
          cos,
          [0, 2, 0.07],
          [x, 2, 0.07]
        );

        point.position.set(
          x, y, 0.08
        );

        return (
          `θ=${p.angle}° · ` +
          `sin=${Math.sin(a).toFixed(3)} · ` +
          `cos=${Math.cos(a).toFixed(3)}`
        );
      };
    }

    /* ========================================
       5. PYTHAGORAS THEOREM
    ======================================== */

    if (key === "pythagoras") {
      const aRod = rod(
        root, 0x5debd6, 0.065
      );

      const bRod = rod(
        root, 0xffca66, 0.065
      );

      const cRod = rod(
        root, 0x6fdbff, 0.075
      );

      const corner = box(
        root,
        0.18, 0.18, 0.10,
        0xffffff
      );

      const surface = mesh(
        root,
        new T.BufferGeometry(),
        0x4fa6ee,
        0, 0, 0,
        {
          transparent: true,
          opacity: 0.18,
          side: T.DoubleSide
        }
      );

      let signature = "";

      update = (t, p) => {
        const sig = `${p.a},${p.b}`;

        if (sig !== signature) {
          signature = sig;

          const scale =
            3 / Math.max(p.a, p.b);

          const A = [
            -1.85, 0.65, 0
          ];

          const B = [
            A[0] + p.a * scale,
            A[1],
            0
          ];

          const C = [
            A[0],
            A[1] + p.b * scale,
            0
          ];

          setRod(aRod, A, B);
          setRod(bRod, A, C);
          setRod(cRod, B, C);

          corner.position.set(
            A[0] + 0.10,
            A[1] + 0.10,
            0
          );

          surface.geometry.dispose();

          surface.geometry =
            new T.BufferGeometry();

          surface.geometry.setAttribute(
            "position",
            new T.Float32BufferAttribute(
              [...A, ...B, ...C],
              3
            )
          );

          surface.geometry.computeVertexNormals();
        }

        return (
          `a=${p.a}, b=${p.b}, ` +
          `hypotenuse=${Math.hypot(p.a, p.b).toFixed(3)}`
        );
      };
    }

    /* ========================================
       6. PROBABILITY LABORATORY
    ======================================== */

    if (key === "probability") {
      const coin = new T.Group();

      coin.position.y = 2.25;
      root.add(coin);

      cyl(
        coin, 1, 0.20,
        0xe4b74c
      );

      const ring1 = mesh(
        coin,
        new T.TorusGeometry(
          0.84, 0.05, 9, 50
        ),
        0xffe899,
        0, 0.12, 0
      );

      ring1.rotation.x =
        -Math.PI / 2;

      const ring2 = mesh(
        coin,
        new T.TorusGeometry(
          0.84, 0.05, 9, 50
        ),
        0xffe899,
        0, -0.12, 0
      );

      ring2.rotation.x =
        -Math.PI / 2;

      for (let i = 0; i < 8; i++) {
        const a =
          i * Math.PI / 4;

        ball(
          coin,
          0.075,
          0xffeab1,
          Math.cos(a) * 0.52,
          0.13,
          Math.sin(a) * 0.52
        );
      }

      update = (t, p) => {
        coin.rotation.x =
          t * (2 + p.speed * 1.2);

        coin.position.y =
          2.15 +
          Math.abs(
            Math.sin(t * p.speed * 0.5)
          ) * 0.6;

        return (
          `3D spinning coin · ` +
          `${p.speed} tosses/s · ` +
          `Results shown in the panel`
        );
      };
    }

    /* ========================================
       7. STATISTICS
    ======================================== */

    if (key === "statistics") {
      const bars = [
        0x53c5ff,
        0x43d9ae,
        0xffdb6c,
        0xb29aff,
        0xff839c
      ].map(
        (color, i) =>
          box(
            root,
            0.72, 1, 0.75,
            color,
            (i - 2) * 1.18,
            1, 0
          )
      );

      update = (t, p) => {
        const values = [
          4, 7, p.value, 12, 6
        ];

        bars.forEach((bar, i) => {
          const h =
            values[i] * 0.18;

          bar.scale.y = h;

          bar.position.y =
            0.23 + h / 2;
        });

        const total =
          values.reduce(
            (a, b) => a + b,
            0
          );

        return (
          `Data: ${values.join(", ")} · ` +
          `Mean ${(total / 5).toFixed(2)}`
        );
      };
    }

    /* ========================================
       8. GEOMETRIC TRANSFORMATIONS
    ======================================== */

    if (key === "transform") {
      box(
        root,
        1.55, 1.55, 1.55,
        0x456c8f,
        -1.4, 1.65, -0.5,
        {
          transparent: true,
          opacity: 0.19,
          wireframe: true
        }
      );

      const moving = box(
        root,
        1.55, 1.55, 1.55,
        0x6bdbff,
        0, 1.65, 0.3
      );

      box(
        moving,
        0.8, 0.09, 0.09,
        0xffce64,
        0, 0.80, 0
      );

      update = (t, p) => {
        moving.rotation.y =
          p.rotation * Math.PI / 180;

        moving.rotation.z =
          p.rotation * Math.PI / 540;

        moving.scale.setScalar(
          p.scale
        );

        moving.position.x =
          clamp(
            p.shift * 0.45,
            -2.2, 2.2
          );

        return (
          `Rotation ${p.rotation}° · ` +
          `Scale ${p.scale}× · ` +
          `Shift ${p.shift}`
        );
      };
    }

    /* ========================================
       10. FRACTIONS VISUALIZER
    ======================================== */

    if (key === "fractions") {
      const pie = new T.Group();

      pie.position.set(
        0, 1.3, 0
      );

      pie.rotation.x =
        -Math.PI / 2;

      root.add(pie);

      let previous = "";

      const colors = [
        0x41d8ee,
        0xffd36a,
        0xff8798,
        0xa78bfa,
        0x5ee0ae
      ];

      update = (t, p) => {
        const den = Math.max(
          1,
          Math.round(p.den)
        );

        const num = clamp(
          Math.round(p.num),
          0,
          den
        );

        const signature =
          `${num}/${den}`;

        if (signature !== previous) {
          for (
            const child of [...pie.children]
          ) {
            pie.remove(child);

            child.geometry.dispose();
            child.material.dispose();
          }

          for (let i = 0; i < den; i++) {
            const a0 =
              i * Math.PI * 2 / den;

            const a1 =
              (i + 1) *
              Math.PI * 2 / den;

            const shape = new T.Shape();

            shape.moveTo(0, 0);

            shape.absarc(
              0, 0, 1.5,
              a0, a1, false
            );

            shape.lineTo(0, 0);

            const slice = mesh(
              pie,
              new T.ExtrudeGeometry(
                shape,
                {
                  depth: 0.26,
                  bevelEnabled: false,
                  curveSegments: 14
                }
              ),
              i < num
                ? colors[i % colors.length]
                : 0x344d69
            );

            slice.material.side =
              T.DoubleSide;
          }

          previous = signature;
        }

        return (
          `${num}/${den} = ` +
          `${(num / den * 100).toFixed(1)}% · ` +
          `3D fraction sectors`
        );
      };
    }

    return update;
  }

  /* ========== 3D FLOOR ========== */

  function addFloor(T, scene) {
    const floor = new T.Mesh(
      new T.PlaneGeometry(25, 25),
      new T.MeshStandardMaterial({
        color: 0x102a44,
        roughness: 0.95
      })
    );

    floor.rotation.x =
      -Math.PI / 2;

    floor.position.y = 0.06;

    scene.add(floor);

    const grid = new T.GridHelper(
      14, 14,
      0x2c5a7c,
      0x21445d
    );

    grid.position.y = 0.07;

    scene.add(grid);
  }

  /* ========== CLEANUP ========== */

  function clean() {
    if (!instance) return;

    const s = instance;
    instance = null;

    cancelAnimationFrame(s.raf);
    s.resize.disconnect();

    s.scene.traverse(o => {
      o.geometry?.dispose();

      if (o.material) {
        const materials =
          Array.isArray(o.material)
            ? o.material
            : [o.material];

        materials.forEach(
          m => m.dispose()
        );
      }
    });

    s.renderer.dispose();

    if (
      s.canvas.isConnected &&
      s.holder.isConnected
    ) {
      s.holder.before(
        s.canvas
      );

      s.canvas.style.opacity =
        s.savedOpacity;
    }

    s.holder.remove();
  }

  /* ========== MOUNT THE SCENE ========== */

  async function mount(lab) {
    if (
      mounting ||
      instance ||
      Date.now() < retryAfter
    ) return;

    mounting = true;

    let T;

    try {
      T = await loadThree();
    } catch (error) {
      threePromise = null;

      retryAfter =
        Date.now() + 10000;

      mounting = false;

      console.warn(
        "Mathematics 3D unavailable. Original canvas remains.",
        error
      );

      return;
    }

    mounting = false;

    if (
      currentLab()?.canvas !== lab.canvas ||
      currentLab()?.key !== lab.key ||
      instance
    ) return;

    let renderer = null;
    let holder = null;

    try {
      renderer = new T.WebGLRenderer({
        antialias: true
      });

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          2
        )
      );

      renderer.outputColorSpace =
        T.SRGBColorSpace;

      const scene = new T.Scene();

      scene.background =
        new T.Color(0x081b31);

      const camera =
        new T.PerspectiveCamera(
          44, 2, 0.1, 70
        );

      scene.add(
        new T.HemisphereLight(
          0xe2f4ff,
          0x28415c,
          2.4
        )
      );

      const sunlight =
        new T.DirectionalLight(
          0xffffff, 3
        );

      sunlight.position.set(
        -4, 8, 5
      );

      scene.add(sunlight);

      addFloor(T, scene);

      const update = build(
        T, scene, lab.key
      );

      holder =
        document.createElement("div");

      holder.className =
        "pmath3-host";

      const view =
        document.createElement("div");

      view.className =
        "pmath3-view";

      view.innerHTML = `
        <div class="pmath3-caption">
          <strong>MATHEMATICS · REAL 3D</strong>
          <span class="pmath3-live">
            Interactive mathematical visualization
          </span>
        </div>

        <div class="pmath3-help">
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      `;

      view.prepend(
        renderer.domElement
      );

      lab.canvas.before(holder);

      holder.append(
        lab.canvas,
        view
      );

      const s = {
        ...lab,
        holder,
        view,
        renderer,
        scene,
        camera,
        update,
        raf: 0,
        resize: null,
        savedOpacity:
          lab.canvas.style.opacity,
        time: 0,
        running: false,
        last: 0,
        az: 0.6,
        el: 0.34,
        zoom: 9
      };

      instance = s;

      /* RESIZE */

      const resize = () => {
        if (instance !== s) return;

        const w = Math.max(
          1,
          holder.clientWidth
        );

        const h = Math.max(
          1,
          holder.clientHeight
        );

        renderer.setSize(
          w, h, false
        );

        camera.aspect = w / h;

        camera.updateProjectionMatrix();
      };

      s.resize =
        new ResizeObserver(resize);

      s.resize.observe(holder);

      resize();

      /* MOUSE ROTATION */

      let pointer = null;

      const canvas =
        renderer.domElement;

      canvas.addEventListener(
        "pointerdown",
        e => {
          pointer = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY
          };

          canvas.setPointerCapture(
            e.pointerId
          );
        }
      );

      canvas.addEventListener(
        "pointermove",
        e => {
          if (
            !pointer ||
            pointer.id !== e.pointerId
          ) return;

          s.az -= (
            e.clientX - pointer.x
          ) * 0.009;

          s.el = clamp(
            s.el +
            (
              e.clientY -
              pointer.y
            ) * 0.007,
            0.12, 1.35
          );

          pointer.x = e.clientX;
          pointer.y = e.clientY;
        }
      );

      const release = () => {
        pointer = null;
      };

      canvas.addEventListener(
        "pointerup",
        release
      );

      canvas.addEventListener(
        "pointercancel",
        release
      );

      canvas.addEventListener(
        "wheel",
        e => {
          e.preventDefault();

          s.zoom = clamp(
            s.zoom +
            e.deltaY * 0.008,
            5, 17
          );
        },
        { passive: false }
      );

      /* ANIMATION */

      function frame(now) {
        if (instance !== s) return;

        const live = currentLab();

        if (
          !live ||
          live.key !== s.key ||
          live.canvas !== s.canvas
        ) {
          clean();
          return;
        }

        s.raf =
          requestAnimationFrame(frame);

        const dt = s.last
          ? clamp(
              (now - s.last) / 1000,
              0, 0.05
            )
          : 0;

        s.last = now;

        if (s.running) {
          s.time += dt;
        }

        try {
          const summary = s.update(
            s.time,
            sliders(s)
          );

          $(".pmath3-live", view)
            .textContent = summary;

          const horizontal =
            s.zoom *
            Math.cos(s.el);

          camera.position.set(
            Math.sin(s.az) *
              horizontal,

            1.7 +
            s.zoom *
              Math.sin(s.el),

            Math.cos(s.az) *
              horizontal
          );

          camera.lookAt(
            0, 1.6, 0
          );

          renderer.render(
            scene,
            camera
          );

        } catch (error) {
          console.error(
            "Mathematics 3D render error:",
            error
          );

          clean();

          retryAfter =
            Date.now() + 60000;
        }
      }

      /* FIRST FRAME */

      s.update(
        0,
        sliders(s)
      );

      camera.position.set(
        4.6, 5.1, 7.8
      );

      camera.lookAt(
        0, 1.6, 0
      );

      renderer.render(
        scene,
        camera
      );

      // Hide original 2D only after
      // WebGL renders successfully.
      lab.canvas.style.opacity = "0";

      s.raf =
        requestAnimationFrame(frame);

      console.info(
        "PocketLab Mathematics 3D:",
        lab.key
      );

    } catch (error) {
      console.error(
        "Mathematics 3D initialization failed:",
        error
      );

      retryAfter =
        Date.now() + 10000;

      if (instance) {
        clean();
      } else {
        renderer?.dispose();

        if (holder) {
          if (lab.canvas.isConnected) {
            holder.before(
              lab.canvas
            );
          }

          holder.remove();
        }
      }
    }
  }

  /* ========================================
     CONNECT ORIGINAL START/PAUSE/STOP/RESET
  ======================================== */

  document.addEventListener(
    "click",
    e => {
      const action = e.target.closest(
        "#pmathWorkspace [data-pmath-action]"
      )?.dataset.pmathAction;

      if (!action || !instance) return;

      if (action === "start") {
        instance.running = true;
      }

      if (action === "pause") {
        instance.running = false;
      }

      if (
        action === "stop" ||
        action === "reset"
      ) {
        instance.running = false;
        instance.time = 0;
      }

      instance.last =
        performance.now();
    },
    true
  );

  /* ========================================
     AUTOMATICALLY CONNECT TO MATH LAB
  ======================================== */

  setInterval(() => {
    const lab = currentLab();

    if (
      instance &&
      (
        !lab ||
        lab.canvas !== instance.canvas ||
        lab.key !== instance.key
      )
    ) {
      clean();
    }

    if (!lab) return;

    ensureDropdown(lab);

    if (!instance) {
      mount(lab);
    }

  }, 350);

})();
