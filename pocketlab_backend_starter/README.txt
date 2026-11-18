POCKETLAB BACKEND + SQLITE

Copy the 'backend' folder and 'pocketlab-api.js' into your existing PocketLab project root (where index.html lives).
Do NOT replace existing index.html, script.js, physics.js, chemistry.js, maths.js, visuals.js or quiz.js.

1) In index.html, add exactly once before </body>:
   <script src="pocketlab-api.js" defer></script>

2) Install Node.js 22+ on your laptop (once).
3) Open VS Code Terminal in your PocketLab folder:
   cd backend
   npm install
   npm start

4) Open http://127.0.0.1:3000 (NOT Live Server port 5500).
5) Create a student account using the floating Account widget.
6) Finish a Quiz Arena quiz and click Dashboard. The score syncs automatically (up to 3 seconds).
7) Chemistry/Maths experiment-completion keys are also synced to SQLite.

Database path: backend/data/pocketlab.db (created automatically).
The npm packages need an internet connection for initial installation. After installation, runtime is local/offline.
Important: Do not expose this development server to the public internet. Bind is intentionally limited to 127.0.0.1.

Available endpoints:
GET /api/health
POST /api/register {username,password}
POST /api/login {username,password}
GET /api/me (Bearer token)
POST /api/logout
POST /api/quiz-results
GET /api/quiz-results
POST /api/progress
GET /api/progress
GET /api/dashboard
