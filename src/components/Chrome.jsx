import { PAPER_GRAIN } from "@/lib/util";

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
