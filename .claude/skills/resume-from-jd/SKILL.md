---
name: resume-from-jd
description: Turn a pasted job description into a tailored résumé profile in content/resume-profiles.json. Use when the user pastes a job posting, names a company/role they're applying to, or asks to tailor/build a résumé for a specific job.
---

# Build a résumé profile from a job description

The site keeps several **résumé profiles** in `content/resume-profiles.json` — each is a named
selection of which projects, experiences, skills, and info blocks appear on `/resume/`. One
profile is marked `active` and drives the live page and its Print / Save-PDF. This skill reads a
job description and appends a new profile tailored to it. It is the automated counterpart to the
admin's **Résumé** tab (`npm run admin`), which reads and writes the same JSON.

Everything here is a JSON edit. Never touch JSX — the résumé is rendered from this data by
`src/resume/Resume.jsx` via `src/resume/selection.js`.

## 1. Get the job description

Take it from the argument, or ask the user to paste it. Pull out: the role title, the company,
the seniority, and the concrete tools/skills and domains it emphasizes (languages, frameworks,
cloud, AI, hardware, domain words like "fintech", "computer vision", "IoT").

## 2. Read what's available

Read `content/projects.json`, `content/experiences.json`, and `content/skills.json`. Note each
record's `id`, `title`/`role`, `kind`, and `tech`. The selection model is defined in
`src/resume/selection.js` — read it so you match the shape exactly.

**The model stores what is HIDDEN, not what is shown.** An empty selection = everything visible.
So tailoring means listing the ids/items to *omit*:

```json
{
  "version": 1,
  "hiddenProjects": ["id", "..."],
  "hiddenExperiences": ["id", "..."],
  "hiddenSkills": { "categoryId": ["Item", "..."] },
  "hideSummary": false,
  "hideCoursework": false,
  "hiddenContact": []
}
```

## 3. Decide what the résumé should show

Rank every project and experience against the JD by tech overlap, domain fit, and recency, then:

- **Experience** — keep all `kind: "work"` roles (paid/founding roles carry regardless). Among
  the activities/awards (`kind !== "work"`: hackathons, competitions, leadership), keep only the
  ones that reinforce this role; hide the rest.
- **Projects** — keep the 3–5 that best match the JD; hide the others. The résumé is short on
  purpose — a wall of marginally-relevant projects is worse than four sharp ones.
- **Skills** — hide individual skill items that are irrelevant to the role so each category line
  stays tight and on-point. Drop a whole category (every item) only if the role touches none of
  it. Keep the category structure; you are pruning items, not re-categorizing (that's the
  `tidy-skills` skill's job).
- **Info** — keep the summary and contact rows. Set `hideCoursework: true` for senior roles or
  when the candidate's experience already fills the page; keep it for new-grad/early-career roles
  the JD is clearly aimed at.

Build the `selection` as the set of everything you chose to hide.

## 4. Append the profile

Add to the `profiles` array in `content/resume-profiles.json` (2-space indent):

```json
{
  "id": "<slug>",
  "name": "<Role> @ <Company>",
  "selection": { ... }
}
```

- `id` — `slugify("<company>-<role>")` from `tools/content-schema.js`, unique across `profiles`.
- `name` — human label shown in the admin list, e.g. `"ML Engineer @ Acme"`.

Ask whether to also make it live (set the top-level `"active"` to this `id`). Default to leaving
the current active profile alone — tailored profiles are usually previewed, not published.

## 5. Verify and hand off

```
node .claude/skills/add-project/scripts/check-content.mjs
```

It runs the repo's `validate()` over every content file (now including `resume-profiles`). Fix
anything under `FAIL`. Then tell the user:

- what you included and what you hid, with a one-line reason tied to the JD,
- that they can preview and Save-as-PDF at `/resume/?profile=<id>` (run `npm run dev` if the
  server isn't up), and fine-tune the selection in the admin **Résumé** tab,
- whether you set it live or left the active profile unchanged.

## Rules that will bite you

- **Hidden-model, not shown-model.** Listing ids you *want* and calling that `hiddenProjects`
  inverts the résumé. Hide what you're leaving off.
- **Match ids exactly** — a typo'd id in `hiddenProjects` silently fails to hide anything.
- **Don't invent content.** This skill only *selects* from existing records. If the JD needs a
  project or bullet that doesn't exist, say so — adding one is the `add-project` skill.
- **Never edit JSX**, never run tech names through `slugify()` (it's for the profile `id` only).
