# Future Plans

Twelve planned phases, **ordered easiest → hardest**. Each carries a difficulty rating and a rough effort estimate so you can pick off a Saturday's worth of work without reading the whole file.

Difficulty is judged on *this* codebase — how many files a phase touches, whether it needs new infrastructure (network calls, secrets, algorithms), and how likely it is to break something already working. It is not a measure of how valuable the phase is.

| # | Phase | Difficulty | Effort | Depends on |
|---|---|---|---|---|
| 1 | [Move Tools section under Projects](#phase-1--move-the-tools-section-under-projects) | ★☆☆☆☆ | ~1h | — |
| 2 | [Reorder admin tabs to match page order](#phase-2--order-admin-tabs-to-match-the-page) | ★☆☆☆☆ | ~15m | 1 |
| 3 | [Hero profile photo in the admin](#phase-3--change-the-hero-profile-photo-from-the-admin) | ★☆☆☆☆ | ~1h | — |
| 4 | [Auto accent colour from thumbnail](#phase-4--auto-accent-colour-from-the-project-thumbnail) | ★★☆☆☆ | ~2h | — |
| 5 | [Video demos per project](#phase-5--video-demos-per-project) | ★★☆☆☆ | ~2h | — |
| 6 | [Visitor + click analytics](#phase-6--visitor-and-click-analytics-goatcounter) | ★★☆☆☆ | ~2h | — |
| 7 | [Featured project block](#phase-7--featured-project-block) | ★★☆☆☆ | ~3h | 5 |
| 8 | [Skill → projects & roles dropdown](#phase-8--smart-project-sorting-by-skill) | ★★★☆☆ | ~4h | 1 |
| 9 | [Theme config in the admin](#phase-9--theme-config-in-the-admin) | ★★★★☆ | ~1 day | — |
| 10 | [Nested experience timeline](#phase-10--nested-experience-timeline) | ★★★★☆ | ~1–2 days | — |
| 11 | [Generate a project from a GitHub repo (AI)](#phase-11--generate-a-project-from-a-github-repo) | ★★★★☆ | ~2 days | — |
| 12 | [Placeholder thumbnail generator](#phase-12--placeholder-project-thumbnail-generator) | ★★☆☆☆ → ★★★★★ | ~4h / +2 days | 4 |

---

## Decisions already made

These were settled up front so the phases below read as plans, not open questions:

| Decision | Choice |
|---|---|
| Timeline root (Phase 10) | ASU becomes a **real experience record** with a new `"education"` kind, `resume.include: false` |
| Theme scope (Phase 9) | **Build-time `content/theme.json` + curated font pairings.** Inline styles stay; no runtime CSS-variable refactor. Résumé keeps its fixed print palette |
| Analytics (Phase 6) | **GoatCounter** — free, cookieless, open source, supports custom events |
| Featured config (Phase 7) | A **`featured` block inside `content/profile.json`**, not a new entity |
| Skill dropdown (Phase 8) | Lists **both projects and experiences**, visually distinguished |
| Video hosting (Phase 5) | **YouTube/Vimeo embeds only** — nothing self-hosted, no upload path |
| AI generation (Phase 11) | No API key yet — the phase includes a prerequisites section |
| Thumbnails (Phase 12) | **Procedural first**, AI imagery kept as a sketched optional follow-up |

---

## Rules that apply to every phase

These come from `CLAUDE.md` and are worth restating because most of these phases add content fields:

1. **Content flows one way: `content/*.json` → `src/data.js` → components.** New user-editable content goes in a JSON file. Anything *derived* from it (labels, sort keys, indexes, counts) goes in `src/data.js`, never in the JSON.
2. **Every new content field needs a `validate()` case** in `tools/content-schema.js`. The admin UI and the dev-server API both call it, so one edit covers both. An invalid JSON file breaks the dev server *and* the production build — validation is the guardrail.
3. **`src/` must never import from `admin/`.** ESLint and `adminIsolationGuard()` both enforce it. The reverse is fine and already happens (`admin/` imports `@/lib/theme`), which Phases 5 and 9 both rely on. After any phase touching both sides, run `npm run build && grep -ril "__admin" dist/` — it must print nothing.
4. **New API routes are dev-only.** They go inside `adminPlugin()` in `tools/vite-plugin-admin.js`, which is `apply: 'serve'`. They inherit the loopback check, the `x-admin` header requirement, and the localhost `Origin` check for free.
5. **Never set `base` in `vite.config.js`.** `/resume/` depends on absolute `/assets/...` URLs.
6. New fields on existing records also need adding to the `blank*()` factories in `admin/App.jsx` (lines 23–36), or new records will be missing them.
7. Only one phase adds an entity: Phase 9's `theme`. Everything else extends existing files.

---

## Phase 1 — Move the Tools section under Projects

**Difficulty ★☆☆☆☆ · ~1 hour**

The "Tools — Capability Matrix" currently lives at the bottom of `src/sections/Hero.jsx` (lines 359–416), rendered as part of the hero. It should be its own section, placed after Projects.

### Steps

1. Cut lines 359–416 of `Hero.jsx` (the `CAPABILITY MATRIX` block) plus its helpers — `SKILL_GRID`, `CATEGORY_COLORS`, `withAlpha`, `chipStyle` — into a new `src/sections/Tools.jsx` exporting `function Tools({ innerRef })`.
2. `Hero.jsx` drops the `skillGroups` import. The `Linescape` divider stays in the hero — it's the hero's closing rule, not the section's opener.
3. In `src/App.jsx`, render `<Tools innerRef={setSectionEl("tools")} />` immediately after `<Projects />`.
4. Give it the same section header treatment as the others (`Mark` + `SEC.0n` eyebrow + `sectionH2` title) so it stops looking like a hero appendix. Renumber the `SEC.0n` labels in About / Projects / Experience / Testimonials / Contact accordingly.
5. Make it a nav target: add `["tools", "Tools"]` to `LINKS` in `src/layout/Navbar.jsx` and `"tools"` to `SECTION_ORDER` in `src/App.jsx` (line 18), positioned between `"projects"` and `"experience"`. It's a full section now, so it should behave like one.

### Watch out

- `SECTION_ORDER` **must** be in top-to-bottom document order or the scroll-spy picks the wrong active link — it iterates the array and takes the last section whose top is above the probe line.
- `withAlpha` and `chipStyle` are conceptually shared with `Experience.jsx`'s chip style (currently duplicated inline). Good moment to move both into `src/lib/theme.js` — Phases 8 and 9 both want them there.

### Done when

The skills matrix renders below Projects, the nav highlights correctly while scrolling through it, and the résumé is untouched.

---

## Phase 2 — Order admin tabs to match the page

**Difficulty ★☆☆☆☆ · ~15 minutes**

`TABS` in `admin/App.jsx` (line 12) is currently ordered by entity, not by where the content appears on the site. Reorder it so scanning the tab bar left-to-right walks the page top-to-bottom.

### The order (after Phase 1)

| Tab | Where it appears on the page |
|---|---|
| Profile | Hero — name, lead, photo, contact readout, featured block |
| Metrics | Hero — impact ticker |
| About | SEC.01 |
| Projects | SEC.02 |
| Skills | SEC.03 (Tools) |
| Experience | SEC.04 |
| Testimonials | SEC.05 |
| Publish | (not a section — stays last) |

```js
const TABS = [
  ["profile", "Profile"],
  ["metrics", "Metrics"],
  ["about", "About"],
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["experiences", "Experience"],
  ["testimonials", "Testimonials"],
  ["publish", "Publish"],
];
```

Once Phase 9 lands, `["theme", "Theme"]` goes first — it governs the whole page.

### Watch out

- `TABS` order is **display only** — `ENTITIES` in `tools/content-schema.js` drives save/validate iteration and does not need to change.
- The default tab is `useState("projects")` (line 39). Reordering doesn't change it, and it shouldn't — Projects is the most-edited pane, and landing on Profile every load would be a downgrade.
- Do this *after* Phase 1, since Phase 1 decides where Skills sits.

---

## Phase 3 — Change the hero profile photo from the admin

**Difficulty ★☆☆☆☆ · ~1 hour**

`src/sections/Hero.jsx:273` hardcodes `<img src="/profile-photo.png" alt="Tylor Duong">`. Make it content.

### Data

`content/profile.json` gains one field:

```json
"photo": "/profile-photo.png"
```

`validate()` case `"profile"` in `tools/content-schema.js`:

```js
if (doc?.photo && !String(doc.photo).startsWith("/")) {
  out.push(err("photo", "photo must be a site-root path starting with /"));
}
```

Not required — the existing path stays valid as the default.

### Steps

1. Add `"profile"` to `UPLOAD_DIRS` in `tools/vite-plugin-admin.js` (line 29): `["profile", "public/profile"]`. Both `/assets` (GET) and `/upload` (POST) read that map, so listing and uploading both work with no other server change.
2. In `admin/App.jsx`'s `ProfilePane`, add an `ImageDrop` under the Name field:
   ```jsx
   <Field label="Hero photo" hint="Shown in the hero at a 4:5 crop.">
     <ImageDrop value={doc.photo} onChange={(v) => setDoc({ ...doc, photo: v })}
       kind="profile" suggestedName="profile-photo" />
   </Field>
   ```
   `ImageDrop` is already imported by `admin/forms.jsx`; either move the import or lift `ProfilePane` into `forms.jsx` alongside the other forms.
3. `src/data.js` — nothing new to derive; `profile` is already exported wholesale.
4. `Hero.jsx` reads `src={profile.photo}` and `alt={profile.name}`.

### Watch out

- Uploads are png/jpeg/webp only (SVG is deliberately rejected as script-capable). Fine here.
- The hero image is `aspectRatio: "4/5"` with `objectFit: cover` — hence the crop hint on the field label, so the constraint is visible where the decision gets made.
- The old `/profile-photo.png` stays in `public/` as the default value; don't delete it.

---

## Phase 4 — Auto accent colour from the project thumbnail

**Difficulty ★★☆☆☆ · ~2 hours**

Each project has a hand-picked `accent` hex from `ACCENT_PRESETS`. Add an "Auto" toggle that derives the accent from the uploaded thumbnail.

### Key design decision: extract in the admin, store a plain hex

Do **not** compute the colour at render time. Run the extraction in the browser inside the admin, write the resolved hex into `content/projects.json`, and let the site keep reading a plain `accent` string. That means:

- The shipped site gains zero runtime cost and zero new code.
- `HEX_RE` validation in `tools/content-schema.js` keeps working unchanged.
- The résumé, which also reads `accent`, keeps working.

### Data

```json
"accent": "#16b364",
"accentAuto": true
```

`accentAuto` is a hint for the admin ("recompute when the image changes"), not something the site reads. Add a permissive validation line: boolean if present.

### The extraction

New file `admin/lib/accent.js`:

1. Load the image into an `Image` (same origin — the dev server serves `/projects/*.png`, so no CORS problem).
2. Draw it to a 32×32 offscreen canvas, `getImageData`.
3. Convert each pixel to HSL. Discard pixels with `l < 0.12`, `l > 0.9`, or `s < 0.2` — near-black, near-white, and grey never make good accents.
4. Bucket the survivors by hue (24 buckets of 15°) and pick the most populous.
5. Take that bucket's median hue and saturation, then **clamp lightness to the deckplate palette's depth** — `C.rust` (`#a8571c`) sits around L 38%, and the category colours in `Hero.jsx` were tuned to the same tonal depth. Clamp to `L ∈ [0.30, 0.45]`, `S ∈ [0.35, 0.75]`. Without this clamp you get muddy or neon accents that fight the paper/ink system.
6. Return `#rrggbb`.

### Admin wiring

In `admin/forms.jsx`'s `ProjectForm`, next to the `Swatches` row:

- A checkbox "Auto from thumbnail", disabled when `rec.image` is empty.
- When checked, or when `rec.image` changes while checked, run the extractor and `patch({ accent: hex })`.
- Keep the swatch row visible and live — clicking a preset unchecks Auto. Never take the manual control away.
- Show the derived hex next to the checkbox so it's obvious what got picked.

### Watch out

- The canvas read must be in an effect, not during render.
- A project with no image must not silently keep a stale auto colour — disable the toggle and fall back to the preset.
- Extraction is fast (32×32) but run it on image change only, not every keystroke.

---

## Phase 5 — Video demos per project

**Difficulty ★★☆☆☆ · ~2 hours**

Embedded demo video on each project's detail page. **YouTube/Vimeo only — nothing self-hosted.**

That decision removes this phase's entire server-side half: no new `UPLOAD_DIRS` entry, no video MIME allowlist, no raising `MAX_UPLOAD` past 8 MB, no `/assets` filter change. `tools/vite-plugin-admin.js` is untouched. It also keeps `public/` small, which matters because `gh-pages` is replaced wholesale on every deploy and every byte in `public/` is re-pushed each time.

### Data

On each project record:

```json
"video": {
  "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "poster": "/projects/yber.png",
  "caption": "Agentic grading pipeline, end to end"
}
```

`video` is optional, `null` when absent. Validation in `tools/content-schema.js`:

```js
if (p.video != null) {
  if (!/^https:\/\//.test(p.video.url || "")) {
    out.push(err(`${at}.video.url`, "video.url must be an https:// YouTube or Vimeo link"));
  }
  if (p.video.poster && !String(p.video.poster).startsWith("/")) {
    out.push(err(`${at}.video.poster`, "video.poster must be a site-root path starting with /"));
  }
}
```

Keep the schema check to a plain https test. Provider parsing lives in `src/lib/video.js` — `content-schema.js` is imported by the Node plugin *without* Vite's `@` alias resolution, so it can't import from `src/`.

Add `video: null` to `blankProject()` in `admin/App.jsx`.

### `src/lib/video.js`

One shared parser, used by the site to render and by the admin to preview. `admin/` importing from `src/` is the allowed direction.

```js
const YT = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/;

export function parseVideo(url) {
  const yt = YT.exec(url || "");
  if (yt) return { provider: "youtube", id: yt[1] };
  const vm = VIMEO.exec(url || "");
  if (vm) return { provider: "vimeo", id: vm[1] };
  return null;
}

export function embedUrl({ provider, id }, { autoplay = false } = {}) {
  if (provider === "youtube") {
    const p = new URLSearchParams({
      rel: "0", modestbranding: "1", playsinline: "1",
      ...(autoplay && { autoplay: "1", mute: "1", loop: "1", playlist: id, controls: "0" }),
    });
    return `https://www.youtube-nocookie.com/embed/${id}?${p}`;
  }
  const p = new URLSearchParams(
    autoplay ? { autoplay: "1", muted: "1", loop: "1", background: "1" } : {}
  );
  return `https://player.vimeo.com/video/${id}?${p}`;
}
```

Two non-obvious details baked in above:

- **YouTube's `loop=1` does nothing on its own** for a single video — it also needs `playlist=<same ID>`. This trips everyone once.
- **`youtube-nocookie.com`** is the privacy-enhanced domain. Same player, no tracking cookie until playback starts. Use it as the default.

### `src/components/VideoEmbed.jsx` — the facade

Do not mount the iframe on page load. A YouTube embed pulls roughly a megabyte of player JS and starts phoning home before anyone clicks anything, which is both slow and at odds with a site that otherwise ships almost nothing.

Instead: render the poster image with a deckplate play button over it, and swap in the `<iframe>` only on click.

```jsx
export function VideoEmbed({ url, poster, caption }) {
  const [live, setLive] = useState(false);
  const video = parseVideo(url);
  if (!video) return null;
  // poster + play button until `live`, then the iframe
}
```

Iframe attributes when it does mount: `allow="autoplay; fullscreen; picture-in-picture"`, `allowFullScreen`, `loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"`, and a real `title` for screen readers.

Wrap the whole thing in the same 6px ink border the hero photo uses so it reads as part of the system.

### Admin

In `ProjectForm`: a URL text field, an `ImageDrop` for the poster (images already upload fine — this is the one asset that stays local), and a caption input. Live-validate the URL with `parseVideo()` and show the detected provider + ID inline, so a bad paste is obvious immediately rather than at save time.

### Watch out

- If `poster` is empty, fall back to the project's existing `image`. Only fall back to YouTube's `img.youtube.com/vi/<id>/maxresdefault.jpg` as a last resort — it's a remote request on page load, and `maxresdefault` 404s for videos never uploaded at 1080p.
- Vimeo's `background=1` gives a chrome-free player. If you ever want a genuinely clean autoplaying loop, Vimeo beats YouTube for it — relevant to Phase 7.

---

## Phase 6 — Visitor and click analytics (GoatCounter)

**Difficulty ★★☆☆☆ · ~2 hours**

### What you'll get, and what you won't

GoatCounter is cookieless and stores no personal data, so there's no consent banner and no identity-level reporting. You'll see **how many** visits, where they came from, and **what got clicked** — not who. That's the actionable signal anyway: knowing the Yber card gets opened three times more than anything else changes what you build next.

Free for personal use on `goatcounter.com`; self-hostable if you ever want the data on your own box. Read their privacy page before shipping so you can answer for what it collects.

### Steps

1. Create a site at `goatcounter.com` and add the script to `index.html` **and** `resume/index.html`:
   ```html
   <script data-goatcounter="https://YOURCODE.goatcounter.com/count"
           async src="//gc.zgo.at/count.js"></script>
   ```
   **Do not add it to `admin/index.html`.** Your own editing sessions must not pollute the data — and `admin/index.html` isn't in `build.rollupOptions.input` anyway, so it never ships, but leave it clean regardless.

2. Add `src/lib/track.js`:
   ```js
   // GoatCounter models events as paths with `event: true` — there is no
   // name+properties shape, so encode the detail into the path string.
   export function track(path, title) {
     if (import.meta.env.DEV) return;
     window.goatcounter?.count?.({ path, title, event: true });
   }
   ```
   The `DEV` guard keeps local work out of the numbers; the optional chaining keeps a blocked script from throwing.

3. Instrument the interactions that actually matter:

   | Call | Where |
   |---|---|
   | `track("project-open/" + id)` | `openProject` in `src/App.jsx:155` — one call covers every entry point |
   | `track("project-index-open")` | the `goIndex` handler |
   | `track("resume-download")` | hero Résumé link + footer link |
   | `track("contact/email" \| "phone" \| "github" \| "linkedin")` | `Contact.jsx` / `Footer.jsx` |
   | `track("skill-filter/" + skill)` | Phase 8 |
   | `track("featured-cta")` | Phase 7 |
   | `track("metric-expand/people" \| "saved")` | the two count-up cards |

4. Scroll depth, if you want it, is one `IntersectionObserver` over the section elements already collected in `sectionEls` (`src/App.jsx:32`). Fire once per section per session.

### Watch out

- **This is an SPA.** Project detail views are screen state, not routes, so GoatCounter's automatic pageview counting sees exactly one pageview per visit. All the depth comes from the custom events above — don't skip step 3 and wonder why the dashboard is thin.
- Event paths are a schema. Pick the names once; renaming later orphans the history.
- Skill names in paths: `C++` and `C#` both mangle badly in a URL path. Lowercase the raw label and accept it, or keep a tiny display-name map — just don't route them through `slugify()` from `content-schema.js`, which the file itself warns against for tech names (line 29).

---

## Phase 7 — Featured project block

**Difficulty ★★☆☆☆ · ~3 hours · depends on Phase 5**

A large showcase block directly under the hero: autoplaying video, a longer description, and a "Try it" link.

### Data

A `featured` block in `content/profile.json` — it's hero-adjacent, and a whole new entity would mean touching `ENTITIES`, the API, and the admin shell for one object:

```json
"featured": {
  "projectId": "yber",
  "headline": "Currently building",
  "blurb": "Longer prose than the project card carries — two or three sentences.",
  "video": { "url": "https://vimeo.com/123456789", "poster": "/projects/yber.png" },
  "ctaLabel": "Try Yber",
  "ctaUrl": "https://yber.ai"
}
```

`validate()` is per-entity and can't see `projects.json` from the `profile` case, so a dangling `projectId` can't be caught there. Handle it by failing soft in `src/data.js`:

```js
export const featured = (() => {
  const f = profileRaw.featured;
  if (!f?.projectId) return null;
  const project = projects.find((p) => p.id === f.projectId);
  return project ? { ...f, project } : null;
})();
```

A bad id then renders nothing instead of crashing the build. Add a soft warning in the admin (where both docs are loaded) so you notice.

### Admin

A "Featured" fieldset in `ProfilePane`: a `<select>` of projects — `ctx.projectOptions` in `admin/App.jsx:183` already builds `[id, title]` pairs for exactly this — plus text inputs for headline/blurb/CTA and the same video URL + poster fields as Phase 5.

The Profile tab is getting long. Give it collapsible `<details>` groups (Identity / Contact / Education / Featured) rather than one endless column.

### Rendering

New `src/sections/Featured.jsx`, rendered in `src/App.jsx` between `<Hero />` and `<About />`, returning `null` when `featured` is null.

Autoplay, embed-only — three rules, all required:

1. **Don't mount the iframe until it scrolls into view.** Reuse `useOnceInView` from `src/lib/util.js` (already used for the metrics count-up). Otherwise every homepage visit loads the player.
2. **Muted is mandatory.** No browser autoplays with sound. `embedUrl(video, { autoplay: true })` from Phase 5 already sets `mute`/`muted`, `loop`, `playsinline`, and `controls=0`.
3. **Respect `prefers-reduced-motion: reduce`** — show the poster with a play button and never autoplay. Not optional; this query exists for precisely this.

One honest note on the embed decision: an autoplaying hero showcase is the single place where a self-hosted silent mp4 would look meaningfully cleaner than a third-party player. If YouTube's chrome bothers you here, **Vimeo's `background=1`** (already wired into `embedUrl`) is chrome-free and gets you most of the way. And if you ever change your mind, `VideoEmbed` can grow a `src.startsWith("/")` branch without disturbing anything else.

---

## Phase 8 — Smart project sorting by skill

**Difficulty ★★★☆☆ · ~4 hours · depends on Phase 1**

Three related features, all driven by one derived index:

1. Clicking a skill chip expands a dropdown of the **projects and roles** that used it.
2. Skills are ordered most-used first within their category.
3. Tech tags typed on projects/experiences flow into the skills list.

**#3 already half exists.** `admin/App.jsx` lines 83–108 compute `pendingSkills` — every tech token not yet filed into a skills category and not on the ignore list — and surface them in the collapsible `NewSkills` banner with a `guessCategory()` suggestion. The remaining work is a "File all with suggested categories" button, not a new system. Keep the review step: tags like `Hackathon` or `Research` are project descriptors, not résumé skills, which is exactly why the ignore list exists.

### Data (derived — `src/data.js`)

One index covering both record types:

```js
// lowercased token -> { label, projects: [...], experiences: [...], count }
export const techIndex = (() => {
  const idx = new Map();
  const add = (bucket, token, rec) => {
    const k = token.toLowerCase();
    if (!idx.has(k)) idx.set(k, { label: token, projects: [], experiences: [], count: 0 });
    const e = idx.get(k);
    e[bucket].push(rec);
    e.count += 1;
  };
  for (const p of projects) for (const t of p.tech) add("projects", t, p);
  for (const x of experiences) for (const t of x.tech) add("experiences", t, x);
  return idx;
})();

// skillGroups, items sorted by total usage desc then alphabetically
export const skillGroupsRanked = skillGroups.map((g) => ({
  ...g,
  items: g.items
    .map((label) => ({
      label,
      ...(techIndex.get(label.toLowerCase()) ?? { projects: [], experiences: [], count: 0 }),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
}));
```

No `content/*.json` changes. Pure derivation, which is what `src/data.js` is for.

### UI

In `Tools.jsx` (from Phase 1):

- Each chip becomes a `<button>` with `aria-expanded`, `aria-controls`, and a count badge when `count > 0`. Zero-count skills stay rendered but non-interactive — a listed skill with no shipped project is still true.
- Clicking opens a panel **below that group's row**, not a floating popover. A floating layer would fight the `boxShadow: inset` left rule that gives each row its category colour.
- The panel has **two labelled subsections**, and they need to look different or the list reads as a jumble:
  - **Projects** — accent-coloured left rule, two-letter `code`, title, year. Click → `openProject(id)`.
  - **Roles** — no accent (experiences have no `accent` field), mono `period` label, role, company. Click → jump to Experience.
- One panel open at a time. Escape closes. Clicking the same chip toggles.

### Threading the click handlers

`openProject` already exists in `src/App.jsx:155` and is already passed to `Hero`; pass it to `Tools` the same way.

Jumping to a role needs new plumbing: a `goToExperience(id)` that calls the existing `performScroll("experience")` and sets a transient highlight id, passed down to `Experience.jsx` so the matching row can flash its background for ~1.5s. If that highlight turns fiddly, ship the roles as **non-clickable** first — the information is the point, the navigation is a bonus.

### Watch out

- **Matching is case-insensitive but not fuzzy.** `Node.js` and `Node` are different keys. If that bites, add an `aliases` map to `content/skills.json` (`{ "node": ["node.js", "nodejs"] }`) and fold it into the index — but only when you actually hit the problem.
- Never run tech names through `slugify()` — `tools/content-schema.js:29` warns about exactly this (`C/C++`, `C#`).
- Ranking by raw count means a tag used on two tiny projects outranks one used on your flagship. If that reads wrong, weight by whether the record is `pin`ned or `resume.include`.

---

## Phase 9 — Theme config in the admin

**Difficulty ★★★★☆ · ~1 day**

Make colours, fonts, and a few style knobs editable from the admin instead of living in `src/lib/theme.js`.

### Approach: build-time JSON, inline styles unchanged

`src/lib/theme.js` exports plain JS objects consumed as inline styles across every component. Rather than refactor all of that to CSS custom properties — a large change for a value that only ever changes at author time — `theme.js` reads a JSON file at build time and keeps its current shape. Editing `theme.json` in dev triggers HMR, so the preview is live anyway.

### Steps

1. New `content/theme.json` — **base values only**:
   ```json
   {
     "colors": { "ink": "#16190f", "paper": "#f1ede2", "accent": "#a8571c", "tan": "#cdbb96" },
     "fonts": { "pairing": "inter-tight/space-mono" },
     "style": { "borderWeight": 6, "clipCorner": 12, "grain": true }
   }
   ```

2. `src/lib/theme.js` imports it and **derives** the rest. `rustDark`, `card`, `rowAlt`, `muted`, `hair`, `hairStrong`, and `tint` are all tonal shifts or alpha values off those four base colours today — deriving them follows the same one-way rule as `src/data.js`. Authoring seven near-identical browns by hand is how a palette drifts.

3. `CATEGORY_COLORS` (currently `Hero.jsx:13`, moving to `Tools.jsx` in Phase 1) is hand-tuned across hue at a matched tonal depth. Keep it **authored** in `theme.json` rather than derived — a mechanical hue rotation off the accent won't reproduce that tuning.

4. `ENTITIES` in `tools/content-schema.js` gains `"theme"`, plus a `validate()` case: every colour against `HEX_RE`, `fonts.pairing` against the allowlist, numeric style knobs in sane ranges.

5. New `ThemePane` in the admin with colour inputs, a pairing dropdown, numeric knobs, **and a live WCAG contrast readout** for ink-on-paper and accent-on-paper. A theme editor that lets you ship 2:1 contrast is a trap. Add `["theme", "Theme"]` as the first tab.

### Fonts — curated pairings

`index.html` hardcodes one Google Fonts `<link>`. Define 5–8 pairings, each with a prebuilt Fonts URL and its display/body/mono families:

```js
export const FONT_PAIRINGS = {
  "inter-tight/space-mono": {
    label: "Deckplate (current)",
    display: "'Inter Tight', sans-serif",
    body: "Inter, sans-serif",
    mono: "'Space Mono', monospace",
    href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap",
  },
  // ...
};
```

A **build-time** Vite plugin (`apply: 'build'` plus a serve-side equivalent) uses `transformIndexHtml` to inject the right `<link>` into both `index.html` and `resume/index.html`. Curated rather than arbitrary: it guarantees the URL is valid, guarantees the weights the design actually uses are loaded, and stops a considered layout becoming a ransom note.

### The résumé stays fixed

`src/resume/print.css` keeps its own palette. It's a print document with different constraints — sized in `pt`/`in`, rules over fills because Chrome disables background graphics by default. Leaving it out is a deliberate call, not an oversight. Revisit only if you change the base ink/paper enough that the two documents visibly disagree.

### Watch out

- `PaperGrain` and `Linescape` draw with theme colours too. Check both.
- `ACCENT_PRESETS` in `content-schema.js` is a separate palette for *project* accents. Decide whether it follows the theme accent or stays independent — independent is fine and simpler.
- Changing base colours invalidates any judgement baked into Phase 4's lightness clamp. Re-check that the clamp range still matches the new accent's depth.

---

## Phase 10 — Nested experience timeline

**Difficulty ★★★★☆ · ~1–2 days**

Render experiences as a nested timeline: concurrent entries indent inside the longer one that contains them, with a left-margin rail showing each entry's span relative to the whole. ASU 2024–2028 becomes the outer container and everything inside it nests — recursively.

### ASU becomes a real experience record

Add `"education"` to `EXPERIENCE_KINDS` (`tools/content-schema.js:20`) and create the record:

```json
{
  "id": "asu",
  "role": "B.S. Computer Science",
  "company": "Arizona State University",
  "kind": "education",
  "start": "2024-08",
  "end": "2028-05",
  "tech": [],
  "description": "...",
  "resume": { "include": false }
}
```

`resume.include: false` keeps it out of the résumé's experience list, where `profile.education` already covers the degree. The school name now lives in two files — accepted deliberately, in exchange for the entry being editable in the admin like everything else and able to carry a description and project links.

Give `kind: "education"` a distinct visual treatment in `Experience.jsx` (lighter rule, no "ACTIVE" dot) so it reads as a container rather than a job.

### The nesting rule

Sort by `start` ascending, then `end` descending (containers sort before what they contain). Then B nests under A when A **contains** B:

```js
const contains = (a, b) =>
  a.start <= b.start && (a.end == null || (b.end != null && b.end <= a.end));
```

Walk the sorted list maintaining a stack: pop until the top contains the current record, then push. One pass, gives you a forest.

**Partial overlaps do not nest.** If B starts inside A but ends after A ends, neither contains the other — render them as siblings and mark B with a "continues past" indicator (an open arrowhead on the rail). Silently nesting a partial overlap draws a relationship that doesn't exist.

### Rendering

Two layers, both worth having:

1. **Nesting rails.** Each row indents `depth * 24px`. For each ancestor level, a 1px vertical rule runs down the left gutter in that ancestor's colour, from its start row to its end row. That's the tab-indent / nested-loop read.
2. **Proportional span marker.** In the Period column, a thin horizontal bar positioned proportionally within the global range `[min(start), max(end ?? now)]`. Indentation alone tells you *containment*, not *duration* — this is what makes "relative to the others" legible at a glance. Ongoing entries run to the right edge with a soft fade rather than a hard cap.

Build the tree in `src/data.js` as `experienceTree`, exported alongside the flat `experiences` — the résumé still wants flat.

### Project links per experience

`blankExperience()` in `admin/App.jsx:33` already has a singular `projectId: null`. Widen it:

```json
"projectIds": ["yber", "wifi-portal"]
```

Migrate the existing singular field. Same cross-entity validation limit as Phase 7 — check ids in the admin (where both docs are loaded), fall back gracefully in `data.js`. Render as chips using each project's own `accent` for border and text, clicking through via `openProject` — which means threading `openProject` into `Experience.jsx`, which currently doesn't receive it. Phase 8 needs the same wiring in the opposite direction, so do whichever comes first properly.

### Watch out

- **`pin` conflicts with nesting.** `byRecency` honours a numeric `pin` to force résumé-matching order. Inside a tree, pin can only order *siblings* — it can never override containment. Apply it per level and note the change in `src/lib/dates.js`.
- Deep nesting overflows on narrow screens. Collapse to flat below ~900px; the codebase already uses `data-r` attributes as responsive hooks, so follow that pattern.
- The rail must not be the only cue. Keep the period text, and make sure each row still announces role, company, and period in order for a screen reader. A purely visual timeline is unreadable.
- With ASU wrapping everything, nearly every row sits at depth ≥ 1. Make sure the base indent doesn't eat the description column — consider zero indent at depth 1 and stepping only from depth 2.

---

## Phase 11 — Generate a project from a GitHub repo

**Difficulty ★★★★☆ · ~2 days**

Paste a repo URL, get a filled-in project draft. First phase needing network access and a secret.

### Prerequisites (no API key yet)

1. **Get an Anthropic API key** — console.anthropic.com → API keys. Billing is prepaid credits; the minimum top-up covers a very large number of generations.
2. **Create `.env.local`** in the repo root:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   GITHUB_TOKEN=ghp_...      # optional, lifts GitHub's 60 req/hr unauthenticated limit
   ```
3. **Verify it's ignored** before the first commit: `git check-ignore -v .env.local` must print a matching rule. If it prints nothing, add `.env.local` to `.gitignore` first. A key committed to a public repo is a key you have to rotate.
4. **Load it into the plugin.** This is the gotcha: a Vite plugin runs in Node but **`process.env` does not automatically contain `.env.local`** — Vite loads env files for the *client* bundle and only exposes `VITE_`-prefixed vars there. In the plugin's `config` hook, call Vite's `loadEnv(mode, root, "")` (the empty prefix loads everything) and keep the result in plugin scope. Don't reach for `process.env.ANTHROPIC_API_KEY` and wonder why it's undefined.
5. **Cost**: a truncated README plus metadata is roughly 3K input tokens, and the draft is around 1K output. On `claude-opus-5` ($5/M in, $25/M out) that's about **four cents per generation**. `claude-sonnet-5` runs roughly half that if you'd rather; opus-5 is the better default for turning a rambling README into clean portfolio prose.

The key is only ever read server-side inside `adminPlugin()`, which is `apply: 'serve'` and never reaches a build. It must never be echoed into a response body or an error message.

### Shape

A dev-only endpoint plus a review step. **The AI never writes to `content/projects.json` directly** — it returns a draft, the admin shows it, you edit and accept. Anything else is an LLM silently editing your portfolio.

### Server: `POST /__admin/api/generate/project`

Add to `adminPlugin()` in `tools/vite-plugin-admin.js`. It inherits loopback-only, `x-admin`, and the Origin check automatically.

1. **Fetch repo facts** from the GitHub REST API — `/repos/{owner}/{repo}` (description, topics, `created_at`, `pushed_at`, homepage), `/repos/{owner}/{repo}/languages`, and the README via `/repos/{owner}/{repo}/readme`.
2. **Call Claude** with those facts.
3. **Validate** with `validate("projects", [draft])` before returning. On failure, return the errors rather than a broken draft.
4. Return the draft. Do not write a file.

### The Claude call

Node project, so the official SDK: `npm i -D @anthropic-ai/sdk` — a dev dependency, since the plugin never ships.

```js
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey });   // from loadEnv, not process.env

const response = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 16000,
  system:
    "You write portfolio project entries. Use only facts present in the " +
    "repository data provided. Do not invent metrics, users, or partnerships. " +
    "Prefer technology tags from the provided vocabulary over inventing new ones.",
  messages: [{ role: "user", content: JSON.stringify(repoFacts) }],
  output_config: { format: { type: "json_schema", schema: PROJECT_SCHEMA } },
});
```

`PROJECT_SCHEMA` mirrors the record: `title`, `category`, `summary`, `description`, `bullets[]`, `tech[]`, `start`, `end`. Structured outputs need `additionalProperties: false` on every object and an explicit `required` list; string-length and numeric constraints aren't supported in the schema, so keep enforcing those in `validate()` as you already do.

- Don't set `temperature` or `top_p` — they're rejected on this model.
- Pass `allTech` (already exported from `src/data.js`) as the preferred vocabulary, so it reuses `React`, `Supabase`, `GCP` rather than inventing `ReactJS`.
- Derive `start` from `created_at` and `end` from `pushed_at` **in code**, and tell the model to use those values rather than guessing. Dates are exactly where a language model confabulates.
- Leave `accent`, `code`, `image`, `pin`, and `resume` for you. `initials()` in `content-schema.js` already generates the code from the title.

### Admin UI

A "From GitHub…" button next to "+ New" in the projects `ListPane`. Paste URL → spinner → a review pane showing each generated field with accept/edit. On accept, insert with `_isNew: true` so the normal id-from-title flow applies. Errors go through the existing toast pattern.

### Watch out

- Truncate the README to the first ~8 KB. The useful description lives at the top, and full READMEs get enormous.
- Handle 404 (private/nonexistent) and 403 (rate limited) distinctly, with messages that say what to do about it.
- Single-flight it, same as `publish` — one generation at a time.
- If `ANTHROPIC_API_KEY` is missing, the endpoint should return a clear "not configured" message and the admin should hide the button, not fail cryptically.

---

## Phase 12 — Placeholder project thumbnail generator

**Difficulty ★★☆☆☆ (Tier A) → ★★★★★ (Tier B) · ~4 hours, +~2 days if you add Tier B**

Generate a splash thumbnail for projects that don't have one, swappable later. **Build Tier A. Tier B stays sketched below in case the procedural cards don't satisfy.**

### Tier A — procedural, on-brand

Compose the image from the design system you already have. A deckplate card: paper ground, ink rules, a `Linescape`-style stroke field, the project's two-letter `code` set large in Inter Tight, the category in mono caps, and the project's `accent` as the single colour.

- Render in the **admin browser** to an offscreen canvas at 1200×750, `toBlob()`, then POST through the existing `/upload` endpoint. No new server route, no new dependency, no network call, no key.
- `Linescape` (`src/components/Linescape.jsx`) already generates the stroke field — port its geometry to canvas, or render the component to SVG and rasterize.
- Seed the randomness from the project id so regenerating the same project gives the same card.
- Pull colours from `theme.js` (or `theme.json` after Phase 9) rather than hardcoding, so generated cards follow a theme change.

This is the better *design* answer, not just the cheaper one. A diffusion model produces generic tech-stock imagery that fights a paper/ink/rust system built on restraint. A procedurally generated card looks like it belongs, because it's made of the same parts.

### Tier B — model-generated imagery (optional follow-up)

If you specifically want photographic or illustrative splash art later:

- Claude does not generate images, so this needs a third-party image API — a second vendor, a second key, per-image cost, and a licensing question about the output.
- Same architecture as Phase 11: dev-only endpoint, secret server-side via `loadEnv`, image written to `public/projects/` only after you approve it in a review pane.
- Build the prompt from the project's `category`, `tech`, and `accent`, and pin one consistent style string across all projects — otherwise the grid looks like twelve different sites.
- Expect several regenerations per project. Budget accordingly.

### Watch out (both tiers)

- Never overwrite an existing `image`. Generate to a new filename; `/upload` already de-duplicates with a `-2`, `-3` suffix.
- Generated files land in `public/` and get pushed to `gh-pages` on every deploy. Keep the canvas output as PNG at 1200×750 (roughly 100–200 KB for flat vector-ish art) rather than something larger.
- Pair with Phase 4 carefully: once a thumbnail exists, auto-accent can read it — but a card generated *from* the accent must not feed back into it. Skip auto-extraction when `image` points at a generated card, or you'll slowly drift the colour with each round trip.
