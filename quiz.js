
/* ========================================================
   POCKETLAB QUIZ ARENA 2026
   FULL FILE: quiz.js
   Physics • Chemistry • Biology • Mathematics
   10 Questions • Timer • Levels • Offline Scores
   ======================================================== */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);

  const SUBJECTS = {
    physics: { name: "Physics", icon: "⚛️" },
    chemistry: { name: "Chemistry", icon: "🧪" },
    biology: { name: "Biology", icon: "🧬" },
    mathematics: { name: "Mathematics", icon: "🔢" }
  };

  /*
    Question format:
    [Question, Correct, Wrong1, Wrong2, Wrong3, Explanation]
  */

  const BANK = {
    physics: {
      easy: [
        ["What force pulls objects toward Earth?","Gravity","Friction","Magnetism","Tension","Gravity attracts objects toward Earth."],
        ["What is the SI unit of force?","Newton","Joule","Watt","Metre","Force is measured in newtons (N)."],
        ["What is the SI unit of length?","Metre","Kilogram","Second","Litre","The metre is the SI base unit of length."],
        ["Which instrument measures temperature?","Thermometer","Voltmeter","Ammeter","Ruler","A thermometer measures temperature."],
        ["Which material is usually attracted by magnets?","Iron","Wood","Plastic","Glass","Iron is ferromagnetic."],
        ["What travels through a vacuum?","Light","Sound","Water waves","Ocean waves","Light is an electromagnetic wave."],
        ["What is the main source of daylight?","Sun","Moon","Earth","Mars","The Sun emits the light that reaches Earth."],
        ["Which unit measures electric current?","Ampere","Volt","Ohm","Joule","Electric current is measured in amperes."],
        ["What is a push or pull called?","Force","Energy","Power","Speed","A force is a push or pull."],
        ["Which object usually reflects light?","Mirror","Sponge","Charcoal","Black paper","A mirror has a surface that reflects light."]
      ],
      medium: [
        ["What is the formula for speed?","Distance/Time","Time/Distance","Force/Mass","Mass/Volume","Average speed equals total distance divided by total time."],
        ["A 5 kg body accelerates at 2 m/s². Force?","10 N","2.5 N","7 N","20 N","Newton's second law gives F = ma = 5 × 2 = 10 N."],
        ["What is Ohm's law?","V = IR","F = ma","P = F/A","E = mc²","Voltage equals current multiplied by resistance."],
        ["A 4 Ω resistor carries 3 A. Voltage?","12 V","7 V","1.33 V","24 V","V = IR = 3 × 4 = 12 V."],
        ["What is the SI unit of energy?","Joule","Newton","Watt","Pascal","Energy is measured in joules."],
        ["What is acceleration?","Rate of change of velocity","Distance divided by mass","Force divided by distance","Constant speed","Acceleration measures how velocity changes over time."],
        ["What is the formula for density?","Mass/Volume","Volume/Mass","Mass × Volume","Weight/Time","Density is mass per unit volume."],
        ["What is the speed of sound in air near 20°C?","343 m/s","30 m/s","3000 m/s","3 m/s","Sound travels at approximately 343 m/s in air at 20°C."],
        ["In a series circuit, which quantity is the same through every component?","Current","Voltage drop","Resistance","Power","Components connected in series carry the same current."],
        ["Which lens usually converges parallel light?","Convex lens","Concave lens","Plane mirror","Prism only","A convex lens converges parallel rays under ordinary conditions."]
      ],
      hard: [
        ["What is the kinetic energy formula?","½mv²","mgh","F/A","IR","Translational kinetic energy equals one-half mass times speed squared."],
        ["What is momentum?","Mass × Velocity","Mass × Acceleration","Force/Time","Energy/Time","Linear momentum is p = mv."],
        ["What is magnetic flux through a uniform flat surface?","BA cosθ","B/A","B + A","BA sinθ always","Flux equals BA cosθ, with θ measured from the surface normal."],
        ["What does Faraday's law describe?","Induced EMF from changing magnetic flux","Only electric resistance","Only gravity","Only refraction","Induced EMF is related to the rate of change of magnetic flux."],
        ["What is the unit of capacitance?","Farad","Henry","Tesla","Weber","Capacitance is measured in farads."],
        ["For a spring, elastic potential energy is...","½kx²","kx","mgx","mv²","An ideal spring stores energy U = ½kx²."],
        ["Which equation describes wave speed?","v = fλ","v = f/λ","v = λ/f","v = f + λ","Wave speed equals frequency multiplied by wavelength."],
        ["What is the SI unit of magnetic flux?","Weber","Tesla","Henry","Ohm","Magnetic flux is measured in webers."],
        ["For an ideal transformer, Vp/Vs equals...","Np/Ns","Ns/Np","Ip/Is always","Rp/Rs","The voltage ratio equals the primary-to-secondary turns ratio."],
        ["What is the photoelectric effect?","Electron emission caused by light","Light bending through a prism","Heat transfer by convection","Magnetic attraction","Photons can eject electrons from a suitable material."]
      ]
    },

    chemistry: {
      easy: [
        ["What is the chemical formula of water?","H₂O","CO₂","NaCl","O₂","Water contains two hydrogen atoms and one oxygen atom per molecule."],
        ["What is the symbol for oxygen?","O","Ox","Og","On","O is the chemical symbol of oxygen."],
        ["What is the symbol for sodium?","Na","S","So","N","The symbol Na comes from the Latin name natrium."],
        ["What is neutral pH at approximately 25°C?","7","2","10","14","At about 25°C, neutral water has pH approximately 7."],
        ["Which is an acidic household liquid?","Vinegar","Soapy water","Baking soda solution","Bleach","Vinegar contains acetic acid."],
        ["What is common table salt?","Sodium chloride","Calcium carbonate","Hydrogen peroxide","Carbon dioxide","Table salt is primarily NaCl."],
        ["Which state has a fixed shape?","Solid","Liquid","Gas","Vapour","Solids retain a definite shape under ordinary conditions."],
        ["What is the centre of an atom called?","Nucleus","Electron shell","Molecule","Bond","The nucleus contains protons and neutrons."],
        ["Which gas do humans breathe in for respiration?","Oxygen","Helium","Neon","Argon","Oxygen is used in aerobic cellular respiration."],
        ["What is melting?","Solid to liquid","Liquid to gas","Gas to liquid","Liquid to solid","Melting changes a solid into a liquid."]
      ],
      medium: [
        ["What determines atomic number?","Protons","Neutrons","Electron shells","Atomic mass","Atomic number is the number of protons in the nucleus."],
        ["Which bond involves electron sharing?","Covalent","Ionic","Metallic only","Nuclear","Covalent bonding involves shared electron pairs."],
        ["Which bond is mainly present in NaCl?","Ionic","Metallic","Nonpolar covalent","Hydrogen","Sodium chloride forms a lattice of oppositely charged ions."],
        ["What is a catalyst?","Substance that changes reaction rate without being consumed overall","Substance that only increases mass","A type of proton","An inert gas","Catalysts provide an alternative reaction pathway."],
        ["What does filtration separate?","Insoluble solid from liquid","Dissolved salt from water completely","Individual atoms","Light wavelengths","Filter paper retains larger insoluble particles."],
        ["Which group contains noble gases?","18","1","2","17","Noble gases occupy group 18 of the periodic table."],
        ["A pH of 3 indicates a solution is...","Acidic","Neutral","Alkaline","Always pure","Acidic solutions have pH below 7 at ordinary temperatures."],
        ["What forms during precipitation?","Insoluble solid","Only light","Only heat","A vacuum","A precipitate is an insoluble solid formed in a reaction."],
        ["Which method separates dyes in ink?","Chromatography","Combustion","Neutralization","Electrolysis","Chromatography separates components by different rates of movement."],
        ["What does the mole measure?","Amount of substance","Temperature","Pressure","Density","The mole is the SI unit of amount of substance."]
      ],
      hard: [
        ["What is Avogadro's constant approximately?","6.022 × 10²³ mol⁻¹","3.00 × 10⁸ mol⁻¹","9.81 mol⁻¹","1.60 × 10⁻¹⁹ mol⁻¹","One mole contains approximately 6.022 × 10²³ specified entities."],
        ["What is the ideal gas equation?","PV = nRT","V = IR","F = ma","P = VI","The ideal gas equation relates pressure, volume, amount and temperature."],
        ["Which electrode is the site of reduction?","Cathode","Anode","Salt bridge","Voltmeter","Reduction occurs at the cathode."],
        ["What is oxidation?","Loss of electrons","Gain of electrons","Loss of neutrons","Gain of protons always","Oxidation corresponds to electron loss."],
        ["What is the pH of 0.001 M ideal strong monoprotic acid at 25°C?","3","1","7","11","Assuming complete dissociation, pH = −log₁₀(10⁻³) = 3."],
        ["For an exothermic reaction, ΔH is...","Negative","Positive","Always zero","Undefined","An exothermic reaction releases heat and has negative enthalpy change."],
        ["For a first-order reaction, the rate depends on concentration to power...","1","0","2","3","A first-order rate law is proportional to reactant concentration."],
        ["What is the oxidation state of O in ordinary H₂O?","−2","+2","0","−1","Oxygen has oxidation state −2 in water."],
        ["What is the conjugate base of H₂CO₃?","HCO₃⁻","CO₃²⁻","H₃O⁺","OH⁻","Removing one H⁺ from carbonic acid forms bicarbonate."],
        ["What is the coordination number of Na⁺ in ideal NaCl crystal?","6","4","8","12","Each Na⁺ has six nearest Cl⁻ neighbours in the rock-salt structure."]
      ]
    },

    biology: {
      easy: [
        ["What is the basic unit of life?","Cell","Tissue","Organ","Organ system","Cells are the basic structural and functional units of life."],
        ["Which organ pumps blood?","Heart","Liver","Kidney","Lung","The heart pumps blood through the circulatory system."],
        ["Which plant part absorbs water mainly?","Roots","Flowers","Fruit","Petals","Roots take up water and dissolved minerals."],
        ["Which gas do plants release during photosynthesis?","Oxygen","Nitrogen","Methane","Helium","Oxygen is released during oxygenic photosynthesis."],
        ["What is the green pigment in leaves?","Chlorophyll","Haemoglobin","Keratin","Melanin","Chlorophyll absorbs light for photosynthesis."],
        ["Which organ is involved in breathing?","Lungs","Stomach","Liver","Kidney","Lungs exchange gases with the blood."],
        ["What carries genetic information?","DNA","Water","Starch","Glucose","DNA stores hereditary information."],
        ["What is the largest organ of the human body?","Skin","Heart","Brain","Liver","Skin is the largest organ by surface area and mass."],
        ["What are animals that eat plants called?","Herbivores","Carnivores","Decomposers","Parasites","Herbivores feed mainly on plant material."],
        ["What do seeds usually develop into?","New plants","Minerals","Clouds","Rocks","Under suitable conditions, a seed can germinate into a seedling."]
      ],
      medium: [
        ["Where does photosynthesis mainly occur?","Chloroplast","Mitochondrion","Nucleus","Ribosome","Chloroplasts contain structures used in photosynthesis."],
        ["Which organelle produces most ATP in aerobic eukaryotic cells?","Mitochondrion","Golgi body","Nucleus","Vacuole","Mitochondria perform oxidative phosphorylation."],
        ["Which blood cells transport oxygen?","Red blood cells","Platelets","Neutrophils","Lymphocytes","Haemoglobin in red blood cells carries oxygen."],
        ["What carries water upward through plants?","Xylem","Phloem","Epidermis","Stomata","Xylem transports water and minerals."],
        ["What is the main function of stomata?","Gas exchange","Seed storage","Root growth","Reproduction only","Stomata regulate gas exchange and water loss."],
        ["Where does human fertilization usually occur?","Fallopian tube","Uterus","Ovary","Cervix","Fertilization normally occurs in the fallopian tube."],
        ["Which process creates two daughter cells in ordinary body-cell division?","Mitosis","Meiosis","Fertilization","Pollination","Mitosis followed by cytokinesis produces two daughter cells."],
        ["What is the function of ribosomes?","Protein synthesis","Lipid storage","DNA replication only","Water transport","Ribosomes translate messenger RNA into proteins."],
        ["What is the function of platelets?","Blood clotting","Oxygen transport","Hormone secretion","Digestion","Platelets contribute to forming blood clots."],
        ["Which process releases energy from glucose in cells?","Cellular respiration","Pollination","Transpiration","Osmosis","Cellular respiration transfers energy from nutrients into ATP."]
      ],
      hard: [
        ["Which enzyme synthesizes DNA using a DNA template?","DNA polymerase","Amylase","Lipase","Pepsin","DNA polymerases add nucleotides to a growing DNA strand."],
        ["What is crossing over?","Exchange between homologous chromosomes","Ordinary translation","Cell digestion","Protein folding","Crossing over occurs during prophase I of meiosis."],
        ["Which RNA carries amino acids to ribosomes?","tRNA","mRNA","rRNA","snRNA","Transfer RNA carries specific amino acids for protein synthesis."],
        ["What is the codon AUG usually?","Start codon","Stop codon","Deletion","Intron","AUG generally initiates translation and codes for methionine."],
        ["Which stage directly produces most ATP in aerobic respiration?","Oxidative phosphorylation","Glycolysis alone","Fermentation","DNA replication","The electron transport chain drives ATP synthesis through chemiosmosis."],
        ["What is the genetic makeup of an organism called?","Genotype","Phenotype","Habitat","Niche","Genotype refers to an organism's genetic constitution."],
        ["What is natural selection?","Differential survival and reproduction of heritable variants","Random gene editing by choice","Creation of identical genomes","Removal of all mutations","Heritable traits associated with reproductive success can become more common."],
        ["What is an anticodon found on?","tRNA","DNA polymerase","Lipid","ATP synthase","An anticodon on tRNA pairs with an mRNA codon."],
        ["Which immune cells differentiate into antibody-secreting plasma cells?","B lymphocytes","Red blood cells","Platelets","Neutrophils only","Activated B cells can differentiate into plasma cells."],
        ["What is apoptosis?","Programmed cell death","Ordinary diffusion","Protein synthesis","DNA replication","Apoptosis is a regulated form of cell death."]
      ]
    },

    mathematics: {
      easy: [
        ["What is 12 + 8?","20","18","22","24","12 + 8 = 20."],
        ["What is 7 × 6?","42","36","48","49","Seven groups of six equal 42."],
        ["What is 36 ÷ 6?","6","5","7","8","36 divided into six equal groups gives 6."],
        ["How many sides does a triangle have?","3","4","5","6","A triangle has three sides."],
        ["How many degrees are in a right angle?","90°","45°","180°","60°","A right angle measures 90 degrees."],
        ["What is half of 50?","25","20","30","15","50 ÷ 2 = 25."],
        ["What is 9²?","81","18","72","90","Nine squared is 9 × 9 = 81."],
        ["What is 100 − 37?","63","67","73","53","Subtracting 37 from 100 gives 63."],
        ["What is 3/4 as a percentage?","75%","25%","50%","80%","3 ÷ 4 × 100 = 75%."],
        ["What is the perimeter of a square of side 5 cm?","20 cm","25 cm","10 cm","15 cm","The perimeter is 4 × 5 = 20 cm."]
      ],
      medium: [
        ["Solve 2x + 5 = 15.","x = 5","x = 10","x = 7","x = 2","Subtract 5, then divide by 2 to obtain x = 5."],
        ["What is the area of a circle of radius 3?","9π","6π","3π","18π","Area = πr² = 9π square units."],
        ["What is the hypotenuse for legs 6 and 8?","10","12","14","9","√(6² + 8²) = √100 = 10."],
        ["Mean of 4, 6, 8 and 10?","7","8","6","9","The sum is 28; dividing by four gives 7."],
        ["What is sin 30°?","1/2","1","0","√3/2","The exact sine of 30 degrees is 1/2."],
        ["Factor x² − 9.","(x − 3)(x + 3)","(x − 9)(x + 1)","(x − 3)²","(x + 9)(x − 1)","The expression is a difference of squares."],
        ["Derivative of x²?","2x","x","2","x³","The power rule gives d(x²)/dx = 2x."],
        ["Probability of an even number on a fair die?","1/2","1/3","1/6","2/3","Three of the six equally likely outcomes are even."],
        ["Slope through (0, 2) and (2, 6)?","2","3","4","1","The slope is (6 − 2)/(2 − 0) = 2."],
        ["What is 2³ × 2²?","32","16","64","8","Add exponents of the same base: 2⁵ = 32."]
      ],
      hard: [
        ["Derivative of x³?","3x²","x²","3x","x⁴","By the power rule, d(x³)/dx = 3x²."],
        ["What is ∫2x dx?","x² + C","2x² + C","x + C","2 + C","The antiderivative of 2x is x² plus a constant."],
        ["What is the determinant of [[2,3],[1,4]]?","5","11","8","2","For a 2×2 matrix, determinant = 2×4 − 3×1 = 5."],
        ["What is lim(x→0) sin(x)/x, with x in radians?","1","0","∞","−1","The standard trigonometric limit equals 1."],
        ["What is the derivative of sin x?","cos x","−cos x","sin x","−sin x","Differentiating sine with radians gives cosine."],
        ["What is log₂ 32?","5","4","6","8","2 raised to the fifth power equals 32."],
        ["What is the sum of the first 10 positive integers?","55","45","50","60","Using n(n + 1)/2 gives 10×11/2 = 55."],
        ["How many ways to arrange 4 distinct objects?","24","16","12","8","The number of arrangements is 4! = 24."],
        ["What is the integral of 1/x dx for x ≠ 0?","ln|x| + C","x² + C","1/x² + C","x + C","The derivative of ln|x| is 1/x."],
        ["What is the derivative of eˣ?","eˣ","xeˣ","1","ln x","The exponential function eˣ is its own derivative."]
      ]
    }
  };

  let session = null;
  let timerId = null;
  let originalPage = [];

  const STORAGE = "pocketlab_quiz_arena_v1";

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE)) || [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory(record) {
    try {
      const history = loadHistory();
      history.unshift(record);

      localStorage.setItem(
        STORAGE,
        JSON.stringify(history.slice(0, 100))
      );
    } catch (error) {
      console.warn("Quiz history could not be saved", error);
    }
  }

  function shuffle(items) {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  /* ==================================================
     STYLES
     ================================================== */

  function installStyles() {
    if ($("pqaStyles")) return;

    const style = document.createElement("style");
    style.id = "pqaStyles";

    style.textContent = `
      #pqaRoot {
        max-width:1150px;
        margin:0 auto;
        padding:22px 16px 55px;
        color:#eff7ff;
      }

      .pqa-eyebrow {
        color:#52e5ef;
        letter-spacing:.16em;
        font-size:11px;
        font-weight:800;
      }

      #pqaRoot h1 {
        font-size:clamp(30px,4vw,43px);
        margin:17px 0;
        color:#f7f8ff;
      }

      .pqa-subtitle {
        color:#abbfd5;
        margin-bottom:30px;
      }

      .pqa-panel {
        border:1px solid #315678;
        border-radius:20px;
        background:linear-gradient(145deg,#182943,#101d33);
        padding:26px;
        margin-bottom:20px;
      }

      .pqa-panel h2 {
        color:#f4f8ff;
        margin-top:0;
      }

      .pqa-grid {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:18px;
      }

      .pqa-field label {
        display:block;
        font-weight:700;
        color:#c5d8eb;
        font-size:13px;
        margin-bottom:9px;
      }

      .pqa-field select {
        width:100%;
        padding:14px;
        background:#102c48;
        border:1px solid #3c7095;
        border-radius:10px;
        color:#fff;
        font-size:14px;
      }

      .pqa-btn {
        background:linear-gradient(90deg,#158aff,#2b61dc);
        border:1px solid #60b9ff;
        border-radius:10px;
        padding:12px 22px;
        color:white;
        font-size:14px;
        font-weight:800;
        cursor:pointer;
      }

      .pqa-btn:hover {filter:brightness(1.12)}

      .pqa-btn:disabled {
        opacity:.45;
        cursor:not-allowed;
      }

      .pqa-secondary {
        background:#244766;
        border-color:#497a9c;
      }

      .pqa-actions {
        margin-top:22px;
        display:flex;
        gap:12px;
        flex-wrap:wrap;
      }

      .pqa-stats {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:12px;
        margin:20px 0;
      }

      .pqa-stat {
        border:1px solid #316083;
        border-radius:12px;
        background:#102e4d;
        padding:17px;
      }

      .pqa-stat small {
        display:block;
        color:#bbd1e5;
        font-size:12px;
      }

      .pqa-stat strong {
        display:block;
        margin-top:12px;
        color:#49e6f3;
        font-size:24px;
      }

      .pqa-header {
        display:flex;
        justify-content:space-between;
        gap:12px;
        flex-wrap:wrap;
        color:#b6cee2;
        font-size:13px;
      }

      .pqa-progress {
        height:10px;
        background:#253b5a;
        border-radius:99px;
        overflow:hidden;
        margin:18px 0 28px;
      }

      .pqa-progress-fill {
        height:100%;
        width:0%;
        background:linear-gradient(90deg,#13cbb9,#3a94ff);
        transition:width .25s;
      }

      .pqa-question {
        color:#f4f7ff;
        font-size:clamp(19px,2.3vw,25px);
        line-height:1.5;
        margin-bottom:23px;
      }

      .pqa-answers {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:12px;
      }

      .pqa-answer {
        min-height:75px;
        padding:17px;
        background:#192a46;
        border:1px solid #304b70;
        border-radius:12px;
        text-align:left;
        color:#f0f6ff;
        font-size:14px;
        cursor:pointer;
      }

      .pqa-answer:hover:not(:disabled) {
        border-color:#48b6ed;
        background:#203e60;
      }

      .pqa-answer.correct {
        background:#145946;
        border-color:#36e4a4;
      }

      .pqa-answer.wrong {
        background:#683147;
        border-color:#ff718b;
      }

      .pqa-answer:disabled {cursor:default}

      .pqa-feedback {
        padding:16px;
        margin-top:20px;
        border-radius:12px;
        line-height:1.6;
        background:#11334e;
        color:#d9f1ff;
        white-space:pre-wrap;
      }

      .pqa-hidden {display:none !important}

      .pqa-result-score {
        font-size:55px;
        font-weight:900;
        color:#56efdb;
        margin:12px 0;
      }

      .pqa-history {
        display:grid;
        gap:10px;
      }

      .pqa-history-item {
        padding:13px;
        background:#102a44;
        border:1px solid #305576;
        border-radius:10px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        flex-wrap:wrap;
      }

      .pqa-muted {
        font-size:12px;
        color:#a7bed4;
      }

      @media(max-width:650px) {
        .pqa-grid,.pqa-answers {
          grid-template-columns:1fr;
        }

        .pqa-panel {padding:17px}

        .pqa-stats {
          grid-template-columns:repeat(3,minmax(0,1fr));
        }

        .pqa-stat {padding:11px}

        .pqa-stat strong {font-size:20px}
      }
    `;

    document.head.appendChild(style);
  }

  /* ==================================================
     PAGE SETUP
     ================================================== */

  function installQuizPage() {
    const page = $("quiz");

    if (!page) {
      console.error("Quiz Arena: #quiz page not found");
      return;
    }

    if ($("pqaRoot")) return;

    originalPage = [...page.children].map(node => ({
      node,
      display: node.style.display
    }));

    originalPage.forEach(item => {
      item.node.style.display = "none";
    });

    const root = document.createElement("div");
    root.id = "pqaRoot";

    root.innerHTML = `
      <div class="pqa-eyebrow">
        CHALLENGE YOUR KNOWLEDGE
      </div>

      <h1>Quiz Arena 🧠</h1>

      <p class="pqa-subtitle">
        Test your STEM knowledge, earn points and track your progress.
      </p>

      <section class="pqa-panel" id="pqaSetup">
        <h2>🎯 Create Your Quiz</h2>

        <div class="pqa-grid">
          <div class="pqa-field">
            <label for="pqaSubject">Choose Subject</label>
            <select id="pqaSubject">
              <option value="physics">⚛️ Physics</option>
              <option value="chemistry">🧪 Chemistry</option>
              <option value="biology">🧬 Biology</option>
              <option value="mathematics">🔢 Mathematics</option>
            </select>
          </div>

          <div class="pqa-field">
            <label for="pqaClass">Class Level</label>
            <select id="pqaClass">
              <option value="1–5">Classes 1–5</option>
              <option value="6–8">Classes 6–8</option>
              <option value="9–10">Classes 9–10</option>
              <option value="11–12">Classes 11–12</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div class="pqa-field">
            <label for="pqaDifficulty">Difficulty</label>
            <select id="pqaDifficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div class="pqa-field">
            <label for="pqaTimeMode">Timer</label>
            <select id="pqaTimeMode">
              <option value="600">10 minutes</option>
              <option value="300">5 minutes</option>
              <option value="900">15 minutes</option>
              <option value="0">No time limit</option>
            </select>
          </div>
        </div>

        <p class="pqa-muted" style="margin-top:17px">
          10 questions per quiz · Offline question bank ·
          Choose your difficulty after selecting a class level
        </p>

        <div class="pqa-actions">
          <button class="pqa-btn" id="pqaStart">
            ▶ Start Quiz
          </button>
        </div>
      </section>

      <section class="pqa-panel pqa-hidden" id="pqaGame">
        <div class="pqa-header">
          <span id="pqaQuestionNumber">Question 1 of 10</span>
          <span id="pqaCorrect">Correct: 0</span>
          <span id="pqaTimer">⏱ 10:00</span>
        </div>

        <div class="pqa-progress">
          <div class="pqa-progress-fill"
               id="pqaProgressFill"></div>
        </div>

        <p class="pqa-muted" id="pqaTopic"></p>
        <h2 class="pqa-question" id="pqaQuestion"></h2>

        <div class="pqa-answers" id="pqaAnswers"></div>

        <div class="pqa-feedback pqa-hidden"
             id="pqaFeedback"></div>

        <div class="pqa-actions">
          <button class="pqa-btn" id="pqaNext" disabled>
            Next Question →
          </button>

          <button class="pqa-btn pqa-secondary"
                  id="pqaRestart">
            ↻ Restart Quiz
          </button>

          <button class="pqa-btn pqa-secondary"
                  id="pqaQuit">
            Exit Quiz
          </button>
        </div>
      </section>

      <section class="pqa-panel pqa-hidden" id="pqaResult">
        <h2>🏆 Quiz Completed!</h2>

        <p id="pqaResultSubject"></p>

        <div class="pqa-result-score" id="pqaScore">
          0/10
        </div>

        <p id="pqaResultMessage"></p>

        <div class="pqa-stats">
          <div class="pqa-stat">
            <small>Correct</small>
            <strong id="pqaFinalCorrect">0</strong>
          </div>

          <div class="pqa-stat">
            <small>Accuracy</small>
            <strong id="pqaAccuracy">0%</strong>
          </div>

          <div class="pqa-stat">
            <small>Points Earned</small>
            <strong id="pqaPoints">0</strong>
          </div>
        </div>

        <div id="pqaAchievement"></div>

        <div class="pqa-actions">
          <button class="pqa-btn" id="pqaTryAgain">
            ↻ Try Again
          </button>

          <button class="pqa-btn pqa-secondary"
                  id="pqaNewQuiz">
            Choose New Quiz
          </button>
        </div>
      </section>

      <section class="pqa-panel" id="pqaHistoryPanel">
        <h2>📊 Your Quiz Progress</h2>

        <div class="pqa-stats">
          <div class="pqa-stat">
            <small>Quizzes Completed</small>
            <strong id="pqaTotalQuizzes">0</strong>
          </div>

          <div class="pqa-stat">
            <small>Total Points</small>
            <strong id="pqaTotalPoints">0</strong>
          </div>

          <div class="pqa-stat">
            <small>Best Score</small>
            <strong id="pqaBestScore">0/10</strong>
          </div>
        </div>

        <h3>Recent Attempts</h3>
        <div class="pqa-history" id="pqaHistory"></div>
      </section>
    `;

    page.appendChild(root);

    $("pqaStart").addEventListener("click", startQuiz);
    $("pqaNext").addEventListener("click", nextQuestion);
    $("pqaRestart").addEventListener("click", restartQuiz);
    $("pqaQuit").addEventListener("click", exitQuiz);
    $("pqaTryAgain").addEventListener("click", restartQuiz);
    $("pqaNewQuiz").addEventListener("click", exitQuiz);

    $("pqaClass").addEventListener("change", () => {
      const grade = $("pqaClass").value;

      const suggested = {
        "1–5": "easy",
        "6–8": "easy",
        "9–10": "medium",
        "11–12": "hard",
        "Advanced": "hard"
      };

      $("pqaDifficulty").value = suggested[grade];
    });

    renderHistory();
  }

  /* ==================================================
     QUIZ START
     ================================================== */

  function startQuiz() {
    clearTimer();

    const subject = $("pqaSubject").value;
    const grade = $("pqaClass").value;
    const difficulty = $("pqaDifficulty").value;
    const duration = Number($("pqaTimeMode").value);

    const source = BANK[subject]?.[difficulty];

    if (!source || source.length < 10) {
      alert("Not enough questions are available.");
      return;
    }

    const questions = shuffle(source).slice(0, 10).map(row => ({
      question: row[0],
      correct: row[1],
      explanation: row[5],
      choices: shuffle(row.slice(1, 5))
    }));

    session = {
      subject,
      grade,
      difficulty,
      duration,
      remaining: duration,
      questions,
      index: 0,
      correct: 0,
      answered: false,
      finished: false,
      answers: []
    };

    $("pqaSetup").classList.add("pqa-hidden");
    $("pqaResult").classList.add("pqa-hidden");
    $("pqaGame").classList.remove("pqa-hidden");
    $("pqaHistoryPanel").classList.add("pqa-hidden");

    displayQuestion();
    updateTimer();

    if (duration > 0) {
      timerId = setInterval(() => {
        if (!session || session.finished) {
          clearTimer();
          return;
        }

        session.remaining = Math.max(
          0, session.remaining - 1
        );

        updateTimer();

        if (session.remaining === 0) {
          finishQuiz(true);
        }
      }, 1000);
    }
  }

  function clearTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function updateTimer() {
    if (!session) return;

    if (session.duration === 0) {
      $("pqaTimer").textContent = "⏱ Untimed";
      return;
    }

    const minutes = Math.floor(session.remaining / 60);
    const seconds = session.remaining % 60;

    $("pqaTimer").textContent =
      "⏱ " +
      String(minutes).padStart(2, "0") + ":" +
      String(seconds).padStart(2, "0");
  }

  /* ==================================================
     DISPLAY A QUESTION
     ================================================== */

  function displayQuestion() {
    if (!session || session.finished) return;

    const s = session;
    const q = s.questions[s.index];

    s.answered = false;

    $("pqaQuestionNumber").textContent =
      `Question ${s.index + 1} of 10`;

    $("pqaCorrect").textContent =
      "Correct: " + s.correct;

    $("pqaTopic").textContent =
      SUBJECTS[s.subject].name + " • " +
      s.grade + " • " +
      s.difficulty.toUpperCase();

    $("pqaQuestion").textContent = q.question;

    $("pqaProgressFill").style.width =
      ((s.index / 10) * 100) + "%";

    $("pqaFeedback").textContent = "";
    $("pqaFeedback").classList.add("pqa-hidden");

    $("pqaNext").disabled = true;
    $("pqaNext").textContent =
      s.index === 9 ? "View Results →" : "Next Question →";

    const container = $("pqaAnswers");
    container.innerHTML = "";

    q.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = "pqa-answer";
      button.type = "button";

      button.textContent =
        "ABCD"[index] + ". " + choice;

      button.addEventListener("click", () => {
        selectAnswer(choice, button);
      });

      container.appendChild(button);
    });
  }

  /* ==================================================
     ANSWER FEEDBACK
     ================================================== */

  function selectAnswer(answer, selectedButton) {
    if (!session || session.finished || session.answered) {
      return;
    }

    const s = session;
    const q = s.questions[s.index];

    s.answered = true;

    const correct = answer === q.correct;

    if (correct) s.correct++;

    s.answers.push({
      question: q.question,
      chosen: answer,
      correct: q.correct,
      isCorrect: correct
    });

    $("pqaCorrect").textContent = "Correct: " + s.correct;

    const feedback = $("pqaFeedback");
    feedback.classList.remove("pqa-hidden");

    feedback.textContent =
      (correct ? "✅ Correct answer!" :
        "❌ Incorrect answer.") +
      "\n\nCorrect Answer: " + q.correct +
      "\n\nExplanation: " + q.explanation;

    $("pqaAnswers")
      .querySelectorAll("button")
      .forEach(button => {
        button.disabled = true;

        const text = button.textContent.slice(3);

        if (text === q.correct) {
          button.classList.add("correct");
        } else if (button === selectedButton) {
          button.classList.add("wrong");
        }
      });

    $("pqaProgressFill").style.width =
      (((s.index + 1) / 10) * 100) + "%";

    $("pqaNext").disabled = false;
  }

  function nextQuestion() {
    if (!session || !session.answered || session.finished) {
      return;
    }

    session.index++;

    if (session.index >= 10) {
      finishQuiz(false);
    } else {
      displayQuestion();
    }
  }

  /* ==================================================
     QUIZ RESULTS
     ================================================== */

  function finishQuiz(timedOut = false) {
    if (!session || session.finished) return;

    clearTimer();

    const s = session;
    s.finished = true;

    const accuracy = Math.round(s.correct / 10 * 100);

    const multiplier = {
      easy: 10,
      medium: 15,
      hard: 20
    }[s.difficulty];

    const points = s.correct * multiplier;

    const record = {
      subject: s.subject,
      grade: s.grade,
      difficulty: s.difficulty,
      correct: s.correct,
      total: 10,
      accuracy,
      points,
      timedOut,
      date: new Date().toISOString()
    };

    saveHistory(record);

    $("pqaGame").classList.add("pqa-hidden");
    $("pqaResult").classList.remove("pqa-hidden");
    $("pqaHistoryPanel").classList.remove("pqa-hidden");

    $("pqaResultSubject").textContent =
      SUBJECTS[s.subject].name + " · " +
      s.grade + " · " +
      s.difficulty.toUpperCase();

    $("pqaScore").textContent = s.correct + "/10";
    $("pqaFinalCorrect").textContent = s.correct;
    $("pqaAccuracy").textContent = accuracy + "%";
    $("pqaPoints").textContent = "+" + points;

    let message;

    if (timedOut) {
      message = "⏰ Time is up! Try again to improve your score.";
    } else if (s.correct === 10) {
      message = "🌟 Outstanding! Perfect score!";
    } else if (s.correct >= 8) {
      message = "🎉 Excellent work!";
    } else if (s.correct >= 5) {
      message = "👍 Good effort! Keep practising.";
    } else {
      message = "📚 Review the explanations and try again.";
    }

    $("pqaResultMessage").textContent = message;

    const achievements = [];

    if (s.correct === 10) {
      achievements.push("🏆 Perfect Score");
    }

    if (s.correct >= 8) {
      achievements.push("⭐ STEM Star");
    }

    if (s.difficulty === "hard" && s.correct >= 7) {
      achievements.push("🔥 Advanced Challenger");
    }

    $("pqaAchievement").textContent =
      achievements.length
        ? "Achievements: " + achievements.join(" · ")
        : "";

    renderHistory();
  }

  function restartQuiz() {
    if (!session) {
      exitQuiz();
      return;
    }

    $("pqaSubject").value = session.subject;
    $("pqaClass").value = session.grade;
    $("pqaDifficulty").value = session.difficulty;
    $("pqaTimeMode").value = String(session.duration);

    startQuiz();
  }

  function exitQuiz() {
    clearTimer();
    session = null;

    $("pqaSetup").classList.remove("pqa-hidden");
    $("pqaGame").classList.add("pqa-hidden");
    $("pqaResult").classList.add("pqa-hidden");
    $("pqaHistoryPanel").classList.remove("pqa-hidden");

    renderHistory();
  }

  /* ==================================================
     OFFLINE HISTORY
     ================================================== */

  function renderHistory() {
    const history = loadHistory();

    $("pqaTotalQuizzes").textContent = history.length;

    const totalPoints = history.reduce(
      (sum, record) => sum + record.points, 0
    );

    $("pqaTotalPoints").textContent = totalPoints;

    const best = Math.max(
      0, ...history.map(record => record.correct)
    );

    $("pqaBestScore").textContent = best + "/10";

    const container = $("pqaHistory");
    container.innerHTML = "";

    if (!history.length) {
      container.innerHTML = `
        <p class="pqa-muted">
          No quiz attempts yet. Start your first challenge!
        </p>
      `;
      return;
    }

    history.slice(0, 6).forEach(record => {
      const item = document.createElement("div");
      item.className = "pqa-history-item";

      const left = document.createElement("div");
      const title = document.createElement("strong");

      title.textContent =
        (SUBJECTS[record.subject]?.icon || "📘") + " " +
        (SUBJECTS[record.subject]?.name || record.subject);

      const detail = document.createElement("div");
      detail.className = "pqa-muted";

      detail.textContent =
        record.grade + " · " +
        record.difficulty + " · " +
        new Date(record.date).toLocaleDateString();

      left.append(title, detail);

      const right = document.createElement("strong");
      right.textContent =
        record.correct + "/10 · +" + record.points + " pts";

      item.append(left, right);
      container.appendChild(item);
    });
  }

  /* ==================================================
     INITIALIZE
     ================================================== */

  function initialize() {
    installStyles();
    installQuizPage();

    console.log(
      "✅ PocketLab Quiz Arena loaded: " +
      "4 subjects, 3 difficulty levels, 10 questions per quiz"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
