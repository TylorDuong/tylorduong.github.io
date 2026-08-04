import { C, mono } from "@/lib/theme";
import { Mark } from "@/lib/Mark";

// "◆ SEC.01" style eyebrow that heads each section.
export function Eyebrow({ mark = "burst", children, marginBottom = 20 }) {
  return (
    <div style={mono({ display: "flex", alignItems: "center", gap: 10, marginBottom, position: "relative" })}>
      <Mark name={mark} size={14} color={C.rust} />
      {children}
    </div>
  );
}
