#!/usr/bin/env node
/**
 * CKS Database Seeder
 *
 * Usage (cross-platform):
 *   npm run seed              — seed if empty
 *   npm run seed:force        — wipe + re-seed
 *   npm run seed:reset        — wipe only
 *
 * Direct (if npx tsx fails):
 *   node --loader ts-node/esm scripts/seed-cli.ts
 *   OR install tsx globally: npm install -g tsx
 */

import mongoose from "mongoose";
import nextEnv from "@next/env";
import { seedDatabase } from "../server/seed.ts";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://cks_admin:cks_secret@localhost:27017/cks_website?authSource=admin";

const args = process.argv.slice(2);
const force = args.includes("--force");
const reset = args.includes("--reset");

async function main() {
  console.log("\n🌱 CKS Database Seeder");
  console.log("─".repeat(40));
  console.log(`📡 Connecting to MongoDB...`);

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log(`✅ Connected: ${mongoose.connection.host}/${mongoose.connection.name}\n`);

    if (reset) {
      const db = mongoose.connection.db;
      if (db) {
        const cols = await db.listCollections().toArray();
        for (const col of cols) {
          await db.collection(col.name).deleteMany({});
          console.log(`  🗑️  Cleared: ${col.name}`);
        }
      }
      console.log("\n✅ All collections cleared.\n");
    } else {
      const result = await seedDatabase(force);

      if (result.skipped) {
        console.log("⚠️  Data already exists. Use --force to re-seed.");
        console.log("   Existing:", result.existing);
      } else {
        console.log("✅ Database seeded!\n");
        const seeded = result.seeded as Record<string, number>;
        Object.entries(seeded).forEach(([k, v]) =>
          console.log(`  • ${k.padEnd(14)} ${v} records`)
        );
      }
    }

    console.log("\n" + "─".repeat(40));
    console.log("🎉 Done!");
    console.log("   Site:          http://localhost:3000");
    console.log("   Admin:         http://localhost:3000/admin/login");
    console.log("   Mongo Express: http://localhost:8081\n");
  } catch (err: any) {
    if (err.message?.includes("ECONNREFUSED") || err.message?.includes("ENOTFOUND")) {
      console.error("\n❌ Cannot connect to MongoDB.");
      console.error("   Make sure Docker is running first:");
      console.error("   npm run docker:up\n");
    } else {
      console.error("\n❌ Seed failed:", err.message);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
