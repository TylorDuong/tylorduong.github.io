// What the résumé shows, as data.
//
// Stores what is HIDDEN rather than what is shown, so "everything checked" is
// the empty selection and content added after a preset was saved appears
// automatically instead of being silently excluded.

import { projects, experiences, skillGroups } from "@/data";

export const CONTACT_ORDER = ["phone", "email", "location", "linkedin", "website", "github"];

export const CONTACT_LABELS = {
  phone: "Phone",
  email: "Email",
  location: "Location",
  linkedin: "LinkedIn",
  website: "Website",
  github: "GitHub",
};

export function allSelected() {
  return {
    version: 1,
    hiddenProjects: [],
    hiddenExperiences: [],
    hiddenSkills: {},
    hideSummary: false,
    hideCoursework: false,
    hiddenContact: [],
  };
}

export function noneSelected() {
  return {
    ...allSelected(),
    hiddenProjects: projects.map((p) => p.id),
    hiddenExperiences: experiences.map((e) => e.id),
    hiddenSkills: Object.fromEntries(skillGroups.map((g) => [g.id, [...g.items]])),
    hideSummary: true,
    hideCoursework: true,
    hiddenContact: [...CONTACT_ORDER],
  };
}

// The `resume.include` flags in content/*.json, expressed as a selection.
// This is what the production page renders.
export function curatedSelection() {
  return {
    ...allSelected(),
    hiddenProjects: projects.filter((p) => !p.resume?.include).map((p) => p.id),
    hiddenExperiences: experiences.filter((e) => !e.resume?.include).map((e) => e.id),
  };
}

const strings = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);

/** Coerce an imported or hand-edited selection into a usable shape. */
export function normalizeSelection(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const skills = {};
  if (src.hiddenSkills && typeof src.hiddenSkills === "object") {
    for (const [id, items] of Object.entries(src.hiddenSkills)) {
      const kept = strings(items);
      if (kept.length) skills[id] = kept;
    }
  }
  return {
    version: 1,
    hiddenProjects: strings(src.hiddenProjects),
    hiddenExperiences: strings(src.hiddenExperiences),
    hiddenSkills: skills,
    hideSummary: src.hideSummary === true,
    hideCoursework: src.hideCoursework === true,
    hiddenContact: strings(src.hiddenContact).filter((k) => CONTACT_ORDER.includes(k)),
  };
}

export function visibleContactKeys(selection) {
  return CONTACT_ORDER.filter((k) => !selection.hiddenContact.includes(k));
}

export function deriveVisible(selection) {
  const shownExp = experiences.filter((e) => !selection.hiddenExperiences.includes(e.id));

  return {
    workExperience: shownExp.filter((e) => e.kind === "work"),

    // Hackathons / competitions no project record already covers.
    activities: shownExp.filter((e) => e.kind !== "work"),

    resumeProjects: projects
      .filter((p) => !selection.hiddenProjects.includes(p.id))
      .sort((a, b) => (a.resume?.order ?? Infinity) - (b.resume?.order ?? Infinity)),

    visibleSkillGroups: skillGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => !selection.hiddenSkills[g.id]?.includes(it)),
      }))
      .filter((g) => g.items.length > 0),

    showSummary: !selection.hideSummary,
    showCoursework: !selection.hideCoursework,
  };
}
