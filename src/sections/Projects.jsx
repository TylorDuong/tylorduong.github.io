import { C, mono, sectionH2 } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { Hover } from "@/lib/Hover";
import { ProjectCard } from "@/components/ProjectCard";
import { CLIP, F } from "@/lib/theme";

function GroupHeading({ label, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "48px 0 20px" }}>
      <span style={mono({})}>{label}</span>
      <span style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted })}>{count} UNITS</span>
      <span style={{ flex: 1, height: 1, background: "rgba(22,25,15,0.24)" }} />
    </div>
  );
}

export function Projects({ innerRef, goIndex, previewPersonal, previewEnterprise, personalCount, enterpriseCount, seeAllLabel }) {
  return (
    <div ref={innerRef} data-r="wrap" style={{ maxWidth: 1400, margin: "0 auto", padding: "96px 40px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={mono({ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 })}>
            <Mark name="burst" size={14} color={C.rust} />
            SEC.02
          </div>
          <h2 data-r="h2" style={sectionH2}>Projects</h2>
        </div>
        <Hover as="button" onClick={goIndex}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, ...mono({}), color: C.ink }}
          hoverStyle={{ color: C.rust }}>
          See All <span aria-hidden="true">→</span>
        </Hover>
      </div>

      <GroupHeading label="Personal" count={personalCount} />
      <div data-r="work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {previewPersonal.map((proj) => (
          <ProjectCard key={proj.id} proj={proj} />
        ))}
      </div>

      <GroupHeading label="Enterprise" count={enterpriseCount} />
      <div data-r="work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {previewEnterprise.map((proj) => (
          <ProjectCard key={proj.id} proj={proj} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
        <Hover as="button" onClick={goIndex}
          style={{ background: C.rust, color: C.paper, border: `6px solid ${C.ink}`, fontFamily: F.mono, fontSize: 16, fontWeight: 700, letterSpacing: "1.28px", textTransform: "uppercase", padding: "20px 40px", cursor: "pointer", clipPath: CLIP }}
          hoverStyle={{ background: C.rustDark }}>
          {seeAllLabel} →
        </Hover>
      </div>
    </div>
  );
}
