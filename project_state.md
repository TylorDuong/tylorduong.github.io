# Project state

Working notes for Claude Code. Updated on task completion.

## Last task — Résumé profiles (admin tab + 2 skills)

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
