import { useState } from "react";

// Reproduces the design's `style-hover` attribute: merge `hoverStyle` over
// `style` while the pointer is over the element. Renders any tag via `as`.
export function Hover({ as = "div", style, hoverStyle, children, ...rest }) {
  const [over, setOver] = useState(false);
  const Tag = as;
  return (
    <Tag
      style={over ? { ...style, ...hoverStyle } : style}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
