#!/usr/bin/env bash
# ============================================================
# YouMakeIt — push incremental updates (NOT a first-time init)
# ============================================================
# Use this for every push AFTER the initial deploy.
# Unlike _deploy-init.command, this does NOT wipe .git.
# ============================================================

set -uo pipefail
cd "$(dirname "$0")"

echo ""
echo "════════════════════════════════════════════════════════"
echo "  YouMakeIt — push incremental updates"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Working directory: $(pwd)"
echo ""

if [ ! -d ".git" ]; then
  echo "✗ No .git here. Run _deploy-init.command first."
  read -n 1 -s
  exit 1
fi

echo "→ Status:"
git status --short
echo ""

echo "→ Staging all changes"
git add -A

echo "→ Committing"
git commit -m "single-mode light, .theme-dark scoped on hero + nav + end-CTA

Aligns YouMakeIt's theming architecture with fedelo.studio:

- No more global dark/light toggle (data-mode removed everywhere).
- Root is light; .theme-dark is scoped on .hero-shader, .end-cta-card,
  and .chrome-top (the latter drops .theme-dark as the user scrolls
  past the hero, so the nav matches the page palette below).
- All [data-mode='dark'] selectors rewritten as .theme-dark scope.
- Featured pricing card no longer flips to lime — it stays as the
  dark card with lime accents (its previous light-mode look).
- Theme-toggle button + boot script + OS-pref listener removed.
- Both WebGL shader instances are now forceDark: true since their
  containers are always inside a .theme-dark scope.

DESIGN_SYSTEM.md updated to reflect the new architecture."

echo ""
echo "→ Pushing to GitHub"
echo ""
if git push origin main; then
  echo ""
  echo "════════════════════════════════════════════════════════"
  echo "  ✓ Pushed. Vercel will redeploy in seconds."
  echo "════════════════════════════════════════════════════════"
else
  echo ""
  echo "✗ Push failed. Check creds (gh auth status)."
fi

echo ""
echo "Press any key to close..."
read -n 1 -s
