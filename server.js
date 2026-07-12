import express from "express";
import pg from "pg";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me";
const PROJECT_NAME = process.env.PROJECT_NAME || "our product";

if (!DATABASE_URL) { console.error("Missing DATABASE_URL. Add a Postgres database in Railway."); process.exit(1); }

const noSslNeeded =
  process.env.PGSSL === "false" ||
  DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1") || DATABASE_URL.includes("host=/");

const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: noSslNeeded ? false : { rejectUnauthorized: false } });

const STAGES = ["new", "contacted", "qualified", "won", "lost"];

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      note TEXT,
      stage TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log("Database ready.");
}

function isEmail(e){ return typeof e==="string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

app.get("/api/config", (req, res) => res.json({ projectName: PROJECT_NAME, stages: STAGES }));

// Public capture (embed this form anywhere)
app.post("/api/lead", async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const company = (req.body.company || "").trim() || null;
    const note = (req.body.note || "").trim() || null;
    if (!name) return res.status(400).json({ error: "Name is required." });
    if (!isEmail(email)) return res.status(400).json({ error: "Enter a valid email address." });
    await pool.query("INSERT INTO leads (name, email, company, note) VALUES ($1,$2,$3,$4)", [name, email, company, note]);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Something went wrong. Please try again." }); }
});

function checkAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (token !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
  next();
}

app.get("/api/admin/leads", checkAdmin, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM leads ORDER BY created_at DESC");
  res.json({ total: rows.length, leads: rows, stages: STAGES });
});

app.post("/api/admin/stage", checkAdmin, async (req, res) => {
  const id = parseInt(req.body.id, 10);
  const stage = String(req.body.stage || "");
  if (!STAGES.includes(stage)) return res.status(400).json({ error: "Invalid stage." });
  await pool.query("UPDATE leads SET stage = $1 WHERE id = $2", [stage, id]);
  res.json({ ok: true });
});

app.post("/api/admin/delete", checkAdmin, async (req, res) => {
  const id = parseInt(req.body.id, 10);
  await pool.query("DELETE FROM leads WHERE id = $1", [id]);
  res.json({ ok: true });
});

app.get("/api/admin/export", checkAdmin, async (req, res) => {
  const { rows } = await pool.query("SELECT name,email,company,note,stage,created_at FROM leads ORDER BY created_at ASC");
  const safe = v => `"${String(v ?? "").replace(/"/g,'""')}"`;
  let csv = "name,email,company,note,stage,created_at\n";
  for (const r of rows) csv += [safe(r.name),safe(r.email),safe(r.company),safe(r.note),r.stage,safe(r.created_at)].join(",")+"\n";
  res.setHeader("Content-Type","text/csv");
  res.setHeader("Content-Disposition","attachment; filename=leads.csv");
  res.send(csv);
});

initDb()
  .then(() => app.listen(PORT, () => console.log(`Leadpost running on port ${PORT}`)))
  .catch((err) => { console.error("Failed to start:", err); process.exit(1); });
