// Shared content rules — imported by BOTH the Vite plugin (Node, validates
// before writing) and the admin UI (browser, validates before submitting).
// Keeping one copy means the UI can never disagree with what the server
// accepts.

export const ENTITIES = [
  "projects",
  "experiences",
  "skills",
  "testimonials",
  "about",
  "metrics",
  "profile",
];

export const YM_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
export const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export const PROJECT_KINDS = ["personal", "enterprise"];
export const EXPERIENCE_KINDS = ["work", "project", "hackathon", "competition", "leadership"];

// Seeded from the palette already in use so new entries stay on-brand.
// Auto-deriving a colour from a hash produces muddy near-duplicates.
export const ACCENT_PRESETS = [
  "#16b364", "#22c55e", "#2563eb", "#0284c7", "#f97316", "#0d9488",
  "#7c3aed", "#db2777", "#4f46e5", "#dc2626", "#b45309",
];

/** URL/file-safe slug. Never run tech names through this ("C/C++", "C#"). */
export function slugify(s) {
  return String(s)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** "Enterprise Wi-Fi Portal" -> "EW" (initials, for the display code). */
export function initials(title) {
  const words = String(title).split(/[\s\-—/]+/).filter(Boolean);
  return (words.slice(0, 2).map((w) => w[0]).join("") || "XX").toUpperCase();
}

/**
 * Best-guess skill category for a newly typed tech token, so the admin can
 * pre-select rather than making the user classify every new entry.
 */
const CATEGORY_HINTS = [
  [/^(react|next|vue|svelte|angular|tailwind|styled|figma|expo|remix)/i, "frontend"],
  [/(sql|postgres|mysql|mongo|supabase|firebase|prisma|redis|sqlite|express|fastapi|node)/i, "backend"],
  [/(aws|gcp|azure|vercel|docker|kubernetes|netlify|github|gitlab|\bgit\b|terraform|ci\/cd)/i, "cloud"],
  [/(torch|tensor|opencv|pandas|numpy|llm|gpt|gemini|openrouter|claude|yolo|vitpose|sklearn|keras)/i, "ai"],
  [/(unity|unreal|arduino|raspberry|altium|autocad|blender|solidworks|vr|ar|iot|sensor)/i, "hardware"],
  [/(power\s?(bi|apps|platform)|sharepoint|n8n|zapier|salesforce|excel)/i, "enterprise"],
  [/^(python|javascript|typescript|java|c\+\+|c#|c\/c\+\+|go|rust|ruby|php|swift|kotlin|html|css|sql)$/i, "languages"],
];

export function guessCategory(token) {
  for (const [re, id] of CATEGORY_HINTS) if (re.test(token)) return id;
  return "languages";
}

/* ----------------------------------------------------------- validation */

const err = (path, message) => ({ path, message });

function checkPeriod(rec, prefix, out) {
  if (!YM_RE.test(rec.start || "")) {
    out.push(err(`${prefix}.start`, "start must be YYYY-MM"));
  }
  if (rec.end != null) {
    if (!YM_RE.test(rec.end)) {
      out.push(err(`${prefix}.end`, "end must be YYYY-MM or empty for ongoing"));
    } else if (YM_RE.test(rec.start || "") && rec.end < rec.start) {
      out.push(err(`${prefix}.end`, "end is before start"));
    }
  }
}

function checkUniqueIds(list, prefix, out) {
  const seen = new Set();
  list.forEach((r, i) => {
    if (!r.id) out.push(err(`${prefix}[${i}].id`, "id is required"));
    else if (seen.has(r.id)) out.push(err(`${prefix}[${i}].id`, `duplicate id "${r.id}"`));
    seen.add(r.id);
  });
}

/**
 * Validate a whole entity document. Returns an array of {path, message};
 * empty means valid. Never let an invalid document reach disk — a malformed
 * JSON file breaks the dev server AND the production build.
 */
export function validate(entity, doc) {
  const out = [];

  switch (entity) {
    case "projects": {
      if (!Array.isArray(doc)) return [err("", "projects must be an array")];
      checkUniqueIds(doc, "projects", out);
      doc.forEach((p, i) => {
        const at = `projects[${i}]`;
        if (!p.title?.trim()) out.push(err(`${at}.title`, "title is required"));
        if (!PROJECT_KINDS.includes(p.kind)) {
          out.push(err(`${at}.kind`, `kind must be one of ${PROJECT_KINDS.join(", ")}`));
        }
        if (!HEX_RE.test(p.accent || "")) out.push(err(`${at}.accent`, "accent must be #rrggbb"));
        if (p.image && !String(p.image).startsWith("/")) {
          out.push(err(`${at}.image`, "image must be a site-root path starting with /"));
        }
        if (!Array.isArray(p.tech) || p.tech.length === 0) {
          out.push(err(`${at}.tech`, "at least one technology is required"));
        }
        checkPeriod(p, at, out);
      });
      break;
    }

    case "experiences": {
      if (!Array.isArray(doc)) return [err("", "experiences must be an array")];
      checkUniqueIds(doc, "experiences", out);
      doc.forEach((e, i) => {
        const at = `experiences[${i}]`;
        if (!e.role?.trim()) out.push(err(`${at}.role`, "role is required"));
        if (!e.company?.trim()) out.push(err(`${at}.company`, "company is required"));
        if (!EXPERIENCE_KINDS.includes(e.kind)) {
          out.push(err(`${at}.kind`, `kind must be one of ${EXPERIENCE_KINDS.join(", ")}`));
        }
        if (!Array.isArray(e.tech)) out.push(err(`${at}.tech`, "tech must be an array"));
        checkPeriod(e, at, out);
      });
      break;
    }

    case "skills": {
      if (!Array.isArray(doc?.categories)) {
        return [err("categories", "skills.categories must be an array")];
      }
      if (doc.ignored != null && !Array.isArray(doc.ignored)) {
        out.push(err("ignored", "ignored must be an array of strings"));
      }
      const ids = new Set();
      const items = new Set();
      doc.categories.forEach((c, i) => {
        const at = `categories[${i}]`;
        if (!c.id) out.push(err(`${at}.id`, "id is required"));
        else if (ids.has(c.id)) out.push(err(`${at}.id`, `duplicate category id "${c.id}"`));
        ids.add(c.id);
        if (!c.label?.trim()) out.push(err(`${at}.label`, "label is required"));
        if (!Array.isArray(c.items)) out.push(err(`${at}.items`, "items must be an array"));
        else {
          c.items.forEach((it) => {
            const key = it.toLowerCase();
            if (items.has(key)) {
              out.push(err(`${at}.items`, `"${it}" already appears in another category`));
            }
            items.add(key);
          });
        }
      });
      break;
    }

    case "testimonials": {
      if (!Array.isArray(doc)) return [err("", "testimonials must be an array")];
      checkUniqueIds(doc, "testimonials", out);
      doc.forEach((t, i) => {
        const at = `testimonials[${i}]`;
        if (!t.quote?.trim()) out.push(err(`${at}.quote`, "quote is required"));
        if (!t.author?.trim()) out.push(err(`${at}.author`, "author is required"));
      });
      break;
    }

    case "about": {
      if (!Array.isArray(doc?.paragraphs) || doc.paragraphs.length === 0) {
        out.push(err("paragraphs", "at least one paragraph is required"));
      }
      if (!Array.isArray(doc?.highlights)) {
        out.push(err("highlights", "highlights must be an array"));
      }
      break;
    }

    case "metrics": {
      for (const k of ["peopleHelped", "moneySaved"]) {
        if (typeof doc?.[k] !== "number" || Number.isNaN(doc[k])) {
          out.push(err(k, `${k} must be a number`));
        }
      }
      for (const k of ["peopleHelpedBreakdown", "moneySavedBreakdown"]) {
        if (!Array.isArray(doc?.[k])) out.push(err(k, `${k} must be an array`));
      }
      break;
    }

    case "profile": {
      if (!doc?.name?.trim()) out.push(err("name", "name is required"));
      if (!doc?.contact?.email?.trim()) out.push(err("contact.email", "email is required"));
      if (!Array.isArray(doc?.education) || doc.education.length === 0) {
        out.push(err("education", "at least one education entry is required"));
      } else {
        doc.education.forEach((ed, i) => {
          const at = `education[${i}]`;
          if (!ed.school?.trim()) out.push(err(`${at}.school`, "school is required"));
          checkPeriod(ed, at, out);
        });
      }
      break;
    }

    default:
      return [err("", `unknown entity "${entity}"`)];
  }

  return out;
}
