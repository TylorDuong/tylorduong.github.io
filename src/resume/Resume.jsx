import { useEffect, useRef, useState } from "react";
import {
  profile,
  contact,
  education,
  skillGroups,
  experiences,
  projects,
} from "@/data";
import { periodLabel, fmtYM } from "@/lib/dates";

/* ------------------------------------------------------------- selection */

// Real jobs, newest first (already sorted by the adapter).
const workExperience = experiences.filter(
  (e) => e.resume?.include && e.kind === "work"
);

// Projects flagged for the résumé, in explicit résumé order where given.
const resumeProjects = projects
  .filter((p) => p.resume?.include)
  .sort((a, b) => (a.resume.order ?? Infinity) - (b.resume.order ?? Infinity));

// Hackathons / competitions that no project record already covers — without
// this they would vanish from the résumé entirely.
const activities = experiences.filter(
  (e) => e.resume?.include && e.kind !== "work"
);

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

  return (
    <>
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
            <a href={contact.phoneHref}>{contact.phone}</a>
            <Sep />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <Sep />
            {contact.locationResume}
            <br />
            <a href={contact.linkedin.url}>{contact.linkedin.resumeLabel}</a>
            <Sep />
            <a href={contact.website.url}>{contact.website.resumeLabel}</a>
            <Sep />
            <a href={contact.github.url}>{contact.github.resumeLabel}</a>
          </div>
          <p className="r-summary">{profile.resumeSummary}</p>
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
          {ed.coursework?.length > 0 && (
            <div className="r-tech">
              <b>Relevant Coursework:</b> {ed.coursework.join(", ")}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------- skills */}
        <h2 className="r-h2">Technical Skills</h2>
        <div className="r-entry">
          {skillGroups.map((g) => (
            <div className="r-skillrow" key={g.id}>
              <b>{g.label}:</b> {g.items.join(", ")}
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------ experience */}
        <h2 className="r-h2">Experience</h2>
        {workExperience.map((e) => (
          <Entry
            key={e.id}
            title={e.role}
            org={e.unit ? `${e.companyName} (${e.unit})` : e.companyName}
            when={periodLabel(e.start, e.end, { title: true })}
            bullets={e.bullets}
            tech={e.tech}
          />
        ))}

        {/* -------------------------------------------------------- projects */}
        <h2 className="r-h2">Relevant Projects</h2>
        {resumeProjects.map((p) => (
          <Entry
            key={p.id}
            title={p.title}
            org={p.category}
            when={periodLabel(p.start, p.end, { title: true })}
            bullets={p.bullets}
            tech={p.tech}
          />
        ))}

        {/* ------------------------------------------ activities / awards */}
        {activities.length > 0 && (
          <>
            <h2 className="r-h2">Activities &amp; Awards</h2>
            {activities.map((e) => (
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
