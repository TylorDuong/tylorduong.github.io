// Deckplate Portfolio design tokens — the paper / ink / rust system.
export const C = {
  ink: "#16190f",
  paper: "#f1ede2",
  rust: "#a8571c",
  rustDark: "#7d3f12",
  tan: "#cdbb96",
  card: "#e8e1cd",
  rowAlt: "#e6dfc9",
  muted: "rgba(22,25,15,0.55)",
  hair: "rgba(22,25,15,0.18)",
  hairStrong: "rgba(22,25,15,0.42)",
  tint: "rgba(168,87,28,0.12)",
};

export const F = {
  tight: "'Inter Tight', sans-serif",
  mono: "'Space Mono', monospace",
  body: "Inter, sans-serif",
};

// Angular cut used on the primary "deckplate" buttons.
export const CLIP =
  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";

// A monospaced eyebrow / label.
export const mono = (extra = {}) => ({
  fontFamily: F.mono,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "1.04px",
  textTransform: "uppercase",
  ...extra,
});

// The oversized section title (About / Projects / …).
export const sectionH2 = {
  fontFamily: F.tight,
  fontSize: 72,
  fontWeight: 600,
  lineHeight: "64.8px",
  letterSpacing: "-2.52px",
  margin: 0,
};

// Shared page gutter wrapper.
export const wrap = (extra = {}) => ({
  maxWidth: 1400,
  margin: "0 auto",
  padding: "0 40px",
  ...extra,
});
