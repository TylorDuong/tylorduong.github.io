---
name: add-project
description: Add a new project to the portfolio from a short description, then wire it into the rest of the site — skills categories, a matching experience entry, impact metrics, and the résumé. Use when the user says they built/shipped something, asks to add a project, or pastes a blurb about work they want on the site.
---

# Add a project

Turn a one-or-two-sentence description into a complete `content/projects.json` record, then
update every other file that should know about it. Content is authored as JSON and *derived*
into display text by `src/data.js` — so everything below is a JSON edit, never a JSX edit.

## 1. Collect the record

Draft the record from what the user gave you and fill the rest yourself. **Ask only about
what you genuinely cannot infer** — usually just dates and links. Never interview the user
field by field.

| Field | How to set it |
|---|---|
| `id` | `slugify(title)` from `tools/content-schema.js`. Must be unique across `projects.json`. |
| `code` | Two letters, usually `initials(title)`. Must not collide with an existing `code`. |
| `kind` | `"personal"` or `"enterprise"` — enterprise means built inside a company/employer. |
| `accent` | Leave it `null` — step 2 picks it. |
| `title` | As the user says it. |
| `category` | Short uppercase pair, e.g. `"AI / EDTECH"`, `"IOT / AI"`, `"DATA / DASHBOARD"`. Reuse an existing one when it fits. |
| `start` / `end` | `"YYYY-MM"`. `end: null` means ongoing. **Ask if not stated** — dates drive site ordering. |
| `pin` | `null` unless the user wants it pinned to the top regardless of date. |
| `summary` | One line, ≤ ~60 chars, lands on the card. Lead with the outcome, not the stack. |
| `description` | 2–4 sentences, shown on the detail view. |
| `bullets` | 2–3 résumé-voice lines, each starting with a past-tense verb and carrying a number where one exists. |
| `image` | `"/projects/<id>.png"` if the user already has a screenshot there. Otherwise `null` — step 2 generates a placeholder. Never point at a file that isn't there. |
| `tech` | Concrete tools, matching existing spellings exactly (`Node.js`, not `Node`; `Next.js`, not `NextJS`). Check `content/skills.json` and other records before coining a new spelling. |
| `link` / `github` | Live URL and repo. Ask if unknown; fall back to the profile GitHub URL that other records use. |
| `resume` | `{ "include": false, "order": null }` by default — see step 5. |

Add the record anywhere in the array; `byRecency` in `src/lib/dates.js` sorts it at render time.

## 2. Fill in the visuals

```
node .claude/skills/add-project/scripts/scaffold-visuals.mjs --id <project-id>
```

Run this straight after writing the record. It fills the two fields you left `null` and
writes them back to `projects.json`:

- **`accent`** — the first unused `ACCENT_PRESETS` hex. When the presets run out (they did,
  at 11 projects) it derives a new one at the hue furthest from every accent already in use,
  matched to the palette's saturation and *perceived brightness* — matching HSL lightness
  alone puts an acid lime next to these earthy blues. It appends the derived hex to
  `ACCENT_PRESETS` too, so the admin colour picker offers it. That's the one edit this skill
  makes outside `content/`; mention it.
- **`image`** — a Deckplate-styled 1280x720 placeholder at `public/projects/<id>.png`: paper
  ground, diagonal hatch and spine in the project's accent, the project `code` in large
  stencil type, with the id and category as labels. It exists so the card has something to
  show; `ProjectCard`, `ProjectIndex` and `ProjectDetail` all interpolate `url(${proj.image})`
  unguarded, so a `null` image is a broken request, not a graceful fallback.

Both are fill-only — re-running won't touch an accent or image that's already set. Pass
`--force` to redo them (e.g. after the user dislikes the colour). When a real screenshot
arrives, drop it at `public/projects/<id>.png` and the placeholder is simply overwritten.

Tell the user the thumbnail is a placeholder and that a real screenshot replaces it by
overwriting that path — it says `NO IMAGE ON RECORD` on its face, but say it anyway.

## 3. Wire in the skills

Every `tech` token should either be a listed skill or be deliberately ignored — this is the
"automatically add skills" half of the job.

For each token on the **new** project that isn't already in `content/skills.json`:
- A real, transferable technology → append it to the best-fitting `categories[].items`.
  `guessCategory(token)` gives a starting suggestion; override it when it's obviously wrong
  (it defaults to `languages` for anything it can't place).
- A project descriptor, not a skill (`Hackathon`, `Research`, `Simulation`, `Problem Solving`)
  → append it to the `ignored` array instead.

Keep to tokens *this project introduced*. The repo has a pre-existing backlog of unfiled
tokens; sweeping it up is a separate task and turns a small diff into a large one.

A skill item may appear in only one category — `validate()` rejects duplicates across
categories, case-insensitively.

## 4. Relate it to the rest of the site

Work through these and act where the project actually warrants it. Say which ones you
changed and which you deliberately skipped.

- **`content/experiences.json`** — if the project was its own role (founded it, built it on
  the job, led a team), add or update the matching experience and set its `projectId` to the
  new project's `id`. That link is what ties a role to its project. A weekend side project
  usually doesn't need one.
- **`content/metrics.json`** — if the description carries a headline number (users reached,
  dollars saved), add a `peopleHelpedBreakdown` / `moneySavedBreakdown` entry with
  `projectId` pointing at the new project, and increase `peopleHelped` / `moneySaved` to
  match. Keep the "Other Projects (N)" row's count honest if you add a row above it.
- **`content/about.json`** — only when the project represents a genuinely new capability
  area. Add a `highlights` entry, or fold it into an existing one's `description`. Don't
  touch the paragraphs for a routine addition.
- **`content/testimonials.json`** — only if the user supplied a quote.

## 5. Résumé

`resume.include: true` puts the project on `/resume/`, and `resume.order` overrides its
position there. The résumé is short on purpose — most projects stay `include: false` and
only surface through the experience entry. Set `include: true` only if the user asks, or if
this clearly outranks something already on it (say so, and name what it would displace).

## 6. Verify

```
node .claude/skills/add-project/scripts/check-content.mjs
```

Runs the repo's own `validate()` over every content file, plus the cross-file checks it
can't do alone: duplicate codes and accents, images that point at missing files, dangling
`projectId` references, and tech tokens not yet filed as skills. Fix anything under `FAIL`.
Under `notes`, act on lines naming *your* new tokens and leave the pre-existing backlog be.

Then `npm run build` — it catches a malformed JSON file that still passes schema validation.
Offer `npm run dev` if the user wants to look at it before publishing; don't publish
(`npm run deploy`) unless they ask.

## Rules that will bite you

- **Never add `period`, `current`, `year`, `tags`, or `technologies` to the JSON.** `src/data.js`
  derives all of them from `start`/`end`/`tech`. Writing them by hand creates a second source
  of truth that silently goes stale.
- **Never run tech names through `slugify()`** — it mangles `C/C++` and `C#`. It's for ids only.
- **Don't hardcode content in JSX.** If the site can't display something the user wants, the
  fix is a component change plus a derivation in `src/data.js`, not prose in a component.
- The user can also do all of this by hand via `npm run admin`; the JSON you write is the
  same JSON that editor reads, so keep formatting (2-space indent) consistent.
