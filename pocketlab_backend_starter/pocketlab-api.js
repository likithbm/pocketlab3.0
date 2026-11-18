
/* =====================================================
   POCKETLAB — STUDENT + TEACHER DASHBOARD
   COMPLETE pocketlab-api.js REPLACEMENT

   Student: PocketLab + Logout
   Teacher: All students, achievements, experiments,
            learning progress and quiz scores

   Requires latest PocketLab Express/SQLite backend.
   ===================================================== */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const TOKEN_KEY = "pocketlab_api_token";
  const QUIZ_KEY = "pocketlab_quiz_arena_v1";
  const QUIZ_OWNERS = "pocketlab_quiz_owners_v1";
  const LAB_OWNERS = "pocketlab_progress_owners_v1";

  let account = null;
  let selectedRole = "student";
  let syncing = false;
  let currentExperiment = null;

  const token = () =>
    localStorage.getItem(TOKEN_KEY) || "";

  function saveToken(value) {
    if (value) localStorage.setItem(TOKEN_KEY, value);
    else localStorage.removeItem(TOKEN_KEY);
  }

  function loadOwners(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  }

  function saveOwners(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async function api(endpoint, method = "GET", data = null) {
    const headers = {};

    if (data !== null) {
      headers["Content-Type"] = "application/json";
    }

    if (token()) {
      headers.Authorization = "Bearer " + token();
    }

    const response = await fetch("/api" + endpoint, {
      method,
      headers,
      body: data === null ? undefined : JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.error || "Server error " + response.status
      );
    }

    return result;
  }

  function create(tag, className = "", content = null) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== null) el.textContent = String(content);
    return el;
  }

  function slug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 65);
  }

  /* ===============================
     DESIGN
  =============================== */

  function addStyles() {
    if ($("pocketRoleCSS")) return;

    const style = create("style");
    style.id = "pocketRoleCSS";

    style.textContent = `
      body.pocket-locked,
      body.pocket-teacher {
        overflow:hidden!important;
      }

      body.pocket-locked > :not(#pocketLogin) {
        visibility:hidden!important;
      }

      body.pocket-teacher > :not(#pocketTeacher) {
        visibility:hidden!important;
      }

      #pocketLogin,#pocketTeacher,#pocketAccount {
        box-sizing:border-box;
        font-family:Arial,system-ui,sans-serif;
        color:#f3f8ff;
      }

      #pocketLogin *,#pocketTeacher *,
      #pocketAccount * {
        box-sizing:border-box;
      }

      #pocketLogin[hidden],#pocketTeacher[hidden],
      #pocketAccount[hidden] {
        display:none!important;
      }

      #pocketLogin {
        position:fixed;
        inset:0;
        z-index:2147483646;
        display:grid;
        place-items:center;
        overflow:auto;
        padding:20px;
        background:
          radial-gradient(ellipse at 80% 20%,
            #164568,transparent 48%),
          radial-gradient(ellipse at 0% 90%,
            #26215c,transparent 48%),
          #080f20;
      }

      .pocket-login-card {
        width:min(100%,470px);
        background:linear-gradient(145deg,#17314e,#101b33);
        border:1px solid #377ba2;
        border-radius:22px;
        padding:30px;
        box-shadow:0 20px 70px #0008;
      }

      .pocket-logo {
        display:grid;
        place-items:center;
        width:65px;
        height:65px;
        margin:auto;
        border-radius:18px;
        font-size:35px;
        background:linear-gradient(120deg,#7460ed,#25aee5);
      }

      .pocket-login-card h1 {
        text-align:center;
        margin:17px 0 8px;
        font-size:30px;
      }

      .pocket-muted {
        color:#a9c4d8;
        font-size:13px;
        line-height:1.6;
      }

      .pocket-tabs {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:6px;
        margin:23px 0;
        padding:5px;
        background:#0b233c;
        border:1px solid #326180;
        border-radius:12px;
      }

      .pocket-tabs button {
        border:0;
        padding:13px;
        border-radius:9px;
        background:transparent;
        color:#bbd6e6;
        font-weight:800;
        cursor:pointer;
      }

      .pocket-tabs button.active {
        color:white;
        background:linear-gradient(100deg,#198de6,#5c54e7);
      }

      .pocket-label {
        display:block;
        margin:16px 0 8px;
        font-size:13px;
        font-weight:800;
      }

      .pocket-input {
        display:block;
        width:100%;
        padding:14px;
        background:#0c2540;
        border:1px solid #4882a5;
        border-radius:9px;
        color:white;
        font-size:14px;
      }

      .pocket-btn {
        border:1px solid #60b5f2;
        border-radius:9px;
        padding:12px 17px;
        background:linear-gradient(90deg,#168fe9,#5063df);
        color:white;
        font-size:13px;
        font-weight:800;
        cursor:pointer;
      }

      .pocket-btn.secondary {
        background:#1c4c6f;
      }

      .pocket-btn:disabled {
        opacity:.5;
        cursor:wait;
      }

      .pocket-actions {
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-top:20px;
      }

      .pocket-actions .pocket-btn {
        flex:1;
      }

      #pocketMessage {
        min-height:25px;
        margin-top:17px;
        color:#7cead0;
        text-align:center;
        font-size:12px;
      }

      #pocketAccount {
        position:fixed;
        top:110px;
        right:18px;
        z-index:9998;
        display:flex;
        gap:12px;
        align-items:center;
        padding:10px 13px;
        background:#102c48f5;
        border:1px solid #4084a8;
        border-radius:11px;
        font-size:13px;
      }

      #pocketTeacher {
        position:fixed;
        inset:0;
        z-index:2147483646;
        background:#081121;
        overflow:auto;
        padding:25px;
      }

      .pocket-teacher-inner {
        max-width:1200px;
        margin:auto;
      }

      .pocket-top {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:15px;
        flex-wrap:wrap;
      }

      .pocket-hero {
        padding:25px;
        margin:25px 0;
        border:1px solid #39769b;
        border-radius:17px;
        background:linear-gradient(110deg,#27265c,#103a58);
      }

      .pocket-stats {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:13px;
        margin:20px 0;
      }

      .pocket-stat {
        padding:20px;
        border:1px solid #366a8a;
        border-radius:13px;
        background:#132d49;
      }

      .pocket-stat small {
        display:block;
        color:#b5cede;
      }

      .pocket-stat strong {
        display:block;
        font-size:28px;
        color:#61e7f0;
        margin-top:10px;
      }

      .pocket-table-wrap {
        overflow:auto;
        border:1px solid #366582;
        border-radius:13px;
        margin-top:15px;
      }

      .pocket-table {
        border-collapse:collapse;
        width:100%;
        min-width:680px;
      }

      .pocket-table th,
      .pocket-table td {
        padding:15px;
        border-bottom:1px solid #294b66;
        text-align:left;
        font-size:13px;
      }

      .pocket-table th {
        color:#d9eff9;
        background:#1a3b59;
      }

      .pocket-table td {
        background:#112b45;
      }

      .pocket-report {
        margin-top:25px;
        padding:22px;
        border:1px solid #356e90;
        border-radius:15px;
        background:#102841;
      }

      .pocket-grid {
        display:grid;
        grid-template-columns:repeat(
          auto-fit,minmax(210px,1fr)
        );
        gap:11px;
        margin:14px 0;
      }

      .pocket-item {
        padding:13px;
        background:#16344f;
        border:1px solid #3a6d8d;
        border-radius:10px;
        font-size:13px;
        line-height:1.7;
      }

      .pocket-item small {
        display:block;
        color:#b6cbdd;
      }

      .pocket-progress {
        height:11px;
        background:#273d58;
        overflow:hidden;
        border-radius:99px;
        margin-top:10px;
      }

      .pocket-progress span {
        display:block;
        height:100%;
        background:linear-gradient(90deg,#22c9bd,#4497ee);
        border-radius:99px;
      }

      .pocket-subject {
        margin-top:20px;
        padding:14px;
        border:1px solid #315f80;
        border-radius:12px;
      }

      @media(max-width:650px) {
        .pocket-login-card {padding:22px}
        .pocket-stats {grid-template-columns:1fr}
        .pocket-actions {flex-direction:column}

        #pocketAccount {
          top:auto;
          bottom:12px;
          right:12px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ===============================
     LOGIN PAGE
  =============================== */

  function buildUI() {
    addStyles();

    const login = create("section");
    login.id = "pocketLogin";

    login.innerHTML = `
      <div class="pocket-login-card">
        <div class="pocket-logo">🔬</div>

        <h1>Welcome to PocketLab</h1>

        <p class="pocket-muted" style="text-align:center">
          SCIENCE BEYOND CLASSROOMS
          <br>
          Choose Student or Teacher to continue.
        </p>

        <div class="pocket-tabs">
          <button id="pocketStudentTab"
            type="button" class="active">
            🎓 Student
          </button>

          <button id="pocketTeacherTab"
            type="button">
            👩‍🏫 Teacher
          </button>
        </div>

        <form id="pocketForm">
          <label class="pocket-label"
            for="pocketUsername">
            Username
          </label>

          <input class="pocket-input"
            id="pocketUsername"
            autocomplete="username"
            minlength="3"
            maxlength="30"
            pattern="[A-Za-z0-9_]{3,30}"
            placeholder="Enter username"
            required>

          <label class="pocket-label"
            for="pocketPassword">
            Password
          </label>

          <input class="pocket-input"
            id="pocketPassword"
            type="password"
            autocomplete="current-password"
            minlength="8"
            maxlength="128"
            placeholder="Minimum 8 characters"
            required>

          <div class="pocket-actions">
            <button class="pocket-btn"
              type="submit" value="login">
              🔐 Login
            </button>

            <button class="pocket-btn secondary"
              type="submit" value="register">
              Create Account
            </button>
          </div>
        </form>

        <p id="pocketMessage">
          Connecting to SQLite...
        </p>

        <p class="pocket-muted"
          style="text-align:center;font-size:11px">
          Offline-ready · Node.js + Express + SQLite
        </p>
      </div>
    `;

    document.body.appendChild(login);

    // Student account bar: NO My Progress button.
    const dock = create("div");
    dock.id = "pocketAccount";
    dock.hidden = true;

    dock.innerHTML = `
      <strong id="pocketAccountName"></strong>
      <button class="pocket-btn secondary"
        id="pocketLogout" type="button">
        Logout
      </button>
    `;

    document.body.appendChild(dock);

    const teacher = create("section");
    teacher.id = "pocketTeacher";
    teacher.hidden = true;

    teacher.innerHTML = `
      <div class="pocket-teacher-inner">

        <div class="pocket-top">
          <div>
            <p style="color:#55e6ef;font-size:12px">
              POCKETLAB · TEACHER PORTAL
            </p>
            <h1>👩‍🏫 Teacher Dashboard</h1>
            <p class="pocket-muted"
              id="pocketTeacherName"></p>
          </div>

          <div class="pocket-actions">
            <button class="pocket-btn"
              id="pocketRefresh" type="button">
              ↻ Refresh
            </button>

            <button class="pocket-btn secondary"
              id="pocketTeacherLogout" type="button">
              Logout
            </button>
          </div>
        </div>

        <div class="pocket-hero">
          <h2>Student Learning Overview</h2>
          <p class="pocket-muted">
            Monitor registered students, achievements,
            experiments, and individual learning progress.
          </p>
        </div>

        <div class="pocket-stats">
          <div class="pocket-stat">
            <small>Registered Students</small>
            <strong id="pocketTotalStudents">0</strong>
          </div>

          <div class="pocket-stat">
            <small>Experiments Completed</small>
            <strong id="pocketTotalLabs">0</strong>
          </div>

          <div class="pocket-stat">
            <small>Achievements Earned</small>
            <strong id="pocketTotalBadges">0</strong>
          </div>
        </div>

        <h2>📚 All Students</h2>

        <p class="pocket-muted"
          id="pocketTeacherStatus">
          Loading database...
        </p>

        <div class="pocket-table-wrap">
          <table class="pocket-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Achievements</th>
                <th>Completed Labs</th>
                <th>Best Quiz Score</th>
                <th>Student Progress</th>
              </tr>
            </thead>

            <tbody id="pocketStudentsBody"></tbody>
          </table>
        </div>

        <div class="pocket-report">
          <h2>🔬 Detailed Student Progress</h2>

          <div id="pocketStudentDetails"
            class="pocket-muted">
            Click View Progress beside a student.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(teacher);

    $("pocketStudentTab").onclick = () =>
      selectRole("student");

    $("pocketTeacherTab").onclick = () =>
      selectRole("teacher");

    $("pocketForm").onsubmit = submitLogin;
    $("pocketLogout").onclick = logout;
    $("pocketTeacherLogout").onclick = logout;
    $("pocketRefresh").onclick = teacherDashboard;
  }

  function selectRole(role) {
    selectedRole = role;

    $("pocketStudentTab").classList.toggle(
      "active", role === "student"
    );

    $("pocketTeacherTab").classList.toggle(
      "active", role === "teacher"
    );

    showMessage(
      role === "teacher"
        ? "Teacher login — Student reports and achievements."
        : "Student login — STEM experiments and quizzes."
    );
  }

  function showMessage(text, error = false) {
    const el = $("pocketMessage");
    el.textContent = text;
    el.style.color = error ? "#ff9ba8" : "#7cead0";
  }

  function lockWebsite() {
    document.body.classList.remove("pocket-teacher");
    document.body.classList.add("pocket-locked");

    $("pocketLogin").hidden = false;
    $("pocketTeacher").hidden = true;
    $("pocketAccount").hidden = true;
  }

  function openAccount() {
    $("pocketLogin").hidden = true;

    document.body.classList.remove(
      "pocket-locked", "pocket-teacher"
    );

    if (account.role === "teacher") {
      document.body.classList.add("pocket-teacher");

      $("pocketTeacher").hidden = false;
      $("pocketAccount").hidden = true;

      teacherDashboard();
    } else {
      $("pocketTeacher").hidden = true;
      $("pocketAccount").hidden = false;

      $("pocketAccountName").textContent =
        "🎓 " + account.username;

      publishCatalog().catch(console.warn);
      syncStudent().catch(console.warn);
    }
  }

  /* ===============================
     AUTHENTICATION
  =============================== */

  function markOldQuizHistory() {
    const owners = loadOwners(QUIZ_OWNERS);

    try {
      const history = JSON.parse(
        localStorage.getItem(QUIZ_KEY) || "[]"
      );

      for (const q of history) {
        if (!q?.date || !q?.subject) continue;

        const id = [
          q.date, q.subject, q.difficulty,
          q.correct, q.points
        ].join("|").slice(0, 120);

        if (!owners[id]) owners[id] = "legacy";
      }

      saveOwners(QUIZ_OWNERS, owners);
    } catch {}
  }

  async function submitLogin(event) {
    event.preventDefault();

    const action = event.submitter?.value === "register"
      ? "register"
      : "login";

    const buttons = $("pocketForm")
      .querySelectorAll('button[type="submit"]');

    buttons.forEach(b => b.disabled = true);

    showMessage(
      action === "register"
        ? "Creating account..."
        : "Logging in..."
    );

    try {
      const result = await api("/" + action, "POST", {
        username: $("pocketUsername").value.trim(),
        password: $("pocketPassword").value,
        role: selectedRole
      });

      if (!result.token || !result.student) {
        throw Error("Invalid login response.");
      }

      markOldQuizHistory();

      saveToken(result.token);
      account = result.student;

      $("pocketForm").reset();
      openAccount();

    } catch (error) {
      showMessage(error.message, true);
    } finally {
      buttons.forEach(b => b.disabled = false);
    }
  }

  async function logout() {
    if (account?.role === "student") {
      await syncStudent();
    }

    try {
      await api("/logout", "POST");
    } catch {}

    account = null;
    saveToken("");
    currentExperiment = null;

    lockWebsite();
    showMessage("Logged out. Please sign in again.");
  }

  /* ===============================
     TEACHER DASHBOARD
  =============================== */

  async function teacherDashboard() {
    if (account?.role !== "teacher") return;

    $("pocketTeacherName").textContent =
      "Welcome, " + account.username;

    $("pocketTeacherStatus").textContent =
      "Loading registered students from SQLite...";

    try {
      const result = await api("/teacher/students");
      const students = result.students || [];

      $("pocketTotalStudents").textContent =
        students.length;

      $("pocketTotalLabs").textContent =
        students.reduce(
          (sum, s) => sum + Number(s.experiments || 0),
          0
        );

      $("pocketTotalBadges").textContent =
        students.reduce(
          (sum, s) => sum + Number(s.achievements || 0),
          0
        );

      const tbody = $("pocketStudentsBody");
      tbody.replaceChildren();

      for (const student of students) {
        const row = create("tr");

        [
          student.username,
          student.achievements + " badges",
          student.experiments + " labs",
          student.bestPercent + "%"
        ].forEach(value => {
          row.appendChild(create("td", "", value));
        });

        const cell = create("td");
        const button = create(
          "button", "pocket-btn", "View Progress"
        );

        button.onclick = () =>
          loadStudentReport(student.id);

        cell.appendChild(button);
        row.appendChild(cell);
        tbody.appendChild(row);
      }

      $("pocketTeacherStatus").textContent =
        students.length
          ? `${students.length} students found in SQLite.`
          : "No registered student accounts yet.";

    } catch (error) {
      $("pocketTeacherStatus").textContent =
        "Error loading students: " + error.message;
    }
  }

  async function loadStudentReport(id) {
    const root = $("pocketStudentDetails");
    root.textContent = "Loading student progress...";

    try {
      const data = await api(
        "/teacher/students/" + id + "/overview"
      );

      root.replaceChildren();

      root.appendChild(
        create("h2", "", "👤 " + data.student.username)
      );

      const summary = data.summary;
      const total = summary.available || 0;

      const percent = total
        ? Math.round(summary.completed / total * 100)
        : 0;

      const stats = create("div", "pocket-stats");

      for (const [label, value] of [
        ["Quizzes", summary.quizzes],
        ["Completed Experiments", summary.completed],
        ["Total Progress", percent + "%"]
      ]) {
        const card = create("div", "pocket-stat");

        card.append(
          create("small", "", label),
          create("strong", "", value)
        );

        stats.appendChild(card);
      }

      root.appendChild(stats);

      const progress = create("div", "pocket-progress");
      const bar = create("span");
      bar.style.width = percent + "%";
      progress.appendChild(bar);
      root.appendChild(progress);

      root.appendChild(
        create("h3", "", "🏆 Student Achievements")
      );

      const badgeGrid = create("div", "pocket-grid");

      for (const badge of data.achievements) {
        const card = create(
          "div",
          "pocket-item",
          badge.icon + " " + badge.name +
          (badge.earned ? " ✅ Earned" : " 🔒 Locked")
        );

        badgeGrid.appendChild(card);
      }

      root.appendChild(badgeGrid);

      root.appendChild(
        create("h3", "", "🔬 All STEM Experiments")
      );

      for (const subject of [
        "physics",
        "chemistry",
        "biology",
        "mathematics",
        "other"
      ]) {
        const experiments = data.experiments.filter(
          item => item.subject === subject
        );

        if (!experiments.length) continue;

        const section = create("div", "pocket-subject");

        section.appendChild(
          create(
            "h3",
            "",
            subject.toUpperCase() +
            " (" + experiments.length + ")"
          )
        );

        const grid = create("div", "pocket-grid");

        for (const exp of experiments) {
          const status = exp.status;

          const item = create("div", "pocket-item");

          item.append(
            create("strong", "", exp.title),
            create(
              "small", "",
              status === "Completed"
                ? "✅ Completed"
                : status === "In Progress"
                  ? "🟡 In Progress"
                  : "⚪ Not Started"
            )
          );

          grid.appendChild(item);
        }

        section.appendChild(grid);
        root.appendChild(section);
      }

      root.appendChild(
        create("h3", "", "🧠 Quiz Results")
      );

      const quizGrid = create("div", "pocket-grid");

      if (!data.quizzes.length) {
        quizGrid.appendChild(
          create(
            "p", "pocket-muted",
            "No quiz attempts saved yet."
          )
        );
      }

      for (const quiz of data.quizzes.slice(0, 20)) {
        quizGrid.appendChild(
          create(
            "div",
            "pocket-item",
            quiz.subject + " · " +
            quiz.correct + "/" + quiz.total +
            " · " + quiz.points + " points"
          )
        );
      }

      root.appendChild(quizGrid);

      root.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    } catch (error) {
      root.textContent =
        "Could not load report: " + error.message;
    }
  }

  /* ===============================
     EXPERIMENT CATALOG
  =============================== */

  function cardInfo(card) {
    let subject = (
      card?.dataset.category ||
      card?.dataset.subject ||
      ""
    ).toLowerCase();

    if (subject === "math" || subject === "maths") {
      subject = "mathematics";
    }

    if (![
      "physics", "chemistry",
      "biology", "mathematics"
    ].includes(subject)) return null;

    const title = (
      card.querySelector("h3,h4")?.textContent || ""
    ).trim();

    if (!title) return null;

    const expId =
      card.querySelector("[data-chem4]")?.dataset.chem4 ||
      card.querySelector("[data-pmath]")?.dataset.pmath ||
      card.querySelector("[data-experiment]")
        ?.dataset.experiment ||
      card.dataset.experiment ||
      slug(title);

    return {
      key: subject + "_" + slug(expId),
      subject,
      title
    };
  }

  async function publishCatalog() {
    if (account?.role !== "student") return;

    const records = new Map();

    document.querySelectorAll(
      "#laboratory .experiment-card"
    ).forEach(card => {
      const info = cardInfo(card);
      if (info) records.set(info.key, info);
    });

    if (records.size) {
      await api("/catalog", "POST", {
        experiments: [...records.values()]
      });
    }
  }

  /* ===============================
     TRACK EXPERIMENT PROGRESS
  =============================== */

  document.addEventListener("click", event => {
    if (account?.role !== "student") return;

    const card = event.target.closest(
      ".experiment-card"
    );

    if (card) {
      const info = cardInfo(card);

      if (info) {
        currentExperiment = info;

        api("/progress", "POST", {
          experimentKey: info.key,
          completed: false
        }).catch(console.warn);
      }

      return;
    }

    const button = event.target.closest("button");

    if (!button || !currentExperiment) return;

    const completed =
      button.matches(
        "#chem4-complete,#pmathComplete"
      ) ||
      /complete experiment|finish experiment/i.test(
        button.textContent || ""
      );

    if (completed) {
      api("/progress", "POST", {
        experimentKey: currentExperiment.key,
        completed: true
      }).catch(console.warn);
    }
  }, true);

  /* ===============================
     SYNC QUIZ SCORES TO SQLITE
  =============================== */

  async function syncStudent() {
    if (
      account?.role !== "student" ||
      syncing
    ) return;

    syncing = true;

    try {
      const owners = loadOwners(QUIZ_OWNERS);

      const history = JSON.parse(
        localStorage.getItem(QUIZ_KEY) || "[]"
      );

      if (Array.isArray(history)) {
        for (const item of history) {
          if (!item?.date || !item?.subject) continue;

          const clientId = [
            item.date,
            item.subject,
            item.difficulty,
            item.correct,
            item.points
          ].join("|").slice(0, 120);

          if (!owners[clientId]) {
            owners[clientId] = String(account.id);
          }

          if (owners[clientId] !== String(account.id)) {
            continue;
          }

          await api("/quiz-results", "POST", {
            clientId,
            subject: item.subject,
            difficulty: item.difficulty,
            classLevel: item.grade || "Unknown",
            correct: item.correct,
            total: item.total || 10,
            points: item.points || 0,
            completedAt: item.date
          });
        }
      }

      saveOwners(QUIZ_OWNERS, owners);

      const labOwners = loadOwners(LAB_OWNERS);

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        const match = key?.match(
          /^pocketlab-(chem4|chemistry|maths|chem)-([\w-]+)$/
        );

        if (!match) continue;

        if (!["complete", "completed"].includes(
          localStorage.getItem(key)
        )) continue;

        if (!labOwners[key]) {
          labOwners[key] = String(account.id);
        }

        if (labOwners[key] !== String(account.id)) {
          continue;
        }

        const subject =
          match[1] === "maths"
            ? "mathematics"
            : "chemistry";

        await api("/progress", "POST", {
          experimentKey:
            subject + "_" + slug(match[2]),
          completed: true
        });
      }

      saveOwners(LAB_OWNERS, labOwners);

    } catch (error) {
      console.warn("Database sync:", error.message);
    } finally {
      syncing = false;
    }
  }

  /* ===============================
     STARTUP
  =============================== */

  async function initialize() {
    buildUI();
    lockWebsite();

    try {
      await api("/health");

      if (token()) {
        try {
          account = (await api("/me")).student;
          openAccount();
        } catch {
          saveToken("");
          showMessage("Please log in again.");
        }
      } else {
        showMessage("✅ Backend + SQLite connected.");
      }

    } catch {
      showMessage(
        "Start npm and open http://127.0.0.1:3000",
        true
      );
    }

    setInterval(() => {
      if (account?.role === "student") {
        syncStudent();
      }
    }, 3000);

    setInterval(() => {
      if (account?.role === "student") {
        publishCatalog().catch(() => {});
      }
    }, 15000);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded", initialize
    );
  } else {
    initialize();
  }
})();
