# Project state

Working notes for Claude Code. Updated on task completion.

## Last task — Removed the /cv/ page

Reverted the comprehensive CV added earlier: deleted `cv/index.html`, `src/cv/` (Cv.jsx, main.jsx,
print.css), removed the `cv` entry from `vite.config.js` `rollupOptions.input`, and cleaned
`dist/cv/`. `npm run lint` + `npm run build` clean (build emits only main + resume). The surgical
VLM content update and the Waymo profile tweak were left in place.

## Previous task — Surgical VLM content + Waymo profile tweak

- Updated `surgical-video-vlm` (projects.json) and `asu-capstone-surgical-vlm` (experiences.json):
  description + first bullet now state it's a two-semester ASU capstone **in partnership with
  Barrow Neurological Institute**, advised by **Professor Yalin Wang** (ASU School of Computing and
  Augmented Intelligence). Did NOT add his phone/email (not résumé-appropriate).
- Waymo profile (`waymo-ml-accelerator-kernels-intern`): un-hid `asu-capstone-surgical-vlm` so the
  research credential shows in the Experience/Activities section. NOTE: the Waymo résumé now shows
  BOTH the surgical-video-vlm project card and the capstone experience (same work, two framings) —
  intentional double-emphasis for a research-heavy role; offered to drop one if undesired.
- `check-content.mjs` passes.

## Previous task — Comprehensive CV page (/cv/) + Waymo profile

**New `/cv/` Vite entry** — the comprehensive counterpart to `/resume/`. Where the résumé renders
a tailored *selection*, the CV shows everything in `src/data.js` (all work + activities, all
projects sorted by recency, full skills, full coursework) and flows across multiple Letter pages.
- `cv/index.html` (3rd entry), `src/cv/main.jsx`, `src/cv/Cv.jsx`, `src/cv/print.css`.
- Reuses the résumé's `r-*` classes + `src/resume/print.css` (imported, not duplicated); CV CSS
  only adds the `.cv-kicker` label and lets the on-screen sheet grow past 11in.
- Registered `cv: cv/index.html` in `vite.config.js` `rollupOptions.input`.
- Verified: `npm run lint` + `npm run build` clean, `dist/cv/index.html` emitted, no `__admin` in
  `dist/`. Preview at `/cv/` (Print / Save-PDF, header/footer already suppressed).

**Waymo profile** — appended `waymo-ml-accelerator-kernels-intern` ("ML Accelerator Kernels Intern
@ Waymo") to `content/resume-profiles.json`. Active left as `general`. NOTE: this role (low-level
ML-accelerator kernels in CUDA/Triton DSLs, transformer-inference perf optimization, agentic
kernel-gen harnesses) is a stretch vs the portfolio — no CUDA/Triton/kernel experience; selected
the closest fits only (surgical-video-vlm, hardware-planner/SparkBuild agentic harness, moveright
real-time inference, agat C/C++ low-level). Shown projects: moveright, surgical-video-vlm,
hardware-planner, agat. Shown exp: 3 work + soda-code-challenge. Kept full AI/Data skills.

## Previous task — Garmin SWE Intern résumé profile (resume-from-jd)

Appended profile `garmin-software-engineering-intern` ("Software Engineering Intern @ Garmin") to
`content/resume-profiles.json`. Active left as `general` (user chose not to publish).

- Garmin JD = embedded C/C++/Assembly for communication & navigation (avionics) products, testing
  with debuggers/emulators/simulators/logic analyzers, DevOps/Mobile/Web teams, data-structures +
  OOP fundamentals, teamwork; desired Aerospace focus.
- Projects shown (5): AGAT (embedded C/C++ aviation TCAS, Kalman filter), V.I.B.E (aerospace VR),
  MUD (C/C#/OOP + Git teamwork), ShelfSmart (IoT embedded + sensors), AssembliSim (simulation).
  Hid yber, wifi-portal, quotation-engine, moveright, oratori, fit2u, sir-model,
  surgical-video-vlm, hardware-planner.
- Experiences shown (4): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java/data
  structures/team). Hid the rest incl. the AGAT/VIBE/AssembliSim hackathon rows (project cards
  already represent them) and the AI/web activities.
- Skills pruned to embedded/systems/fundamentals: kept C/C++, C#, Java, Python, React Native
  (mobile), Three.js, WebSockets, Docker/Git/GitHub, OpenCV, Kalman Filter, Arduino/ESP32/ESP-NOW/
  Raspberry Pi/Altium. Dropped the whole Enterprise category and most AI/LLM + styling/CAD items.
- Coursework kept (Data Structures, OOP, OS, Programming Languages directly match the JD).
  `check-content.mjs` passes. Preview: `/resume/?profile=garmin-software-engineering-intern`.

## Previous task — Suppress browser print header/footer on /resume/

`src/resume/print.css`: set `@page { margin: 0 }` (Chrome only injects its URL/date/title/
page-number header & footer when the page margin leaves room) and moved the 0.5in inset onto
`.r-page { padding: 0.5in }` in the `@media print` block so the layout is unchanged. This removes
the top-left date, top-center "Tylor Duong - Resume" title, bottom URL, and bottom page number
from exported/printed résumés.

## Previous task — Intel SWE Intern résumé profile (resume-from-jd)

Appended profile `intel-software-engineering-intern` ("Software Engineering Intern @ Intel") to
`content/resume-profiles.json`. Active profile left as `general` (user chose not to publish).

- Projects shown (5): AGAT, AssembliSim, ShelfSmart, SparkBuild, MoveRight — firmware/embedded,
  manufacturing simulation, IoT hardware+data, hardware+validation, AI/CV (maps to Intel's
  firmware/systems/GPU/AI-frameworks tracks). Hid yber, wifi-portal, quotation-engine, oratori,
  fit2u, vibe, sir-model, mud, surgical-video-vlm.
- Experiences shown (5): 3 work (ShelfSmart, Yber, Yazaki) + asu-capstone-surgical-vlm (research)
  + soda-code-challenge (problem solving). Hid the hackathon/activity entries incl. the
  AGAT/AssembliSim hackathon rows (their project cards already represent them).
- Skills pruned per category (hid web-only/niche items: HTML/CSS, RN/Tailwind/Styled/Figma,
  Express/MySQL/Mongo/Supabase/Firebase, Vercel, Gemini API/OpenRouter/LLaVA/Ollama, Blender,
  Power Platform/Apps/n8n/SharePoint). Kept C/C++, Python, PyTorch, Arduino/ESP32/Altium, etc.
- Coursework kept (new-grad/intern role). `check-content.mjs` passes (only the pre-existing
  unfiled-tech notes remain). Preview: `/resume/?profile=intel-software-engineering-intern`.

## Previous task — Résumé profiles (admin tab + 2 skills)

Added deployable, admin-managed résumé profiles and two Claude skills.

**What shipped**
- New content entity `content/resume-profiles.json` — `{ active, profiles: [{ id, name, selection }] }`.
  `selection` uses the "store what is HIDDEN" model from `src/resume/selection.js`. Seeded one
  `general` profile equal to the previous curated (`resume.include`) selection.
- `tools/content-schema.js` — `resume-profiles` added to `ENTITIES` + a `validate` case.
- `src/data.js` — exports `resumeProfiles`, `activeResumeProfileId` (raw passthrough; resolving a
  selection here would cycle with `selection.js`).
- `src/resume/selection.js` — new `profileSelection(id)` (falls back to curated).
- `src/resume/Resume.jsx` — renders the active profile, or `?profile=<id>` override (admin preview).
- Retired the dev-only panel: deleted `src/resume/ExportPanel.jsx`, `src/resume/presets.js`, and the
  `body.has-export-panel` block in `print.css`.
- `admin/App.jsx` — "Résumé" tab added to the tab bar (replaced the old header `RÉSUMÉ ↗` arrow).
- `admin/ResumePane.jsx` — new: profile list (new/duplicate/delete/rename/set-live) + checkbox
  selection editor (info/contact, experience, projects, skills) + Preview/Download link to
  `/resume/?profile=<id>`.
- Skills: `.claude/skills/resume-from-jd/` (JD → tailored profile) and `.claude/skills/tidy-skills/`
  (file unfiled tech tags into Skills & Tools categories + relevance audit).

**Verified**: `npm run lint`, `npm run build` (no `__admin` in `dist/`), `check-content.mjs` passes,
live admin API serves the new entity (`active: general`, 1 profile).

**Open follow-ups (not done)**
- The Skills backlog `check-content.mjs` still reports (Unity2D, YOLOv8, ViTPose++, Vosk, etc.) is
  intentionally left for the user to run the `tidy-skills` skill on.
- Nothing published — `npm run deploy` only on request.
