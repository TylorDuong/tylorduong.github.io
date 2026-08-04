import { useEffect, useRef, useState } from "react";

// Ramp of bar heights (light at the top → heavy at the bottom) used by the
// "linescape" dividers.
export function makeLines(count, wMax, wMin) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const w = wMin + (wMax - wMin) * t;
    rows.push(Math.round(w * 10) / 10);
  }
  return rows;
}

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Animates 0 → 1 over `dur` ms, restarting whenever `key` changes. Respects
// prefers-reduced-motion (jumps straight to 1).
export function useCountUp(key, dur = 1700) {
  const [t, setT] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    // All state updates happen inside the rAF callback (never synchronously in
    // the effect body), so the animation restarts cleanly whenever `key` changes.
    const tick = (now) => {
      if (reduce) {
        setT(1);
        return;
      }
      const p = Math.min(1, (now - t0) / dur);
      setT(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [key, dur]);

  return easeOutExpo(t);
}

// Procedural paper grain (SVG turbulence) as a data URI — no external asset,
// tiled + multiplied over the page for the printed-deckplate texture.
export const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";
