// Named résumé selections, kept in localStorage with .json export/import so a
// preset can be filed alongside a job application. Imported only by
// ExportPanel.jsx, which is dev-gated — this never reaches production.

import { normalizeSelection } from "./selection";

const KEY = "resume.exportPresets.v1";
const KIND = "resume-export-preset";

export function loadPresets() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function savePresets(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function downloadPreset(name, selection) {
  const body = { kind: KIND, version: 1, name, savedAt: new Date().toISOString(), selection };
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(body, null, 2)], { type: "application/json" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-preset-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "untitled"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Throws with a readable message if the file isn't a preset. */
export function parsePresetFile(text) {
  let doc;
  try {
    doc = JSON.parse(text);
  } catch {
    throw new Error("not valid JSON");
  }
  if (doc?.kind !== KIND) throw new Error("not a résumé preset file");
  return { name: typeof doc.name === "string" ? doc.name : "Imported", selection: normalizeSelection(doc.selection) };
}
