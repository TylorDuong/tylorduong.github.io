---
name: tidy-skills
description: Sweep every new/uncategorized tech tag into the right Skills & Tools category and audit existing placements for relevance. Use when the user asks to clean up, categorize, or fix the skills list, file unfiled tech tags, or sort out the Skills & Tools section.
---

# Tidy the Skills & Tools section

The home page's **Skills & Tools** section renders from `content/skills.json` — a set of named
categories, each with an `items` list — via `skillGroups`/`skills` in `src/data.js`. Every tech
token used on a project or experience should either be a listed skill in some category or be
deliberately parked in the `ignored` array. Over time, new tokens pile up unfiled and some items
drift into the wrong category. This skill clears that backlog in one pass. It is the whole-repo
counterpart to the single-project filing that the `add-project` skill does.

This is a JSON edit to `content/skills.json`. Never edit JSX — the section is derived from this
file. The same JSON is what the admin's **Skills** tab reads and writes (`npm run admin`).

## 1. Read the inputs

Read `content/skills.json`, `content/projects.json`, and `content/experiences.json`. The
categories today are: `languages`, `frontend`, `backend`, `cloud`, `ai`, `hardware`,
`enterprise` (confirm from the file — don't hardcode). An item may live in **only one** category:
`validate()` rejects the same item (case-insensitively) appearing in two.

## 2. Find the unfiled tokens

Run the existing checker — its `notes` section lists exactly this backlog:

```
node .claude/skills/add-project/scripts/check-content.mjs
```

Each note is a token used on N records that is neither in a category nor in `ignored`, with a
`guessCategory()` starting suggestion. (Equivalently: the set of `tech` tokens across projects +
experiences, minus everything already in `categories[].items` or `ignored`, compared
case-insensitively.)

## 3. File each token

For every unfiled token, decide:

- **A real, transferable technology** (a language, framework, library, service, tool) → append it
  to the best-fitting category's `items`. `guessCategory(token)` in `tools/content-schema.js` is
  the starting hint; **override it when it's obviously wrong** — it defaults to `languages` for
  anything it can't place, so e.g. `Vosk` (speech recognition lib → `ai`), `Weather APIs`
  (→ `backend`), `AI Agent`/`Gemini Agents` (→ `ai`) need correcting.
- **A project descriptor, not a skill** (`Hackathon`, `Research`, `Simulation`, `Problem Solving`,
  `OOP`, and similar) → append it to the `ignored` array instead. These describe work, not tools,
  and don't belong on a skills line.

Preserve the token's **exact spelling** — never run it through `slugify()` (it mangles `C/C++`,
`C#`). If the same capability already appears under a slightly different spelling, prefer the
existing one and `ignore` the variant rather than listing both.

## 4. Audit existing placements

Walk each category and move any item that doesn't belong — a database sitting under `frontend`, a
cloud service under `languages`, etc. Move by deleting from the wrong category's `items` and
adding to the right one; never list it in both. Keep categories coherent: `languages` is
programming languages, not every token that lacks a better home.

## 5. Verify and report

```
node .claude/skills/add-project/scripts/check-content.mjs
```

The `notes` section should no longer list any *real* skill — only genuine descriptors you chose
to leave (or that you've now moved to `ignored`). Then `npm run build` to catch a malformed JSON
file that still passes schema validation.

Report every change grouped as **Filed** (token → category), **Ignored** (token → why it isn't a
skill), and **Moved** (token: from → to, why). Offer `npm run dev` so the user can eyeball the
Skills & Tools section; don't publish unless asked.

## Rules that will bite you

- **One category per item** — `validate()` fails on a duplicate across categories
  (case-insensitive). Moving means remove-then-add, not add-twice.
- **Exact spellings, never `slugify()`** on tech names.
- **Don't delete items the user curated** just because they're unused on a current record — only
  move mis-filed ones and file genuinely new/unfiled ones. When unsure whether a token is a skill
  or a descriptor, prefer `ignored` and say so.
- **Never edit JSX or `src/data.js`** — the section is already derived; the fix is always in
  `content/skills.json`.
