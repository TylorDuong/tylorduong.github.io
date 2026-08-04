// Decorative "deckplate" glyphs, recreated as crisp inline SVG so they stay
// razor sharp at any scale (from 8px accents to 360px faint orbs).
// name: burst | corner | cross | goblet | twins | sphere | dotgrid

const dots = [];
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 5; c++) {
    dots.push(<circle key={`${r}-${c}`} cx={14 + c * 18} cy={14 + r * 18} r={5} />);
  }
}

const SHAPES = {
  burst: (
    <path d="M50 0 L59 41 L100 50 L59 59 L50 100 L41 59 L0 50 L41 41 Z" />
  ),
  corner: <path d="M0 0 H44 V13 H13 V44 H0 Z" />,
  cross: (
    <path d="M42 0 H58 V42 H100 V58 H58 V100 H42 V58 H0 V42 H42 Z" />
  ),
  goblet: (
    <g>
      <path d="M22 6 H78 A28 30 0 0 1 22 6 Z" />
      <rect x="46" y="34" width="8" height="42" />
      <rect x="30" y="82" width="40" height="8" />
    </g>
  ),
  twins: (
    <g>
      <circle cx="36" cy="50" r="34" />
      <circle cx="70" cy="50" r="26" />
    </g>
  ),
};

export function Mark({ name = "burst", size = 14, color = "currentColor", style, className }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    className,
    style,
    "aria-hidden": true,
    focusable: false,
  };

  if (name === "sphere") {
    // Concentric rings read as a wireframe sphere at low opacity.
    return (
      <svg {...common} fill="none" stroke={color} strokeWidth="2.5">
        <circle cx="50" cy="50" r="47" />
        <ellipse cx="50" cy="50" rx="20" ry="47" />
        <ellipse cx="50" cy="50" rx="40" ry="47" />
        <line x1="3" y1="50" x2="97" y2="50" />
      </svg>
    );
  }

  if (name === "dotgrid") {
    return (
      <svg {...common} fill={color}>
        {dots}
      </svg>
    );
  }

  return (
    <svg {...common} fill={color}>
      {SHAPES[name] || SHAPES.burst}
    </svg>
  );
}
