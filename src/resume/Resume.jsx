import { Fragment, useEffect, useRef, useState } from "react";
import { profile, contact, education } from "@/data";
import { periodLabel, fmtYM } from "@/lib/dates";
import { curatedSelection, deriveVisible, visibleContactKeys } from "./selection";
import { ExportPanel } from "./ExportPanel";

// What the deployed page renders. The dev-only ExportPanel replaces this with
// its own selection once mounted.
const CURATED = curatedSelection();

/* -------------------------------------------------------------- fragments */

function Sep() {
  return <span className="r-sep"> &nbsp;|&nbsp; </span>;
}

function Entry({ title, org, when, bullets, tech }) {
  return (
    <div className="r-entry">
      <div className="r-row">
        <div>
          <span className="r-title">{title}</span>
          {org && <span className="r-org"> — {org}</span>}
        </div>
        {when && <div className="r-when">{when}</div>}
      </div>
      {bullets?.length > 0 && (
        <ul className="r-bullets">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {tech?.length > 0 && (
        <div className="r-tech">
          <b>Technologies:</b> {tech.join(", ")}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------- dev-only fit indicator */

// One page at Letter with 0.5in margins leaves 10in of content height.
// Reports the overflow so trimming is a measurement rather than a guess.
function FitMeter({ pageRef }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    const measure = () => {
      const el = pageRef.current;
      if (!el) return;
      const dpi = 96;
      const contentIn = (el.scrollHeight - dpi) / dpi; // minus the 0.5in top+bottom padding
      const pages = Math.max(1, Math.ceil(contentIn / 10 - 0.02));
      setState({ over: contentIn > 10.02, overBy: contentIn - 10, pages });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (pageRef.current) ro.observe(pageRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pageRef]);

  if (!state) return null;
  return (
    <div className="r-fit" data-over={String(state.over)}>
      {state.over
        ? `OVER BY ${state.overBy.toFixed(2)}IN — ${state.pages} PAGES`
        : `FITS 1 PAGE — ${Math.abs(state.overBy).toFixed(2)}IN SPARE`}
    </div>
  );
}

/* ------------------------------------------------------------------ page */

export function Resume() {
  const pageRef = useRef(null);
  const ed = education[0];
  const [selection, setSelection] = useState(CURATED);
  const v = deriveVisible(selection);

  const shown = visibleContactKeys(selection);
  const has = (k) => shown.includes(k);
  const contactRows = [
    [
      has("phone") && { key: "phone", node: <a href={contact.phoneHref}>{contact.phone}</a> },
      has("email") && { key: "email", node: <a href={`mailto:${contact.email}`}>{contact.email}</a> },
      has("location") && { key: "location", node: contact.locationResume },
    ].filter(Boolean),
    [
      has("linkedin") && { key: "linkedin", node: <a href={contact.linkedin.url}>{contact.linkedin.resumeLabel}</a> },
      has("website") && { key: "website", node: <a href={contact.website.url}>{contact.website.resumeLabel}</a> },
      has("github") && { key: "github", node: <a href={contact.github.url}>{contact.github.resumeLabel}</a> },
    ].filter(Boolean),
  ];
  const interleave = (items) =>
    items.flatMap((it, i) => [
      ...(i === 0 ? [] : [<Sep key={`sep-${it.key}`} />]),
      <Fragment key={it.key}>{it.node}</Fragment>,
    ]);

  return (
    <>
      {import.meta.env.DEV && <ExportPanel selection={selection} onChange={setSelection} />}
      <div className="r-toolbar no-print">
        {import.meta.env.DEV && <FitMeter pageRef={pageRef} />}
        <button className="r-btn" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>

      <div className="r-page" ref={pageRef}>
        {/* ---------------------------------------------------------- header */}
        <header>
          <h1 className="r-name">{profile.name}</h1>
          <div className="r-contact">
            {interleave(contactRows[0])}
            {contactRows[0].length > 0 && contactRows[1].length > 0 && <br />}
            {interleave(contactRows[1])}
          </div>
          {v.showSummary && <p className="r-summary">{profile.resumeSummary}</p>}
        </header>

        {/* ------------------------------------------------------- education */}
        <h2 className="r-h2">Education</h2>
        <div className="r-entry">
          <div className="r-row">
            <div>
              <span className="r-title">{ed.school}</span>
              <span className="r-org"> — {ed.location}</span>
            </div>
            <div className="r-when">
              {ed.expected ? "Expected " : ""}
              {fmtYM(ed.end, { title: true })}
            </div>
          </div>
          <div className="r-tech">
            {ed.degree}
            {ed.minor && ` · Minor: ${ed.minor}`}
            {ed.certificate && ` · Certificate: ${ed.certificate}`}
          </div>
          {v.showCoursework && ed.coursework?.length > 0 && (
            <div className="r-tech">
              <b>Relevant Coursework:</b> {ed.coursework.join(", ")}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------- skills */}
        {v.visibleSkillGroups.length > 0 && (
          <>
            <h2 className="r-h2">Technical Skills</h2>
            <div className="r-entry">
              {v.visibleSkillGroups.map((g) => (
                <div className="r-skillrow" key={g.id}>
                  <b>{g.label}:</b> {g.items.join(", ")}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------------------------------------------ experience */}
        {v.workExperience.length > 0 && (
          <>
            <h2 className="r-h2">Experience</h2>
            {v.workExperience.map((e) => (
              <Entry
                key={e.id}
                title={e.role}
                org={e.unit ? `${e.companyName} (${e.unit})` : e.companyName}
                when={periodLabel(e.start, e.end, { title: true })}
                bullets={e.bullets}
                tech={e.tech}
              />
            ))}
          </>
        )}

        {/* -------------------------------------------------------- projects */}
        {v.resumeProjects.length > 0 && (
          <>
            <h2 className="r-h2">Relevant Projects</h2>
            {v.resumeProjects.map((p) => (
              <Entry
                key={p.id}
                title={p.title}
                org={p.category}
                when={periodLabel(p.start, p.end, { title: true })}
                bullets={p.bullets}
                tech={p.tech}
              />
            ))}
          </>
        )}

        {/* ------------------------------------------ activities / awards */}
        {v.activities.length > 0 && (
          <>
            <h2 className="r-h2">Activities &amp; Awards</h2>
            {v.activities.map((e) => (
              <Entry
                key={e.id}
                title={e.unit ? `${e.companyName} — ${e.unit}` : e.companyName}
                org={e.role}
                when={periodLabel(e.start, e.end, { title: true })}
                bullets={e.bullets}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
