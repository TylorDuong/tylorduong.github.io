#!/usr/bin/env node
// Merges one evaluation run into the rolling skill-gap tracker:
//
//   node .claude/skills/evaluate-job-accuracy/scripts/gap-upsert.mjs <payload.json>
//
// The payload is produced by the evaluate-job-accuracy skill (the scoring is
// agent judgment; this script only does the deterministic bookkeeping). It
// carries one run record plus the gaps that run surfaced:
//
//   {
//     "run":  { "date","company","role","profileId","score",
//               "breakdown": { "stack","impact","domain","ats","education" },
//               "topGaps": ["RTOS","..."] },
//     "gaps": [ { "skill","category","priority","source","note" }, ... ]
//   }
//
// It upserts each gap into skill-gaps.json by normalized name (bumping a demand
// counter, unioning the roles that wanted it, keeping the earliest firstSeen,
// and PRESERVING a status the user has edited), appends the run, and regenerates
// the human-readable SKILL_GAPS.md. History is never overwritten.
//
// Both tracker files live at the repo root on purpose: they are personal career
// meta, not site content, so they stay out of content/ and out of ENTITIES.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const DATA = join(ROOT, "skill-gaps.json");
const VIEW = join(ROOT, "SKILL_GAPS.md");

/* ------------------------------------------------------------------ payload */

const payloadPath = process.argv[2];
if (!payloadPath) {
  console.error("usage: gap-upsert.mjs <payload.json>");
  process.exit(2);
}
if (!existsSync(payloadPath)) {
  console.error(`no payload file at "${payloadPath}"`);
  process.exit(2);
}

let payload;
try {
  payload = JSON.parse(readFileSync(payloadPath, "utf8"));
} catch (e) {
  console.error(`payload isn't valid JSON: ${e.message}`);
  process.exit(2);
}

const run = payload.run;
if (!run || !run.company || !run.role) {
  console.error("payload.run needs at least { company, role } — got none");
  process.exit(2);
}
const incomingGaps = Array.isArray(payload.gaps) ? payload.gaps : [];
const today = run.date || new Date().toISOString().slice(0, 10);
const roleLabel = `${run.role} @ ${run.company}`;

/* ------------------------------------------------- existing data (CRLF-safe) */

let EOL = "\n";
let data = { version: 1, updated: today, runs: [], gaps: [] };
if (existsSync(DATA)) {
  const raw = readFileSync(DATA, "utf8");
  EOL = raw.includes("\r\n") ? "\r\n" : "\n";
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`skill-gaps.json exists but won't parse: ${e.message}`);
    process.exit(1);
  }
}
data.version ??= 1;
data.runs ??= [];
data.gaps ??= [];

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
const norm = (s) => String(s || "").trim().toLowerCase();

/* ------------------------------------------------------------- upsert gaps */

const byName = new Map(data.gaps.map((g) => [norm(g.skill), g]));
let added = 0;
let bumped = 0;

for (const incoming of incomingGaps) {
  const key = norm(incoming.skill);
  if (!key) continue;
  const existing = byName.get(key);

  if (existing) {
    existing.demandCount = (existing.demandCount ?? 0) + 1;
    existing.lastSeen = today;
    existing.roles = [...new Set([...(existing.roles ?? []), roleLabel])];
    // A sharper priority this time wins; a user-edited status is never reset.
    if (
      incoming.priority &&
      (PRIORITY_RANK[incoming.priority] ?? 9) < (PRIORITY_RANK[existing.priority] ?? 9)
    ) {
      existing.priority = incoming.priority;
    }
    if (incoming.category && !existing.category) existing.category = incoming.category;
    if (incoming.note) existing.note = incoming.note;
    bumped++;
  } else {
    const g = {
      skill: incoming.skill,
      category: incoming.category ?? "",
      demandCount: 1,
      firstSeen: today,
      lastSeen: today,
      roles: [roleLabel],
      priority: incoming.priority ?? "medium",
      status: incoming.status ?? "not-started",
      source: incoming.source ?? "jd",
      note: incoming.note ?? "",
    };
    data.gaps.push(g);
    byName.set(key, g);
    added++;
  }
}

/* --------------------------------------------------------------- append run */

data.runs.push({
  date: today,
  company: run.company,
  role: run.role,
  profileId: run.profileId ?? null,
  score: run.score ?? null,
  breakdown: run.breakdown ?? null,
  topGaps: Array.isArray(run.topGaps) ? run.topGaps : [],
});
data.updated = today;

/* ------------------------------------------------------- order for readers */

// Most-demanded first, then priority, then alphabetical — stable and obvious.
const gapsSorted = [...data.gaps].sort(
  (a, b) =>
    (b.demandCount ?? 0) - (a.demandCount ?? 0) ||
    (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9) ||
    String(a.skill).localeCompare(String(b.skill))
);
data.gaps = gapsSorted;

const runsRecent = [...data.runs].slice(-12).reverse();

/* -------------------------------------------------------------------- write */

const writeJson = (path, obj) =>
  writeFileSync(path, (JSON.stringify(obj, null, 2) + "\n").replace(/\n/g, EOL), "utf8");

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|");

function renderView() {
  const L = [];
  L.push("# Skill gaps — what to learn next");
  L.push("");
  L.push(
    "> Generated by `.claude/skills/evaluate-job-accuracy/scripts/gap-upsert.mjs`. " +
      "Every run of the `evaluate-job-accuracy` skill merges its findings here. " +
      "**Edit `status` in `skill-gaps.json`, not this file** — it is overwritten on each run."
  );
  L.push("");
  L.push(`_Last updated ${data.updated} · ${data.gaps.length} tracked gaps · ${data.runs.length} evaluations._`);
  L.push("");

  L.push("## Most-demanded gaps");
  L.push("");
  if (data.gaps.length) {
    L.push("| Skill | Category | Demand | Priority | Status | Source | Seen for | Note |");
    L.push("|---|---|---|---|---|---|---|---|");
    for (const g of data.gaps) {
      L.push(
        `| ${esc(g.skill)} | ${esc(g.category)} | ${g.demandCount ?? 0} | ${esc(g.priority)} | ` +
          `${esc(g.status)} | ${esc(g.source)} | ${esc((g.roles ?? []).join("; "))} | ${esc(g.note)} |`
      );
    }
  } else {
    L.push("_None recorded yet._");
  }
  L.push("");

  L.push("## Recent evaluations");
  L.push("");
  if (runsRecent.length) {
    L.push("| Date | Role | Score | Stack | Impact | Domain | ATS | Edu | Top gaps |");
    L.push("|---|---|---|---|---|---|---|---|---|");
    for (const r of runsRecent) {
      const b = r.breakdown ?? {};
      L.push(
        `| ${esc(r.date)} | ${esc(r.role)} @ ${esc(r.company)} | ${r.score ?? "—"}/100 | ` +
          `${b.stack ?? "—"} | ${b.impact ?? "—"} | ${b.domain ?? "—"} | ${b.ats ?? "—"} | ${b.education ?? "—"} | ` +
          `${esc((r.topGaps ?? []).join("; "))} |`
      );
    }
  } else {
    L.push("_None recorded yet._");
  }
  L.push("");
  return L.join(EOL);
}

writeJson(DATA, data);
writeFileSync(VIEW, renderView(), "utf8");

console.log(
  `skill-gaps: +${added} new, ${bumped} bumped · ${data.gaps.length} tracked · ` +
    `run ${roleLabel} scored ${run.score ?? "—"}/100`
);
