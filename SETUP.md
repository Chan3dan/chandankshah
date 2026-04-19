# CKS Website — Complete Setup Guide

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill .env.local
# Edit ADMIN_EMAIL, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET

# 3. Start MongoDB via Docker
npm run docker:up

# 4. Seed the database
npm run seed

# 5. Run the app
npm run dev
# → http://localhost:3000        (public site)
# → http://localhost:3000/admin  (admin panel)
# → http://localhost:8081        (Mongo Express)
```

---

## Environment Variables (.env.local)

| Variable | Value | Notes |
|---|---|---|
| `MONGODB_URI` | `mongodb://cks_admin:cks_secret@localhost:27017/cks_website?authSource=admin` | Docker local |
| `AUTH_SECRET` | random 32+ char string | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` | Change to your domain in production |
| `AUTH_GOOGLE_ID` | from Google Console | See below |
| `AUTH_GOOGLE_SECRET` | from Google Console | See below |
| `ADMIN_EMAIL` | your Gmail address | Only this email can access /admin |

---

## Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **New Project** → name it "CKS Website"
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://chandankshah.com.np` (your domain)
6. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://chandankshah.com.np/api/auth/callback/google`
7. Copy **Client ID** → `AUTH_GOOGLE_ID`
8. Copy **Client Secret** → `AUTH_GOOGLE_SECRET`

---

## MongoDB Options

See `MONGODB.md` for full details on all three options:
- **Option A** — Local Docker (recommended for dev)
- **Option B** — MongoDB Atlas (cloud / production)
- **Option C** — Local mongod (no Docker)

### Mongo Compass Connection (Docker)
```
mongodb://cks_admin:cks_secret@localhost:27017/?authSource=admin
```
Or import `docker/compass-connections.json` into Compass.

---

## Available Scripts

```bash
npm run dev            # Start Next.js on :3000
npm run dev:server     # Start Express utility server on :4000
npm run dev:all        # Both at once (Next.js + Express)
npm run build          # Production build
npm run seed           # Seed DB (skips if data exists)
npm run seed:force     # Wipe + re-seed
npm run seed:reset     # Wipe only
npm run docker:up      # Start MongoDB + Mongo Express
npm run docker:down    # Stop containers
npm run docker:logs    # View container logs
npm run docker:reset   # Wipe DB volume + restart
```

---

## Admin Panel

URL: `/admin/login`

Log in with the Google account matching `ADMIN_EMAIL`.

| Section | What you can do |
|---|---|
| Dashboard | Stats overview, recent messages |
| Services | Add/edit/delete services, set price, color, features |
| Projects | Add/edit/delete projects, mark featured, add links |
| Blog | Write posts (HTML), publish/draft toggle |
| Testimonials | Add/edit reviews, feature toggle, star rating |
| Messages | Full inbox, mark read/replied/archived |
| Settings | Edit hero text, profile info, Niyukta promo, pricing, social links, SEO |

---

## Deploy to Vercel

```bash
# Push to GitHub
git init && git add . && git commit -m "initial commit"
git remote add origin https://github.com/yourname/cks-website.git
git push -u origin main
```

Then in Vercel:
1. Import the GitHub repo
2. Add all environment variables (use Atlas URI for `MONGODB_URI`)
3. Change `NEXTAUTH_URL` to `https://chandankshah.com.np`
4. Deploy

**Domain setup:**
- Vercel → Project → Settings → Domains → Add `chandankshah.com.np`
- DNS: `A` → `76.76.21.21`, `CNAME www` → `cname.vercel-dns.com`

---

## Redirect Loop Fix (already applied)

If you ever see a redirect loop at `/admin/login`:
- The issue was the admin layout wrapping the login page itself
- **Fixed:** all protected pages live in `app/admin/(protected)/`
- The login page at `app/admin/login/` has no parent layout → no loop

