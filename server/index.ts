import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import nextEnv from "@next/env";
import { seedDatabase } from "./seed.ts";
import { dbRouter } from "./routes/db.ts";
import { adminRouter } from "./routes/admin.ts";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://cks_admin:cks_secret@localhost:27017/cks_website?authSource=admin";

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8081"] }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// ── Connect MongoDB ─────────────────────────────────────
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

// ── Routes ──────────────────────────────────────────────

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    db: mongoose.connection.name,
    host: mongoose.connection.host,
    time: new Date().toISOString(),
  });
});

// DB info
app.use("/db", dbRouter);

// Admin utilities
app.use("/admin", adminRouter);

// ── Seed endpoint ───────────────────────────────────────
app.post("/seed", async (req: Request, res: Response) => {
  try {
    const { force = false } = req.body;
    const result = await seedDatabase(force);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/seed", async (_req: Request, res: Response) => {
  try {
    const collections = mongoose.connection.collections;
    const cleared: string[] = [];
    for (const name of Object.keys(collections)) {
      await collections[name].deleteMany({});
      cleared.push(name);
    }
    res.json({ success: true, cleared });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Root info page ──────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CKS Dev Server</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1c1917; line-height: 1.6; }
        h1 { font-size: 1.8rem; margin-bottom: 4px; }
        .sub { color: #78716c; margin-bottom: 32px; }
        .card { background: #f5f4f1; border: 1px solid #e4e2dc; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
        .card h2 { font-size: 1rem; margin: 0 0 12px; color: #2563eb; }
        .endpoint { display: flex; gap: 12px; align-items: center; margin-bottom: 8px; font-size: 14px; }
        .method { font-family: monospace; font-weight: 700; font-size: 11px; padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }
        .GET { background: #dcfce7; color: #16a34a; }
        .POST { background: #dbeafe; color: #2563eb; }
        .DELETE { background: #fee2e2; color: #dc2626; }
        code { background: #e4e2dc; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
        .status { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #16a34a; margin-right: 6px; }
      </style>
    </head>
    <body>
      <h1>🛠️ CKS Express Dev Server</h1>
      <p class="sub"><span class="status"></span>Running on port ${PORT} · MongoDB: ${mongoose.connection.host}</p>

      <div class="card">
        <h2>Health & Info</h2>
        <div class="endpoint"><span class="method GET">GET</span> <code>/health</code> — Server + DB status</div>
        <div class="endpoint"><span class="method GET">GET</span> <code>/db/stats</code> — Collection counts</div>
        <div class="endpoint"><span class="method GET">GET</span> <code>/db/collections</code> — List all collections</div>
      </div>

      <div class="card">
        <h2>Seed & Reset</h2>
        <div class="endpoint"><span class="method POST">POST</span> <code>/seed</code> — Seed DB with sample data</div>
        <div class="endpoint"><span class="method POST">POST</span> <code>/seed</code> body: <code>{"force":true}</code> — Force re-seed (wipes first)</div>
        <div class="endpoint"><span class="method DELETE">DELETE</span> <code>/seed</code> — Wipe ALL collections</div>
      </div>

      <div class="card">
        <h2>Data Explorer</h2>
        <div class="endpoint"><span class="method GET">GET</span> <code>/db/services</code></div>
        <div class="endpoint"><span class="method GET">GET</span> <code>/db/projects</code></div>
        <div class="endpoint"><span class="method GET">GET</span> <code>/db/testimonials</code></div>
        <div class="endpoint"><span class="method GET">GET</span> <code>/db/messages</code></div>
        <div class="endpoint"><span class="method GET">GET</span> <code>/db/settings</code></div>
        <div class="endpoint"><span class="method GET">GET</span> <code>/db/blog</code></div>
      </div>

      <div class="card">
        <h2>Quick Admin Actions</h2>
        <div class="endpoint"><span class="method POST">POST</span> <code>/admin/reset-settings</code> — Reset CMS settings to defaults</div>
        <div class="endpoint"><span class="method GET">GET</span> <code>/admin/export</code> — Export all data as JSON</div>
        <div class="endpoint"><span class="method POST">POST</span> <code>/admin/import</code> — Import JSON data dump</div>
        <div class="endpoint"><span class="method POST">POST</span> <code>/admin/create-indexes</code> — Re-create MongoDB indexes</div>
      </div>

      <div class="card">
        <h2>Other Services</h2>
        <div class="endpoint">🌐 <strong>Next.js</strong> → <a href="http://localhost:3000">http://localhost:3000</a></div>
        <div class="endpoint">🗄️ <strong>Mongo Express</strong> → <a href="http://localhost:8081">http://localhost:8081</a> (admin/admin123)</div>
        <div class="endpoint">🧭 <strong>Mongo Compass</strong> → <code>mongodb://cks_admin:cks_secret@localhost:27017</code></div>
      </div>
    </body>
    </html>
  `);
});

// ── Error handler ───────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// ── Start ───────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 CKS Express Dev Server running at http://localhost:${PORT}`);
    console.log(`📖 Open http://localhost:${PORT} for the API guide\n`);
  });
});
