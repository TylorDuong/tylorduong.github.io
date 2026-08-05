import { F, C } from "@/lib/theme";
import { PAPER_GRAIN } from "@/lib/util";
import { contact } from "@/data";

// Fixed HUD corner readout (contact ID), bottom-right.
export function HudCorners({ show = true }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 60,
        fontFamily: F.mono,
        fontSize: 11,
        letterSpacing: "0.88px",
        lineHeight: "15.95px",
        color: "rgba(22,25,15,0.55)",
        textTransform: "uppercase",
      }}
    >
      <div
        data-r="hud-box"
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          textAlign: "right",
          background: C.paper,
          padding: "2px 6px",
        }}
      >
        ID: {contact.email}
        <br />
        TEL: {contact.phoneDotted}
      </div>
    </div>
  );
}

// Multiply-blended paper grain behind everything.
export function PaperGrain({ opacity = 0.6 }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: -1,
        opacity,
        mixBlendMode: "multiply",
        backgroundImage: PAPER_GRAIN,
        backgroundRepeat: "repeat",
        backgroundSize: "220px 220px",
      }}
    />
  );
}
