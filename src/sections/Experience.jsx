import { F, C, mono, sectionH2 } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { Hover } from "@/lib/Hover";
import { experiences } from "@/data";

const GRID = "60px 220px 1fr 280px";

export function Experience({ innerRef }) {
  return (
    <div ref={innerRef} data-r="wrap" style={{ maxWidth: 1400, margin: "0 auto", padding: "96px 40px 0" }}>
      <div style={mono({ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 })}>
        <Mark name="cross" size={14} color={C.rust} />
        SEC.03
      </div>
      <h2 data-r="h2" style={{ ...sectionH2, margin: "0 0 48px" }}>Experience</h2>

      <div
        data-r="exp-head"
        style={{ display: "grid", gridTemplateColumns: GRID, gap: "0 24px", paddingBottom: 12, borderBottom: `3px solid ${C.ink}`, ...mono({}) }}
      >
        <div>No.</div>
        <div>Period</div>
        <div>Role / Unit</div>
        <div>Stack</div>
      </div>

      {experiences.map((exp, i) => (
        <Hover
          key={i}
          as="div"
          data-r="exp-row"
          style={{ display: "grid", gridTemplateColumns: GRID, gap: "0 24px", padding: "20px 0", borderBottom: "1px solid rgba(22,25,15,0.18)", background: "transparent" }}
          hoverStyle={{ background: C.tint }}
        >
          <div style={mono({ fontSize: 12, fontWeight: 400, letterSpacing: "0.6px", color: C.muted, textTransform: "none" })}>
            {String(i + 1).padStart(2, "0")}
          </div>
          <div style={mono({ fontSize: 12, fontWeight: 400, letterSpacing: "0.6px", lineHeight: "17.4px", textTransform: "none" })}>
            {exp.period}
            {exp.current && (
              <span style={{ display: "block", color: C.rust, fontWeight: 700, marginTop: 4 }}>● ACTIVE</span>
            )}
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: 15, fontWeight: 600, letterSpacing: "-0.15px", lineHeight: "21.75px" }}>{exp.role}</div>
            <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted, margin: "4px 0 8px" })}>{exp.company}</div>
            <p style={{ fontFamily: F.body, fontSize: 15, lineHeight: "21.75px", color: C.muted, margin: 0, maxWidth: 560 }}>{exp.description}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignContent: "flex-start" }}>
            {exp.technologies.map((tech) => (
              <span key={tech} style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", textTransform: "none", border: "1px solid rgba(22,25,15,0.42)", borderRadius: 2, padding: "3px 7px", height: "fit-content" })}>
                {tech}
              </span>
            ))}
          </div>
        </Hover>
      ))}
    </div>
  );
}
