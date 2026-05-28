# YouMakeIt — Design System

YouMakeIt is a **variant of the Fedelo Studio design system**, not a fork. It
keeps the same typographic ladder, spacing grid, motion language, and component
DNA. The two surfaces look related on purpose: YouMakeIt is positioned as a
program of Fedelo Studio, and the visual identity reinforces that lineage.

Only one thing intentionally diverges: the brand accent.

> **Single source of design truth:** `/Users/Felipe/Documents/fedelo.studio/fedelo.studio.website/css/variables.css`
> is the upstream definition. This file documents only the deltas. When the
> upstream tokens change, mirror them in `css/variables.css` before adding new
> overrides.

---

## 1. What's shared with Fedelo (don't change here)

| Token group        | Where it lives in YouMakeIt           | Identical to Fedelo |
|--------------------|----------------------------------------|---------------------|
| Type families      | `--font-sans`, `--font-mono`          | ✓ — Strawford + JetBrains Mono |
| Type weights       | `--fw-light`, `--fw-regular`, `--fw-medium` | ✓ — 300 / 400 / 500 |
| Type scale         | `--text-eyebrow` → `--text-mega`       | ✓ — identical clamp() values |
| Line heights       | `--lh-tight` → `--lh-relaxed`          | ✓ — 4-step ladder |
| Letter spacing     | `--ls-tightest` → `--ls-wide`          | ✓ — 5-step ladder |
| Spacing (8pt grid) | `--space-0` → `--space-13`            | ✓ — identical |
| Radius             | `--radius-sm` → `--radius-pill`        | ✓ — identical |
| Shadows            | `--shadow-sm`, `--shadow-md`, `--shadow-lg` | ✓ — identical |
| Container widths   | `--container-narrow` → `--container-full` | ✓ — identical |
| Motion             | `--ease-out`, `--t-fast/base/slow`     | ✓ — identical |
| Z-index            | `--z-base` → `--z-transition`          | ✓ — identical |

### Section pattern

The `section-head` grid (`section-num` / `section-eye` / `section-title`) is
identical to Fedelo's. The eyebrow tick (1px line before the eye label) uses
`--hot` — which, in YouMakeIt, is lime instead of orange.

### Italic rule

Inherited from Fedelo: **no italics anywhere**. `em` and `i` are neutralized in
`reset.css`. Where the markup uses `<em>`, the component CSS gives it
medium weight (500) and, when appropriate, the `--hot` color — emphasis comes
from structure, never slant.

---

## 2. What differs from Fedelo (the YouMakeIt deltas)

### 2.1 Brand accent — lime instead of orange

| Token         | Fedelo (orange) | YouMakeIt (lime) |
|---------------|-----------------|-------------------|
| `--hot`       | `#ff4a1c`       | **`#c6f432`**    |
| `--hot-rgb`   | `255, 74, 28`   | **`198, 244, 50`** |
| `--hot-deep`  | `#c83515`       | **`#94c919`**    |
| `--hot-soft`  | `#ffd9cc`       | **`#ebfaa8`**    |
| `--hot-ink`   | (implicit)      | **`#0a0a0a`** — readable on lime |
| `--led`       | `#4ade80` (green) | **`#c6f432`** — status LED shares the brand accent |

Same usage rules as Fedelo's orange:
- `::selection` background.
- Eyebrow tick (the 1px line before `.section-eye` and `.value-eye`).
- Brand mark dot (`.brand-mark .dot`).
- CTA pill glow in dark mode.
- Status LED.
- Editorial emphasis word (e.g. the lime "real?" in the end-CTA).

### 2.2 Dark mode is global on YouMakeIt

Fedelo is single-mode (light) with `.theme-dark` scoping the hero, the nav over
the hero, and the end-CTA card. YouMakeIt **ships a global toggle**
(`data-mode="dark"` on `<html>`) because the WebGL hero, the end-CTA card, and
the featured pricing tier all rely on full-page light/dark coordination.

Both options are supported in `variables.css`:
- `[data-mode="dark"]` — page-level (the YouMakeIt toggle).
- `.theme-dark` — scoped, identical to Fedelo. Available if a future section
  needs it.

### 2.3 YouMakeIt-only tokens

These exist because the page has a couple of components Fedelo doesn't have
(WebGL hero, marquee, proc-flow zigzag). They live alongside the shared tokens
in `css/variables.css`.

| Token              | Value                              | Purpose |
|--------------------|------------------------------------|---------|
| `--line-strong`    | `rgba(10,10,10,0.14)` / `rgba(245,245,242,0.20)` | Stronger hairline for proc-flow tracks and ghost-button borders. |
| `--shadow-deep`    | layered drop                       | End-CTA card surface elevation. |
| `--shadow-glow`    | `--hot-rgb` based                  | Card hover glow + dark-mode CTA glow. |
| `--ease`           | `cubic-bezier(.32,.72,0,1)`        | Slightly snappier than Fedelo's `--ease-out`; used by pill hover. |
| `--ease-soft`      | `cubic-bezier(.4,0,.2,1)`          | Status LED pulse. |
| `--shell-max`      | `var(--container-full)`            | Page shell width. |
| `--shell-pad`      | `clamp(20px, 4vw, 40px)`           | Page horizontal padding. |
| `--section-pad-y`  | `clamp(72px, 9vw, 128px)`          | Vertical breathing for sections. |
| `--card-pad`       | `clamp(20px, 2.4vw, 32px)`         | Service / process / pricing card padding. |

### 2.4 Components Fedelo doesn't have

| Component | File location | Notes |
|-----------|---------------|-------|
| `.hero-shader` (WebGL flow-field hero)        | `components.css` + `js/shader-bg.js` | Cursor-reactive shader, 4 moods, dark/light. |
| `.marquee` (trust strip)                      | `components.css` | Auto-scrolling stage names. |
| `.proc-flow` (zigzag timeline)                | `components.css` | 5-stage CSS-grid timeline. |
| `.ocard.featured` (pricing tier)              | `components.css` | Dark-on-light in light mode, lime-on-dark in dark mode. |
| `.end-cta-card` (cursor-reactive lime CTA)    | `components.css` + `js/shader-bg.js` | Same shader, "bloom" mood. |
| `.theme-toggle` + mobile menu                 | `components.css` + `js/app.js` | Page-wide dark/light switch. |

---

## 3. How to keep this in sync with Fedelo

When Fedelo's `variables.css` changes upstream:

1. Diff `fedelo.studio.website/css/variables.css` against
   `youmakeit/css/variables.css` (skip the `--hot*` lines and the
   YouMakeIt-only section at the bottom).
2. Mirror new tokens. Keep the YouMakeIt-only block at the end intact.
3. If Fedelo adds new utility classes you want here, copy them into
   `components.css` and verify they reference `--fg*` / `--hot` / etc. — not
   the legacy `--ink*` / `--accent*` names from the original YouMakeIt build.

---

## 4. Reference — variable name migration

The original YouMakeIt single-file build used a different vocabulary
(`--ink`, `--accent`, `--r-*`). The migrated codebase uses Fedelo's names so
both projects can be reasoned about together. The mapping:

| Original (legacy) | Now (Fedelo-aligned)          |
|-------------------|--------------------------------|
| `--ink`           | `--fg`                        |
| `--ink-soft`      | `--fg-dim`                    |
| `--ink-faint`     | `--fg-mute`                   |
| `--ink-ghost`     | `color-mix(in srgb, var(--fg) 22%, transparent)` |
| `--accent`        | `--hot`                       |
| `--accent-deep`   | `--hot-deep`                  |
| `--accent-soft`   | `--hot-soft`                  |
| `--accent-ink`    | `--hot-ink`                   |
| `--accent-rgb`    | `--hot-rgb`                   |
| `--mark`          | `var(--hot)` directly         |
| `--r-sm/md/lg/xl/pill` | `--radius-sm/md/lg/xl/pill` |
| `--shadow-rest`   | `--shadow-sm`                 |
| `--shadow-elev`   | `--shadow-md`                 |
| `--shadow-deep`   | `--shadow-deep` (kept)        |
| `--display`/`--body`/`--mono` | aliases of `--font-sans` / `--font-sans` / `--font-mono` (kept for compat) |

The legacy `--display`, `--body`, `--mono` aliases are kept in `variables.css`
so older snippets keep working. Fedelo follows the same alias convention.
