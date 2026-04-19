# Deployment Guide

This project is ready to deploy to Vercel using GitHub as the source of truth.

## Recommended Production Setup

Use this stack for a stable, real-world deployment:

- GitHub for source control and collaboration
- Vercel for Next.js hosting and preview deployments
- MongoDB Atlas for the production database
- Google OAuth for admin sign-in
- Optional: Resend for email, Cloudinary for uploads, Cloudflare Turnstile for spam protection

## 1. GitHub Repository

Create a new GitHub repository, ideally named `chandankshah`.

Then push this project:

```powershell
git init
git branch -M main
git add .
git commit -m "Initial production-ready setup"
git remote add origin https://github.com/<your-github-username>/chandankshah.git
git push -u origin main
```

## 2. Vercel Project

In Vercel:

1. Click `Add New...` -> `Project`
2. Import the GitHub repository
3. Set the project name to `chandankshah`
4. Keep the framework preset as `Next.js`
5. Leave the root directory as the repository root
6. Deploy once environment variables are added

## 3. Production Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

- `MONGODB_URI`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `ADMIN_EMAIL`

Optional production variables:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_TO`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Use these production values:

- `NEXTAUTH_URL=https://chandankshah.com.np`
- `EMAIL_FROM=hello@chandankshah.com.np`

## 4. MongoDB Atlas

Use MongoDB Atlas for production instead of local MongoDB.

Checklist:

1. Create an Atlas cluster
2. Create a database user
3. Allow Vercel access
4. Put the Atlas connection string into `MONGODB_URI`

If you want tight security, start with a temporary `0.0.0.0/0` allowlist for first deploy, verify the app works, then lock it down with Atlas-compatible network rules.

## 5. Google OAuth

In Google Cloud Console, add:

Authorized JavaScript origins:

- `http://localhost:3000`
- `https://chandankshah.com.np`

Authorized redirect URIs:

- `http://localhost:3000/api/auth/callback/google`
- `https://chandankshah.com.np/api/auth/callback/google`

## 6. Domain Setup

After the first successful Vercel deploy:

1. Open Vercel Project -> Settings -> Domains
2. Add `chandankshah.com.np`
3. Add `www.chandankshah.com.np` if you want the `www` version too

Typical DNS records:

- Apex/root domain `chandankshah.com.np`: `A` -> `76.76.21.21`
- `www`: `CNAME` -> `cname.vercel-dns.com`

If your DNS provider supports ALIAS or ANAME, that is also acceptable for the apex domain.

## 7. Post-Deploy Checks

After deployment, verify:

1. Home page loads
2. `/admin/login` opens correctly
3. Google sign-in works for `ADMIN_EMAIL`
4. Contact form submits
5. MongoDB reads and writes succeed
6. Metadata, sitemap, and robots resolve under the production domain

## 8. Recommended Team Workflow

For future stability:

- Use `main` for production
- Open pull requests for important changes
- Let GitHub Actions run `npm run build` before merging
- Let Vercel create preview deployments on every PR or branch push
- Store all secrets only in Vercel and local `.env.local`, never in Git
