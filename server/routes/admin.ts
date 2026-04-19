import { Router } from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";

export const adminRouter = Router();

// Export all data as JSON
adminRouter.get("/export", async (_req: Request, res: Response) => {
  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });

  const collections = await db.listCollections().toArray();
  const dump: Record<string, unknown[]> = {};

  for (const col of collections) {
    dump[col.name] = await db.collection(col.name).find({}).toArray();
  }

  res.setHeader("Content-Disposition", `attachment; filename="cks-export-${Date.now()}.json"`);
  res.setHeader("Content-Type", "application/json");
  res.json({ exportedAt: new Date().toISOString(), database: mongoose.connection.name, data: dump });
});

// Import JSON data dump
adminRouter.post("/import", async (req: Request, res: Response) => {
  const { data, clearFirst = false } = req.body;
  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid data. Send { data: { collectionName: [...docs] } }" });
  }

  const results: Record<string, number> = {};

  for (const [colName, docs] of Object.entries(data)) {
    if (!Array.isArray(docs)) continue;
    const col = db.collection(colName);
    if (clearFirst) await col.deleteMany({});
    if (docs.length > 0) {
      // Strip _id to avoid duplicate key errors
      const cleanDocs = docs.map(({ _id, ...rest }: any) => rest);
      await col.insertMany(cleanDocs);
      results[colName] = cleanDocs.length;
    }
  }

  res.json({ success: true, imported: results });
});

// Reset site settings to defaults
adminRouter.post("/reset-settings", async (_req: Request, res: Response) => {
  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });

  await db.collection("sitesettings").deleteMany({});
  res.json({ success: true, message: "Settings cleared. They will regenerate from defaults on next page load." });
});

// Re-create indexes
adminRouter.post("/create-indexes", async (_req: Request, res: Response) => {
  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });

  try {
    await Promise.all([
      db.collection("services").createIndex({ slug: 1 }, { unique: true, background: true }),
      db.collection("services").createIndex({ isActive: 1, sortOrder: 1 }, { background: true }),
      db.collection("projects").createIndex({ slug: 1 }, { unique: true, background: true }),
      db.collection("projects").createIndex({ isActive: 1, featured: -1, sortOrder: 1 }, { background: true }),
      db.collection("testimonials").createIndex({ isActive: 1, isFeatured: -1 }, { background: true }),
      db.collection("blogposts").createIndex({ slug: 1 }, { unique: true, background: true }),
      db.collection("blogposts").createIndex({ isPublished: 1, publishedAt: -1 }, { background: true }),
      db.collection("messages").createIndex({ status: 1, createdAt: -1 }, { background: true }),
      db.collection("sitesettings").createIndex({ key: 1 }, { unique: true, background: true }),
    ]);
    res.json({ success: true, message: "All indexes created/verified." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get server + mongo info
adminRouter.get("/info", (_req: Request, res: Response) => {
  res.json({
    node: process.version,
    mongooseVersion: mongoose.version,
    connection: {
      state: mongoose.connection.readyState,
      stateLabel: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState],
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      database: mongoose.connection.name,
    },
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  });
});
