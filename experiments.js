
/*
==================================================
 POCKETLAB 3.0
 UNIFIED STEM EXPERIMENT CATALOG

 Physics: 20 interactive experiments
 Chemistry: 10 catalog entries
 Biology: 10 catalog entries
 Mathematics: 10 catalog entries

 Compatible with:
 index.html
 style.css
 script.js
 visuals.js
 physics.js

 Existing experiments are preserved.
==================================================
*/

(() => {
  "use strict";

  const SUBJECTS = {
    physics: {
      name: "Physics",
      icon: "⚡",
      color: "#56c9ff",
      description:
        "Electricity, mechanics, light, magnetism and waves."
    },
    chemistry: {
      name: "Chemistry",
      icon: "🧪",
      color: "#c18aff",
      description:
        "Explore matter, molecules and chemical reactions."
    },
    biology: {
      name: "Biology",
      icon: "🧬",
      color: "#66e9aa",
      description:
        "Discover cells, plants and living systems."
    },
    mathematics: {
      name: "Mathematics",
      icon: "📐",
      color: "#ffca75",
      description:
        "Explore mathematical patterns, shapes and functions."
    }
  };

  const EXPERIMENTS = [

    // ==================================
    // PHYSICS — 20 EXPERIMENTS
    // ==================================

    {
      id: "circuit",
      title: "Ohm's Law",
      subject: "physics",
      icon: "💡",
      description:
        "Adjust voltage and resistance to observe current and bulb brightness.",
      level: "Class 9+",
      type: "existing"
    },

    {
      id: "advancedCircuit",
      title: "Series & Parallel Circuits",
      subject: "physics",
      icon: "🔋",
      description:
        "Explore equivalent resistance and current in electrical networks.",
      level: "Class 10+",
      type: "existing"
    },

    {
      id: "motion",
      title: "Force & Motion — 3D Car",
      subject: "physics",
      icon: "🚗",
      description:
        "Control force and mass to drive a moving 3D car.",
      level: "Class 6+",
      type: "existing"
    },

    {
      id: "projectile",
      title: "Projectile Motion",
      subject: "physics",
      icon: "🚀",
      description:
        "Launch a projectile and study its trajectory.",
      level: "Class 11+",
      type: "existing"
    },

    {
      id: "reflection",
      title: "Light Reflection",
      subject: "physics",
      icon: "🔦",
      description:
        "Explore the law of reflection using light rays.",
      level: "Class 8+",
      type: "existing"
    },

    {
      id: "floating",
      title: "Floating & Sinking",
      subject: "physics",
      icon: "🚢",
      description:
        "Investigate density, buoyancy and floating objects.",
      level: "Class 5+",
      type: "existing"
    },

    {
      id: "kirchhoff",
      title: "Kirchhoff's Laws",
      subject: "physics",
      icon: "⚡",
      description:
        "Investigate current conservation in electric circuits.",
      level: "Class 12+",
      type: "physics"
    },

    {
      id: "thevenin",
      title: "Thevenin's Theorem",
      subject: "physics",
      icon: "🔌",
      description:
        "Explore equivalent voltage and resistance networks.",
      level: "College",
      type: "physics"
    },

    {
      id: "capacitor",
      title: "Capacitor Charging",
      subject: "physics",
      icon: "🔋",
      description:
        "Observe exponential charging of a capacitor.",
      level: "Class 12+",
      type: "physics"
    },

    {
      id: "rl",
      title: "RL Circuit",
      subject: "physics",
      icon: "🌀",
      description:
        "Investigate current growth in an inductor circuit.",
      level: "College",
      type: "physics"
    },

    {
      id: "rc",
      title: "RC Circuit",
      subject: "physics",
      icon: "📉",
      description:
        "Explore capacitor discharge and time constants.",
      level: "Class 12+",
      type: "physics"
    },

    {
      id: "ac",
      title: "AC Circuit",
      subject: "physics",
      icon: "〰️",
      description:
        "Visualize alternating voltage and frequency.",
      level: "Class 12+",
      type: "physics"
    },

    {
      id: "induction",
      title: "Electromagnetic Induction",
      subject: "physics",
      icon: "🧲",
      description:
        "Generate induced voltage through changing magnetic flux.",
      level: "Class 10+",
      type: "physics"
    },

    {
      id: "photoelectric",
      title: "Photoelectric Effect",
      subject: "physics",
      icon: "☀️",
      description:
        "Explore electron emission and photon energy.",
      level: "Class 12+",
      type: "physics"
    },

    {
      id: "thermal",
      title: "Thermal Expansion",
      subject: "physics",
      icon: "🌡️",
      description:
        "Observe how temperature changes the length of a metal rod.",
      level: "Class 9+",
      type: "physics"
    },

    {
      id: "pendulum",
      title: "Simple Pendulum",
      subject: "physics",
      icon: "🕰️",
      description:
        "Explore oscillations, gravity and time period.",
      level: "Class 7+",
      type: "physics"
    },

    {
      id: "spring",
      title: "Spring & Hooke's Law",
      subject: "physics",
      icon: "🌀",
      description:
        "Investigate spring extension and restoring force.",
      level: "Class 9+",
      type: "physics"
    },

    {
      id: "waves",
      title: "Wave & Sound",
      subject: "physics",
      icon: "🌊",
      description:
        "Change frequency and amplitude to explore wave motion.",
      level: "Class 8+",
      type: "physics"
    },

    {
      id: "newtonCradle",
      title: "Newton's Cradle",
      subject: "physics",
      icon: "⚪",
      description:
        "Explore collisions, momentum and energy transfer.",
      level: "Class 9+",
      type: "physics"
    },

    {
      id: "lens",
      title: "Lens & Refraction",
      subject: "physics",
      icon: "🔍",
      description:
        "Investigate focal length and image formation.",
      level: "Class 10+",
      type: "physics"
    },

    // ==================================
    // CHEMISTRY — 10 EXPERIMENTS
    // ==================================

    {
      id: "ph",
      title: "pH Indicator Laboratory",
      subject: "chemistry",
      icon: "🧪",
      description: "Test acidic and basic solutions.",
      level: "Class 6+",
      type: "existing"
    },

    {
      id: "neutralization",
      title: "Acid–Base Neutralization",
      subject: "chemistry",
      icon: "⚗️",
      description: "Explore acids and bases reacting.",
      level: "Class 8+",
      type: "upcoming"
    },

    {
      id: "reactions",
      title: "Chemical Reactions",
      subject: "chemistry",
      icon: "💥",
      description: "Investigate reactants and products.",
      level: "Class 7+",
      type: "upcoming"
    },

    {
      id: "periodic",
      title: "Periodic Table",
      subject: "chemistry",
      icon: "🔬",
      description: "Discover elements and atomic properties.",
      level: "Class 7+",
      type: "upcoming"
    },

    {
      id: "molecules",
      title: "Molecular Builder",
      subject: "chemistry",
      icon: "⚛️",
      description: "Explore molecular structures.",
      level: "Class 8+",
      type: "upcoming"
    },

    {
      id: "electrolysis",
      title: "Electrolysis of Water",
      subject: "chemistry",
      icon: "💧",
      description: "Explore splitting water using electricity.",
      level: "Class 10+",
      type: "upcoming"
    },

    {
      id: "solubility",
      title: "Solubility Laboratory",
      subject: "chemistry",
      icon: "🥛",
      description: "Explore dissolving and saturation.",
      level: "Class 5+",
      type: "upcoming"
    },

    {
      id: "states",
      title: "States of Matter",
      subject: "chemistry",
      icon: "🧊",
      description: "Investigate solids, liquids and gases.",
      level: "Class 4+",
      type: "upcoming"
    },

    {
      id: "reactionRate",
      title: "Reaction Rate",
      subject: "chemistry",
      icon: "⏱️",
      description: "Investigate reaction speed.",
      level: "Class 10+",
      type: "upcoming"
    },

    {
      id: "separation",
      title: "Separation of Mixtures",
      subject: "chemistry",
      icon: "🧫",
      description: "Explore filtration and evaporation.",
      level: "Class 6+",
      type: "upcoming"
    },

    // ==================================
    // BIOLOGY — 10 EXPERIMENTS
    // ==================================

    {
      id: "plant",
      title: "Plant Growth",
      subject: "biology",
      icon: "🌱",
      description: "Explore the effect of water and sunlight.",
      level: "Class 1+",
      type: "existing"
    },

    {
      id: "heart",
      title: "Human Heart",
      subject: "biology",
      icon: "❤️",
      description: "Explore heart chambers and circulation.",
      level: "Class 6+",
      type: "upcoming"
    },

    {
      id: "digestion",
      title: "Digestive System",
      subject: "biology",
      icon: "🍎",
      description: "Follow food through the digestive system.",
      level: "Class 5+",
      type: "upcoming"
    },

    {
      id: "respiration",
      title: "Respiratory System",
      subject: "biology",
      icon: "🫁",
      description: "Explore breathing and gas exchange.",
      level: "Class 5+",
      type: "upcoming"
    },

    {
      id: "cells",
      title: "Cell Structure",
      subject: "biology",
      icon: "🔬",
      description: "Explore plant and animal cells.",
      level: "Class 7+",
      type: "upcoming"
    },

    {
      id: "photosynthesis",
      title: "Photosynthesis",
      subject: "biology",
      icon: "☀️",
      description: "Explore how plants make food.",
      level: "Class 6+",
      type: "upcoming"
    },

    {
      id: "dna",
      title: "DNA Structure",
      subject: "biology",
      icon: "🧬",
      description: "Explore DNA and base pairing.",
      level: "Class 9+",
      type: "upcoming"
    },

    {
      id: "microscope",
      title: "Virtual Microscope",
      subject: "biology",
      icon: "🔍",
      description: "Observe specimens at different magnifications.",
      level: "Class 6+",
      type: "upcoming"
    },

    {
      id: "foodChain",
      title: "Food Chain",
      subject: "biology",
      icon: "🌿",
      description: "Explore energy transfer in ecosystems.",
      level: "Class 4+",
      type: "upcoming"
    },

    {
      id: "nervous",
      title: "Nervous System",
      subject: "biology",
      icon: "🧠",
      description: "Explore neurons and nerve signals.",
      level: "Class 8+",
      type: "upcoming"
    },

    // ==================================
    // MATHEMATICS — 10 EXPERIMENTS
    // ==================================

    {
      id: "graph",
      title: "Graph Explorer",
      subject: "mathematics",
      icon: "📈",
      description: "Explore graphs and mathematical functions.",
      level: "Class 9+",
      type: "existing"
    },

    {
      id: "geometry3d",
      title: "3D Geometry",
      subject: "mathematics",
      icon: "🧊",
      description: "Explore 3D shapes and volume.",
      level: "Class 6+",
      type: "upcoming"
    },

    {
      id: "trigonometry",
      title: "Trigonometry",
      subject: "mathematics",
      icon: "📐",
      description: "Explore sine, cosine and tangent.",
      level: "Class 9+",
      type: "upcoming"
    },

    {
      id: "pythagoras",
      title: "Pythagoras Theorem",
      subject: "mathematics",
      icon: "📏",
      description: "Explore right-angled triangles.",
      level: "Class 8+",
      type: "upcoming"
    },

    {
      id: "probability",
      title: "Probability",
      subject: "mathematics",
      icon: "🎲",
      description: "Explore probability with dice and coins.",
      level: "Class 6+",
      type: "upcoming"
    },

    {
      id: "fractions",
      title: "Fractions",
      subject: "mathematics",
      icon: "🍕",
      description: "Visualize fractions using shapes.",
      level: "Class 2+",
      type: "upcoming"
    },

    {
      id: "area",
      title: "Area & Perimeter",
      subject: "mathematics",
      icon: "⬛",
      description: "Calculate area and perimeter.",
      level: "Class 4+",
      type: "upcoming"
    },

    {
      id: "coordinates",
      title: "Coordinate Geometry",
      subject: "mathematics",
      icon: "📍",
      description: "Explore coordinate planes.",
      level: "Class 8+",
      type: "upcoming"
    },

    {
      id: "calculus",
      title: "Derivative Visualizer",
      subject: "mathematics",
      icon: "∫",
      description: "Explore slopes and derivatives.",
      level: "Class 11+",
      type: "upcoming"
    },

    {
      id: "statistics",
      title: "Statistics",
      subject: "mathematics",
      icon: "📊",
      description: "Explore averages and data visualization.",
      level: "Class 6+",
      type: "upcoming"
    }
  ];

  // ==================================
  // CSS
  // ==================================

  const css = `
    #laboratory .pl-catalog-head {
      display:flex;
      align-items:center;
      justify-content:space-between;
      flex-wrap:wrap;
      gap:12px;
      margin:20px 0;
    }

    #laboratory .pl-catalog-head h2 {
      color:#f1f8ff;
      font-size:23px;
      margin:0;
    }

    .pl-catalog-count {
      border:1px solid #347bb2;
      background:#102f4b;
      color:#76e5ff;
      padding:9px 14px;
      border-radius:25px;
      font-size:12px;
      font-weight:800;
    }

    .pl-catalog-tabs {
      display:flex;
      flex-wrap:wrap;
      gap:9px;
      margin:20px 0;
    }

    .pl-catalog-tab {
      border:1px solid #305376;
      border-radius:11px;
      padding:11px 16px;
      background:#142b46;
      color:#c7dff5;
      font-weight:750;
      cursor:pointer;
    }

    .pl-catalog-tab.active {
      background:linear-gradient(135deg,#177fef,#2945ac);
      color:white;
      border-color:#6ad4ff;
      box-shadow:0 0 15px #168dff44;
    }

    #laboratory .experiment-grid {
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:16px;
    }

    #laboratory .experiment-card {
      min-width:0;
      overflow:hidden;
      background:linear-gradient(145deg,#152b47,#0b172a);
      border:1px solid #315779;
      border-radius:16px;
      padding:15px;
      transition:.2s ease;
    }

    #laboratory .experiment-card:hover {
      transform:translateY(-4px);
      border-color:#59c8ff;
      box-shadow:0 0 22px #208dff33;
    }

    .pl-experiment-preview {
      height:125px;
      display:grid;
      place-items:center;
      border:1px solid #2c567d;
      border-radius:11px;
      margin-bottom:13px;
      background:
        radial-gradient(circle,#214d74,#091426 75%);
      overflow:hidden;
      position:relative;
    }

    .pl-experiment-preview::before {
      content:"";
      position:absolute;
      width:115px;
      height:115px;
      border:1px solid #65cfff44;
      border-radius:50%;
      box-shadow:0 0 25px #31a8ff22;
    }

    .pl-experiment-preview span {
      position:relative;
      font-size:56px;
      filter:drop-shadow(0 0 15px #5bc8ff88);
      animation:plPreviewFloat 3s ease-in-out infinite;
    }

    @keyframes plPreviewFloat {
      0%,100% {transform:translateY(0)}
      50% {transform:translateY(-7px)}
    }

    .pl-experiment-status {
      display:inline-block;
      margin-bottom:10px;
      color:#70eab6;
      font-size:10px;
      font-weight:800;
    }

    .pl-experiment-status.upcoming {
      color:#ffcb79;
    }

    .pl-experiment-title {
      color:#f1f7ff;
      font-size:15px;
      font-weight:800;
      margin:0 0 9px;
    }

    .pl-experiment-description {
      color:#a9bed5;
      font-size:12px;
      line-height:1.6;
      min-height:58px;
      margin:0;
    }

    .pl-experiment-footer {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:8px;
      margin-top:16px;
    }

    .pl-experiment-footer small {
      color:#8faac6;
      font-size:10px;
    }

    .pl-experiment-start {
      background:linear-gradient(135deg,#168bff,#2755d9);
      border:1px solid #64bfff;
      border-radius:9px;
      color:white;
      padding:10px 14px;
      font-weight:800;
      font-size:12px;
      cursor:pointer;
      white-space:nowrap;
    }

    .pl-experiment-start:hover {
      filter:brightness(1.2);
    }

    .pl-experiment-start:disabled {
      background:#273b55;
      border-color:#435b76;
      color:#91a4bd;
      cursor:not-allowed;
    }

    .pl-catalog-note {
      margin-top:22px;
      border:1px solid #315674;
      background:#10243b;
      border-radius:12px;
      padding:15px;
      color:#a8c9e7;
      font-size:12px;
      line-height:1.7;
    }

    @media(max-width:1200px) {
      #laboratory .experiment-grid {
        grid-template-columns:repeat(3,minmax(0,1fr));
      }
    }

    @media(max-width:900px) {
      #laboratory .experiment-grid {
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
    }

    @media(max-width:560px) {
      #laboratory .experiment-grid {
        grid-template-columns:1fr;
      }
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ==================================
  // CATALOG
  // ==================================

  let selectedSubject = "all";

  function getExperiment(id) {
    return EXPERIMENTS.find(exp => exp.id === id);
  }

  function getLaunchButton(exp) {
    const buttons = document.querySelectorAll(
      exp.type === "existing"
        ? "[data-experiment]"
        : "[data-physics-launch]"
    );

    return [...buttons].find(button =>
      exp.type === "existing"
        ? button.dataset.experiment === exp.id
        : button.dataset.physicsLaunch === exp.id
    );
  }

  function isAvailable(exp) {
    if (exp.type === "upcoming") return false;
    return Boolean(getLaunchButton(exp));
  }

  function createCatalog() {
    const laboratory = document.getElementById(
      "laboratory"
    );

    const grid = laboratory?.querySelector(
      ".experiment-grid"
    );

    if (!laboratory || !grid) {
      console.warn(
        "PocketLab: laboratory grid not found."
      );
      return;
    }

    // Save original experiment buttons as working
    // launch targets. Never remove them.
    const originalCards = [...grid.children];

    const launchStorage = document.createElement("div");
    launchStorage.id = "plOriginalLaunchStorage";
    launchStorage.hidden = true;
    launchStorage.style.display = "none";

    originalCards.forEach(card => {
      launchStorage.appendChild(card);
    });

    laboratory.appendChild(launchStorage);

    // The new Physics module adds its own cards
    // after DOMContentLoaded. Collect those too.
    const physicsCards = [
      ...grid.querySelectorAll(
        "[data-physics-launch]"
      )
    ];

    physicsCards.forEach(button => {
      const card = button.closest(".experiment-card");

      if (card) {
        launchStorage.appendChild(card);
      }
    });

    const oldCatalog = document.getElementById(
      "pl40Catalog"
    );

    if (oldCatalog) oldCatalog.remove();

    const oldTabs = laboratory.querySelector(
      ".pl-subject-tabs"
    );

    if (oldTabs) {
      oldTabs.style.display = "none";
    }

    const header = document.createElement("div");
    header.className = "pl-catalog-head";

    const tabs = document.createElement("div");
    tabs.className = "pl-catalog-tabs";

    grid.insertAdjacentElement(
      "beforebegin",
      header
    );

    header.insertAdjacentElement(
      "afterend",
      tabs
    );

    function render() {
      const filtered = EXPERIMENTS.filter(exp =>
        selectedSubject === "all" ||
        exp.subject === selectedSubject
      );

      const readyCount = filtered.filter(
        isAvailable
      ).length;

      header.innerHTML = `
        <h2>
          ${selectedSubject === "all"
            ? "Explore STEM Experiments"
            : SUBJECTS[selectedSubject].icon +
              " " +
              SUBJECTS[selectedSubject].name +
              " Laboratory"}
        </h2>

        <span class="pl-catalog-count">
          ${readyCount} INTERACTIVE ·
          ${filtered.length} TOTAL
        </span>
      `;

      tabs.innerHTML = `
        <button class="pl-catalog-tab
          ${selectedSubject === "all" ? "active" : ""}"
          data-pl-catalog-subject="all">
          🌍 All (${EXPERIMENTS.length})
        </button>

        ${Object.entries(SUBJECTS).map(
          ([id, subject]) => `
            <button
              class="pl-catalog-tab
              ${selectedSubject === id ? "active" : ""}"
              data-pl-catalog-subject="${id}">
              ${subject.icon}
              ${subject.name}
              (${EXPERIMENTS.filter(
                exp => exp.subject === id
              ).length})
            </button>
          `
        ).join("")}
      `;

      grid.innerHTML = filtered.map(exp => {
        const available = isAvailable(exp);

        return `
          <article
            class="experiment-card"
            data-category="${exp.subject}"
            data-catalog-id="${exp.id}">

            <div class="pl-experiment-preview">
              <span>${exp.icon}</span>
            </div>

            <span class="pl-experiment-status
              ${available ? "" : "upcoming"}">
              ${available
                ? "● INTERACTIVE"
                : "◷ UPCOMING"}
            </span>

            <h3 class="pl-experiment-title">
              ${exp.title}
            </h3>

            <p class="pl-experiment-description">
              ${exp.description}
            </p>

            <div class="pl-experiment-footer">
              <small>
                ${SUBJECTS[exp.subject].name}
                · ${exp.level}
              </small>

              <button
                class="pl-experiment-start"
                data-pl-launch="${exp.id}"
                ${available ? "" : "disabled"}>
                ${available
                  ? "▶ Start"
                  : "Coming Soon"}
              </button>
            </div>

          </article>
        `;
      }).join("");

      const note = document.getElementById(
        "plCatalogNote"
      );

      if (note) {
        note.textContent =
          selectedSubject === "physics"
            ? "Physics includes the original 3D car, electric circuit, projectile motion and the new interactive experiments."
            : "The original working experiments remain available. Other subjects will receive their simulation upgrades next.";
      }
    }

    tabs.addEventListener("click", event => {
      const button = event.target.closest(
        "[data-pl-catalog-subject]"
      );

      if (!button) return;

      selectedSubject =
        button.dataset.plCatalogSubject;

      render();
    });

    grid.addEventListener("click", event => {
      const button = event.target.closest(
        "[data-pl-launch]"
      );

      if (!button) return;

      const exp = getExperiment(
        button.dataset.plLaunch
      );

      if (!exp) return;

      const target = getLaunchButton(exp);

      if (target) {
        target.click();
      } else {
        console.warn(
          "Simulation not connected:",
          exp.id
        );
      }
    });

    const note = document.createElement("div");
    note.id = "plCatalogNote";
    note.className = "pl-catalog-note";

    grid.insertAdjacentElement("afterend", note);

    // Allow dashboard subject cards to select
    // the appropriate experiment category.
    document.addEventListener("click", event => {
      const subjectButton = event.target.closest(
        "[data-subject]"
      );

      if (!subjectButton) return;

      const subject = subjectButton.dataset.subject;

      if (!SUBJECTS[subject]) return;

      selectedSubject = subject;

      // Wait for the existing navigation handler
      // to finish, then update the catalog.
      queueMicrotask(render);
    });

    // Preserve existing experiment filter.
    const filter = document.getElementById(
      "experimentFilter"
    );

    if (filter) {
      filter.addEventListener("change", () => {
        selectedSubject = filter.value;
        render();
      });
    }

    render();

    console.log(
      "PocketLab 3.0 unified catalog loaded:",
      EXPERIMENTS.length,
      "experiments"
    );
  }

  function init() {
    // physics.js is loaded before this file.
    // Both scripts initialize at DOMContentLoaded.
    // A microtask lets physics.js add its cards first.
    queueMicrotask(createCatalog);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

  window.PocketLabCatalog = {
    experiments: EXPERIMENTS,
    subjects: SUBJECTS,
    getExperiment
  };

})();
