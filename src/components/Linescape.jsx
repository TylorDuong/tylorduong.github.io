import { makeLines } from "@/lib/util";
import { C } from "@/lib/theme";

// A stack of ink bars, thin at the top and thick at the bottom. Optionally
// masked into a soft radial fade with a floating rust square, matching the
// hero's "linescape" motif.
export function Linescape({ count = 16, wMax = 7, wMin = 1, masked = false, reverse = false }) {
  let heights = makeLines(count, wMax, wMin);
  if (reverse) heights = [...heights].reverse();

  const bars = (
    <div style={{ position: "relative" }}>
      {heights.map((h, i) => (
        <div key={i} style={{ height: h, background: C.ink, marginBottom: 6 }} />
      ))}
    </div>
  );

  if (!masked) return bars;

  const mask = "radial-gradient(150% 130% at 30% 130%, #000 58%, transparent 59%)";
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "16%",
          bottom: "22%",
          width: 72,
          height: 72,
          background: C.rust,
        }}
      />
      {bars}
    </div>
  );
}
