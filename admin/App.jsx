import { useCallback, useEffect, useMemo, useState } from "react";
import { C, F, mono } from "@/lib/theme";
import { Hover } from "@/lib/Hover";
import { byRecency } from "@/lib/dates";
import { ENTITIES, validate, guessCategory } from "../tools/content-schema.js";
import { api } from "./api";
import { Button, Field, Text, Area, ListEditor, TagInput } from "./ui";
import { input } from "./styles";
import { ProjectForm, ExperienceForm, TestimonialForm } from "./forms";
import { Publish } from "./Publish";

const TABS = [
  ["projects", "Projects"],
  ["experiences", "Experience"],
  ["skills", "Skills"],
  ["testimonials", "Testimonials"],
  ["about", "About"],
  ["metrics", "Metrics"],
  ["profile", "Profile"],
  ["publish", "Publish"],
];

const blankProject = () => ({
  id: "", code: "", kind: "personal", accent: "#16b364", title: "", category: "",
  start: new Date().toISOString().slice(0, 7), end: null, pin: null,
  summary: "", description: "", bullets: [], image: "", tech: [],
  link: "", github: "", resume: { include: true, order: null },
});

const blankExperience = () => ({
  id: "", role: "", company: "", unit: null, location: "",
  start: new Date().toISOString().slice(0, 7), end: null, pin: null, kind: "work",
  description: "", bullets: [], tech: [], projectId: null, resume: { include: true },
});

const blankTestimonial = () => ({ id: "", quote: "", author: "", role: "", avatar: "" });

export default function App() {
  const [tab, setTab] = useState("projects");
  const [store, setStore] = useState(null);   // { entity: {doc, mtimeMs} }
  const [dirty, setDirty] = useState({});     // { entity: true }
  const [sel, setSel] = useState({});         // { entity: recordId }
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});   // { entity: [ {path,message} ] }

  useEffect(() => {
    api.loadAll().then(setStore).catch((e) => setToast({ bad: true, msg: e.message }));
  }, []);

  const doc = useCallback((entity) => store?.[entity]?.doc, [store]);

  const setDoc = useCallback((entity, next) => {
    setStore((s) => ({ ...s, [entity]: { ...s[entity], doc: next } }));
    setDirty((d) => ({ ...d, [entity]: true }));
  }, []);

  /* ------------------------------------------------------ skills plumbing */

  // Memoised so the `?? []` fallback doesn't produce a new array identity on
  // every render and invalidate the memos below.
  const skillCats = useMemo(() => doc("skills")?.categories ?? [], [doc]);
  const knownTech = useMemo(
    () => new Set(skillCats.flatMap((c) => c.items).map((s) => s.toLowerCase())),
    [skillCats]
  );
  const allTech = useMemo(() => {
    const set = new Set(skillCats.flatMap((c) => c.items));
    (doc("projects") || []).forEach((p) => (p.tech || []).forEach((t) => set.add(t)));
    (doc("experiences") || []).forEach((e) => (e.tech || []).forEach((t) => set.add(t)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [skillCats, doc]);

  // Tech typed anywhere that is not yet a listed skill, minus anything
  // explicitly ignored. This is the mechanism behind "new skills automatically
  // join the skills section" — surfaced with a category guess rather than
  // silently appended, because plenty of tech tags ("Hackathon", "Research")
  // are project descriptors and do not belong on a résumé skills line.
  const ignored = useMemo(
    () => new Set((doc("skills")?.ignored ?? []).map((s) => s.toLowerCase())),
    [doc]
  );

  const pendingSkills = useMemo(() => {
    const seen = new Map();
    for (const list of [doc("projects") || [], doc("experiences") || []]) {
      for (const rec of list) {
        for (const t of rec.tech || []) {
          const k = t.toLowerCase();
          if (!knownTech.has(k) && !ignored.has(k) && !seen.has(k)) seen.set(k, t);
        }
      }
    }
    return [...seen.values()];
  }, [doc, knownTech, ignored]);

  const fileSkill = (token, categoryId) => {
    setDoc("skills", {
      ...doc("skills"),
      categories: skillCats.map((c) =>
        c.id === categoryId ? { ...c, items: [...c.items, token] } : c
      ),
    });
  };

  const ignoreSkill = (token) => {
    const cur = doc("skills");
    setDoc("skills", { ...cur, ignored: [...(cur.ignored ?? []), token] });
  };

  /* ---------------------------------------------------------------- save */

  const save = async (entity) => {
    const d = doc(entity);
    const errs = validate(entity, d);
    if (errs.length) {
      setErrors((e) => ({ ...e, [entity]: errs }));
      setToast({ bad: true, msg: `${entity}: ${errs.length} problem(s) — see highlighted fields.` });
      return false;
    }
    try {
      // Strip UI-only bookkeeping before it reaches disk. Clearing _isNew also
      // freezes each record's id, which from here on is a stable key.
      const clean = JSON.parse(JSON.stringify(d, (k, v) => (k === "_isNew" ? undefined : v)));
      const res = await api.save(entity, clean, store[entity].mtimeMs);
      setStore((s) => ({ ...s, [entity]: { doc: clean, mtimeMs: res.mtimeMs } }));
      setDirty((x) => ({ ...x, [entity]: false }));
      setErrors((e) => ({ ...e, [entity]: [] }));
      setToast({ msg: `Saved ${entity}.json` });
      return true;
    } catch (e) {
      if (e.status === 409) {
        setToast({ bad: true, msg: `${entity}.json changed on disk. Reload to pick up the newer version.` });
      } else if (e.status === 422) {
        setErrors((x) => ({ ...x, [entity]: e.data.errors }));
        setToast({ bad: true, msg: `${entity}: rejected by the server.` });
      } else {
        setToast({ bad: true, msg: e.message });
      }
      return false;
    }
  };

  const saveAll = async () => {
    for (const e of ENTITIES) if (dirty[e]) if (!(await save(e))) return;
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (ENTITIES.includes(tab) && dirty[tab]) save(tab);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!store) {
    return <Shell><div style={mono({ padding: 40 })}>Loading content…</div></Shell>;
  }

  const errorsFor = (entity) => (recId) => {
    const list = doc(entity) || [];
    const i = list.findIndex((r) => r.id === recId);
    const out = {};
    for (const e of errors[entity] || []) {
      const m = e.path.match(/^\w+\[(\d+)\]\.(.+)$/);
      if (m && Number(m[1]) === i) out[m[2]] = e.message;
    }
    return out;
  };

  const ctx = {
    allTech,
    knownTech,
    projectOptions: (doc("projects") || []).map((p) => [p.id, p.title]),
  };

  return (
    <Shell>
      <Header
        tabs={TABS}
        tab={tab}
        setTab={setTab}
        dirty={dirty}
        onSaveAll={saveAll}
        anyDirty={Object.values(dirty).some(Boolean)}
      />

      {pendingSkills.length > 0 && tab !== "publish" && (
        <NewSkills tokens={pendingSkills} categories={skillCats} onFile={fileSkill} onIgnore={ignoreSkill} />
      )}

      <div style={{ padding: "24px 32px 80px", maxWidth: 1400, margin: "0 auto" }}>
        {tab === "projects" && (
          <ListPane
            entity="projects"
            items={doc("projects")}
            setItems={(v) => setDoc("projects", v)}
            selected={sel.projects}
            onSelect={(id) => setSel((s) => ({ ...s, projects: id }))}
            labelOf={(p) => p.title || "(untitled)"}
            subOf={(p) => `${p.kind} · ${p.start || "?"}`}
            make={blankProject}
            sort={byRecency}
            render={(rec, patch) => (
              <ProjectForm rec={rec} all={doc("projects")} patch={patch} ctx={{ ...ctx, errorsFor: errorsFor("projects") }} />
            )}
          />
        )}

        {tab === "experiences" && (
          <ListPane
            entity="experiences"
            items={doc("experiences")}
            setItems={(v) => setDoc("experiences", v)}
            selected={sel.experiences}
            onSelect={(id) => setSel((s) => ({ ...s, experiences: id }))}
            labelOf={(e) => e.role || "(untitled)"}
            subOf={(e) => `${e.company || "?"} · ${e.start || "?"}`}
            make={blankExperience}
            sort={byRecency}
            render={(rec, patch) => (
              <ExperienceForm rec={rec} all={doc("experiences")} patch={patch} ctx={{ ...ctx, errorsFor: errorsFor("experiences") }} />
            )}
          />
        )}

        {tab === "testimonials" && (
          <ListPane
            entity="testimonials"
            items={doc("testimonials")}
            setItems={(v) => setDoc("testimonials", v)}
            selected={sel.testimonials}
            onSelect={(id) => setSel((s) => ({ ...s, testimonials: id }))}
            labelOf={(t) => t.author || "(unnamed)"}
            subOf={(t) => t.role || ""}
            make={blankTestimonial}
            render={(rec, patch) => <TestimonialForm rec={rec} patch={patch} />}
          />
        )}

        {tab === "skills" && <SkillsPane doc={doc("skills")} setDoc={(v) => setDoc("skills", v)} />}
        {tab === "about" && <AboutPane doc={doc("about")} setDoc={(v) => setDoc("about", v)} />}
        {tab === "metrics" && <MetricsPane doc={doc("metrics")} setDoc={(v) => setDoc("metrics", v)} />}
        {tab === "profile" && <ProfilePane doc={doc("profile")} setDoc={(v) => setDoc("profile", v)} />}
        {tab === "publish" && <Publish dirty={dirty} onSaveAll={saveAll} />}

        {ENTITIES.includes(tab) && (
          <div style={{ position: "sticky", bottom: 0, display: "flex", gap: 12, padding: "16px 0", background: C.paper, borderTop: `1px solid ${C.hair}`, marginTop: 24 }}>
            <Button variant="primary" onClick={() => save(tab)} disabled={!dirty[tab]}>
              Save {tab}.json
            </Button>
            <Button
              onClick={() => api.load(tab).then((r) => {
                setStore((s) => ({ ...s, [tab]: r }));
                setDirty((d) => ({ ...d, [tab]: false }));
                setErrors((e) => ({ ...e, [tab]: [] }));
              })}
              disabled={!dirty[tab]}
            >
              Discard
            </Button>
            <div style={mono({ fontSize: 11, color: C.muted, alignSelf: "center" })}>
              {dirty[tab] ? "UNSAVED — Ctrl+S" : "SAVED"}
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 100,
            background: toast.bad ? C.rust : C.ink, color: C.paper,
            padding: "14px 20px", maxWidth: 460,
            ...mono({ fontSize: 11, fontWeight: 400, textTransform: "none", letterSpacing: "0.4px" }),
          }}
        >
          {toast.msg}
        </div>
      )}
    </Shell>
  );
}

/* --------------------------------------------------------------- chrome */

function Shell({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: C.paper, color: C.ink, fontFamily: F.body }}>
      {children}
    </div>
  );
}

function Header({ tabs, tab, setTab, dirty, onSaveAll, anyDirty }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40, background: C.ink, borderBottom: `3px solid ${C.ink}` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
        <div style={{ fontFamily: F.tight, fontSize: 17, fontWeight: 600, color: C.paper, padding: "14px 20px 14px 0", letterSpacing: "-0.3px" }}>
          CONTENT ADMIN
        </div>
        {tabs.map(([id, name]) => (
          <Hover
            key={id}
            as="button"
            onClick={() => setTab(id)}
            style={{
              background: tab === id ? C.paper : "transparent",
              color: tab === id ? C.ink : "rgba(241,237,226,0.72)",
              border: "none", cursor: "pointer", padding: "14px 16px",
              ...mono({ fontSize: 11 }),
            }}
            hoverStyle={tab === id ? {} : { color: C.paper }}
          >
            {name}
            {dirty[id] && <span style={{ color: C.rust, marginLeft: 6 }}>●</span>}
          </Hover>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/" target="_blank" rel="noreferrer" style={{ ...mono({ fontSize: 10 }), color: "rgba(241,237,226,0.6)", textDecoration: "none" }}>SITE ↗</a>
          <a href="/resume/" target="_blank" rel="noreferrer" style={{ ...mono({ fontSize: 10 }), color: "rgba(241,237,226,0.6)", textDecoration: "none" }}>RÉSUMÉ ↗</a>
          <Button variant="primary" onClick={onSaveAll} disabled={!anyDirty} style={{ margin: "8px 0" }}>
            Save all
          </Button>
        </div>
      </div>
    </div>
  );
}

// Collapsed by default: on a mature content set this list is long, and a
// wall of dropdowns on every page load trains you to ignore it.
function NewSkills({ tokens, categories, onFile, onIgnore }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: C.card, borderBottom: `1px solid ${C.ink}` }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "10px 32px" }}>
        <Hover
          as="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", gap: 10,
            ...mono({ fontSize: 11, color: C.rust }),
          }}
          hoverStyle={{ color: C.rustDark }}
        >
          <span style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .15s", display: "inline-block" }}>▸</span>
          {tokens.length} tech tag{tokens.length > 1 ? "s" : ""} not in the skills list
          <span style={mono({ fontSize: 10, fontWeight: 400, color: C.muted, textTransform: "none", letterSpacing: "0.4px" })}>
            — file them into a category, or ignore ones that aren’t really skills
          </span>
        </Hover>

        {open && (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, paddingBottom: 4 }}>
            {tokens.map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={mono({ fontSize: 11, fontWeight: 700, textTransform: "none", border: `1px solid ${C.rust}`, color: C.rust, padding: "3px 7px", borderRadius: 2 })}>
                  {t}
                </span>
                <select
                  defaultValue=""
                  onChange={(e) => e.target.value && onFile(t, e.target.value)}
                  style={{ ...input, width: "auto", padding: "4px 8px", fontSize: 12 }}
                >
                  <option value="">add to…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                      {c.id === guessCategory(t) ? "  ←" : ""}
                    </option>
                  ))}
                </select>
                <Hover
                  as="button"
                  onClick={() => onIgnore(t)}
                  title={`Never prompt about "${t}" again`}
                  style={{ background: "none", border: `1px solid ${C.muted}`, color: C.muted, cursor: "pointer", padding: "4px 7px", ...mono({ fontSize: 10, textTransform: "none" }) }}
                  hoverStyle={{ borderColor: C.ink, color: C.ink }}
                >
                  ignore
                </Hover>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- list pane */

function ListPane({ items = [], setItems, selected, onSelect, labelOf, subOf, make, render, sort }) {
  const ordered = sort ? [...items].sort(sort) : items;
  const current = items.find((r) => r.id === selected) ?? ordered[0];

  const patch = (delta) => {
    setItems(items.map((r) => (r.id === current.id ? { ...r, ...delta } : r)));
    // A record's id is derived from its title while it is new, so the id can
    // change mid-edit. Follow it, or the selection silently jumps to whatever
    // now sorts first.
    if (delta.id && delta.id !== current.id) onSelect(delta.id);
  };

  const add = () => {
    const rec = { ...make(), id: `new-${Date.now()}`, _isNew: true };
    setItems([...items, rec]);
    onSelect(rec.id);
  };

  const duplicate = () => {
    const copy = {
      ...current,
      id: `${current.id}-copy`,
      title: current.title && `${current.title} (copy)`,
      _isNew: true,
    };
    setItems([...items, copy]);
    onSelect(copy.id);
  };

  const remove = () => {
    if (!window.confirm(`Delete "${labelOf(current)}"? This edits the JSON but does not delete any image file.`)) return;
    setItems(items.filter((r) => r.id !== current.id));
    onSelect(null);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>
      <div style={{ position: "sticky", top: 76 }}>
        <Button onClick={add} style={{ width: "100%", marginBottom: 10 }}>+ New</Button>
        <div style={{ border: `1px solid ${C.ink}`, maxHeight: "70vh", overflowY: "auto" }}>
          {ordered.map((r) => (
            <Hover
              key={r.id}
              as="button"
              onClick={() => onSelect(r.id)}
              style={{
                display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                border: "none", borderBottom: "1px solid rgba(22,25,15,0.18)",
                background: r.id === current?.id ? C.tint : "transparent",
                padding: "10px 12px", fontFamily: F.body,
              }}
              hoverStyle={{ background: C.tint }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>{labelOf(r)}</div>
              <div style={mono({ fontSize: 10, fontWeight: 400, color: C.muted, textTransform: "none", letterSpacing: "0.4px", marginTop: 2 })}>
                {subOf(r)}
              </div>
            </Hover>
          ))}
        </div>
      </div>

      <div>
        {current ? (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <Button onClick={duplicate}>Duplicate</Button>
              <Button variant="danger" onClick={remove}>Delete</Button>
            </div>
            {render(current, patch)}
          </>
        ) : (
          <div style={mono({ color: C.muted })}>Nothing selected.</div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- simple panes */

function SkillsPane({ doc, setDoc }) {
  const cats = doc.categories;
  const setCat = (id, items) =>
    setDoc({ ...doc, categories: cats.map((c) => (c.id === id ? { ...c, items } : c)) });

  return (
    <div style={{ maxWidth: 900 }}>
      {cats.map((c) => (
        <Field key={c.id} label={`${c.label} — ${c.items.length} items`}>
          <TagInput
            value={c.items}
            onChange={(v) => setCat(c.id, v)}
            suggestions={[]}
            known={new Set(c.items.map((s) => s.toLowerCase()))}
            placeholder="Add a skill…"
          />
        </Field>
      ))}
    </div>
  );
}

function AboutPane({ doc, setDoc }) {
  return (
    <div style={{ maxWidth: 900 }}>
      <Field label="Paragraphs">
        <ListEditor value={doc.paragraphs} onChange={(v) => setDoc({ ...doc, paragraphs: v })} rows={3} />
      </Field>
      <Field label="Pull quote">
        <Area value={doc.quote} onChange={(v) => setDoc({ ...doc, quote: v })} rows={2} />
      </Field>
      <Field label="Highlights">
        {doc.highlights.map((h, i) => (
          <div key={i} style={{ border: `1px solid ${C.ink}`, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 10 }}>
              <Text value={h.code} onChange={(v) => setDoc({ ...doc, highlights: doc.highlights.map((x, j) => (j === i ? { ...x, code: v } : x)) })} placeholder="FS" />
              <Text value={h.title} onChange={(v) => setDoc({ ...doc, highlights: doc.highlights.map((x, j) => (j === i ? { ...x, title: v } : x)) })} placeholder="Title" />
            </div>
            <div style={{ marginTop: 8 }}>
              <Area value={h.description} rows={2} onChange={(v) => setDoc({ ...doc, highlights: doc.highlights.map((x, j) => (j === i ? { ...x, description: v } : x)) })} />
            </div>
          </div>
        ))}
      </Field>
    </div>
  );
}

function MetricsPane({ doc, setDoc }) {
  const rows = (key) => (
    <Field label={key === "peopleHelpedBreakdown" ? "People breakdown" : "Savings breakdown"}>
      {doc[key].map((b, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 200px 34px", gap: 8, marginBottom: 8 }}>
          <Text value={b.label} onChange={(v) => setDoc({ ...doc, [key]: doc[key].map((x, j) => (j === i ? { ...x, label: v } : x)) })} />
          <Text value={b.value} onChange={(v) => setDoc({ ...doc, [key]: doc[key].map((x, j) => (j === i ? { ...x, value: v } : x)) })} />
          <Button variant="danger" onClick={() => setDoc({ ...doc, [key]: doc[key].filter((_, j) => j !== i) })} style={{ padding: "8px 0" }}>×</Button>
        </div>
      ))}
      <Button onClick={() => setDoc({ ...doc, [key]: [...doc[key], { label: "", value: "" }] })}>+ Add</Button>
    </Field>
  );

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="People helped">
          <Text type="number" value={doc.peopleHelped} onChange={(v) => setDoc({ ...doc, peopleHelped: Number(v) })} />
        </Field>
        <Field label="Money saved / yr">
          <Text type="number" value={doc.moneySaved} onChange={(v) => setDoc({ ...doc, moneySaved: Number(v) })} />
        </Field>
      </div>
      {rows("peopleHelpedBreakdown")}
      {rows("moneySavedBreakdown")}
    </div>
  );
}

function ProfilePane({ doc, setDoc }) {
  const c = doc.contact;
  const setC = (delta) => setDoc({ ...doc, contact: { ...c, ...delta } });
  const ed = doc.education[0];
  const setEd = (delta) => setDoc({ ...doc, education: [{ ...ed, ...delta }, ...doc.education.slice(1)] });
  const two = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={two}>
        <Field label="Name"><Text value={doc.name} onChange={(v) => setDoc({ ...doc, name: v })} /></Field>
        <Field label="Résumé URL"><Text value={doc.resumeUrl} onChange={(v) => setDoc({ ...doc, resumeUrl: v })} /></Field>
      </div>
      <Field label="Hero lead"><Area value={doc.lead} rows={2} onChange={(v) => setDoc({ ...doc, lead: v })} /></Field>
      <Field label="Résumé summary" hint="The paragraph under your name on /resume/.">
        <Area value={doc.resumeSummary} rows={3} onChange={(v) => setDoc({ ...doc, resumeSummary: v })} />
      </Field>

      <div style={mono({ fontSize: 12, margin: "24px 0 12px", borderBottom: `2px solid ${C.ink}`, paddingBottom: 6 })}>Contact</div>
      <div style={two}>
        <Field label="Email"><Text value={c.email} onChange={(v) => setC({ email: v })} /></Field>
        <Field label="Phone"><Text value={c.phone} onChange={(v) => setC({ phone: v })} /></Field>
        <Field label="Phone href"><Text value={c.phoneHref} onChange={(v) => setC({ phoneHref: v })} /></Field>
        <Field label="Phone (dotted, HUD)"><Text value={c.phoneDotted} onChange={(v) => setC({ phoneDotted: v })} /></Field>
        <Field label="Location"><Text value={c.location} onChange={(v) => setC({ location: v })} /></Field>
        <Field label="Location (short)"><Text value={c.locationShort} onChange={(v) => setC({ locationShort: v })} /></Field>
        <Field label="Location (résumé)"><Text value={c.locationResume} onChange={(v) => setC({ locationResume: v })} /></Field>
      </div>
      {["github", "linkedin", "website"].map((k) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <Field label={`${k} URL`}><Text value={c[k].url} onChange={(v) => setC({ [k]: { ...c[k], url: v } })} /></Field>
          <Field label={`${k} handle`}><Text value={c[k].handle} onChange={(v) => setC({ [k]: { ...c[k], handle: v } })} /></Field>
          <Field label={`${k} résumé label`}><Text value={c[k].resumeLabel} onChange={(v) => setC({ [k]: { ...c[k], resumeLabel: v } })} /></Field>
        </div>
      ))}

      <div style={mono({ fontSize: 12, margin: "24px 0 12px", borderBottom: `2px solid ${C.ink}`, paddingBottom: 6 })}>Education</div>
      <div style={two}>
        <Field label="School"><Text value={ed.school} onChange={(v) => setEd({ school: v })} /></Field>
        <Field label="Location"><Text value={ed.location} onChange={(v) => setEd({ location: v })} /></Field>
        <Field label="Degree"><Text value={ed.degree} onChange={(v) => setEd({ degree: v })} /></Field>
        <Field label="Minor"><Text value={ed.minor ?? ""} onChange={(v) => setEd({ minor: v })} /></Field>
        <Field label="Certificate"><Text value={ed.certificate ?? ""} onChange={(v) => setEd({ certificate: v })} /></Field>
        <Field label="Graduation (YYYY-MM)"><Text value={ed.end} onChange={(v) => setEd({ end: v })} placeholder="2028-05" /></Field>
      </div>
      <Field label="Relevant coursework">
        <ListEditor value={ed.coursework || []} onChange={(v) => setEd({ coursework: v })} rows={1} />
      </Field>
    </div>
  );
}
