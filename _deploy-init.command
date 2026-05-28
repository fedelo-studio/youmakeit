#!/usr/bin/env bash
# ============================================================
# YouMakeIt — first-time deploy helper (Terminal auto-runs on double-click)
# ============================================================

set -uo pipefail

cd "$(dirname "$0")"

REPO_URL="https://github.com/fedelo-studio/youmakeit.git"

echo ""
echo "════════════════════════════════════════════════════════"
echo "  YouMakeIt — first push to github.com/fedelo-studio/youmakeit"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Working directory: $(pwd)"
echo ""

# Step 1 — nuke any pre-existing .git (Claude session left a broken one)
if [ -d ".git" ]; then
  echo "→ Removing previous .git (sandbox-created, missing objects)"
  rm -rf .git
fi

echo "→ Initialising fresh git repo (branch: main)"
git init -b main

echo "→ Setting identity"
git config user.email "studio@fedelo.io"
git config user.name "Felipe Delgado"

echo "→ Linking remote: $REPO_URL"
git remote add origin "$REPO_URL"

echo "→ Staging all files (except .gitignore'd ones)"
git add -A

echo "→ Committing initial version"
git commit -m "youmakeit.ch v0.1 — Fedelo-aligned design system, lime accent

YouMakeIt launch landing page, a program by Fedelo Studio.

- Borrows Fedelo Studio's design tokens (Strawford type, 8pt grid,
  fluid scale) and overrides the brand accent to lime (#c6f432).
- Single-page layout, no build step: index.html + css/ + js/.
- WebGL cursor-reactive hero (4 moods), proc-flow zigzag timeline,
  3-tier offer with featured lime card, end-CTA card.
- Global dark mode toggle (Fedelo is single-mode; YouMakeIt needs
  full coordination because of the shader hero).
- DESIGN_SYSTEM.md documents the deltas vs. fedelo.studio."

echo ""
echo "→ Pushing to GitHub (will use your saved git credentials / gh CLI)"
echo "  If prompted, paste your GitHub PAT or use 'gh auth login' first."
echo ""

if git push -u origin main --force; then
  echo ""
  echo "════════════════════════════════════════════════════════"
  echo "  ✓ Push successful."
  echo "════════════════════════════════════════════════════════"
  echo ""
  echo "  Vercel should detect the push within a few seconds and"
  echo "  redeploy the youmakeit project automatically."
  echo ""
  echo "  Next steps (already detailed in DEPLOY.md):"
  echo "    1. Vercel → youmakeit → Settings → Domains"
  echo "       → add 'youmakeit.ch'"
  echo "    2. DNS at your registrar (single record):"
  echo "         A     @     216.198.79.1"
  echo ""
else
  echo ""
  echo "════════════════════════════════════════════════════════"
  echo "  ✗ Push failed."
  echo "════════════════════════════════════════════════════════"
  echo ""
  echo "  Most common cause: no GitHub credentials in this shell."
  echo "  Try one of:"
  echo "    • gh auth login   (then re-run this script)"
  echo "    • git push -u origin main  (paste a PAT when prompted)"
  echo ""
fi

echo ""
echo "Press any key to close this window..."
read -n 1 -s
