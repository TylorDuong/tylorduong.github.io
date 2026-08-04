import { F, C, mono } from "@/lib/theme";
import { Hover } from "@/lib/Hover";

// The card used in the home "Featured Work" grids. `proj` carries the display
// fields prepared upstream (no, accent, image, open, …).
export function ProjectCard({ proj }) {
  return (
    <Hover
      as="div"
      role="button"
      tabIndex={0}
      onClick={proj.open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && proj.open()}
      style={{
        border: `1px solid ${C.ink}`,
        cursor: "pointer",
        background: C.paper,
        display: "flex",
        flexDirection: "column",
      }}
      hoverStyle={{ background: C.tint }}
    >
      <div
        role="img"
        aria-label={proj.title}
        style={{
          backgroundColor: C.tan,
          borderBottom: `1px solid ${C.ink}`,
          aspectRatio: "16/9",
          backgroundImage: `url(${proj.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={mono({ fontSize: 11, letterSpacing: "0.88px", color: C.muted, display: "inline-flex", alignItems: "center", gap: 8 })}>
            <span style={{ width: 9, height: 9, background: proj.accent }} />
            {proj.no}
          </span>
          <span style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted })}>{proj.year}</span>
        </div>
        <div style={{ fontFamily: F.tight, fontSize: 33.28, fontWeight: 500, lineHeight: "33.28px", letterSpacing: "-0.832px" }}>
          {proj.title}
        </div>
        <div style={{ fontFamily: F.body, fontSize: 14, lineHeight: "19px", color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {proj.summary}
        </div>
        <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted })}>{proj.category}</div>
      </div>
    </Hover>
  );
}
