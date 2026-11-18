
'use strict';

// ==========================================
// POCKETLAB 2.0 — COMPLETE SCRIPT
// STEM FOR IMPACT 2026
// ==========================================

const STORAGE_KEY = 'pocketlab-progress-v1';
const LEVEL_KEY = 'pocketlab-learning-level';

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const clamp = (n, min, max) =>
  Math.min(max, Math.max(min, n));

const esc = value =>
  String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

// ==========================================
// LEARNING LEVELS
// ==========================================

const LEVELS = {
  primary: {
    name: 'Class 1–5',
    title: 'Little Scientists',
    emoji: '🌱',
    experiment: 'floating'
  },
  middle: {
    name: 'Class 6–8',
    title: 'Young Explorers',
    emoji: '🔬',
    experiment: 'motion'
  },
  secondary: {
    name: 'Class 9–10',
    title: 'STEM Champions',
    emoji: '⚡',
    experiment: 'reflection'
  },
  senior: {
    name: 'Class 11–12',
    title: 'Future Innovators',
    emoji: '🧪',
    experiment: 'projectile'
  },
  college: {
    name: 'College',
    title: 'Advanced Learners',
    emoji: '🎓',
    experiment: 'advancedCircuit'
  }
};

// ==========================================
// NINE VIRTUAL EXPERIMENTS
// ==========================================

const EXPERIMENTS = {
  circuit: {
    title: 'Electric Circuit Simulator',
    description: 'Change voltage and resistance to investigate Ohm’s law.',
    explanation: `
      <p><strong>Ohm's law:</strong> I = V / R.</p>
      <p>Increasing voltage increases current when resistance
      stays constant. Increasing resistance decreases current.</p>
      <p>This is a simplified ideal DC circuit model.</p>`
  },

  ph: {
    title: 'pH Indicator Laboratory',
    description: 'Explore the pH scale using everyday solutions.',
    explanation: `
      <p>The pH scale describes acidity and alkalinity.</p>
      <p>At approximately 25°C, solutions below pH 7 are acidic,
      pH 7 is neutral, and solutions above pH 7 are alkaline.</p>
      <p>The displayed colors approximate a universal indicator.</p>`
  },

  plant: {
    title: 'Plant Growth Simulator',
    description: 'Explore how water and sunlight affect plant growth.',
    explanation: `
      <p>Plants need sunlight, water, air and nutrients to grow.</p>
      <p>Too little water or too much water can reduce growth.</p>
      <p>The displayed growth percentage is illustrative,
      not a prediction of real plant height.</p>`
  },

  graph: {
    title: 'Graph Explorer',
    description: 'Visualize the equation y = ax² + bx + c.',
    explanation: `
      <p><strong>Quadratic function:</strong> y = ax² + bx + c.</p>
      <p>The coefficient a controls curvature and direction.
      The coefficient b affects the vertex position.
      The coefficient c is the y-intercept.</p>
      <p>When a = 0, the graph becomes a straight line.</p>`
  },

  floating: {
    title: 'Floating or Sinking?',
    description: 'Choose an object and see whether it floats or sinks.',
    explanation: `
      <p>Objects float when their average density is lower
      than the density of water.</p>
      <p>Objects with a greater average density usually sink.</p>
      <p>Shape and trapped air can change average density.
      This simulation uses simplified example objects.</p>`
  },

  motion: {
    title: 'Force and Motion Simulator',
    description: 'Change force and mass to investigate acceleration.',
    explanation: `
      <p><strong>Newton's second law:</strong> F = ma.</p>
      <p>Acceleration = Net force / Mass.</p>
      <p>Greater force produces greater acceleration.
      Greater mass produces less acceleration for the same force.</p>
      <p>This ideal model ignores friction and air resistance.</p>`
  },

  reflection: {
    title: 'Light Reflection Simulator',
    description: 'Change the angle of incidence and observe reflection.',
    explanation: `
      <p><strong>Law of reflection:</strong>
      Angle of incidence = Angle of reflection.</p>
      <p>Both angles are measured from the normal,
      an imaginary line perpendicular to the mirror.</p>`
  },

  projectile: {
    title: 'Projectile Motion Simulator',
    description: 'Adjust launch speed and angle to explore a projectile path.',
    explanation: `
      <p>A projectile moves horizontally and vertically
      under the influence of gravity.</p>
      <p>For an ideal projectile landing at its launch height:</p>
      <p><strong>Range:</strong> R = v² sin(2θ) / g</p>
      <p><strong>Maximum height:</strong> H = v² sin²(θ) / (2g)</p>
      <p><strong>Flight time:</strong> T = 2v sin(θ) / g</p>
      <p>Air resistance is ignored. Gravity is 9.81 m/s².</p>`
  },

  advancedCircuit: {
    title: 'Advanced Circuit Analysis',
    description: 'Compare series and parallel resistor circuits.',
    explanation: `
      <p><strong>Series connection:</strong> R = R₁ + R₂.</p>
      <p><strong>Parallel connection:</strong>
      1/R = 1/R₁ + 1/R₂.</p>
      <p><strong>Ohm's law:</strong> I = V/R.</p>
      <p>Series resistors carry the same current.
      Parallel resistors have the same voltage across them.</p>
      <p>This model uses ideal resistors and a DC power source.</p>`
  }
};

// ==========================================
// CLASS-WISE QUIZ QUESTION BANK
// ==========================================

const QUESTIONS = [
  // CLASS 1–5
  {
    level: 'primary',
    subject: 'physics',
    q: 'Which object gives us light during the day?',
    options: ['Moon', 'Sun', 'Book', 'Chair'],
    answer: 1,
    why: 'The Sun provides daylight.'
  },
  {
    level: 'primary',
    subject: 'physics',
    q: 'What happens when we push a toy car?',
    options: [
      'It may move',
      'It becomes water',
      'It disappears',
      'It grows'
    ],
    answer: 0,
    why: 'A push is a force that can make an object move.'
  },
  {
    level: 'primary',
    subject: 'chemistry',
    q: 'Which of these is a liquid?',
    options: ['Stone', 'Water', 'Pencil', 'Brick'],
    answer: 1,
    why: 'Water is a liquid.'
  },
  {
    level: 'primary',
    subject: 'chemistry',
    q: 'What happens when ice becomes warm enough?',
    options: [
      'It melts',
      'It grows leaves',
      'It becomes wood',
      'It glows'
    ],
    answer: 0,
    why: 'Ice melts into liquid water.'
  },
  {
    level: 'primary',
    subject: 'biology',
    q: 'Which part of a plant absorbs water from soil?',
    options: ['Flower', 'Root', 'Fruit', 'Petal'],
    answer: 1,
    why: 'Roots absorb water from soil.'
  },
  {
    level: 'primary',
    subject: 'biology',
    q: 'What do plants need to grow?',
    options: [
      'Only plastic',
      'Water and light',
      'Only stones',
      'Only paper'
    ],
    answer: 1,
    why: 'Plants need water, light, air and nutrients.'
  },
  {
    level: 'primary',
    subject: 'mathematics',
    q: 'What is 5 + 3?',
    options: ['6', '7', '8', '9'],
    answer: 2,
    why: '5 + 3 = 8.'
  },
  {
    level: 'primary',
    subject: 'mathematics',
    q: 'Which shape has three sides?',
    options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
    answer: 2,
    why: 'A triangle has three sides.'
  },

  // CLASS 6–8
  {
    level: 'middle',
    subject: 'physics',
    q: 'What is the SI unit of force?',
    options: ['Newton', 'Joule', 'Watt', 'Volt'],
    answer: 0,
    why: 'Force is measured in newtons.'
  },
  {
    level: 'middle',
    subject: 'physics',
    q: 'Speed is calculated using which formula?',
    options: [
      'Time / distance',
      'Distance / time',
      'Mass × time',
      'Force / area'
    ],
    answer: 1,
    why: 'Speed = Distance / Time.'
  },
  {
    level: 'middle',
    subject: 'chemistry',
    q: 'Which of these is a chemical element?',
    options: ['Water', 'Air', 'Oxygen', 'Salt water'],
    answer: 2,
    why: 'Oxygen is a chemical element.'
  },
  {
    level: 'middle',
    subject: 'chemistry',
    q: 'A solution with pH 3 is...',
    options: ['Acidic', 'Neutral', 'Alkaline', 'Always pure'],
    answer: 0,
    why: 'A pH below 7 indicates an acidic solution.'
  },
  {
    level: 'middle',
    subject: 'biology',
    q: 'Which gas do plants use for photosynthesis?',
    options: [
      'Helium',
      'Carbon dioxide',
      'Neon',
      'Hydrogen'
    ],
    answer: 1,
    why: 'Plants use carbon dioxide during photosynthesis.'
  },
  {
    level: 'middle',
    subject: 'biology',
    q: 'What is the basic unit of life?',
    options: ['Atom', 'Cell', 'Organ', 'Tissue'],
    answer: 1,
    why: 'The cell is the basic unit of life.'
  },
  {
    level: 'middle',
    subject: 'mathematics',
    q: 'What is 25% of 200?',
    options: ['25', '40', '50', '100'],
    answer: 2,
    why: '200 × 25 / 100 = 50.'
  },
  {
    level: 'middle',
    subject: 'mathematics',
    q: 'Solve: 3x = 18.',
    options: ['3', '6', '9', '15'],
    answer: 1,
    why: 'x = 18 / 3 = 6.'
  },

  // CLASS 9–10
  {
    level: 'secondary',
    subject: 'physics',
    q: 'What is the current through a 4 Ω resistor at 12 V?',
    options: ['2 A', '3 A', '4 A', '48 A'],
    answer: 1,
    why: 'I = V / R = 12 / 4 = 3 A.'
  },
  {
    level: 'secondary',
    subject: 'physics',
    q: 'What is the SI unit of electrical resistance?',
    options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
    answer: 2,
    why: 'Resistance is measured in ohms.'
  },
  {
    level: 'secondary',
    subject: 'chemistry',
    q: 'Pure water at 25°C has approximately which pH?',
    options: ['2', '7', '10', '14'],
    answer: 1,
    why: 'Pure water is approximately neutral at pH 7.'
  },
  {
    level: 'secondary',
    subject: 'chemistry',
    q: 'Which particle carries a negative electric charge?',
    options: [
      'Proton',
      'Neutron',
      'Electron',
      'Nucleus'
    ],
    answer: 2,
    why: 'An electron carries negative charge.'
  },
  {
    level: 'secondary',
    subject: 'biology',
    q: 'Which pigment captures light for photosynthesis?',
    options: [
      'Hemoglobin',
      'Melanin',
      'Chlorophyll',
      'Keratin'
    ],
    answer: 2,
    why: 'Chlorophyll absorbs light energy.'
  },
  {
    level: 'secondary',
    subject: 'biology',
    q: 'Which cell structure contains most genetic material?',
    options: [
      'Nucleus',
      'Cell wall',
      'Vacuole',
      'Ribosome'
    ],
    answer: 0,
    why: 'In eukaryotic cells, most DNA is in the nucleus.'
  },
  {
    level: 'secondary',
    subject: 'mathematics',
    q: 'For y = 2x + 3, what is y when x = 4?',
    options: ['7', '8', '11', '14'],
    answer: 2,
    why: '2 × 4 + 3 = 11.'
  },
  {
    level: 'secondary',
    subject: 'mathematics',
    q: 'Which graph represents y = x²?',
    options: [
      'Circle',
      'Parabola',
      'Straight line',
      'Hyperbola'
    ],
    answer: 1,
    why: 'The graph of y = x² is a parabola.'
  },

  // CLASS 11–12
  {
    level: 'senior',
    subject: 'physics',
    q: 'A 6 Ω resistor carries 2 A. What is the voltage?',
    options: ['3 V', '8 V', '12 V', '24 V'],
    answer: 2,
    why: 'V = IR = 2 × 6 = 12 V.'
  },
  {
    level: 'senior',
    subject: 'physics',
    q: 'What is the kinetic energy of a 2 kg body moving at 3 m/s?',
    options: ['3 J', '6 J', '9 J', '18 J'],
    answer: 2,
    why: 'KE = ½mv² = ½ × 2 × 9 = 9 J.'
  },
  {
    level: 'senior',
    subject: 'chemistry',
    q: 'At 25°C, a solution with pH 4 has what pOH?',
    options: ['4', '7', '10', '14'],
    answer: 2,
    why: 'pH + pOH = 14, so pOH = 10.'
  },
  {
    level: 'senior',
    subject: 'chemistry',
    q: 'What is the approximate molar mass of water?',
    options: [
      '10 g/mol',
      '16 g/mol',
      '18 g/mol',
      '20 g/mol'
    ],
    answer: 2,
    why: '2 × 1 + 16 = 18 g/mol.'
  },
  {
    level: 'senior',
    subject: 'biology',
    q: 'Which organelle produces most ATP during aerobic respiration?',
    options: [
      'Ribosome',
      'Mitochondrion',
      'Golgi apparatus',
      'Nucleus'
    ],
    answer: 1,
    why: 'Mitochondria produce most ATP during aerobic respiration.'
  },
  {
    level: 'senior',
    subject: 'biology',
    q: 'Which enzyme synthesizes DNA during replication?',
    options: [
      'Amylase',
      'DNA polymerase',
      'Lipase',
      'Pepsin'
    ],
    answer: 1,
    why: 'DNA polymerase adds nucleotides to a DNA strand.'
  },
  {
    level: 'senior',
    subject: 'mathematics',
    q: 'What is the derivative of x³?',
    options: ['x²', '2x', '3x²', '3x'],
    answer: 2,
    why: 'Using the power rule, d(x³)/dx = 3x².'
  },
  {
    level: 'senior',
    subject: 'mathematics',
    q: 'What are the roots of x² - 5x + 6 = 0?',
    options: [
      '1 and 6',
      '2 and 3',
      '-2 and -3',
      '0 and 5'
    ],
    answer: 1,
    why: '(x - 2)(x - 3) = 0.'
  },

  // COLLEGE
  {
    level: 'college',
    subject: 'physics',
    q: 'If voltage doubles at constant resistance, power becomes...',
    options: [
      'Half',
      'Double',
      'Four times',
      'Unchanged'
    ],
    answer: 2,
    why: 'P = V²/R, so power becomes four times larger.'
  },
  {
    level: 'college',
    subject: 'physics',
    q: 'What is the time constant of an RC circuit?',
    options: ['R/C', 'RC', 'C/R', '1/RC'],
    answer: 1,
    why: 'The time constant is τ = RC.'
  },
  {
    level: 'college',
    subject: 'chemistry',
    q: 'A pH 3 solution has how many times the hydrogen ion activity of pH 5?',
    options: ['2', '10', '100', '1000'],
    answer: 2,
    why: 'Two pH units correspond to a factor of 100.'
  },
  {
    level: 'college',
    subject: 'chemistry',
    q: 'For a first-order reaction, the half-life is...',
    options: [
      'k/0.693',
      '0.693/k',
      '1/k²',
      '2k'
    ],
    answer: 1,
    why: 'First-order half-life is approximately 0.693/k.'
  },
  {
    level: 'college',
    subject: 'biology',
    q: 'Which enzyme synthesizes RNA from a DNA template?',
    options: [
      'DNA ligase',
      'RNA polymerase',
      'Amylase',
      'Helicase'
    ],
    answer: 1,
    why: 'RNA polymerase carries out transcription.'
  },
  {
    level: 'college',
    subject: 'biology',
    q: 'Which process generates ATP using a proton gradient?',
    options: [
      'Osmosis',
      'Chemiosmosis',
      'Diffusion alone',
      'Transcription'
    ],
    answer: 1,
    why: 'ATP synthase uses the proton gradient during chemiosmosis.'
  },
  {
    level: 'college',
    subject: 'mathematics',
    q: 'What is the derivative of sin(x²)?',
    options: [
      'cos(x²)',
      '2x cos(x²)',
      '2 sin(x)',
      'x cos(x)'
    ],
    answer: 1,
    why: 'The chain rule gives 2x cos(x²).'
  },
  {
    level: 'college',
    subject: 'mathematics',
    q: 'What is the determinant of [[2, 3], [1, 4]]?',
    options: ['5', '8', '11', '-5'],
    answer: 0,
    why: 'The determinant is 2 × 4 - 3 × 1 = 5.'
  }
];

// ==========================================
// SAVED PROGRESS
// ==========================================

function loadProgress() {
  try {
    const raw = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}'
    );

    return {
      completed: Array.isArray(raw.completed)
        ? [...new Set(
            raw.completed.filter(key => EXPERIMENTS[key])
          )]
        : [],
      points: Number.isFinite(raw.points)
        ? Math.max(0, Math.floor(raw.points))
        : 0,
      quizzes: Number.isFinite(raw.quizzes)
        ? Math.max(0, Math.floor(raw.quizzes))
        : 0,
      perfectQuiz: raw.perfectQuiz === true
    };
  } catch {
    return {
      completed: [],
      points: 0,
      quizzes: 0,
      perfectQuiz: false
    };
  }
}

function loadLevel() {
  try {
    const saved = localStorage.getItem(LEVEL_KEY);
    return LEVELS[saved] ? saved : 'secondary';
  } catch {
    return 'secondary';
  }
}

let progress = loadProgress();
let currentLevel = loadLevel();

let currentExperiment = null;
let experimentState = {};

let quizQuestions = [];
let quizIndex = 0;
let quizCorrect = 0;
let quizAnswered = false;

let toastTimeout = null;

function saveProgress() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress)
    );
  } catch {
    showToast('Unable to save progress in this browser.');
  }

  updateDashboard();
}

// ==========================================
// CLASS SELECTION
// ==========================================

function selectLevel(level) {
  if (!LEVELS[level]) return;

  currentLevel = level;

  try {
    localStorage.setItem(LEVEL_KEY, level);
  } catch {
    showToast('Class selection could not be saved.');
  }

  updateLevelDisplay();
  resetQuiz();

  showToast(
    `${LEVELS[level].emoji} ${LEVELS[level].name} selected!`
  );
}

function updateLevelDisplay() {
  $$('[data-level]').forEach(card => {
    const selected =
      card.dataset.level === currentLevel;

    card.classList.toggle('selected', selected);
    card.setAttribute(
      'aria-pressed',
      String(selected)
    );
  });

  const level = LEVELS[currentLevel];

  const message = $('#selectedLevelMessage');

  if (message) {
    message.textContent =
      `${level.emoji} Selected: ${level.name} — ${level.title}`;
  }

  const quizInfo = $('#quizLevelInfo');

  if (quizInfo) {
    quizInfo.textContent =
      `Questions for ${level.name} — ${level.title}`;
  }

  const labInfo = $('#labLevelMessage');

  if (labInfo) {
    labInfo.textContent =
      `Recommended for ${level.name}: ` +
      `${EXPERIMENTS[level.experiment].title}. ` +
      `All nine experiments are available.`;
  }

  $$('.experiment-card').forEach(card => {
    const recommended = (
      card.dataset.recommended || ''
    ).split(/\s+/);

    card.classList.toggle(
      'recommended-experiment',
      recommended.includes(currentLevel)
    );
  });
}

// ==========================================
// ACHIEVEMENTS
// ==========================================

function badges() {
  return {
    firstExperiment:
      progress.completed.length >= 1,

    scientist:
      ['circuit', 'ph', 'plant', 'graph']
        .every(key => progress.completed.includes(key)),

    quizMaster:
      progress.perfectQuiz,

    explorer:
      progress.points >= 200
  };
}

function updateDashboard() {
  const earned = Object.values(badges())
    .filter(Boolean).length;

  const values = {
    experimentsCount: progress.completed.length,
    pointsCount: progress.points,
    badgesCount: earned,
    quizzesCount: progress.quizzes,
    achievementPoints: progress.points,
    achievementBadgeCount: `${earned} / 4`
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  });

  $$('.badge-card').forEach(card => {
    const unlocked = Boolean(
      badges()[card.dataset.badge]
    );

    card.classList.toggle('locked', !unlocked);
    card.classList.toggle('unlocked', unlocked);

    const status = $('.badge-status', card);

    if (status) {
      status.textContent =
        unlocked ? '✓ Unlocked' : 'Locked';
    }
  });
}

function showToast(message) {
  const element = $('#toast');

  if (!element) return;

  element.textContent = message;
  element.classList.remove('hidden');

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    element.classList.add('hidden');
  }, 3500);
}

// ==========================================
// NAVIGATION
// ==========================================

function navigate(page) {
  const target = document.getElementById(page);

  if (!target || !target.classList.contains('page')) {
    return;
  }

  $$('.page').forEach(element => {
    element.classList.toggle(
      'active',
      element === target
    );
  });

  $$('.nav-item').forEach(element => {
    element.classList.toggle(
      'active',
      element.dataset.page === page ||
      (
        page === 'experimentWorkspace' &&
        element.dataset.page === 'laboratory'
      )
    );
  });

  const titles = {
    dashboard: 'Dashboard',
    laboratory: 'Virtual Laboratory',
    experimentWorkspace: 'Experiment',
    subjects: 'STEM Subjects',
    quiz: 'Quiz Arena',
    achievements: 'Achievements'
  };

  const title = $('#pageTitle');

  if (title) {
    title.textContent = titles[page] || 'PocketLab';
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function filterExperiments(subject = 'all') {
  const filter = $('#experimentFilter');

  if (filter) {
    filter.value = subject;
  }

  $$('.experiment-card').forEach(card => {
    const hidden =
      subject !== 'all' &&
      card.dataset.category !== subject;

    card.classList.toggle('hidden', hidden);
  });
}

function setConnectionStatus() {
  const label = $('#connectionStatus');
  const dot = $('.status-dot');

  if (label) {
    label.textContent =
      navigator.onLine ? 'Online' : 'Offline mode';
  }

  if (dot) {
    dot.style.background =
      navigator.onLine
        ? 'var(--green, #39d9a0)'
        : 'var(--orange, #ffb65c)';
  }
}

// ==========================================
// EXPERIMENT CONTROL HELPERS
// ==========================================

function controlRange(
  id,
  label,
  min,
  max,
  value,
  step = 1,
  unit = ''
) {
  return `
    <div class="control-group">
      <label for="${id}">
        ${label}:
        <span class="control-value" id="${id}Value">
          ${value}${unit}
        </span>
      </label>
      <input
        type="range"
        id="${id}"
        min="${min}"
        max="${max}"
        step="${step}"
        value="${value}"
      >
    </div>
  `;
}

function controlSelect(id, label, options) {
  return `
    <div class="control-group">
      <label for="${id}">${label}</label>
      <select id="${id}">
        ${options.map(option => `
          <option value="${esc(option.value)}">
            ${esc(option.label)}
          </option>
        `).join('')}
      </select>
    </div>
  `;
}

const CONTROL_UNITS = {
  voltage: ' V',
  resistance: ' Ω',
  sunlight: '%',
  water: '%',
  force: ' N',
  mass: ' kg',
  angle: '°',
  speed: ' m/s',
  r1: ' Ω',
  r2: ' Ω'
};

function setControlValue(id, value) {
  const output = document.getElementById(
    `${id}Value`
  );

  if (output) {
    output.textContent =
      `${value}${CONTROL_UNITS[id] || ''}`;
  }
}

// ==========================================
// START AN EXPERIMENT
// ==========================================

function startExperiment(key) {
  if (!EXPERIMENTS[key]) return;

  currentExperiment = key;

  $('#activeExperimentTitle').textContent =
    EXPERIMENTS[key].title;

  $('#activeExperimentDescription').textContent =
    EXPERIMENTS[key].description;

  $('#experimentExplanation').innerHTML =
    EXPERIMENTS[key].explanation;

  const completeButton = $('#completeExperiment');

  completeButton.disabled = false;

  completeButton.textContent =
    progress.completed.includes(key)
      ? 'Experiment Completed ✓'
      : 'Complete Experiment ✓';

  const controls = $('#experimentControls');

  // ORIGINAL ELECTRIC CIRCUIT
  if (key === 'circuit') {
    experimentState = {
      voltage: 9,
      resistance: 6
    };

    controls.innerHTML =
      controlRange(
        'voltage', 'Voltage',
        0, 24, 9, 1, ' V'
      ) +
      controlRange(
        'resistance', 'Resistance',
        1, 30, 6, 1, ' Ω'
      );

  // ORIGINAL pH LAB
  } else if (key === 'ph') {
    experimentState = {
      solution: 'water'
    };

    controls.innerHTML = controlSelect(
      'solution',
      'Choose a solution',
      [
        { value: 'water', label: 'Pure water' },
        { value: 'lemon', label: 'Lemon juice' },
        { value: 'vinegar', label: 'Vinegar' },
        {
          value: 'baking',
          label: 'Baking soda solution'
        },
        { value: 'soap', label: 'Soapy water' }
      ]
    );

  // ORIGINAL PLANT LAB
  } else if (key === 'plant') {
    experimentState = {
      sunlight: 70,
      water: 60
    };

    controls.innerHTML =
      controlRange(
        'sunlight', 'Sunlight',
        0, 100, 70, 5, '%'
      ) +
      controlRange(
        'water', 'Water',
        0, 100, 60, 5, '%'
      );

  // ORIGINAL GRAPH LAB
  } else if (key === 'graph') {
    experimentState = {
      a: 1,
      b: 0,
      c: 0
    };

    controls.innerHTML =
      controlRange(
        'a', 'Coefficient a',
        -3, 3, 1, 0.5
      ) +
      controlRange(
        'b', 'Coefficient b',
        -5, 5, 0, 0.5
      ) +
      controlRange(
        'c', 'Coefficient c',
        -5, 5, 0, 0.5
      );

  // FLOATING OR SINKING
  } else if (key === 'floating') {
    experimentState = {
      object: 'wood'
    };

    controls.innerHTML = controlSelect(
      'object',
      'Choose an object',
      [
        { value: 'wood', label: 'Wooden block' },
        { value: 'stone', label: 'Stone' },
        { value: 'cork', label: 'Cork' },
        { value: 'coin', label: 'Metal coin' },
        { value: 'ice', label: 'Ice cube' }
      ]
    );

  // FORCE AND MOTION
  } else if (key === 'motion') {
    experimentState = {
      force: 20,
      mass: 5
    };

    controls.innerHTML =
      controlRange(
        'force', 'Net force',
        0, 100, 20, 5, ' N'
      ) +
      controlRange(
        'mass', 'Vehicle mass',
        1, 20, 5, 1, ' kg'
      );

  // LIGHT REFLECTION
  } else if (key === 'reflection') {
    experimentState = {
      angle: 35
    };

    controls.innerHTML = controlRange(
      'angle',
      'Angle of incidence',
      0, 80, 35, 5, '°'
    );

  // PROJECTILE MOTION
  } else if (key === 'projectile') {
    experimentState = {
      speed: 20,
      angle: 45
    };

    controls.innerHTML =
      controlRange(
        'speed', 'Launch speed',
        5, 50, 20, 1, ' m/s'
      ) +
      controlRange(
        'angle', 'Launch angle',
        5, 85, 45, 5, '°'
      );

  // ADVANCED CIRCUIT
  } else if (key === 'advancedCircuit') {
    experimentState = {
      configuration: 'series',
      voltage: 12,
      r1: 6,
      r2: 6
    };

    controls.innerHTML =
      controlSelect(
        'configuration',
        'Circuit connection',
        [
          { value: 'series', label: 'Series' },
          { value: 'parallel', label: 'Parallel' }
        ]
      ) +
      controlRange(
        'voltage', 'Supply voltage',
        1, 24, 12, 1, ' V'
      ) +
      controlRange(
        'r1', 'Resistor R1',
        1, 30, 6, 1, ' Ω'
      ) +
      controlRange(
        'r2', 'Resistor R2',
        1, 30, 6, 1, ' Ω'
      );
  }

  // UPDATE SIMULATION WHEN CONTROLS CHANGE
  $$('input, select', controls).forEach(input => {
    const update = () => {
      experimentState[input.id] =
        input.type === 'range'
          ? Number(input.value)
          : input.value;

      if (input.type === 'range') {
        setControlValue(input.id, input.value);
      }

      renderExperiment();
    };

    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });

  renderExperiment();
  navigate('experimentWorkspace');
}

// ==========================================
// RENDER INTERACTIVE SIMULATIONS
// ==========================================

function renderExperiment() {
  const canvas = $('#simulationCanvas');
  const results = $('#experimentResults');
  const s = experimentState;

  if (!canvas || !results) return;

  // ========================================
  // 1. ELECTRIC CIRCUIT
  // ========================================

  if (currentExperiment === 'circuit') {
    const current = s.voltage / s.resistance;
    const power = s.voltage * current;
    const brightness = clamp(power / 60, 0, 1);
    const glow = Math.round(brightness * 45);

    canvas.innerHTML = `
      <div
        class="simulation-emoji"
        style="
          opacity:${0.25 + brightness * 0.75};
          filter:drop-shadow(
            0 0 ${glow}px rgba(255,220,70,.95)
          );
        "
      >💡</div>

      <h3 class="simulation-title">
        Simple DC Circuit
      </h3>

      <svg
        viewBox="0 0 360 140"
        width="100%"
        style="max-width:420px"
        role="img"
        aria-label="Electric circuit with battery and resistor"
      >
        <path
          d="M45 30 H315 V110 H45 Z"
          fill="none"
          stroke="#66dbe9"
          stroke-width="4"
        />

        <rect
          x="145" y="17"
          width="70" height="26"
          rx="5"
          fill="#806dff"
        />

        <text
          x="180" y="35"
          text-anchor="middle"
          fill="white"
          font-size="13"
        >${s.resistance} Ω</text>

        <circle
          cx="315" cy="70" r="18"
          fill="#1c2940"
          stroke="#ffd568"
          stroke-width="3"
        />

        <text
          x="315" y="76"
          text-anchor="middle"
          fill="#ffd568"
          font-size="20"
        >✦</text>

        <rect
          x="25" y="55"
          width="40" height="30"
          rx="4"
          fill="#31b89b"
        />

        <text
          x="45" y="74"
          text-anchor="middle"
          fill="white"
          font-size="11"
        >${s.voltage}V</text>
      </svg>

      <div class="simulation-reading">
        ${current.toFixed(2)} A
      </div>

      <p class="simulation-description">
        Bulb glow illustrates electrical power.
      </p>
    `;

    results.innerHTML = `
      <strong>Voltage:</strong> ${s.voltage} V<br>
      <strong>Resistance:</strong> ${s.resistance} Ω<br>
      <strong>Current:</strong> ${current.toFixed(2)} A<br>
      <strong>Power:</strong> ${power.toFixed(2)} W<br>
      <strong>Formula:</strong> I = V / R
    `;

  // ========================================
  // 2. pH INDICATOR
  // ========================================

  } else if (currentExperiment === 'ph') {
    const solutions = {
      lemon: {
        name: 'Lemon juice',
        ph: 2,
        color: '#f24852'
      },
      vinegar: {
        name: 'Vinegar',
        ph: 3,
        color: '#ff8545'
      },
      water: {
        name: 'Pure water',
        ph: 7,
        color: '#51bd71'
      },
      baking: {
        name: 'Baking soda solution',
        ph: 8.5,
        color: '#3fabc8'
      },
      soap: {
        name: 'Soapy water',
        ph: 10,
        color: '#536fe5'
      }
    };

    const solution = solutions[s.solution];

    const kind =
      solution.ph < 7
        ? 'Acidic'
        : solution.ph > 7
          ? 'Alkaline'
          : 'Neutral';

    canvas.innerHTML = `
      <div class="simulation-emoji">🧪</div>

      <div class="ph-indicator">
        <div
          class="ph-liquid"
          style="background:${solution.color}"
        ></div>
      </div>

      <h3 class="simulation-title">
        ${esc(solution.name)}
      </h3>

      <div class="simulation-reading">
        pH ${solution.ph}
      </div>

      <div class="ph-scale"></div>

      <p class="simulation-description">
        Approximate universal-indicator color
      </p>
    `;

    results.innerHTML = `
      <strong>Solution:</strong>
      ${esc(solution.name)}<br>

      <strong>Approximate pH:</strong>
      ${solution.ph}<br>

      <strong>Classification:</strong>
      ${kind}
    `;

  // ========================================
  // 3. PLANT GROWTH
  // ========================================

  } else if (currentExperiment === 'plant') {
    const lightFactor =
      clamp(s.sunlight / 70, 0, 1);

    const waterFactor =
      clamp(
        1 - Math.abs(s.water - 60) / 60,
        0,
        1
      );

    const growth = Math.round(
      100 * lightFactor * waterFactor
    );

    const emoji =
      growth < 25
        ? '🌰'
        : growth < 55
          ? '🌱'
          : growth < 80
            ? '🪴'
            : '🌿';

    canvas.innerHTML = `
      <div
        class="plant-visual"
        style="transform:scale(${0.7 + growth / 180})"
      >${emoji}</div>

      <h3 class="simulation-title">
        Virtual Plant Growth
      </h3>

      <div class="simulation-reading">
        ${growth}%
      </div>

      <p class="simulation-description">
        Illustrative growth potential
      </p>

      <div
        class="progress-track"
        style="width:80%;margin-top:20px"
      >
        <div
          class="progress-fill"
          style="width:${growth}%"
        ></div>
      </div>
    `;

    results.innerHTML = `
      <strong>Sunlight:</strong>
      ${s.sunlight}%<br>

      <strong>Water:</strong>
      ${s.water}%<br>

      <strong>Model growth potential:</strong>
      ${growth}%
    `;

  // ========================================
  // 4. GRAPH EXPLORER
  // ========================================

  } else if (currentExperiment === 'graph') {
    const W = 540;
    const H = 320;
    const scale = 25;
    const cx = W / 2;
    const cy = H / 2;

    let path = '';

    for (let px = 0; px <= W; px += 2) {
      const x = (px - cx) / scale;
      const y =
        s.a * x * x +
        s.b * x +
        s.c;

      const py = cy - y * scale;

      path += `${
        px === 0 ? 'M' : 'L'
      }${px.toFixed(1)},${
        clamp(py, -10000, 10000).toFixed(1)
      } `;
    }

    let grid = '';

    for (let x = 0; x <= W; x += scale) {
      grid += `
        <line
          x1="${x}" y1="0"
          x2="${x}" y2="${H}"
          stroke="#243550"
          stroke-width="1"
        />
      `;
    }

    for (let y = 0; y <= H; y += scale) {
      grid += `
        <line
          x1="0" y1="${y}"
          x2="${W}" y2="${y}"
          stroke="#243550"
          stroke-width="1"
        />
      `;
    }

    canvas.innerHTML = `
      <svg
        class="graph-canvas"
        viewBox="0 0 ${W} ${H}"
        role="img"
        aria-label="Graph of selected equation"
      >
        <defs>
          <clipPath id="graphClip">
            <rect width="${W}" height="${H}"/>
          </clipPath>
        </defs>

        ${grid}

        <line
          x1="${cx}" y1="0"
          x2="${cx}" y2="${H}"
          stroke="#93a3bc"
          stroke-width="2"
        />

        <line
          x1="0" y1="${cy}"
          x2="${W}" y2="${cy}"
          stroke="#93a3bc"
          stroke-width="2"
        />

        <path
          d="${path}"
          fill="none"
          stroke="#40e3ed"
          stroke-width="3"
          clip-path="url(#graphClip)"
        />
      </svg>

      <div class="simulation-reading">
        y = ${s.a}x²
        ${s.b < 0 ? '-' : '+'}
        ${Math.abs(s.b)}x
        ${s.c < 0 ? '-' : '+'}
        ${Math.abs(s.c)}
      </div>
    `;

    results.innerHTML = `
      <strong>y-intercept:</strong>
      (0, ${s.c})<br>

      <strong>y at x = 1:</strong>
      ${(s.a + s.b + s.c).toFixed(2)}<br>

      <strong>Shape:</strong>
      ${
        s.a === 0
          ? 'Straight line'
          : s.a > 0
            ? 'Upward parabola'
            : 'Downward parabola'
      }
    `;

  // ========================================
  // 5. FLOATING OR SINKING
  // ========================================

  } else if (currentExperiment === 'floating') {
    const objects = {
      wood: {
        name: 'Wooden block',
        density: 650,
        emoji: '🪵',
        color: '#b18b52'
      },
      stone: {
        name: 'Stone',
        density: 2600,
        emoji: '🪨',
        color: '#8e9bac'
      },
      cork: {
        name: 'Cork',
        density: 240,
        emoji: '🟤',
        color: '#c49a62'
      },
      coin: {
        name: 'Metal coin',
        density: 8900,
        emoji: '🪙',
        color: '#e5b84e'
      },
      ice: {
        name: 'Ice cube',
        density: 917,
        emoji: '🧊',
        color: '#bdefff'
      }
    };

    const object = objects[s.object];
    const floats = object.density < 1000;
    const top = floats ? 76 : 186;

    canvas.innerHTML = `
      <svg
        viewBox="0 0 400 270"
        width="100%"
        role="img"
        aria-label="${object.name} in water"
      >
        <text
          x="200" y="30"
          text-anchor="middle"
          fill="#eaf3ff"
          font-size="20"
        >${object.name}</text>

        <rect
          x="45" y="90"
          width="310" height="150"
          rx="12"
          fill="#125b87"
          opacity=".8"
        />

        <path
          d="M45 90 Q80 80 115 90 T185 90 T255 90 T325 90 T355 90"
          fill="none"
          stroke="#5ce6fa"
          stroke-width="5"
        />

        <rect
          x="170" y="${top}"
          width="60" height="42"
          rx="10"
          fill="${object.color}"
          stroke="#e7f0ff"
          stroke-width="2"
        />

        <text
          x="200" y="${top + 29}"
          text-anchor="middle"
          font-size="25"
        >${object.emoji}</text>
      </svg>

      <div class="simulation-reading">
        ${floats ? 'FLOATS ✓' : 'SINKS ↓'}
      </div>
    `;

    results.innerHTML = `
      <strong>Object:</strong>
      ${object.name}<br>

      <strong>Approximate density:</strong>
      ${object.density} kg/m³<br>

      <strong>Water density:</strong>
      1000 kg/m³<br>

      <strong>Result:</strong>
      ${floats ? 'Floats' : 'Sinks'}
    `;

  // ========================================
  // 6. FORCE AND MOTION
  // ========================================

  } else if (currentExperiment === 'motion') {
    const acceleration =
      s.force / s.mass;

    const time = 4;

    const distance =
      0.5 * acceleration * time * time;

    const velocity =
      acceleration * time;

    const carX = clamp(
      25 + distance * 3,
      25,
      310
    );

    canvas.innerHTML = `
      <svg
        viewBox="0 0 440 240"
        width="100%"
        role="img"
        aria-label="Virtual vehicle moving under applied force"
      >
        <text
          x="220" y="35"
          text-anchor="middle"
          fill="#eaf3ff"
          font-size="22"
        >F = ma</text>

        <text
          x="220" y="65"
          text-anchor="middle"
          fill="#8fdbea"
          font-size="16"
        >
          Acceleration: ${acceleration.toFixed(2)} m/s²
        </text>

        <line
          x1="20" y1="190"
          x2="420" y2="190"
          stroke="#93a3bc"
          stroke-width="5"
        />

        <g transform="translate(${carX},0)">
          <rect
            x="0" y="145"
            width="85" height="35"
            rx="9"
            fill="#7968ff"
          />

          <rect
            x="20" y="125"
            width="45" height="28"
            rx="8"
            fill="#36d9e9"
          />

          <circle
            cx="18" cy="184" r="12"
            fill="#101a2c"
            stroke="#e2e8ff"
            stroke-width="4"
          />

          <circle
            cx="67" cy="184" r="12"
            fill="#101a2c"
            stroke="#e2e8ff"
            stroke-width="4"
          />
        </g>
      </svg>

      <div class="simulation-reading">
        ${acceleration.toFixed(2)} m/s²
      </div>

      <p class="simulation-description">
        Vehicle position illustrates motion
        after 4 seconds from rest.
      </p>
    `;

    results.innerHTML = `
      <strong>Net force:</strong>
      ${s.force} N<br>

      <strong>Mass:</strong>
      ${s.mass} kg<br>

      <strong>Acceleration:</strong>
      ${acceleration.toFixed(2)} m/s²<br>

      <strong>Velocity after 4 s:</strong>
      ${velocity.toFixed(2)} m/s<br>

      <strong>Distance after 4 s:</strong>
      ${distance.toFixed(2)} m
    `;

  // ========================================
  // 7. LIGHT REFLECTION
  // ========================================

  } else if (currentExperiment === 'reflection') {
    const radians =
      s.angle * Math.PI / 180;

    const dx = Math.sin(radians) * 135;
    const dy = Math.cos(radians) * 135;

    canvas.innerHTML = `
      <svg
        viewBox="0 0 440 290"
        width="100%"
        role="img"
        aria-label="Incident and reflected light rays"
      >
        <line
          x1="45" y1="225"
          x2="395" y2="225"
          stroke="#a8c5e9"
          stroke-width="8"
        />

        <line
          x1="220" y1="35"
          x2="220" y2="245"
          stroke="#93a3bc"
          stroke-width="2"
          stroke-dasharray="7 7"
        />

        <line
          x1="${220 - dx}"
          y1="${225 - dy}"
          x2="220"
          y2="225"
          stroke="#ffbd55"
          stroke-width="5"
        />

        <line
          x1="220"
          y1="225"
          x2="${220 + dx}"
          y2="${225 - dy}"
          stroke="#36d9e9"
          stroke-width="5"
        />

        <circle
          cx="220" cy="225"
          r="6"
          fill="white"
        />

        <text
          x="220" y="25"
          text-anchor="middle"
          fill="#eaf3ff"
          font-size="17"
        >Normal</text>

        <text
          x="55" y="265"
          fill="#eaf3ff"
          font-size="17"
        >Mirror</text>

        <text
          x="75" y="85"
          fill="#ffbd55"
          font-size="15"
        >Incident ray</text>

        <text
          x="275" y="85"
          fill="#36d9e9"
          font-size="15"
        >Reflected ray</text>
      </svg>

      <div class="simulation-reading">
        ${s.angle}° = ${s.angle}°
      </div>
    `;

    results.innerHTML = `
      <strong>Angle of incidence:</strong>
      ${s.angle}°<br>

      <strong>Angle of reflection:</strong>
      ${s.angle}°<br>

      <strong>Scientific law:</strong>
      Angle of incidence = Angle of reflection
    `;

  // ========================================
  // 8. PROJECTILE MOTION
  // ========================================

  } else if (currentExperiment === 'projectile') {
    const g = 9.81;
    const theta = s.angle * Math.PI / 180;

    const vx =
      s.speed * Math.cos(theta);

    const vy =
      s.speed * Math.sin(theta);

    const flightTime =
      (2 * vy) / g;

    const range =
      vx * flightTime;

    const maxHeight =
      (vy * vy) / (2 * g);

    const W = 480;
    const H = 270;
    const groundY = 235;

    let points = '';

    for (let i = 0; i <= 100; i++) {
      const t =
        flightTime * i / 100;

      const x =
        vx * t;

      const y =
        vy * t -
        0.5 * g * t * t;

      const px =
        30 + (x / Math.max(range, 1)) * 420;

      const py =
        groundY -
        (y / Math.max(maxHeight, 1)) * 185;

      points +=
        `${px.toFixed(1)},${py.toFixed(1)} `;
    }

    canvas.innerHTML = `
      <svg
        viewBox="0 0 ${W} ${H}"
        width="100%"
        role="img"
        aria-label="Projectile motion trajectory"
      >
        <defs>
          <linearGradient id="projectileSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#142c57"/>
            <stop offset="100%" stop-color="#081427"/>
          </linearGradient>
        </defs>

        <rect
          width="${W}"
          height="${H}"
          rx="14"
          fill="url(#projectileSky)"
        />

        <line
          x1="20" y1="${groundY}"
          x2="460" y2="${groundY}"
          stroke="#59e1ac"
          stroke-width="4"
        />

        <polyline
          points="${points.trim()}"
          fill="none"
          stroke="#40e3ed"
          stroke-width="4"
          stroke-dasharray="8 5"
        />

        <circle
          cx="30"
          cy="${groundY}"
          r="9"
          fill="#ffbf5b"
        />

        <circle
          cx="240"
          cy="50"
          r="8"
          fill="#ffd46a"
        />

        <text
          x="240" y="34"
          text-anchor="middle"
          fill="#eaf3ff"
          font-size="14"
        >Maximum height</text>

        <text
          x="240" y="258"
          text-anchor="middle"
          fill="#eaf3ff"
          font-size="14"
        >Range: ${range.toFixed(1)} m</text>
      </svg>

      <div class="simulation-reading">
        ${range.toFixed(2)} m
      </div>

      <p class="simulation-description">
        Ideal projectile path without air resistance.
      </p>
    `;

    results.innerHTML = `
      <strong>Launch speed:</strong>
      ${s.speed} m/s<br>

      <strong>Launch angle:</strong>
      ${s.angle}°<br>

      <strong>Horizontal range:</strong>
      ${range.toFixed(2)} m<br>

      <strong>Maximum height:</strong>
      ${maxHeight.toFixed(2)} m<br>

      <strong>Flight time:</strong>
      ${flightTime.toFixed(2)} s
    `;

  // ========================================
  // 9. ADVANCED CIRCUIT
  // ========================================

  } else if (currentExperiment === 'advancedCircuit') {
    const series =
      s.configuration === 'series';

    const equivalentResistance = series
      ? s.r1 + s.r2
      : (s.r1 * s.r2) / (s.r1 + s.r2);

    const totalCurrent =
      s.voltage / equivalentResistance;

    const current1 = series
      ? totalCurrent
      : s.voltage / s.r1;

    const current2 = series
      ? totalCurrent
      : s.voltage / s.r2;

    const voltage1 = series
      ? current1 * s.r1
      : s.voltage;

    const voltage2 = series
      ? current2 * s.r2
      : s.voltage;

    canvas.innerHTML = `
      <h3 class="simulation-title">
        ${series ? 'Series' : 'Parallel'} Circuit
      </h3>

      <svg
        viewBox="0 0 440 240"
        width="100%"
        role="img"
        aria-label="${series ? 'Series' : 'Parallel'} resistor circuit"
      >
        ${
          series
            ? `
              <path
                d="M60 50 H380 V190 H60 Z"
                fill="none"
                stroke="#53d9ec"
                stroke-width="5"
              />

              <rect
                x="135" y="35"
                width="65" height="30"
                rx="5"
                fill="#806dff"
              />

              <rect
                x="245" y="35"
                width="65" height="30"
                rx="5"
                fill="#806dff"
              />

              <text
                x="167" y="55"
                text-anchor="middle"
                fill="white"
                font-size="14"
              >${s.r1} Ω</text>

              <text
                x="277" y="55"
                text-anchor="middle"
                fill="white"
                font-size="14"
              >${s.r2} Ω</text>
            `
            : `
              <path
                d="M60 50 H380 V190 H60 Z"
                fill="none"
                stroke="#53d9ec"
                stroke-width="5"
              />

              <path
                d="M60 120 H380"
                fill="none"
                stroke="#53d9ec"
                stroke-width="5"
              />

              <rect
                x="185" y="35"
                width="70" height="30"
                rx="5"
                fill="#806dff"
              />

              <rect
                x="185" y="105"
                width="70" height="30"
                rx="5"
                fill="#806dff"
              />

              <text
                x="220" y="55"
                text-anchor="middle"
                fill="white"
                font-size="14"
              >${s.r1} Ω</text>

              <text
                x="220" y="125"
                text-anchor="middle"
                fill="white"
                font-size="14"
              >${s.r2} Ω</text>
            `
        }

        <rect
          x="40" y="100"
          width="40" height="40"
          rx="6"
          fill="#31b89b"
        />

        <text
          x="60" y="125"
          text-anchor="middle"
          fill="white"
          font-size="12"
        >${s.voltage}V</text>
      </svg>

      <div class="simulation-reading">
        ${totalCurrent.toFixed(2)} A
      </div>
    `;

    results.innerHTML = `
      <strong>Configuration:</strong>
      ${series ? 'Series' : 'Parallel'}<br>

      <strong>Equivalent resistance:</strong>
      ${equivalentResistance.toFixed(2)} Ω<br>

      <strong>Total current:</strong>
      ${totalCurrent.toFixed(2)} A<br>

      <strong>R1 current:</strong>
      ${current1.toFixed(2)} A<br>

      <strong>R2 current:</strong>
      ${current2.toFixed(2)} A<br>

      <strong>R1 voltage:</strong>
      ${voltage1.toFixed(2)} V<br>

      <strong>R2 voltage:</strong>
      ${voltage2.toFixed(2)} V
    `;
  }
}

// ==========================================
// COMPLETE EXPERIMENT AND AWARD POINTS
// ==========================================

function completeExperiment() {
  if (!currentExperiment) return;

  if (progress.completed.includes(currentExperiment)) {
    showToast(
      'Already completed! Try another experiment.'
    );
    return;
  }

  progress.completed.push(currentExperiment);
  progress.points += 50;

  saveProgress();

  $('#completeExperiment').textContent =
    'Experiment Completed ✓';

  showToast(
    '🏆 Experiment completed! +50 points'
  );
}

// ==========================================
// QUIZ ARENA
// ==========================================

function resetQuiz() {
  quizQuestions = [];
  quizIndex = 0;
  quizCorrect = 0;
  quizAnswered = false;

  $('#quizStart').classList.remove('hidden');
  $('#quizGame').classList.add('hidden');
  $('#quizResult').classList.add('hidden');
}

function startQuiz() {
  const subject = $('#quizSubject').value;

  const pool = QUESTIONS.filter(question => {
    const correctLevel =
      question.level === currentLevel;

    const correctSubject =
      subject === 'all' ||
      question.subject === subject;

    return correctLevel && correctSubject;
  });

  if (pool.length === 0) {
    showToast(
      'No questions available for this selection.'
    );
    return;
  }

  // Shuffle using Fisher-Yates algorithm.
  const shuffled = [...pool];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [shuffled[i], shuffled[j]] =
      [shuffled[j], shuffled[i]];
  }

  quizQuestions = shuffled.slice(
    0,
    Math.min(5, shuffled.length)
  );

  quizIndex = 0;
  quizCorrect = 0;
  quizAnswered = false;

  $('#quizStart').classList.add('hidden');
  $('#quizResult').classList.add('hidden');
  $('#quizGame').classList.remove('hidden');

  renderQuestion();
}

function renderQuestion() {
  quizAnswered = false;

  const question = quizQuestions[quizIndex];

  if (!question) return;

  $('#questionCounter').textContent =
    `Question ${quizIndex + 1} of ${quizQuestions.length}`;

  $('#quizScore').textContent =
    `Correct: ${quizCorrect}`;

  $('#quizProgressBar').style.width =
    `${(quizIndex / quizQuestions.length) * 100}%`;

  $('#questionText').textContent =
    question.q;

  $('#answerFeedback').textContent = '';

  $('#nextQuestionBtn').classList.add('hidden');

  const options = $('#answerOptions');
  options.innerHTML = '';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');

    button.className = 'answer-option';

    button.textContent =
      `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener('click', () => {
      answerQuestion(index);
    });

    options.appendChild(button);
  });
}

function answerQuestion(index) {
  if (quizAnswered) return;

  quizAnswered = true;

  const question = quizQuestions[quizIndex];
  const correct = index === question.answer;

  if (correct) {
    quizCorrect++;
  }

  $$('.answer-option').forEach((button, i) => {
    button.disabled = true;

    if (i === question.answer) {
      button.classList.add('correct');
    } else if (i === index) {
      button.classList.add('wrong');
    }
  });

  $('#answerFeedback').textContent =
    `${correct ? '✓ Correct!' : '✗ Not quite.'} ${question.why}`;

  $('#quizScore').textContent =
    `Correct: ${quizCorrect}`;

  $('#nextQuestionBtn').textContent =
    quizIndex === quizQuestions.length - 1
      ? 'See Results →'
      : 'Next Question →';

  $('#nextQuestionBtn').classList.remove('hidden');
}

function nextQuestion() {
  if (!quizAnswered) return;

  quizIndex++;

  if (quizIndex < quizQuestions.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const earned = quizCorrect * 10;

  progress.quizzes++;
  progress.points += earned;

  if (
    quizQuestions.length > 0 &&
    quizCorrect === quizQuestions.length
  ) {
    progress.perfectQuiz = true;
  }

  saveProgress();

  $('#quizProgressBar').style.width = '100%';

  $('#quizGame').classList.add('hidden');
  $('#quizResult').classList.remove('hidden');

  $('#finalScore').textContent =
    `${quizCorrect} / ${quizQuestions.length} correct`;

  $('#quizReward').textContent =
    `You earned ${earned} knowledge points!`;

  showToast(
    `Quiz finished! +${earned} points`
  );
}

// ==========================================
// INITIALIZE POCKETLAB
// ==========================================

function init() {
  const date = $('#todayDate');

  if (date) {
    date.textContent =
      new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
  }

  updateDashboard();
  updateLevelDisplay();
  setConnectionStatus();

  window.addEventListener(
    'online',
    setConnectionStatus
  );

  window.addEventListener(
    'offline',
    setConnectionStatus
  );

  // SIDEBAR NAVIGATION
  $$('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
      navigate(button.dataset.page);
    });
  });

  // DASHBOARD NAVIGATION BUTTONS
  $$('[data-go]').forEach(button => {
    button.addEventListener('click', () => {
      navigate(button.dataset.go);
    });
  });

  // LEARNING LEVEL CARDS
  $$('[data-level]').forEach(button => {
    button.addEventListener('click', () => {
      selectLevel(button.dataset.level);
    });
  });

  // SUBJECT CARDS
  $$('[data-subject]').forEach(button => {
    button.addEventListener('click', () => {
      filterExperiments(button.dataset.subject);
      navigate('laboratory');
    });
  });

  // EXPERIMENT FILTER
  const filter = $('#experimentFilter');

  if (filter) {
    filter.addEventListener('change', event => {
      filterExperiments(event.target.value);
    });
  }

  // LAUNCH EXPERIMENTS
  $$('[data-experiment]').forEach(button => {
    button.addEventListener('click', () => {
      startExperiment(button.dataset.experiment);
    });
  });

  // COMPLETE EXPERIMENT
  $('#completeExperiment').addEventListener(
    'click',
    completeExperiment
  );

  // QUIZ BUTTONS
  $('#startQuizBtn').addEventListener(
    'click',
    startQuiz
  );

  $('#nextQuestionBtn').addEventListener(
    'click',
    nextQuestion
  );

  $('#retryQuizBtn').addEventListener(
    'click',
    resetQuiz
  );

  // LANGUAGE SELECTOR
  
  // LANGUAGE SELECTOR
  const language = $('#languageSelect');

  if (language) {
    const savedLanguage =
      localStorage.getItem('pocketlab-language') || 'en';

    language.value = savedLanguage;

    document.documentElement.lang = savedLanguage;

    language.addEventListener('change', event => {
      const selectedLanguage = event.target.value;

      localStorage.setItem(
        'pocketlab-language',
        selectedLanguage
      );

      document.documentElement.lang = selectedLanguage;

      document.dispatchEvent(
        new CustomEvent('pocketlab-language-change', {
          detail: { language: selectedLanguage }
        })
      );
    });
  }


  // OFFLINE SERVICE WORKER
  if (
    'serviceWorker' in navigator &&
    location.protocol !== 'file:'
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .catch(error => {
          console.warn(
            'Offline caching unavailable:',
            error
          );
        });
    });
  }

  console.log(
    'PocketLab 2.0 initialized — 9 experiments available.'
  );
}

document.addEventListener(
  'DOMContentLoaded',
  () => init()
);

// ==========================================
// END OF POCKETLAB 2.0
// ==========================================


// =============================================================
// POCKETLAB 3.0 — PHYSICS LAB EXTENSION
// Preserves all original quizzes, navigation and achievements.
// =============================================================

const PHYSICS_LAB = [
  ['circuit','Ohm’s Law','Explore how voltage, resistance and current relate.','⚡'],
  ['advancedCircuit','Series & Parallel Circuit','Compare resistor networks and total current.','🔌'],
  ['kirchhoff','Kirchhoff’s Laws','Explore current splitting at a circuit junction.','🔀'],
  ['thevenin','Thevenin’s Theorem','Reduce a network to a source and resistance.','🔋'],
  ['capacitor','Capacitor Charging & Discharging','Watch voltage change over time in an RC circuit.','🔋'],
  ['rl','RL Circuit','Observe how current builds through an inductor.','🌀'],
  ['rc','RC Circuit','Investigate how resistance and capacitance set timing.','⏱️'],
  ['ac','AC Circuit','Explore alternating voltage and frequency.','〰️'],
  ['induction','Electromagnetic Induction','Change magnetic flux to generate voltage.','🧲'],
  ['photoelectric','Photoelectric Effect','Explore the threshold frequency of light.','✨'],
  ['thermal','Thermal Expansion','Observe how a metal rod expands with heat.','🌡️'],
  ['pendulum','Simple Pendulum','Study the period of a swinging pendulum.','🕰️']
];

const PHYSICS_CONFIG = {
  kirchhoff: { controls:[['voltage','Supply voltage',1,24,12,1,' V'],['r1','Branch R₁',1,30,6,1,' Ω'],['r2','Branch R₂',1,30,12,1,' Ω']], formula:'Iₜ = I₁ + I₂', explain:'At a junction, the sum of currents entering equals the sum leaving. The two branches have the same voltage.' },
  thevenin: { controls:[['voltage','Source voltage',1,24,12,1,' V'],['r1','R₁',1,30,6,1,' Ω'],['r2','R₂',1,30,12,1,' Ω'],['load','Load resistance',1,30,8,1,' Ω']], formula:'Vth = Vs R₂/(R₁+R₂)', explain:'A linear two-terminal resistor network can be replaced by an equivalent voltage source and a series resistance. This model uses a simple voltage divider.' },
  capacitor: { controls:[['voltage','Supply voltage',1,24,12,1,' V'],['resistance','Resistance',1,20,5,1,' kΩ'],['capacitance','Capacitance',1,100,50,1,' µF'],['time','Elapsed time',0,3,0.5,.05,' s'],['mode','Mode',null,null,'charge',null,null,[['charge','Charging'],['discharge','Discharging']]]], formula:'Vc = Vs(1 − e^(−t/RC))', explain:'Capacitor voltage changes exponentially. The time constant is τ = RC. Discharging follows Vc = V₀e^(−t/RC).' },
  rl: { controls:[['voltage','Supply voltage',1,24,12,1,' V'],['resistance','Resistance',1,20,5,1,' Ω'],['inductance','Inductance',1,100,30,1,' mH'],['time','Elapsed time',0,.15,.04,.002,' s']], formula:'I = (V/R)(1 − e^(−Rt/L))', explain:'An inductor opposes changes in current. The time constant is τ = L/R.' },
  rc: { controls:[['voltage','Supply voltage',1,24,9,1,' V'],['resistance','Resistance',1,20,8,1,' kΩ'],['capacitance','Capacitance',1,100,30,1,' µF'],['time','Elapsed time',0,3,.4,.05,' s']], formula:'τ = RC', explain:'The RC time constant controls the rate at which capacitor voltage rises. One time constant corresponds to about 63.2% of the final voltage.' },
  ac: { controls:[['voltage','Peak voltage',1,24,12,1,' V'],['frequency','Frequency',1,100,50,1,' Hz'],['time','Time',0,.1,.02,.001,' s']], formula:'v(t) = Vₚ sin(2πft)', explain:'Alternating current changes direction periodically. For a sine wave, Vrms = Vpeak/√2.' },
  induction: { controls:[['turns','Coil turns',10,500,150,10,''],['field','Magnetic field change',0,2,.8,.1,' T/s'],['area','Coil area',10,100,40,5,' cm²']], formula:'|ε| = N A |dB/dt|', explain:'Changing magnetic flux induces an electromotive force. This simplified model assumes a uniform field perpendicular to the coil.' },
  photoelectric: { controls:[['frequency','Light frequency',3,12,7,.1,' ×10¹⁴ Hz'],['work','Work function',1,4,2.2,.1,' eV'],['intensity','Light intensity',0,100,60,5,'%']], formula:'Kmax = hf − φ', explain:'Electrons are emitted only when photon energy exceeds the metal work function. Intensity changes the number emitted, not their maximum kinetic energy.' },
  thermal: { controls:[['length','Initial length',1,5,2,.1,' m'],['temperature','Temperature change',0,300,100,5,' °C'],['alpha','Expansion coefficient',5,25,12,1,' ×10⁻⁶/°C']], formula:'ΔL = α L₀ ΔT', explain:'Most metals expand as their temperature rises. This model uses the linear thermal expansion approximation.' },
  pendulum: { controls:[['length','String length',.2,3,1,.1,' m'],['angle','Release angle',5,45,20,1,'°'],['gravity','Gravity',1,20,9.81,.1,' m/s²']], formula:'T ≈ 2π√(L/g)', explain:'For small angles, the pendulum period depends primarily on length and gravity, not mass. Larger angles cause small deviations from the approximation.' }
};

PHYSICS_LAB.forEach(([key,title,description]) => {
  if (!EXPERIMENTS[key]) EXPERIMENTS[key] = {
    title, description,
    explanation:`<p>${description}</p><p>${PHYSICS_CONFIG[key]?.explain || ''}</p>`
  };
});

const pocketOriginalStartExperiment = startExperiment;
const pocketOriginalRenderExperiment = renderExperiment;
const pocketOriginalFilterExperiments = filterExperiments;
const pocketOriginalInit = init;

function pocketPhysicsControls(key) {
  const cfg = PHYSICS_CONFIG[key];
  return cfg.controls.map(c => c[7]
    ? controlSelect(c[0],c[1],c[7].map(([value,label])=>({value,label})))
    : controlRange(...c.slice(0,7))
  ).join('');
}

startExperiment = function(key) {
  if (!PHYSICS_CONFIG[key]) {
    pocketOriginalStartExperiment(key);
    return;
  }
  const cfg = PHYSICS_CONFIG[key];
  currentExperiment = key;
  experimentState = {};
  cfg.controls.forEach(c => experimentState[c[0]] = c[7] ? c[4] : Number(c[4]));
  $('#activeExperimentTitle').textContent = EXPERIMENTS[key].title;
  $('#activeExperimentDescription').textContent = EXPERIMENTS[key].description;
  $('#experimentExplanation').innerHTML = `<p>${esc(cfg.explain)}</p><p><strong>Formula:</strong> ${esc(cfg.formula)}</p><p>Educational idealized model; adjust the controls to investigate relationships.</p>`;
  const done = $('#completeExperiment');
  done.disabled = false;
  done.textContent = progress.completed.includes(key) ? 'Experiment Completed ✓' : 'Complete Experiment ✓';
  const controls = $('#experimentControls');
  controls.innerHTML = pocketPhysicsControls(key);
  $$('input,select',controls).forEach(input => {
    const update = () => {
      experimentState[input.id] = input.type === 'range' ? Number(input.value) : input.value;
      if (input.type === 'range') setControlValue(input.id,input.value);
      renderExperiment();
    };
    input.addEventListener('input',update);
    input.addEventListener('change',update);
  });
  navigate('experimentWorkspace');
  renderExperiment();
};

function pocketPhysicsDiagram(key,s) {
  const neon = '#45dcf5', amber = '#ffbf69', blue='#428eff';
  if (key === 'pendulum') {
    const a = s.angle*Math.PI/180, x=220+145*Math.sin(a), y=45+145*Math.cos(a);
    return `<svg viewBox="0 0 440 260" width="100%"><path d="M125 45H315" stroke="${blue}" stroke-width="8" stroke-linecap="round"/><path d="M220 45L${x} ${y}" stroke="#d4e9ff" stroke-width="4"/><circle cx="${x}" cy="${y}" r="25" fill="${amber}" style="filter:drop-shadow(0 0 16px ${amber})"/><path d="M220 45V220" stroke="${neon}" stroke-dasharray="5 7" opacity=".3"/></svg>`;
  }
  if (key === 'thermal') {
    const scale = 1 + s.alpha*1e-6*s.temperature*30;
    return `<svg viewBox="0 0 440 250" width="100%"><defs><linearGradient id="rodHeat"><stop stop-color="#347ce9"/><stop offset="1" stop-color="#ff9c4e"/></linearGradient></defs><rect x="45" y="94" width="${Math.min(350,250*scale)}" height="55" rx="9" fill="url(#rodHeat)"/><path d="M45 172H295" stroke="${neon}" stroke-width="2" stroke-dasharray="5 6"/><text x="220" y="210" text-anchor="middle" fill="#cfe6ff">Metal rod · heating expands length</text></svg>`;
  }
  if (key === 'photoelectric') {
    const emission = s.frequency*0.4135668 > s.work;
    return `<svg viewBox="0 0 440 250" width="100%"><rect x="270" y="65" width="45" height="125" rx="6" fill="#8296aa"/><path d="M55 80L255 110M55 130L255 135M55 180L255 155" stroke="${amber}" stroke-width="5" stroke-dasharray="14 8"/><g fill="${neon}">${emission?'<circle cx="345" cy="90" r="7"/><circle cx="365" cy="135" r="7"/><circle cx="345" cy="170" r="7"/>':''}</g><text x="220" y="230" text-anchor="middle" fill="#d3e7ff">${emission?'Electrons emitted':'Below emission threshold'}</text></svg>`;
  }
  if (key === 'ac' || key === 'capacitor' || key === 'rc' || key === 'rl') {
    const w=440,h=230;
    let path='';
    for(let i=0;i<=110;i++) {
      const u=i/110;
      const val=key==='ac'?Math.sin(u*Math.PI*5):key==='rl'?1-Math.exp(-u*5):key==='capacitor'&&s.mode==='discharge'?Math.exp(-u*5):1-Math.exp(-u*5);
      const y=key==='ac'?115-val*70:190-val*125;
      path+=`${i?'L':'M'}${25+u*390},${y} `;
    }
    return `<svg viewBox="0 0 ${w} ${h}" width="100%"><path d="M25 25V200H420" stroke="#6b8cae" stroke-width="2" fill="none"/><path d="${path}" fill="none" stroke="${neon}" stroke-width="4" style="filter:drop-shadow(0 0 7px ${neon})"/><text x="220" y="220" text-anchor="middle" fill="#9fb9d6">Time →</text></svg>`;
  }
  if (key === 'induction') {
    return `<svg viewBox="0 0 440 250" width="100%"><rect x="35" y="85" width="100" height="80" rx="10" fill="#d65b68"/><rect x="85" y="85" width="50" height="80" fill="${blue}"/><text x="85" y="133" text-anchor="middle" fill="white">N / S</text>${Array.from({length:7},(_,i)=>`<ellipse cx="${220+i*17}" cy="125" rx="21" ry="60" stroke="${amber}" stroke-width="4" fill="none"/>`).join('')}<path d="M140 125H195" stroke="${neon}" stroke-width="4" stroke-dasharray="8 6"/><text x="220" y="225" text-anchor="middle" fill="#a9d5ee">Moving field → Induced voltage</text></svg>`;
  }
  return `<svg viewBox="0 0 440 250" width="100%"><path d="M65 70H365V185H65Z" fill="none" stroke="${neon}" stroke-width="5" stroke-linejoin="round"/><rect x="45" y="105" width="40" height="45" rx="5" fill="${blue}"/><text x="65" y="133" fill="white" text-anchor="middle" font-size="11">V</text><rect x="165" y="55" width="95" height="30" rx="6" fill="${amber}"/><text x="212" y="75" text-anchor="middle" fill="#14213b" font-size="13">R₁</text><rect x="270" y="170" width="65" height="30" rx="6" fill="${amber}"/><text x="302" y="190" text-anchor="middle" fill="#14213b" font-size="13">R₂</text><circle cx="365" cy="128" r="23" fill="#183451" stroke="${neon}" stroke-width="3"/><text x="365" y="135" text-anchor="middle" fill="white" font-size="19">A</text></svg>`;
}

renderExperiment = function() {
  const key=currentExperiment;
  if (!PHYSICS_CONFIG[key]) return pocketOriginalRenderExperiment();
  const s=experimentState, cfg=PHYSICS_CONFIG[key];
  let metrics=[];
  const item=(name,val,unit='')=>metrics.push(`<strong>${esc(name)}:</strong> ${esc(typeof val==='number'?Number(val.toFixed(4)):val)} ${esc(unit)}`);
  if(key==='kirchhoff') {
    const i1=s.voltage/s.r1,i2=s.voltage/s.r2;
    item('Branch current I₁',i1,'A');item('Branch current I₂',i2,'A');item('Total current',i1+i2,'A');
  } else if(key==='thevenin') {
    const v=s.voltage*s.r2/(s.r1+s.r2),r=s.r1*s.r2/(s.r1+s.r2);
    item('Thevenin voltage',v,'V');item('Thevenin resistance',r,'Ω');item('Load current',v/(r+s.load),'A');
  } else if(key==='capacitor'||key==='rc') {
    const tau=s.resistance*1000*s.capacitance*1e-6;
    const v=s.voltage*(key==='capacitor'&&s.mode==='discharge'?Math.exp(-s.time/tau):1-Math.exp(-s.time/tau));
    item('Time constant',tau,'s');item('Capacitor voltage',v,'V');item('Stored energy',.5*s.capacitance*1e-6*v*v,'J');
  } else if(key==='rl') {
    const tau=s.inductance*.001/s.resistance;
    item('Time constant',tau,'s');item('Current',s.voltage/s.resistance*(1-Math.exp(-s.time/tau)),'A');
  } else if(key==='ac') {
    item('Instantaneous voltage',s.voltage*Math.sin(2*Math.PI*s.frequency*s.time),'V');item('RMS voltage',s.voltage/Math.SQRT2,'V');item('Period',1/s.frequency,'s');
  } else if(key==='induction') {
    item('Induced EMF magnitude',s.turns*s.area*1e-4*s.field,'V');item('Magnetic flux rate per turn',s.area*1e-4*s.field,'Wb/s');
  } else if(key==='photoelectric') {
    const photon=4.135667696e-15*s.frequency*1e14;
    item('Photon energy',photon,'eV');item('Maximum kinetic energy',Math.max(0,photon-s.work),'eV');item('Electron emission',photon>=s.work&&s.intensity>0?'Yes':'No');
  } else if(key==='thermal') {
    const d=s.alpha*1e-6*s.length*s.temperature;
    item('Length increase',d*1000,'mm');item('Final length',s.length+d,'m');
  } else if(key==='pendulum') {
    const t=2*Math.PI*Math.sqrt(s.length/s.gravity);
    item('Approximate period',t,'s');item('Frequency',1/t,'Hz');
  }
  const canvas=$('#simulationCanvas');
  canvas.innerHTML=`<div style="width:100%;max-width:560px">${pocketPhysicsDiagram(key,s)}</div><div class="simulation-reading">${esc(EXPERIMENTS[key].title)}</div><p class="simulation-description">Adjust the sliders to change the live results.</p>`;
  $('#experimentResults').innerHTML=metrics.join('<br>')+`<br><strong>Formula:</strong> ${esc(cfg.formula)}`;
};

// ==========================================
// PHYSICS EXPERIMENT CATALOG
// ==========================================

function pocketBuildPhysicsCatalog() {
  const laboratory=$('#laboratory');
  if(!laboratory) return;
  let grid=$('.experiment-grid',laboratory);
  if(!grid) {
    grid=document.createElement('div');
    grid.className='experiment-grid';
    laboratory.appendChild(grid);
  }
  // Retain the existing non-Physics experiments; replace Physics cards with the new catalog.
  $$('.experiment-card[data-category="physics"]',grid).forEach(el=>el.remove());
  PHYSICS_LAB.forEach(([key,title,description,emoji],i)=>{
    const card=document.createElement('article');
    card.className='experiment-card pl-physics-card';
    card.dataset.category='physics';
    card.dataset.recommended=i<3?'secondary senior college':'senior college';
    card.innerHTML=`<div class="pl-experiment-preview"><span>${emoji}</span></div><div class="pl-experiment-status">● INTERACTIVE LAB</div><h3 class="pl-experiment-title">${esc(title)}</h3><p class="pl-experiment-description">${esc(description)}</p><div class="pl-experiment-footer"><small>Physics · Live simulation</small><button type="button" class="pl-experiment-start" data-experiment="${key}">▶ Start</button></div>`;
    grid.prepend(card);
  });
}

filterExperiments = function(subject='all') {
  pocketOriginalFilterExperiments(subject);
};

init = function() {
  pocketBuildPhysicsCatalog();
  pocketOriginalInit();
  updateLevelDisplay();
  console.log('PocketLab 3.0: 12 interactive Physics labs plus original STEM experiments.');
};

/* ==========================================
   POCKETLAB 3.0 — PHYSICS BUTTON FIX
   ========================================== */

document.addEventListener('click', function (event) {
  const button = event.target.closest(
    '.pl-physics-card [data-experiment]'
  );

  if (!button) return;

  const experimentKey = button.dataset.experiment;

  if (!experimentKey) return;

  event.preventDefault();
  event.stopPropagation();

  startExperiment(experimentKey);
});

// Rebuild the Physics catalog if initialization
// happened before the extension was loaded.
document.addEventListener('DOMContentLoaded', function () {
  pocketBuildPhysicsCatalog();
  updateLevelDisplay();
});

/* =====================================================
   POCKETLAB 3.0 — ANIMATED PHYSICS UPGRADE
   Paste at the VERY BOTTOM of script.js
   ===================================================== */

(() => {
  'use strict';

  const LABS = [
    ['circuit', 'Electric Circuit', 'Make the bulb glow by changing voltage.', '💡'],
    ['motion', 'Force & Motion', 'Watch a car accelerate with rotating wheels.', '🚗'],
    ['reflection', 'Light Reflection', 'Change the angle of reflected light.', '🔦'],
    ['projectile', 'Projectile Motion', 'Launch a ball and explore its trajectory.', '🏀'],
    ['floating', 'Floating & Sinking', 'Explore buoyancy and object density.', '🛟'],
    ['pendulum', 'Simple Pendulum', 'Watch a pendulum swing continuously.', '🕰️'],
    ['thermal', 'Thermal Expansion', 'Heat a metal rod and watch it expand.', '🌡️'],
    ['photoelectric', 'Photoelectric Effect', 'Fire photons at a metal surface.', '✨'],
    ['induction', 'Electromagnetic Induction', 'Move a magnet through a coil.', '🧲'],
    ['newton', "Newton's Cradle", 'Watch energy transfer between swinging balls.', '⚪'],
    ['prism', 'Prism & Rainbow', 'Split white light into rainbow colors.', '🌈'],
    ['spring', 'Spring Oscillation', 'Change the mass and spring stiffness.', '🌀'],
    ['lens', 'Convex Lens', 'Explore focusing and image formation.', '🔍'],
    ['sound', 'Sound Waves', 'Change frequency and amplitude.', '〰️'],
    ['magnetic', 'Magnetic Field', 'Explore field lines around a magnet.', '🧲']
  ];

  const REMOVED = [
    'advancedCircuit', 'kirchhoff', 'thevenin',
    'capacitor', 'rl', 'rc', 'ac'
  ];

  const CONFIG = {
    pendulum: [
      ['length', 'String length', 0.3, 3, 1.2, 0.1, ' m'],
      ['angle', 'Release angle', 5, 60, 35, 1, '°'],
      ['gravity', 'Gravity', 1, 20, 9.81, 0.1, ' m/s²']
    ],
    thermal: [
      ['temperature', 'Temperature increase', 0, 500, 150, 5, ' °C'],
      ['length', 'Original length', 1, 5, 2, 0.1, ' m'],
      ['alpha', 'Expansion coefficient', 5, 25, 12, 1, ' ×10⁻⁶/°C']
    ],
    photoelectric: [
      ['frequency', 'Light frequency', 3, 12, 7, 0.1, ' ×10¹⁴ Hz'],
      ['work', 'Work function', 1, 4, 2.2, 0.1, ' eV'],
      ['intensity', 'Light intensity', 0, 100, 70, 5, '%']
    ],
    induction: [
      ['turns', 'Coil turns', 20, 500, 180, 10, ''],
      ['speed', 'Magnet speed', 0, 100, 55, 5, '%'],
      ['field', 'Magnetic strength', 0.1, 2, 1, 0.1, ' T']
    ],
    newton: [
      ['balls', 'Number of moving balls', 1, 3, 1, 1, ''],
      ['angle', 'Release angle', 10, 55, 35, 1, '°']
    ],
    prism: [
      ['angle', 'Prism rotation', -25, 25, 0, 1, '°'],
      ['spread', 'Color separation', 20, 100, 70, 5, '%']
    ],
    spring: [
      ['mass', 'Hanging mass', 1, 10, 4, 1, ' kg'],
      ['stiffness', 'Spring stiffness', 10, 100, 35, 5, ' N/m']
    ],
    lens: [
      ['focal', 'Focal length', 30, 120, 70, 5, ' px'],
      ['distance', 'Object distance', 130, 300, 210, 5, ' px']
    ],
    sound: [
      ['frequency', 'Frequency', 1, 12, 5, 1, ' units'],
      ['amplitude', 'Amplitude', 5, 65, 35, 5, ' units']
    ],
    magnetic: [
      ['strength', 'Field strength', 10, 100, 65, 5, '%'],
      ['direction', 'Magnet rotation', 0, 180, 0, 15, '°']
    ]
  };

  const STYLES = `
    .pl-physics-card .pl-experiment-preview {
      position:relative;
      overflow:hidden;
      background:radial-gradient(circle at 50% 45%,#16446b,#06162b 75%);
      border:1px solid #245d86;
    }
    .pl-physics-card .pl-experiment-preview span {
      display:block;
      font-size:56px;
      filter:drop-shadow(0 0 18px #28c9ff66);
      transition:transform .3s;
    }
    .pl-physics-card:hover .pl-experiment-preview span {
      transform:scale(1.18);
    }
    .pl-scene {
      position:relative;
      width:100%;
      max-width:680px;
      min-height:300px;
      margin:auto;
      overflow:hidden;
      border-radius:18px;
      background:radial-gradient(ellipse at center,#102d4d,#061222 78%);
      border:1px solid #27527b;
    }
    .pl-scene svg {display:block;width:100%;height:300px}
    .pl-scene text {font-family:Arial,sans-serif}
    .pl-metric {
      text-align:center;
      color:#b9d7ed;
      padding:12px;
      font-size:14px;
    }
    .pl-metric strong {color:#52e8ff}
    .pl-swing {
      transform-origin:300px 48px;
      animation:plSwing var(--period,2s) ease-in-out infinite alternate;
    }
    @keyframes plSwing {
      from {transform:rotate(calc(-1 * var(--angle,35deg)))}
      to {transform:rotate(var(--angle,35deg))}
    }
    .pl-magnet {
      animation:plMagnet var(--speed,2s) ease-in-out infinite alternate;
    }
    @keyframes plMagnet {
      from {transform:translateX(-85px)}
      to {transform:translateX(85px)}
    }
    .pl-photon {
      animation:plPhoton 1.1s linear infinite;
    }
    @keyframes plPhoton {
      from {transform:translateX(-110px);opacity:0}
      20% {opacity:1}
      to {transform:translateX(165px);opacity:1}
    }
    .pl-electron {
      animation:plElectron 1.2s linear infinite;
    }
    @keyframes plElectron {
      from {transform:translate(0,0);opacity:1}
      to {transform:translate(135px,-50px);opacity:0}
    }
    .pl-rod {
      transform-origin:left center;
      transition:transform .5s,fill .5s;
    }
    .pl-heat {
      animation:plHeat .9s ease-in-out infinite alternate;
    }
    @keyframes plHeat {
      from {opacity:.25;transform:translateY(6px)}
      to {opacity:1;transform:translateY(-10px)}
    }
    .pl-newton-left {
      transform-origin:220px 48px;
      animation:plNewtonLeft 1.7s ease-in-out infinite;
    }
    .pl-newton-right {
      transform-origin:380px 48px;
      animation:plNewtonRight 1.7s ease-in-out infinite;
    }
    @keyframes plNewtonLeft {
      0%,25%,100% {transform:rotate(-35deg)}
      45%,75% {transform:rotate(0deg)}
    }
    @keyframes plNewtonRight {
      0%,35%,90%,100% {transform:rotate(0deg)}
      60% {transform:rotate(35deg)}
    }
    .pl-spring {
      transform-origin:300px 45px;
      animation:plSpring var(--period,1.5s) ease-in-out infinite alternate;
    }
    @keyframes plSpring {
      from {transform:scaleY(.8)}
      to {transform:scaleY(1.2)}
    }
    .pl-wave {
      stroke-dasharray:8 4;
      animation:plWave 1s linear infinite;
    }
    @keyframes plWave {
      to {stroke-dashoffset:-48}
    }
    .pl-field {
      stroke-dasharray:9 7;
      animation:plField 2s linear infinite;
    }
    @keyframes plField {
      to {stroke-dashoffset:-64}
    }
    .pl-rays {
      animation:plRays 1.4s ease-in-out infinite alternate;
    }
    @keyframes plRays {
      from {opacity:.45}
      to {opacity:1}
    }
    .pl-needle {
      transform-origin:500px 185px;
      animation:plNeedle 1.4s ease-in-out infinite alternate;
    }
    @keyframes plNeedle {
      from {transform:rotate(-40deg)}
      to {transform:rotate(40deg)}
    }
    @media(prefers-reduced-motion:reduce) {
      .pl-scene * {animation:none!important}
    }
  `;

  const style = document.createElement('style');
  style.textContent = STYLES;
  document.head.appendChild(style);

  // Register new experiments with the existing progress system.
  LABS.forEach(([key, title, description]) => {
    if (!EXPERIMENTS[key]) {
      EXPERIMENTS[key] = {
        title,
        description,
        explanation: `<p>${description}</p>`
      };
    }
  });

  function buildCatalog() {
    const laboratory = document.querySelector('#laboratory');
    if (!laboratory) return;

    let grid = laboratory.querySelector('.experiment-grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'experiment-grid';
      laboratory.appendChild(grid);
    }

    // Remove the old Physics cards only.
    grid.querySelectorAll(
      '.experiment-card[data-category="physics"]'
    ).forEach(card => card.remove());

    const fragment = document.createDocumentFragment();

    LABS.forEach(([key, title, description, emoji]) => {
      const card = document.createElement('article');
      card.className = 'experiment-card pl-physics-card';
      card.dataset.category = 'physics';
      card.dataset.recommended = 'secondary senior college';

      card.innerHTML = `
        <div class="pl-experiment-preview">
          <span>${emoji}</span>
        </div>
        <div class="pl-experiment-status">
          ● INTERACTIVE LAB
        </div>
        <h3 class="pl-experiment-title">${title}</h3>
        <p class="pl-experiment-description">
          ${description}
        </p>
        <div class="pl-experiment-footer">
          <small>Physics · Animated simulation</small>
          <button
            type="button"
            class="pl-experiment-start"
            data-experiment="${key}"
          >▶ Start</button>
        </div>
      `;
      fragment.appendChild(card);
    });

    grid.prepend(fragment);
  }

  const previousStart = startExperiment;
  const previousRender = renderExperiment;

  function rangeControl(c) {
    const [id, label, min, max, value, step, unit] = c;
    return `
      <div class="control-group">
        <label for="${id}">
          ${label}:
          <span id="${id}Value">${value}${unit}</span>
        </label>
        <input
          type="range"
          id="${id}"
          min="${min}"
          max="${max}"
          value="${value}"
          step="${step}"
        >
      </div>
    `;
  }

  function scene(content, result) {
    const canvas = document.querySelector('#simulationCanvas');
    const results = document.querySelector('#experimentResults');
    if (!canvas || !results) return;

    canvas.innerHTML = `
      <div class="pl-scene">
        <svg viewBox="0 0 600 300" aria-label="Animated physics experiment">
          ${content}
        </svg>
      </div>
    `;
    results.innerHTML = result;
  }

  function pendulum(s) {
    const period = 2 * Math.PI * Math.sqrt(s.length / s.gravity);
    const length = 90 + s.length * 42;

    scene(`
      <path d="M205 48H395" stroke="#638eb8" stroke-width="10" stroke-linecap="round"/>
      <circle cx="300" cy="48" r="8" fill="#f0c875"/>
      <path d="M300 48V265" stroke="#567b9b" stroke-dasharray="5 7"/>
      <g class="pl-swing"
         style="--angle:${s.angle}deg;--period:${(period / 2).toFixed(2)}s">
        <line x1="300" y1="48" x2="300" y2="${48 + length}"
              stroke="#cce8ff" stroke-width="4"/>
        <circle cx="300" cy="${48 + length}" r="25"
                fill="#ffbd58" stroke="#fff0b0" stroke-width="3"/>
        <circle cx="291" cy="${39 + length}" r="7"
                fill="#fff4ca" opacity=".7"/>
      </g>
      <text x="300" y="286" text-anchor="middle" fill="#9adfff">
        SWINGING PENDULUM
      </text>
    `, `
      <strong>Period:</strong> ${period.toFixed(2)} seconds<br>
      <strong>Length:</strong> ${s.length} m<br>
      <strong>Release angle:</strong> ${s.angle}°<br>
      <strong>Gravity:</strong> ${s.gravity} m/s²
    `);
  }

  function thermal(s) {
    const expansion = s.alpha * 1e-6 * s.length * s.temperature;
    const visualScale = 1 + (s.temperature / 500) * 0.55;
    const heat = s.temperature / 500;

    scene(`
      <rect x="80" y="95" width="340" height="65" rx="8"
            fill="#163a5a" stroke="#4789b8"/>
      <rect class="pl-rod" x="105" y="112"
            width="270" height="30" rx="5"
            fill="rgb(${Math.round(95 + heat * 160)},${Math.round(160 - heat * 95)},${Math.round(225 - heat * 170)})"
            style="transform:scaleX(${visualScale})"/>
      <g fill="#ff9e39" class="pl-heat">
        <path d="M150 230Q130 195 150 170Q165 195 150 230Z"/>
        <path d="M250 230Q230 195 250 170Q265 195 250 230Z"/>
        <path d="M350 230Q330 195 350 170Q365 195 350 230Z"/>
      </g>
      <text x="300" y="45" text-anchor="middle"
            font-size="21" fill="#ffb56c">
        ${s.temperature}°C TEMPERATURE INCREASE
      </text>
      <text x="300" y="275" text-anchor="middle" fill="#a9d9ff">
        Expansion visually magnified
      </text>
    `, `
      <strong>Actual expansion:</strong>
      ${(expansion * 1000).toFixed(3)} mm<br>
      <strong>Final length:</strong>
      ${(s.length + expansion).toFixed(6)} m<br>
      <strong>Temperature increase:</strong> ${s.temperature}°C<br>
      <strong>Note:</strong> Animation exaggerates expansion so it is visible.
    `);
  }

  function photoelectric(s) {
    const energy = 0.4135668 * s.frequency;
    const emits = energy >= s.work && s.intensity > 0;
    const count = Math.ceil(s.intensity / 20);
    let photons = '';
    let electrons = '';

    for (let i = 0; i < count; i++) {
      photons += `
        <circle class="pl-photon"
                cx="${70 + (i % 2) * 20}"
                cy="${85 + i * 25}"
                r="7" fill="#ffe65e"
                style="animation-delay:-${i * 0.2}s"/>
      `;
      if (emits) {
        electrons += `
          <circle class="pl-electron"
                  cx="335" cy="${90 + i * 23}"
                  r="6" fill="#50f1ff"
                  style="animation-delay:-${i * 0.2}s"/>
        `;
      }
    }

    scene(`
      <rect x="310" y="45" width="38" height="210" rx="5"
            fill="#879eaf"/>
      <text x="329" y="30" text-anchor="middle" fill="#b9dfff">
        METAL
      </text>
      <path d="M40 150H300" stroke="#ffd45e"
            stroke-width="2" stroke-dasharray="8 8"/>
      ${photons}
      ${electrons}
      <text x="90" y="275" fill="#ffdf72">PHOTONS →</text>
      <text x="385" y="275" fill="#6cefff">
        ${emits ? 'ELECTRONS →' : 'NO EMISSION'}
      </text>
    `, `
      <strong>Photon energy:</strong> ${energy.toFixed(2)} eV<br>
      <strong>Work function:</strong> ${s.work} eV<br>
      <strong>Maximum electron energy:</strong>
      ${Math.max(0, energy - s.work).toFixed(2)} eV<br>
      <strong>Emission:</strong> ${emits ? 'Yes' : 'No'}<br>
      <strong>Intensity:</strong> ${s.intensity}%
    `);
  }

  function induction(s) {
    const duration = s.speed === 0 ? '0s' : `${(3 - s.speed / 45).toFixed(2)}s`;
    const emf = (s.turns * s.field * s.speed / 1000);

    scene(`
      <g class="pl-magnet"
         style="--speed:${duration};animation-play-state:${s.speed === 0 ? 'paused' : 'running'}">
        <rect x="125" y="110" width="70" height="65" rx="7" fill="#e34b65"/>
        <rect x="195" y="110" width="70" height="65" rx="7" fill="#368cff"/>
        <text x="160" y="150" text-anchor="middle" fill="white" font-size="25">N</text>
        <text x="230" y="150" text-anchor="middle" fill="white" font-size="25">S</text>
      </g>
      ${Array.from({length:7},(_,i)=>`
        <ellipse cx="${290+i*14}" cy="142" rx="19" ry="66"
                 fill="none" stroke="#ffc56a" stroke-width="4"/>
      `).join('')}
      <path d="M390 145H500V185" fill="none"
            stroke="#65dff8" stroke-width="3"/>
      <circle cx="500" cy="185" r="37" fill="#10273d"
              stroke="#65dff8" stroke-width="3"/>
      <line class="pl-needle" x1="500" y1="185"
            x2="500" y2="158" stroke="#ff8c65" stroke-width="4"/>
      <text x="500" y="242" text-anchor="middle" fill="#b2e6ff">
        GALVANOMETER
      </text>
      <text x="300" y="35" text-anchor="middle" fill="#e8f5ff">
        MOVING MAGNET + COPPER COIL
      </text>
    `, `
      <strong>Coil turns:</strong> ${s.turns}<br>
      <strong>Magnet speed:</strong> ${s.speed}%<br>
      <strong>Magnetic field:</strong> ${s.field} T<br>
      <strong>Relative induction indicator:</strong>
      ${emf.toFixed(2)}<br>
      <strong>Principle:</strong> Changing magnetic flux induces voltage.
    `);
  }

  function newton(s) {
    const spacing = 40;
    const balls = Array.from({length:5},(_,i)=>{
      const x = 220 + i*spacing;
      const cls = i === 0 ? 'pl-newton-left' :
                  i === 4 ? 'pl-newton-right' : '';
      return `
        <g class="${cls}">
          <line x1="${x}" y1="48" x2="${x}" y2="205"
                stroke="#c5e6f7" stroke-width="3"/>
          <circle cx="${x}" cy="205" r="20"
                  fill="#67b5ef" stroke="#d6f5ff" stroke-width="3"/>
        </g>
      `;
    }).join('');

    scene(`
      <path d="M170 48H430" stroke="#6d91b5"
            stroke-width="9" stroke-linecap="round"/>
      ${balls}
      <text x="300" y="275" text-anchor="middle" fill="#a8dcff">
        ENERGY TRANSFER THROUGH COLLISIONS
      </text>
    `, `
      <strong>Selected moving balls:</strong> ${s.balls}<br>
      <strong>Release angle:</strong> ${s.angle}°<br>
      <strong>Principle:</strong> Conservation of momentum and energy.<br>
      <strong>Note:</strong> The animation is a conceptual illustration.
    `);
  }

  function prism(s) {
    const colors = [
      '#ff4646','#ff9e3b','#ffe94c',
      '#57ed83','#47b8ff','#6365ff','#c16dff'
    ];

    scene(`
      <path d="M40 145H260" stroke="white"
            stroke-width="9" class="pl-rays"/>
      <g transform="rotate(${s.angle},300,150)">
        <path d="M300 50L220 230H380Z"
              fill="#8fdcff33" stroke="#9eefff" stroke-width="5"/>
      </g>
      ${colors.map((color,i)=>`
        <path d="M325 150L560 ${90+i*(s.spread/100)*20}"
              stroke="${color}" stroke-width="5" class="pl-rays"/>
      `).join('')}
      <text x="300" y="280" text-anchor="middle" fill="#b9eaff">
        WHITE LIGHT → SPECTRUM
      </text>
    `, `
      <strong>Prism rotation:</strong> ${s.angle}°<br>
      <strong>Visual dispersion:</strong> ${s.spread}%<br>
      <strong>Principle:</strong> Different wavelengths refract by different amounts.
    `);
  }

  function spring(s) {
    const period = 2*Math.PI*Math.sqrt(s.mass/s.stiffness);
    let d='M300 50';
    for(let i=0;i<15;i++) {
      d+=` L${i%2?275:325} ${65+i*9}`;
    }
    d+=' L300 210';

    scene(`
      <path d="M220 45H380" stroke="#708ca7" stroke-width="10"/>
      <g class="pl-spring"
         style="--period:${(period/2).toFixed(2)}s">
        <path d="${d}" fill="none" stroke="#6de5ff"
              stroke-width="5" stroke-linejoin="round"/>
        <rect x="265" y="210" width="70" height="45" rx="9"
              fill="#ffad52"/>
        <text x="300" y="240" text-anchor="middle" fill="#102039">
          ${s.mass} kg
        </text>
      </g>
    `, `
      <strong>Mass:</strong> ${s.mass} kg<br>
      <strong>Spring stiffness:</strong> ${s.stiffness} N/m<br>
      <strong>Oscillation period:</strong> ${period.toFixed(2)} s
    `);
  }

  function lens(s) {
    const f=s.focal, u=s.distance;
    const v=f*u/(u-f);
    const imageX=Math.min(570,300+v);
    const imageH=Math.min(140,75*v/u);

    scene(`
      <line x1="25" y1="160" x2="580" y2="160"
            stroke="#6a8aa8" stroke-dasharray="7 7"/>
      <path d="M300 35Q255 160 300 285Q345 160 300 35Z"
            fill="#50d9ff33" stroke="#70e6ff" stroke-width="4"/>
      <path d="M${300-u} 160V85" stroke="#ffbd5c" stroke-width="6"/>
      <path d="M${300-u-9} 99L${300-u} 85L${300-u+9} 99"
            fill="none" stroke="#ffbd5c" stroke-width="5"/>
      <g class="pl-rays" stroke="#ffe36a" stroke-width="3" fill="none">
        <path d="M${300-u} 85H300L${imageX} ${160+imageH}"/>
        <path d="M${300-u} 85L300 160L${imageX} ${160+imageH}"/>
      </g>
      <path d="M${imageX} 160V${160+imageH}"
            stroke="#75ffad" stroke-width="5"/>
      <circle cx="${300-f}" cy="160" r="5" fill="#ff9f63"/>
      <circle cx="${300+f}" cy="160" r="5" fill="#ff9f63"/>
      <text x="300" y="25" text-anchor="middle" fill="#c8efff">
        CONVEX LENS
      </text>
    `, `
      <strong>Focal length:</strong> ${f} px<br>
      <strong>Object distance:</strong> ${u} px<br>
      <strong>Image distance:</strong> ${v.toFixed(1)} px<br>
      <strong>Magnification:</strong> ${(-v/u).toFixed(2)}
    `);
  }

  function sound(s) {
    let path='';
    for(let x=20;x<=580;x+=3) {
      const y=150-Math.sin((x-20)/560*s.frequency*2*Math.PI)*s.amplitude;
      path+=`${x===20?'M':'L'}${x},${y} `;
    }

    scene(`
      <path d="M20 150H580" stroke="#456a8b"
            stroke-width="2" stroke-dasharray="6 7"/>
      <path class="pl-wave" d="${path}"
            fill="none" stroke="#52e8ff" stroke-width="5"/>
      <text x="300" y="40" text-anchor="middle"
            fill="#b7ebff" font-size="22">SOUND WAVE</text>
      <text x="300" y="275" text-anchor="middle" fill="#a5d9f4">
        FREQUENCY & AMPLITUDE
      </text>
    `, `
      <strong>Relative frequency:</strong> ${s.frequency}<br>
      <strong>Amplitude:</strong> ${s.amplitude} units<br>
      <strong>Principle:</strong> Frequency affects pitch; amplitude affects sound intensity.
    `);
  }

  function magnetic(s) {
    const lines = Array.from({length:5},(_,i)=>{
      const spread=45+i*25;
      return `
        <path class="pl-field"
              d="M235 145 C${220-spread} ${145-spread*2},
                 ${380+spread} ${145-spread*2},365 145"
              fill="none" stroke="#58dbff" stroke-width="2"/>
        <path class="pl-field"
              d="M235 155 C${220-spread} ${155+spread*2},
                 ${380+spread} ${155+spread*2},365 155"
              fill="none" stroke="#58dbff" stroke-width="2"/>
      `;
    }).join('');

    scene(`
      <g transform="rotate(${s.direction},300,150)">
        ${lines}
        <rect x="235" y="115" width="65" height="70"
              fill="#ed5266" rx="5"/>
        <rect x="300" y="115" width="65" height="70"
              fill="#4389f4" rx="5"/>
        <text x="267" y="157" fill="white" text-anchor="middle"
              font-size="25">N</text>
        <text x="332" y="157" fill="white" text-anchor="middle"
              font-size="25">S</text>
      </g>
      <text x="300" y="28" text-anchor="middle" fill="#b9edff">
        MAGNETIC FIELD LINES
      </text>
    `, `
      <strong>Relative field strength:</strong> ${s.strength}%<br>
      <strong>Magnet rotation:</strong> ${s.direction}°<br>
      <strong>Principle:</strong> Field lines illustrate magnetic field direction.
    `);
  }

  const animated = {
    pendulum, thermal, photoelectric, induction,
    newton, prism, spring, lens, sound, magnetic
  };

  startExperiment = function(key) {
    if (!animated[key]) {
      previousStart(key);
      return;
    }

    const config=CONFIG[key];
    currentExperiment=key;
    experimentState={};

    config.forEach(c=>{
      experimentState[c[0]]=c[4];
    });

    document.querySelector('#activeExperimentTitle').textContent =
      EXPERIMENTS[key].title;

    document.querySelector('#activeExperimentDescription').textContent =
      EXPERIMENTS[key].description;

    document.querySelector('#experimentExplanation').innerHTML =
      `<p>${EXPERIMENTS[key].description}</p>
       <p>Move the controls and observe how the animated simulation changes.</p>`;

    const complete=document.querySelector('#completeExperiment');
    complete.disabled=false;
    complete.textContent=progress.completed.includes(key)
      ? 'Experiment Completed ✓'
      : 'Complete Experiment ✓';

    const controls=document.querySelector('#experimentControls');
    controls.innerHTML=config.map(rangeControl).join('');

    controls.querySelectorAll('input').forEach(input=>{
      input.addEventListener('input',()=>{
        experimentState[input.id]=Number(input.value);
        const unit=config.find(c=>c[0]===input.id)?.[6] || '';
        const label=document.getElementById(`${input.id}Value`);
        if(label) label.textContent=input.value+unit;
        renderExperiment();
      });
    });

    navigate('experimentWorkspace');
    renderExperiment();
  };

  renderExperiment = function() {
    if (animated[currentExperiment]) {
      animated[currentExperiment](experimentState);
      return;
    }
    previousRender();
  };

  // Build after all earlier initialization handlers.
  function initializeUpgrade() {
    buildCatalog();
    updateLevelDisplay();
    console.log('PocketLab animated Physics upgrade loaded.');
  }

  if(document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded',initializeUpgrade);
  } else {
    initializeUpgrade();
  }

  // The earlier delegated Physics-card handler opens these buttons.
  // Register a fallback only when the old fix is not present.
  if (!window.__pocketPhysicsUpgradeClickFallback) {
    window.__pocketPhysicsUpgradeClickFallback=true;
    document.addEventListener('click',event=>{
      const button=event.target.closest(
        '.pl-physics-card [data-experiment]'
      );
      if(!button) return;

      // The previously installed delegated handler already handles
      // these buttons. This handler deliberately does not launch twice.
    });
  }
})();

/* ===================================================
   POCKETLAB 3.0
   ELECTROMAGNETIC INDUCTION — COMPLETE FIX
   + REMOVE UNWANTED CIRCUIT EXPERIMENTS
   =================================================== */

(() => {
  'use strict';

  const removedKeys = new Set([
    'ac',
    'rc',
    'rl',
    'capacitor',
    'kirchhoff',
    'thevenin',
    'advancedCircuit'
  ]);

  const removedTitles = new Set([
    'ac circuit',
    'rc circuit',
    'rl circuit',
    'capacitor charging & discharging',
    "kirchhoff's laws",
    "kirchhoff's law",
    "thevenin's theorem",
    'series & parallel circuit',
    'advanced circuit'
  ]);

  const normalize = value => (value || '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  // REMOVE OLD CIRCUIT EXPERIMENT CARDS
  function removeOldCircuitCards() {
    const lab = document.querySelector('#laboratory');
    if (!lab) return;

    lab.querySelectorAll(
      '.experiment-card, .pl-physics-card, .lab-card'
    ).forEach(card => {
      const button = card.querySelector(
        '[data-experiment]'
      );

      const key =
        button?.dataset.experiment ||
        card.dataset.experiment;

      const title = card.querySelector(
        'h3, h4, .experiment-title, .pl-experiment-title'
      )?.textContent;

      if (
        removedKeys.has(key) ||
        removedTitles.has(normalize(title))
      ) {
        card.remove();
      }
    });
  }

  function watchCatalog() {
    const lab = document.querySelector('#laboratory');
    if (!lab) return;

    removeOldCircuitCards();

    // Remove unwanted cards if an older script
    // attempts to recreate them.
    const observer = new MutationObserver(() => {
      removeOldCircuitCards();
    });

    observer.observe(lab, {
      childList: true,
      subtree: true
    });
  }

  // PREMIUM INDUCTION SIMULATION STYLING
  const stylesheet = document.createElement('style');

  stylesheet.textContent = `
    .pli-panel {
      width: 100%;
      max-width: 780px;
      margin: auto;
      text-align: left;
    }

    .pli-scene {
      overflow: hidden;
      border-radius: 18px;
      background:
        radial-gradient(
          ellipse at 50% 45%,
          #173b61,
          #061326 76%
        );
      border: 1px solid #29618c;
    }

    .pli-scene svg {
      display: block;
      width: 100%;
      height: auto;
    }

    .pli-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 14px 0;
    }

    .pli-actions button {
      padding: 11px 17px;
      border: 1px solid #4ccde5;
      border-radius: 10px;
      background: #087eaa;
      color: white;
      font-weight: 700;
      cursor: pointer;
    }

    .pli-actions button:nth-child(2),
    .pli-actions button:nth-child(3) {
      background: #19334c;
    }

    .pli-actions button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .pli-results {
      display: grid;
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .pli-reading {
      padding: 12px;
      border: 1px solid #315676;
      border-radius: 11px;
      background: #102a45;
    }

    .pli-reading small {
      display: block;
      color: #a3cae4;
      margin-bottom: 5px;
    }

    .pli-reading strong {
      display: block;
      color: #85f5fa;
      font-size: 20px;
    }

    .pli-challenge {
      padding: 14px;
      margin-top: 16px;
      border: 1px solid #32628a;
      border-radius: 13px;
      background: #10243a;
    }

    .pli-challenge h4 {
      margin: 0 0 10px;
      color: #80f0e2;
    }

    .pli-choice {
      display: block;
      width: 100%;
      text-align: left;
      padding: 9px 11px;
      margin: 6px 0;
      border: 1px solid #315574;
      border-radius: 8px;
      background: #193954;
      color: #e6f6ff;
      cursor: pointer;
    }

    .pli-choice:hover {
      border-color: #6ee6f6;
    }

    @media (max-width: 520px) {
      .pli-results {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(stylesheet);

  // PRESERVE ALL OTHER EXPERIMENTS
  const oldStart = startExperiment;
  const oldRender = renderExperiment;

  let induction = null;

  function endInduction() {
    if (!induction) return;

    induction.running = false;
    cancelAnimationFrame(induction.frame);
    induction = null;
  }

  // ELECTROMAGNETIC INDUCTION WORKSPACE
  function inductionPage() {
    endInduction();

    currentExperiment = 'induction';

    experimentState = {
      turns: 180,
      speed: 55,
      field: 1
    };

    const title = document.querySelector(
      '#activeExperimentTitle'
    );

    const description = document.querySelector(
      '#activeExperimentDescription'
    );

    const explanation = document.querySelector(
      '#experimentExplanation'
    );

    if (title) {
      title.textContent =
        'Electromagnetic Induction';
    }

    if (description) {
      description.textContent =
        'Move a bar magnet through a coil and watch the induced voltage change direction.';
    }

    if (explanation) {
      explanation.innerHTML = `
        <p>
          <strong>Faraday's Law:</strong>
          Induced EMF depends on the rate of
          change of magnetic flux.
        </p>
        <p>
          Faster magnet movement, more coil
          turns and a stronger magnetic field
          can increase the induced voltage.
          A stationary magnet induces no voltage.
        </p>
      `;
    }

    const complete = document.querySelector(
      '#completeExperiment'
    );

    if (complete) {
      complete.disabled = false;

      complete.textContent =
        progress.completed.includes('induction')
          ? 'Experiment Completed ✓'
          : 'Complete Experiment ✓';
    }

    const controls = document.querySelector(
      '#experimentControls'
    );

    const canvas = document.querySelector(
      '#simulationCanvas'
    );

    const results = document.querySelector(
      '#experimentResults'
    );

    if (!controls || !canvas || !results) return;

    // LIVE SLIDER CONTROLS
    controls.innerHTML = `
      <div class="control-group">
        <label for="pliTurns">
          Coil turns:
          <span id="pliTurnsValue">180</span>
        </label>

        <input
          id="pliTurns"
          type="range"
          min="20"
          max="500"
          step="10"
          value="180"
        >
      </div>

      <div class="control-group">
        <label for="pliSpeed">
          Magnet speed:
          <span id="pliSpeedValue">55%</span>
        </label>

        <input
          id="pliSpeed"
          type="range"
          min="0"
          max="100"
          step="5"
          value="55"
        >
      </div>

      <div class="control-group">
        <label for="pliField">
          Magnetic field:
          <span id="pliFieldValue">1.0 T</span>
        </label>

        <input
          id="pliField"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value="1"
        >
      </div>
    `;

    // REAL MOVING MAGNET + COIL + VOLTMETER
    canvas.innerHTML = `
      <div class="pli-panel">

        <div class="pli-scene">
          <svg
            viewBox="0 0 650 300"
            role="img"
            aria-label="Animated magnet moving through a copper coil with a live voltmeter"
          >
            <defs>
              <linearGradient
                id="pliCopper"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0"
                  stop-color="#a75b1e"
                />
                <stop
                  offset=".5"
                  stop-color="#ffca73"
                />
                <stop
                  offset="1"
                  stop-color="#b96b25"
                />
              </linearGradient>
            </defs>

            <text
              x="215" y="32"
              text-anchor="middle"
              fill="#c5e6ff"
              font-size="16"
            >MOVING MAGNET</text>

            <text
              x="345" y="32"
              text-anchor="middle"
              fill="#c5e6ff"
              font-size="16"
            >COPPER COIL</text>

            <g
              id="pliMagnet"
              transform="translate(125,0)"
            >
              <path
                d="M-83 106 Q0 32 83 106
                   M-83 194 Q0 268 83 194"
                fill="none"
                stroke="#56d6ef"
                stroke-width="2"
                opacity=".4"
              />

              <rect
                x="-60" y="118"
                width="60" height="55"
                rx="5"
                fill="#ee526c"
              />

              <rect
                x="0" y="118"
                width="60" height="55"
                rx="5"
                fill="#438bf4"
              />

              <text
                x="-30" y="153"
                text-anchor="middle"
                fill="white"
                font-size="21"
                font-weight="bold"
              >N</text>

              <text
                x="30" y="153"
                text-anchor="middle"
                fill="white"
                font-size="21"
                font-weight="bold"
              >S</text>
            </g>

            <g
              id="pliCoil"
              fill="none"
              stroke="url(#pliCopper)"
              stroke-width="6"
            >
              ${Array.from(
                { length: 8 },
                (_, i) => `
                  <ellipse
                    cx="${294 + i * 13}"
                    cy="146"
                    rx="22"
                    ry="75"
                  />
                `
              ).join('')}
            </g>

            <path
              d="M398 80 H548 V105
                 M398 215 H548 V187"
              fill="none"
              stroke="#56dbf2"
              stroke-width="3"
            />

            <circle
              cx="548" cy="146" r="55"
              fill="#0b2138"
              stroke="#66d8f5"
              stroke-width="3"
            />

            <path
              d="M506 164 Q548 90 590 164"
              fill="none"
              stroke="#8ca9c8"
              stroke-width="2"
            />

            <text
              x="513" y="174"
              fill="#a5d8f0"
              font-size="12"
            >−</text>

            <text
              x="578" y="174"
              fill="#a5d8f0"
              font-size="12"
            >+</text>

            <g
              id="pliNeedle"
              transform="rotate(0 548 146)"
            >
              <line
                x1="548" y1="146"
                x2="548" y2="111"
                stroke="#ffad65"
                stroke-width="4"
                stroke-linecap="round"
              />
            </g>

            <circle
              cx="548" cy="146"
              r="6"
              fill="#fff0c5"
            />

            <text
              x="548" y="215"
              text-anchor="middle"
              fill="#a3eaf6"
              font-size="14"
            >VOLTMETER</text>

            <text
              id="pliDirection"
              x="325" y="269"
              text-anchor="middle"
              fill="#85eff1"
              font-size="17"
            >Ready</text>

          </svg>
        </div>

        <div class="pli-actions">
          <button
            type="button"
            id="pliStart"
          >▶ Start Experiment</button>

          <button
            type="button"
            id="pliPause"
            disabled
          >⏸ Pause</button>

          <button
            type="button"
            id="pliReset"
          >↻ Reset</button>
        </div>

        <div class="pli-challenge">
          <h4>🧠 Predict Before You Experiment</h4>

          <p>
            What happens to the induced voltage
            when the magnet stops moving?
          </p>

          <button
            class="pli-choice"
            type="button"
            data-pli-answer="wrong"
          >A. Voltage increases</button>

          <button
            class="pli-choice"
            type="button"
            data-pli-answer="right"
          >B. Voltage becomes zero</button>

          <button
            class="pli-choice"
            type="button"
            data-pli-answer="wrong"
          >C. Voltage stays constant</button>

          <p
            id="pliFeedback"
            aria-live="polite"
          >Choose your prediction!</p>
        </div>

      </div>
    `;

    // EXPERIMENT RESULTS
    results.innerHTML = `
      <div class="pli-results">

        <div class="pli-reading">
          <small>Induced Voltage (Model)</small>
          <strong id="pliVoltage">
            0.000 V
          </strong>
        </div>

        <div class="pli-reading">
          <small>Magnetic Flux per Turn</small>
          <strong id="pliFlux">
            0.000 mWb
          </strong>
        </div>

        <div class="pli-reading">
          <small>Oscillations Completed</small>
          <strong id="pliCycles">
            0
          </strong>
        </div>

        <div class="pli-reading">
          <small>Current Status</small>
          <strong id="pliStatus">
            Ready
          </strong>
        </div>

      </div>

      <p style="margin-top:14px">
        <strong>Faraday's Law:</strong>
        ε = −N(dΦ/dt)
      </p>

      <p style="font-size:13px;opacity:.8">
        Simplified magnetic-flux model.
        The needle responds to the calculated
        induced voltage.
      </p>
    `;

    const get = id => document.getElementById(id);

    induction = {
      running: false,
      frame: 0,
      last: 0,
      phase: -Math.PI / 2,
      turns: 180,
      speed: 55,
      field: 1
    };

    const state = induction;

    // LIVE PHYSICS CALCULATION
    function updateScene() {
      if (induction !== state) return;

      const frequency =
        state.speed === 0
          ? 0
          : 0.12 + state.speed * 0.006;

      const angularSpeed =
        2 * Math.PI * frequency;

      const x =
        245 + 125 * Math.sin(state.phase);

      const velocity = state.running
        ? 125 * angularSpeed * Math.cos(state.phase)
        : 0;

      const distance = x - 340;
      const sigma = 78;

      // Approximate the magnetic flux through
      // the coil as the magnet passes it.
      const coupling = Math.exp(
        -0.5 * (distance / sigma) ** 2
      );

      const area = 0.006;

      const flux =
        state.field * area * coupling;

      const fluxRate =
        state.field *
        area *
        coupling *
        (-distance / (sigma * sigma)) *
        velocity;

      // Faraday's law
      const emf = -state.turns * fluxRate;

      const meterAngle = Math.max(
        -65,
        Math.min(65, emf / 4 * 65)
      );

      // MOVE THE MAGNET
      get('pliMagnet').setAttribute(
        'transform',
        `translate(${x.toFixed(1)},0)`
      );

      // MOVE THE VOLTMETER NEEDLE
      get('pliNeedle').setAttribute(
        'transform',
        `rotate(${meterAngle.toFixed(1)} 548 146)`
      );

      // LIVE VALUES
      get('pliVoltage').textContent =
        `${emf >= 0 ? '+' : ''}${emf.toFixed(3)} V`;

      get('pliFlux').textContent =
        `${(flux * 1000).toFixed(3)} mWb`;

      get('pliCycles').textContent =
        Math.floor(
          Math.max(
            0,
            (state.phase + Math.PI / 2) /
            (2 * Math.PI)
          )
        );

      get('pliDirection').textContent =
        !state.running
          ? 'Stopped / Ready'
          : state.speed === 0
            ? 'Stationary magnet — no EMF'
            : Math.abs(velocity) < 1
              ? 'Magnet changing direction'
              : velocity > 0
                ? 'Magnet moving right →'
                : '← Magnet moving left';

      get('pliStatus').textContent =
        state.running
          ? 'Running'
          : state.phase === -Math.PI / 2
            ? 'Ready'
            : 'Paused';

      // Coil glow responds to induced voltage
      get('pliCoil').style.filter =
        `drop-shadow(
          0 0 ${
            Math.min(10, Math.abs(emf) * 5).toFixed(1)
          }px #ffd173
        )`;
    }

    // SMOOTH ANIMATION LOOP
    function frame(now) {
      if (induction !== state || !state.running) {
        return;
      }

      if (state.last) {
        const dt = Math.min(
          (now - state.last) / 1000,
          0.05
        );

        const hz =
          state.speed === 0
            ? 0
            : 0.12 + state.speed * 0.006;

        state.phase +=
          2 * Math.PI * hz * dt;
      }

      state.last = now;

      updateScene();

      state.frame = requestAnimationFrame(frame);
    }

    // START
    get('pliStart').addEventListener('click', () => {
      if (state.running) return;

      state.running = true;
      state.last = 0;

      get('pliStart').disabled = true;
      get('pliPause').disabled = false;

      state.frame = requestAnimationFrame(frame);
    });

    // PAUSE
    get('pliPause').addEventListener('click', () => {
      state.running = false;

      cancelAnimationFrame(state.frame);

      get('pliStart').disabled = false;
      get('pliPause').disabled = true;

      get('pliStart').textContent = '▶ Resume';

      updateScene();
    });

    // RESET
    get('pliReset').addEventListener('click', () => {
      state.running = false;

      cancelAnimationFrame(state.frame);

      state.phase = -Math.PI / 2;
      state.last = 0;

      get('pliStart').disabled = false;
      get('pliStart').textContent =
        '▶ Start Experiment';

      get('pliPause').disabled = true;

      updateScene();
    });

    // SLIDER CHANGES APPLY IMMEDIATELY
    [
      ['pliTurns', 'turns', ''],
      ['pliSpeed', 'speed', '%'],
      ['pliField', 'field', ' T']
    ].forEach(([id, key, unit]) => {
      get(id).addEventListener('input', event => {
        state[key] = Number(event.target.value);

        get(`${id}Value`).textContent =
          `${
            key === 'field'
              ? state[key].toFixed(1)
              : state[key]
          }${unit}`;

        experimentState[key] = state[key];

        updateScene();
      });
    });

    // CHALLENGE QUESTION
    canvas.querySelectorAll(
      '[data-pli-answer]'
    ).forEach(button => {
      button.addEventListener('click', () => {
        const correct =
          button.dataset.pliAnswer === 'right';

        get('pliFeedback').textContent =
          correct
            ? '✓ Correct! No change in magnetic flux means no induced voltage.'
            : 'Try stopping the magnet and watching the voltmeter.';
      });
    });

    navigate('experimentWorkspace');
    updateScene();
  }

  // APPLY CORRECTION WITHOUT BREAKING OTHER LABS
  startExperiment = function(key) {
    if (removedKeys.has(key)) {
      if (typeof showToast === 'function') {
        showToast(
          'This experiment was removed from the Physics catalog.'
        );
      }
      return;
    }

    if (key === 'induction') {
      return inductionPage();
    }

    endInduction();
    return oldStart(key);
  };

  renderExperiment = function() {
    if (
      currentExperiment === 'induction' &&
      induction
    ) {
      return;
    }

    return oldRender();
  };

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      watchCatalog
    );
  } else {
    watchCatalog();
  }

})();

/* =====================================================
   POCKETLAB 3.0 — LEARNING UPGRADE
   FORMULAS + 5 MCQs + STUDENT QUESTION TUTOR
   PASTE AT THE BOTTOM OF script.js
   ===================================================== */

(() => {
  'use strict';

  const DATA = {
    circuit: [
      'I = V/R; P = VI',
      'Voltage, current and resistance obey Ohm’s law.',
      'voltage increases while resistance stays fixed',
      'Current increases.',
      'Current in amperes (A)',
      'At fixed resistance, current increases with voltage.',
      'A real bulb may not have constant resistance.'
    ],

    motion: [
      'F = ma',
      'Net force produces acceleration.',
      'net force increases at constant mass',
      'Acceleration increases.',
      'Acceleration in m/s²',
      'Acceleration equals net force divided by mass.',
      'The force must be the net force.'
    ],

    reflection: [
      'Angle of incidence = Angle of reflection',
      'Light reflects at the same angle at which it strikes a plane mirror.',
      'the angle of incidence increases',
      'The angle of reflection increases.',
      'Angle of reflection',
      'Both angles are measured from the normal.',
      'Measure angles from the normal, not the mirror surface.'
    ],

    projectile: [
      'R = v² sin(2θ)/g',
      'Gravity changes the path of a projectile.',
      'launch speed increases at the same angle',
      'Range increases.',
      'Horizontal range',
      'Range depends on the square of launch speed.',
      'This assumes no air resistance and equal launch and landing heights.'
    ],

    floating: [
      'Fb = ρgV',
      'Buoyant force equals the weight of displaced fluid.',
      'object density becomes greater than water density',
      'The object tends to sink.',
      'Object density and fluid density',
      'An object sinks when its weight exceeds the maximum available buoyant force.',
      'Trapped air and average density also matter.'
    ],

    pendulum: [
      'T ≈ 2π√(L/g)',
      'The period of a small-angle pendulum depends on length and gravity.',
      'pendulum length increases',
      'The time period increases.',
      'Time for one oscillation',
      'The period is proportional to the square root of length.',
      'The formula is most accurate for small angles.'
    ],

    thermal: [
      'ΔL = αL₀ΔT',
      'A heated metal rod generally expands.',
      'temperature increases',
      'The metal rod expands more.',
      'Change in rod length',
      'Expansion increases with temperature change.',
      'The animation may exaggerate expansion to make it visible.'
    ],

    photoelectric: [
      'Kmax = hf − φ',
      'Photons can release electrons from a metal surface.',
      'light frequency rises above the threshold',
      'Maximum electron kinetic energy increases.',
      'Electron kinetic energy',
      'A photon must have enough energy to overcome the work function.',
      'Increasing intensity alone cannot overcome a below-threshold frequency.'
    ],

    induction: [
      'ε = −N(dΦ/dt)',
      'Changing magnetic flux generates an induced voltage.',
      'the magnet stops moving relative to the coil',
      'Induced voltage becomes zero if the flux stops changing.',
      'Induced voltage and needle direction',
      'Induced voltage depends on the rate of change of magnetic flux.',
      'Reversing magnet movement can reverse the voltage polarity.'
    ],

    newton: [
      'p = mv; KE = ½mv²',
      'Collisions transfer momentum and energy.',
      'the released ball moves faster',
      'More kinetic energy becomes available.',
      'Motion of balls after collision',
      'An ideal cradle approximately conserves momentum and kinetic energy.',
      'Real collisions lose some energy.'
    ],

    prism: [
      'n = c/v',
      'A prism separates white light into colors.',
      'white light passes through a glass prism',
      'The colors separate into a spectrum.',
      'Separation of colors',
      'Different wavelengths refract by different amounts.',
      'The amount of dispersion depends on the prism material.'
    ],

    spring: [
      'F = −kx; T = 2π√(m/k)',
      'A spring provides a restoring force.',
      'hanging mass increases at constant stiffness',
      'The oscillation period increases.',
      'Oscillation period',
      'The period increases with the square root of mass.',
      'The simple model assumes an ideal spring.'
    ],

    lens: [
      '1/f = 1/u + 1/v',
      'A convex lens bends light rays to form images.',
      'the object moves farther beyond the focal point',
      'The real image moves closer to the focal plane.',
      'Image position and magnification',
      'Focal length and object distance determine image formation.',
      'This uses the positive-distance thin-lens convention for a real image.'
    ],

    sound: [
      'v = fλ',
      'Sound travels as a mechanical wave.',
      'frequency increases while wave speed stays fixed',
      'Wavelength decreases.',
      'Frequency and wavelength',
      'Wavelength equals wave speed divided by frequency.',
      'Amplitude mainly affects loudness.'
    ],

    magnetic: [
      'Φ = BA cosθ',
      'Magnetic flux depends on the field and surface orientation.',
      'the magnet rotates relative to a fixed surface',
      'Magnetic flux changes.',
      'Magnetic flux',
      'Orientation affects how much magnetic field passes through a surface.',
      'Magnetic field lines are visual representations.'
    ],

    ph: [
      'pH = −log₁₀(aH⁺)',
      'pH describes hydrogen-ion activity.',
      'hydrogen-ion activity increases',
      'pH decreases.',
      'pH and indicator color',
      'More hydrogen-ion activity means a lower pH.',
      'Neutral pH is about 7 at 25°C.'
    ],

    plant: [
      '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
      'Plants use light energy during photosynthesis.',
      'sunlight becomes insufficient',
      'Photosynthesis tends to decrease.',
      'Plant growth',
      'Light provides energy for photosynthesis.',
      'Plant growth also depends on nutrients, temperature and water.'
    ],

    graph: [
      'y = ax² + bx + c',
      'The coefficient a controls the opening of a parabola.',
      'coefficient a changes from positive to negative',
      'The parabola opens downward instead of upward.',
      'Graph shape',
      'The sign of a determines the opening direction.',
      'If a is zero, the function becomes linear.'
    ]
  };

  const GENERIC = [
    'Percentage change = (change/original) × 100',
    'Scientific experiments show relationships between variables.',
    'an independent variable changes',
    'The measured result may change.',
    'Experimental observations',
    'Changing one variable helps reveal its effect.',
    'Keep other important variables controlled.'
  ];

  const get = id => document.getElementById(id);

  const state = {
    key: '',
    questions: [],
    index: 0,
    score: 0,
    answered: false
  };

  function getData(key) {
    return DATA[key] || GENERIC;
  }

  function experimentTitle(key) {
    return EXPERIMENTS[key]?.title || key;
  }

  /* ===============================
     PREMIUM STYLING
     =============================== */

  const style = document.createElement('style');

  style.textContent = `
    #plFormula,
    #plLearning {
      background: linear-gradient(145deg,#102b48,#07182b);
      border: 1px solid #295b80;
      border-radius: 16px;
      padding: 20px;
      margin-top: 18px;
      color: #e7f5ff;
    }

    #plFormula h3,
    #plLearning h3 {
      color: #6cf4e5;
      margin: 0 0 14px;
    }

    #plFormulaValue {
      font-size: 24px;
      font-weight: 800;
      color: #ffdf83;
      line-height: 1.6;
      overflow-wrap: anywhere;
    }

    #plLearning {
      width: 100%;
      box-sizing: border-box;
    }

    .plSection {
      padding: 18px;
      border: 1px solid #2b5375;
      background: #0b223b;
      border-radius: 14px;
      margin-bottom: 18px;
    }

    .plOption {
      display: block;
      width: 100%;
      padding: 14px;
      margin: 9px 0;
      border: 1px solid #386487;
      background: #173a57;
      color: white;
      border-radius: 10px;
      text-align: left;
      cursor: pointer;
      font-size: 15px;
    }

    .plOption:hover:not(:disabled) {
      background: #24577d;
      border-color: #6cddf4;
    }

    .plCorrect {
      background: #165547 !important;
      border-color: #45ecb3 !important;
    }

    .plWrong {
      background: #572b3c !important;
      border-color: #ff7785 !important;
    }

    .plButton {
      padding: 12px 22px;
      color: white;
      font-weight: 700;
      background: linear-gradient(110deg,#149bda,#305df0);
      border: 1px solid #58baff;
      border-radius: 10px;
      cursor: pointer;
      margin-top: 12px;
    }

    .plButton:disabled {
      opacity: .45;
      cursor: not-allowed;
    }

    #plQuestionInput {
      width: 100%;
      min-height: 90px;
      padding: 14px;
      box-sizing: border-box;
      background: #07182b;
      border: 1px solid #4a7897;
      border-radius: 12px;
      color: white;
      font-size: 15px;
      resize: vertical;
      font-family: inherit;
    }

    #plChat {
      max-height: 350px;
      overflow-y: auto;
      margin: 15px 0;
      display: grid;
      gap: 12px;
    }

    .plMessage {
      padding: 13px;
      border-radius: 11px;
      line-height: 1.6;
      background: #15354f;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .plStudent {
      background: #20496a;
      border: 1px solid #3785b4;
    }

    .plProgress {
      color: #9bcfe5;
      font-size: 14px;
      margin-bottom: 10px;
    }

    #plFeedback {
      padding: 10px 0;
      line-height: 1.6;
    }

    @media(max-width:650px) {
      #plFormulaValue {
        font-size: 19px;
      }
    }
  `;

  document.head.appendChild(style);

  /* ===============================
     GENERATE FIVE MCQs
     =============================== */

  function buildQuestions(key) {
    const data = getData(key);

    const [
      formula,
      principle,
      change,
      effect,
      measurement,
      reason,
      note
    ] = data;

    const otherKeys = Object.keys(DATA)
      .filter(k => k !== key);

    function otherValues(index) {
      return otherKeys
        .map(k => DATA[k][index])
        .filter(Boolean);
    }

    function make(question, answer, wrong, explanation, position) {
      const alternatives = wrong
        .filter(x => x !== answer)
        .slice(0, 3);

      while (alternatives.length < 3) {
        alternatives.push('None of these relationships');
      }

      const options = [answer, ...alternatives];

      const offset = position % 4;

      const rotated = options
        .slice(offset)
        .concat(options.slice(0, offset));

      return {
        question,
        options: rotated,
        correct: (4 - offset) % 4,
        explanation
      };
    }

    return [
      make(
        `Which formula applies to ${experimentTitle(key)}?`,
        formula,
        [
          'F = ma',
          'pH = −log₁₀(aH⁺)',
          'T = 2π√(L/g)',
          'E = mc²'
        ],
        `Correct formula: ${formula}`,
        0
      ),

      make(
        `What principle does ${experimentTitle(key)} demonstrate?`,
        principle,
        otherValues(1).slice(2, 5),
        reason,
        1
      ),

      make(
        `What happens when ${change}?`,
        effect,
        otherValues(3).slice(5, 8),
        reason,
        2
      ),

      make(
        'What should students observe or measure?',
        measurement,
        otherValues(4).slice(8, 11),
        `Observe: ${measurement}`,
        3
      ),

      make(
        'Which explanation is correct?',
        reason,
        otherValues(5).slice(12, 15),
        note,
        0
      )
    ];
  }

  /* ===============================
     FORMULA + LEARNING SECTION
     =============================== */

  function mountLearning(key) {
    const workspace = get('experimentWorkspace');
    const results = get('experimentResults');

    if (!workspace || !results) return;

    state.key = key;
    state.questions = buildQuestions(key);
    state.index = 0;
    state.score = 0;
    state.answered = false;

    const data = getData(key);

    // FORMULA BELOW RIGHT-SIDE RESULTS
    let formulaBox = get('plFormula');

    if (!formulaBox) {
      formulaBox = document.createElement('section');
      formulaBox.id = 'plFormula';
    }

    results.insertAdjacentElement(
      'afterend',
      formulaBox
    );

    formulaBox.innerHTML = `
      <h3>📐 Experiment Formula</h3>
      <div id="plFormulaValue"></div>
      <p id="plFormulaExplanation"></p>
    `;

    get('plFormulaValue').textContent = data[0];

    get('plFormulaExplanation').textContent =
      data[6];

    // MCQ AND TUTOR AREA
    let learning = get('plLearning');

    if (!learning) {
      learning = document.createElement('section');
      learning.id = 'plLearning';
      workspace.appendChild(learning);
    }

    learning.innerHTML = `
      <div class="plSection">
        <h3>🧠 Test Your Knowledge — 5 MCQs</h3>

        <p class="plProgress" id="plQuizProgress"></p>

        <h3 id="plQuizQuestion"></h3>

        <div id="plQuizOptions"></div>

        <p id="plFeedback" aria-live="polite"></p>

        <button
          id="plNext"
          class="plButton"
          type="button"
          disabled
        >
          Next Question →
        </button>
      </div>

      <div class="plSection">
        <h3>💬 Ask PocketLab Tutor</h3>

        <p>
          Ask a question about this experiment,
          its formula, results, or scientific principle.
        </p>

        <div
          id="plChat"
          aria-live="polite"
        ></div>

        <form id="plAskForm">

          <textarea
            id="plQuestionInput"
            placeholder="Example: Why does the induced voltage become zero when the magnet stops?"
            maxlength="500"
            required
          ></textarea>

          <button
            class="plButton"
            type="submit"
            id="plSend"
          >
            ➤ Send Question
          </button>

        </form>
      </div>
    `;

    get('plNext').addEventListener(
      'click',
      nextQuestion
    );

    get('plQuizOptions').addEventListener(
      'click',
      answerQuestion
    );

    get('plAskForm').addEventListener(
      'submit',
      sendQuestion
    );

    showQuestion();

    addMessage(
      'tutor',
      `Welcome! Ask me anything about ${
        experimentTitle(key)
      }.

For example:
• What is the formula?
• Why does this experiment work?
• What happens when ${data[2]}?`
    );
  }

  /* ===============================
     MCQ — ONE QUESTION AT A TIME
     =============================== */

  function showQuestion() {
    const question = state.questions[state.index];

    if (!question) return;

    state.answered = false;

    get('plQuizProgress').textContent =
      `Question ${state.index + 1} of 5 | Score: ${state.score}/5`;

    get('plQuizQuestion').textContent =
      question.question;

    const container = get('plQuizOptions');
    container.innerHTML = '';

    question.options.forEach((option, index) => {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'plOption';
      button.dataset.answer = index;

      button.textContent =
        `${String.fromCharCode(65 + index)}. ${option}`;

      container.appendChild(button);
    });

    get('plFeedback').textContent =
      'Choose the correct answer.';

    const next = get('plNext');

    next.disabled = true;

    next.textContent =
      state.index === 4
        ? 'Finish Quiz ✓'
        : 'Next Question →';
  }

  function answerQuestion(event) {
    const button = event.target.closest(
      '[data-answer]'
    );

    if (!button || state.answered) return;

    state.answered = true;

    const question = state.questions[state.index];

    const selected = Number(
      button.dataset.answer
    );

    const correct = selected === question.correct;

    if (correct) {
      state.score++;
    }

    get('plQuizOptions')
      .querySelectorAll('button')
      .forEach(option => {
        option.disabled = true;

        const index = Number(
          option.dataset.answer
        );

        if (index === question.correct) {
          option.classList.add('plCorrect');
        } else if (index === selected) {
          option.classList.add('plWrong');
        }
      });

    get('plFeedback').textContent =
      `${correct ? '✅ Correct!' : '❌ Incorrect.'} ${
        question.explanation
      }`;

    get('plQuizProgress').textContent =
      `Question ${state.index + 1} of 5 | Score: ${state.score}/5`;

    get('plNext').disabled = false;
  }

  function nextQuestion() {
    if (!state.answered) return;

    if (state.index < 4) {
      state.index++;
      showQuestion();
      return;
    }

    finishQuiz();
  }

  function finishQuiz() {
    get('plQuizProgress').textContent =
      'Quiz Completed!';

    get('plQuizQuestion').textContent =
      `🏆 Final Score: ${state.score} / 5`;

    get('plQuizOptions').textContent =
      state.score === 5
        ? 'Excellent! You answered all five questions correctly!'
        : 'Good effort! Review the formula and try again.';

    get('plFeedback').textContent =
      'You can continue asking the tutor questions.';

    const button = get('plNext');

    button.textContent = '↻ Retry Quiz';
    button.disabled = false;

    button.replaceWith(button.cloneNode(true));

    get('plNext').addEventListener('click', () => {
      state.index = 0;
      state.score = 0;
      state.answered = false;

      mountLearning(state.key);
    });

    state.answered = false;
  }

  /* ===============================
     POCKETLAB TUTOR
     =============================== */

  function addMessage(role, message) {
    const chat = get('plChat');

    if (!chat) return;

    const bubble = document.createElement('div');

    bubble.className =
      'plMessage' +
      (role === 'student' ? ' plStudent' : '');

    bubble.textContent =
      `${role === 'student' ? 'You' : 'PocketLab Tutor'}: ${message}`;

    chat.appendChild(bubble);

    chat.scrollTop = chat.scrollHeight;
  }

  function offlineAnswer(question, key) {
    const q = question.toLowerCase();

    const [
      formula,
      principle,
      change,
      effect,
      measurement,
      reason,
      note
    ] = getData(key);

    if (/(hello|hi|hey)/.test(q)) {
      return `Hello! I'm your PocketLab Tutor. We're learning about ${experimentTitle(key)}.`;
    }

    if (/(formula|equation|calculate|law)/.test(q)) {
      return `The formula is ${formula}. ${reason}`;
    }

    if (key === 'induction') {
      if (/(stop|stationary|zero|still)/.test(q)) {
        return 'When the magnet stops, magnetic flux stops changing. Therefore the induced voltage becomes zero, provided nothing else changes the flux.';
      }

      if (/(fast|speed|slow)/.test(q)) {
        return 'Moving the magnet faster creates a faster change in magnetic flux, producing a greater induced voltage in the simplified model.';
      }

      if (/(coil|turns)/.test(q)) {
        return 'Increasing the number of coil turns increases induced EMF for the same rate of change of flux per turn.';
      }

      if (/(reverse|direction|needle)/.test(q)) {
        return 'Reversing the change in magnetic flux reverses the polarity of the induced voltage, causing the meter needle to deflect the other way.';
      }
    }

    if (key === 'pendulum') {
      if (/(length|long|short)/.test(q)) {
        return 'Increasing pendulum length increases its time period. T ≈ 2π√(L/g).';
      }

      if (/(mass|weight|heavy)/.test(q)) {
        return 'For an ideal small-angle pendulum, the bob mass does not affect its time period.';
      }

      if (/(angle|amplitude)/.test(q)) {
        return 'For small angles, the period changes very little with starting angle. At larger angles, the period becomes longer.';
      }
    }

    if (key === 'thermal') {
      if (/(heat|temperature|expand|rod)/.test(q)) {
        return 'Heating a metal rod increases its average atomic spacing. Its approximate expansion is ΔL = αL₀ΔT.';
      }
    }

    if (key === 'photoelectric') {
      if (/(intensity|brightness)/.test(q)) {
        return 'Increasing light intensity can increase the number of emitted electrons when the light frequency is above the threshold.';
      }

      if (/(frequency|electron|photon|threshold)/.test(q)) {
        return 'Each photon has energy hf. Photoelectrons are emitted only when photon energy is at least the work function.';
      }
    }

    if (key === 'spring') {
      if (/(mass|spring|stiffness)/.test(q)) {
        return 'An ideal spring oscillator follows T = 2π√(m/k). Increasing mass increases the period; increasing stiffness decreases it.';
      }
    }

    if (key === 'sound') {
      if (/(pitch|frequency|amplitude|loud)/.test(q)) {
        return 'Higher frequency produces higher pitch, while greater amplitude generally produces louder sound.';
      }
    }

    if (/(what is|define|principle|explain)/.test(q)) {
      return `${principle} ${note}`;
    }

    if (/(why|how does|reason)/.test(q)) {
      return `${reason} ${note}`;
    }

    if (/(increase|decrease|change|happen|more|less)/.test(q)) {
      return `When ${change}, ${effect.toLowerCase()} ${reason}`;
    }

    if (/(observe|measure|result|reading)/.test(q)) {
      return `You should observe ${measurement.toLowerCase()}. ${principle}`;
    }

    if (/(example|application|real life|use)/.test(q)) {
      return `${principle} ${note}`;
    }

    return `For ${experimentTitle(key)}, ${principle}

Main formula: ${formula}

You can ask me about the formula, variables, observations, or why the result changes. For other open-ended questions, an AI service must be connected.`;
  }

  async function sendQuestion(event) {
    event.preventDefault();

    const input = get('plQuestionInput');
    const send = get('plSend');

    const question = input.value.trim();

    if (!question) return;

    input.value = '';

    addMessage('student', question);

    const key = state.key;

    // OPTIONAL REAL AI BACKEND
    // Configure window.POCKETLAB_ASK_URL with
    // a secure server endpoint if available.

    const endpoint = window.POCKETLAB_ASK_URL;

    if (endpoint && typeof endpoint === 'string') {
      try {
        send.disabled = true;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            question,
            experiment: experimentTitle(key),
            formula: getData(key)[0]
          })
        });

        if (!response.ok) {
          throw new Error('AI service unavailable');
        }

        const data = await response.json();

        if (!data.answer) {
          throw new Error('No answer returned');
        }

        if (state.key === key) {
          addMessage('tutor', data.answer);
        }

      } catch (error) {
        if (state.key === key) {
          addMessage(
            'tutor',
            offlineAnswer(question, key)
          );
        }

      } finally {
        send.disabled = false;
      }

    } else {
      addMessage(
        'tutor',
        offlineAnswer(question, key)
      );
    }
  }

  /* ===============================
     CONNECT TO EVERY EXPERIMENT
     =============================== */

  if (typeof startExperiment === 'function') {
    const originalStartExperiment = startExperiment;

    startExperiment = function(key, ...args) {
      const output = originalStartExperiment.call(
        this,
        key,
        ...args
      );

      if (
        typeof key === 'string' &&
        EXPERIMENTS[key] &&
        get('experimentWorkspace')
      ) {
        queueMicrotask(() => {
          mountLearning(key);
        });
      }

      return output;
    };
  }

  // Also detect experiments opened by other scripts.
  function observeWorkspace() {
    const title = get('activeExperimentTitle');

    if (!title) return;

    let previousTitle = '';

    new MutationObserver(() => {
      const currentTitle =
        title.textContent.trim();

      if (
        !currentTitle ||
        currentTitle === previousTitle
      ) {
        return;
      }

      previousTitle = currentTitle;

      const key = Object.keys(EXPERIMENTS)
        .find(k =>
          EXPERIMENTS[k].title === currentTitle
        );

      if (key && state.key !== key) {
        queueMicrotask(() => {
          mountLearning(key);
        });
      }

    }).observe(title, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      observeWorkspace
    );
  } else {
    observeWorkspace();
  }

  console.log(
    'PocketLab 3.0 Learning Upgrade Loaded!'
  );

})();

/* =====================================================
   POCKETLAB 3.0 — PENDULUM CONTROL UPGRADE
   START + PAUSE + STOP + RESET
   LIVE TIMER + OSCILLATION COUNTER
   PASTE AT THE BOTTOM OF script.js
   ===================================================== */

(() => {
  'use strict';

  const previousRender = renderExperiment;
  const previousStart = startExperiment;

  const defaults = {
    length: 1.2,
    angle: 35,
    gravity: 9.81
  };

  const pendulum = {
    running: false,
    stopped: false,
    elapsed: 0,
    lastTime: null,
    frame: null
  };

  /* ================================
     BUTTON STYLING
     ================================ */

  const style = document.createElement('style');

  style.textContent = `
    #simulationCanvas:has(.plp-buttons) {
      display: block;
      width: 100%;
    }

    .plp-buttons {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      width: 100%;
      margin-top: 18px;
    }

    .plp-btn {
      border: 1px solid #4db9e9;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      cursor: pointer;
      transition: transform .2s, opacity .2s;
    }

    .plp-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .plp-btn:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .plp-start {
      background: linear-gradient(120deg,#08a991,#14cbb6);
    }

    .plp-pause {
      background: linear-gradient(120deg,#1675d9,#355ee9);
    }

    .plp-stop {
      background: linear-gradient(120deg,#e46c35,#e1424d);
    }

    .plp-reset {
      background: #30445d;
    }

    .plp-stats {
      display: grid;
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 10px;
      width: 100%;
      margin-top: 15px;
    }

    .plp-stat {
      padding: 12px;
      border: 1px solid #315a7c;
      border-radius: 12px;
      background: #102940;
      text-align: center;
      min-width: 0;
    }

    .plp-stat small {
      display: block;
      color: #a5c8e2;
      font-size: 12px;
      margin-bottom: 6px;
    }

    .plp-stat strong {
      display: block;
      color: #79eff0;
      font-size: 18px;
    }

    @media(max-width:500px) {
      .plp-buttons {
        gap: 8px;
      }

      .plp-btn {
        padding: 10px 12px;
        font-size: 12px;
      }

      .plp-stats {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);

  /* ================================
     PHYSICS
     ================================ */

  function getPeriod() {
    const length = Math.max(
      0.01,
      Number(experimentState.length) || defaults.length
    );

    const gravity = Math.max(
      0.01,
      Number(experimentState.gravity) || defaults.gravity
    );

    return 2 * Math.PI * Math.sqrt(length / gravity);
  }

  function getAngle() {
    return Number(experimentState.angle) || defaults.angle;
  }

  function stopAnimation() {
    pendulum.running = false;
    pendulum.lastTime = null;

    if (pendulum.frame !== null) {
      cancelAnimationFrame(pendulum.frame);
    }

    pendulum.frame = null;
  }

  /* ================================
     CONTROL PANEL BELOW SIMULATION
     ================================ */

  function addPendulumButtons() {
    if (currentExperiment !== 'pendulum') return;

    const canvas = document.getElementById(
      'simulationCanvas'
    );

    if (!canvas) return;

    const swing = canvas.querySelector('.pl-swing');

    if (!swing) return;

    // Disable the old automatic CSS animation.
    // JavaScript now controls the actual movement.
    swing.style.animation = 'none';

    if (!canvas.querySelector('.plp-buttons')) {
      canvas.insertAdjacentHTML('beforeend', `
        <div class="plp-buttons">

          <button
            type="button"
            class="plp-btn plp-start"
            data-plp="start"
          >
            ▶ Start
          </button>

          <button
            type="button"
            class="plp-btn plp-pause"
            data-plp="pause"
          >
            ⏸ Pause
          </button>

          <button
            type="button"
            class="plp-btn plp-stop"
            data-plp="stop"
          >
            ⏹ Stop
          </button>

          <button
            type="button"
            class="plp-btn plp-reset"
            data-plp="reset"
          >
            ↻ Reset
          </button>

        </div>

        <div class="plp-stats">

          <div class="plp-stat">
            <small>Elapsed Time</small>
            <strong id="plpTime">0.00 s</strong>
          </div>

          <div class="plp-stat">
            <small>Oscillations Completed</small>
            <strong id="plpCount">0</strong>
          </div>

          <div class="plp-stat">
            <small>Current Status</small>
            <strong id="plpStatus">Ready</strong>
          </div>

        </div>
      `);
    }

    updateDisplay();
  }

  /* ================================
     REAL PENDULUM MOVEMENT
     ================================ */

  function updateDisplay() {
    if (currentExperiment !== 'pendulum') return;

    const canvas = document.getElementById(
      'simulationCanvas'
    );

    if (!canvas) return;

    const swing = canvas.querySelector('.pl-swing');

    const period = getPeriod();

    let angle = 0;

    if (!pendulum.stopped) {
      angle =
        getAngle() *
        Math.cos(
          (2 * Math.PI * pendulum.elapsed) / period
        );
    }

    if (swing) {
      swing.style.animation = 'none';
      swing.style.transformOrigin = '300px 48px';
      swing.style.transform =
        `rotate(${angle.toFixed(3)}deg)`;
    }

    const time = document.getElementById('plpTime');
    const count = document.getElementById('plpCount');
    const status = document.getElementById('plpStatus');

    if (time) {
      time.textContent =
        `${pendulum.elapsed.toFixed(2)} s`;
    }

    if (count) {
      count.textContent = Math.floor(
        pendulum.elapsed / period
      );
    }

    if (status) {
      status.textContent =
        pendulum.running
          ? 'Running'
          : pendulum.stopped
            ? 'Stopped'
            : pendulum.elapsed > 0
              ? 'Paused'
              : 'Ready';
    }

    const start = canvas.querySelector(
      '[data-plp="start"]'
    );

    const pause = canvas.querySelector(
      '[data-plp="pause"]'
    );

    const stop = canvas.querySelector(
      '[data-plp="stop"]'
    );

    if (start) {
      start.disabled = pendulum.running;
      start.textContent =
        pendulum.elapsed > 0 && !pendulum.stopped
          ? '▶ Resume'
          : '▶ Start';
    }

    if (pause) {
      pause.disabled = !pendulum.running;
    }

    if (stop) {
      stop.disabled =
        !pendulum.running &&
        pendulum.elapsed === 0 &&
        !pendulum.stopped;
    }
  }

  function animate(now) {
    if (!pendulum.running) return;

    if (currentExperiment !== 'pendulum') {
      stopAnimation();
      return;
    }

    if (pendulum.lastTime !== null) {
      const dt = Math.min(
        (now - pendulum.lastTime) / 1000,
        0.05
      );

      pendulum.elapsed += dt;
    }

    pendulum.lastTime = now;

    updateDisplay();

    pendulum.frame = requestAnimationFrame(animate);
  }

  /* ================================
     START BUTTON
     ================================ */

  function startPendulum() {
    if (pendulum.running) return;

    if (pendulum.stopped) {
      pendulum.elapsed = 0;
    }

    pendulum.stopped = false;
    pendulum.running = true;
    pendulum.lastTime = null;

    pendulum.frame = requestAnimationFrame(animate);

    updateDisplay();
  }

  /* ================================
     PAUSE BUTTON
     ================================ */

  function pausePendulum() {
    stopAnimation();
    updateDisplay();
  }

  /* ================================
     STOP BUTTON
     ================================ */

  function stopPendulum() {
    stopAnimation();

    pendulum.elapsed = 0;
    pendulum.stopped = true;

    // Bob returns to the vertical resting position.
    updateDisplay();
  }

  /* ================================
     RESET BUTTON
     ================================ */

  function resetPendulum() {
    stopAnimation();

    pendulum.elapsed = 0;
    pendulum.stopped = false;

    Object.assign(experimentState, defaults);

    const values = {
      length: ' m',
      angle: '°',
      gravity: ' m/s²'
    };

    Object.entries(defaults).forEach(([key, value]) => {
      const slider = document.getElementById(key);

      if (slider) {
        slider.value = value;
      }

      const label = document.getElementById(
        `${key}Value`
      );

      if (label) {
        label.textContent = `${value}${values[key]}`;
      }
    });

    renderExperiment();
  }

  /* ================================
     CONNECT BUTTON CLICKS
     ================================ */

  document.addEventListener('click', event => {
    const button = event.target.closest(
      '[data-plp]'
    );

    if (!button || currentExperiment !== 'pendulum') {
      return;
    }

    const action = button.dataset.plp;

    if (action === 'start') {
      startPendulum();
    }

    if (action === 'pause') {
      pausePendulum();
    }

    if (action === 'stop') {
      stopPendulum();
    }

    if (action === 'reset') {
      resetPendulum();
    }
  });

  /* ================================
     CONNECT WITH EXISTING POCKETLAB
     ================================ */

  renderExperiment = function(...args) {
    const result = previousRender.apply(this, args);

    if (currentExperiment === 'pendulum') {
      addPendulumButtons();
    }

    return result;
  };

  startExperiment = function(key, ...args) {
    stopAnimation();

    pendulum.elapsed = 0;
    pendulum.stopped = false;

    const result = previousStart.call(
      this,
      key,
      ...args
    );

    if (key === 'pendulum') {
      addPendulumButtons();
    }

    return result;
  };

  console.log(
    'PocketLab Pendulum Start/Pause/Stop/Reset loaded!'
  );

})();

/* ==============================================================
   POCKETLAB 3.0 — CAR + 9 MORE ANIMATED PHYSICS LABS
   ADD TO THE VERY END OF script.js (AFTER YOUR OTHER UPGRADES).
   Keeps existing labs, achievements, questions, and tutor.
   ============================================================== */
(() => {
  'use strict';

  const NEW_LABS = [
    {id:'motion',title:'Car Motion & Braking',icon:'🚗',desc:'Accelerate, brake and watch wheels really rotate.',formula:'Fnet = Fdrive − Ffriction − Fbrake; a = Fnet/m',idea:'The net force changes a car’s velocity.',prediction:'the brakes become stronger',effect:'The car slows down more quickly.',observe:'Car speed and stopping distance',controls:[['drive','Engine force',0,120,65,5,' N'],['mass','Car mass',1,20,6,1,' kg'],['friction','Road resistance',0,60,12,2,' N'],['brake','Braking force',0,120,0,5,' N']]},
    {id:'ramp',title:'Ramp & Friction',icon:'🛝',desc:'Slide a block down a slope and vary friction.',formula:'a = g(sinθ − μ cosθ)',idea:'Gravity pulls objects down a slope while friction opposes sliding.',prediction:'the slope gets steeper',effect:'Downhill acceleration generally increases.',observe:'Block displacement and acceleration',controls:[['angle','Ramp angle',10,48,28,1,'°'],['mu','Friction coefficient',0,0.9,0.16,0.02,''],['mass','Block mass',1,15,4,1,' kg']]},
    {id:'collision',title:'Colliding Carts',icon:'💥',desc:'Watch moving carts collide and exchange momentum.',formula:'m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂',idea:'Total momentum is conserved during the collision.',prediction:'the second cart has more mass',effect:'Its change in velocity generally becomes smaller.',observe:'Cart velocities before and after impact',controls:[['m1','Blue cart mass',1,10,3,1,' kg'],['m2','Orange cart mass',1,10,5,1,' kg'],['speed','Initial speed',1,6,3,0.5,' m/s'],['restitution','Bounciness',0,1,0.9,0.1,'']]},
    {id:'orbit',title:'Planetary Orbit',icon:'🪐',desc:'Orbit a planet around a star and change its distance.',formula:'T² ∝ r³ (Kepler’s third law)',idea:'More distant planets have longer orbital periods.',prediction:'the orbital radius increases',effect:'The period becomes longer.',observe:'Orbital radius and period',controls:[['radius','Orbital radius',0.6,2.4,1,0.1,' AU']]},
    {id:'refraction',title:'Light Refraction',icon:'🌊',desc:'See a moving light ray bend between two media.',formula:'n₁ sinθ₁ = n₂ sinθ₂',idea:'Light bends when it passes between media of different refractive indices.',prediction:'the second medium has a higher refractive index',effect:'The refracted ray bends toward the normal.',observe:'Incident and refracted angles',controls:[['n1','First medium index',1,2,1,0.05,''],['n2','Second medium index',1,2.4,1.5,0.05,''],['angle','Incidence angle',5,70,40,1,'°']]},
    {id:'pulley',title:'Pulley & Lifting Load',icon:'🏗️',desc:'Lift a heavy load and see how force changes motion.',formula:'Fup = MA × Feffort; Fnet = Fup − mg',idea:'Ideal pulleys trade pulling distance for mechanical advantage.',prediction:'the applied force increases',effect:'The load accelerates upward more.',observe:'Load position and acceleration',controls:[['mass','Load mass',1,14,5,1,' kg'],['force','Effort force',0,160,45,5,' N'],['advantage','Mechanical advantage',1,4,2,1,'×']]},
    {id:'fieldlines',title:'Animated Magnetic Field',icon:'🧲',desc:'Watch magnetic field lines flow around a bar magnet.',formula:'Magnetic dipole field magnitude ∝ 1/r³ (far away)',idea:'Field lines show the direction of a magnetic field.',prediction:'the magnet gets stronger',effect:'The magnetic-field intensity increases.',observe:'Field-line direction and relative strength',controls:[['strength','Magnet strength',0,100,65,5,'%'],['rotation','Magnet rotation',0,180,0,5,'°']]},
    {id:'electromagnet',title:'Electromagnet & Coil',icon:'⚡',desc:'Power a copper coil and watch the field react.',formula:'B ≈ μ₀NI/L (ideal solenoid)',idea:'Current through a coil creates a magnetic field.',prediction:'the current in the coil increases',effect:'The magnetic field becomes stronger.',observe:'Current, coil turns, and field strength',controls:[['turns','Coil turns',20,250,120,10,''],['current','Current',0,5,2,0.1,' A'],['polarity','Current direction',-1,1,1,2,'']]},
    {id:'compass',title:'Magnet & Compass',icon:'🧭',desc:'Move a magnet and watch a compass needle turn.',formula:'Bdipole ∝ 1/r³ (far-field approximation)',idea:'A compass aligns with the combined local magnetic field.',prediction:'the magnet moves farther away',effect:'Its influence on the compass becomes weaker.',observe:'Compass needle direction',controls:[['distance','Magnet distance',1,5,2.3,0.1,' units'],['angle','Magnet heading',-180,180,0,5,'°'],['strength','Magnet strength',0,100,70,5,'%']]},
    {id:'motor',title:'Electric Motor',icon:'⚙️',desc:'Make a rotor spin using current and a magnetic field.',formula:'τmax ≈ NBIA (ideal coil)',idea:'A current-carrying coil in a magnetic field experiences torque.',prediction:'electric current increases',effect:'Available motor torque increases.',observe:'Rotor rotation and torque',controls:[['current','Motor current',0,5,2.5,0.1,' A'],['field','Magnetic field',0,1.5,0.9,0.1,' T'],['turns','Rotor coil turns',10,150,70,10,''],['load','Mechanical load',0,100,25,5,'%']]}
  ];

  const MAP = Object.fromEntries(
    NEW_LABS.map(x => [x.id, x])
  );

  const oldStart = startExperiment;
  const oldRender = renderExperiment;
  let active = null;

  const css = document.createElement('style');

  css.textContent = `
    .plx-card .pl-experiment-preview {
      background:radial-gradient(circle at 50% 45%,#17527a,#081a31 76%);
      overflow:hidden
    }
    .plx-card .plx-icon {
      display:block;
      font-size:64px;
      filter:drop-shadow(0 0 17px #5ee9ff88);
      animation:plxHover 2.5s ease-in-out infinite alternate
    }
    @keyframes plxHover {
      from {transform:translateY(5px) scale(.95)}
      to {transform:translateY(-7px) scale(1.06)}
    }
    .plx-wrap {
      width:100%;
      max-width:900px;
      margin:auto
    }
    .plx-scene {
      border:1px solid #28638d;
      border-radius:18px;
      overflow:hidden;
      background:#06162d
    }
    .plx-scene canvas {
      width:100%;
      height:auto;
      display:block
    }
    .plx-buttons {
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      justify-content:center;
      margin:14px 0
    }
    .plx-buttons button {
      border-radius:11px;
      padding:11px 17px;
      border:1px solid #57bce9;
      color:white;
      font-weight:700;
      cursor:pointer;
      background:linear-gradient(120deg,#128fc6,#3269ed)
    }
    .plx-buttons button[data-act="start"] {
      background:linear-gradient(120deg,#049b8e,#08cba2)
    }
    .plx-buttons button[data-act="stop"] {
      background:linear-gradient(120deg,#d25c45,#b93254)
    }
    .plx-buttons button[data-act="reset"] {
      background:#30465f
    }
    .plx-buttons button:disabled {
      opacity:.35;
      cursor:not-allowed
    }
    .plx-reads {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px
    }
    .plx-reading {
      padding:13px;
      background:#0e2b49;
      border:1px solid #275779;
      border-radius:12px;
      min-width:0
    }
    .plx-reading small {
      display:block;
      color:#a9c9dc;
      font-size:12px;
      margin-bottom:5px
    }
    .plx-reading strong {
      display:block;
      color:#7cf5ed;
      font-size:20px;
      overflow-wrap:anywhere
    }
    .plx-tip {
      font-size:13px;
      line-height:1.5;
      opacity:.8;
      margin-top:12px
    }
    #plxLearn {
      background:#0c2239;
      border:1px solid #315f80;
      padding:18px;
      border-radius:15px;
      margin:20px 0
    }
    #plxLearn h3 {
      color:#74ecdf;
      margin:8px 0 12px
    }
    #plxLearn button {
      cursor:pointer;
      border:1px solid #3d789f;
      background:#193e60;
      color:white;
      padding:11px 13px;
      border-radius:9px
    }
    #plxAnswers {
      display:grid;
      gap:8px;
      margin:14px 0
    }
    #plxAnswers button {
      text-align:left;
      width:100%
    }
    #plxAnswers button:disabled {
      cursor:default
    }
    #plxNext,#plxAsk button {
      background:#146fc4!important;
      border-color:#55b9ff!important
    }
    #plxAsk textarea {
      width:100%;
      box-sizing:border-box;
      min-height:70px;
      padding:12px;
      background:#061a2c;
      border:1px solid #426984;
      color:white;
      border-radius:9px;
      resize:vertical
    }
    #plxChat {
      display:grid;
      gap:9px;
      margin:12px 0
    }
    .plx-msg {
      padding:11px;
      background:#183b57;
      border-radius:9px;
      white-space:pre-wrap
    }
    @media(max-width:600px) {
      .plx-reads {grid-template-columns:1fr}
      .plx-buttons button {padding:10px 12px}
    }
  `;

  document.head.appendChild(css);

  NEW_LABS.forEach(lab => {
    if (!EXPERIMENTS[lab.id]) {
      EXPERIMENTS[lab.id] = {
        title: lab.title,
        description: lab.desc,
        explanation: `<p>${lab.idea}</p>`
      };
    }
  });

  function buildCards() {
    const lab = document.querySelector('#laboratory');
    if (!lab) return;

    let grid = lab.querySelector('.experiment-grid');

    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'experiment-grid';
      lab.appendChild(grid);
    }

    grid.querySelectorAll('.plx-card').forEach(c => c.remove());

    // Replace the earlier static car card.
    grid.querySelectorAll(
      '.experiment-card[data-category="physics"]'
    ).forEach(c => {
      if (c.querySelector('[data-experiment="motion"]')) {
        c.remove();
      }
    });

    const fragment = document.createDocumentFragment();

    NEW_LABS.forEach(lab => {
      const card = document.createElement('article');

      card.className =
        'experiment-card pl-physics-card plx-card';

      card.dataset.category = 'physics';
      card.dataset.recommended =
        'secondary senior college';

      card.innerHTML = `
        <div class="pl-experiment-preview">
          <span class="plx-icon">${lab.icon}</span>
        </div>
        <div class="pl-experiment-status">
          ● ANIMATED LAB
        </div>
        <h3 class="pl-experiment-title">
          ${lab.title}
        </h3>
        <p class="pl-experiment-description">
          ${lab.desc}
        </p>
        <div class="pl-experiment-footer">
          <small>Physics · Live animation</small>
          <button
            type="button"
            class="pl-experiment-start"
            data-experiment="${lab.id}"
          >▶ Start</button>
        </div>
      `;

      fragment.appendChild(card);
    });

    grid.prepend(fragment);
  }

  // Avoid duplicate launches from older button handlers.
  document.addEventListener('click', event => {
    const button = event.target.closest(
      '.plx-card [data-experiment]'
    );

    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    startExperiment(button.dataset.experiment);
  }, true);

  function controlHTML(c) {
    const [id, name, min, max, value, step, unit] = c;

    return `
      <div class="control-group">
        <label for="plx-${id}">
          ${name}:
          <span id="plxv-${id}">${value}${unit}</span>
        </label>
        <input
          type="range"
          id="plx-${id}"
          min="${min}"
          max="${max}"
          value="${value}"
          step="${step}"
          data-plx="${id}"
        >
      </div>
    `;
  }

  const el = id => document.getElementById(id);

  const fmt = (n, d = 2) =>
    Number.isFinite(n) ? n.toFixed(d) : '—';

  const cap = (x, min, max) =>
    Math.max(min, Math.min(max, x));

  const rgba = a => `rgba(82,229,255,${a})`;

  function cleanup() {
    if (!active) return;

    cancelAnimationFrame(active.frame);
    active.running = false;
    active = null;
  }

  function fresh(lab) {
    return {
      key: lab.id,
      lab,
      params: Object.fromEntries(
        lab.controls.map(c => [c[0], Number(c[4])])
      ),
      running: false,
      status: 'Ready',
      t: 0,
      last: 0,
      frame: 0,
      distance: 0,
      velocity: 0,
      x1: 1.3,
      x2: 8.8,
      v1: 0,
      v2: 0,
      hit: false,
      count: 0,
      phase: 0,
      height: 0,
      canvas: null,
      ctx: null
    };
  }

  function launch(key) {
    cleanup();

    // Preserve previous navigation, progress and tutor hooks.
    const result = oldStart(key);

    const lab = MAP[key];
    active = fresh(lab);

    currentExperiment = key;
    experimentState = {...active.params};

    el('activeExperimentTitle').textContent = lab.title;
    el('activeExperimentDescription').textContent = lab.desc;

    el('experimentExplanation').innerHTML = `
      <p>${lab.idea}</p>
      <p><strong>Formula:</strong> ${lab.formula}</p>
    `;

    el('experimentControls').innerHTML =
      lab.controls.map(controlHTML).join('');

    el('simulationCanvas').innerHTML = `
      <div class="plx-wrap">
        <div class="plx-scene">
          <canvas
            id="plxCanvas"
            width="1360"
            height="680"
            aria-label="Animated ${lab.title} simulation"
          ></canvas>
        </div>

        <div class="plx-buttons">
          <button type="button" data-act="start">
            ▶ Start
          </button>
          <button type="button" data-act="pause">
            ⏸ Pause
          </button>
          <button type="button" data-act="stop">
            ⏹ Stop
          </button>
          <button type="button" data-act="reset">
            ↻ Reset
          </button>
        </div>
      </div>
    `;

    active.canvas = el('plxCanvas');
    active.ctx = active.canvas.getContext('2d');

    const own = active;

    document.querySelectorAll(
      '#experimentControls [data-plx]'
    ).forEach(input => {
      input.addEventListener('input', () => {
        if (active !== own) return;

        const id = input.dataset.plx;
        own.params[id] = Number(input.value);
        experimentState[id] = own.params[id];

        const c = lab.controls.find(c => c[0] === id);

        el('plxv-' + id).textContent =
          input.value + c[6];

        paint(own);
      });
    });

    el('simulationCanvas')
      .querySelector('.plx-buttons')
      .addEventListener('click', e => {
        const act = e.target.closest(
          '[data-act]'
        )?.dataset.act;

        if (!act || active !== own) return;

        if (act === 'start') {
          if (own.running) return;

          if (
            own.status === 'Stopped' ||
            own.status === 'Finished'
          ) {
            resetPhysics(own);
          }

          own.running = true;
          own.status = 'Running';
          own.last = 0;
          own.frame = requestAnimationFrame(tick);

        } else if (act === 'pause') {
          own.running = false;
          cancelAnimationFrame(own.frame);
          own.status = 'Paused';
          own.last = 0;

        } else if (act === 'stop') {
          own.running = false;
          cancelAnimationFrame(own.frame);
          own.status = 'Stopped';
          own.last = 0;
          own.velocity = 0;

        } else if (act === 'reset') {
          own.running = false;
          cancelAnimationFrame(own.frame);
          resetPhysics(own);

          lab.controls.forEach(c => {
            const input = el('plx-' + c[0]);
            if (input) input.value = c[4];

            const label = el('plxv-' + c[0]);
            if (label) {
              label.textContent = c[4] + c[6];
            }
          });

          experimentState = {...own.params};
        }

        paint(own);
      });

    paint(own);

    // Mount the custom questions after the old tutor hooks.
    setTimeout(() => {
      if (active === own) installLearning(own);
    }, 50);

    return result;
  }

  function resetPhysics(s) {
    s.params = Object.fromEntries(
      s.lab.controls.map(c => [c[0], Number(c[4])])
    );

    s.status = 'Ready';
    s.t = 0;
    s.last = 0;
    s.distance = 0;
    s.velocity = 0;
    s.x1 = 1.3;
    s.x2 = 8.8;
    s.v1 = 0;
    s.v2 = 0;
    s.hit = false;
    s.count = 0;
    s.phase = 0;
    s.height = 0;
  }

  function tick(now) {
    const s = active;

    if (!s || !s.running) return;

    const dt = s.last
      ? Math.min(.04, (now - s.last) / 1000)
      : 0;

    s.last = now;

    if (dt) {
      s.t += dt;
      step(s, dt);
    }

    paint(s);

    if (s.running) {
      s.frame = requestAnimationFrame(tick);
    }
  }

  function step(s, dt) {
    const p = s.params;

    switch (s.key) {
      case 'motion': {
        const a =
          (p.drive - p.friction - p.brake) / p.mass;

        s.velocity = Math.max(
          0,
          s.velocity + a * dt
        );

        s.distance += s.velocity * dt;
        break;
      }

      case 'ramp': {
        const t = p.angle * Math.PI / 180;

        const a = Math.max(
          0,
          9.81 * (
            Math.sin(t) -
            p.mu * Math.cos(t)
          )
        );

        s.velocity += a * dt;

        s.distance = Math.min(
          4,
          s.distance + s.velocity * dt
        );

        if (s.distance >= 4) {
          s.running = false;
          s.status = 'Finished';
        }
        break;
      }

      case 'collision': {
        if (s.t < dt + .02) {
          s.v1 = p.speed;
          s.v2 = 0;
        }

        const rate = .65;

        s.x1 += s.v1 * dt * rate;
        s.x2 += s.v2 * dt * rate;

        if (!s.hit && s.x1 + .9 >= s.x2) {
          s.hit = true;
          s.count++;

          const u = s.v1;

          s.v1 =
            (p.m1 - p.restitution * p.m2) /
            (p.m1 + p.m2) * u;

          s.v2 =
            (1 + p.restitution) * p.m1 /
            (p.m1 + p.m2) * u;
        }

        if (
          s.x1 > 12 ||
          s.x1 < -.5 ||
          s.x2 > 12
        ) {
          s.running = false;
          s.status = 'Finished';
        }
        break;
      }

      case 'orbit':
        s.phase +=
          dt * 2 * Math.PI /
          (5 * Math.sqrt(p.radius ** 3));
        break;

      case 'refraction':
        s.phase = (s.phase + dt * .55) % 1;
        break;

      case 'pulley': {
        const a =
          (p.advantage * p.force -
            p.mass * 9.81) / p.mass;

        s.velocity = Math.max(
          0,
          s.velocity + a * dt
        );

        s.height = cap(
          s.height + s.velocity * dt,
          0,
          3
        );

        if (s.height >= 3) {
          s.running = false;
          s.status = 'Finished';
        }
        break;
      }

      case 'fieldlines':
        s.phase += dt * (.3 + p.strength / 70);
        break;

      case 'electromagnet':
        s.phase += dt * p.current * 1.2;
        break;

      case 'compass':
        s.phase += dt * 2;
        break;

      case 'motor': {
        const torque =
          p.turns * p.field * p.current * .015;

        const load = p.load / 100 * 4;

        const alpha = Math.max(
          -5,
          Math.min(
            12,
            torque - load - .09 * s.velocity
          )
        );

        s.velocity = Math.max(
          0,
          s.velocity + alpha * dt
        );

        s.phase += s.velocity * dt;
        break;
      }
    }
  }

  /* =========================================
     GRAPHICS HELPERS
     ========================================= */

  function line(
    c, x1, y1, x2, y2,
    color = '#67dff3',
    width = 3
  ) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke();
  }

  function circle(
    c, x, y, r,
    color = '#52d8f4',
    stroke = null
  ) {
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = color;
    c.fill();

    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = 3;
      c.stroke();
    }
  }

  function box(c, x, y, w, h, color, r = 8) {
    c.fillStyle = color;
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fill();
  }

  function text(
    c, str, x, y,
    size = 16,
    color = '#d5eafa',
    align = 'left'
  ) {
    c.font = `${size}px system-ui,Arial`;
    c.fillStyle = color;
    c.textAlign = align;
    c.fillText(String(str), x, y);
  }

  function arrow(
    c, x1, y1, x2, y2,
    color = '#ffd777'
  ) {
    line(c, x1, y1, x2, y2, color, 3);

    const a = Math.atan2(y2 - y1, x2 - x1);

    line(
      c, x2, y2,
      x2 - 12 * Math.cos(a - .5),
      y2 - 12 * Math.sin(a - .5),
      color, 3
    );

    line(
      c, x2, y2,
      x2 - 12 * Math.cos(a + .5),
      y2 - 12 * Math.sin(a + .5),
      color, 3
    );
  }

  function base(c, title) {
    c.setTransform(2, 0, 0, 2, 0, 0);
    c.clearRect(0, 0, 680, 340);

    const g = c.createRadialGradient(
      340, 150, 15,
      340, 160, 420
    );

    g.addColorStop(0, '#173f65');
    g.addColorStop(1, '#061326');

    c.fillStyle = g;
    c.fillRect(0, 0, 680, 340);

    c.strokeStyle = '#21415b';
    c.lineWidth = .6;

    for (let x = 0; x < 680; x += 40) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, 340);
      c.stroke();
    }

    for (let y = 0; y < 340; y += 40) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(680, y);
      c.stroke();
    }

    text(
      c,
      title.toUpperCase(),
      340, 32, 16,
      '#a2eeff', 'center'
    );
  }

  function wheel(c, x, y, r, spin) {
    circle(c, x, y, r, '#17202e', '#90e7fa');
    circle(c, x, y, r * .65, '#334e68');

    c.save();
    c.translate(x, y);
    c.rotate(spin);

    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;

      line(
        c, 0, 0,
        Math.cos(a) * r * .65,
        Math.sin(a) * r * .65,
        '#cbeaff', 3
      );
    }

    c.restore();
    circle(c, x, y, 5, '#c4e7fb');
  }

  /* =========================================
     1. REAL MOVING CAR + ROTATING WHEELS
     ========================================= */

  function drawCar(c, s) {
    const p = s.params;
    const speed = s.velocity;
    const spin = s.distance / .32;

    box(c, 0, 250, 680, 65, '#1c3045', 0);
    line(c, 0, 250, 680, 250, '#77a5c3', 4);

    for (let i = -2; i < 11; i++) {
      const x =
        ((i * 105 - s.distance * 32) % 800 + 800) %
        800 - 80;

      box(c, x, 290, 50, 5, '#b1d1e5', 2);
    }

    c.save();

    if (s.running && speed > .1) {
      c.translate(0, Math.sin(s.t * 14) * 1.5);
    }

    box(c, 198, 209, 288, 53, '#227be2', 15);

    c.beginPath();
    c.moveTo(243, 210);
    c.lineTo(282, 175);
    c.lineTo(400, 175);
    c.lineTo(448, 210);
    c.closePath();
    c.fillStyle = '#42aef7';
    c.fill();

    box(c, 286, 182, 105, 25, '#93eafa', 5);
    box(c, 474, 225, 15, 17, '#ffeaa1', 4);
    box(c, 199, 227, 12, 18, '#ff707e', 4);

    wheel(c, 270, 258, 27, spin);
    wheel(c, 421, 258, 27, spin);

    c.restore();

    if (speed > 1) {
      for (let i = 0; i < 5; i++) {
        line(
          c,
          80 + i * 10,
          206 + i * 11,
          170 + i * 7,
          206 + i * 11,
          rgba(.18 + .13 * (i % 2)),
          2
        );
      }
    }

    text(
      c, `SPEED ${fmt(speed, 1)} m/s`,
      22, 65, 18, '#7dfce8'
    );

    text(
      c, `DISTANCE ${fmt(s.distance, 1)} m`,
      22, 91, 14, '#dceafd'
    );

    text(
      c,
      p.brake > 0
        ? 'BRAKING FORCE ACTIVE'
        : 'ENGINE FORCE ACTIVE',
      500, 65, 12,
      p.brake > 0 ? '#ffad81' : '#6ce9d2'
    );

    return [
      ['Speed', fmt(speed, 2) + ' m/s'],
      ['Distance', fmt(s.distance, 2) + ' m'],
      [
        'Net acceleration',
        fmt(
          (p.drive - p.friction - p.brake) / p.mass,
          2
        ) + ' m/s²'
      ],
      [
        'Wheel rotations',
        fmt(s.distance / (2 * Math.PI * .32), 1)
      ]
    ];
  }

  /* =========================================
     2. RAMP AND FRICTION
     ========================================= */

  function drawRamp(c, s) {
    const p = s.params;
    const theta = p.angle * Math.PI / 180;
    const L = 320;

    const bx = 125;
    const by = 275;
    const topX = bx + L * Math.cos(theta);
    const topY = by - L * Math.sin(theta);

    const portion = cap(s.distance / 4, 0, 1);

    c.beginPath();
    c.moveTo(bx, by);
    c.lineTo(topX, topY);
    c.lineTo(topX, by);
    c.closePath();
    c.fillStyle = '#2b4560';
    c.fill();

    line(
      c, bx, by, topX, topY,
      '#80e8ff', 7
    );

    const x = topX + (bx - topX) * portion;
    const y = topY + (by - topY) * portion;

    c.save();
    c.translate(x, y - 19);
    c.rotate(-theta);
    box(c, -27, -19, 54, 38, '#ffaf67', 6);
    c.restore();

    arrow(c, 120, 72, 180, 72, '#f6c16a');

    text(
      c, 'GRAVITY + FRICTION',
      190, 78, 15
    );

    text(
      c, `SLOPE ${p.angle}°`,
      485, 240, 19, '#a0edff'
    );

    const acc = Math.max(
      0,
      9.81 * (
        Math.sin(theta) -
        p.mu * Math.cos(theta)
      )
    );

    return [
      ['Acceleration', fmt(acc) + ' m/s²'],
      ['Distance down ramp', fmt(s.distance) + ' m'],
      ['Block speed', fmt(s.velocity) + ' m/s'],
      ['Friction coefficient', fmt(p.mu)]
    ];
  }

  /* =========================================
     3. COLLIDING CARTS
     ========================================= */

  function cart(c, x, y, color, label) {
    box(c, x - 38, y - 44, 76, 42, color);
    wheel(c, x - 24, y, 12, 0);
    wheel(c, x + 24, y, 12, 0);

    text(
      c, label, x, y - 15,
      15, '#fff', 'center'
    );
  }

  function drawCollision(c, s) {
    line(c, 25, 270, 655, 270, '#88abc2', 6);

    for (let i = 0; i < 12; i++) {
      line(
        c, 55 + i * 50, 275,
        80 + i * 50, 275,
        '#7394aa', 2
      );
    }

    cart(
      c,
      35 + s.x1 * 56,
      259,
      '#218bdc',
      'm₁'
    );

    cart(
      c,
      35 + s.x2 * 56,
      259,
      '#ff9f5c',
      'm₂'
    );

    if (s.hit) {
      text(
        c, 'IMPACT! MOMENTUM TRANSFER',
        340, 100, 20, '#ffe16c', 'center'
      );
    } else {
      text(
        c,
        'Watch the blue cart hit the orange cart',
        340, 90, 16, '#b3e9ff', 'center'
      );
    }

    return [
      ['Blue cart velocity', fmt(s.v1) + ' m/s'],
      ['Orange cart velocity', fmt(s.v2) + ' m/s'],
      ['Collisions', String(s.count)],
      ['Restitution', fmt(s.params.restitution, 1)]
    ];
  }

  /* =========================================
     4. PLANETARY ORBIT
     ========================================= */

  function drawOrbit(c, s) {
    const r = 65 + s.params.radius * 48;

    const x = 340 + r * Math.cos(s.phase);
    const y = 180 + r * .68 * Math.sin(s.phase);

    c.beginPath();
    c.ellipse(
      340, 180, r, r * .68,
      0, 0, Math.PI * 2
    );
    c.strokeStyle = '#4b91bb';
    c.lineWidth = 2;
    c.stroke();

    for (let i = 0; i < 30; i++) {
      const px = (i * 131) % 680;
      const py = (i * 97) % 330;

      circle(c, px, py, 1.3, '#a9dbf9');
    }

    c.shadowColor = '#ffb649';
    c.shadowBlur = 32;

    circle(c, 340, 180, 34, '#ffb849');

    c.shadowBlur = 0;

    circle(c, x, y, 16, '#36caff', '#a5f5ff');
    circle(c, x - 5, y - 5, 4, '#c1f5fd');

    text(
      c, 'STAR', 340, 236,
      13, '#ffe6a5', 'center'
    );

    return [
      [
        'Orbit radius',
        fmt(s.params.radius, 1) + ' AU'
      ],
      [
        'Orbital period',
        fmt(Math.sqrt(s.params.radius ** 3), 2) +
        ' model years'
      ],
      [
        'Completed orbits',
        String(Math.floor(s.phase / (2 * Math.PI)))
      ],
      ['Model', 'Kepler circular orbit']
    ];
  }

  /* =========================================
     5. LIGHT REFRACTION
     ========================================= */

  function drawRefraction(c, s) {
    const p = s.params;
    const a = p.angle * Math.PI / 180;

    const v = p.n1 / p.n2 * Math.sin(a);
    const tir = Math.abs(v) > 1;
    const ang = tir ? a : Math.asin(v);

    const ox = 340;
    const oy = 170;

    box(c, 0, oy, 680, 170, '#0a618455', 0);

    line(c, 0, oy, 680, oy, '#90e8f8', 2);
    line(c, ox, 28, ox, 322, '#b7d2ec', 1);

    const sx = ox - 140 * Math.sin(a);
    const sy = oy - 140 * Math.cos(a);

    line(c, sx, sy, ox, oy, '#ffdf69', 4);

    const ex = ox + 135 * Math.sin(ang);

    const ey = tir
      ? oy - 135 * Math.cos(ang)
      : oy + 135 * Math.cos(ang);

    line(
      c, ox, oy, ex, ey,
      tir ? '#ff9c67' : '#5ef4cc',
      4
    );

    if (s.running) {
      const u = (s.phase * 2) % 1;

      circle(
        c,
        sx + (ox - sx) * u,
        sy + (oy - sy) * u,
        8,
        '#fff0b5'
      );

      circle(
        c,
        ox + (ex - ox) * u,
        oy + (ey - oy) * u,
        7,
        '#68f5e6'
      );
    }

    text(
      c, `MEDIUM 1  n=${fmt(p.n1, 2)}`,
      26, 65, 15
    );

    text(
      c, `MEDIUM 2  n=${fmt(p.n2, 2)}`,
      26, 292, 15
    );

    return [
      ['Incident angle', fmt(p.angle, 0) + '°'],
      [
        'Refracted angle',
        tir
          ? 'Total internal reflection'
          : fmt(ang * 180 / Math.PI, 1) + '°'
      ],
      ['Index n₁', fmt(p.n1, 2)],
      ['Index n₂', fmt(p.n2, 2)]
    ];
  }

  /* =========================================
     6. PULLEY
     ========================================= */

  function drawPulley(c, s) {
    const p = s.params;
    const dy = s.height * 44;

    line(c, 285, 45, 285, 135, '#cfe8fa', 4);
    circle(c, 285, 130, 42, '#30485d', '#9bdaf4');
    circle(c, 285, 130, 13, '#6edcf6');

    line(
      c, 243, 130,
      243, 250 - dy,
      '#ffde94', 4
    );

    line(
      c, 327, 130,
      327, 260,
      '#ffde94', 4
    );

    box(
      c, 195, 247 - dy,
      97, 61, '#258ed4', 7
    );

    text(
      c, `${p.mass}kg`,
      243, 285 - dy,
      20, '#fff', 'center'
    );

    arrow(
      c, 327, 245,
      327, 280,
      '#ffbb66'
    );

    text(
      c, 'PULL ↓', 342, 280,
      15, '#ffd6a5'
    );

    text(
      c, `IDEAL MA = ${p.advantage}`,
      465, 110, 19, '#a6f1fa'
    );

    text(
      c, 'schematic pulley',
      465, 137, 12, '#b9d4e8'
    );

    return [
      [
        'Upward acceleration',
        fmt(
          Math.max(
            0,
            (
              p.advantage * p.force -
              p.mass * 9.81
            ) / p.mass
          )
        ) + ' m/s²'
      ],
      ['Load rise', fmt(s.height) + ' m'],
      ['Pulling force', fmt(p.force) + ' N'],
      ['Mechanical advantage', p.advantage + '×']
    ];
  }

  /* =========================================
     7. MAGNETIC FIELD ANIMATION
     ========================================= */

  function drawField(c, s) {
    const p = s.params;

    c.save();
    c.translate(340, 180);
    c.rotate(p.rotation * Math.PI / 180);

    for (let i = 0; i < 5; i++) {
      const rx = 135 + i * 34;
      const ry = 50 + i * 26;

      c.beginPath();

      c.ellipse(
        0, 0,
        rx, ry,
        0, 0, Math.PI * 2
      );

      c.strokeStyle = rgba(
        p.strength / 100 * (.75 - i * .08)
      );

      c.lineWidth = 2.5;
      c.setLineDash([10, 12]);
      c.lineDashOffset = -s.phase * 35;
      c.stroke();
      c.setLineDash([]);

      const a = s.phase + i * 1.25;

      circle(
        c,
        rx * Math.cos(a),
        ry * Math.sin(a),
        3.5,
        '#9af9ff'
      );
    }

    box(c, -105, -30, 105, 60, '#e34d69', 4);
    box(c, 0, -30, 105, 60, '#347ee2', 4);

    text(
      c, 'N', -52, 8, 24,
      'white', 'center'
    );

    text(
      c, 'S', 53, 8, 24,
      'white', 'center'
    );

    c.restore();

    return [
      ['Relative magnet strength', p.strength + '%'],
      ['Magnet rotation', p.rotation + '°'],
      [
        'Field motion',
        'Animated direction markers'
      ],
      [
        'Note',
        'Field lines are illustrative'
      ]
    ];
  }

  /* =========================================
     8. ELECTROMAGNET
     ========================================= */

  function drawElectromagnet(c, s) {
    const p = s.params;

    const B =
      4 * Math.PI * 1e-7 *
      p.turns * p.current / .2 * 1000;

    const glow = cap(p.current / 5, 0, 1);

    box(c, 75, 115, 105, 85, '#204a70');

    text(
      c, 'BATTERY', 127, 158,
      15, '#e5f7ff', 'center'
    );

    text(
      c, p.current + ' A',
      128, 185, 14,
      '#6affca', 'center'
    );

    line(c, 180, 135, 245, 135, '#93e7ff', 4);
    line(c, 180, 183, 245, 183, '#93e7ff', 4);

    box(c, 245, 140, 290, 45, '#aebed0');

    c.shadowColor = '#ffb857';
    c.shadowBlur = glow * 16;

    const coils = Math.max(
      6,
      Math.round(p.turns / 18)
    );

    for (let i = 0; i < coils; i++) {
      const x = 260 + i * (260 / coils);

      c.beginPath();
      c.ellipse(
        x, 160,
        11, 33,
        0, 0, Math.PI * 2
      );

      c.strokeStyle = '#ffbd65';
      c.lineWidth = 3;
      c.stroke();
    }

    c.shadowBlur = 0;

    if (p.current > 0) {
      for (let i = 0; i < 4; i++) {
        const x = 270 + i * 76;

        circle(
          c,
          x,
          92 + Math.sin(s.phase + i) * 11,
          5,
          '#70eaff'
        );
      }

      arrow(
        c,
        380, 230,
        p.polarity > 0 ? 495 : 270,
        230,
        '#7feada'
      );
    }

    text(
      c,
      p.current > 0 ? 'FIELD ON' : 'FIELD OFF',
      340, 290, 20,
      p.current > 0 ? '#83f7de' : '#ffa4a4',
      'center'
    );

    return [
      ['Field estimate', fmt(B, 3) + ' mT'],
      ['Current', fmt(p.current, 1) + ' A'],
      ['Coil turns', String(p.turns)],
      [
        'Polarity',
        p.polarity > 0 ? 'Forward' : 'Reversed'
      ]
    ];
  }

  /* =========================================
     9. MAGNET & COMPASS
     ========================================= */

  function drawCompass(c, s) {
    const p = s.params;

    const strength =
      p.strength / 100 /
      (p.distance ** 3);

    const a = p.angle * Math.PI / 180;

    const deflect = Math.atan2(
      strength * Math.cos(a),
      .04 + strength * Math.sin(a)
    );

    c.save();
    c.translate(195, 175);
    c.rotate(a);

    box(c, -79, -24, 79, 48, '#e85970', 5);
    box(c, 0, -24, 79, 48, '#397dee', 5);

    text(
      c, 'N', -40, 7, 21,
      'white', 'center'
    );

    text(
      c, 'S', 39, 7, 21,
      'white', 'center'
    );

    c.restore();

    circle(
      c, 475, 175, 102,
      '#13334e', '#6babc8'
    );

    circle(
      c, 475, 175, 84,
      '#0a1e33', '#5d89ad'
    );

    text(
      c, 'N', 475, 98, 18,
      '#d4f6ff', 'center'
    );

    text(
      c, 'S', 475, 259, 18,
      '#d4f6ff', 'center'
    );

    c.save();
    c.translate(475, 175);
    c.rotate(deflect);

    c.beginPath();
    c.moveTo(0, -72);
    c.lineTo(-14, 12);
    c.lineTo(0, 0);
    c.fillStyle = '#ff6e7b';
    c.fill();

    c.beginPath();
    c.moveTo(0, 72);
    c.lineTo(14, -12);
    c.lineTo(0, 0);
    c.fillStyle = '#65bdff';
    c.fill();

    c.restore();

    circle(c, 475, 175, 7, '#fff1c1');

    return [
      [
        'Needle deflection',
        fmt(deflect * 180 / Math.PI, 1) + '°'
      ],
      [
        'Magnet distance',
        fmt(p.distance, 1) + ' units'
      ],
      [
        'Relative field',
        fmt(strength, 3)
      ],
      [
        'Magnet heading',
        p.angle + '°'
      ]
    ];
  }

  /* =========================================
     10. ROTATING ELECTRIC MOTOR
     ========================================= */

  function drawMotor(c, s) {
    const p = s.params;

    const torque =
      p.turns * p.field * p.current * .015;

    box(c, 110, 100, 95, 140, '#dc5169', 10);
    box(c, 475, 100, 95, 140, '#347ff2', 10);

    text(
      c, 'N', 156, 181, 44,
      'white', 'center'
    );

    text(
      c, 'S', 522, 181, 44,
      'white', 'center'
    );

    circle(
      c, 340, 170, 84,
      '#0f2d48', '#64dbf7'
    );

    c.save();
    c.translate(340, 170);
    c.rotate(s.phase);

    box(c, -57, -39, 114, 78, '#b78230', 9);
    box(c, -44, -28, 88, 56, '#12334c');

    line(
      c, -62, 0, 62, 0,
      '#ffdb7c', 5
    );

    c.restore();

    circle(c, 340, 170, 12, '#e7faff');

    arrow(
      c, 320, 282,
      390, 282,
      '#72f9e1'
    );

    text(
      c, 'ROTATING COIL',
      340, 318, 16,
      '#c8eaff', 'center'
    );

    return [
      [
        'Maximum ideal torque',
        fmt(torque, 3) + ' N·m'
      ],
      [
        'Rotor speed (model)',
        fmt(s.velocity * 60 / (2 * Math.PI), 1) +
        ' rpm'
      ],
      [
        'Supply current',
        fmt(p.current, 1) + ' A'
      ],
      [
        'Load',
        p.load + '%'
      ]
    ];
  }

  const drawings = {
    motion: drawCar,
    ramp: drawRamp,
    collision: drawCollision,
    orbit: drawOrbit,
    refraction: drawRefraction,
    pulley: drawPulley,
    fieldlines: drawField,
    electromagnet: drawElectromagnet,
    compass: drawCompass,
    motor: drawMotor
  };

  /* =========================================
     LIVE RESULTS
     ========================================= */

  function paint(s) {
    if (active !== s || !s.ctx) return;

    const c = s.ctx;

    base(c, s.lab.title);

    const readings = drawings[s.key](c, s);

    const result = el('experimentResults');

    if (result) {
      result.innerHTML = `
        <div class="plx-reads">
          ${readings.map(([name, val]) => `
            <div class="plx-reading">
              <small>${name}</small>
              <strong>${val}</strong>
            </div>
          `).join('')}

          <div class="plx-reading">
            <small>Elapsed time</small>
            <strong>${fmt(s.t, 1)} s</strong>
          </div>

          <div class="plx-reading">
            <small>Status</small>
            <strong>${s.status}</strong>
          </div>
        </div>

        <p class="plx-tip">
          Drag sliders while running. This is an
          educational model with idealized assumptions;
          visual dimensions are not to scale.
        </p>
      `;
    }

    const buttons = el('simulationCanvas')
      ?.querySelector('.plx-buttons');

    if (buttons) {
      buttons.querySelector(
        '[data-act="start"]'
      ).disabled = s.running;

      buttons.querySelector(
        '[data-act="pause"]'
      ).disabled = !s.running;
    }
  }

  /* =========================================
     FIVE EXPERIMENT MCQs
     ========================================= */

  function quizFor(lab) {
    const distractors = [
      'It has no effect',
      'The experiment stops obeying physics',
      'Only the colour of the object changes'
    ];

    return [
      {
        q: `Which formula best describes ${lab.title}?`,
        correct: lab.formula,
        wrong: [
          'E = mc²',
          'pH = −log₁₀[H⁺]',
          'P = VI'
        ],
        why: lab.idea
      },
      {
        q: `What is the main scientific idea of ${lab.title}?`,
        correct: lab.idea,
        wrong: [
          'Matter is always motionless',
          'Gravity does not exist',
          'All materials behave identically'
        ],
        why: lab.idea
      },
      {
        q: `What happens when ${lab.prediction}?`,
        correct: lab.effect,
        wrong: distractors,
        why: lab.effect
      },
      {
        q: 'What should you observe during the experiment?',
        correct: lab.observe,
        wrong: [
          'Only the background colour',
          'The name of the website',
          'The current calendar date'
        ],
        why: lab.observe
      },
      {
        q: 'Which is the best way to test the effect of a slider?',
        correct:
          'Change one variable and observe the result.',
        wrong: [
          'Change every slider at once',
          'Ignore the results',
          'Never repeat the test'
        ],
        why:
          'A controlled test changes one variable at a time.'
      }
    ].map((q, i) => {
      const options = [q.correct, ...q.wrong];
      const shift = i % 4;

      return {
        ...q,
        options: [
          ...options.slice(shift),
          ...options.slice(0, shift)
        ],
        answer: (4 - shift) % 4
      };
    });
  }

  /* =========================================
     FORMULA + MCQ + OFFLINE TUTOR
     ========================================= */

  function installLearning(s) {
    const workspace = el('experimentWorkspace');
    if (!workspace) return;

    const generic = el('plLearning');
    if (generic) generic.style.display = 'none';

    let formula = el('plFormula');

    if (!formula) {
      formula = document.createElement('section');
      formula.id = 'plFormula';

      el('experimentResults')
        ?.insertAdjacentElement('afterend', formula);
    }

    formula.innerHTML = `
      <h3>📐 Experiment Formula</h3>
      <div id="plFormulaValue"></div>
      <p id="plFormulaExplanation"></p>
    `;

    el('plFormulaValue').textContent = s.lab.formula;
    el('plFormulaExplanation').textContent = s.lab.idea;

    let own = el('plxLearn');

    if (!own) {
      own = document.createElement('section');
      own.id = 'plxLearn';
      workspace.appendChild(own);
    }

    own.style.display = 'block';

    own.innerHTML = `
      <h3>🧠 Five Quick MCQs</h3>

      <p id="plxProgress"></p>
      <h3 id="plxQuestion"></h3>
      <div id="plxAnswers"></div>

      <p id="plxFeedback" aria-live="polite"></p>

      <button
        type="button"
        id="plxNext"
        disabled
      >Next question →</button>

      <hr
        style="
          border-color:#285477;
          margin:23px 0;
        "
      >

      <h3>💬 Ask PocketLab Tutor</h3>

      <p>
        Offline science help about this experiment.
      </p>

      <div id="plxChat" aria-live="polite"></div>

      <form id="plxAsk">
        <textarea
          id="plxAskText"
          required
          maxlength="400"
          placeholder="Ask why, how, formula, or what happens when a slider changes..."
        ></textarea>

        <p>
          <button type="submit">➤ Send</button>
        </p>
      </form>
    `;

    const questions = quizFor(s.lab);

    let index = 0;
    let score = 0;
    let answered = false;

    const display = () => {
      const q = questions[index];

      answered = false;

      el('plxProgress').textContent =
        `Question ${index + 1} of 5 · Score ${score}/5`;

      el('plxQuestion').textContent = q.q;

      el('plxFeedback').textContent =
        'Choose one answer.';

      el('plxAnswers').innerHTML = '';

      q.options.forEach((option, i) => {
        const button = document.createElement('button');

        button.type = 'button';

        button.textContent =
          String.fromCharCode(65 + i) + '. ' + option;

        button.addEventListener('click', () => {
          if (answered) return;

          answered = true;

          if (i === q.answer) score++;

          el('plxAnswers')
            .querySelectorAll('button')
            .forEach((b, j) => {
              b.disabled = true;

              if (j === q.answer) {
                b.style.background = '#176856';
              } else if (j === i) {
                b.style.background = '#703947';
              }
            });

          el('plxFeedback').textContent =
            (i === q.answer
              ? '✅ Correct! '
              : '❌ Not quite. ') + q.why;

          el('plxNext').disabled = false;
        });

        el('plxAnswers').appendChild(button);
      });

      el('plxNext').disabled = true;

      el('plxNext').textContent =
        index === 4
          ? 'View score →'
          : 'Next question →';
    };

    el('plxNext').addEventListener('click', () => {
      if (!answered && index < 5) return;

      index++;

      if (index < 5) {
        display();
      } else {
        el('plxProgress').textContent =
          'Quiz complete';

        el('plxQuestion').textContent =
          `🏆 Score: ${score}/5`;

        el('plxAnswers').textContent =
          'Review the experiment and try again.';

        el('plxFeedback').textContent = '';

        const btn = el('plxNext');

        btn.textContent = '↻ Try again';
        btn.disabled = false;

        btn.onclick = () => {
          index = 0;
          score = 0;
          display();
        };
      }
    });

    display();

    const add = (who, msg) => {
      const d = document.createElement('div');

      d.className = 'plx-msg';
      d.textContent = who + ': ' + msg;

      el('plxChat').appendChild(d);
    };

    add(
      'PocketLab Tutor',
      'Ask about the formula, variables, or results in ' +
      s.lab.title + '.'
    );

    el('plxAsk').addEventListener('submit', e => {
      e.preventDefault();

      const input = el('plxAskText');
      const question = input.value.trim();

      if (!question) return;

      input.value = '';

      add('You', question);

      const q = question.toLowerCase();
      let reply;

      if (
        /formula|equation|calculate|law/.test(q)
      ) {
        reply =
          'Formula: ' + s.lab.formula +
          '\n' + s.lab.idea;

      } else if (
        /why|how|work|explain|principle/.test(q)
      ) {
        reply =
          s.lab.idea +
          ' Watch the measured variables as you adjust the sliders.';

      } else if (
        /increase|decrease|change|faster|slower|what happen|more|less/.test(q)
      ) {
        reply =
          'When ' + s.lab.prediction +
          ', ' + s.lab.effect.toLowerCase();

      } else if (
        /measure|result|observe|reading/.test(q)
      ) {
        reply =
          'Observe ' +
          s.lab.observe.toLowerCase() + '.';

      } else {
        reply =
          'This offline tutor covers ' +
          s.lab.title + '. ' +
          s.lab.idea +
          ' Formula: ' + s.lab.formula +
          '. For unrestricted questions, an AI backend is required.';
      }

      add('PocketLab Tutor', reply);
    });
  }

  /* =========================================
     INTEGRATE WITHOUT DELETING OLDER LABS
     ========================================= */

  startExperiment = function(key, ...args) {
    if (MAP[key]) return launch(key);

    cleanup();

    const panel = el('plxLearn');
    if (panel) panel.style.display = 'none';

    const generic = el('plLearning');
    if (generic) generic.style.display = '';

    return oldStart.call(this, key, ...args);
  };

  renderExperiment = function(...args) {
    if (
      active &&
      currentExperiment === active.key
    ) {
      paint(active);
      return;
    }

    return oldRender.apply(this, args);
  };

  function init() {
    buildCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log(
    'PocketLab: car + 9 animated labs installed'
  );
})();

/* =========================================
   POCKETLAB — SHOW NEW PHYSICS CARDS FIX
   ========================================= */

(() => {
  const newPhysicsCards = [
    ['motion', 'Car Motion & Braking', '🚗',
      'Accelerate and brake a moving car.'],

    ['ramp', 'Ramp & Friction', '🛝',
      'Watch a block slide down a ramp.'],

    ['collision', 'Colliding Carts', '💥',
      'See momentum transfer in collisions.'],

    ['orbit', 'Planetary Orbit', '🪐',
      'Watch planets orbit around a star.'],

    ['refraction', 'Light Refraction', '🌈',
      'See light bend between materials.'],

    ['pulley', 'Pulley & Load', '🏗️',
      'Lift weights using a pulley.'],

    ['fieldlines', 'Animated Magnetic Field', '🧲',
      'Watch magnetic field lines.'],

    ['electromagnet', 'Electromagnet & Coil', '⚡',
      'Create a magnetic field using current.'],

    ['compass', 'Magnet & Compass', '🧭',
      'Watch the compass needle move.'],

    ['motor', 'Electric Motor', '⚙️',
      'Watch a motor coil rotate.']
  ];

  function showNewPhysicsCards() {
    const grid = document.querySelector(
      '#laboratory .experiment-grid'
    );

    if (!grid) {
      console.warn('PocketLab: Laboratory grid not found.');
      return;
    }

    // Make sure the previously supplied
    // animation code has loaded successfully.
    if (
      typeof EXPERIMENTS === 'undefined' ||
      !EXPERIMENTS.electromagnet ||
      !EXPERIMENTS.ramp
    ) {
      console.error(
        'PocketLab: New experiment engine is missing. ' +
        'Check that the previous full upgrade is pasted ' +
        'and that script.js has no JavaScript errors.'
      );
      return;
    }

    const fragment = document.createDocumentFragment();

    newPhysicsCards.forEach(([key, title, emoji, description]) => {

      // Avoid duplicate cards.
      if (
        grid.querySelector(
          `.plx-card [data-experiment="${key}"]`
        )
      ) {
        return;
      }

      const card = document.createElement('article');

      card.className =
        'experiment-card pl-physics-card plx-card';

      card.dataset.category = 'physics';
      card.dataset.recommended =
        'secondary senior college';

      card.innerHTML = `
        <div class="pl-experiment-preview">
          <span class="plx-icon">${emoji}</span>
        </div>

        <div class="pl-experiment-status">
          ● ANIMATED LAB
        </div>

        <h3 class="pl-experiment-title">
          ${title}
        </h3>

        <p class="pl-experiment-description">
          ${description}
        </p>

        <div class="pl-experiment-footer">
          <small>Physics · Live Animation</small>

          <button
            type="button"
            class="pl-experiment-start"
            data-experiment="${key}"
          >
            ▶ Start
          </button>
        </div>
      `;

      fragment.appendChild(card);
    });

    grid.prepend(fragment);

    console.log(
      '✅ PocketLab: New Physics cards restored!'
    );
  }

  // Run after other scripts finish building
  // their original laboratory cards.
  function initializeCards() {
    showNewPhysicsCards();

    window.addEventListener('load', () => {
      setTimeout(showNewPhysicsCards, 500);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeCards
    );
  } else {
    initializeCards();
    setTimeout(showNewPhysicsCards, 500);
  }
})();

/* ============================================================
   POCKETLAB 3.0 — FIX 3 PHYSICS EXPERIMENTS
   1. RAMP & FRICTION
   2. COLLIDING CARTS
   3. PULLEY & LIFTING LOAD

   Paste at the VERY BOTTOM of script.js.
   ============================================================ */

(() => {
  'use strict';

  const FIXED = {
    ramp: {
      title: 'Ramp & Friction',
      formula: 'a = g(sinθ − μcosθ)',
      note: 'Friction opposes sliding. In this ideal model, mass does not affect acceleration.',
      inputs: [
        ['angle', 'Ramp angle', 10, 48, 28, 1, '°'],
        ['mu', 'Friction coefficient', 0, 0.9, 0.16, 0.02, ''],
        ['mass', 'Block mass', 1, 15, 4, 1, ' kg']
      ]
    },

    collision: {
      title: 'Colliding Carts',
      formula: 'm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂',
      note: 'Momentum is conserved. Bounciness controls how much kinetic energy is retained.',
      inputs: [
        ['m1', 'Blue cart mass', 1, 10, 3, 1, ' kg'],
        ['m2', 'Orange cart mass', 1, 10, 5, 1, ' kg'],
        ['speed', 'Initial speed', 1, 6, 3, 0.5, ' m/s'],
        ['restitution', 'Bounciness', 0, 1, 0.9, 0.1, '']
      ]
    },

    pulley: {
      title: 'Pulley & Lifting Load',
      formula: 'Fnet = MA × Feffort − mg',
      note: 'The load only rises from rest when the upward force exceeds its weight.',
      inputs: [
        ['mass', 'Load mass', 1, 14, 5, 1, ' kg'],
        ['force', 'Effort force', 0, 160, 45, 5, ' N'],
        ['advantage', 'Mechanical advantage', 1, 4, 2, 1, '×']
      ]
    }
  };

  const previousStart = startExperiment;
  let active = null;

  const $ = id => document.getElementById(id);

  const fmt = (n, digits = 2) =>
    Number(n).toFixed(digits);

  const clamp = (v, min, max) =>
    Math.max(min, Math.min(max, v));

  /* ========================================
     STYLING
     ======================================== */

  const css = document.createElement('style');

  css.textContent = `
    .pf3-stage {
      width:100%;
      max-width:900px;
      margin:0 auto;
    }

    .pf3-canvas {
      display:block;
      width:100%;
      height:auto;
      border-radius:15px;
      border:1px solid #32709a;
      background:#081c32;
    }

    .pf3-buttons {
      display:flex;
      justify-content:center;
      flex-wrap:wrap;
      gap:10px;
      margin:14px 0;
    }

    .pf3-buttons button {
      padding:11px 17px;
      border-radius:10px;
      border:1px solid #65bdec;
      background:#1969bc;
      color:white;
      font-weight:750;
      cursor:pointer;
    }

    .pf3-buttons [data-pf3="start"] {
      background:#06a895;
    }

    .pf3-buttons [data-pf3="stop"] {
      background:#c84758;
    }

    .pf3-buttons [data-pf3="reset"] {
      background:#334a63;
    }

    .pf3-buttons button:disabled {
      opacity:.4;
      cursor:not-allowed;
    }

    .pf3-tiles {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }

    .pf3-tile {
      padding:14px;
      border:1px solid #2b6385;
      border-radius:11px;
      background:#102f4d;
    }

    .pf3-tile small {
      display:block;
      color:#b6d3e4;
      margin-bottom:5px;
    }

    .pf3-tile strong {
      color:#6de9f4;
      font-size:19px;
      overflow-wrap:anywhere;
    }

    .pf3-formula {
      margin-top:15px;
      border-top:1px solid #345d7d;
      padding-top:12px;
      color:#d5eeff;
      line-height:1.6;
    }

    #experimentWorkspace.pf3-active #plFormula {
      display:none!important;
    }

    @media(max-width:520px) {
      .pf3-tiles {
        grid-template-columns:1fr;
      }
    }
  `;

  document.head.appendChild(css);

  /* ========================================
     RESET ANIMATION
     ======================================== */

  function stopOldSession() {
    if (active) {
      cancelAnimationFrame(active.frame);
    }

    active = null;

    $('experimentWorkspace')
      ?.classList.remove('pf3-active');
  }

  function initialState(key, p) {
    return {
      key,
      p,
      frame:0,
      running:false,
      last:0,
      elapsed:0,
      status:'Ready',
      position:0,
      velocity:0,

      x1:1.25,
      x2:5.15,

      v1:p.speed || 0,
      v2:0,

      spin1:0,
      spin2:0,

      collided:false,
      hitAt:-10
    };
  }

  function restartMotion(s) {
    s.running = false;

    cancelAnimationFrame(s.frame);

    Object.assign(s, {
      last:0,
      elapsed:0,
      status:'Ready',
      position:0,
      velocity:0,

      x1:1.25,
      x2:5.15,

      v1:s.p.speed || 0,
      v2:0,

      spin1:0,
      spin2:0,

      collided:false,
      hitAt:-10
    });
  }

  /* ========================================
     RAMP PHYSICS
     ======================================== */

  function getRampAcceleration(p, velocity = 0) {
    const theta = p.angle * Math.PI / 180;

    const downhill = 9.81 * Math.sin(theta);

    const friction =
      9.81 * p.mu * Math.cos(theta);

    const net = downhill - friction;

    return velocity <= 0
      ? Math.max(0, net)
      : net;
  }

  /* ========================================
     UPDATE PHYSICS EACH FRAME
     ======================================== */

  function advance(s, dt) {
    const p = s.p;

    // RAMP
    if (s.key === 'ramp') {
      const a = getRampAcceleration(
        p,
        s.velocity
      );

      if (a <= 0 && s.velocity === 0) {
        s.status =
          s.position === 0
            ? 'Held by friction'
            : 'Stopped by friction';

        s.running = false;
        return;
      }

      s.velocity = Math.max(
        0,
        s.velocity + a * dt
      );

      s.position = Math.min(
        4,
        s.position + s.velocity * dt
      );

      if (s.position >= 4) {
        s.velocity = 0;
        s.running = false;
        s.status = 'Finished';
      }
    }

    // COLLIDING CARTS
    else if (s.key === 'collision') {
      const old1 = s.x1;
      const old2 = s.x2;

      s.x1 += s.v1 * dt;
      s.x2 += s.v2 * dt;

      s.spin1 += (s.x1 - old1) / 0.19;
      s.spin2 += (s.x2 - old2) / 0.19;

      // Detect collision
      if (
        !s.collided &&
        s.x1 + 1.07 >= s.x2
      ) {
        s.collided = true;
        s.hitAt = s.elapsed;

        s.x1 = s.x2 - 1.07;

        const m1 = p.m1;
        const m2 = p.m2;
        const e = p.restitution;

        const u1 = s.v1;
        const u2 = s.v2;

        // Collision equations
        s.v1 = (
          (m1 - e * m2) * u1 +
          (1 + e) * m2 * u2
        ) / (m1 + m2);

        s.v2 = (
          (1 + e) * m1 * u1 +
          (m2 - e * m1) * u2
        ) / (m1 + m2);
      }

      if (
        s.x1 < 0.25 ||
        s.x2 > 7.6 ||
        s.elapsed > 9
      ) {
        s.running = false;
        s.status = 'Finished';
      }
    }

    // PULLEY
    else if (s.key === 'pulley') {
      const weight = p.mass * 9.81;

      const upwardForce =
        p.advantage * p.force;

      const net = upwardForce - weight;

      const a = net / p.mass;

      // Load cannot rise if the force
      // is insufficient.
      if (
        s.position <= 0 &&
        a <= 0
      ) {
        s.position = 0;
        s.velocity = 0;
        s.running = false;
        s.status = 'Insufficient force';
        return;
      }

      s.velocity += a * dt;

      s.position += s.velocity * dt;

      if (s.position <= 0) {
        s.position = 0;
        s.velocity = 0;

        if (a < 0) {
          s.running = false;
          s.status = 'Load on ground';
        }
      }

      if (s.position >= 1.5) {
        s.position = 1.5;
        s.velocity = 0;
        s.running = false;
        s.status = 'Finished';
      }
    }
  }

  /* ========================================
     CANVAS HELPERS
     ======================================== */

  function background(c, title) {
    c.setTransform(2, 0, 0, 2, 0, 0);

    c.clearRect(0, 0, 680, 340);

    const grad = c.createRadialGradient(
      340, 155, 15,
      340, 165, 410
    );

    grad.addColorStop(0, '#17456c');
    grad.addColorStop(1, '#061426');

    c.fillStyle = grad;
    c.fillRect(0, 0, 680, 340);

    c.lineWidth = 0.8;
    c.strokeStyle = '#21425c';

    for (let x = 0; x < 680; x += 40) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, 340);
      c.stroke();
    }

    for (let y = 0; y < 340; y += 40) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(680, y);
      c.stroke();
    }

    c.font = 'bold 17px Arial';
    c.textAlign = 'center';
    c.fillStyle = '#a4f3ff';

    c.fillText(
      title.toUpperCase(),
      340,
      31
    );
  }

  function label(
    c,
    text,
    x,
    y,
    color = '#ddf4ff',
    size = 15
  ) {
    c.font = `${size}px Arial`;
    c.textAlign = 'center';
    c.fillStyle = color;

    c.fillText(text, x, y);
  }

  function rounded(
    c,
    x,
    y,
    w,
    h,
    color,
    radius = 8
  ) {
    c.fillStyle = color;
    c.beginPath();

    c.roundRect(x, y, w, h, radius);
    c.fill();
  }

  /* ========================================
     DRAW RAMP & FRICTION
     ======================================== */

  function drawRamp(c, s) {
    const p = s.p;

    const theta =
      p.angle * Math.PI / 180;

    const L = 335;

    const bx = 128;
    const by = 282;

    const tx =
      bx + L * Math.cos(theta);

    const ty =
      by - L * Math.sin(theta);

    // Ramp
    c.beginPath();
    c.moveTo(bx, by);
    c.lineTo(tx, ty);
    c.lineTo(tx, by);
    c.closePath();

    c.fillStyle = '#345572';
    c.fill();

    c.strokeStyle = '#7ae8ff';
    c.lineWidth = 6;

    c.beginPath();
    c.moveTo(bx, by);
    c.lineTo(tx, ty);
    c.stroke();

    // Move block from top to bottom
    const u = clamp(
      s.position / 4,
      0,
      1
    );

    const x =
      tx +
      (bx - tx) * u -
      22 * Math.sin(theta);

    const y =
      ty +
      (by - ty) * u -
      22 * Math.cos(theta);

    c.save();
    c.translate(x, y);
    c.rotate(-theta);

    rounded(
      c,
      -26, -20,
      52, 40,
      '#ffa65b',
      5
    );

    label(
      c,
      `${p.mass}kg`,
      0, 5,
      '#153047',
      13
    );

    c.restore();

    label(
      c,
      `Angle ${p.angle}°`,
      570, 217,
      '#8ae9ff',
      18
    );

    label(
      c,
      `Friction μ = ${p.mu}`,
      550, 246,
      '#c7e6f7',
      14
    );

    if (s.running) {
      label(
        c,
        'SLIDING DOWN ↙',
        265, 85,
        '#ffe29b',
        15
      );
    }

    return [
      [
        'Acceleration',
        `${fmt(getRampAcceleration(p, s.velocity))} m/s²`
      ],
      [
        'Distance traveled',
        `${fmt(s.position)} / 4.00 m`
      ],
      [
        'Block speed',
        `${fmt(s.velocity)} m/s`
      ],
      [
        'Friction coefficient',
        fmt(p.mu)
      ]
    ];
  }

  /* ========================================
     DRAW COLLIDING CARTS
     ======================================== */

  function drawCart(
    c,
    x,
    color,
    name,
    mass,
    spin
  ) {
    rounded(
      c,
      x - 38, 210,
      76, 45,
      color
    );

    label(
      c,
      `${name} ${mass}kg`,
      x, 237,
      'white',
      13
    );

    [-22, 22].forEach(dx => {
      const wx = x + dx;
      const wy = 258;

      // Wheel
      c.beginPath();

      c.arc(
        wx,
        wy,
        14,
        0,
        Math.PI * 2
      );

      c.fillStyle = '#162337';
      c.fill();

      c.strokeStyle = '#a8eaff';
      c.lineWidth = 3;
      c.stroke();

      // Rotating wheel spokes
      for (let i = 0; i < 4; i++) {
        const a =
          spin +
          i * Math.PI / 2;

        c.beginPath();
        c.moveTo(wx, wy);

        c.lineTo(
          wx + 9 * Math.cos(a),
          wy + 9 * Math.sin(a)
        );

        c.strokeStyle = '#d3ecff';
        c.lineWidth = 2;
        c.stroke();
      }
    });
  }

  function drawCollision(c, s) {
    const x1 = 55 + 70 * s.x1;
    const x2 = 55 + 70 * s.x2;

    // Track
    rounded(
      c,
      24, 274,
      631, 6,
      '#8aaeca',
      1
    );

    for (let x = 35; x < 655; x += 62) {
      rounded(
        c,
        x, 283,
        30, 3,
        '#6a8cae',
        1
      );
    }

    // Two carts
    drawCart(
      c,
      x1,
      '#2796e7',
      'm₁',
      s.p.m1,
      s.spin1
    );

    drawCart(
      c,
      x2,
      '#ffa15b',
      'm₂',
      s.p.m2,
      s.spin2
    );

    if (
      s.collided &&
      s.elapsed - s.hitAt < 0.45
    ) {
      label(
        c,
        '💥 COLLISION!',
        340, 114,
        '#ffe081',
        23
      );
    } else {
      label(
        c,
        s.collided
          ? 'CARTS EXCHANGED MOMENTUM'
          : 'BLUE CART → ORANGE CART',
        340, 95,
        '#b0e9ff',
        17
      );
    }

    const p = s.p;

    const momentum =
      p.m1 * s.v1 +
      p.m2 * s.v2;

    const energy =
      0.5 * p.m1 * s.v1 ** 2 +
      0.5 * p.m2 * s.v2 ** 2;

    return [
      [
        'Blue velocity',
        `${fmt(s.v1)} m/s`
      ],
      [
        'Orange velocity',
        `${fmt(s.v2)} m/s`
      ],
      [
        'Total momentum',
        `${fmt(momentum)} kg·m/s`
      ],
      [
        'Kinetic energy',
        `${fmt(energy)} J`
      ],
      [
        'Collision',
        s.collided ? 'Occurred' : 'Not yet'
      ],
      [
        'Restitution',
        fmt(p.restitution, 1)
      ]
    ];
  }

  /* ========================================
     DRAW PULLEY & LIFTING LOAD
     ======================================== */

  function drawPulley(c, s) {
    const p = s.p;

    const loadY =
      239 - 96 * s.position;

    // Support
    rounded(
      c,
      195, 57,
      265, 9,
      '#7b9fbc',
      3
    );

    // Supporting strands (schematic)
    for (
      let i = 0;
      i < p.advantage;
      i++
    ) {
      const x = 270 + i * 19;

      c.strokeStyle = '#ffd180';
      c.lineWidth = 3;

      c.beginPath();
      c.moveTo(x, 66);
      c.lineTo(x, loadY);
      c.stroke();
    }

    // Pulley wheel
    c.beginPath();

    c.arc(
      407, 110,
      34,
      0,
      Math.PI * 2
    );

    c.fillStyle = '#2b4c66';
    c.fill();

    c.strokeStyle = '#91e9ff';
    c.lineWidth = 4;
    c.stroke();

    // Effort rope
    c.beginPath();
    c.moveTo(407, 76);
    c.lineTo(452, 76);
    c.lineTo(452, 264);

    c.strokeStyle = '#ffd180';
    c.lineWidth = 4;
    c.stroke();

    // Moving load
    rounded(
      c,
      246,
      loadY,
      107,
      47,
      '#2494e4',
      7
    );

    label(
      c,
      `${p.mass} kg`,
      300,
      loadY + 29,
      '#fff',
      19
    );

    label(
      c,
      'PULL ↓',
      494, 248,
      '#ffdb9d',
      17
    );

    label(
      c,
      `Ideal mechanical advantage = ${p.advantage}`,
      342, 307,
      '#acecff',
      15
    );

    // Correct calculations
    const weight =
      p.mass * 9.81;

    const upward =
      p.force * p.advantage;

    const net =
      upward - weight;

    const acceleration =
      net / p.mass;

    return [
      [
        'Weight',
        `${fmt(weight)} N`
      ],
      [
        'Upward pull',
        `${fmt(upward)} N`
      ],
      [
        'Net force',
        `${fmt(net)} N`
      ],
      [
        'Net acceleration',
        `${fmt(acceleration)} m/s²`
      ],
      [
        'Load lifted',
        `${fmt(s.position)} m`
      ],
      [
        'Minimum effort to lift',
        `${fmt(weight / p.advantage)} N`
      ]
    ];
  }

  /* ========================================
     LIVE RESULTS + FORMULA
     ======================================== */

  function paint(s) {
    if (active !== s) return;

    const canvas = $('pf3Canvas');
    const results = $('experimentResults');

    if (!canvas || !results) return;

    const c = canvas.getContext('2d');

    background(
      c,
      FIXED[s.key].title
    );

    let rows;

    if (s.key === 'ramp') {
      rows = drawRamp(c, s);

    } else if (s.key === 'collision') {
      rows = drawCollision(c, s);

    } else {
      rows = drawPulley(c, s);
    }

    rows.push([
      'Elapsed time',
      `${fmt(s.elapsed, 1)} s`
    ]);

    rows.push([
      'Status',
      s.status
    ]);

    results.innerHTML = `
      <div class="pf3-tiles">
        ${rows.map(([name, value]) => `
          <div class="pf3-tile">
            <small>${name}</small>
            <strong>${value}</strong>
          </div>
        `).join('')}
      </div>

      <div class="pf3-formula">
        <strong>📐 Formula:</strong>
        ${FIXED[s.key].formula}

        <p>${FIXED[s.key].note}</p>
      </div>
    `;

    const buttons = $('pf3Buttons');

    if (buttons) {
      buttons.querySelector(
        '[data-pf3="start"]'
      ).disabled = s.running;

      buttons.querySelector(
        '[data-pf3="pause"]'
      ).disabled = !s.running;
    }
  }

  /* ========================================
     ANIMATION LOOP
     ======================================== */

  function tick(now) {
    const s = active;

    if (!s || !s.running) return;

    const dt = s.last
      ? Math.min(
          0.04,
          (now - s.last) / 1000
        )
      : 0;

    s.last = now;

    if (dt > 0) {
      s.elapsed += dt;
      advance(s, dt);
    }

    paint(s);

    if (s.running) {
      s.frame = requestAnimationFrame(tick);
    }
  }

  /* ========================================
     EXPERIMENT PAGE
     ======================================== */

  function mount(key) {
    const config = FIXED[key];

    const params = Object.fromEntries(
      config.inputs.map(c => [
        c[0],
        c[4]
      ])
    );

    const s = initialState(
      key,
      params
    );

    active = s;

    currentExperiment = key;
    experimentState = {...params};

    $('experimentWorkspace')
      ?.classList.add('pf3-active');

    $('activeExperimentTitle').textContent =
      config.title;

    $('activeExperimentDescription').textContent =
      EXPERIMENTS[key]?.description ||
      config.title;

    const controls = $('experimentControls');

    // Fresh sliders — no old event listeners
    controls.innerHTML = config.inputs.map(
      ([id, name, min, max, value, step, unit]) => `
        <div class="control-group">
          <label for="pf3-${id}">
            ${name}:
            <span id="pf3v-${id}">
              ${value}${unit}
            </span>
          </label>

          <input
            type="range"
            id="pf3-${id}"
            data-pf3input="${id}"
            min="${min}"
            max="${max}"
            step="${step}"
            value="${value}"
          >
        </div>
      `
    ).join('');

    // Fresh simulation + controls
    $('simulationCanvas').innerHTML = `
      <div class="pf3-stage">

        <canvas
          id="pf3Canvas"
          class="pf3-canvas"
          width="1360"
          height="680"
        ></canvas>

        <div
          class="pf3-buttons"
          id="pf3Buttons"
        >
          <button
            type="button"
            data-pf3="start"
          >▶ Start</button>

          <button
            type="button"
            data-pf3="pause"
          >⏸ Pause</button>

          <button
            type="button"
            data-pf3="stop"
          >■ Stop</button>

          <button
            type="button"
            data-pf3="reset"
          >↻ Reset</button>
        </div>

      </div>
    `;

    /* ==================================
       SLIDERS
       ================================== */

    controls.querySelectorAll(
      '[data-pf3input]'
    ).forEach(input => {
      input.addEventListener('input', () => {
        if (active !== s) return;

        const id =
          input.dataset.pf3input;

        s.p[id] = Number(input.value);

        experimentState[id] = s.p[id];

        const item = config.inputs.find(
          c => c[0] === id
        );

        $('pf3v-' + id).textContent =
          input.value + item[6];

        // A collision must be restarted if
        // mass, speed, or bounciness changes.
        if (
          s.key === 'collision' ||
          !s.running
        ) {
          restartMotion(s);
        }

        paint(s);
      });
    });

    /* ==================================
       START / PAUSE / STOP / RESET
       ================================== */

    $('pf3Buttons').addEventListener(
      'click',
      event => {
        if (active !== s) return;

        const action = event.target.closest(
          '[data-pf3]'
        )?.dataset.pf3;

        if (!action) return;

        // START
        if (action === 'start') {
          if (s.running) return;

          // Restart motion but preserve the
          // student's selected slider values.
          if (
            !['Paused', 'Ready'].includes(
              s.status
            )
          ) {
            restartMotion(s);
          }

          s.running = true;
          s.status = 'Running';
          s.last = 0;

          s.frame = requestAnimationFrame(tick);
        }

        // PAUSE
        else if (action === 'pause') {
          s.running = false;

          cancelAnimationFrame(s.frame);

          s.status = 'Paused';
          s.last = 0;
        }

        // STOP
        else if (action === 'stop') {
          s.running = false;

          cancelAnimationFrame(s.frame);

          s.status = 'Stopped';
          s.last = 0;
        }

        // RESET
        else if (action === 'reset') {
          config.inputs.forEach(item => {
            const id = item[0];
            const value = item[4];
            const unit = item[6];

            s.p[id] = value;

            $('pf3-' + id).value = value;

            $('pf3v-' + id).textContent =
              value + unit;
          });

          experimentState = {...s.p};

          restartMotion(s);
        }

        paint(s);
      }
    );

    paint(s);
  }

  /* ========================================
     CONNECT WITH EXISTING POCKETLAB
     ======================================== */

  startExperiment = function(key, ...args) {
    stopOldSession();

    // Every other experiment stays unchanged.
    if (!FIXED[key]) {
      return previousStart.call(
        this,
        key,
        ...args
      );
    }

    // Preserve original navigation, MCQs,
    // progress tracking, and tutor.
    const result = previousStart.call(
      this,
      key,
      ...args
    );

    // Replace broken physics simulation.
    mount(key);

    return result;
  };

  console.log(
    'PocketLab: Ramp, Collision and Pulley fixes loaded!'
  );

})();

/* ==========================================================
   POCKETLAB 3.0 — ANIMATED BIOLOGY EXPERIMENTS
   PASTE AT THE VERY BOTTOM OF script.js
   Keep all existing files and code.
   ========================================================== */

(() => {
  'use strict';

  const BIO = [
    {
      id: 'bioPhotosynthesis',
      name: 'Photosynthesis Studio',
      emoji: '🌿',
      desc: 'Watch sunlight, water and CO₂ power a leaf.',
      formula: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
      fact: 'Plants use light energy to make sugars. Light, water and CO₂ can limit the rate.',
      change: 'Increasing a limiting resource can increase photosynthesis.',
      controls: [
        ['light', 'Sunlight', 0, 100, 70, 5, '%'],
        ['water', 'Water', 0, 100, 75, 5, '%'],
        ['co2', 'CO₂ availability', 0, 100, 65, 5, '%']
      ],
      quiz: [
        ['Which gas is released during photosynthesis?', 'Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
        ['Which organelle carries out photosynthesis?', 'Chloroplast', 'Mitochondrion', 'Nucleus', 'Ribosome'],
        ['Which resource supplies energy?', 'Sunlight', 'Soil', 'Wind', 'Oxygen'],
        ['Which gas is taken in?', 'Carbon dioxide', 'Oxygen', 'Helium', 'Neon'],
        ['What happens if light becomes zero?', 'Light-dependent photosynthesis stops', 'Rate doubles', 'Oxygen output increases', 'Nothing changes']
      ]
    },
    {
      id: 'bioOsmosis',
      name: 'Osmosis & Cell Membrane',
      emoji: '💧',
      desc: 'See water cross a membrane and cells change size.',
      formula: 'π ≈ iCRT (ideal dilute solution)',
      fact: 'Water tends to cross a semipermeable membrane toward the side with higher effective solute concentration.',
      change: 'Water moves into the cell when inside solute concentration is higher than outside.',
      controls: [
        ['inside', 'Inside solute', 0, 100, 60, 5, '%'],
        ['outside', 'Outside solute', 0, 100, 25, 5, '%'],
        ['permeability', 'Membrane permeability', 0, 100, 70, 5, '%']
      ],
      quiz: [
        ['What crosses the membrane in osmosis?', 'Water', 'DNA', 'Large proteins', 'Starch'],
        ['Water moves toward which solution?', 'Higher effective solute concentration', 'Lower solute concentration', 'Always outdoors', 'Always indoors'],
        ['A cell placed in a very hypertonic solution tends to...', 'Shrink', 'Expand rapidly', 'Divide', 'Glow'],
        ['The membrane is described as...', 'Semipermeable', 'Solid metal', 'Impermeable to everything', 'Transparent to all molecules'],
        ['If both sides have equal effective solute concentration...', 'No net water movement occurs', 'All water disappears', 'The cell must rupture', 'All solute enters']
      ]
    },
    {
      id: 'bioHeart',
      name: 'Heartbeat & Circulation',
      emoji: '❤️',
      desc: 'Watch blood circulation and a pulsing heart.',
      formula: 'Cardiac output = Heart rate × Stroke volume',
      fact: 'The heart pumps blood through the pulmonary and systemic circuits.',
      change: 'Increasing heart rate at a fixed stroke volume increases cardiac output.',
      controls: [
        ['bpm', 'Heart rate', 40, 160, 72, 5, ' bpm'],
        ['stroke', 'Stroke volume', 40, 110, 70, 5, ' mL']
      ],
      quiz: [
        ['Which organ pumps blood?', 'Heart', 'Lung', 'Kidney', 'Stomach'],
        ['Which blood vessels carry blood away from the heart?', 'Arteries', 'Veins', 'Capillaries only', 'Lymph nodes'],
        ['What does cardiac output measure?', 'Blood pumped per minute', 'Blood pressure only', 'Oxygen dissolved', 'Heart mass'],
        ['What occurs in the lungs?', 'Blood gains oxygen', 'Blood makes glucose', 'Blood forms bones', 'Blood loses all water'],
        ['What is normal blood flow through the heart?', 'One-way through valves', 'Backwards in every beat', 'Random in all directions', 'Only through the left side']
      ]
    },
    {
      id: 'bioMitosis',
      name: 'Cell Division (Mitosis)',
      emoji: '🧬',
      desc: 'Watch chromosomes align and separate into daughter cells.',
      formula: '1 parent cell (2n) → 2 daughter cells (2n each)',
      fact: 'Mitosis creates two genetically similar daughter nuclei. Cytokinesis divides the cytoplasm.',
      change: 'Changing cycle speed changes how quickly the stages are shown, not chromosome number.',
      controls: [
        ['speed', 'Cycle speed', 1, 5, 2, 1, '×'],
        ['chromosomes', 'Chromosome pairs', 2, 6, 4, 1, '']
      ],
      quiz: [
        ['In which stage do chromosomes line up at the middle?', 'Metaphase', 'Prophase', 'Telophase', 'Interphase'],
        ['In which stage do sister chromatids separate?', 'Anaphase', 'Interphase', 'Prophase', 'Telophase'],
        ['How many daughter cells usually result?', 'Two', 'One', 'Three', 'Eight'],
        ['What divides the cytoplasm?', 'Cytokinesis', 'Photosynthesis', 'Osmosis', 'Respiration'],
        ['Mitosis helps organisms with...', 'Growth and repair', 'Only digestion', 'Only gas exchange', 'Only sound detection']
      ]
    },
    {
      id: 'bioDNA',
      name: 'DNA Replication Lab',
      emoji: '🧬',
      desc: 'See a double helix and a moving replication fork.',
      formula: 'A pairs with T; C pairs with G',
      fact: 'DNA replication is semiconservative: each new DNA molecule has one old and one newly synthesized strand.',
      change: 'Higher replication speed makes the demonstration proceed faster.',
      controls: [
        ['speed', 'Replication speed', 1, 5, 2, 1, '×'],
        ['pairs', 'Base pairs shown', 8, 20, 14, 2, '']
      ],
      quiz: [
        ['Adenine pairs with...', 'Thymine', 'Guanine', 'Cytosine', 'Uracil'],
        ['Cytosine pairs with...', 'Guanine', 'Thymine', 'Adenine', 'Uracil'],
        ['DNA replication is called...', 'Semiconservative', 'Random', 'Destructive', 'One-sided'],
        ['Which enzyme builds new DNA strands?', 'DNA polymerase', 'Amylase', 'Pepsin', 'Lipase'],
        ['DNA consists of building blocks called...', 'Nucleotides', 'Amino acids', 'Fatty acids', 'Glucose molecules']
      ]
    },
    {
      id: 'bioNeuron',
      name: 'Neuron & Nerve Impulse',
      emoji: '⚡',
      desc: 'Watch electrical signals move along a neuron.',
      formula: 'Signal travel time = Axon length ÷ Conduction speed',
      fact: 'Nerve impulses are electrochemical action potentials that travel along axons.',
      change: 'Increasing conduction speed decreases the time a signal takes to travel the same distance.',
      controls: [
        ['speed', 'Conduction speed', 1, 100, 40, 1, ' m/s'],
        ['frequency', 'Impulse frequency', 1, 12, 4, 1, ' Hz']
      ],
      quiz: [
        ['Which cell transmits nerve impulses?', 'Neuron', 'Red blood cell', 'Platelet', 'Bone cell'],
        ['Which part carries signals away from the cell body?', 'Axon', 'Nucleus', 'Cell wall', 'Chloroplast'],
        ['What helps many axons conduct faster?', 'Myelin', 'Starch', 'Chlorophyll', 'Hemoglobin'],
        ['What is a synapse?', 'A junction between communicating cells', 'A bone', 'A heart valve', 'A leaf pore'],
        ['Which ions play a major role in an action potential?', 'Sodium and potassium', 'Gold and silver', 'Iron and copper only', 'Carbon and silicon']
      ]
    },
    {
      id: 'bioGermination',
      name: 'Seed Germination & Growth',
      emoji: '🌱',
      desc: 'Watch a seed grow roots, a stem and new leaves.',
      formula: 'Growth index = f(water, temperature, elapsed time) (model)',
      fact: 'Seeds need suitable water, oxygen and temperature to germinate. Leaves later use light for photosynthesis.',
      change: 'Insufficient water or unsuitable temperature slows germination.',
      controls: [
        ['water', 'Water availability', 0, 100, 75, 5, '%'],
        ['temperature', 'Temperature', 5, 45, 26, 1, ' °C'],
        ['light', 'Sunlight', 0, 100, 70, 5, '%']
      ],
      quiz: [
        ['What appears first in many germinating seeds?', 'Radicle (young root)', 'Flower', 'Fruit', 'Pollen'],
        ['What does a seed need to germinate?', 'Water and suitable conditions', 'Sunlight only', 'Soil always', 'Fertilizer always'],
        ['Roots mainly absorb...', 'Water and minerals', 'Sunlight', 'Carbon dioxide directly', 'Sound'],
        ['Which plant part performs most photosynthesis later?', 'Leaves', 'Roots', 'Seed coat', 'Petals only'],
        ['Extremely high temperature may...', 'Inhibit germination', 'Always speed it up', 'Make seeds magnetic', 'Turn water into sugar']
      ]
    },
    {
      id: 'bioBreathing',
      name: 'Lungs & Breathing',
      emoji: '🫁',
      desc: 'See lungs expand and contract during breathing.',
      formula: 'Minute ventilation = Breaths/min × Tidal volume',
      fact: 'During inhalation the diaphragm contracts and air enters the lungs. Gas exchange occurs in alveoli.',
      change: 'Increasing breathing rate at fixed tidal volume increases minute ventilation.',
      controls: [
        ['rate', 'Breathing rate', 6, 30, 14, 1, ' /min'],
        ['tidal', 'Tidal volume', 0.3, 1, 0.5, 0.1, ' L']
      ],
      quiz: [
        ['Which muscle helps draw air into lungs?', 'Diaphragm', 'Biceps', 'Tongue', 'Heart'],
        ['Where does most gas exchange occur?', 'Alveoli', 'Trachea', 'Nose', 'Ribs'],
        ['Which gas enters blood in lungs?', 'Oxygen', 'Nitrogen only', 'Helium', 'Methane'],
        ['What happens to the diaphragm during inhalation?', 'It contracts and moves downward', 'It disappears', 'It always relaxes upward', 'It becomes bone'],
        ['What is tidal volume?', 'Air moved in a normal breath', 'Total heart blood', 'Body temperature', 'Blood sugar']
      ]
    }
  ];

  const lookup = Object.fromEntries(
    BIO.map(lab => [lab.id, lab])
  );

  const $ = id => document.getElementById(id);

  const round = (value, digits = 1) =>
    Number.isFinite(value)
      ? value.toFixed(digits)
      : '—';

  const limit = (value, min, max) =>
    Math.min(max, Math.max(min, value));

  /* ==============================================
     BIOLOGY PREMIUM DESIGN
     ============================================== */

  const css = document.createElement('style');

  css.textContent = `
    .plbio-card .pl-experiment-preview {
      background: radial-gradient(
        circle,
        #195b67,
        #081a2e 75%
      );
      border: 1px solid #316b89;
    }

    .plbio-card .plbio-icon {
      font-size: 56px;
      display: block;
      filter: drop-shadow(0 0 20px #33e6b888);
    }

    .plbio-stage {
      width: 100%;
      max-width: 850px;
      margin: auto;
    }

    .plbio-stage canvas {
      display: block;
      width: 100%;
      height: auto;
      background: #071b30;
      border: 1px solid #336b8b;
      border-radius: 16px;
    }

    .plbio-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 9px;
      margin: 14px 0;
    }

    .plbio-actions button,
    .plbio-next,
    .plbio-send {
      border: 1px solid #65c8e6;
      border-radius: 9px;
      padding: 11px 17px;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      background: #176bc5;
    }

    .plbio-actions button[data-do="start"] {
      background: #08a78b;
    }

    .plbio-actions button[data-do="stop"] {
      background: #c74757;
    }

    .plbio-actions button[data-do="reset"] {
      background: #344e67;
    }

    .plbio-actions button:disabled,
    .plbio-next:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .plbio-readings {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .plbio-reading {
      background: #10304b;
      border: 1px solid #2b6687;
      padding: 12px;
      border-radius: 10px;
    }

    .plbio-reading small {
      display: block;
      color: #b3cede;
      font-size: 12px;
      margin-bottom: 5px;
    }

    .plbio-reading strong {
      color: #77f2e0;
      font-size: 19px;
    }

    .plbio-equation {
      padding: 13px;
      margin-top: 12px;
      background: #0a263d;
      border-left: 3px solid #58dfd8;
      line-height: 1.6;
    }

    .plbio-learning {
      margin-top: 20px;
      background: linear-gradient(
        145deg,
        #112941,
        #091b31
      );
      border: 1px solid #2b6589;
      padding: 20px;
      border-radius: 16px;
    }

    .plbio-learning h3 {
      color: #8af5df;
      margin: 0 0 12px;
    }

    .plbio-choice {
      display: block;
      text-align: left;
      width: 100%;
      padding: 12px;
      margin: 8px 0;
      border-radius: 9px;
      color: #e8f8ff;
      background: #173954;
      border: 1px solid #306389;
      cursor: pointer;
    }

    .plbio-choice:disabled {
      cursor: default;
    }

    .plbio-answer {
      margin: 12px 0;
      line-height: 1.5;
      color: #b4ecf9;
    }

    .plbio-chat {
      max-height: 270px;
      overflow: auto;
      display: grid;
      gap: 8px;
      margin: 12px 0;
    }

    .plbio-msg {
      padding: 12px;
      white-space: pre-wrap;
      background: #153650;
      border-radius: 9px;
      line-height: 1.5;
    }

    .plbio-msg.user {
      background: #24516b;
    }

    .plbio-ask textarea {
      width: 100%;
      box-sizing: border-box;
      background: #071a2e;
      color: #fff;
      border: 1px solid #3b7899;
      border-radius: 9px;
      padding: 12px;
      min-height: 75px;
      resize: vertical;
    }

    #experimentWorkspace.plbio-active #plFormula,
    #experimentWorkspace.plbio-active #plLearning,
    #experimentWorkspace.plbio-active #plxLearn {
      display: none !important;
    }

    @media (max-width: 530px) {
      .plbio-readings {
        grid-template-columns: 1fr;
      }

      .plbio-actions button {
        padding: 10px 12px;
      }
    }
  `;

  document.head.appendChild(css);

  /* ==============================================
     REGISTER BIOLOGY EXPERIMENTS
     ============================================== */

  BIO.forEach(lab => {
    if (!EXPERIMENTS[lab.id]) {
      EXPERIMENTS[lab.id] = {
        title: lab.name,
        description: lab.desc,
        explanation: `<p>${lab.fact}</p>`
      };
    }
  });

  function buildBiologyCards() {
    const grid = document.querySelector(
      '#laboratory .experiment-grid'
    );

    if (!grid) return;

    const fragment = document.createDocumentFragment();
    const filter = $('experimentFilter')?.value || 'all';

    BIO.forEach(lab => {
      if (
        grid.querySelector(
          `.plbio-card [data-experiment="${lab.id}"]`
        )
      ) {
        return;
      }

      const card = document.createElement('article');

      card.className = 'experiment-card plbio-card';
      card.dataset.category = 'biology';
      card.dataset.recommended =
        'primary secondary senior college';

      if (filter !== 'all' && filter !== 'biology') {
        card.classList.add('hidden');
      }

      card.innerHTML = `
        <div class="pl-experiment-preview">
          <span class="plbio-icon">
            ${lab.emoji}
          </span>
        </div>

        <div class="pl-experiment-status">
          ● ANIMATED BIOLOGY
        </div>

        <h3 class="pl-experiment-title">
          ${lab.name}
        </h3>

        <p class="pl-experiment-description">
          ${lab.desc}
        </p>

        <div class="pl-experiment-footer">
          <small>Biology · Live simulation</small>

          <button
            type="button"
            class="pl-experiment-start"
            data-experiment="${lab.id}"
          >
            ▶ Start
          </button>
        </div>
      `;

      fragment.appendChild(card);
    });

    if (!fragment.childNodes.length) return;

    const firstBiology = grid.querySelector(
      '.experiment-card[data-category="biology"]'
    );

    grid.insertBefore(fragment, firstBiology || null);
  }

  /* ==============================================
     EXPERIMENT ENGINE
     ============================================== */

  let session = null;
  const previousStart = startExperiment;

  function leaveBiology() {
    if (session) {
      cancelAnimationFrame(session.raf);
      session.running = false;
      session = null;
    }

    $('experimentWorkspace')
      ?.classList.remove('plbio-active');
  }

  function newSession(lab) {
    return {
      lab,
      params: Object.fromEntries(
        lab.controls.map(c => [c[0], c[4]])
      ),
      time: 0,
      last: 0,
      running: false,
      raf: 0,
      status: 'Ready',
      question: 0,
      score: 0,
      answered: false
    };
  }

  function controlHTML(c) {
    return `
      <div class="control-group">
        <label for="plbio-${c[0]}">
          ${c[1]}:
          <span id="plbio-value-${c[0]}">
            ${c[4]}${c[6]}
          </span>
        </label>

        <input
          type="range"
          id="plbio-${c[0]}"
          data-bio-control="${c[0]}"
          min="${c[2]}"
          max="${c[3]}"
          value="${c[4]}"
          step="${c[5]}"
        >
      </div>
    `;
  }

  function openBiology(key) {
    const lab = lookup[key];
    if (!lab) return;

    leaveBiology();

    // Allow earlier lab wrappers to stop any
    // currently running Physics simulation.
    try {
      previousStart(key);
    } catch (error) {
      console.warn(
        'Previous lab initialization skipped:',
        error
      );
    }

    const s = newSession(lab);
    session = s;

    currentExperiment = key;
    experimentState = {...s.params};

    $('experimentWorkspace')
      ?.classList.add('plbio-active');

    $('activeExperimentTitle').textContent = lab.name;
    $('activeExperimentDescription').textContent =
      lab.desc;

    $('experimentExplanation').innerHTML =
      `<p>${lab.fact}</p>`;

    const complete = $('completeExperiment');

    if (complete) {
      complete.disabled = false;

      complete.textContent =
        progress.completed.includes(key)
          ? 'Experiment Completed ✓'
          : 'Complete Experiment ✓';
    }

    $('experimentControls').innerHTML =
      lab.controls.map(controlHTML).join('');

    $('simulationCanvas').innerHTML = `
      <div class="plbio-stage">

        <canvas
          id="plbio-canvas"
          width="900"
          height="440"
          aria-label="${lab.name} animated simulation"
        ></canvas>

        <div class="plbio-actions">

          <button type="button" data-do="start">
            ▶ Start
          </button>

          <button type="button" data-do="pause">
            ⏸ Pause
          </button>

          <button type="button" data-do="stop">
            ■ Stop
          </button>

          <button type="button" data-do="reset">
            ↻ Reset
          </button>

        </div>
      </div>
    `;

    $('experimentResults').innerHTML = `
      <div
        class="plbio-readings"
        id="plbio-metrics"
      ></div>

      <div class="plbio-equation">
        <strong>📐 Formula / Principle</strong>
        <div id="plbio-formula"></div>
        <p id="plbio-fact"></p>
      </div>
    `;

    $('plbio-formula').textContent = lab.formula;
    $('plbio-fact').textContent = lab.fact;

    /* SLIDER EVENTS */

    $('experimentControls')
      .querySelectorAll('[data-bio-control]')
      .forEach(input => {
        input.addEventListener('input', () => {
          if (session !== s) return;

          const name = input.dataset.bioControl;

          s.params[name] = Number(input.value);
          experimentState[name] = s.params[name];

          const definition = lab.controls.find(
            c => c[0] === name
          );

          $('plbio-value-' + name).textContent =
            input.value + definition[6];

          draw(s);
        });
      });

    /* START / PAUSE / STOP / RESET */

    $('simulationCanvas')
      .querySelector('.plbio-actions')
      .addEventListener('click', event => {
        const action = event.target.closest(
          '[data-do]'
        )?.dataset.do;

        if (!action || session !== s) return;

        if (action === 'start') {
          if (s.running) return;

          if (s.status === 'Stopped') {
            s.time = 0;
          }

          s.running = true;
          s.status = 'Running';
          s.last = 0;
          s.raf = requestAnimationFrame(tick);

        } else if (action === 'pause') {
          s.running = false;
          cancelAnimationFrame(s.raf);
          s.last = 0;
          s.status = 'Paused';

        } else if (action === 'stop') {
          s.running = false;
          cancelAnimationFrame(s.raf);
          s.last = 0;
          s.status = 'Stopped';

        } else if (action === 'reset') {
          s.running = false;
          cancelAnimationFrame(s.raf);

          s.time = 0;
          s.last = 0;
          s.status = 'Ready';

          lab.controls.forEach(c => {
            s.params[c[0]] = c[4];

            const input = $('plbio-' + c[0]);

            if (input) input.value = c[4];

            $('plbio-value-' + c[0]).textContent =
              c[4] + c[6];
          });

          experimentState = {...s.params};
        }

        draw(s);
      });

    navigate('experimentWorkspace');

    mountQuizAndTutor(s);
    draw(s);
  }

  function tick(now) {
    const s = session;
    if (!s || !s.running) return;

    if (s.last) {
      s.time += Math.min(
        0.04,
        (now - s.last) / 1000
      );
    }

    s.last = now;
    draw(s);

    if (s.running) {
      s.raf = requestAnimationFrame(tick);
    }
  }

  /* ==============================================
     ANIMATION GRAPHICS HELPERS
     ============================================== */

  function rect(c, x, y, w, h, color, radius = 0) {
    c.fillStyle = color;
    c.beginPath();
    c.roundRect(x, y, w, h, radius);
    c.fill();
  }

  function line(c, x1, y1, x2, y2, color = '#7defff', width = 3) {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }

  function circle(c, x, y, r, color, border) {
    c.beginPath();
    c.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
    c.fillStyle = color;
    c.fill();

    if (border) {
      c.strokeStyle = border;
      c.lineWidth = 2;
      c.stroke();
    }
  }

  function label(
    c, message, x, y,
    size = 16,
    color = '#d7eeff',
    align = 'center'
  ) {
    c.fillStyle = color;
    c.textAlign = align;
    c.font = `${size}px system-ui`;
    c.fillText(message, x, y);
  }

  function ellipse(c, x, y, rx, ry, fill, stroke) {
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);

    if (fill) {
      c.fillStyle = fill;
      c.fill();
    }

    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = 3;
      c.stroke();
    }
  }

  function background(c, title) {
    const gradient = c.createRadialGradient(
      450, 205, 5,
      450, 210, 460
    );

    gradient.addColorStop(0, '#154260');
    gradient.addColorStop(1, '#061326');

    rect(c, 0, 0, 900, 440, gradient);

    for (let x = 0; x < 900; x += 45) {
      line(c, x, 0, x, 440, '#ffffff08', 1);
    }

    for (let y = 0; y < 440; y += 45) {
      line(c, 0, y, 900, y, '#ffffff08', 1);
    }

    label(
      c,
      title.toUpperCase(),
      450, 39, 20, '#b7ecff'
    );
  }

  /* ==============================================
     ALL 8 ANIMATIONS
     ============================================== */

  function drawBiology(c, s) {
    const p = s.params;
    const t = s.time;
    const running = s.running;
    const readings = [];

    const add = (name, value) => {
      readings.push([name, String(value)]);
    };

    /* 1. PHOTOSYNTHESIS */

    if (s.lab.id === 'bioPhotosynthesis') {
      const rate = Math.min(
        p.light,
        p.water,
        p.co2
      );

      ellipse(
        c, 450, 232,
        152, 92,
        '#1f9966',
        '#6cfa9f'
      );

      line(c, 310, 235, 592, 230, '#a5ff9e', 5);

      for (let i = 0; i < 6; i++) {
        const x = 360 + i * 34;

        line(c, x, 234, x - 22, 202, '#81df90', 2);
        line(c, x, 234, x + 20, 264, '#81df90', 2);
      }

      label(
        c,
        'CHLOROPLAST • PHOTOSYNTHESIS',
        450, 365, 17, '#88ffb3'
      );

      // Moving sunlight particles
      for (let i = 0; i < Math.floor(p.light / 13); i++) {
        const a = running
          ? (t * 0.7 + i / 8) % 1
          : i / 8;

        circle(
          c,
          100 + 230 * a,
          73 + 145 * a + (i % 3) * 14,
          7,
          '#ffdf63'
        );
      }

      // Oxygen bubbles
      for (let i = 0; i < Math.floor(rate / 12); i++) {
        const a = running
          ? (t * 0.65 + i / 9) % 1
          : i / 9;

        circle(
          c,
          595 + 45 * a,
          269 - 198 * a + (i % 2) * 16,
          7,
          '#92f6fe',
          '#c3ffff'
        );
      }

      label(c, '☀ LIGHT', 170, 82, 16, '#ffdd73');
      label(c, 'O₂ BUBBLES ↑', 690, 100, 16, '#8aefff');

      add('Photosynthesis rate (model)', rate + '%');
      add('Sunlight', p.light + '%');
      add('Water', p.water + '%');
      add('CO₂ availability', p.co2 + '%');
    }

    /* 2. OSMOSIS */

    else if (s.lab.id === 'bioOsmosis') {
      const difference = p.inside - p.outside;

      const change = limit(
        difference / 100 *
        (p.permeability / 100) *
        Math.min(t, 9) * 2,
        -45,
        45
      );

      const radius = 86 + change;

      line(c, 450, 80, 450, 375, '#f8c478', 6);

      ellipse(
        c,
        635, 217,
        radius,
        radius * 0.85,
        '#3caac050',
        '#82f9e1'
      );

      circle(c, 635, 217, 24, '#d985d6');

      for (let i = 0; i < 10; i++) {
        const a = i * 0.56;

        circle(
          c,
          635 + radius * 0.58 * Math.cos(a),
          217 + radius * 0.55 * Math.sin(a),
          4.5,
          '#c7f9ff'
        );
      }

      // Water molecules
      for (let i = 0; i < 25; i++) {
        circle(
          c,
          75 + (i * 97) % 350,
          90 + (i * 67) % 260,
          3.8,
          '#77dffc'
        );
      }

      for (let i = 0; i < 14; i++) {
        const v = (
          i / 14 +
          (running
            ? t * 0.17 * p.permeability / 100
            : 0)
        ) % 1;

        const inward = difference > 0;
        const x = inward
          ? 380 + v * 165
          : 560 - v * 165;

        circle(
          c,
          x,
          96 + (i * 43) % 250,
          4,
          '#a0f9ff'
        );
      }

      label(c, 'OUTSIDE SOLUTION', 230, 385, 16);
      label(c, 'CELL', 635, 385, 16, '#92ffdb');

      add(
        'Net water movement',
        difference > 0
          ? 'Into cell'
          : difference < 0
            ? 'Out of cell'
            : 'Balanced'
      );

      add('Inside solute', p.inside + '%');
      add('Outside solute', p.outside + '%');
      add('Cell size change (model)', round(change) + ' px');
    }

    /* 3. HEARTBEAT */

    else if (s.lab.id === 'bioHeart') {
      const pulse = running
        ? Math.pow(
            Math.max(
              0,
              Math.sin(t * p.bpm / 60 * 2 * Math.PI)
            ),
            4
          )
        : 0;

      c.save();
      c.translate(450, 220);
      c.scale(1 + pulse * 0.12, 1 + pulse * 0.12);

      c.beginPath();
      c.moveTo(0, 112);

      c.bezierCurveTo(
        -210, -22,
        -130, -155,
        0, -70
      );

      c.bezierCurveTo(
        130, -155,
        210, -22,
        0, 112
      );

      c.fillStyle = '#e64c73';
      c.fill();
      c.strokeStyle = '#ffb0b9';
      c.lineWidth = 5;
      c.stroke();
      c.restore();

      // Moving blood particles
      for (let i = 0; i < 12; i++) {
        const a = (
          i / 12 +
          (running ? t * p.bpm / 60 * 0.16 : 0)
        ) * Math.PI * 2;

        circle(
          c,
          450 + 290 * Math.cos(a),
          221 + 130 * Math.sin(a),
          7,
          i < 6 ? '#ff7184' : '#65b9ff'
        );
      }

      label(
        c,
        'OXYGENATED BLOOD',
        690, 94, 15, '#ff9eab'
      );

      label(
        c,
        'DEOXYGENATED BLOOD',
        197, 94, 15, '#96cdff'
      );

      add('Heart rate', p.bpm + ' bpm');
      add('Stroke volume', p.stroke + ' mL');

      add(
        'Cardiac output',
        round(p.bpm * p.stroke / 1000, 2) + ' L/min'
      );

      add('Beats elapsed', Math.floor(t * p.bpm / 60));
    }

    /* 4. CELL DIVISION */

    else if (s.lab.id === 'bioMitosis') {
      const stages = [
        'PROPHASE',
        'METAPHASE',
        'ANAPHASE',
        'TELOPHASE / CYTOKINESIS'
      ];

      const progress = running
        ? t * p.speed * 0.19
        : t * p.speed * 0.19;

      const stage = Math.floor(progress % 4);
      const fraction = progress % 1;
      const pairs = p.chromosomes;

      ellipse(
        c, 450, 222,
        178, 124,
        '#356ca855',
        '#74dce8'
      );

      if (stage === 3) {
        ellipse(
          c,
          372 - 35 * fraction,
          222, 83, 97,
          '#3ba5a966',
          '#79faea'
        );

        ellipse(
          c,
          528 + 35 * fraction,
          222, 83, 97,
          '#3ba5a966',
          '#79faea'
        );
      }

      for (let i = 0; i < pairs; i++) {
        const y =
          172 + i * (92 / Math.max(1, pairs - 1));

        const spread =
          stage === 0 ? 75
          : stage === 1 ? 9
          : stage === 2 ? 35 + fraction * 100
          : 120;

        const left = 450 - spread;
        const right = 450 + spread;

        line(c, left - 10, y - 10, left + 10, y + 10, '#ffca77', 5);
        line(c, left + 10, y - 10, left - 10, y + 10, '#ffca77', 5);

        if (stage > 1) {
          line(c, right - 9, y - 9, right + 9, y + 9, '#bca0ff', 5);
          line(c, right + 9, y - 9, right - 9, y + 9, '#bca0ff', 5);
        }
      }

      if (stage === 1) {
        line(c, 450, 112, 450, 332, '#fff4aa88', 3);
      }

      label(c, stages[stage], 450, 388, 20, '#98f5e6');

      add('Stage', stages[stage]);
      add('Chromosome pairs (model)', pairs);
      add('Cycle speed', p.speed + '×');
      add('Cycles shown', Math.floor(progress / 4));
    }

    /* 5. DNA REPLICATION */

    else if (s.lab.id === 'bioDNA') {
      const pairs = p.pairs;

      const fork = running
        ? (t * p.speed * 0.14) % 1
        : (t * p.speed * 0.14) % 1;

      for (let i = 0; i < pairs; i++) {
        const x =
          110 + i * (680 / Math.max(1, pairs - 1));

        const a = i * 0.67 + t * 0.7;

        const y1 = 215 + 75 * Math.sin(a);
        const y2 = 215 - 75 * Math.sin(a);

        line(
          c, x, y1, x, y2,
          i % 2 ? '#ffcd76' : '#c694ff',
          5
        );

        circle(c, x, y1, 6, '#6eebff');
        circle(c, x, y2, 6, '#ff93bf');

        if (i > 0) {
          const x0 =
            110 + (i - 1) * 680 / Math.max(1, pairs - 1);

          const a0 = (i - 1) * 0.67 + t * 0.7;

          line(
            c,
            x0, 215 + 75 * Math.sin(a0),
            x, y1,
            '#68eaff', 3
          );

          line(
            c,
            x0, 215 - 75 * Math.sin(a0),
            x, y2,
            '#ff91b4', 3
          );
        }
      }

      line(
        c,
        110 + fork * 680, 83,
        110 + fork * 680, 343,
        '#e9f7aa', 2
      );

      label(
        c,
        'REPLICATION FORK',
        110 + fork * 680,
        76, 13, '#eaffaa'
      );

      label(c, 'A ↔ T', 300, 381, 17, '#a4eaff');
      label(c, 'C ↔ G', 580, 381, 17, '#ffb3d9');

      add('Base pairs displayed', pairs);
      add('Replication speed', p.speed + '×');
      add('Fork progress (visual)', round(fork * 100, 0) + '%');
      add('Replication type', 'Semiconservative');
    }

    /* 6. NEURON IMPULSES */

    else if (s.lab.id === 'bioNeuron') {
      circle(c, 200, 218, 64, '#4178c7', '#7eeefa');
      circle(c, 200, 218, 27, '#c89beb');

      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;

        line(
          c,
          200 + 45 * Math.cos(a),
          218 + 45 * Math.sin(a),
          130 + 90 * Math.cos(a),
          218 + 90 * Math.sin(a),
          '#7ce5ff',
          4
        );
      }

      line(c, 265, 218, 770, 218, '#8ddcff', 18);

      for (let x = 302; x < 760; x += 76) {
        rect(c, x, 197, 48, 42, '#ffca76', 14);
      }

      // Impulses move at the selected speed.
      for (let i = 0; i < p.frequency; i++) {
        const position = (
          t * (p.speed / 25) +
          i * 12 / p.frequency
        ) % 12 / 12;

        if (position > 0) {
          circle(
            c,
            270 + position * 500,
            218, 11,
            '#ffef85',
            '#ffffff'
          );
        }
      }

      for (let i = 0; i < 4; i++) {
        line(
          c, 770, 218,
          810, 155 + i * 40,
          '#87eaff', 4
        );
      }

      label(c, 'DENDRITES', 168, 346, 16, '#9de6ff');
      label(c, 'AXON → SIGNAL', 555, 346, 18, '#8df7dc');

      add('Conduction speed', p.speed + ' m/s');
      add('Signal frequency', p.frequency + ' Hz');
      add('Travel time for 1 m', round(1 / p.speed, 3) + ' s');
      add('Elapsed time', round(t) + ' s');
    }

    /* 7. SEED GERMINATION */

    else if (s.lab.id === 'bioGermination') {
      const optimum = Math.max(
        0,
        1 - Math.abs(p.temperature - 26) / 23
      );

      const rate = p.water / 100 * optimum;

      const growth = limit(
        t * rate * 14,
        0,
        100
      );

      rect(c, 0, 300, 900, 140, '#4b342a');
      line(c, 0, 300, 900, 300, '#a37d51', 5);

      ellipse(
        c, 450, 304,
        28, 19,
        '#a97a46',
        '#d5ac78'
      );

      // Growing root
      line(
        c,
        450, 308,
        450, 308 + growth * 0.7,
        '#e6c593',
        4
      );

      // Growing shoot
      c.strokeStyle = '#72d88e';
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(450, 301);
      c.quadraticCurveTo(
        430, 245,
        450, 300 - growth * 2
      );
      c.stroke();

      if (growth > 10) {
        ellipse(
          c,
          422, 285 - growth * 1.8,
          Math.max(3, growth * 0.55),
          Math.max(2, growth * 0.24),
          '#58c981'
        );

        ellipse(
          c,
          479, 285 - growth * 1.8,
          Math.max(3, growth * 0.55),
          Math.max(2, growth * 0.24),
          '#7be68e'
        );
      }

      // Water droplets
      for (let i = 0; i < 8; i++) {
        const a = running
          ? (t * 0.32 + i / 8) % 1
          : i / 8;

        circle(
          c,
          140 + i * 74,
          65 + a * 210,
          4.5,
          '#6bc7ff'
        );
      }

      label(c, 'GROWTH MODEL', 450, 65, 18, '#a4ffcf');

      add('Growth index', round(growth, 0) + '%');
      add('Water', p.water + '%');
      add('Temperature', p.temperature + ' °C');
      add('Growth suitability', round(rate * 100, 0) + '%');
    }

    /* 8. LUNGS & BREATHING */

    else if (s.lab.id === 'bioBreathing') {
      const phase =
        t * p.rate / 60 * 2 * Math.PI;

      const breath =
        (1 + Math.sin(phase)) / 2;

      const scale =
        0.85 + breath * p.tidal * 0.35;

      // Trachea and bronchi
      line(c, 450, 83, 450, 192, '#b9ecff', 18);
      line(c, 450, 188, 395, 232, '#a3e5ff', 12);
      line(c, 450, 188, 505, 232, '#a3e5ff', 12);

      // Left lung
      c.save();
      c.translate(363, 248);
      c.scale(scale, scale);

      ellipse(
        c, 0, 0,
        83, 117,
        '#f27c97aa',
        '#ffb3c8'
      );

      c.restore();

      // Right lung
      c.save();
      c.translate(537, 248);
      c.scale(scale, scale);

      ellipse(
        c, 0, 0,
        83, 117,
        '#ed6d94aa',
        '#ffb3c8'
      );

      c.restore();

      // Diaphragm
      c.strokeStyle = '#82edda';
      c.lineWidth = 6;
      c.beginPath();
      c.arc(
        450, 338, 168,
        0.2,
        Math.PI - 0.2
      );
      c.stroke();

      // Air particles
      for (let i = 0; i < 5; i++) {
        const v = (
          i / 5 +
          t * p.rate / 60 * 0.5
        ) % 1;

        circle(
          c,
          450,
          82 + 90 * v,
          4,
          '#91fbff'
        );
      }

      label(
        c,
        breath > 0.5 ? 'INHALING' : 'EXHALING',
        450, 413, 20, '#9ef5e4'
      );

      add('Breathing rate', p.rate + ' /min');
      add('Tidal volume', round(p.tidal, 1) + ' L');

      add(
        'Minute ventilation',
        round(p.rate * p.tidal, 1) + ' L/min'
      );

      add('Breaths completed', Math.floor(t * p.rate / 60));
    }

    add('Status', s.status);

    return readings;
  }

  /* ==============================================
     UPDATE SIMULATION AND LIVE RESULTS
     ============================================== */

  function draw(s) {
    if (session !== s) return;

    const canvas = $('plbio-canvas');
    if (!canvas) return;

    const c = canvas.getContext('2d');

    background(c, s.lab.name);

    const readings = drawBiology(c, s);
    const results = $('plbio-metrics');

    if (results) {
      if (results.children.length !== readings.length) {
        results.innerHTML = readings.map(() => `
          <div class="plbio-reading">
            <small></small>
            <strong></strong>
          </div>
        `).join('');
      }

      readings.forEach((reading, i) => {
        results.children[i]
          .querySelector('small').textContent = reading[0];

        results.children[i]
          .querySelector('strong').textContent = reading[1];
      });
    }

    const actions = $('simulationCanvas')
      ?.querySelector('.plbio-actions');

    if (actions) {
      actions.querySelector(
        '[data-do="start"]'
      ).disabled = s.running;

      actions.querySelector(
        '[data-do="pause"]'
      ).disabled = !s.running;
    }
  }

  /* ==============================================
     FIVE MCQs + BIOLOGY TUTOR
     ============================================== */

  function mountQuizAndTutor(s) {
    let panel = $('plbio-learning');

    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'plbio-learning';
      panel.className = 'plbio-learning';

      $('experimentWorkspace').appendChild(panel);
    }

    panel.style.display = 'block';

    panel.innerHTML = `
      <h3>🧠 Biology Challenge — 5 MCQs</h3>

      <p id="plbio-progress"></p>

      <h3 id="plbio-question"></h3>

      <div id="plbio-options"></div>

      <p
        class="plbio-answer"
        id="plbio-feedback"
        aria-live="polite"
      ></p>

      <button
        class="plbio-next"
        type="button"
        id="plbio-next"
        disabled
      >
        Next Question →
      </button>

      <hr
        style="border-color:#2b5270;margin:24px 0"
      >

      <h3>💬 Ask PocketLab Biology Tutor</h3>

      <p>
        Ask about the formula, science behind
        the animation, or what the sliders do.
      </p>

      <div
        class="plbio-chat"
        id="plbio-chat"
        aria-live="polite"
      ></div>

      <form id="plbio-ask" class="plbio-ask">

        <textarea
          id="plbio-query"
          maxlength="400"
          required
          placeholder="Example: Why does a cell shrink in a concentrated solution?"
        ></textarea>

        <p>
          <button
            class="plbio-send"
            type="submit"
          >
            ➤ Send
          </button>
        </p>
      </form>
    `;

    function showQuestion() {
      if (session !== s) return;

      const question = s.lab.quiz[s.question];

      $('plbio-progress').textContent =
        `Question ${s.question + 1} / 5 · Score ${s.score}/5`;

      $('plbio-question').textContent = question[0];
      $('plbio-options').innerHTML = '';

      $('plbio-feedback').textContent =
        'Choose an answer.';

      s.answered = false;

      const originalOptions = [
        question[1],
        question[2],
        question[3],
        question[4]
      ];

      const shift = s.question % 4;

      const options = originalOptions
        .slice(shift)
        .concat(originalOptions.slice(0, shift));

      options.forEach((option, i) => {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'plbio-choice';

        button.textContent =
          `${'ABCD'[i]}. ${option}`;

        button.addEventListener('click', () => {
          if (s.answered || session !== s) return;

          s.answered = true;

          const correct = option === question[1];

          if (correct) s.score++;

          [...$('plbio-options').children]
            .forEach(b => {
              b.disabled = true;

              if (b.textContent.endsWith(question[1])) {
                b.style.background = '#186b57';
              } else if (b === button) {
                b.style.background = '#693346';
              }
            });

          $('plbio-feedback').textContent =
            (correct
              ? '✅ Correct! '
              : '❌ Not quite. ') +
            `Correct answer: ${question[1]}. ${s.lab.fact}`;

          $('plbio-progress').textContent =
            `Question ${s.question + 1} / 5 · Score ${s.score}/5`;

          $('plbio-next').disabled = false;
        });

        $('plbio-options').appendChild(button);
      });

      $('plbio-next').textContent =
        s.question === 4
          ? 'See Score →'
          : 'Next Question →';

      $('plbio-next').disabled = true;
    }

    $('plbio-next').addEventListener('click', () => {
      if (session !== s) return;

      // Retry
      if (s.question >= 5) {
        s.question = 0;
        s.score = 0;
        s.answered = false;
        showQuestion();
        return;
      }

      if (!s.answered) return;

      s.question++;

      if (s.question < 5) {
        showQuestion();
        return;
      }

      $('plbio-progress').textContent =
        'Quiz complete';

      $('plbio-question').textContent =
        `🏆 Final score: ${s.score}/5`;

      $('plbio-options').textContent =
        s.score === 5
          ? 'Excellent! All answers correct.'
          : 'Review the experiment and try again.';

      $('plbio-feedback').textContent = '';

      const button = $('plbio-next');

      button.textContent = '↻ Retry';
      button.disabled = false;
    });

    showQuestion();

    /* STUDENT QUESTION BOX */

    function addMessage(who, body) {
      if (session !== s) return;

      const message = document.createElement('div');

      message.className =
        'plbio-msg' +
        (who === 'You' ? ' user' : '');

      message.textContent = `${who}: ${body}`;

      $('plbio-chat').appendChild(message);

      $('plbio-chat').scrollTop =
        $('plbio-chat').scrollHeight;
    }

    addMessage(
      'PocketLab Tutor',
      `Welcome to ${s.lab.name}! Ask about its formula, variables, or what happens when you adjust a slider.`
    );

    $('plbio-ask').addEventListener(
      'submit',
      async event => {
        event.preventDefault();

        if (session !== s) return;

        const field = $('plbio-query');
        const question = field.value.trim();

        if (!question) return;

        field.value = '';

        addMessage('You', question);

        let answer = '';
        const q = question.toLowerCase();

        // Optional secure AI backend connection.
        if (
          typeof window.POCKETLAB_ASK_URL === 'string' &&
          window.POCKETLAB_ASK_URL
        ) {
          try {
            const response = await fetch(
              window.POCKETLAB_ASK_URL,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  experiment: s.lab.name,
                  question,
                  formula: s.lab.formula
                })
              }
            );

            if (response.ok) {
              const data = await response.json();

              if (typeof data.answer === 'string') {
                answer = data.answer;
              }
            }

          } catch (error) {
            console.warn(
              'Tutor service unavailable',
              error
            );
          }
        }

        // Offline answer fallback
        if (!answer) {
          if (/formula|equation|law|calculate/.test(q)) {
            answer =
              `Formula / principle: ${s.lab.formula}. ${s.lab.fact}`;

          } else if (
            /why|how|what is|explain|principle/.test(q)
          ) {
            answer = s.lab.fact;

          } else if (
            /change|increase|decrease|speed|slow|slider|effect|happen/.test(q)
          ) {
            answer =
              s.lab.change +
              ' Move one slider at a time and observe the live readings.';

          } else if (/result|measure|observe/.test(q)) {
            answer =
              'The readings beside this simulation update from the selected experiment variables. ' +
              s.lab.fact;

          } else {
            answer =
              `For ${s.lab.name}: ${s.lab.fact}\n` +
              `Formula: ${s.lab.formula}\n` +
              'This offline tutor covers experiment-specific topics. Connect a secure AI backend for open-ended questions.';
          }
        }

        addMessage('PocketLab Tutor', answer);
      }
    );
  }

  /* ==============================================
     CONNECT TO EXISTING POCKETLAB
     ============================================== */

  // Capture new Biology card clicks before old handlers.
  document.addEventListener(
    'click',
    event => {
      const button = event.target.closest(
        '.plbio-card [data-experiment]'
      );

      if (!button) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      openBiology(button.dataset.experiment);
    },
    true
  );

  startExperiment = function(key, ...args) {
    if (lookup[key]) {
      return openBiology(key);
    }

    leaveBiology();

    const panel = $('plbio-learning');

    if (panel) {
      panel.style.display = 'none';
    }

    return previousStart.call(this, key, ...args);
  };

  /* RESTORE BIOLOGY CARDS IF OLD SCRIPTS REBUILD GRID */

  function initializeBiology() {
    buildBiologyCards();

    const laboratory = $('laboratory');

    if (!laboratory) return;

    const observer = new MutationObserver(() => {
      const grid = laboratory.querySelector(
        '.experiment-grid'
      );

      if (
        grid &&
        BIO.some(lab =>
          !grid.querySelector(
            `.plbio-card [data-experiment="${lab.id}"]`
          )
        )
      ) {
        buildBiologyCards();
      }
    });

    observer.observe(laboratory, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeBiology
    );
  } else {
    initializeBiology();
  }

  console.log(
    'PocketLab Biology: 8 animated experiments installed.'
  );

})();


/* ============================================================
   POCKETLAB — ONE COMPLETION SYSTEM FOR ALL STEM SUBJECTS
   PASTE ONCE AT THE VERY BOTTOM OF script.js

   Physics + Biology retain their original completion system.
   Chemistry + Mathematics now save to the same progress system.
============================================================ */

(() => {
  "use strict";

  if (window.__pocketlabAllSubjectsProgressV1) return;
  window.__pocketlabAllSubjectsProgressV1 = true;

  const chemistry = {
    ph: "pH Indicator Laboratory",
    periodic: "Periodic Table Explorer",
    bond: "Chemical Bonding",
    rate: "Chemical Reaction Rates",
    matter: "States of Matter",
    separation: "Separation Techniques",
    titration: "Acid-Base Titration",
    electrolysis: "Electrolysis of Water",
    gas: "Gas Laws Simulator",
    solubility: "Solubility Simulator",
    chromatography: "Paper Chromatography",
    reactions: "Chemical Reactions"
  };

  const mathematics = {
    graph: "Graph Explorer",
    quadratic: "Quadratic Equations",
    geometry: "Interactive Geometry",
    trig: "Trigonometry Simulator",
    pythagoras: "Pythagoras Theorem",
    probability: "Probability Laboratory",
    statistics: "Statistics Visualizer",
    transform: "Geometric Transformations",
    calculus: "Calculus — Derivatives",
    fractions: "Fractions Visualizer"
  };

  // Register lab IDs with PocketLab's existing progress system.
  for (const [id, title] of Object.entries({
    ...chemistry,
    ...mathematics
  })) {
    if (!EXPERIMENTS[id]) {
      EXPERIMENTS[id] = {
        title,
        description: "Interactive STEM experiment",
        explanation: ""
      };
    }
  }

  // Recover any already-completed experiments.
  let imported = false;

  try {
    const raw = JSON.parse(
      localStorage.getItem("pocketlab-progress-v1") || "{}"
    );

    for (
      const id of Array.isArray(raw.completed)
        ? raw.completed
        : []
    ) {
      if (
        EXPERIMENTS[id] &&
        !progress.completed.includes(id)
      ) {
        progress.completed.push(id);
        imported = true;
      }
    }

    // Import old Chemistry and Mathematics completions.
    for (const [prefix, labs, finished] of [
      ["pocketlab-chem4-", chemistry, "completed"],
      ["pocketlab-maths-", mathematics, "complete"]
    ]) {
      for (const id of Object.keys(labs)) {
        if (
          localStorage.getItem(prefix + id) === finished &&
          !progress.completed.includes(id)
        ) {
          progress.completed.push(id);
          progress.points += 50;
          imported = true;
        }
      }
    }
  } catch (error) {
    console.warn(
      "PocketLab: progress import skipped",
      error
    );
  }

  if (imported) saveProgress();

  // Unlock Young Scientist after any 4 completed labs.
  const previousBadges = badges;

  badges = function () {
    const result = previousBadges();

    result.scientist =
      progress.completed.length >= 4;

    return result;
  };

  updateDashboard();

  const escapeHTML = value =>
    String(value).replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );

  const subjectNames = {
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
    mathematics: "Mathematics"
  };

  const subjectIcons = {
    physics: "⚡",
    chemistry: "🧪",
    biology: "🧬",
    mathematics: "📐"
  };

  /* =====================================
     PREMIUM LEARNING PROGRESS DESIGN
  ===================================== */

  const style = document.createElement("style");

  style.textContent = `
    .plup-wrap {
      margin: 26px 0 34px;
      padding: 24px;
      border: 1px solid rgba(123,166,246,.28);
      border-radius: 21px;
      background: linear-gradient(
        135deg,#182444,#0e1b32 80%
      );
      box-shadow: 0 18px 38px rgba(0,0,0,.14);
    }

    .plup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }

    .plup-header h2 {
      color: #f5f8ff;
      font-size: 22px;
      letter-spacing: -.4px;
      margin: 0;
    }

    .plup-header p {
      color: #9fb9d5;
      font-size: 12px;
      margin: 4px 0 0;
    }

    .plup-achievements {
      padding: 10px 15px;
      border-radius: 10px;
      color: #e9e8ff;
      background: rgba(131,110,252,.18);
      border: 1px solid rgba(162,143,255,.4);
      cursor: pointer;
    }

    .plup-achievements:hover {
      background: rgba(131,110,252,.30);
    }

    .plup-grid {
      display: grid;
      grid-template-columns:
        repeat(4,minmax(0,1fr));
      gap: 12px;
    }

    .plup-card {
      padding: 15px;
      background: rgba(12,29,52,.86);
      border: 1px solid rgba(127,166,222,.22);
      border-radius: 15px;
    }

    .plup-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      color: #f1f7ff;
      font-size: 13px;
      font-weight: 750;
    }

    .plup-number {
      color: #8feaff;
      font-size: 18px;
      font-variant-numeric: tabular-nums;
    }

    .plup-track {
      height: 7px;
      background: #27364f;
      border-radius: 99px;
      overflow: hidden;
      margin-top: 13px;
    }

    .plup-fill {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(
        90deg,#8d7cff,#63d9f3
      );
    }

    .plup-recent {
      margin-top: 19px;
      padding-top: 15px;
      border-top:
        1px solid rgba(138,167,222,.18);
    }

    .plup-recent h3 {
      margin: 0 0 10px;
      color: #dae6f6;
      font-size: 14px;
    }

    .plup-items {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .plup-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 11px;
      border-radius: 9px;
      background: #1b3046;
      border: 1px solid rgba(109,177,213,.22);
      color: #cce7f5;
      font-size: 12px;
    }

    .plup-empty {
      color: #91aac7;
      font-size: 12px;
      margin: 0;
    }

    @media(max-width:960px) {
      .plup-grid {
        grid-template-columns:
          repeat(2,minmax(0,1fr));
      }
    }

    @media(max-width:480px) {
      .plup-wrap {
        padding: 16px;
      }

      .plup-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);

  /* =====================================
     FIND EXPERIMENTS BY SUBJECT
  ===================================== */

  function catalog() {
    const groups = {
      physics: new Map(),
      chemistry: new Map(),
      biology: new Map(),
      mathematics: new Map()
    };

    for (const [id, title] of Object.entries(chemistry)) {
      groups.chemistry.set(id, title);
    }

    for (const [id, title] of Object.entries(mathematics)) {
      groups.mathematics.set(id, title);
    }

    document.querySelectorAll(
      "#laboratory .experiment-card"
    ).forEach(card => {
      const subject = card.dataset.category;

      if (!groups[subject]) return;

      const launch = card.querySelector(
        "[data-experiment], [data-chem4], [data-pmath]"
      );

      const id =
        launch?.dataset.experiment ||
        launch?.dataset.chem4 ||
        launch?.dataset.pmath;

      if (!id) return;

      const title =
        card.querySelector("h3")?.textContent.trim() ||
        EXPERIMENTS[id]?.title ||
        id;

      groups[subject].set(id, title);
    });

    return groups;
  }

  /* =====================================
     SHOW PROGRESS ON DASHBOARD
  ===================================== */

  function renderProgress() {
    const dashboard =
      document.getElementById("dashboard");

    const stats =
      dashboard?.querySelector(".stats-grid");

    if (!stats) return;

    let panel =
      document.getElementById("plUnifiedProgress");

    if (!panel) {
      panel = document.createElement("section");

      panel.id = "plUnifiedProgress";
      panel.className = "plup-wrap";

      stats.insertAdjacentElement(
        "afterend",
        panel
      );

      panel.addEventListener("click", event => {
        if (
          event.target.closest(".plup-achievements")
        ) {
          navigate("achievements");
        }
      });
    }

    const groups = catalog();

    const cards = Object.keys(groups)
      .map(subject => {
        const group = groups[subject];

        const completed = [...group.keys()]
          .filter(id =>
            progress.completed.includes(id)
          ).length;

        const total = Math.max(
          group.size,
          completed
        );

        const percentage = total
          ? Math.round(completed / total * 100)
          : 0;

        return `
          <div class="plup-card">
            <div class="plup-card-head">
              <span>
                ${subjectIcons[subject]}
                ${subjectNames[subject]}
              </span>

              <strong class="plup-number">
                ${completed}/${total}
              </strong>
            </div>

            <div class="plup-track">
              <div
                class="plup-fill"
                style="width:${percentage}%">
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    const titles = new Map(
      Object.values(groups)
        .flatMap(group => [...group])
    );

    const recent = progress.completed
      .slice(-6)
      .reverse()
      .map(id => {
        const name =
          titles.get(id) ||
          EXPERIMENTS[id]?.title ||
          id;

        return `
          <span class="plup-item">
            ✓ ${escapeHTML(name)}
          </span>
        `;
      })
      .join("");

    panel.innerHTML = `
      <div class="plup-header">
        <div>
          <h2>🏆 Your STEM Learning Progress</h2>
          <p>
            ${progress.completed.length}
            experiments completed ·
            ${progress.points} knowledge points
          </p>
        </div>

        <button
          class="plup-achievements"
          type="button">
          View Achievements →
        </button>
      </div>

      <div class="plup-grid">
        ${cards}
      </div>

      <div class="plup-recent">
        <h3>✓ Recently completed experiments</h3>

        <div class="plup-items">
          ${
            recent ||
            '<p class="plup-empty">Complete an experiment to see it here.</p>'
          }
        </div>
      </div>
    `;
  }

  /* =====================================
     FIND CURRENT CHEMISTRY / MATHS LAB
  ===================================== */

  function currentId(subject) {
    const title = document.getElementById(
      subject === "chemistry"
        ? "chem4-title"
        : "pmathTitle"
    )?.textContent.trim();

    const labs =
      subject === "chemistry"
        ? chemistry
        : mathematics;

    return Object.keys(labs)
      .find(id => labs[id] === title) || null;
  }

  function updateCompletionButton() {
    for (const [subject, selector] of [
      ["chemistry", "#chem4-complete"],
      ["mathematics", "#pmathComplete"]
    ]) {
      const button =
        document.querySelector(selector);

      const id = button && currentId(subject);

      if (button && id) {
        button.textContent =
          progress.completed.includes(id)
            ? "Experiment Completed ✓"
            : "Complete Experiment ✓";
      }
    }
  }

  /* =====================================
     UNIFIED COMPLETION BUTTON HANDLER
  ===================================== */

  document.addEventListener(
    "click",
    event => {
      const button = event.target.closest(
        "#chem4-complete, #pmathComplete, #completeExperiment"
      );

      if (!button) {
        if (
          event.target.closest(
            "[data-chem4], [data-pmath]"
          )
        ) {
          setTimeout(
            updateCompletionButton,
            80
          );
        }

        return;
      }

      const workspace =
        document.getElementById(
          "experimentWorkspace"
        );

      if (
        !workspace?.classList.contains("active")
      ) return;

      if (
        button.id === "chem4-complete" ||
        button.id === "pmathComplete"
      ) {
        const subject =
          button.id === "chem4-complete"
            ? "chemistry"
            : "mathematics";

        const id = currentId(subject);

        if (!id) {
          console.warn(
            "Cannot identify current experiment:",
            subject
          );
          return;
        }

        if (!progress.completed.includes(id)) {
          progress.completed.push(id);

          // Same reward as Physics.
          progress.points += 50;

          saveProgress();

          showToast(
            "🏆 Experiment completed! +50 knowledge points"
          );

        } else {
          showToast(
            "Already completed! Your points are saved."
          );
        }
      }

      // Existing Physics and Biology handlers
      // continue managing their own completion.
      setTimeout(renderProgress, 0);
    },
    true
  );

  /* =====================================
     INITIALIZE DASHBOARD
  ===================================== */

  function initializeProgress() {
    renderProgress();

    setTimeout(
      renderProgress,
      500
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeProgress
    );
  } else {
    initializeProgress();
  }

  console.info(
    "PocketLab unified progress enabled for all STEM subjects."
  );

})();

/* ==========================================================
   POCKETLAB — FIX EXPERIMENT COUNTING
   ALL 4 SUBJECTS · KEEP OLD PROGRESS
   PASTE AT THE VERY BOTTOM OF script.js
========================================================== */

(() => {
  "use strict";

  if (window.__PL_PROGRESS_REPAIR_2026__) return;
  window.__PL_PROGRESS_REPAIR_2026__ = true;

  const titles = {
    // PHYSICS
    circuit: "Electric Circuit Simulator",
    advancedCircuit: "Advanced Circuit Analysis",
    motion: "Car Motion & Braking",
    projectile: "Projectile Motion Simulator",
    reflection: "Light Reflection",
    floating: "Floating or Sinking",
    kirchhoff: "Kirchhoff's Laws",
    thevenin: "Thevenin's Theorem",
    capacitor: "Capacitor Charging",
    rl: "RL Circuit",
    rc: "RC Discharging",
    ac: "AC Circuit",
    induction: "Electromagnetic Induction",
    photoelectric: "Photoelectric Effect",
    thermal: "Thermal Expansion",
    pendulum: "Simple Pendulum",
    spring: "Spring & Hooke's Law",
    waves: "Wave & Sound",
    newtonCradle: "Newton's Cradle",
    lens: "Lens & Refraction",
    ramp: "Ramp & Friction",
    collision: "Colliding Carts",
    orbit: "Planetary Orbit",
    refraction: "Light Refraction",
    pulley: "Pulley & Lifting Load",
    fieldlines: "Animated Magnetic Field",
    electromagnet: "Electromagnet & Coil",
    compass: "Magnet & Compass",
    motor: "Electric Motor",

    // BIOLOGY
    plant: "Plant Growth Simulator",
    bioPhotosynthesis: "Photosynthesis Studio",
    bioOsmosis: "Osmosis & Cell Membrane",
    bioHeart: "Heartbeat & Circulation",
    bioMitosis: "Cell Division (Mitosis)",
    bioDNA: "DNA Replication Lab",
    bioNeuron: "Neuron & Nerve Impulse",
    bioGermination: "Seed Germination & Growth",
    bioBreathing: "Lungs & Breathing",

    // CHEMISTRY
    ph: "pH Indicator Laboratory",
    periodic: "Periodic Table Explorer",
    bond: "Chemical Bonding",
    rate: "Chemical Reaction Rates",
    matter: "States of Matter",
    separation: "Separation Techniques",
    titration: "Acid-Base Titration",
    electrolysis: "Electrolysis of Water",
    gas: "Gas Laws Simulator",
    solubility: "Solubility Simulator",
    chromatography: "Paper Chromatography",
    reactions: "Chemical Reactions",

    // MATHEMATICS
    graph: "Graph Explorer",
    quadratic: "Quadratic Equations",
    geometry: "Interactive Geometry",
    trig: "Trigonometry Simulator",
    pythagoras: "Pythagoras Theorem",
    probability: "Probability Laboratory",
    statistics: "Statistics Visualizer",
    transform: "Geometric Transformations",
    calculus: "Calculus — Derivatives",
    fractions: "Fractions Visualizer"
  };

  const chemIds = new Set(
    "ph periodic bond rate matter separation titration electrolysis gas solubility chromatography reactions".split(" ")
  );

  const mathIds = new Set(
    "graph quadratic geometry trig pythagoras probability statistics transform calculus fractions".split(" ")
  );

  const bioIds = new Set(
    "plant bioPhotosynthesis bioOsmosis bioHeart bioMitosis bioDNA bioNeuron bioGermination bioBreathing".split(" ")
  );

  const names = new Map(
    Object.entries(titles).map(
      ([id, title]) => [title.toLowerCase(), id]
    )
  );

  const aliases = {
    "Force and Motion": "motion",
    "Force and Motion Simulator": "motion",
    "Ohm's Law": "circuit",
    "Floating or Sinking?": "floating",
    "Light Reflection Simulator": "reflection",
    "Projectile Motion": "projectile",
    "RC Circuit": "rc",
    "Series & Parallel Circuits": "advancedCircuit"
  };

  Object.entries(aliases).forEach(
    ([name, id]) => names.set(name.toLowerCase(), id)
  );

  const STORAGE = "pocketlab-progress-v1";

  function readJSON(key, fallback) {
    try {
      return JSON.parse(
        localStorage.getItem(key) || "null"
      ) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function valid(id) {
    return typeof id === "string" &&
      /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(id);
  }

  function register(id) {
    if (!valid(id)) return;

    if (!EXPERIMENTS[id]) {
      EXPERIMENTS[id] = {
        title: titles[id] || id,
        description: "Interactive STEM laboratory",
        explanation: ""
      };
    }
  }

  function subject(id) {
    if (chemIds.has(id)) return "chemistry";
    if (mathIds.has(id)) return "mathematics";
    if (bioIds.has(id)) return "biology";
    return "physics";
  }

  function idFromName(name) {
    return names.get(
      String(name || "").trim().toLowerCase()
    );
  }

  /* RESTORE OLD COMPLETED EXPERIMENTS */

  function reconcile() {
    const saved = readJSON(STORAGE, {});

    const stored = Array.isArray(saved.completed)
      ? saved.completed.filter(valid)
      : [];

    const original = new Set(stored);

    const all = new Set([
      ...stored,
      ...progress.completed.filter(valid)
    ]);

    let extraPoints = 0;

    function importOld(id) {
      if (
        !valid(id) ||
        !titles[id] ||
        all.has(id)
      ) return;

      all.add(id);

      if (!original.has(id)) {
        extraPoints += 50;
      }
    }

    // Older Physics experiments
    const physicsOld = readJSON(
      "pocketlab-physics-completed", []
    );

    if (Array.isArray(physicsOld)) {
      physicsOld.forEach(importOld);
    }

    // Older Chemistry experiments
    for (const id of chemIds) {
      if (
        localStorage.getItem(
          "pocketlab-chem4-" + id
        ) === "completed"
      ) {
        importOld(id);
      }
    }

    // Older Mathematics experiments
    for (const id of mathIds) {
      if (
        localStorage.getItem(
          "pocketlab-maths-" + id
        ) === "complete"
      ) {
        importOld(id);
      }
    }

    all.forEach(register);

    const completed = [...all];

    const points = Math.max(
      Number(saved.points) || 0,
      Number(progress.points) || 0
    ) + extraPoints;

    const changed =
      completed.length !== progress.completed.length ||
      completed.length !== stored.length ||
      points !== progress.points;

    progress.completed = completed;
    progress.points = points;

    if (changed) {
      saveProgress();
    } else {
      updateDashboard();
    }
  }

  /* FIND WHICH EXPERIMENT IS BEING COMPLETED */

  function getExperimentId(button) {
    if (button.id === "chem4-complete") {
      return idFromName(
        document.getElementById(
          "chem4-title"
        )?.textContent
      );
    }

    if (button.id === "pmathComplete") {
      return idFromName(
        document.getElementById(
          "pmathTitle"
        )?.textContent
      );
    }

    const title = document.getElementById(
      "activeExperimentTitle"
    )?.textContent;

    return idFromName(title) ||
      (
        typeof currentExperiment === "string"
          ? currentExperiment
          : null
      );
  }

  /* KEEP DASHBOARD AND PROGRESS PANEL IN SYNC */

  function refreshPanel() {
    updateDashboard();

    const panel = document.getElementById(
      "plUnifiedProgress"
    );

    if (!panel) return;

    const completed = [
      ...new Set(progress.completed)
    ];

    const heading = panel.querySelector(
      ".plup-header p"
    );

    if (heading) {
      heading.textContent =
        completed.length +
        " experiments completed · " +
        progress.points +
        " knowledge points";
    }

    const cards = panel.querySelectorAll(
      ".plup-card"
    );

    const order = [
      "physics",
      "chemistry",
      "biology",
      "mathematics"
    ];

    cards.forEach((card, i) => {
      if (!order[i]) return;

      const number = card.querySelector(
        ".plup-number"
      );

      const previousTotal = Number(
        number?.textContent.split("/")[1]
      ) || 0;

      const count = completed.filter(
        id => subject(id) === order[i]
      ).length;

      const total = Math.max(
        previousTotal, count
      );

      if (number) {
        number.textContent =
          count + "/" + total;
      }

      const bar = card.querySelector(
        ".plup-fill"
      );

      if (bar) {
        bar.style.width = total
          ? Math.min(
              100,
              count / total * 100
            ) + "%"
          : "0%";
      }
    });

    const list = panel.querySelector(
      ".plup-items"
    );

    if (list) {
      list.replaceChildren();

      if (!completed.length) {
        const p = document.createElement("p");

        p.className = "plup-empty";

        p.textContent =
          "Complete an experiment to see it here.";

        list.append(p);
      } else {
        completed.slice(-6).reverse()
          .forEach(id => {
            const chip = document.createElement(
              "span"
            );

            chip.className = "plup-item";

            chip.textContent =
              "✓ " +
              (
                titles[id] ||
                EXPERIMENTS[id]?.title ||
                id
              );

            list.append(chip);
          });
      }
    }
  }

  /* HANDLE COMPLETIONS FROM ALL SUBJECTS */

  window.addEventListener(
    "click",
    event => {
      const button = event.target.closest?.(
        "#completeExperiment, #chem4-complete, #pmathComplete"
      );

      if (!button) return;

      const workspace = document.getElementById(
        "experimentWorkspace"
      );

      if (
        !workspace?.classList.contains("active")
      ) return;

      const id = getExperimentId(button);

      if (!id || !valid(id)) return;

      // Let the original experiment handler finish first.
      setTimeout(() => {
        reconcile();

        if (!progress.completed.includes(id)) {
          register(id);

          progress.completed.push(id);
          progress.points += 50;

          saveProgress();

          if (typeof showToast === "function") {
            showToast(
              "🏆 Experiment completed! +50 knowledge points"
            );
          }
        }

        button.textContent =
          "Experiment Completed ✓";

        refreshPanel();
      }, 80);
    },
    true
  );

  /* INITIALIZE */

  function initialize() {
    reconcile();
    refreshPanel();

    setTimeout(
      refreshPanel,
      600
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }

  document.addEventListener(
    "click",
    event => {
      if (
        event.target.closest?.(
          '[data-page="dashboard"], [data-go="dashboard"], .back-btn'
        )
      ) {
        setTimeout(
          refreshPanel,
          120
        );
      }
    }
  );

  console.info(
    "PocketLab experiment counting repair loaded."
  );

})();
