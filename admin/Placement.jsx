import { C, mono } from "@/lib/theme";
import { byRecency, periodLabel } from "@/lib/dates";

/**
 * Live "where will this land" readout.
 *
 * Uses the SAME byRecency comparator src/data.js uses, so what this predicts
 * is what the site will do — the point of the whole date migration is that
 * placement is derived rather than hand-maintained.
 */
export function Placement({ record, siblings, labelOf, scope = "list", sliceNote }) {
  const others = siblings.filter((s) => s.id !== record.id);
  const ordered = [...others, record].sort(byRecency);
  const idx = ordered.findIndex((r) => r.id === record.id);

  const before = ordered[idx - 1];
  const after = ordered[idx + 1];
  const inSlice = sliceNote && idx < sliceNote.count;

  return (
    <div style={{ border: `1px solid ${C.ink}`, background: C.card, padding: 12 }}>
      <div style={mono({ fontSize: 11, marginBottom: 8 })}>
        Position {idx + 1} of {ordered.length} in {scope}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {before && <Neighbour label={labelOf(before)} when={periodLabel(before.start, before.end)} />}
        <div
          style={mono({
            fontSize: 11,
            fontWeight: 700,
            textTransform: "none",
            letterSpacing: "0.4px",
            background: C.rust,
            color: C.paper,
            padding: "5px 8px",
          })}
        >
          ▸ {labelOf(record) || "(this entry)"} — {periodLabel(record.start, record.end) || "no dates yet"}
        </div>
        {after && <Neighbour label={labelOf(after)} when={periodLabel(after.start, after.end)} />}
      </div>

      {sliceNote && (
        <div
          style={mono({
            fontSize: 10,
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: "0.4px",
            color: inSlice ? C.ink : C.muted,
            marginTop: 8,
          })}
        >
          {inSlice
            ? `Shows on the home page (top ${sliceNote.count} ${sliceNote.of}).`
            : `Not on the home page — only the top ${sliceNote.count} ${sliceNote.of} appear there. Set a pin to force it.`}
        </div>
      )}
    </div>
  );
}

function Neighbour({ label, when }) {
  return (
    <div
      style={mono({
        fontSize: 10,
        fontWeight: 400,
        textTransform: "none",
        letterSpacing: "0.4px",
        color: C.muted,
        padding: "4px 8px",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      })}
    >
      <span>{label}</span>
      <span style={{ whiteSpace: "nowrap" }}>{when}</span>
    </div>
  );
}
