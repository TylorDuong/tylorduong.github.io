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

**The admin editor (`admin/`) is a second React root (`admin/main.jsx` → `admin/App.jsx`) served at `/admin/`, with two interchangeable backends chosen at build time in `admin/api.js` (`import.meta.env.PROD ? githubApi : localApi`).** Both implement the same surface (`loadAll`/`load`/`save`/`assets`/`upload`), so the UI and `admin/ImageDrop.jsx` don't care which is live:
- **Local dev** (`npm run admin`) → `localApi`, talking to a dev-only Vite plugin (`tools/vite-plugin-admin.js`, `adminPlugin()`) over `/__admin/api`: reads/writes `content/*.json`, uploads images to `public/{projects,avatars}/`, checks git status, and streams a publish (`npm run deploy`) over SSE. Loopback-only, requires an `x-admin` header + localhost `Origin`, optimistic concurrency on file mtime, atomic writes with rolling backups in `content/.backups/` (last 20), rejects SVG.
- **Deployed `/admin/`** → `githubApi` (`admin/github-api.js`): the shipped site is static GitHub Pages with no server, so it commits `content/*.json` (and image uploads) straight to `main` via the GitHub Contents API. Gated by a GitHub token (`admin/auth.js`, `admin/Login.jsx`) that is the real credential — entered once, stored only in the browser's localStorage, never in the bundle. Optimistic concurrency rides on the git blob SHA (threaded through the UI's `mtimeMs` field). Each save is a commit, which triggers the deploy workflow — so on the deployed editor **Save is Publish** (`admin/DeployedPublish.jsx` replaces the local `Publish` tab).

`tools/content-schema.js` defines `ENTITIES` and `validate()`, shared by the UI and both backends so a doc is checked before it's written. `/admin/` is `noindex` and linked from nowhere — reachable only by typing the path.

Isolation is narrower than before (the admin now ships), and is about keeping admin code out of the *site*, not out of the build (verify with `npm run build && grep -ril "__admin" dist/`, which should still print nothing — the `localApi` branch and its `/__admin/api` string tree-shake out of the production bundle because `import.meta.env.PROD` is a constant):
1. `adminPlugin()` is `apply: 'serve'` — the file-writing/deploy backend is absent from any build.
2. ESLint (`eslint.config.js`) forbids `src/**` importing from `admin/` via `no-restricted-imports`.
3. `adminIsolationGuard()` (`apply: 'build'`, `enforce: 'pre'` — it must run before Vite's own resolver) fails the build if `src/` imports from `admin/` anyway.
(`admin/index.html` is now a third `build.rollupOptions.input` entry in `vite.config.js`, so it *is* crawled into the module graph — deliberately.)

**`/resume/` is a second Vite entry, not a client route** (`resume/index.html` → `src/resume/main.jsx` → `src/resume/Resume.jsx`), so GitHub Pages serves it as a real static path and it can be printed independently. It reads the same `src/data.js` exports as the main site. `resume.include` (per record) controls whether an experience/project appears; `resume.order` overrides ordering where set. If editing `src/resume/print.css`: size in `pt`/`in` (never `px`, so output doesn't depend on browser zoom), and prefer rules/type weight over filled backgrounds — Chrome's print dialog has "Background graphics" off by default.

**Publishing** happens three equivalent ways, all ending in `dist/` pushed to `gh-pages` (replacing it wholesale): the local admin's Publish tab, `npm run deploy` directly, or the **GitHub Actions workflow** (`.github/workflows/deploy.yml`) that rebuilds and deploys on every push to `main`. That workflow is what makes the deployed editor work end-to-end: `githubApi` commits content to `main`, the push fires the workflow, the site redeploys in ~1–2 min. `public/CNAME` is copied into `dist/` on every build — that's what keeps the custom domain (tylorduong.dev) attached after the branch is replaced. The local admin's publish flow additionally runs a pre-flight (all content valid, on `main`, source tree clean) and can commit + push source before deploying, since deploying with uncommitted source content means the next clean checkout loses it. GitHub Pages must stay configured to serve from the `gh-pages` branch.

## Working in this repo

- Never add `period`, `current`, `year`, `tags`, `technologies`, or other derivable fields directly to `content/*.json` — they belong in `src/data.js`.
- `src/` must never import from `admin/`. The reverse (`admin/` importing shared bits from `src/`, e.g. `@/lib/theme`) is fine and already happens.
- Path aliases: `@` → `src/`, `@content` → `content/` (see `vite.config.js`).
- Do not set `base` in `vite.config.js` — the site is served from the domain root, and absolute `/assets/...` URLs are what let `/resume/` resolve its own chunks correctly.
