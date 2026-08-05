import { useEffect, useRef, useState } from "react";
import { C, F, mono } from "@/lib/theme";
import { Hover } from "@/lib/Hover";
import { Button } from "./ui";
import { api } from "./api";

const WARN_BYTES = 600 * 1024;

const fmtSize = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

/**
 * Drop / paste / browse an image, or reuse one already in the repo.
 * Uploads go straight to the API as the raw request body — no multipart
 * parsing needed on either side.
 */
export function ImageDrop({ value, onChange, kind = "projects", suggestedName }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [existing, setExisting] = useState(null);
  const [picking, setPicking] = useState(false);
  const [over, setOver] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!picking || existing) return;
    api.assets(kind).then((r) => setExisting(r.files)).catch((e) => setError(e.message));
  }, [picking, existing, kind]);

  const upload = async (file) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const res = await api.upload(file, { kind, name: suggestedName || file.name });
      onChange(res.path);
      setExisting(null); // force a refetch so the picker shows the new file
      if (res.bytes > WARN_BYTES) {
        setError(`Uploaded (${fmtSize(res.bytes)}). Large images ship on every deploy — consider WebP.`);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          upload(e.dataTransfer.files?.[0]);
        }}
        onPaste={(e) => {
          const f = [...e.clipboardData.files][0];
          if (f) upload(f);
        }}
        style={{
          border: `2px dashed ${over ? C.rust : "rgba(22,25,15,0.42)"}`,
          background: over ? C.tint : C.paper,
          padding: 12,
          display: "flex",
          gap: 14,
          alignItems: "center",
        }}
      >
        {/* Preview at the real 16:9 the card uses, so framing is honest. */}
        <div style={{ width: 160, flex: "0 0 160px", aspectRatio: "16/9", border: `1px solid ${C.ink}`, background: C.tan, overflow: "hidden" }}>
          {value ? (
            <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ ...mono({ fontSize: 10, color: C.muted }), height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              NO IMAGE
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={mono({ fontSize: 11, fontWeight: 400, textTransform: "none", letterSpacing: "0.4px", color: C.muted, wordBreak: "break-all" })}>
            {busy ? "Uploading…" : value || "Drop an image here, paste, or browse."}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <Button onClick={() => fileRef.current?.click()} disabled={busy}>Browse</Button>
            <Button onClick={() => setPicking((p) => !p)} disabled={busy}>
              {picking ? "Hide library" : "Use existing"}
            </Button>
            {value && <Button variant="danger" onClick={() => onChange("")}>Clear</Button>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: "none" }}
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </div>
      </div>

      {error && (
        <div style={mono({ fontSize: 10, fontWeight: 700, color: C.rust, marginTop: 6, textTransform: "none", letterSpacing: "0.4px" })}>
          {error}
        </div>
      )}

      {picking && (
        <div style={{ marginTop: 8, border: `1px solid ${C.ink}`, padding: 8, maxHeight: 260, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 8 }}>
          {(existing || []).map((f) => (
            <Hover
              key={f.path}
              as="button"
              onClick={() => {
                onChange(f.path);
                setPicking(false);
              }}
              style={{ padding: 0, border: `1px solid ${value === f.path ? C.rust : C.ink}`, background: "transparent", cursor: "pointer", display: "block" }}
              hoverStyle={{ borderColor: C.rust }}
            >
              <img src={f.path} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
              <div style={{ fontFamily: F.mono, fontSize: 9, padding: "3px 4px", wordBreak: "break-all", color: C.muted }}>
                {f.name}
              </div>
            </Hover>
          ))}
          {existing && existing.length === 0 && (
            <div style={mono({ fontSize: 10, color: C.muted })}>No images yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
