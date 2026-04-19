# MongoDB Setup Guide

Three ways to connect — choose the one that fits your workflow.

---

## Option A — Local Docker (Recommended for development)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Start MongoDB
```bash
npm run docker:up
```
This starts:
- **MongoDB** on `localhost:27017`
- **Mongo Express** (web UI) on `http://localhost:8081`

### Connection string for `.env.local`
```
MONGODB_URI=mongodb://cks_admin:cks_secret@localhost:27017/cks_website?authSource=admin
```

### Connect with Mongo Compass
1. Open MongoDB Compass
2. Click **"+ Add new connection"**
3. Paste this URI:
   ```
   mongodb://cks_admin:cks_secret@localhost:27017/?authSource=admin
   ```
4. Click **Connect**
5. Select the `cks_website` database

Or import the pre-configured connection:
- In Compass: **File → Import Connections**
- Select: `docker/compass-connections.json`

### Connect with mongosh (CLI)
```bash
# Connect with admin user
mongosh "mongodb://cks_admin:cks_secret@localhost:27017/cks_website?authSource=admin"

# Or use the helper script (copy to ~/.mongoshrc.js for shortcuts)
mongosh "mongodb://cks_admin:cks_secret@localhost:27017/cks_website?authSource=admin" --file docker/.mongoshrc.js
```

### Useful Docker commands
```bash
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
npm run docker:logs     # View logs
npm run docker:reset    # Wipe data and restart fresh
docker ps               # Check running containers
```

---

## Option B — MongoDB Atlas (Cloud / Production)

### Setup
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0** cluster
3. **Database Access** → Add Database User:
   - Username: `cks_user`
   - Password: generate a strong password
   - Role: `readWriteAnyDatabase`
4. **Network Access** → Add IP Address:
   - For development: add your current IP
   - For Vercel: add `0.0.0.0/0` (allow all)
5. **Connect** → **Drivers** → copy the connection string

### Connection string for `.env.local`
```
MONGODB_URI=mongodb+srv://cks_user:YOUR_PASSWORD@cluster0.XXXXX.mongodb.net/cks_website?retryWrites=true&w=majority&appName=Cluster0
```
Replace `cks_user`, `YOUR_PASSWORD`, and `cluster0.XXXXX` with your values.

### Connect with Mongo Compass (Atlas)
1. In Atlas dashboard: **Connect → Compass**
2. Copy the Compass connection string
3. Open Compass → paste URI → Connect

---

## Option C — Local mongod (no Docker)

If you have MongoDB installed directly on your machine:

### Connection string for `.env.local`
```
MONGODB_URI=mongodb://localhost:27017/cks_website
```

### Connect with Compass
```
mongodb://localhost:27017
```

---

## Seed the Database

After choosing your MongoDB option and starting it:

```bash
npm run seed          # Seed if empty
npm run seed:force    # Wipe and re-seed
npm run seed:reset    # Wipe only, no data
```

This inserts sample services, projects, testimonials, blog posts, and default settings.

---

## Verify Connection

Visit the Express dev server: `http://localhost:4000/health`

Or run:
```bash
npx tsx -e "
import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI || 'mongodb://cks_admin:cks_secret@localhost:27017/cks_website?authSource=admin';
mongoose.connect(uri).then(() => { console.log('✅ Connected:', mongoose.connection.host); process.exit(0); }).catch(e => { console.error('❌', e.message); process.exit(1); });
"
```

---

## Mongo Express (Web UI)

When using Docker (Option A):
- URL: **http://localhost:8081**
- Username: `admin`
- Password: `admin123`

Browse collections, run queries, and manage data visually.

---

## Common Issues

| Problem | Fix |
|---|---|
| `ECONNREFUSED localhost:27017` | Docker not running → `npm run docker:up` |
| `Authentication failed` | Wrong username/password in URI |
| `ENOTFOUND cluster0.xxxxx` | Atlas URI has placeholder — replace with real values |
| `querySrv ENOTFOUND` | Same as above — placeholder in URI |
| `MongoServerSelectionError` | Atlas: check Network Access, add your IP |
| Compass can't connect | Check URI format, try without `?authSource` first |
