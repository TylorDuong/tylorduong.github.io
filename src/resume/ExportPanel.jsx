import { useEffect, useRef, useState } from "react";
import { projects, experiences, skillGroups } from "@/data";
import { C, F, CLIP, mono } from "@/lib/theme";
import { Hover } from "@/lib/Hover";
import {
  CONTACT_ORDER,
  CONTACT_LABELS,
  allSelected,
  noneSelected,
  curatedSelection,
} from "./selection";
import { loadPresets, savePresets, downloadPreset, parsePresetFile } from "./presets";

const S = {
  panel: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 320,
    height: "100vh",
    overflowY: "auto",
    background: C.paper,
    borderRight: `3px solid ${C.ink}`,
    padding: "16px 18px 40px",
    zIndex: 20,
    boxSizing: "border-box",
  },
  h: mono({ fontSize: 11, letterSpacing: "1px", marginTop: 18, marginBottom: 6, borderBottom: `1px solid ${C.ink}`, paddingBottom: 4 }),
  row: { display: "flex", alignItems: "center", gap: 7, padding: "2px 0", cursor: "pointer" },
  txt: { fontFamily: F.body, fontSize: 12, lineHeight: 1.3, color: C.ink },
  sub: { fontFamily: F.body, fontSize: 11.5, color: "rgba(22,25,15,0.7)" },
  input: {
    fontFamily: F.mono,
    fontSize: 11,
    padding: "5px 7px",
    border: `1px solid ${C.ink}`,
    background: "#fff",
    width: "100%",
    boxSizing: "border-box",
  },
  note: { ...mono({ fontSize: 10, letterSpacing: "0.4px", textTransform: "none" }), color: C.rust, marginTop: 6 },
};

function Btn({ children, onClick, primary, style }) {
  return (
    <Hover
      as="button"
      onClick={onClick}
      style={{
        ...mono({ fontSize: 10, letterSpacing: "0.6px" }),
        padding: "6px 10px",
        border: `2px solid ${C.ink}`,
        background: primary ? C.rust : "transparent",
        color: primary ? C.paper : C.ink,
        cursor: "pointer",
        clipPath: CLIP,
        ...style,
      }}
      hoverStyle={{ background: primary ? C.rustDark : "rgba(22,25,15,0.1)" }}
    >
      {children}
    </Hover>
  );
}

function Check({ checked, onChange, label, indent, muted }) {
  return (
    <label style={{ ...S.row, paddingLeft: indent ? 18 : 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span style={muted ? S.sub : S.txt}>{label}</span>
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
    <label style={{ ...S.row, marginTop: 6 }}>
      <input ref={ref} type="checkbox" checked={state === "all"} onChange={onChange} />
      <span style={{ ...S.txt, fontWeight: 600 }}>{label}</span>
    </label>
  );
}

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

export function ExportPanel({ selection, onChange }) {
  const [presets, setPresets] = useState(loadPresets);
  const [active, setActive] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  // The curated `resume.include` set is the right default for production, but
  // the panel is for trimming down from everything.
  useEffect(() => onChange(allSelected()), [onChange]);

  useEffect(() => {
    document.body.classList.add("has-export-panel");
    return () => document.body.classList.remove("has-export-panel");
  }, []);

  const set = (patch) => onChange({ ...selection, ...patch });

  const commit = (list) => {
    setPresets(list);
    savePresets(list);
  };

  const saveAs = () => {
    const n = name.trim();
    if (!n) return setMsg("name the preset first");
    commit([...presets.filter((p) => p.name !== n), { name: n, savedAt: new Date().toISOString(), selection }]);
    setActive(n);
    setName("");
    setMsg(`saved "${n}"`);
  };

  const applyPreset = (n) => {
    setActive(n);
    const p = presets.find((x) => x.name === n);
    if (p) onChange(p.selection);
  };

  const importFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const { name: n, selection: sel } = parsePresetFile(await file.text());
      onChange(sel);
      commit([...presets.filter((p) => p.name !== n), { name: n, savedAt: new Date().toISOString(), selection: sel }]);
      setActive(n);
      setMsg(`imported "${n}"`);
    } catch (err) {
      setMsg(`import failed — ${err.message}`);
    }
  };

  const skillState = (g) => {
    const hidden = selection.hiddenSkills[g.id] ?? [];
    if (hidden.length === 0) return "all";
    return hidden.length >= g.items.length ? "none" : "some";
  };

  const toggleCategory = (g) => {
    const next = { ...selection.hiddenSkills };
    if (skillState(g) === "all") next[g.id] = [...g.items];
    else delete next[g.id];
    set({ hiddenSkills: next });
  };

  const toggleSkill = (g, item) => {
    const next = { ...selection.hiddenSkills };
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
      checked={!selection.hiddenExperiences.includes(e.id)}
      onChange={() => set({ hiddenExperiences: toggle(selection.hiddenExperiences, e.id) })}
      label={`${e.role} — ${e.companyName}`}
    />
  );

  return (
    <div className="no-print" style={S.panel}>
      <div style={mono({ fontSize: 12, letterSpacing: "1px" })}>Advanced Export</div>
      <div style={{ ...S.sub, marginTop: 4 }}>Pick what appears, then Print / Save PDF.</div>

      <div style={S.h}>Presets</div>
      <select
        value={active}
        onChange={(e) => applyPreset(e.target.value)}
        style={{ ...S.input, marginBottom: 6 }}
      >
        <option value="">— select a preset —</option>
        {presets.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
      <input
        style={S.input}
        placeholder="new preset name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
        <Btn primary onClick={saveAs}>
          Save
        </Btn>
        <Btn
          onClick={() => {
            if (!active) return setMsg("select a preset first");
            commit(presets.map((p) => (p.name === active ? { ...p, selection, savedAt: new Date().toISOString() } : p)));
            setMsg(`updated "${active}"`);
          }}
        >
          Update
        </Btn>
        <Btn
          onClick={() => {
            if (!active) return setMsg("select a preset first");
            commit(presets.filter((p) => p.name !== active));
            setActive("");
            setMsg("deleted");
          }}
        >
          Delete
        </Btn>
        <Btn onClick={() => downloadPreset(active || name.trim() || "untitled", selection)}>Export</Btn>
        <Btn onClick={() => fileRef.current?.click()}>Import</Btn>
      </div>
      <input ref={fileRef} type="file" accept="application/json" onChange={importFile} style={{ display: "none" }} />
      {msg && <div style={S.note}>{msg}</div>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
        <Btn onClick={() => onChange(allSelected())}>All</Btn>
        <Btn onClick={() => onChange(noneSelected())}>None</Btn>
        <Btn onClick={() => onChange(curatedSelection())}>Curated</Btn>
      </div>

      <div style={S.h}>Info</div>
      <Check checked={!selection.hideSummary} onChange={() => set({ hideSummary: !selection.hideSummary })} label="Summary paragraph" />
      <Check checked={!selection.hideCoursework} onChange={() => set({ hideCoursework: !selection.hideCoursework })} label="Relevant coursework" />
      {CONTACT_ORDER.map((k) => (
        <Check
          key={k}
          indent
          muted
          checked={!selection.hiddenContact.includes(k)}
          onChange={() => set({ hiddenContact: toggle(selection.hiddenContact, k) })}
          label={CONTACT_LABELS[k]}
        />
      ))}

      <div style={S.h}>Experience</div>
      {work.map(expRow)}
      {activities.length > 0 && <div style={{ ...S.sub, marginTop: 8, fontWeight: 600 }}>Activities &amp; Awards</div>}
      {activities.map(expRow)}

      <div style={S.h}>Projects</div>
      {projects.map((p) => (
        <Check
          key={p.id}
          checked={!selection.hiddenProjects.includes(p.id)}
          onChange={() => set({ hiddenProjects: toggle(selection.hiddenProjects, p.id) })}
          label={p.title}
        />
      ))}

      <div style={S.h}>Skills</div>
      {skillGroups.map((g) => (
        <div key={g.id}>
          <TriCheck state={skillState(g)} onChange={() => toggleCategory(g)} label={g.label} />
          {g.items.map((it) => (
            <Check
              key={it}
              indent
              muted
              checked={!(selection.hiddenSkills[g.id] ?? []).includes(it)}
              onChange={() => toggleSkill(g, it)}
              label={it}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
