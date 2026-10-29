import { F, C, mono } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { ProjectCard } from "@/components/ProjectCard";
import { contact } from "@/data";

// Same three-up card grid the home "Projects" section uses. Reusing the
// `work-grid` hook means it inherits the shared min-width:0 and the ≤860px
// collapse-to-one-column rule in index.css, so the catalog matches the front
// page exactly — only here it renders the full list instead of a preview.
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 };

function GroupTitle({ label, count, style }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, ...style }}>
      <h2 style={{ fontFamily: F.tight, fontSize: 34, fontWeight: 600, letterSpacing: "-1px", margin: 0 }}>{label}</h2>
      <span style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted })}>{count} UNITS</span>
    </div>
  );
}

export function ProjectIndex({ personalProjects, enterpriseProjects, personalCount, enterpriseCount, unitCount }) {
  return (
    <div data-r="wrap" style={{ maxWidth: 1400, margin: "0 auto", padding: "80px 40px 96px", position: "relative" }}>
      <div data-r="idx-orb" style={{ position: "absolute", top: 0, right: 0, pointerEvents: "none" }}>
        <Mark name="dotgrid" size={320} color={C.ink} style={{ opacity: 0.05, display: "block" }} />
      </div>

      <div style={mono({ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, position: "relative" })}>
        <Mark name="burst" size={14} color={C.rust} />
        CATALOG — {unitCount} UNITS ON RECORD
      </div>
      <h1 style={{ fontFamily: F.tight, fontSize: "clamp(56px,8.5vw,128px)", fontWeight: 600, lineHeight: 0.86, letterSpacing: "-0.04em", margin: "0 0 64px", textTransform: "uppercase" }}>
        Project
        <br />
        Gallery.
      </h1>

      <GroupTitle label="Personal" count={personalCount} style={{ marginBottom: 24 }} />
      <div data-r="work-grid" style={gridStyle}>
        {personalProjects.map((proj) => (
          <ProjectCard key={proj.id} proj={proj} />
        ))}
      </div>

      <GroupTitle label="Enterprise" count={enterpriseCount} style={{ margin: "56px 0 24px" }} />
      <div data-r="work-grid" style={gridStyle}>
        {enterpriseProjects.map((proj) => (
          <ProjectCard key={proj.id} proj={proj} />
        ))}
      </div>

      <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted, marginTop: 48 })}>
        SELECT A UNIT TO OPEN ITS FILE. SOURCE: {contact.github.resumeLabel.toUpperCase()}
      </div>
    </div>
  );
}
