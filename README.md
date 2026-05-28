# youmakeit.ch

Landing page for **YouMakeIt**, a guided launch program by [Fedelo Studio](https://fedelo.studio).

## Stack

Pure static site — no build step.

```
index.html            ← single page, links the CSS/JS below
css/
  fonts.css           ← Strawford @font-face declarations (light / regular / medium / bold)
  variables.css       ← design tokens — Fedelo-aligned, lime override
  reset.css           ← box-sizing, base elements
  components.css      ← every component used on the page
js/
  app.js              ← nav scroll, theme toggle, mobile menu, smooth scroll, reveal
  shader-bg.js        ← cursor-reactive WebGL flow-field (hero + final CTA)
assets/fonts/         ← Strawford .woff/.woff2 (Felipe holds the full license)
vercel.json           ← cache headers for fonts + CSS/JS
robots.txt
sitemap.xml
DESIGN_SYSTEM.md      ← what's borrowed from Fedelo, what differs
```

## Design system

YouMakeIt **shares Fedelo Studio's design system** — same Strawford type, same 8pt
spacing, same fluid scale, same component DNA. The only intentional difference is
the brand accent: Fedelo's orange `#ff4a1c` is replaced by lime `#c6f432`. The
override is one variable: `--hot` in `css/variables.css`.

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the full delta.

## Local dev

```bash
# any static server works; this is the simplest
python3 -m http.server 4321
# → http://localhost:4321
```

## Deploy (Vercel)

The repo is hosted at `github.com/fedelo-studio/youmakeit` and connected to a
Vercel project. Every push to `main` triggers a production deploy.

Production domain: **youmakeit.ch** (custom domain on Vercel).

No build command, no framework — Vercel serves the static files as-is.

## Brand context

YouMakeIt is the **public expression of the YouMakeIt method**, Fedelo Studio's
internal product-launch methodology. It is positioned as a program of the
studio, not as an independent brand:

- Footer credits Fedelo Studio.
- Color, typography, and tone read as a sibling of fedelo.studio.
- The CTA flows to `studio@fedelo.io` and to `fedelo.studio/youmakeit` (teaser).
