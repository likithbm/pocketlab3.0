
/* PocketLab Backend - Student & Teacher
   Express + SQLite - Complete server.js
*/
"use strict";

const express = require("express");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const dataDir = path.join(__dirname, "data");
const frontend = path.resolve(__dirname, "../..");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "pocketlab.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

// Keep existing student accounts and scores.
db.exec(`
CREATE TABLE IF NOT EXISTS students (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 username TEXT NOT NULL UNIQUE COLLATE NOCASE,
 password_hash TEXT NOT NULL,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY,
 student_id INTEGER NOT NULL REFERENCES students(id),
 expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_results (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 student_id INTEGER NOT NULL REFERENCES students(id),
 client_id TEXT NOT NULL,
 subject TEXT NOT NULL,
 difficulty TEXT NOT NULL,
 class_level TEXT NOT NULL,
 correct INTEGER NOT NULL,
 total INTEGER NOT NULL,
 points INTEGER NOT NULL,
 completed_at TEXT NOT NULL,
 UNIQUE(student_id, client_id)
);

CREATE TABLE IF NOT EXISTS experiment_progress (
 student_id INTEGER NOT NULL REFERENCES students(id),
 experiment_key TEXT NOT NULL,
 completed INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(student_id, experiment_key)
);

CREATE TABLE IF NOT EXISTS experiment_catalog (
 experiment_key TEXT PRIMARY KEY,
 subject TEXT NOT NULL,
 title TEXT NOT NULL
);
`);

// Upgrade old database without deleting records.
const columns = table =>
  db.prepare(`PRAGMA table_info(${table})`).all()
    .map(col => col.name);

if (!columns("students").includes("role")) {
  db.exec(
    "ALTER TABLE students ADD COLUMN role TEXT NOT NULL DEFAULT 'student'"
  );
}

if (!columns("experiment_progress").includes("started")) {
  db.exec(
    "ALTER TABLE experiment_progress ADD COLUMN started INTEGER NOT NULL DEFAULT 0"
  );
}

db.prepare(
  "UPDATE experiment_progress SET started=1 WHERE completed=1"
).run();

const hash = value =>
  crypto.createHash("sha256").update(value).digest("hex");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt + ":" +
    crypto.scryptSync(password, salt, 64).toString("hex");
}

function checkPassword(password, stored) {
  const [salt, expected] = String(stored || "").split(":");

  if (!salt || !/^[0-9a-f]{128}$/.test(expected || "")) {
    return false;
  }

  return crypto.timingSafeEqual(
    crypto.scryptSync(password, salt, 64),
    Buffer.from(expected, "hex")
  );
}

function makeToken(id) {
  const token = crypto.randomBytes(32).toString("hex");

  db.prepare(`
    INSERT INTO sessions(token_hash,student_id,expires_at)
    VALUES (?,?,?)
  `).run(hash(token), id, Date.now() + 604800000);

  return token;
}

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    role: row.role || "student"
  };
}

function auth(req, res, next) {
  const match = /^Bearer ([a-f0-9]{64})$/.exec(
    req.get("authorization") || ""
  );

  if (!match) {
    return res.status(401).json({ error: "Please log in." });
  }

  const user = db.prepare(`
    SELECT u.id,u.username,u.role
    FROM sessions s
    JOIN students u ON s.student_id=u.id
    WHERE s.token_hash=? AND s.expires_at>?
  `).get(hash(match[1]), Date.now());

  if (!user) {
    return res.status(401).json({
      error: "Session expired. Please log in again."
    });
  }

  req.user = user;
  req.tokenHash = hash(match[1]);
  next();
}

const role = required => (req, res, next) => {
  if (req.user.role !== required) {
    return res.status(403).json({
      error: required + " login required."
    });
  }
  next();
};

const studentAuth = [auth, role("student")];
const teacherAuth = [auth, role("teacher")];

app.get("/api/health", (req, res) => {
  res.json({ ok: true, backend: "Express", database: "SQLite" });
});

// Registration
app.post("/api/register", (req, res) => {
  const { username, password, role: userRole = "student" } =
    req.body || {};

  if (
    typeof username !== "string" ||
    !/^[a-zA-Z0-9_]{3,30}$/.test(username) ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128 ||
    !["student", "teacher"].includes(userRole)
  ) {
    return res.status(400).json({
      error: "Invalid account information."
    });
  }

  try {
    const result = db.prepare(`
      INSERT INTO students(username,password_hash,role)
      VALUES (?,?,?)
    `).run(username, hashPassword(password), userRole);

    const id = Number(result.lastInsertRowid);

    res.status(201).json({
      student: { id, username, role: userRole },
      token: makeToken(id)
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        error: "Username already exists."
      });
    }

    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password, role: selectedRole } =
    req.body || {};

  const user = typeof username === "string"
    ? db.prepare(
        "SELECT * FROM students WHERE username=?"
      ).get(username)
    : null;

  if (
    !user ||
    typeof password !== "string" ||
    !checkPassword(password, user.password_hash) ||
    (selectedRole && user.role !== selectedRole)
  ) {
    return res.status(401).json({
      error: "Invalid username, password or account type."
    });
  }

  res.json({
    student: publicUser(user),
    token: makeToken(user.id)
  });
});

app.get("/api/me", auth, (req, res) => {
  res.json({ student: publicUser(req.user) });
});

app.post("/api/logout", auth, (req, res) => {
  db.prepare(
    "DELETE FROM sessions WHERE token_hash=?"
  ).run(req.tokenHash);

  res.json({ ok: true });
});

// Save quiz results without duplicating the same quiz.
app.post("/api/quiz-results", ...studentAuth, (req, res) => {
  const q = req.body || {};

  if (
    typeof q.clientId !== "string" ||
    !q.clientId || q.clientId.length > 120 ||
    !["physics","chemistry","biology","mathematics"]
      .includes(q.subject) ||
    !["easy","medium","hard"].includes(q.difficulty) ||
    typeof q.classLevel !== "string" ||
    q.classLevel.length < 1 || q.classLevel.length > 40 ||
    !Number.isInteger(q.correct) ||
    !Number.isInteger(q.total) ||
    !Number.isInteger(q.points) ||
    q.total < 1 || q.total > 100 ||
    q.correct < 0 || q.correct > q.total ||
    q.points < 0 || q.points > 100000 ||
    typeof q.completedAt !== "string" ||
    Number.isNaN(Date.parse(q.completedAt))
  ) {
    return res.status(400).json({
      error: "Invalid quiz result."
    });
  }

  db.prepare(`
    INSERT OR IGNORE INTO quiz_results
    (student_id,client_id,subject,difficulty,
     class_level,correct,total,points,completed_at)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).run(
    req.user.id, q.clientId, q.subject, q.difficulty,
    q.classLevel, q.correct, q.total,
    q.points, q.completedAt
  );

  res.json({ ok: true });
});

// Save experiment as started or completed.
app.post("/api/progress", ...studentAuth, (req, res) => {
  const { experimentKey, completed } = req.body || {};

  if (
    typeof experimentKey !== "string" ||
    !/^[\w-]{1,100}$/.test(experimentKey) ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({
      error: "Invalid experiment progress."
    });
  }

  db.prepare(`
    INSERT INTO experiment_progress
    (student_id,experiment_key,started,completed)
    VALUES (?,?,1,?)
    ON CONFLICT(student_id,experiment_key)
    DO UPDATE SET
      started=1,
      completed=MAX(
        experiment_progress.completed,
        excluded.completed
      ),
      updated_at=CURRENT_TIMESTAMP
  `).run(req.user.id, experimentKey, completed ? 1 : 0);

  res.json({ ok: true });
});

// Store the names of experiments for the teacher to see.
app.post("/api/catalog", auth, (req, res) => {
  const experiments = req.body?.experiments;

  if (!Array.isArray(experiments) || experiments.length > 200) {
    return res.status(400).json({
      error: "Invalid experiment catalog."
    });
  }

  const statement = db.prepare(`
    INSERT INTO experiment_catalog
    (experiment_key,subject,title)
    VALUES (?,?,?)
    ON CONFLICT(experiment_key)
    DO UPDATE SET
      subject=excluded.subject,
      title=excluded.title
  `);

  try {
    db.transaction(() => {
      for (const item of experiments) {
        if (
          !item ||
          !/^[\w-]{1,100}$/.test(item.key || "") ||
          !["physics","chemistry","biology","mathematics"]
            .includes(item.subject) ||
          typeof item.title !== "string" ||
          !item.title.trim() || item.title.length > 100
        ) {
          throw new Error("Invalid catalog entry.");
        }

        statement.run(item.key, item.subject, item.title);
      }
    })();

    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Achievement rules calculated from real SQLite records.
const BADGES = [
  ["🧪", "First Experiment", "labs", 1],
  ["🔬", "Lab Explorer", "labs", 5],
  ["🏆", "Science Champion", "labs", 20],
  ["🧠", "Quiz Beginner", "quizzes", 1],
  ["⭐", "Quiz Master", "quizzes", 5],
  ["🎯", "Perfect Score", "perfect", 1],
  ["🌍", "All-Round STEM", "subjects", 4]
];

function overview(id) {
  const student = db.prepare(`
    SELECT id,username FROM students
    WHERE id=? AND role='student'
  `).get(id);

  if (!student) return null;

  const quizzes = db.prepare(`
    SELECT subject,difficulty,correct,total,points,
      completed_at AS completedAt
    FROM quiz_results
    WHERE student_id=?
    ORDER BY id DESC
  `).all(id);

  const progress = db.prepare(`
    SELECT experiment_key AS experimentKey,
      started,completed,updated_at AS updatedAt
    FROM experiment_progress
    WHERE student_id=?
  `).all(id);

  const catalog = db.prepare(`
    SELECT experiment_key AS experimentKey,subject,title
    FROM experiment_catalog
    ORDER BY subject,title
  `).all();

  const statusMap = new Map(
    progress.map(row => [row.experimentKey, row])
  );

  const experiments = catalog.map(item => {
    const record = statusMap.get(item.experimentKey);

    return {
      ...item,
      status: record?.completed ? "Completed" :
        record?.started ? "In Progress" : "Not Started"
    };
  });

  // Preserve and display older experiment records too.
  const knownKeys = new Set(
    catalog.map(item => item.experimentKey)
  );

  for (const item of progress) {
    if (!knownKeys.has(item.experimentKey)) {
      experiments.push({
        experimentKey: item.experimentKey,
        subject: "other",
        title: item.experimentKey,
        status: item.completed ? "Completed" : "In Progress"
      });
    }
  }

  const completed = progress.filter(p => p.completed).length;
  const started = progress.filter(
    p => p.started && !p.completed
  ).length;

  const points = quizzes.reduce(
    (sum, q) => sum + q.points, 0
  );

  const bestPercent = quizzes.length
    ? Math.max(...quizzes.map(
        q => Math.round(q.correct * 100 / q.total)
      ))
    : 0;

  const subjectsCompleted = new Set(
    experiments
      .filter(e =>
        e.status === "Completed" &&
        e.subject !== "other"
      )
      .map(e => e.subject)
  ).size;

  const metrics = {
    labs: completed,
    quizzes: quizzes.length,
    perfect: quizzes.some(q =>
      q.total >= 5 && q.correct === q.total
    ) ? 1 : 0,
    subjects: subjectsCompleted
  };

  const achievements = BADGES.map(
    ([icon, name, type, threshold]) => ({
      icon,
      name,
      earned: metrics[type] >= threshold
    })
  );

  return {
    student,
    quizzes,
    experiments,
    achievements,
    summary: {
      quizzes: quizzes.length,
      points,
      completed,
      started,
      available: catalog.length,
      bestPercent
    }
  };
}

// Student progress dashboard
app.get("/api/dashboard", ...studentAuth, (req, res) => {
  const data = overview(req.user.id);

  res.json({
    student: publicUser(req.user),
    quizzes: data.summary.quizzes,
    points: data.summary.points,
    bestPercent: data.summary.bestPercent,
    completedExperiments: data.summary.completed,
    startedExperiments: data.summary.started,
    achievements: data.achievements
  });
});

app.get("/api/student/overview", ...studentAuth, (req,res) => {
  res.json(overview(req.user.id));
});

// Teacher overview: all students on this local demo.
app.get("/api/teacher/dashboard", ...teacherAuth, (req,res) => {
  const students = db.prepare(
    "SELECT COUNT(*) AS n FROM students WHERE role='student'"
  ).get().n;

  const totals = db.prepare(`
    SELECT COUNT(*) AS quizzes,
      COALESCE(SUM(points),0) AS points
    FROM quiz_results
  `).get();

  res.json({
    teacher: publicUser(req.user),
    students,
    quizzes: totals.quizzes,
    points: totals.points
  });
});

app.get("/api/teacher/students", ...teacherAuth, (req,res) => {
  const users = db.prepare(`
    SELECT id,username FROM students
    WHERE role='student'
    ORDER BY username COLLATE NOCASE
  `).all();

  res.json({
    students: users.map(user => {
      const data = overview(user.id);

      return {
        ...user,
        quizzes: data.summary.quizzes,
        points: data.summary.points,
        bestPercent: data.summary.bestPercent,
        experiments: data.summary.completed,
        achievements: data.achievements.filter(a => a.earned).length
      };
    })
  });
});

app.get(
  "/api/teacher/students/:id/overview",
  ...teacherAuth,
  (req,res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid student ID." });
    }

    const data = overview(id);

    if (!data) {
      return res.status(404).json({
        error: "Student not found."
      });
    }

    res.json(data);
  }
);

// Allow either current location of pocketlab-api.js.
app.get([
  "/pocketlab-api.js",
  "/pocketlab_backend_starter/pocketlab-api.js"
], (req,res) => {
  const locations = [
    path.join(frontend,"pocketlab-api.js"),
    path.join(__dirname,"..","pocketlab-api.js")
  ];

  const file = locations.find(f => fs.existsSync(f));

  if (!file) return res.sendStatus(404);

  res.type("application/javascript").sendFile(file);
});

// Never expose backend/database folders publicly.
app.use((req,res,next) => {
  if (/(^|\/)(backend|data|node_modules|pocketlab_backend_starter|\.git)(\/|$)/i
    .test(req.path)) {
    return res.sendStatus(404);
  }

  next();
});

// Serve the existing PocketLab website.
app.use(express.static(frontend, {
  dotfiles: "deny",
  index: "index.html"
}));

app.use((error,req,res,next) => {
  console.error(error);

  if (res.headersSent) return next(error);

  res.status(500).json({ error: "Server error." });
});

app.listen(PORT,"127.0.0.1",() => {
  console.log(`PocketLab at http://127.0.0.1:${PORT}`);
  console.log(`SQLite database: ${path.join(dataDir,"pocketlab.db")}`);
  console.log("Student and Teacher dashboards enabled.");
});
