// Date helpers for content records.
//
// Content stores machine-readable "YYYY-MM" strings (or null for "ongoing").
// Every human-facing date string on the site and the résumé is derived here, so
// there is exactly one place that decides how a period reads.

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTHS_TITLE = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const YM_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

/** "2026-04" -> { y: 2026, m: 4 }. Returns null for null/invalid input. */
function parseYM(ym) {
  if (typeof ym !== "string" || !YM_RE.test(ym)) return null;
  return { y: Number(ym.slice(0, 4)), m: Number(ym.slice(5, 7)) };
}

/**
 * Sortable integer for a "YYYY-MM". null (ongoing) sorts as Infinity so that
 * ongoing entries lead a descending sort.
 */
export function ymKey(ym) {
  const p = parseYM(ym);
  return p ? p.y * 12 + p.m : Infinity;
}

/** "2026-04" -> "APR 2026" (or "Apr 2026" with { title: true }). */
export function fmtYM(ym, { title = false } = {}) {
  const p = parseYM(ym);
  if (!p) return "";
  return `${(title ? MONTHS_TITLE : MONTHS)[p.m - 1]} ${p.y}`;
}

/** "2026-04" -> 2026. */
export function yearOf(ym) {
  const p = parseYM(ym);
  return p ? p.y : null;
}

/**
 * Display string for a date range, matching the strings the site shipped with:
 *   start === end        -> "SEP 2025"
 *   end == null          -> "APR 2026 — PRESENT"
 *   otherwise            -> "APR 2026 — AUG 2026"
 * The separator is an em dash (U+2014) with surrounding spaces.
 */
export function periodLabel(start, end, { title = false, present = "PRESENT" } = {}) {
  const a = fmtYM(start, { title });
  if (!a) return "";
  if (end == null) return `${a} — ${title ? "Present" : present}`;
  if (end === start) return a;
  return `${a} — ${fmtYM(end, { title })}`;
}

/**
 * Single-year label used on project cards:
 *   ongoing        -> start year
 *   same year      -> that year
 *   spans years    -> "2025–2026" (en dash)
 */
export function yearLabel(start, end) {
  const sy = yearOf(start);
  const ey = yearOf(end);
  if (sy == null) return "";
  if (ey == null) return String(sy);
  return sy === ey ? String(sy) : `${sy}–${ey}`;
}

/** Descending compare that is Infinity-safe (Infinity - Infinity is NaN). */
function cmpDesc(a, b) {
  if (a === b) return 0;
  return a < b ? 1 : -1;
}

/**
 * Newest-first ordering for projects and experiences.
 *
 * 1. `pin` ascending wins outright (unpinned = Infinity, so pinned entries lead).
 * 2. Then most-recently-*ended* first, with ongoing (end: null) ahead of everything.
 * 3. Then most-recently-*started* first.
 *
 * Ties fall through to the order the records appear in their JSON file, because
 * Array.prototype.sort is stable.
 */
export function byRecency(a, b) {
  const pa = a.pin ?? Infinity;
  const pb = b.pin ?? Infinity;
  if (pa !== pb) return pa - pb;

  const endCmp = cmpDesc(ymKey(a.end), ymKey(b.end));
  if (endCmp !== 0) return endCmp;

  return cmpDesc(ymKey(a.start), ymKey(b.start));
}
