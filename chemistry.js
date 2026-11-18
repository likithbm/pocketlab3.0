
/* ==========================================================
   POCKETLAB CHEMISTRY 4.0
   STEM FOR IMPACT 2026
   FULL chemistry.js REPLACEMENT
   12 EXPERIMENTS + PERIODIC TABLE CONCEPTS
   ========================================================== */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const TWO_PI = Math.PI * 2;

  const ELEMENTS = [
    ["H","Hydrogen",1,1.008,1,1,"Nonmetal"],
    ["He","Helium",2,4.003,18,1,"Noble gas"],
    ["Li","Lithium",3,6.94,1,2,"Alkali metal"],
    ["Be","Beryllium",4,9.012,2,2,"Alkaline earth metal"],
    ["B","Boron",5,10.81,13,2,"Metalloid"],
    ["C","Carbon",6,12.011,14,2,"Nonmetal"],
    ["N","Nitrogen",7,14.007,15,2,"Nonmetal"],
    ["O","Oxygen",8,15.999,16,2,"Nonmetal"],
    ["F","Fluorine",9,18.998,17,2,"Halogen"],
    ["Ne","Neon",10,20.180,18,2,"Noble gas"],
    ["Na","Sodium",11,22.990,1,3,"Alkali metal"],
    ["Mg","Magnesium",12,24.305,2,3,"Alkaline earth metal"],
    ["Al","Aluminium",13,26.982,13,3,"Metal"],
    ["Si","Silicon",14,28.085,14,3,"Metalloid"],
    ["P","Phosphorus",15,30.974,15,3,"Nonmetal"],
    ["S","Sulfur",16,32.06,16,3,"Nonmetal"],
    ["Cl","Chlorine",17,35.45,17,3,"Halogen"],
    ["Ar","Argon",18,39.948,18,3,"Noble gas"],
    ["K","Potassium",19,39.098,1,4,"Alkali metal"],
    ["Ca","Calcium",20,40.078,2,4,"Alkaline earth metal"]
  ];

  const SOLUTIONS = [
    ["Lemon juice",2,"#f04b55"],
    ["Vinegar",3,"#f18c43"],
    ["Pure water",7,"#50d17f"],
    ["Baking soda solution",8.5,"#49b5e3"],
    ["Soapy water",10,"#6659e5"]
  ];

  // Each quiz entry: question, correct answer, three distractors.
  const LABS = [
    {
      id:"ph", icon:"🧪",
      title:"pH Indicator Laboratory",
      desc:"Watch indicator colours change in acidic and alkaline solutions.",
      formula:"pH = −log₁₀(aH⁺)",
      science:"pH describes hydrogen-ion activity. At approximately 25°C, pH 7 is neutral; below 7 is acidic and above 7 is alkaline.",
      controls:[["solution","Solution",0,4,2,1,""]],
      quiz:[
        ["What is neutral pH at 25°C?","7","2","12","0"],
        ["What is pH 3?","Acidic","Alkaline","Neutral","Always pure"],
        ["Which is acidic?","Lemon juice","Soap","Baking soda solution","Pure water"],
        ["What does an indicator show?","Approximate pH","Density","Mass","Pressure"],
        ["Which pH is alkaline?","10","2","3","7"]
      ]
    },
    {
      id:"periodic", icon:"⚛️",
      title:"Periodic Table Explorer",
      desc:"Explore elements, groups, periods, electron shells and valency.",
      formula:"Z = Protons; A = Protons + Neutrons",
      science:"Elements are arranged by atomic number. Groups are vertical columns and periods are horizontal rows. The selected first-20-element model illustrates electron shells and outer-shell electrons.",
      controls:[["element","Atomic Number",1,20,8,1,""]],
      quiz:[
        ["What determines atomic number?","Protons","Neutrons","Mass","Density"],
        ["What is a group?","Vertical column","Horizontal row","Nucleus","Electron"],
        ["What is a period?","Horizontal row","Vertical column","Bond","Ion"],
        ["Which group contains noble gases?","18","1","2","17"],
        ["What are valence electrons?","Outer-shell electrons","Only protons","Neutrons","Nuclei"]
      ]
    },
    {
      id:"bond", icon:"🔗",
      title:"Chemical Bonding",
      desc:"Observe ionic, covalent and metallic bonds.",
      formula:"Ionic: ion attraction; Covalent: shared electron pairs",
      science:"Ionic bonds involve attraction between oppositely charged ions. Covalent bonds involve shared electron pairs, and metallic bonding includes delocalized electrons.",
      controls:[["bond","Bond Type",1,3,2,1,""]],
      quiz:[
        ["Which bond shares electrons?","Covalent","Ionic","Metallic","Nuclear"],
        ["Which bond is present in NaCl?","Ionic","Metallic","Pure covalent","None"],
        ["Positive ions are called...","Cations","Anions","Neutrons","Electrons"],
        ["Which bonding occurs in metals?","Metallic","Ionic only","Covalent only","None"],
        ["H₂ has which bond?","Covalent","Ionic","Metallic","Hydrogen bond"]
      ]
    },
    {
      id:"rate", icon:"⚗️",
      title:"Chemical Reaction Rates",
      desc:"Explore the effects of temperature and concentration.",
      formula:"Average rate = |Δconcentration| / Δtime",
      science:"Higher temperature usually increases reaction rate. Higher concentration generally increases collision frequency. The animation uses an illustrative relative-rate model.",
      controls:[
        ["temperature","Temperature",10,90,40,5," °C"],
        ["concentration","Concentration",10,100,60,5,"%"]
      ],
      quiz:[
        ["Higher temperature usually...","Increases reaction rate","Removes atoms","Stops reactions","Eliminates mass"],
        ["What does a catalyst do?","Increases reaction rate","Removes gravity","Creates atoms","Stops all reactions"],
        ["Higher concentration often causes...","More frequent collisions","No collisions","No particles","No energy"],
        ["Which theory explains reaction rates?","Collision theory","Cell theory","Evolution","Plate tectonics"],
        ["Powder reacts faster because of...","Greater surface area","Less area","No contact","Less energy always"]
      ]
    },
    {
      id:"matter", icon:"💧",
      title:"States of Matter",
      desc:"Watch particles move in solids, liquids and gases.",
      formula:"Ideal gas: Average KE = 3kBT / 2",
      science:"Solids have particles vibrating about fixed positions. Liquids can flow, while gas particles spread throughout their container.",
      controls:[["state","Matter State",1,3,2,1,""]],
      quiz:[
        ["Which state has a fixed shape?","Solid","Liquid","Gas","Vapour"],
        ["Which fills a container?","Gas","Solid","Ice","Crystal"],
        ["Solid to liquid is...","Melting","Freezing","Condensation","Deposition"],
        ["Gas to liquid is...","Condensation","Melting","Sublimation","Freezing"],
        ["Largest particle spacing is usually in...","Gas","Solid","Liquid","Ice"]
      ]
    },
    {
      id:"separation", icon:"🧫",
      title:"Separation Techniques",
      desc:"Explore filtration, evaporation and distillation.",
      formula:"Separation uses differences in physical properties",
      science:"Filtration separates insoluble solids from liquids. Evaporation recovers nonvolatile solutes. Distillation uses boiling and condensation.",
      controls:[["method","Technique",1,3,1,1,""]],
      quiz:[
        ["Which removes sand from water?","Filtration","Combustion","Electrolysis","Neutralization"],
        ["Which recovers salt from saltwater?","Evaporation","Magnetism","Sieving","Freezing alone"],
        ["Distillation involves...","Vaporization and condensation","Only freezing","Magnetism","Combustion"],
        ["What does a condenser do?","Cools vapour","Creates protons","Burns water","Increases gravity"],
        ["What remains on filter paper?","Residue","Filtrate","Distillate","Vapour"]
      ]
    },
    {
      id:"titration", icon:"🧴",
      title:"Acid-Base Titration",
      desc:"Add base to an acid and observe the endpoint.",
      formula:"At equivalence for monoprotic acid/base: CaVa = CbVb",
      science:"An acid-base titration determines concentration using a reaction with a known solution. This idealized example uses equal concentrations of a strong monoprotic acid and strong base.",
      controls:[["volume","Base Added",0,50,0,1," mL"]],
      quiz:[
        ["What measures liquid delivery in titration?","Burette","Thermometer","Balance","Microscope"],
        ["What is an endpoint?","Indicator change","Always pH 0","Boiling","Freezing"],
        ["What is a standard solution?","Known concentration","Unknown substance","Pure gas","Only water"],
        ["What happens at equivalence?","Stoichiometric quantities have reacted","All liquid disappears","Temperature is zero","All atoms vanish"],
        ["For a strong acid/strong base at 25°C, equivalence pH is approximately...","7","1","14","0"]
      ]
    },
    {
      id:"electrolysis", icon:"⚡",
      title:"Electrolysis of Water",
      desc:"Observe hydrogen and oxygen gas bubbles at electrodes.",
      formula:"2H₂O(l) → 2H₂(g) + O₂(g)",
      science:"Electrical energy decomposes water. Hydrogen forms at the cathode and oxygen at the anode. This model assumes suitable electrodes and an electrolyte.",
      controls:[["voltage","Applied Voltage",0,12,6,1," V"]],
      quiz:[
        ["What gas forms at the cathode?","Hydrogen","Oxygen","Nitrogen","Helium"],
        ["What gas forms at the anode?","Oxygen","Hydrogen","Neon","Carbon dioxide"],
        ["What energy drives electrolysis?","Electrical","Sound","Gravitational only","Nuclear"],
        ["What is the H₂:O₂ volume ratio?","2:1","1:2","1:1","3:1"],
        ["What is water's formula?","H₂O","CO₂","NaCl","H₂SO₄"]
      ]
    },
    {
      id:"gas", icon:"🎈",
      title:"Gas Laws Simulator",
      desc:"Change temperature and volume to investigate pressure.",
      formula:"P = nRT / V",
      science:"For a fixed amount of ideal gas, pressure increases with absolute temperature and decreases as container volume increases.",
      controls:[
        ["temp","Temperature",200,600,300,10," K"],
        ["volume","Container Volume",1,10,5,0.5," L"]
      ],
      quiz:[
        ["Which equation is the ideal gas law?","PV = nRT","F = ma","V = IR","E = mc²"],
        ["Pressure at fixed temperature rises when volume...","Decreases","Increases","Doubles always","Disappears"],
        ["What is the SI temperature scale?","Kelvin","Celsius only","Fahrenheit","Newton"],
        ["At constant volume, increasing Kelvin temperature...","Increases pressure","Decreases pressure always","Stops gas motion","Changes atoms"],
        ["What does n represent?","Amount in moles","Temperature","Pressure","Volume"]
      ]
    },
    {
      id:"solubility", icon:"🧂",
      title:"Solubility Simulator",
      desc:"Add salt to water and observe dissolution or saturation.",
      formula:"Concentration = Mass of solute / Volume of solution",
      science:"Solubility is the maximum amount of solute that dissolves under specified conditions. The model uses a chosen illustrative capacity rather than a measured solubility curve.",
      controls:[
        ["salt","Salt Added",0,100,30,5," g"],
        ["water","Water Volume",100,500,250,25," mL"]
      ],
      quiz:[
        ["What is a solute?","Substance dissolved","Only a gas","Container","Heat source"],
        ["What is a solvent?","Dissolving medium","Always a solid","Filter","Burette"],
        ["What is a saturated solution?","At dissolved-solute limit","Contains no solute","Always boiling","Always acidic"],
        ["What often happens with excess salt?","Undissolved solid remains","Atoms disappear","Water becomes metal","Pressure is zero"],
        ["Which unit expresses mass concentration?","g/L","m/s","N","J"]
      ]
    },
    {
      id:"chromatography", icon:"🎨",
      title:"Paper Chromatography",
      desc:"Separate coloured dyes using a moving solvent.",
      formula:"Rf = Distance moved by dye / Distance moved by solvent front",
      science:"Paper chromatography separates components because they distribute differently between a mobile solvent and stationary paper. Different components travel different distances.",
      controls:[["speed","Solvent Speed",1,5,2,1,"×"]],
      quiz:[
        ["What is the mobile phase?","Solvent","Paper only","Ink container","Gas burner"],
        ["What is the stationary phase here?","Paper","Liquid solvent","Flame","Battery"],
        ["What does Rf compare?","Dye distance to solvent distance","Mass to time","Force to area","Voltage to current"],
        ["What is separated in ink chromatography?","Dye components","Protons","Electrons","Atoms into nuclei"],
        ["Can Rf exceed 1 in a valid measurement?","No","Always","Only for blue ink","Always for red ink"]
      ]
    },
    {
      id:"reactions", icon:"💥",
      title:"Chemical Reactions",
      desc:"Explore precipitation, gas evolution and neutralization.",
      formula:"Reactants → Products",
      science:"Chemical reactions rearrange atoms into new substances. Precipitation produces an insoluble solid, gas-evolution reactions produce gas, and neutralization involves acids and bases.",
      controls:[["reaction","Reaction Type",1,3,1,1,""]],
      quiz:[
        ["What forms in precipitation?","Insoluble solid","Electron cloud only","Light always","Only steam"],
        ["What is a reactant?","Starting substance","Always a gas","Only a catalyst","Measurement unit"],
        ["What does a chemical equation conserve?","Atoms of each element","Colour always","Temperature","Volume always"],
        ["Neutralization involves...","Acid and base","Only metals","Only light","Only gases"],
        ["Gas evolution can be observed through...","Bubbles","No change ever","Gravity loss","Magnetic reversal"]
      ]
    }
  ];

  const MAP = Object.fromEntries(LABS.map(x => [x.id,x]));
  let active = null;
  let raf = 0;
  let lastTime = 0;
  let hidden = [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g,c=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",
      '"':"&quot;","'":"&#39;"
    })[c]);
  }

  /* ==================================================
     CSS: PHYSICS STYLE
  ================================================== */

  function installCSS() {
    if ($("chem4css")) return;

    const style = document.createElement("style");
    style.id = "chem4css";

    style.textContent = `
      .chem4-card {
        display:flex; flex-direction:column; gap:12px;
        min-height:365px; padding:15px;
        border:1px solid #315c83; border-radius:16px;
        background:linear-gradient(145deg,#11253e,#0a192e);
        color:#f0f6ff; box-sizing:border-box;
      }
      .chem4-card .chem4-preview {
        height:145px; display:grid;place-items:center;
        border:1px solid #297daf;border-radius:12px;
        background:radial-gradient(circle,#194e73,#071a31);
      }
      .chem4-card .chem4-orb {
        width:110px;height:110px;border-radius:50%;
        display:grid;place-items:center;font-size:52px;
        border:1px solid #2b6a96;
        box-shadow:0 0 35px #1689d344;
      }
      .chem4-card .chem4-tag {
        color:#42eab5;font-size:11px;
        font-weight:800;letter-spacing:.04em;
      }
      .chem4-card h3 {margin:0;font-size:17px;color:#fff}
      .chem4-card p {
        margin:0;font-size:13px;color:#aac1d8;line-height:1.55;
      }
      .chem4-card .chem4-foot {
        display:flex;justify-content:space-between;
        align-items:center;margin-top:auto;gap:8px;
      }
      .chem4-card small {font-size:10px;color:#aac1d8}
      .chem4-card button {
        flex-shrink:0;padding:11px 15px;
        background:linear-gradient(90deg,#158dff,#2963df);
        color:#fff;border:1px solid #65beff;
        border-radius:9px;font-size:13px;font-weight:800;
        cursor:pointer;box-shadow:0 0 13px #168dff44;
      }
      #chem4-workspace {
        max-width:1450px;margin:auto;padding:16px 12px;
        color:#eff7ff;
      }
      #chem4-back {
        display:inline-block;border:0;background:none;
        color:#49e9f0;font-weight:800;cursor:pointer;
        padding:8px 0;margin-bottom:20px;
      }
      .chem4-eyebrow {
        font-size:11px;color:#4de8f4;
        font-weight:800;letter-spacing:.16em;
      }
      #chem4-workspace h1 {
        font-size:clamp(27px,3vw,40px);margin:15px 0;
      }
      .chem4-intro {color:#acc1d8;margin-bottom:28px}
      .chem4-layout {
        display:grid;
        grid-template-columns:minmax(0,1.6fr) minmax(320px,1fr);
        gap:22px;align-items:start;
      }
      .chem4-panel {
        padding:23px;border:1px solid #315a80;
        border-radius:18px;min-width:0;
        background:linear-gradient(145deg,#152741,#0d1b31);
      }
      .chem4-head {
        display:flex;justify-content:space-between;
        align-items:center;gap:10px;
        border-bottom:1px solid #2a4969;
        padding-bottom:17px;margin-bottom:16px;
        font-weight:800;
      }
      .chem4-live {color:#42eabb;font-size:11px}
      #chem4-canvas {
        width:100%;height:auto;display:block;
        background:#0b2440;border:1px solid #287ca9;
        border-radius:14px;
      }
      .chem4-buttons {
        display:flex;gap:10px;flex-wrap:wrap;
        justify-content:center;margin-top:15px;
      }
      .chem4-btn {
        padding:12px 17px;border:1px solid #66bcff;
        border-radius:9px;color:#fff;font-weight:800;
        cursor:pointer;background:#2475e3;
      }
      .chem4-btn:disabled {opacity:.4;cursor:not-allowed}
      .chem4-start {background:#05ad9f}
      .chem4-pause {background:#225587}
      .chem4-stop {background:#d33e49}
      .chem4-reset {background:#37546f}
      .chem4-control {margin:17px 0 24px}
      .chem4-control label {
        display:block;margin-bottom:10px;
        color:#c5d9ed;font-size:13px;font-weight:700;
      }
      .chem4-control input {width:100%;accent-color:#258cff}
      .chem4-readings {
        display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
        gap:11px;padding:15px;background:#102d4a;
        border:1px solid #2b6285;border-radius:13px;
      }
      .chem4-reading {
        min-height:80px;padding:13px;
        background:#0c2945;border:1px solid #2d698e;
        border-radius:11px;overflow-wrap:anywhere;
      }
      .chem4-reading small {display:block;color:#bdd2e6}
      .chem4-reading strong {
        display:block;margin-top:12px;
        font-size:19px;color:#43e5ee;
      }
      .chem4-formula {
        padding:19px;margin-top:22px;
        background:#102e49;border:1px solid #2a7190;
        border-radius:13px;
      }
      .chem4-formula h3 {color:#5cece6;margin:0 0 15px}
      #chem4-formula {
        display:block;font-size:20px;
        color:#ffda72;font-weight:800;line-height:1.6;
      }
      .chem4-complete {
        width:100%;padding:15px;margin-top:15px;
        border:0;border-radius:9px;color:#fff;
        background:linear-gradient(90deg,#9479fa,#6753e0);
        font-weight:800;cursor:pointer;
      }
      .chem4-bottom {
        margin-top:20px;padding:23px;
        background:#102742;border:1px solid #2c698c;
        border-radius:16px;line-height:1.7;
      }
      .chem4-bottom h3 {color:#65f0e8}
      .chem4-option {
        display:block;width:100%;text-align:left;
        padding:14px;margin:8px 0;border-radius:9px;
        background:#1b4363;color:#fff;
        border:1px solid #4184aa;cursor:pointer;
      }
      .chem4-option:disabled {cursor:default}
      .chem4-chat {
        padding:13px;margin:9px 0;background:#1c4465;
        border-radius:9px;white-space:pre-wrap;
      }
      #chem4-ask {
        display:block;box-sizing:border-box;width:100%;
        min-height:90px;padding:12px;resize:vertical;
        color:#fff;background:#091f35;
        border:1px solid #37739a;border-radius:10px;
      }
      @media(max-width:900px) {
        .chem4-layout {grid-template-columns:1fr}
        .chem4-panel {padding:14px}
      }
    `;

    document.head.appendChild(style);
  }

  /* ==================================================
     EXPERIMENT CARDS
  ================================================== */

  function makeCards() {
    const page = $("laboratory");
    if (!page) return;

    const cards = [...page.querySelectorAll(".experiment-card")];

    const originalPH = cards.find(card =>
      card.dataset.category === "chemistry" &&
      /pH Indicator/i.test(card.textContent)
    );

    let grid = originalPH?.parentElement ||
               cards[0]?.parentElement;

    if (!grid) {
      grid = $("chem4-fallback");
      if (!grid) {
        grid = document.createElement("div");
        grid.id = "chem4-fallback";
        grid.style.cssText =
          "display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px";
        page.appendChild(grid);
      }
    }

    LABS.forEach(lab => {
      let card = $("chem4-card-" + lab.id);

      if (!card && lab.id === "ph" && originalPH) {
        card = originalPH;
      }

      if (!card) {
        card = document.createElement("article");
        grid.appendChild(card);
      }

      card.id = "chem4-card-" + lab.id;
      card.className = "experiment-card chem4-card";
      card.dataset.category = "chemistry";
      card.dataset.recommended =
        "primary middle secondary senior college";

      card.innerHTML = `
        <div class="chem4-preview">
          <div class="chem4-orb">${lab.icon}</div>
        </div>
        <span class="chem4-tag">● ANIMATED LAB</span>
        <h3>${esc(lab.title)}</h3>
        <p>${esc(lab.desc)}</p>
        <div class="chem4-foot">
          <small>Chemistry · Live Animation</small>
          <button type="button" data-chem4="${lab.id}">
            ▶ Start
          </button>
        </div>
      `;
    });

    updateCards();
  }

  function updateCards() {
    const filter = $("experimentFilter")?.value || "all";

    document.querySelectorAll(".chem4-card").forEach(card => {
      const visible =
        filter === "all" || filter === "chemistry";

      card.classList.toggle("hidden", !visible);
      card.style.display = visible ? "flex" : "none";
    });
  }

  /* ==================================================
     WORKSPACE AND NAVIGATION
  ================================================== */

  function pause() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastTime = 0;
    if (active) active.running = false;
  }

  function restore() {
    pause();
    hidden.forEach(x => x.node.style.display = x.display);
    hidden = [];
    $("chem4-workspace")?.remove();
    active = null;
  }

  function workspace() {
    const page = $("experimentWorkspace");
    if (!page) return false;
    if ($("chem4-workspace")) return true;

    hidden = [...page.children].map(node => ({
      node, display:node.style.display
    }));

    hidden.forEach(x => x.node.style.display = "none");

    const root = document.createElement("div");
    root.id = "chem4-workspace";

    root.innerHTML = `
      <button id="chem4-back" type="button">
        ← Back to Laboratory
      </button>

      <div class="chem4-eyebrow">
        INTERACTIVE VIRTUAL EXPERIMENT
      </div>

      <h1 id="chem4-title"></h1>
      <p class="chem4-intro" id="chem4-description"></p>

      <div class="chem4-layout">
        <section class="chem4-panel">
          <div class="chem4-head">
            <span>Simulation Workspace</span>
            <span class="chem4-live">● INTERACTIVE</span>
          </div>

          <canvas id="chem4-canvas"
            width="1000" height="500"></canvas>

          <div class="chem4-buttons">
            <button class="chem4-btn chem4-start"
              data-chem4-action="start">▶ Start</button>
            <button class="chem4-btn chem4-pause"
              data-chem4-action="pause">⏸ Pause</button>
            <button class="chem4-btn chem4-stop"
              data-chem4-action="stop">■ Stop</button>
            <button class="chem4-btn chem4-reset"
              data-chem4-action="reset">↻ Reset</button>
          </div>
        </section>

        <section class="chem4-panel">
          <div class="chem4-head">
            <span>Experiment Controls</span>
            <span class="chem4-live">● LIVE</span>
          </div>

          <div id="chem4-controls"></div>
          <div class="chem4-readings" id="chem4-readings"></div>

          <p style="color:#afc5da;font-size:12px">
            Adjust the sliders while the simulation is running.
            This is a simplified educational model.
          </p>

          <div class="chem4-formula">
            <h3>📐 Experiment Formula</h3>
            <strong id="chem4-formula"></strong>
            <p id="chem4-formula-note"></p>
          </div>

          <button id="chem4-complete"
            class="chem4-complete">
            Complete Experiment ✓
          </button>
        </section>
      </div>

      <section class="chem4-bottom">
        <h3>📖 Science Behind the Experiment</h3>
        <p id="chem4-science"></p>
      </section>

      <section class="chem4-bottom">
        <h3>🧠 Five Quick MCQs</h3>
        <p id="chem4-progress"></p>
        <h3 id="chem4-question"></h3>
        <div id="chem4-answers"></div>
        <p id="chem4-feedback"></p>
        <button class="chem4-btn"
          id="chem4-next" disabled>
          Next question →
        </button>

        <hr style="border:0;border-top:1px solid #315c7c;margin:25px 0">

        <h3>💬 Ask PocketLab Tutor</h3>
        <p>Offline Chemistry help about this experiment.</p>
        <div id="chem4-chat"></div>

        <form id="chem4-form">
          <textarea id="chem4-ask" required
            maxlength="500"
            placeholder="Ask about the formula, stages, particles, or results..."></textarea>
          <button type="submit" class="chem4-btn">
            ➤ Send
          </button>
        </form>
      </section>
    `;

    page.appendChild(root);

    $("chem4-back").onclick = () => {
      restore();
      if (typeof navigate === "function") {
        navigate("laboratory");
      } else {
        document.querySelectorAll(".page")
          .forEach(p => p.classList.remove("active"));
        $("laboratory")?.classList.add("active");
      }
    };

    root.addEventListener("click",e => {
      const button = e.target.closest("[data-chem4-action]");
      if (!button) return;

      const action = button.dataset.chem4Action;
      if (action === "start") play();
      if (action === "pause") pause();
      if (action === "stop") {
        pause();
        if (active) active.time = 0;
        draw();
      }
      if (action === "reset") {
        pause();
        if (active) {
          active.time = 0;
          active.index = 0;
          active.score = 0;
          question();
          draw();
        }
      }
    });

    $("chem4-next").onclick = nextQuestion;

    $("chem4-form").onsubmit = e => {
      e.preventDefault();
      tutor();
    };

    $("chem4-complete").onclick = () => {
      if (!active) return;

      try {
        localStorage.setItem(
          "pocketlab-chem4-" + active.lab.id,
          "completed"
        );
      } catch (_) {}

      $("chem4-complete").textContent =
        "Experiment Completed ✓";
    };

    return true;
  }

  function openLab(id) {
    const lab = MAP[id];
    if (!lab) return;

    pause();
    if (!workspace()) return;

    active = {
      lab, time:0, running:false,
      p:{}, index:0, score:0, answered:false
    };

    lab.controls.forEach(c => active.p[c[0]] = c[4]);

    $("chem4-title").textContent = lab.title;
    $("chem4-description").textContent = lab.desc;
    $("chem4-formula").textContent = lab.formula;
    $("chem4-formula-note").textContent = lab.science;
    $("chem4-science").textContent = lab.science;
    $("chem4-chat").innerHTML = "";
    $("chem4-ask").value = "";

    const completed = (() => {
      try {
        return localStorage.getItem(
          "pocketlab-chem4-" + lab.id
        ) === "completed";
      } catch (_) { return false; }
    })();

    $("chem4-complete").textContent =
      completed ? "Experiment Completed ✓" :
      "Complete Experiment ✓";

    const controls = $("chem4-controls");
    controls.innerHTML = "";

    lab.controls.forEach(([key,label,min,max,value,step,unit]) => {
      const group = document.createElement("div");
      group.className = "chem4-control";

      const title = document.createElement("label");
      const input = document.createElement("input");
      input.type = "range";
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = value;

      const updateLabel = () => {
        let display = input.value + unit;

        if (lab.id === "ph") {
          display = SOLUTIONS[Number(input.value)][0];
        }

        if (lab.id === "bond") {
          display = ["","Ionic","Covalent","Metallic"][+input.value];
        }

        if (lab.id === "matter") {
          display = ["","Solid","Liquid","Gas"][+input.value];
        }

        if (lab.id === "separation") {
          display = ["","Filtration","Evaporation","Distillation"][+input.value];
        }

        if (lab.id === "reactions") {
          display = ["","Precipitation","Gas evolution","Neutralization"][+input.value];
        }

        title.textContent = label + ": " + display;
      };

      input.oninput = () => {
        if (!active) return;
        active.p[key] = Number(input.value);
        updateLabel();
        draw();
      };

      updateLabel();
      group.append(title,input);
      controls.appendChild(group);
    });

    question();
    draw();

    if (typeof navigate === "function") {
      navigate("experimentWorkspace");
    } else {
      document.querySelectorAll(".page")
        .forEach(p => p.classList.remove("active"));
      $("experimentWorkspace")?.classList.add("active");
    }
  }

  /* ==================================================
     ANIMATION LOOP
  ================================================== */

  function play() {
    if (!active || active.running) return;
    active.running = true;
    lastTime = 0;
    raf = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!active || !active.running) return;

    if (lastTime) {
      active.time += Math.min((now-lastTime)/1000,0.05);
    }

    lastTime = now;
    draw();
    raf = requestAnimationFrame(tick);
  }

  /* ==================================================
     DRAWING
  ================================================== */

  function draw() {
    if (!active) return;

    const canvas = $("chem4-canvas");
    if (!canvas) return;

    const c = canvas.getContext("2d");
    const {lab,p,time:t} = active;

    const W = 1000, H = 500;

    c.clearRect(0,0,W,H);

    const bg = c.createRadialGradient(
      500,240,25,500,240,650
    );
    bg.addColorStop(0,"#174971");
    bg.addColorStop(1,"#07192f");

    c.fillStyle = bg;
    c.fillRect(0,0,W,H);

    c.strokeStyle = "#285b7b55";
    c.lineWidth = 1;

    for(let x=0;x<W;x+=50){
      c.beginPath();c.moveTo(x,0);
      c.lineTo(x,H);c.stroke();
    }
    for(let y=0;y<H;y+=50){
      c.beginPath();c.moveTo(0,y);
      c.lineTo(W,y);c.stroke();
    }

    function circle(x,y,r,color,outline="#a3eaff"){
      c.beginPath();c.arc(x,y,r,0,TWO_PI);
      c.fillStyle=color;c.fill();
      c.strokeStyle=outline;c.lineWidth=2;c.stroke();
    }

    function line(x,y,xx,yy,color="#89eaff",width=4){
      c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);
      c.strokeStyle=color;c.lineWidth=width;c.stroke();
    }

    function txt(value,x,y,size=22,color="#effaff"){
      c.font=`bold ${size}px Arial`;
      c.fillStyle=color;c.textAlign="center";
      c.fillText(String(value),x,y);
    }

    function box(x,y,w,h,fill="#1c5780"){
      c.fillStyle=fill;c.fillRect(x,y,w,h);
      c.strokeStyle="#9beaff";c.lineWidth=4;
      c.strokeRect(x,y,w,h);
    }

    const read = (name,value) => `
      <div class="chem4-reading">
        <small>${esc(name)}</small>
        <strong>${esc(value)}</strong>
      </div>
    `;

    let readings = "";

    /* -------- pH INDICATOR -------- */

    if(lab.id === "ph"){
      const solution=SOLUTIONS[p.solution];
      const [name,ph,color]=solution;
      const nature=ph<7?"ACIDIC":ph>7?"ALKALINE":"NEUTRAL";

      txt("pH INDICATOR LABORATORY",500,43,27,"#94eaff");

      c.strokeStyle="#b1edff";c.lineWidth=6;
      c.beginPath();
      c.moveTo(300,120);c.lineTo(300,425);
      c.quadraticCurveTo(300,440,320,440);
      c.lineTo(675,440);
      c.quadraticCurveTo(700,440,700,425);
      c.lineTo(700,120);c.stroke();

      const surface=280+Math.sin(t*2)*4;
      c.fillStyle=color;
      c.globalAlpha=.78;
      c.fillRect(306,surface,388,153);
      c.globalAlpha=1;

      for(let i=0;i<20;i++){
        if(t<=0)break;
        const x=335+i*17;
        const y=425-((i*37+t*22)%130);
        circle(x,y,3+i%3,"#ffffff77","#ffffff99");
      }

      box(740,170,180,130,"#0b283d");
      txt("pH "+ph,830,230,32,"#60efbb");
      txt("pH METER",830,270,16);

      txt(name,500,95,23,"#ffe184");
      txt(nature,500,260,25);

      readings+=read("Solution",name);
      readings+=read("pH",ph);
      readings+=read("Nature",nature);
      readings+=read("Indicator colour",color);
    }

    /* -------- PERIODIC TABLE -------- */

    if(lab.id === "periodic"){
      const el=ELEMENTS[p.element-1];
      const [symbol,name,Z,mass,group,period,type]=el;

      txt("PERIODIC TABLE — ATOMIC STRUCTURE",
        500,40,26,"#9cefff");

      circle(405,255,43,"#e66d85");
      txt(symbol,405,264,29);

      let left=Z;
      const shells=[];

      for(let i=0;i<4&&left>0;i++){
        const n=Math.min(left,[2,8,8,2][i]);
        left-=n;shells.push(n);

        const radius=83+i*39;

        c.beginPath();c.arc(405,255,radius,0,TWO_PI);
        c.strokeStyle="#478ec4";c.lineWidth=2;c.stroke();

        for(let j=0;j<n;j++){
          const a=j/n*TWO_PI+t*(i%2?-.3:.3);
          circle(405+Math.cos(a)*radius,
            255+Math.sin(a)*radius,8,"#70e7ff");
        }
      }

      txt(name,812,128,26,"#81eeff");
      txt("Group "+group,812,180);
      txt("Period "+period,812,223);
      txt(type,812,265,17,"#ffe18a");

      readings+=read("Element",name);
      readings+=read("Atomic number",Z);
      readings+=read("Atomic mass",mass+" u");
      readings+=read("Group / Period",group+" / "+period);
      readings+=read("Electrons",shells.join(", "));
      readings+=read("Outer-shell electrons",
        shells[shells.length-1]);
    }

    /* -------- CHEMICAL BONDING -------- */

    if(lab.id === "bond"){
      txt("CHEMICAL BONDING",500,43,27,"#91ecff");

      const names=["","Ionic","Covalent","Metallic"];

      if(p.bond===1){
        circle(340,250,85,"#62b7ff");
        circle(660,250,95,"#f78c6c");
        txt("Na⁺",340,264,41);
        txt("Cl⁻",660,264,41);
        txt("Attraction between ions",500,425,23,"#ffe18a");
      } else if(p.bond===2){
        circle(380,250,80,"#62b7ff");
        circle(620,250,80,"#62b7ff");
        txt("H",380,264,44);
        txt("H",620,264,44);
        line(460,250,540,250,"#ffe16c",7);
        circle(500+Math.sin(t*4)*22,235,8,"#ffe16c");
        circle(500-Math.sin(t*4)*22,265,8,"#ffe16c");
        txt("Shared electron pair",500,425,23,"#ffe18a");
      } else {
        for(let row=0;row<3;row++){
          for(let col=0;col<5;col++){
            const x=275+col*110,y=140+row*105;
            circle(x,y,29,"#9ab7d4");
            txt("+",x,y+10,33,"#234162");
          }
        }
        for(let i=0;i<24;i++){
          circle(220+(i*61+t*45)%560,
            100+(i*37%300),5,"#ffe16b");
        }
      }

      readings+=read("Bond type",names[p.bond]);
      readings+=read("Example",
        p.bond===1?"NaCl":p.bond===2?"H₂":"Metal");
      readings+=read("Electron behaviour",
        p.bond===1?"Ionic transfer":
        p.bond===2?"Sharing":"Delocalized");
    }

    /* -------- REACTION RATES -------- */

    if(lab.id === "rate"){
      txt("PARTICLE COLLISION LAB",500,43,27,"#91ecff");
      box(170,105,660,320,"#103c63");

      const count=Math.round(p.concentration*.7);
      const speed=p.temperature*.65;

      for(let i=0;i<count;i++){
        const x=195+((i*73+t*speed*(i%2?1:-1))
          %610+610)%610;
        const y=130+((i*41+t*speed*(i%3?.6:-.6))
          %270+270)%270;
        circle(x,y,8,i%2?"#ffa76e":"#70e3ff");
      }

      const rate=(p.temperature/40)*
        (p.concentration/60);

      readings+=read("Temperature",p.temperature+" °C");
      readings+=read("Concentration",p.concentration+"%");
      readings+=read("Relative rate",rate.toFixed(2)+"×");
      readings+=read("Particles",count);
    }

    /* -------- STATES OF MATTER -------- */

    if(lab.id === "matter"){
      const names=["","SOLID","LIQUID","GAS"];
      txt("STATES OF MATTER — "+names[p.state],
        500,43,27,"#91ecff");

      c.strokeStyle="#a1eaff";c.lineWidth=5;
      c.strokeRect(180,110,640,320);

      for(let i=0;i<40;i++){
        const col=i%10,row=Math.floor(i/10);
        let x,y;

        if(p.state===1){
          x=235+col*56+Math.sin(t*6+i)*2;
          y=230+row*50+Math.cos(t*6+i)*2;
        } else if(p.state===2){
          x=215+((col*59+t*(i%2?13:-13))%570+570)%570;
          y=290+row*32+Math.sin(t*2+i)*9;
        } else {
          x=200+(i*73+t*(22+i%7*9))%600;
          y=130+(i*53+t*(18+i%5*10))%280;
        }

        circle(x,y,10,"#70e4ff");
      }

      readings+=read("State",names[p.state]);
      readings+=read("Particle motion",
        p.state===1?"Vibration":
        p.state===2?"Flowing":"Free motion");
    }

    /* -------- SEPARATION -------- */

    if(lab.id === "separation"){
      const names=["","Filtration","Evaporation","Distillation"];
      txt(names[p.method].toUpperCase(),500,43,27,"#91ecff");

      if(p.method===1){
        line(350,110,650,110);
        line(350,110,500,280);
        line(650,110,500,280);
        line(500,280,500,340,"#9beaff",10);

        for(let i=0;i<26;i++){
          circle(405+i*13%185,155+i*9%55,
            4,"#e6b575");
        }

        box(420,355,160,105,"#145e92");

        if(t>0){
          for(let i=0;i<5;i++){
            circle(500,300+((t*32+i*14)%90),
              5,"#70e5ff");
          }
        }
      } else if(p.method===2){
        box(300,310,400,95,"#2b83bc");

        for(let i=0;i<30;i++){
          circle(325+i*12,386,3,"#ffe6a0");
        }

        if(t>0){
          for(let i=0;i<15;i++){
            circle(325+i*23,
              300-((t*35+i*19)%210),
              6,"#9ceaff");
          }
        }

        txt("Water vapour escapes",500,90);
      } else {
        circle(280,280,85,"#78b8e055");
        line(350,230,490,140,"#a4eaff",13);
        line(490,140,720,270,"#a4eaff",13);
        line(720,270,720,350,"#a4eaff",10);
        line(485,115,715,245,"#35699a",29);
        box(655,355,130,90,"#174d78");

        if(t>0){
          for(let i=0;i<5;i++){
            const x=365+((t*35+i*47)%265);
            circle(x,220-(x-365)*.24,
              5,"#ffe27b");
          }
        }
      }

      readings+=read("Technique",names[p.method]);
      readings+=read("Elapsed",t.toFixed(1)+" s");
    }

    /* -------- TITRATION -------- */

    if(lab.id === "titration"){
      txt("ACID-BASE TITRATION",500,43,27,"#91ecff");

      // Burette
      box(470,70,60,205,"#2b739b55");
      line(500,275,500,325,"#abecff",8);

      const amount=p.volume;
      const acid=25;

      // Illustrative strong acid/base pH.
      const excess=amount-acid;
      let ph;

      if(excess<0){
        const remaining=0.1*(acid-amount)/
          (acid+amount || 1);
        ph=-Math.log10(Math.max(remaining,1e-8));
      } else if(excess===0){
        ph=7;
      } else {
        const oh=0.1*excess/(acid+amount);
        ph=14+Math.log10(oh);
      }

      ph=Math.max(0,Math.min(14,ph));

      // Conical flask
      c.beginPath();
      c.moveTo(455,335);c.lineTo(400,425);
      c.lineTo(600,425);c.lineTo(545,335);
      c.closePath();
      c.fillStyle=ph>8.2?"#e979c2bb":"#6cb5ff55";
      c.fill();
      c.strokeStyle="#abebff";c.lineWidth=5;c.stroke();

      if(t>0){
        for(let i=0;i<5;i++){
          circle(500,280+(t*30+i*25)%58,
            5,"#b4efff");
        }
      }

      txt("Burette",635,180);
      txt("Conical flask",500,465,18);
      txt("Indicator endpoint near pH 8.2",
        500,95,19,"#ffe18a");

      readings+=read("Base added",amount+" mL");
      readings+=read("Acid initial",acid+" mL");
      readings+=read("Calculated pH",ph.toFixed(2));
      readings+=read("Equivalence", "25 mL");
    }

    /* -------- ELECTROLYSIS -------- */

    if(lab.id === "electrolysis"){
      txt("ELECTROLYSIS OF WATER",500,43,27,"#91ecff");
      box(200,165,600,260,"#155b8a");

      line(350,140,350,340,"#cadbea",15);
      line(650,140,650,340,"#cadbea",15);

      txt("Cathode (−)",350,115,20);
      txt("Anode (+)",650,115,20);

      if(p.voltage>0 && t>0){
        for(let i=0;i<24;i++){
          const x=i%2?350:650;
          const y=360-((t*p.voltage*7+i*22)%190);
          circle(x+Math.sin(i*4+t)*17,
            y,4+i%3,"#b6efff");
        }
      }

      txt("H₂",350,215,27,"#ffe381");
      txt("O₂",650,215,27,"#ffe381");

      readings+=read("Voltage",p.voltage+" V");
      readings+=read("Cathode gas","Hydrogen");
      readings+=read("Anode gas","Oxygen");
      readings+=read("H₂:O₂ ratio","2 : 1");
    }

    /* -------- GAS LAWS -------- */

    if(lab.id === "gas"){
      const pressure=0.082057*p.temp/p.volume;

      txt("IDEAL GAS LAWS",500,43,27,"#91ecff");

      const width=140+p.volume*48;
      const left=500-width/2;

      box(left,140,width,270,"#174c74");

      for(let i=0;i<35;i++){
        const x=left+18+
          ((i*71+t*(p.temp/15+i%7))%(width-36));
        const y=160+((i*53+t*(p.temp/19+i%5))%225);
        circle(x,y,7,"#79e5ff");
      }

      txt("P = nRT / V",500,95,25,"#ffe18a");

      readings+=read("Temperature",p.temp+" K");
      readings+=read("Volume",p.volume+" L");
      readings+=read("Pressure",
        pressure.toFixed(2)+" atm");
      readings+=read("Amount","1 mol");
    }

    /* -------- SOLUBILITY -------- */

    if(lab.id === "solubility"){
      txt("SOLUBILITY LABORATORY",500,43,27,"#91ecff");

      const capacity=p.water*.36;
      const dissolved=Math.min(p.salt,capacity);
      const excess=Math.max(0,p.salt-capacity);

      box(310,160,380,265,"#155781");

      for(let i=0;i<Math.round(dissolved/3);i++){
        const x=335+i*57%330;
        const y=205+i*43%190;
        circle(x+Math.sin(t+i)*7,y,5,"#d4ecff");
      }

      for(let i=0;i<Math.round(excess/3);i++){
        circle(345+i*14%310,
          410-(i%3)*5,5,"#ffe291");
      }

      txt("Water + Salt",500,110,24);

      readings+=read("Salt added",p.salt+" g");
      readings+=read("Water",p.water+" mL");
      readings+=read("Dissolved",dissolved.toFixed(1)+" g");
      readings+=read("Undissolved",excess.toFixed(1)+" g");
    }

    /* -------- CHROMATOGRAPHY -------- */

    if(lab.id === "chromatography"){
      txt("PAPER CHROMATOGRAPHY",500,43,27,"#91ecff");

      box(310,105,380,335,"#32557a");
      c.fillStyle="#dce8dc";
      c.fillRect(405,125,190,300);

      const progress=Math.min(.95,t*p.speed*.025);
      const frontY=400-progress*245;

      line(410,frontY,590,frontY,"#55b5e5",4);

      const dyes=[
        ["#ef4c6e",.28],
        ["#477cff",.52],
        ["#f2bd48",.74]
      ];

      dyes.forEach(([color,rf],i)=>{
        const y=397-progress*245*rf;
        circle(450+i*50,y,12,color,color);
      });

      txt("Solvent front",745,frontY,17);
      txt("Ink components",500,470,20);

      readings+=read("Solvent progress",
        (progress*100).toFixed(0)+"%");
      readings+=read("Dye 1 Rf","0.28");
      readings+=read("Dye 2 Rf","0.52");
      readings+=read("Dye 3 Rf","0.74");
    }

    /* -------- CHEMICAL REACTIONS -------- */

    if(lab.id === "reactions"){
      const names=["","Precipitation","Gas evolution","Neutralization"];

      txt(names[p.reaction].toUpperCase(),
        500,43,27,"#91ecff");

      box(315,135,370,300,"#15486c");

      if(p.reaction===1){
        for(let i=0;i<35;i++){
          const x=345+i*43%310;
          const y=390-(t>0?Math.min(t*20,100):0)+
            i*7%45;
          circle(x,Math.min(415,y),5,"#ffe28b");
        }
        txt("Precipitate forms",500,105);
      } else if(p.reaction===2){
        for(let i=0;i<28;i++){
          const x=355+i*29%290;
          const y=400-((i*37+t*40)%240);
          circle(x,y,4+i%4,"#b5efff");
        }
        txt("Gas bubbles form",500,105);
      } else {
        const colour=t>3?"#5acf8a":"#e46c86";
        c.fillStyle=colour+"aa";
        c.fillRect(320,280,360,150);
        txt("Acid + Base",500,105);
      }

      readings+=read("Reaction",names[p.reaction]);
      readings+=read("Elapsed",t.toFixed(1)+" s");
    }

    readings+=read("Simulation",active.running?"Running":"Ready");

    $("chem4-readings").innerHTML=readings;
  }

  /* ==================================================
     FIVE MCQs
  ================================================== */

  function question() {
    if (!active) return;

    const s=active;

    if(s.index>=5){
      $("chem4-progress").textContent="Quiz completed";
      $("chem4-question").textContent=
        "🏆 Score: "+s.score+"/5";
      $("chem4-answers").innerHTML="";
      $("chem4-feedback").textContent=
        s.score===5?"Excellent!":"Review and try again.";
      $("chem4-next").textContent="Try Again ↻";
      $("chem4-next").disabled=false;
      return;
    }

    const q=s.lab.quiz[s.index];

    $("chem4-progress").textContent=
      `Question ${s.index+1} of 5 · Score ${s.score}/5`;
    $("chem4-question").textContent=q[0];
    $("chem4-answers").innerHTML="";
    $("chem4-feedback").textContent="Choose one answer.";

    s.answered=false;
    $("chem4-next").disabled=true;
    $("chem4-next").textContent=
      s.index===4?"See score →":"Next question →";

    const answers=q.slice(1);
    const offset=s.index%4;
    const options=answers.slice(offset)
      .concat(answers.slice(0,offset));

    options.forEach((answer,i)=>{
      const button=document.createElement("button");
      button.type="button";
      button.className="chem4-option";
      button.textContent="ABCD"[i]+". "+answer;

      button.onclick=()=>{
        if(s.answered)return;
        s.answered=true;

        const correct=answer===q[1];
        if(correct)s.score++;

        $("chem4-feedback").textContent=
          correct?"✅ Correct!":"❌ Correct: "+q[1];

        $("chem4-answers")
          .querySelectorAll("button")
          .forEach(b=>{
            b.disabled=true;
            if(b.textContent.slice(3)===q[1]){
              b.style.background="#16694f";
            }else if(b===button){
              b.style.background="#853d4d";
            }
          });

        $("chem4-next").disabled=false;
      };

      $("chem4-answers").appendChild(button);
    });
  }

  function nextQuestion(){
    if(!active)return;

    if(active.index>=5){
      active.index=0;
      active.score=0;
      question();
      return;
    }

    if(!active.answered)return;
    active.index++;
    question();
  }

  /* ==================================================
     OFFLINE CHEMISTRY TUTOR
  ================================================== */

  function tutor(){
    if(!active)return;

    const input=$("chem4-ask");
    const questionText=input.value.trim();
    if(!questionText)return;

    const lab=active.lab;
    const q=questionText.toLowerCase();

    let answer=lab.science;

    if(/formula|equation|law|principle/.test(q)){
      answer=lab.formula;
    }else if(/how|why|explain|what/.test(q)){
      answer=lab.science;
    }

    if(lab.id==="periodic"){
      const e=ELEMENTS[active.p.element-1];
      if(/group|period|electron|proton|valence/.test(q)){
        answer=
          `${e[1]} has atomic number ${e[2]}, `+
          `belongs to group ${e[4]} and period ${e[5]}. `+
          `Its approximate atomic mass is ${e[3]} u. `+
          `Its category is ${e[6]}.`;
      }
    }

    if(lab.id==="rate" &&
       /temperature|concentration|increase/.test(q)){
      answer=
        "Higher temperature generally increases reaction rate. "+
        "Higher concentration often increases collisions.";
    }

    const chat=$("chem4-chat");

    const student=document.createElement("div");
    student.className="chem4-chat";
    student.textContent="Student: "+questionText;

    const reply=document.createElement("div");
    reply.className="chem4-chat";
    reply.textContent="PocketLab Tutor: "+answer;

    chat.append(student,reply);
    input.value="";
  }

  /* ==================================================
     EVENTS AND STARTUP
  ================================================== */

  document.addEventListener("click",event=>{
    const button=event.target.closest("[data-chem4]");

    if(button){
      event.preventDefault();
      event.stopImmediatePropagation();
      openLab(button.dataset.chem4);
      return;
    }

    if(active && event.target.closest(
      ".experiment-card [data-experiment]"
    )){
      restore();
    }
  },true);

  document.addEventListener("click",event=>{
    const nav=event.target.closest("[data-page]");
    if(nav && active &&
       nav.dataset.page!=="experimentWorkspace"){
      restore();
    }
  },true);

  function initialize(){
    installCSS();
    makeCards();

    const filter=$("experimentFilter");

    if(filter){
      filter.addEventListener("change",updateCards);
      filter.addEventListener("input",updateCards);
    }

    console.log(
      "✅ PocketLab Chemistry 4.0: 12 experiments loaded"
    );
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initialize);
  }else{
    initialize();
  }

})();
