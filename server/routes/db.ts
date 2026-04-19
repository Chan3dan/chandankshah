import { Router } from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";

export const dbRouter = Router();

// Collection stats
dbRouter.get("/stats", async (_req: Request, res: Response) => {
  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });

  const collections = await db.listCollections().toArray();
  const stats: Record<string, number> = {};

  for (const col of collections) {
    stats[col.name] = await db.collection(col.name).countDocuments();
  }

  res.json({
    database: mongoose.connection.name,
    host: mongoose.connection.host,
    collections: stats,
    totalDocuments: Object.values(stats).reduce((a, b) => a + b, 0),
  });
});

// List collections
dbRouter.get("/collections", async (_req: Request, res: Response) => {
  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });
  const cols = await db.listCollections().toArray();
  res.json(cols.map((c) => c.name));
});

// Generic collection browser: /db/:collection?limit=20&skip=0
dbRouter.get("/:collection", async (req: Request, res: Response) => {
  const { collection } = req.params;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = parseInt(req.query.skip as string) || 0;

  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });

  try {
    const col = db.collection(collection as string);
    const [docs, total] = await Promise.all([
      col.find({}).limit(limit).skip(skip).toArray(),
      col.countDocuments(),
    ]);

    res.json({ collection, total, limit, skip, docs });
  } catch {
    res.status(404).json({ error: `Collection "${collection}" not found` });
  }
});

// Get single document by ID
dbRouter.get("/:collection/:id", async (req: Request, res: Response) => {
  const { collection, id } = req.params;
  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });

  try {
    const doc = await db
      .collection(collection as string)
      .findOne({ _id: new mongoose.Types.ObjectId(id as string) });
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// Delete single document
dbRouter.delete("/:collection/:id", async (req: Request, res: Response) => {
  const { collection, id } = req.params;
  const db = mongoose.connection.db;
  if (!db) return res.status(503).json({ error: "Not connected" });

  try {
    await db
      .collection(collection as string)
      .deleteOne({ _id: new mongoose.Types.ObjectId(id as string) });
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});
