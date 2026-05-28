# Deploy — youmakeit.ch

Quick reference for the YouMakeIt deployment workflow on Vercel.

---

## First-time push (you do this once)

The Claude session built the site locally but couldn't push from the sandbox
(no GitHub credentials). Open Terminal, cd into this folder, and run:

```bash
cd "/Users/Felipe/Documents/Claude/Projects/fedelo studio/youmakeit"
chmod +x _deploy-init.sh
./_deploy-init.sh
```

The script:

1. Wipes the borked `.git` directory the sandbox left behind.
2. Re-initialises a fresh git repo.
3. Links it to `github.com/fedelo-studio/youmakeit`.
4. Commits everything as `v0.1`.
5. Pushes to `main`.

`git push` will prompt for your GitHub credentials (or use the keychain /
gh-cli token you already have set up).

---

## Vercel project — first-time setup

You said the Vercel project already exists at
`youmakeit-elnnjkpw8-fedelo-studios-projects.vercel.app`. To make it the
production deploy on the youmakeit.ch domain:

### 1. Confirm the GitHub repo is connected

- Vercel → `youmakeit` project → **Settings → Git**.
- Production branch: `main`.
- Connected repo: `fedelo-studio/youmakeit`.
- After the first push, the next deploy on `main` should appear under
  **Deployments**.

### 2. Add the custom domain

- Vercel → `youmakeit` project → **Settings → Domains**.
- Add `youmakeit.ch` (apex) and `www.youmakeit.ch`.
- Vercel will show the DNS records you need to set at your registrar.

### 3. DNS at your registrar

For Vercel-hosted production, the canonical records (read from Vercel's
DNS panel on 2026-05-28) are:

| Type  | Host       | Value                  |
|-------|------------|-------------------------|
| A     | `@`        | `216.198.79.1`         |

That's it — apex-only. No www subdomain is set up by default.

Notes:
- Vercel's older `76.76.21.21` IP still works but is being phased out;
  `216.198.79.1` is the new recommended apex IP.
- If you later want `www.youmakeit.ch` to also work, add the www subdomain
  in Vercel → Domains and set `CNAME www → cname.vercel-dns.com` at your
  registrar.
- If your registrar's UI uses "Name" instead of "Host", same thing. If it
  requires the full domain — `youmakeit.ch.` — use that with the trailing dot.

Wait 1–5 minutes for DNS to propagate. Vercel will auto-verify and issue
a Let's Encrypt cert.

### 4. Set canonical redirect

In Vercel's domain UI, choose which one is canonical (recommended:
`youmakeit.ch`, with `www.youmakeit.ch` redirecting to it).

---

## Subsequent deploys (zero-effort)

Once the GitHub → Vercel link is wired:

```bash
# you edit code
git add .
git commit -m "tweak hero copy"
git push
```

A few seconds later, Vercel picks up the push and rebuilds. No build
command, no framework — Vercel just serves the static files.

You can watch deploys at the project page.

---

## Project type on Vercel

- **Framework preset:** Other
- **Build command:** (none)
- **Output directory:** `./` (the repo root)
- **Install command:** (none)

`vercel.json` in the repo root already sets long cache headers for the
Strawford .woff2 files and short cache for CSS/JS.

---

## Local preview before pushing

```bash
cd "/Users/Felipe/Documents/Claude/Projects/fedelo studio/youmakeit"
python3 -m http.server 4321
# → http://localhost:4321
```

Any static server works — there is no build step.
