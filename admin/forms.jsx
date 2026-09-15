import { useMemo } from "react";
import { C } from "@/lib/theme";
import { Hover } from "@/lib/Hover";
import { yearLabel } from "@/lib/dates";
import {
  PROJECT_KINDS,
  EXPERIENCE_KINDS,
  ACCENT_PRESETS,
  slugify,
  initials,
} from "../tools/content-schema.js";
import { Field, Text, Area, Select, TagInput, ListEditor, Button, MonthInput } from "./ui";
import { input } from "./styles";
import { ImageDrop } from "./ImageDrop";
import { Placement } from "./Placement";

const two = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };

function Swatches({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      {ACCENT_PRESETS.map((hex) => (
        <Hover
          key={hex}
          as="button"
          onClick={() => onChange(hex)}
          title={hex}
          style={{
            width: 26,
            height: 26,
            background: hex,
            border: `2px solid ${value === hex ? C.ink : "transparent"}`,
            outline: `1px solid rgba(22,25,15,0.3)`,
            cursor: "pointer",
            padding: 0,
          }}
          hoverStyle={{ transform: "scale(1.12)" }}
        />
      ))}
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 34, height: 26, padding: 0, border: `1px solid ${C.ink}`, background: "none", cursor: "pointer" }}
        title="Custom colour"
      />
    </div>
  );
}

/* ---------------------------------------------------------------- project */

export function ProjectForm({ rec, all, patch, ctx }) {
  const errs = ctx.errorsFor(rec.id);
  const categories = useMemo(
    () => [...new Set(all.map((p) => p.category).filter(Boolean))].sort(),
    [all]
  );

  return (
    <div>
      <div style={two}>
        <Field label="Title" error={errs["title"]}>
          <Text
            value={rec.title}
            onChange={(v) => {
              // Track the title until the record is first saved; after that the
              // id is a stable key and renaming the title must not move it.
              const next = { title: v };
              if (rec._isNew) {
                next.id = slugify(v) || rec.id;
                next.code = initials(v);
              }
              patch(next);
            }}
            placeholder="ShelfSmart"
          />
        </Field>
        <Field label="Category" hint="Free text; existing values offered.">
          <input
            style={input}
            list="admin-categories"
            value={rec.category ?? ""}
            onChange={(e) => patch({ category: e.target.value })}
            placeholder="AI / EDTECH"
          />
          <datalist id="admin-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
      </div>

      <div style={two}>
        <Field label="Start" error={errs["start"]}>
          <MonthInput value={rec.start} onChange={(v) => patch({ start: v })} />
        </Field>
        <Field label="End" error={errs["end"]} hint={`Card will read "${yearLabel(rec.start, rec.end) || "—"}"`}>
          <MonthInput value={rec.end} onChange={(v) => patch({ end: v })} allowPresent presentLabel="Ongoing" />
        </Field>
      </div>

      <div style={two}>
        <Field label="Kind" error={errs["kind"]}>
          <Select value={rec.kind} onChange={(v) => patch({ kind: v })} options={PROJECT_KINDS} />
        </Field>
        <Field label="Accent" error={errs["accent"]}>
          <Swatches value={rec.accent} onChange={(v) => patch({ accent: v })} />
        </Field>
      </div>

      <Field label="Summary" hint="One line, shown on the card.">
        <Text value={rec.summary} onChange={(v) => patch({ summary: v })} />
      </Field>

      <Field label="Description" hint="Full paragraph, shown on the project page.">
        <Area value={rec.description} onChange={(v) => patch({ description: v })} rows={4} />
      </Field>

      <Field label="Image" error={errs["image"]}>
        <ImageDrop
          value={rec.image}
          onChange={(v) => patch({ image: v })}
          kind="projects"
          suggestedName={slugify(rec.title || rec.id || "project")}
        />
      </Field>

      <Field label="Skills used" error={errs["tech"]} hint="Type to search. Unrecognised entries are marked NEW and can be filed into a skill category on save.">
        <TagInput
          value={rec.tech || []}
          onChange={(v) => patch({ tech: v })}
          suggestions={ctx.allTech}
          known={ctx.knownTech}
          placeholder="React, Python…"
        />
      </Field>

      <div style={two}>
        <Field label="Live link">
          <Text value={rec.link} onChange={(v) => patch({ link: v })} placeholder="https://" />
        </Field>
        <Field label="Source link">
          <Text value={rec.github} onChange={(v) => patch({ github: v })} placeholder="https://github.com/…" />
        </Field>
      </div>

      <Field label="Résumé bullets" hint="Used on /resume/ only. Leave empty to omit this project from the résumé body.">
        <ListEditor value={rec.bullets || []} onChange={(v) => patch({ bullets: v })} placeholder="Achievement, with a number if you have one." />
      </Field>

      <div style={two}>
        <Field label="Include on résumé">
          <Select
            value={rec.resume?.include ? "yes" : "no"}
            onChange={(v) => patch({ resume: { ...rec.resume, include: v === "yes" } })}
            options={[["yes", "Yes"], ["no", "No"]]}
          />
        </Field>
        <Field label="Résumé order" hint="Lower first. Blank = by date.">
          <Text
            value={rec.resume?.order ?? ""}
            onChange={(v) => patch({ resume: { ...rec.resume, order: v === "" ? null : Number(v) } })}
            type="number"
          />
        </Field>
      </div>

      <Field label="Pin" hint="Overrides date ordering. Lower is earlier. Blank = purely chronological.">
        <Text
          value={rec.pin ?? ""}
          onChange={(v) => patch({ pin: v === "" ? null : Number(v) })}
          type="number"
          style={{ ...input, width: 120 }}
        />
      </Field>

      <Placement
        record={rec}
        siblings={all.filter((p) => p.kind === rec.kind)}
        labelOf={(p) => p.title}
        scope={`${rec.kind} projects`}
        sliceNote={{ count: rec.kind === "personal" ? 6 : 3, of: `${rec.kind} projects` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- experience */

export function ExperienceForm({ rec, all, patch, ctx }) {
  const errs = ctx.errorsFor(rec.id);
  const companies = useMemo(
    () => [...new Set(all.map((e) => e.company).filter(Boolean))].sort(),
    [all]
  );

  return (
    <div>
      <div style={two}>
        <Field label="Role" error={errs["role"]}>
          <Text
            value={rec.role}
            onChange={(v) => {
              const next = { role: v };
              if (rec._isNew) next.id = slugify(`${rec.company || ""}-${v}`) || rec.id;
              patch(next);
            }}
            placeholder="Software Engineering Intern"
          />
        </Field>
        <Field label="Company / Org" error={errs["company"]} hint="Existing values offered; picking one fills the location.">
          <input
            style={input}
            list="admin-companies"
            value={rec.company ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              const match = all.find((x) => x.company === v);
              patch(match ? { company: v, location: match.location } : { company: v });
            }}
          />
          <datalist id="admin-companies">
            {companies.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
      </div>

      <div style={two}>
        <Field label="Unit / Project" hint="Optional. Renders as “Company — Unit”.">
          <Text value={rec.unit ?? ""} onChange={(v) => patch({ unit: v || null })} />
        </Field>
        <Field label="Location">
          <Text value={rec.location ?? ""} onChange={(v) => patch({ location: v })} />
        </Field>
      </div>

      <div style={two}>
        <Field label="Start" error={errs["start"]}>
          <MonthInput value={rec.start} onChange={(v) => patch({ start: v })} />
        </Field>
        <Field label="End" error={errs["end"]} hint="Ongoing shows the ● ACTIVE badge and sorts to the top.">
          <MonthInput value={rec.end} onChange={(v) => patch({ end: v })} allowPresent />
        </Field>
      </div>

      <div style={two}>
        <Field label="Kind" error={errs["kind"]} hint="Only “work” appears under EXPERIENCE on the résumé.">
          <Select value={rec.kind} onChange={(v) => patch({ kind: v })} options={EXPERIENCE_KINDS} />
        </Field>
        <Field label="Linked project" hint="Optional cross-reference.">
          <Select
            value={rec.projectId ?? ""}
            onChange={(v) => patch({ projectId: v || null })}
            options={[["", "— none —"], ...ctx.projectOptions]}
          />
        </Field>
      </div>

      <Field label="Description" hint="Shown on the site's experience table.">
        <Area value={rec.description} onChange={(v) => patch({ description: v })} rows={4} />
      </Field>

      <Field label="Résumé bullets">
        <ListEditor value={rec.bullets || []} onChange={(v) => patch({ bullets: v })} />
      </Field>

      <Field label="Skills used" error={errs["tech"]}>
        <TagInput
          value={rec.tech || []}
          onChange={(v) => patch({ tech: v })}
          suggestions={ctx.allTech}
          known={ctx.knownTech}
          placeholder="Python, Azure…"
        />
      </Field>

      <div style={two}>
        <Field label="Include on résumé">
          <Select
            value={rec.resume?.include ? "yes" : "no"}
            onChange={(v) => patch({ resume: { ...rec.resume, include: v === "yes" } })}
            options={[["yes", "Yes"], ["no", "No"]]}
          />
        </Field>
        <Field label="Pin" hint="Blank = chronological.">
          <Text value={rec.pin ?? ""} onChange={(v) => patch({ pin: v === "" ? null : Number(v) })} type="number" />
        </Field>
      </div>

      <Placement
        record={rec}
        siblings={all}
        labelOf={(e) => `${e.role} — ${e.company}`}
        scope="the timeline"
      />
    </div>
  );
}

/* ----------------------------------------------------------- testimonials */

export function TestimonialForm({ rec, patch }) {
  return (
    <div>
      <Field label="Quote">
        <Area value={rec.quote} onChange={(v) => patch({ quote: v })} rows={4} />
      </Field>
      <div style={two}>
        <Field label="Author">
          <Text
            value={rec.author}
            onChange={(v) => patch(rec._isNew ? { author: v, id: slugify(v) || rec.id } : { author: v })}
          />
        </Field>
        <Field label="Role">
          <Text value={rec.role} onChange={(v) => patch({ role: v })} />
        </Field>
      </div>
      <Field label="Avatar">
        <ImageDrop value={rec.avatar} onChange={(v) => patch({ avatar: v })} kind="avatars" suggestedName={slugify(rec.author || "avatar")} />
      </Field>
    </div>
  );
}
