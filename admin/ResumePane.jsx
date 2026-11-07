// Résumé profiles manager. A profile is a named selection of what the résumé
// shows — stored in content/resume-profiles.json and edited here, with one
// marked "active" to drive the live /resume/ page. The selection object uses
// the "store what is HIDDEN" model from src/resume/selection.js, so content
// added after a profile was saved appears automatically instead of being
// silently dropped.

import { useEffect, useRef, useState } from "react";
import { projects, experiences, skillGroups } from "@/data";
import {
  CONTACT_ORDER,
  CONTACT_LABELS,
  allSelected,
  noneSelected,
  curatedSelection,
} from "@/resume/selection";
import { C, F, mono } from "@/lib/theme";
import { Hover } from "@/lib/Hover";
import { Button, Field, Text } from "./ui";

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

const blankProfile = () => ({
  id: `profile-${Date.now()}`,
  name: "New profile",
  selection: allSelected(),
});

/* --------------------------------------------------------------- checkboxes */

function Check({ checked, onChange, label, indent, muted }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 7, padding: "2px 0", paddingLeft: indent ? 18 : 0, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span style={{ fontFamily: F.body, fontSize: muted ? 11.5 : 12, lineHeight: 1.3, color: muted ? "rgba(22,25,15,0.7)" : C.ink }}>
        {label}
      </span>
    </label>
  );
}

// React has no `indeterminate` prop — it only exists on the DOM node.
function TriCheck({ state, onChange, label }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = state === "some";
  }, [state]);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 7, padding: "2px 0", marginTop: 6, cursor: "pointer" }}>
      <input ref={ref} type="checkbox" checked={state === "all"} onChange={onChange} />
      <span style={{ fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.ink }}>{label}</span>
    </label>
  );
}

const sectionHead = mono({ fontSize: 12, margin: "22px 0 10px", borderBottom: `2px solid ${C.ink}`, paddingBottom: 6 });

/* --------------------------------------------------------------------- pane */

export function ResumePane({ doc, setDoc }) {
  const profiles = doc.profiles ?? [];
  const [selId, setSelId] = useState(profiles[0]?.id ?? null);
  const current = profiles.find((p) => p.id === selId) ?? profiles[0];

  const patchDoc = (delta) => setDoc({ ...doc, ...delta });

  const patchProfile = (delta) =>
    patchDoc({ profiles: profiles.map((p) => (p.id === current.id ? { ...p, ...delta } : p)) });

  const sel = current?.selection ?? allSelected();
  const set = (patch) => patchProfile({ selection: { ...sel, ...patch } });

  const addProfile = () => {
    const p = blankProfile();
    patchDoc({ profiles: [...profiles, p], active: doc.active || p.id });
    setSelId(p.id);
  };

  const duplicateProfile = () => {
    if (!current) return;
    const p = { ...current, id: `${current.id}-copy`, name: `${current.name} (copy)`, selection: { ...current.selection } };
    patchDoc({ profiles: [...profiles, p] });
    setSelId(p.id);
  };

  const removeProfile = () => {
    if (!current) return;
    if (!window.confirm(`Delete résumé profile "${current.name}"?`)) return;
    const rest = profiles.filter((p) => p.id !== current.id);
    patchDoc({ profiles: rest, active: doc.active === current.id ? rest[0]?.id ?? "" : doc.active });
    setSelId(rest[0]?.id ?? null);
  };

  const setActive = (id) => patchDoc({ active: id });

  /* ------------------------------------------------------------- skill state */

  const skillState = (g) => {
    const hidden = sel.hiddenSkills[g.id] ?? [];
    if (hidden.length === 0) return "all";
    return hidden.length >= g.items.length ? "none" : "some";
  };

  const toggleCategory = (g) => {
    const next = { ...sel.hiddenSkills };
    if (skillState(g) === "all") next[g.id] = [...g.items];
    else delete next[g.id];
    set({ hiddenSkills: next });
  };

  const toggleSkill = (g, item) => {
    const next = { ...sel.hiddenSkills };
    const hidden = toggle(next[g.id] ?? [], item);
    if (hidden.length) next[g.id] = hidden;
    else delete next[g.id];
    set({ hiddenSkills: next });
  };

  const work = experiences.filter((e) => e.kind === "work");
  const activities = experiences.filter((e) => e.kind !== "work");
  const expRow = (e) => (
    <Check
      key={e.id}
      checked={!sel.hiddenExperiences.includes(e.id)}
      onChange={() => set({ hiddenExperiences: toggle(sel.hiddenExperiences, e.id) })}
      label={`${e.role} — ${e.companyName}`}
    />
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>
      {/* ---------------------------------------------------------- profile list */}
      <div style={{ position: "sticky", top: 76 }}>
        <Button onClick={addProfile} style={{ width: "100%", marginBottom: 10 }}>+ New profile</Button>
        <div style={{ border: `1px solid ${C.ink}`, maxHeight: "70vh", overflowY: "auto" }}>
          {profiles.map((p) => (
            <Hover
              key={p.id}
              as="button"
              onClick={() => setSelId(p.id)}
              style={{
                display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                border: "none", borderBottom: "1px solid rgba(22,25,15,0.18)",
                background: p.id === current?.id ? C.tint : "transparent",
                padding: "10px 12px", fontFamily: F.body,
              }}
              hoverStyle={{ background: C.tint }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                {p.name || "(unnamed)"}
                {doc.active === p.id && (
                  <span style={mono({ fontSize: 9, color: C.rust, border: `1px solid ${C.rust}`, padding: "1px 4px", borderRadius: 2 })}>
                    LIVE
                  </span>
                )}
              </div>
              <div style={mono({ fontSize: 10, fontWeight: 400, color: C.muted, textTransform: "none", letterSpacing: "0.4px", marginTop: 2 })}>
                {p.id}
              </div>
            </Hover>
          ))}
          {profiles.length === 0 && (
            <div style={mono({ fontSize: 11, color: C.muted, padding: 12 })}>No profiles yet.</div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------- selection editor */}
      <div>
        {current ? (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <Button onClick={duplicateProfile}>Duplicate</Button>
              <Button variant="danger" onClick={removeProfile}>Delete</Button>
              <Button
                variant={doc.active === current.id ? "primary" : "ghost"}
                onClick={() => setActive(current.id)}
                disabled={doc.active === current.id}
              >
                {doc.active === current.id ? "Live profile" : "Set as live"}
              </Button>
              <a
                href={`/resume/?profile=${encodeURIComponent(current.id)}`}
                target="_blank"
                rel="noreferrer"
                style={{ ...mono({ fontSize: 12 }), alignSelf: "center", color: C.ink }}
              >
                Preview / Download ↗
              </a>
            </div>

            <div style={{ maxWidth: 560 }}>
              <Field label="Profile name" hint="e.g. the role or company you're tailoring this for.">
                <Text value={current.name} onChange={(v) => patchProfile({ name: v })} />
              </Field>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Button onClick={() => set(allSelected())}>All</Button>
              <Button onClick={() => set(noneSelected())}>None</Button>
              <Button onClick={() => set(curatedSelection())}>Curated</Button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 8 }}>
              <div>
                <div style={sectionHead}>Info</div>
                <Check checked={!sel.hideSummary} onChange={() => set({ hideSummary: !sel.hideSummary })} label="Summary paragraph" />
                <Check checked={!sel.hideCoursework} onChange={() => set({ hideCoursework: !sel.hideCoursework })} label="Relevant coursework" />
                {CONTACT_ORDER.map((k) => (
                  <Check
                    key={k}
                    indent
                    muted
                    checked={!sel.hiddenContact.includes(k)}
                    onChange={() => set({ hiddenContact: toggle(sel.hiddenContact, k) })}
                    label={CONTACT_LABELS[k]}
                  />
                ))}

                <div style={sectionHead}>Experience</div>
                {work.map(expRow)}
                {activities.length > 0 && (
                  <div style={{ fontFamily: F.body, fontSize: 11.5, color: "rgba(22,25,15,0.7)", marginTop: 8, fontWeight: 600 }}>
                    Activities &amp; Awards
                  </div>
                )}
                {activities.map(expRow)}

                <div style={sectionHead}>Projects</div>
                {projects.map((p) => (
                  <Check
                    key={p.id}
                    checked={!sel.hiddenProjects.includes(p.id)}
                    onChange={() => set({ hiddenProjects: toggle(sel.hiddenProjects, p.id) })}
                    label={p.title}
                  />
                ))}
              </div>

              <div>
                <div style={sectionHead}>Skills</div>
                {skillGroups.map((g) => (
                  <div key={g.id}>
                    <TriCheck state={skillState(g)} onChange={() => toggleCategory(g)} label={g.label} />
                    {g.items.map((it) => (
                      <Check
                        key={it}
                        indent
                        muted
                        checked={!(sel.hiddenSkills[g.id] ?? []).includes(it)}
                        onChange={() => toggleSkill(g, it)}
                        label={it}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={mono({ color: C.muted })}>No profile selected. Create one to start.</div>
        )}
      </div>
    </div>
  );
}
