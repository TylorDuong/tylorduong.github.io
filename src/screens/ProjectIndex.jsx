import { F, C, mono } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { Hover } from "@/lib/Hover";

const GRID = "52px 96px minmax(220px,1fr) 200px 260px 64px";

function IndexHead() {
  return (
    <div data-r="idx-head" style={{ display: "grid", gridTemplateColumns: GRID, gap: "0 24px", paddingBottom: 12, borderBottom: `3px solid ${C.ink}`, ...mono({}) }}>
      <div>No.</div>
      <div>Thumb</div>
      <div>Project</div>
      <div>Category</div>
      <div>Stack</div>
      <div style={{ textAlign: "right" }}>Year</div>
    </div>
  );
}

function IndexRow({ proj }) {
  return (
    <Hover
      as="div"
      role="button"
      tabIndex={0}
      data-r="idx-row"
      onClick={proj.open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && proj.open()}
      style={{ display: "grid", gridTemplateColumns: GRID, gap: "0 24px", alignItems: "center", padding: "20px 0", borderBottom: "1px solid rgba(22,25,15,0.18)", cursor: "pointer", background: proj.rowBg }}
      hoverStyle={{ background: C.tint }}
    >
      <div style={mono({ fontSize: 12, letterSpacing: "0.6px", color: proj.accent, display: "flex", alignItems: "center", gap: 8, textTransform: "none" })}>
        <span style={{ width: 10, height: 10, background: proj.accent }} />
        {proj.no}
      </div>
      <div
        role="img"
        aria-label={proj.title}
        style={{ width: 96, aspectRatio: "16/9", border: `1px solid ${C.ink}`, borderLeft: `4px solid ${proj.accent}`, backgroundColor: C.tan, backgroundImage: `url(${proj.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: F.tight, fontSize: 33.28, fontWeight: 500, lineHeight: "33.28px", letterSpacing: "-0.832px" }}>{proj.title}</div>
        <div style={{ fontFamily: F.body, fontSize: 14, lineHeight: "19px", color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 4 }}>{proj.summary}</div>
      </div>
      <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted })}>{proj.category}</div>
      <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted })}>{proj.stack}</div>
      <div style={mono({ fontSize: 12, fontWeight: 400, letterSpacing: "0.6px", textAlign: "right", textTransform: "none" })}>{proj.year}</div>
    </Hover>
  );
}

function GroupTitle({ label, count }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "56px 0 16px" }}>
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
        Index.
      </h1>

      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
        <h2 style={{ fontFamily: F.tight, fontSize: 34, fontWeight: 600, letterSpacing: "-1px", margin: 0 }}>Personal</h2>
        <span style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted })}>{personalCount} UNITS</span>
      </div>
      <IndexHead />
      {personalProjects.map((proj) => (
        <IndexRow key={proj.id} proj={proj} />
      ))}

      <GroupTitle label="Enterprise" count={enterpriseCount} />
      <IndexHead />
      {enterpriseProjects.map((proj) => (
        <IndexRow key={proj.id} proj={proj} />
      ))}

      <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted, marginTop: 24 })}>
        SELECT A ROW TO OPEN THE UNIT FILE. SOURCE: GITHUB.COM/TYLORDUONG
      </div>
    </div>
  );
}
