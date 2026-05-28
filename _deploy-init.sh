#!/usr/bin/env bash
# ============================================================
# YouMakeIt — first-time deploy helper
# ============================================================
# Run this ONCE from this folder to push the initial code to
# github.com/fedelo-studio/youmakeit. After that, every push
# to main triggers a Vercel deploy automatically.
#
#   chmod +x _deploy-init.sh
#   ./_deploy-init.sh
# ============================================================

set -euo pipefail

cd "$(dirname "$0")"

REPO_URL="https://github.com/fedelo-studio/youmakeit.git"

# The Claude session created a .git directory but couldn't push
# because the sandbox has no credentials. Reset and recreate so
# everything starts clean from your terminal.
if [ -d ".git" ]; then
  echo "→ Removing stale .git directory created by the assistant"
  rm -rf .git
fi

echo "→ Initialising fresh git repo"
git init -b main

echo "→ Setting identity (override if you prefer a different one)"
git config user.email "studio@fedelo.io"
git config user.name "Felipe Delgado"

echo "→ Linking remote"
git remote add origin "$REPO_URL"

echo "→ Staging files"
git add -A

echo "→ Committing"
git commit -m "youmakeit.ch v0.1 — Fedelo-aligned design system, lime accent

YouMakeIt launch landing page, a program by Fedelo Studio.

- Borrows Fedelo Studio's design tokens (Strawford type, 8pt grid,
  fluid scale) and overrides the brand accent to lime (#c6f432).
- Single-page layout, no build step: index.html + css/ + js/.
- WebGL cursor-reactive hero (4 moods), proc-flow zigzag timeline,
  3-tier offer with featured lime card, end-CTA card.
- Global dark mode toggle (Fedelo is single-mode; YouMakeIt needs
  full coordination because of the shader hero).
- DESIGN_SYSTEM.md documents the deltas vs. fedelo.studio.

Production target: youmakeit.ch via Vercel."

echo "→ Pushing to GitHub (may prompt for credentials / 2FA)"
git push -u origin main --force

echo ""
echo "Done. Next steps on Vercel:"
echo "  1. Open the youmakeit project in Vercel"
echo "  2. Settings → Domains → add 'youmakeit.ch' (and 'www.youmakeit.ch')"
echo "  3. Update DNS at your registrar:"
echo "       A     @     76.76.21.21"
echo "       CNAME www   cname.vercel-dns.com"
echo "  4. From now on, every 'git push' to main triggers a deploy."
