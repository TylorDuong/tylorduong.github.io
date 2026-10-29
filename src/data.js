// Adapter over the JSON content files in /content.
//
// Content is authored as machine-readable JSON (structured "YYYY-MM" dates,
// skills grouped by category) so the local admin tool can safely read and write
// it. Everything human-facing — period strings, year labels, the flat skills
// list, ordering — is DERIVED here, so the site components stay unchanged and
// there is a single place that decides how content reads.
//
// Edit /content/*.json (or run `npm run admin`), never this file.

import projectsRaw from "@content/projects.json";
import experiencesRaw from "@content/experiences.json";
// Named import (not the default) so bundlers can tree-shake `categories` from
// the admin-only `_comment`/`ignored` fields in the same file, keeping those
// out of the production bundle.
import { categories as skillCategories } from "@content/skills.json";
import testimonialsRaw from "@content/testimonials.json";
import aboutRaw from "@content/about.json";
import metricsRaw from "@content/metrics.json";
import profileRaw from "@content/profile.json";

import { byRecency, periodLabel, yearLabel, fmtYM } from "@/lib/dates";
import { toGallery } from "@/lib/video";

/* ---------------------------------------------------------------- projects */

// `year` and `tags` are derived aliases kept so ProjectCard, ProjectIndex,
// ProjectDetail and App consume the same field names they always have.
export const projects = [...projectsRaw].sort(byRecency).map((p) => ({
  ...p,
  year: yearLabel(p.start, p.end),
  period: periodLabel(p.start, p.end, { title: true }),
  tags: p.tech,
  current: p.end == null,
  // Normalized carousel slides (video + images). Always at least one slide,
  // falling back to the thumbnail, so components never special-case gallery-less
  // projects. See src/lib/video.js (toGallery) and components/Gallery.jsx.
  gallery: toGallery(p.gallery, p.image),
}));

/* ------------------------------------------------------------- experiences */

// `period`, `current`, `company` and `technologies` are derived so
// sections/Experience.jsx renders exactly as before.
export const experiences = [...experiencesRaw].sort(byRecency).map((e) => ({
  ...e,
  period: periodLabel(e.start, e.end),
  current: e.end == null,
  company: e.unit ? `${e.company} — ${e.unit}` : e.company,
  companyName: e.company,
  technologies: e.tech,
}));

/* ------------------------------------------------------------------ skills */

export const skillGroups = skillCategories;

// Flat list, back-compatible with the original `skills` export.
export const skills = skillGroups.flatMap((g) => g.items);

// Union of every skill and every tech tag used anywhere — powers autocomplete
// in the admin tool.
export const allTech = [
  ...new Set([
    ...skills,
    ...projectsRaw.flatMap((p) => p.tech),
    ...experiencesRaw.flatMap((e) => e.tech),
  ]),
].sort((a, b) => a.localeCompare(b));

/* ----------------------------------------------------------------- profile */

export const profile = profileRaw;
export const contact = profileRaw.contact;
export const education = profileRaw.education;

// "B.S. COMPUTER SCIENCE — ARIZONA STATE UNIVERSITY — MAY 2028"
export const educationLine = education
  .map((ed) => [ed.degree, ed.school, fmtYM(ed.end)].join(" — ").toUpperCase())
  .join("  /  ");

/* -------------------------------------------------------- featured project */

// The single project spotlighted at the top of the home page. `mode: "recent"`
// tracks the most recent project automatically (projects[0], already sorted by
// byRecency); `mode: "specific"` pins it to a chosen id. The section renders
// the project's derived `gallery` (video-first carousel), so no extra media
// derivation is needed here.
export const featuredProject = (() => {
  const cfg = profileRaw.featured || { mode: "recent", projectId: null };
  const pick =
    cfg.mode === "specific" && cfg.projectId
      ? projects.find((p) => p.id === cfg.projectId)
      : projects[0];
  return pick || projects[0] || null;
})();

/* ------------------------------------------------------- passthrough content */

export const metrics = metricsRaw;
export const testimonials = testimonialsRaw;
export const highlights = aboutRaw.highlights;
export const about = {
  paragraphs: aboutRaw.paragraphs,
  quote: aboutRaw.quote,
};
