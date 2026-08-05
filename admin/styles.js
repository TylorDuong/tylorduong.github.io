// Shared style objects for the admin UI.
//
// Kept out of ui.jsx so that file exports only components — mixing component
// and non-component exports breaks React Fast Refresh.

import { C, F, mono } from "@/lib/theme";

export const input = {
  width: "100%",
  boxSizing: "border-box",
  background: C.paper,
  border: `1px solid ${C.ink}`,
  borderRadius: 0,
  padding: "9px 12px",
  fontFamily: F.body,
  fontSize: 14,
  color: C.ink,
};

export const label = mono({ display: "block", marginBottom: 6, fontSize: 11 });
