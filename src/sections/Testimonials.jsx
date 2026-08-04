import { F, C, mono, sectionH2 } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { Hover } from "@/lib/Hover";

function ArrowButton({ label, onClick, children }) {
  return (
    <Hover as="button" onClick={onClick} aria-label={label}
      style={{ width: 44, height: 44, background: C.card, border: `1px solid ${C.ink}`, cursor: "pointer", fontFamily: F.mono, fontSize: 15, color: C.ink }}
      hoverStyle={{ background: C.tint }}>
      {children}
    </Hover>
  );
}

export function Testimonials({ innerRef, t, counter, onPrev, onNext }) {
  return (
    <div ref={innerRef} data-r="wrap" style={{ maxWidth: 1400, margin: "0 auto", padding: "96px 40px 0" }}>
      <div style={mono({ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 })}>
        <Mark name="twins" size={14} color={C.rust} />
        SEC.04
      </div>
      <h2 data-r="h2" style={{ ...sectionH2, margin: "0 0 48px" }}>Testimonials</h2>

      <div data-r="testi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 24, alignItems: "end" }}>
        <div>
          <blockquote
            data-r="bigquote"
            style={{ fontFamily: F.tight, fontSize: 44, fontWeight: 600, lineHeight: "42px", letterSpacing: "-1.32px", margin: 0, maxWidth: 960, minHeight: 170 }}
          >
            “{t.quote}”
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
            <div
              role="img"
              aria-label={t.author}
              style={{ width: 56, height: 56, border: `1px solid ${C.ink}`, backgroundColor: C.tan, backgroundImage: `url(${t.avatar})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div>
              <div style={{ fontFamily: F.body, fontSize: 15, fontWeight: 600, letterSpacing: "-0.15px" }}>{t.author}</div>
              <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", color: C.muted, marginTop: 2 })}>{t.role}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
          <div style={mono({})}>{counter}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <ArrowButton label="Previous report" onClick={onPrev}>←</ArrowButton>
            <ArrowButton label="Next report" onClick={onNext}>→</ArrowButton>
          </div>
        </div>
      </div>
    </div>
  );
}
