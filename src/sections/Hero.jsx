import { F, C, CLIP, mono } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { Hover } from "@/lib/Hover";
import { Linescape } from "@/components/Linescape";
import { skills } from "@/data";

const CV_URL =
  "https://drive.google.com/file/d/1mPAFaC18GQo6RkEi8rYPYC5cGysHmfSd/view?usp=sharing";
const SKILLS_LINE = skills.map((s) => s.toUpperCase()).join(" · ");

function MetricCard({ label, value, sub, expanded, breakdown, onToggle, ariaLabel }) {
  return (
    <div style={{ padding: "28px 24px", background: C.paper, display: "flex", flexDirection: "column" }}>
      <div style={mono({ fontSize: 11, letterSpacing: "0.88px", color: C.muted, display: "flex", alignItems: "center", gap: 8 })}>
        <span style={{ width: 8, height: 8, background: C.rust, display: "inline-block" }} />
        {label}
      </div>
      <div
        style={{
          fontFamily: F.tight,
          fontSize: "clamp(44px,5vw,72px)",
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          marginTop: 16,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.6px", color: C.muted, marginTop: 12 })}>
        {sub}
      </div>
      {expanded && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid rgba(22,25,15,0.18)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {breakdown.map((b) => (
            <div
              key={b.label}
              style={{ display: "flex", justifyContent: "space-between", gap: 16, fontFamily: F.mono, fontSize: 12, letterSpacing: "0.4px" }}
            >
              <span style={{ color: C.muted }}>{b.label}</span>
              <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{b.value}</span>
            </div>
          ))}
        </div>
      )}
      <Hover
        as="button"
        onClick={onToggle}
        aria-label={ariaLabel}
        aria-expanded={expanded}
        style={{
          marginTop: "auto",
          width: "50%",
          alignSelf: "center",
          paddingTop: 16,
          paddingBottom: 4,
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
        }}
        hoverStyle={{ opacity: 0.6 }}
      >
        <span
          style={{
            display: "block",
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderTop: "12px solid rgba(22,25,15,0.55)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </Hover>
    </div>
  );
}

export function Hero({ go, goIndex, metrics, unitCount, tickerDur }) {
  return (
    <div>
      {/* HERO */}
      <div
        data-r="hero"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "112px 40px 0",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div>
          <div style={mono({ color: C.ink, marginBottom: 32, lineHeight: "18.2px" })}>
            B.S. COMPUTER SCIENCE — ARIZONA STATE UNIVERSITY — MAY 2028
          </div>
          <h1
            style={{
              fontFamily: F.tight,
              fontSize: "clamp(56px,8.5vw,128px)",
              fontWeight: 600,
              lineHeight: 0.86,
              letterSpacing: "-0.04em",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Full-Stack Developer
            <br />
            focused on
            <br />
            performance and design
          </h1>
          <p
            data-r="lead"
            style={{
              fontFamily: F.body,
              fontSize: 25.6,
              fontWeight: 400,
              lineHeight: "32.768px",
              letterSpacing: "-0.384px",
              color: C.muted,
              maxWidth: 560,
              margin: "40px 0 0",
            }}
          >
            Computer Science 2028 early graduate with project experience in full-stack
            development, object-oriented programming, and game development.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <Hover
                as="button"
                onClick={() => go("contact")}
                style={{
                  background: C.rust,
                  color: C.paper,
                  border: `6px solid ${C.ink}`,
                  ...mono({ fontSize: 13 }),
                  padding: "14px 28px",
                  cursor: "pointer",
                  clipPath: CLIP,
                }}
                hoverStyle={{ background: C.rustDark }}
              >
                Contact me →
              </Hover>
              <Hover
                as="a"
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  color: C.ink,
                  border: `6px solid ${C.ink}`,
                  ...mono({ fontSize: 13 }),
                  padding: "14px 28px",
                  textDecoration: "none",
                  clipPath: CLIP,
                }}
                hoverStyle={{ background: "rgba(22,25,15,0.08)" }}
              >
                Download CV
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M4 19h16" />
                </svg>
              </Hover>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <Hover as="a" href="https://github.com/TylorDuong" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: F.body, fontSize: 15, color: C.ink, textDecoration: "none" }}
                hoverStyle={{ color: C.rust }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                GitHub
              </Hover>
              <Hover as="a" href="https://www.linkedin.com/in/tylor-duong/" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: F.body, fontSize: 15, color: C.ink, textDecoration: "none" }}
                hoverStyle={{ color: C.rust }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 11.001-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.558V9h3.556v11.452z" /></svg>
                LinkedIn
              </Hover>
            </div>
          </div>
        </div>

        {/* HERO MEDIA */}
        <div data-r="hero-media" style={{ position: "relative", paddingTop: 8 }}>
          <Mark
            name="corner"
            size={60}
            color={C.ink}
            style={{ position: "absolute", top: -24, right: -22, opacity: 0.9, pointerEvents: "none", zIndex: 2 }}
          />
          <div style={{ border: `6px solid ${C.ink}`, background: C.tan }}>
            <img src="/profile-photo.png" alt="Tylor Duong" style={{ display: "block", width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />
          </div>
          <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.88px", lineHeight: "15.95px", color: C.muted, textAlign: "right", marginTop: 48 })}>
            LOCATION: CHANDLER.AZ
          </div>
        </div>
      </div>

      {/* HERO METRICS TICKER */}
      <div style={{ maxWidth: 1400, margin: "56px auto 0", padding: "0 40px" }} data-r="wrap">
        <div style={mono({ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 10, marginBottom: 16 })}>
          <Mark name="burst" size={12} color={C.rust} />
          Combined Impact — Live Readout
        </div>
        <div
          data-r="metrics-grid"
          style={{ border: `1px solid ${C.ink}`, background: C.ink, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1 }}
        >
          <MetricCard
            label="People Helped"
            value={metrics.peopleHelpedValue}
            sub="Students + Users Reached"
            expanded={metrics.peopleExpanded}
            breakdown={metrics.peopleHelpedBreakdown}
            onToggle={metrics.togglePeople}
            ariaLabel="Toggle people helped breakdown"
          />
          <MetricCard
            label="Saved / Year"
            value={metrics.savedValue}
            sub="Enterprise Ops Savings"
            expanded={metrics.savedExpanded}
            breakdown={metrics.savedBreakdown}
            onToggle={metrics.toggleSaved}
            ariaLabel="Toggle savings breakdown"
          />
          <Hover
            as="button"
            onClick={goIndex}
            style={{
              padding: "28px 24px",
              background: C.paper,
              display: "flex",
              flexDirection: "column",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              boxSizing: "border-box",
              fontFamily: "inherit",
              color: "inherit",
            }}
            hoverStyle={{ background: C.tint }}
          >
            <div style={mono({ fontSize: 11, letterSpacing: "0.88px", color: C.muted, display: "flex", alignItems: "center", gap: 8 })}>
              <span style={{ width: 8, height: 8, background: C.rust, display: "inline-block" }} />
              Projects
            </div>
            <div style={{ fontFamily: F.tight, fontSize: "clamp(44px,5vw,72px)", fontWeight: 600, lineHeight: 1, letterSpacing: "-0.03em", marginTop: 16, fontVariantNumeric: "tabular-nums" }}>
              {unitCount}
            </div>
            <div style={mono({ fontSize: 11, fontWeight: 400, letterSpacing: "0.6px", color: C.muted, marginTop: 12 })}>
              Projects + Ventures Live
            </div>
            <div style={mono({ fontSize: 11, letterSpacing: "0.88px", color: C.rust, textDecoration: "underline", textUnderlineOffset: "3px", marginTop: "auto", paddingTop: 16 })}>
              Browse Project Index →
            </div>
          </Hover>
        </div>
      </div>

      {/* HERO LINESCAPE */}
      <div style={{ maxWidth: 1400, margin: "64px auto 0", padding: "0 40px" }} data-r="wrap">
        <Linescape count={16} wMax={7} wMin={1} masked />
      </div>

      {/* SKILLS READOUT (scrolling) */}
      <div
        data-r="wrap"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "32px 40px",
          borderTop: "1px solid rgba(22,25,15,0.18)",
          borderBottom: "1px solid rgba(22,25,15,0.18)",
          display: "flex",
          gap: 24,
          alignItems: "baseline",
          overflow: "hidden",
        }}
      >
        <span style={mono({ whiteSpace: "nowrap", flexShrink: 0 })}>Tools /</span>
        <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
          <Hover
            style={{ display: "flex", width: "max-content", whiteSpace: "nowrap", animation: `ticker-scroll ${tickerDur} linear infinite` }}
            hoverStyle={{ animationPlayState: "paused" }}
          >
            {[0, 1].map((n) => (
              <span key={n} style={mono({ fontSize: 12, fontWeight: 400, letterSpacing: "0.6px", lineHeight: "17.4px", color: C.muted, paddingRight: 48 })}>
                {SKILLS_LINE}
              </span>
            ))}
          </Hover>
        </div>
      </div>
    </div>
  );
}
