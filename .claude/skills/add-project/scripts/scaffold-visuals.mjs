#!/usr/bin/env node
// Fills in the two visual fields a new project can't supply on its own:
//
//   node .claude/skills/add-project/scripts/scaffold-visuals.mjs --id <project-id> [--force]
//
// * accent — the first unused ACCENT_PRESETS hex. When the presets are used up
//   (they were, at 11 projects) it derives a new on-brand one at the hue
//   furthest from every accent already in play, and appends it to the presets
//   so the admin's colour picker offers it too.
// * image — a Deckplate-styled 1280x720 placeholder at public/projects/<id>.png,
//   so the card has something to show until a real screenshot exists. Without
//   one the components render `url(null)`, which is a broken request.
//
// Re-running is safe: it only fills what's missing unless --force is passed.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { canvas, rgb, blend } from "./lib/png.mjs";
import { glyph, GLYPH_W, GLYPH_H, textWidth } from "./lib/font.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SCHEMA = join(ROOT, "tools", "content-schema.js");
const { ACCENT_PRESETS, HEX_RE } = await import(pathToFileURL(SCHEMA).href);

const args = process.argv.slice(2);
const id = args[args.indexOf("--id") + 1];
const force = args.includes("--force");
if (!args.includes("--id") || !id) {
  console.error("usage: scaffold-visuals.mjs --id <project-id> [--force]");
  process.exit(2);
}

/* ------------------------------------------------- content io (CRLF-safe) */

const PROJECTS = join(ROOT, "content", "projects.json");
const rawProjects = readFileSync(PROJECTS, "utf8");
const EOL = rawProjects.includes("\r\n") ? "\r\n" : "\n";
const projects = JSON.parse(rawProjects);

const writeProjects = () =>
  writeFileSync(
    PROJECTS,
    (JSON.stringify(projects, null, 2) + "\n").replace(/\n/g, EOL),
    "utf8"
  );

const rec = projects.find((p) => p.id === id);
if (!rec) {
  console.error(`no project with id "${id}" — add the record first`);
  process.exit(2);
}

const did = [];

/* ------------------------------------------------------------- 1. accent */

const hslOf = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h =
    max === r ? 60 * (((g - b) / d) % 6) : max === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  return [(h + 360) % 360, s, l];
};

const hexOf = ([h, s, l]) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
};

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

/** Relative luminance (WCAG). Two hues at the same HSL lightness can differ
 *  wildly here — which is why matching lightness alone yields an acid lime
 *  beside a set of earthy blues. */
const luminance = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** The lightness that puts hue `h` at the palette's typical luminance. */
function lightnessFor(h, s, target) {
  let lo = 0.05, hi = 0.95;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (luminance(hexOf([h, s, mid])) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function pickAccent(taken) {
  const free = ACCENT_PRESETS.filter((p) => !taken.has(p.toLowerCase()));
  if (free.length) return { hex: free[0], fromPreset: true };

  // Presets exhausted: place the new hue as far as possible from every hue in
  // use, keeping the palette's saturation/lightness so it stays on-brand.
  const hues = [...taken].map((h) => hslOf(h)[0]);
  let best = 0, bestGap = -1;
  for (let h = 0; h < 360; h += 1) {
    const gap = Math.min(...hues.map((u) => Math.min(Math.abs(h - u), 360 - Math.abs(h - u))));
    if (gap > bestGap) { bestGap = gap; best = h; }
  }
  const sat = median(ACCENT_PRESETS.map((p) => hslOf(p)[1]));
  const target = median(ACCENT_PRESETS.map(luminance));
  return {
    hex: hexOf([best, sat, lightnessFor(best, sat, target)]),
    fromPreset: false,
    gap: bestGap,
  };
}

const takenBy = (p) => p.id !== id && HEX_RE.test(p.accent || "");
const taken = new Set(projects.filter(takenBy).map((p) => p.accent.toLowerCase()));
const accentClashes = HEX_RE.test(rec.accent || "") && taken.has(rec.accent.toLowerCase());

if (force || !HEX_RE.test(rec.accent || "") || accentClashes) {
  const { hex, fromPreset, gap } = pickAccent(taken);
  rec.accent = hex;
  did.push(
    `accent ${hex}` +
      (fromPreset ? " (unused preset)" : ` (derived — presets exhausted, ${Math.round(gap)}° from the nearest accent in use)`)
  );

  if (!fromPreset) {
    const src = readFileSync(SCHEMA, "utf8");
    const seol = src.includes("\r\n") ? "\r\n" : "\n";
    const m = src.match(/(export const ACCENT_PRESETS = \[[\s\S]*?)(\r?\n\];)/);
    if (m && !src.includes(hex)) {
      const body = m[1].replace(/,\s*$/, "");
      writeFileSync(SCHEMA, src.replace(m[0], `${body},${seol}  "${hex}",${m[2]}`), "utf8");
      did.push(`appended ${hex} to ACCENT_PRESETS in tools/content-schema.js`);
    } else {
      did.push(`! add "${hex}" to ACCENT_PRESETS by hand — the array wasn't matched`);
    }
  }
}

/* ------------------------------------------------------------- 2. image */

const imgRel = `/projects/${id}.png`;
const imgAbs = join(ROOT, "public", "projects", `${id}.png`);
const imageMissing = !rec.image || !existsSync(join(ROOT, "public", String(rec.image).replace(/^\//, "")));

if (force || imageMissing) {
  writeFileSync(imgAbs, placeholder(rec));
  rec.image = imgRel;
  did.push(`placeholder public/projects/${id}.png (1280x720)`);
}

writeProjects();
console.log(did.length ? did.map((d) => "  - " + d).join("\n") : "  - nothing to do (use --force to regenerate)");

/* ------------------------------------------------------- the placeholder */

function placeholder(p) {
  const W = 1280, H = 720;
  const INK = rgb("#16190f"), PAPER = rgb("#f1ede2"), TAN = rgb("#cdbb96");
  const ACC = rgb(p.accent);
  const c = canvas(W, H, PAPER);

  // Diagonal deckplate hatch.
  for (let d = -H; d < W + H; d += 26)
    for (let y = 0; y < H; y++)
      for (let t = 0; t < 3; t++) c.set(d + y + t, y, blend(c.get(Math.min(Math.max(d + y + t, 0), W - 1), y), ACC, 0.1));

  const code = String(p.code || "??").slice(0, 3).toUpperCase();
  const cs = 26;

  // Tan field sized to the code itself, with a solid accent spine on its left
  // edge — a full-width band leaves the two letters floating in dead space.
  const fw = textWidth(code, cs) + 160, fh = GLYPH_H * cs + 120;
  const fx = Math.round((W - fw) / 2), fy = 170;
  c.rect(fx, fy, fw, fh, TAN, 0.55);
  c.rect(fx, fy, 10, fh, ACC);

  const text = (s, x, y, scale, colour, gap = 1) => {
    let cx = x;
    for (const ch of s) {
      const g = glyph(ch);
      for (let gy = 0; gy < GLYPH_H; gy++)
        for (let gx = 0; gx < GLYPH_W; gx++)
          if (g[gy][gx]) c.rect(cx + gx * scale, y + gy * scale, scale, scale, colour);
      cx += (GLYPH_W + gap) * scale;
    }
  };

  // Project code, large and centred in the field.
  text(code, Math.round((W - textWidth(code, cs)) / 2), fy + Math.round((fh - GLYPH_H * cs) / 2), cs, INK);

  // Deckplate-voice labels above and below.
  const cap = "NO IMAGE ON RECORD";
  text(cap, Math.round((W - textWidth(cap, 4)) / 2), fy + fh + 46, 4, ACC);
  const slug = String(p.id).toUpperCase().slice(0, 30);
  text(slug, 96, 96, 3, INK);
  text(String(p.category || "").slice(0, 30), 96, H - 120, 3, INK);

  // Registration marks and frame.
  c.rect(W - 128, 88, 32, 32, ACC);
  for (const [x, y, w, h] of [[0,0,W,6],[0,H-6,W,6],[0,0,6,H],[W-6,0,6,H]]) c.rect(x, y, w, h, INK);
  return c.toPNG();
}
