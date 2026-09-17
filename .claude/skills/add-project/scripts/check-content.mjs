#!/usr/bin/env node
// Post-edit check for content/*.json, run from the repo root:
//   node .claude/skills/add-project/scripts/check-content.mjs
//
// Runs the repo's own validate() (tools/content-schema.js — the same rules the
// admin API enforces) and then the cross-file checks that validate() can't see
// because it only ever looks at one document at a time: duplicate codes and
// accents, missing image files, dangling projectId references, and tech tokens
// that aren't filed as skills yet.
//
// Exit 1 = something is wrong. Exit 0 with a "notes" section = worth a look,
// but nothing that breaks the build.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const { ENTITIES, validate, guessCategory } = await import(
  pathToFileURL(join(ROOT, "tools", "content-schema.js")).href
);

const read = (name) => JSON.parse(readFileSync(join(ROOT, "content", `${name}.json`), "utf8"));

const errors = [];
const notes = [];

/* ------------------------------------------------- 1. per-file validation */

const docs = {};
for (const entity of ENTITIES) {
  try {
    docs[entity] = read(entity);
  } catch (e) {
    errors.push(`${entity}.json is not readable/parseable: ${e.message}`);
    continue;
  }
  for (const { path, message } of validate(entity, docs[entity])) {
    errors.push(`${entity}.json ${path || "(root)"}: ${message}`);
  }
}
if (errors.length) {
  console.log("FAIL\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

const { projects, experiences, skills, metrics } = docs;

/* --------------------------------------------- 2. cross-file uniqueness */

const dupes = (list, key) => {
  const seen = new Map();
  for (const v of list) seen.set(v[key], (seen.get(v[key]) ?? 0) + 1);
  return [...seen].filter(([v, n]) => v != null && n > 1).map(([v]) => v);
};

for (const d of dupes(projects, "code")) {
  errors.push(`projects.json: two projects share the display code "${d}" — codes should be distinct`);
}
for (const d of dupes(projects, "accent")) {
  errors.push(`projects.json: two projects share the accent "${d}" — pick an unused ACCENT_PRESETS entry`);
}

/* --------------------------------------------------- 3. images & links */

for (const p of projects) {
  if (p.image && !existsSync(join(ROOT, "public", p.image.replace(/^\//, "")))) {
    errors.push(`projects.json ${p.id}: image "${p.image}" has no file under public/`);
  }
  if (!p.image) notes.push(`${p.id} has no image — the card renders its accent block instead`);
}

/* ------------------------------------------- 4. dangling projectId refs */

const projectIds = new Set(projects.map((p) => p.id));
const refs = [
  ...experiences.map((e) => ["experiences.json", e.id, e.projectId]),
  ...(metrics.peopleHelpedBreakdown ?? []).map((b) => ["metrics.json", b.label, b.projectId]),
  ...(metrics.moneySavedBreakdown ?? []).map((b) => ["metrics.json", b.label, b.projectId]),
];
for (const [file, owner, ref] of refs) {
  if (ref && !projectIds.has(ref)) {
    errors.push(`${file} "${owner}": projectId "${ref}" matches no project`);
  }
}

/* ------------------------------------------------- 5. unfiled tech tokens */

const filed = new Set(
  skills.categories.flatMap((c) => c.items).concat(skills.ignored ?? []).map((s) => s.toLowerCase())
);
const used = new Map();
for (const r of [...projects, ...experiences]) {
  for (const t of r.tech ?? []) if (!filed.has(t.toLowerCase())) used.set(t, (used.get(t) ?? 0) + 1);
}
for (const [token, count] of [...used].sort((a, b) => b[1] - a[1])) {
  notes.push(
    `"${token}" is used on ${count} record(s) but isn't in skills.json ` +
      `— file it under "${guessCategory(token)}" or add it to \`ignored\``
  );
}

/* ----------------------------------------------------------------- report */

if (errors.length) {
  console.log("FAIL\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`OK — ${projects.length} projects, ${experiences.length} experiences valid`);
if (notes.length) console.log("\nnotes:\n" + notes.map((n) => "  - " + n).join("\n"));
