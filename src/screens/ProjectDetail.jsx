import { F, C, mono, sectionH2 } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { Hover } from "@/lib/Hover";

function NavLink({ onClick, children }) {
  return (
    <Hover as="button" onClick={onClick}
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", ...mono({ color: C.rust, textDecoration: "underline", textUnderlineOffset: "3px" }) }}
      hoverStyle={{ color: C.rustDark }}>
      {children}
    </Hover>
  );
}

export function ProjectDetail({ project, counter, onPrev, onNext, goIndex }) {
  const p = project;
  const stack = (p.tags || []).join(" · ").toUpperCase();

  return (
    <div data-r="wrap" style={{ maxWidth: 1400, margin: "0 auto", padding: "64px 40px 96px", position: "relative" }}>
      <div data-r="pd-orb" style={{ position: "absolute", top: 56, right: 40, pointerEvents: "none" }}>
        <Mark name="twins" size={52} color={C.ink} style={{ opacity: 0.7, display: "block" }} />
      </div>

      <NavLink onClick={goIndex}>← Back to Index</NavLink>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 40, flexWrap: "wrap", gap: 16 }}>
        <h1 data-r="h2" style={sectionH2}>{p.title}</h1>
        <div style={mono({ color: C.muted })}>{p.category} / {p.year}</div>
      </div>

      <div data-r="pd-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, marginTop: 48, alignItems: "start" }}>
        <div
          role="img"
          aria-label={p.title}
          style={{ border: `6px solid ${C.ink}`, backgroundColor: C.tan, aspectRatio: "16/9", backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: C.card, border: `1px solid ${C.ink}`, padding: 20 }}>
            <div style={mono({ borderBottom: "1px solid rgba(22,25,15,0.42)", paddingBottom: 10, marginBottom: 14 })}>Unit File — {p.title}</div>
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "8px 12px", ...mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px" }) }}>
              <div style={{ color: C.muted }}>CATEGORY</div><div>{p.category}</div>
              <div style={{ color: C.muted }}>YEAR</div><div>{p.year}</div>
              <div style={{ color: C.muted }}>STACK</div><div>{stack}</div>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 18, borderTop: "1px solid rgba(22,25,15,0.18)", paddingTop: 14 }}>
              <a href={p.link} target="_blank" rel="noopener noreferrer" style={mono({ fontSize: 11, letterSpacing: "0.88px" })}>View Artifact ↗</a>
              <a href={p.github} target="_blank" rel="noopener noreferrer" style={mono({ fontSize: 11, letterSpacing: "0.88px" })}>Source ↗</a>
            </div>
          </div>
          <p data-r="lead" style={{ fontFamily: F.body, fontSize: 25.6, fontWeight: 400, lineHeight: "32.768px", letterSpacing: "-0.384px", color: C.muted, margin: 0 }}>
            {p.description}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(22,25,15,0.18)", marginTop: 64, paddingTop: 24 }}>
        <NavLink onClick={onPrev}>← Prev Unit</NavLink>
        <span style={mono({ fontWeight: 400, letterSpacing: "1.04px", color: C.muted })}>{counter}</span>
        <NavLink onClick={onNext}>Next Unit →</NavLink>
      </div>
    </div>
  );
}
