import { F, C, mono, sectionH2 } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { Eyebrow } from "@/components/Eyebrow";
import { about, highlights } from "@/data";

export function About({ innerRef }) {
  return (
    <div
      ref={innerRef}
      data-r="wrap"
      style={{ maxWidth: 1400, margin: "0 auto", padding: "96px 40px 0", position: "relative" }}
    >
      <div data-r="about-orb" style={{ position: "absolute", top: 0, right: 40, pointerEvents: "none" }}>
        <Mark name="sphere" size={360} color={C.ink} style={{ opacity: 0.04, display: "block" }} />
      </div>

      <Eyebrow mark="goblet">SEC.01</Eyebrow>
      <h2 data-r="h2" style={{ ...sectionH2, margin: "0 0 48px", maxWidth: 900 }}>
        About
      </h2>

      <div data-r="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div>
          {about.paragraphs.map((text, i) => (
            <p key={i} style={{ fontFamily: F.body, fontSize: 15, lineHeight: "21.75px", color: C.muted, margin: "0 0 16px", maxWidth: 560 }}>
              {text}
            </p>
          ))}
          <div style={{ border: `6px solid ${C.ink}`, padding: 24, marginTop: 32, maxWidth: 520 }}>
            <p data-r="lead" style={{ fontFamily: F.body, fontSize: 25.6, fontWeight: 400, lineHeight: "32.768px", letterSpacing: "-0.384px", margin: 0 }}>
              “{about.quote}”
            </p>
            <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted, marginTop: 12 })}>
              — OPERATOR STATEMENT / TD-2027
            </div>
          </div>
        </div>

        <div data-r="hl-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {highlights.map((hl, i) => (
            <div key={hl.code} style={{ background: C.card, border: `1px solid ${C.ink}`, padding: 16, display: "grid", gridTemplateColumns: "20px 1fr", gap: 12 }}>
              <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted, borderRight: "1px solid rgba(22,25,15,0.18)", paddingRight: 8, textTransform: "none" })}>
                -{i}
              </div>
              <div>
                <div style={mono({})}>
                  [{hl.code}] {hl.title}
                </div>
                <p style={{ fontFamily: F.body, fontSize: 15, lineHeight: "21.75px", color: C.muted, margin: "8px 0 0" }}>
                  {hl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
