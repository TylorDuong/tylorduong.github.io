import { useState } from "react";
import { F, C } from "@/lib/theme";

// Word-boundary truncation with an ellipsis, so a capped description never cuts
// mid-word.
function truncate(text, limit) {
  if (text.length <= limit) return text;
  const slice = text.slice(0, limit);
  const sp = slice.lastIndexOf(" ");
  return slice.slice(0, sp > 0 ? sp : limit).trimEnd() + "…";
}

// Caps a long description so the Featured highlight never runs off the page.
// Collapsed, it shows `short` (an authored abridged description) when provided,
// otherwise `full` truncated at a word boundary near `limit`.
//
// By default "Read more" expands the full text inline. Pass `onMore` to instead
// make it a navigation link (e.g. open the project's detail/gallery page) — no
// inline expansion, no "Read less". Either way the link only appears when
// there's actually more than the collapsed text. Remaining props (style,
// data-r, …) pass through to the paragraph so it keeps the caller's typography.
export function ReadMore({ full = "", short = "", limit = 320, onMore, ...rest }) {
  const [open, setOpen] = useState(false);
  const text = (full || "").trim();
  const abridged = (short || "").trim() || truncate(text, limit);
  const hasMore = abridged !== text;
  const expanded = open && !onMore;

  return (
    <p {...rest}>
      {expanded || !hasMore ? text : abridged}
      {hasMore && (
        <>
          {" "}
          <button
            onClick={onMore || (() => setOpen((v) => !v))}
            aria-expanded={onMore ? undefined : open}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: F.body,
              fontSize: "inherit",
              fontWeight: 600,
              color: C.rust,
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              whiteSpace: "nowrap",
            }}
          >
            {onMore ? "Read more →" : open ? "Read less" : "Read more"}
          </button>
        </>
      )}
    </p>
  );
}
