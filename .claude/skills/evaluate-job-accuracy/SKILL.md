---
name: evaluate-job-accuracy
description: Score how well the candidate's skills/résumé match a job description for the "ideal candidate" out of 100 using a 5-dimension rubric, after researching the company + role for implicit requirements, then record what's missing in SKILL_GAPS.md. Use when the user pastes a job posting, asks "how well do I match" / "what's my ATS score" / "rate my resume against this job", or right after resume-from-jd builds a profile.
---

# Score a résumé against a job description

This skill rates how close the candidate is to the **ideal candidate** for a specific job — a
number out of 100 across a fixed rubric — and appends what it finds to a rolling
`SKILL_GAPS.md` so the list of skills to learn grows across every application instead of being
lost. It is read-only over `content/*.json`: it *evaluates*, it never edits the portfolio. The
counterpart that builds a tailored profile is the `resume-from-jd` skill, which calls this one at
the end.

The score is **agent judgment**, not a formula — you read the candidate's data and the JD and
award points per the rubric below. The only script here is the deterministic bookkeeping that
merges your findings into the tracker (step 6).

## 1. Get the inputs

- **The job description** — from the argument, or ask the user to paste it. Extract the company,
  the role title, the seniority, and every concrete skill/tool/domain it names.
- **An optional `profileId`** — when `resume-from-jd` calls this skill it passes the profile it
  just created. If you have one, score the **visible set of that profile** (what that résumé
  actually shows). With no `profileId`, score the whole portfolio.

## 2. Read the candidate's data

Read `content/skills.json` (the categorized skill list), `content/projects.json` and
`content/experiences.json` (tech tags, and the `bullets` — that's where quantified metrics and
ownership verbs live), and `content/profile.json` (education, GitHub/portfolio/LinkedIn links).

If you were given a `profileId`, read `content/resume-profiles.json`, find that profile, and
resolve its **visible** set. The selection stores what is HIDDEN (see `src/resume/selection.js`):
visible = everything minus `hiddenProjects` / `hiddenExperiences` / per-category `hiddenSkills`,
with `hideSummary` / `hideCoursework` / `hiddenContact` as flags. Score only what's visible.

## 3. Research the company + role — REQUIRED

Do not score from the JD text alone. Use WebSearch / WebFetch to find the **implicit "traditional
hire" skills** a strong candidate for this company + title is expected to have but the posting
doesn't spell out. Search things like:

- `"<company>" "<role>" tech stack / requirements / interview`
- the company's engineering blog, `levels.fyi`, Glassdoor interview reports, recent job reqs for
  the same team.

Infer the real bar. (E.g. a Qualcomm embedded SWE intern JD that only says "C/C++/Python" implies
RTOS, embedded Linux / Yocto, ARM, DSP / Hexagon, multithreading, bare-metal debugging.) Write
down this inferred set with a one-line reason each — it feeds both the score (step 4) and the gaps
(step 5), and each gap is tagged `source: "jd"` or `source: "inferred"` accordingly.

If research is blocked or you're offline, say so explicitly in the report and fall back to JD-only
— but note the score is less reliable without it.

## 4. Score against the rubric (out of 100)

Award each dimension's points from the candidate's data vs. the JD **and** the step-3 research.
Give a one-line rationale per dimension.

| # | Dimension | Pts | What earns the points |
|---|---|---|---|
| 1 | **Technical Stack & Core CS** | 30 | **Core languages & frameworks (15)** — exact matches to the required stack; reward *depth in a few* over a shallow list of 20. **CS fundamentals & tooling (15)** — data structures, algorithms, OOP, system design, and Git/CI-CD/Docker/cloud. Read from `skills.json` + project/experience `tech`. |
| 2 | **Engineering Impact & Scale** | 30 | **Quantifiable metrics (15)** — real numbers in the `bullets`: latency, throughput/scale, memory, %, users, cost. **Ownership vs proximity (15)** — "Architected / Designed / Engineered / Implemented / Founded" outscore "Helped with / Part of a team that…". End-to-end ownership scores highest. |
| 3 | **Domain Alignment & Problem Solving** | 15 | **Sub-domain fit (10)** — does the work match the *flavor* of the role (backend / ML / embedded / frontend / data / DevOps)? **Constraint handling (5)** — evidence of debugging, edge cases, optimization ("resolved a DB bottleneck", "real-time under 48h"). |
| 4 | **ATS Readability & Parsing** | 15 | **Format health (10)** + **link extraction (5)**. The `/resume/` page is already single-column with no tables/graphics in the text flow, so format health scores near-full and consistently. For links, confirm `profile.json` actually carries GitHub + portfolio + LinkedIn; dock the 5 only if one is missing. |
| 5 | **Education & Trajectory** | 10 | **Baseline credentials (5)** — the B.S. Computer Science (in progress) clears a CS-degree gate; dock only if the role demands a degree the candidate lacks. **Career progression (5)** — a rising arc of responsibility/complexity (intern → founder/CEO, growing project scope). |

Output a compact table: dimension, sub-scores, dimension total, then the **total / 100**. Note
honestly where a dimension is a near-constant for this site (4, and the baseline half of 5) versus
where the real signal is (1–3) — those are what move between roles.

## 5. Compute the gaps

Gaps = **(skills named in the JD ∪ skills inferred in step 3) − (skills the candidate has)**. For
each missing skill record:

- `skill` — the canonical name (don't mangle `C/C++`, `C#`).
- `category` — use `guessCategory(token)` from `tools/content-schema.js` as the hint
  (`languages` / `frontend` / `backend` / `cloud` / `ai` / `hardware` / `enterprise`).
- `priority` — `high` / `medium` / `low` by how central it is to *this* role.
- `source` — `jd` (written in the posting) or `inferred` (surfaced by your research).
- `note` — one line on why it matters / where it came from.

Don't list things the candidate already has. Keep it to what genuinely moves the next application.

## 6. Record the run + gaps

Write a payload JSON to a temp file with the Write tool, then run the bookkeeping script:

```
node .claude/skills/evaluate-job-accuracy/scripts/gap-upsert.mjs <payload.json>
```

Payload shape:

```json
{
  "run": {
    "date": "YYYY-MM-DD",
    "company": "Qualcomm",
    "role": "Software Engineering Intern",
    "profileId": "qualcomm-software-engineering-intern",
    "score": 78,
    "breakdown": { "stack": 24, "impact": 22, "domain": 11, "ats": 14, "education": 7 },
    "topGaps": ["RTOS", "Embedded Linux / Yocto", "Multithreading in C++"]
  },
  "gaps": [
    { "skill": "RTOS", "category": "hardware", "priority": "high", "source": "inferred",
      "note": "Core to Qualcomm embedded SWE; not written in the JD." }
  ]
}
```

- `date` — use the real current date.
- `breakdown` keys are the five dimensions in order: `stack`, `impact`, `domain`, `ats`,
  `education`. They should sum to `score`.

The script upserts each gap by normalized name (bumps a demand counter, unions the roles that
wanted it, keeps the earliest `firstSeen`, and **preserves any `status` the user has edited** —
`learning` / `done` never get reset), appends the run, and regenerates `SKILL_GAPS.md`. Running it
again for another role accumulates; it never overwrites history.

## 7. Report and verify

Tell the user:

- the **score table** and the **total / 100**, dimension by dimension,
- the **top 3–5 gaps** with a one-line why each, flagged `JD` vs `inferred`,
- that `SKILL_GAPS.md` was updated (and that they edit `status` in `skill-gaps.json` to mark a
  skill `learning` / `done`).

Then run the shared content check — it should be unchanged, since this skill writes no content:

```
node .claude/skills/add-project/scripts/check-content.mjs
```

## Rules that will bite you

- **Research is mandatory.** The whole point is scoring against the *ideal* candidate, including
  the unwritten bar. Skipping step 3 produces a shallow, JD-literal score — call it out if you had
  to.
- **Scoring is judgment; only the tracker is scripted.** Don't try to compute the number in the
  script — award points yourself, then hand the script your findings.
- **Read-only over content.** Never edit `content/*.json` here. Tailoring is `resume-from-jd`'s job.
- **The gap files live at the repo root, not in `content/`.** `skill-gaps.json` and `SKILL_GAPS.md`
  are career meta, not site content — they must not go under `content/` or into `ENTITIES`, or
  they'd break the build and try to render on the site.
- **Don't run tech names through `slugify()`** — it mangles `C/C++` and `C#`. That function is for
  ids only.
