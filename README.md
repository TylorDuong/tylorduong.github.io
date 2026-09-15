# tylorduong.dev

Personal portfolio — React 19 + Vite + inline-style design tokens, deployed to
GitHub Pages on a custom domain.

The site, the résumé page, and the local content editor are all driven by the
same JSON files in `content/`. Adding a project once puts it on the home page
timeline, in the skills matrix, and on the résumé.

## Commands

| | |
|---|---|
| `npm run dev` | Dev server at http://localhost:5173 |
| `npm run admin` | Same server, opens the content editor at `/admin/` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | ESLint |
| `npm run deploy` | Build, then push `dist/` to the `gh-pages` branch |

Three pages are served: `/` (the site), `/resume/` (print-styled résumé), and
`/admin/` (**dev only** — never built, see *Isolation* below).

## Content

All content lives in `content/*.json`. Nothing user-facing is hardcoded in
components; `src/data.js` is a thin adapter that reads the JSON and derives
every display value.

| File | Holds |
|---|---|
| `projects.json` | Projects, personal and enterprise |
| `experiences.json` | Jobs, hackathons, competitions |
| `skills.json` | Skills grouped into the résumé's categories |
| `testimonials.json` | Quote carousel |
| `about.json` | About paragraphs, pull quote, highlight cards |
| `metrics.json` | Hero counters and their breakdowns (a breakdown row's optional `projectId` makes it link to that project) |
| `profile.json` | Name, contact details, education, résumé summary |

### Dates are structured, display strings are derived

Records store `start` and `end` as `"YYYY-MM"`, with `end: null` meaning
ongoing. Everything human-facing comes out of `src/lib/dates.js`:

- `"2026-04"` + `null` → `APR 2026 — PRESENT`, and `current: true`
- `"2025-09"` + `"2025-09"` → `SEP 2025` (single value, not a range)
- project `year` on a card is derived the same way

This is what makes placement automatic: `byRecency` orders ongoing entries
first, then by most recent end date, then start date. A new entry lands in the
right slot with no manual reordering.

`pin` (a number, or `null`) overrides that ordering when you want a specific
entry to lead regardless of dates — ShelfSmart and Yber use it so the site
matches the résumé's order.

### Derived vs stored

Don't add these to the JSON; the adapter computes them:

`period`, `current`, `year`, `tags` (alias of `tech`), `technologies` (alias of
`tech`), the `"Company — Unit"` string, `educationLine`, the flat `skills`
list, and `allTech`.

## The admin editor

`npm run admin` opens an editor for every content file. It writes JSON and
uploads images; it does not deploy.

Worth knowing:

- **Dates** use a native month picker and emit `"YYYY-MM"` directly. The
  "Ongoing" checkbox sets `end: null`.
- **Skills used** autocompletes over everything already in the content set. A
  token it doesn't recognise is chipped `NEW` and collected into a banner at
  the top, which offers a guessed category. Filing it there is what adds a
  skill to the site's capability matrix and the résumé's skills line.
  Tech tags that aren't really skills (`Hackathon`, `Research`) can be
  dismissed with **ignore**, which records them in `skills.json`'s `ignored`
  list so they stop being suggested.
- **Placement** shows a live "position N of M" with neighbouring entries,
  computed with the same comparator the site uses, plus whether the entry
  clears the home page's top-six cut.
- **Metrics breakdown rows** can carry an optional project id. Set one and
  that row becomes a link on the live Hero: clicking it jumps straight to the
  matching project's detail screen. Leave it blank for a plain, non-clickable
  line (e.g. an aggregate like "Other Projects (9)" with no single project to
  point at).
- **Ids** track the title until a record is first saved, then freeze — they are
  React keys and cross-references, not display text.

Saving writes `content/*.json` and nothing else. Backups of the previous
version go to `content/.backups/` (gitignored, last 20 kept).

### Publishing

The **Publish** tab is separate from saving, and runs a pre-flight first: all
edits saved, all files valid, on `main`, and source committed. If the tree is
dirty it offers to commit and push before deploying — skipping that publishes
content that exists only on your machine, which the next clean build would
lose.

Publishing runs `npm run deploy` (build + push to `gh-pages`) and streams the
log. `public/CNAME` is copied into `dist/` on every build, which is what keeps
the custom domain attached when the branch is replaced.

## The résumé page

`/resume/` renders from the same content, and prints to PDF with Ctrl+P
(Letter, 0.5in margins, selectable text, no dependencies).

It is a second Vite entry (`resume/index.html`), not a client route, so
GitHub Pages serves it as a real static path. In dev, a badge reports how far
the content is from fitting a page.

Two constraints if you edit `src/resume/print.css`:

- Size in `pt`/`in`, never `px`, so output doesn't depend on browser zoom.
- Use rules and type weight rather than filled backgrounds. Chrome's print
  dialog has *Background graphics* **off** by default, so a fill-heavy design
  prints looking empty. Test with it off.

Which entries appear is controlled per record by `resume.include`, and ordered
by `resume.order` where set. `experiences` with `kind: "work"` go under
EXPERIENCE; hackathons and competitions go under ACTIVITIES & AWARDS.

## Isolation

`admin/` must never ship. Four independent guards:

1. `build.rollupOptions.input` lists only `index.html` and `resume/index.html`,
   so `admin/index.html` is never crawled into the module graph.
2. The admin API plugin is `apply: 'serve'` — absent from any build.
3. ESLint forbids `src/**` importing from `admin/`.
4. A build-time `resolveId` guard fails the build if that ever happens anyway.

To confirm: `npm run build && grep -ril "__admin" dist/` should print nothing.

The admin API additionally binds loopback-only, requires an `x-admin` header
and a localhost `Origin`, validates every document before writing, writes
atomically, and rejects SVG uploads.

## Layout

```
content/          JSON content — the source of truth
src/data.js       adapter: reads content/, derives display values
src/lib/dates.js  period formatting and the ordering comparator
src/lib/theme.js  design tokens (colours, fonts, the corner-cut clip path)
src/sections/     home page sections
src/screens/      project index and project detail
src/resume/       résumé page and its print stylesheet
admin/            local content editor (dev only)
tools/            admin API plugin + shared content schema
```
