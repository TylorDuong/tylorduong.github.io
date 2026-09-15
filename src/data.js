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

/* ---------------------------------------------------------------- projects */

// `year` and `tags` are derived aliases kept so ProjectCard, ProjectIndex,
// ProjectDetail and App consume the same field names they always have.
export const projects = [...projectsRaw].sort(byRecency).map((p) => ({
  ...p,
  year: yearLabel(p.start, p.end),
  tags: p.tech,
  current: p.end == null,
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

/* ------------------------------------------------------- passthrough content */

export const metrics = metricsRaw;
export const testimonials = testimonialsRaw;
export const highlights = aboutRaw.highlights;
export const about = {
  paragraphs: aboutRaw.paragraphs,
  quote: aboutRaw.quote,
};
