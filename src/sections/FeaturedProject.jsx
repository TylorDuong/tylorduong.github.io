import { F, C, mono, sectionH2 } from "@/lib/theme";
import { Eyebrow } from "@/components/Eyebrow";
import { Gallery } from "@/components/Gallery";
import { ReadMore } from "@/components/ReadMore";
import { Hover } from "@/lib/Hover";

// The single spotlighted project at the top of the home page (under the hero).
// Shows the project's media carousel (demo video + images, falling back to the
// thumbnail) plus the same fields the detail view shows. Which project appears
// is derived in src/data.js (featuredProject); `project` also carries an
// `open()` callback wired by App so clicking the lead image or title jumps to
// the full detail view.
export function FeaturedProject({ project }) {
  const p = project;
  if (!p) return null;
  const stack = (p.tags || []).join(" · ").toUpperCase();

  const media = <Gallery slides={p.gallery} title={p.title} accent={p.accent} onImageActivate={p.open} autoPlayInView />;

  return (
    <div
      data-r="wrap"
      style={{ maxWidth: 1400, margin: "0 auto", padding: "96px 40px 0", position: "relative" }}
    >
      <Eyebrow mark="sphere">FEATURED</Eyebrow>

      <div data-r="feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, marginTop: 24, alignItems: "start" }}>
        {media}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <Hover
              as="button"
              onClick={p.open}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
              hoverStyle={{ color: C.rust }}
            >
              <h2 data-r="h2" style={{ ...sectionH2, margin: 0 }}>{p.title}</h2>
            </Hover>
            <div style={mono({ color: C.muted })}>{p.category} / {p.year}</div>
          </div>

          <ReadMore
            data-r="lead"
            full={p.description}
            short={p.descriptionShort}
            onMore={p.open}
            style={{ fontFamily: F.body, fontSize: 25.6, fontWeight: 400, lineHeight: "32.768px", letterSpacing: "-0.384px", color: C.muted, margin: 0 }}
          />

          <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted })}>{stack}</div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", borderTop: "1px solid rgba(22,25,15,0.18)", paddingTop: 16 }}>
            {p.link && (
              <a href={p.link} target="_blank" rel="noopener noreferrer" style={mono({ fontSize: 11, letterSpacing: "0.88px" })}>View Artifact ↗</a>
            )}
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" style={mono({ fontSize: 11, letterSpacing: "0.88px" })}>Source ↗</a>
            )}
            <button
              onClick={p.open}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", ...mono({ fontSize: 11, letterSpacing: "0.88px", color: C.rust }) }}
            >
              Open Unit File →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
