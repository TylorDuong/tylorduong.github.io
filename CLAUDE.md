# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| | |
|---|---|
| `npm run dev` | Dev server at http://localhost:5173 |
| `npm run admin` | Same server, opens the content editor at `/admin/` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | ESLint |
| `npm run deploy` | Build, then push `dist/` to the `gh-pages` branch (runs automatically as part of Publish, below) |

There is no test suite. Three pages are served: `/` (the site), `/resume/` (print-styled résumé), and `/admin/` (dev only, never built).

## Architecture

**Content flows one way: `content/*.json` → `src/data.js` → components.** All user-facing content (projects, experience, skills, testimonials, about copy, metrics, profile/contact) lives in `content/*.json`, never hardcoded in JSX. `src/data.js` is a thin adapter: it imports the raw JSON and derives every display value a component needs — `period`/`year` strings, `current` flags, the flat `skills` list, `allTech` (union used for admin autocomplete), `educationLine`. Components consume only what `src/data.js` exports. When changing content, edit the JSON (or use `npm run admin`); when changing how content is *presented*, edit `src/data.js`, not the JSON.

Records store `start`/`end` as `"YYYY-MM"` strings (`end: null` = ongoing) rather than pre-formatted text, specifically so `src/lib/dates.js` can derive both the display string and the sort order from one source of truth:
- `periodLabel`/`yearLabel` format the display string.
- `byRecency` orders entries: ongoing first, then most recent end date, then start date. A numeric `pin` (on projects/experiences) overrides this ordering for entries that must lead regardless of date (e.g. to match a fixed résumé order).

**The admin editor (`admin/`) is a separate local-only app that talks to the site's Vite dev server, not a route inside the shipped site.** It's a second React root (`admin/main.jsx` → `admin/App.jsx`) served at `/admin/`, backed by a dev-only Vite plugin (`tools/vite-plugin-admin.js`, `adminPlugin()`) that exposes a JSON API under `/__admin/api` for reading/writing `content/*.json`, uploading images to `public/{projects,avatars}/`, checking git status, and streaming a publish (`npm run deploy`) over SSE. `tools/content-schema.js` defines `ENTITIES` (the list of content files) and `validate()`, shared by both the admin UI and the API so a doc is checked before it's ever written.

Isolation between `admin/` and the shipped site is enforced four ways (verify with `npm run build && grep -ril "__admin" dist/`, which should print nothing):
1. `vite.config.js`'s `build.rollupOptions.input` lists only `index.html` and `resume/index.html` — `admin/index.html` is never crawled into the module graph.
2. `adminPlugin()` is `apply: 'serve'` — absent from any build.
3. ESLint (`eslint.config.js`) forbids `src/**` importing from `admin/` via `no-restricted-imports`.
4. `adminIsolationGuard()` (`apply: 'build'`, `enforce: 'pre'` — it must run before Vite's own resolver) fails the build if `src/` imports from `admin/` anyway.

The admin API additionally binds loopback-only, requires an `x-admin` header plus a localhost `Origin` on any state-changing request, uses optimistic concurrency (rejects a write if the file's mtime moved since it was loaded), writes atomically (temp file + rename, with the previous version copied to `content/.backups/`, last 20 kept), and rejects SVG uploads (script-capable).

**`/resume/` is a second Vite entry, not a client route** (`resume/index.html` → `src/resume/main.jsx` → `src/resume/Resume.jsx`), so GitHub Pages serves it as a real static path and it can be printed independently. It reads the same `src/data.js` exports as the main site. `resume.include` (per record) controls whether an experience/project appears; `resume.order` overrides ordering where set. If editing `src/resume/print.css`: size in `pt`/`in` (never `px`, so output doesn't depend on browser zoom), and prefer rules/type weight over filled backgrounds — Chrome's print dialog has "Background graphics" off by default.

**Publishing** (the admin's Publish tab, or `npm run deploy` directly) builds and pushes `dist/` to `gh-pages`, replacing that branch wholesale. `public/CNAME` is copied into `dist/` on every build — that's what keeps the custom domain (tylorduong.dev) attached after the branch is replaced. The admin's publish flow runs a pre-flight first (all content valid, on `main`, source tree clean) and can optionally commit + push source before deploying, since deploying with uncommitted source content means the next clean checkout loses it.

## Working in this repo

- Never add `period`, `current`, `year`, `tags`, `technologies`, or other derivable fields directly to `content/*.json` — they belong in `src/data.js`.
- `src/` must never import from `admin/`. The reverse (`admin/` importing shared bits from `src/`, e.g. `@/lib/theme`) is fine and already happens.
- Path aliases: `@` → `src/`, `@content` → `content/` (see `vite.config.js`).
- Do not set `base` in `vite.config.js` — the site is served from the domain root, and absolute `/assets/...` URLs are what let `/resume/` resolve its own chunks correctly.
