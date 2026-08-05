import { useEffect, useRef, useState } from "react";
import { C, F, mono } from "@/lib/theme";
import { api } from "./api";
import { Button, Field, Text } from "./ui";

/**
 * Publish is deliberately separate from Save. Saving only writes files;
 * nothing reaches the live site until this screen is used.
 */
export function Publish({ dirty, onSaveAll }) {
  const [status, setStatus] = useState(null);
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(null);
  const [commitSource, setCommitSource] = useState(true);
  const [push, setPush] = useState(true);
  const [message, setMessage] = useState("Update site content via admin");
  const logRef = useRef(null);

  const refresh = () => api.status().then(setStatus).catch(() => {});

  // Must not be `useEffect(refresh, [])`: refresh returns a promise, React
  // takes an effect's return value to be the cleanup function, and calls it on
  // unmount — "destroy is not a function".
  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [log]);

  const start = async () => {
    setLog([]);
    setDone(null);
    setRunning(true);

    const stop = api.streamPublish((line) => {
      if (line === "__done__") {
        setRunning(false);
        stop();
        refresh();
        setDone(true);
        return;
      }
      setLog((l) => [...l, line]);
    });

    try {
      await api.publish({ commitSource, push, message });
    } catch (e) {
      setLog((l) => [...l, `ERROR ${e.message}`]);
      setRunning(false);
      stop();
    }
  };

  const anyDirty = Object.values(dirty).some(Boolean);
  const wrongBranch = status && status.branch !== "main";
  const blocked = anyDirty || !status?.valid || running;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={mono({ fontSize: 12, marginBottom: 16, borderBottom: `2px solid ${C.ink}`, paddingBottom: 6 })}>
        Pre-flight
      </div>

      <Check ok={!anyDirty} label="All edits saved to disk">
        {anyDirty && <Button onClick={onSaveAll} style={{ marginLeft: 12 }}>Save all now</Button>}
      </Check>

      <Check ok={!!status?.valid} label="All content files valid">
        {status && !status.valid && (
          <span style={mono({ fontSize: 10, color: C.rust, textTransform: "none" })}>
            {Object.keys(status.problems).join(", ")}
          </span>
        )}
      </Check>

      <Check ok={!wrongBranch} warn={wrongBranch} label={`On branch "${status?.branch ?? "…"}"`}>
        {wrongBranch && (
          <span style={mono({ fontSize: 10, color: C.rust, textTransform: "none" })}>
            deploys usually run from main
          </span>
        )}
      </Check>

      <Check ok={!status?.dirty?.length} warn={!!status?.dirty?.length} label="Source committed to git">
        {status?.dirty?.length > 0 && (
          <span style={mono({ fontSize: 10, color: C.muted, textTransform: "none" })}>
            {status.dirty.length} uncommitted file(s)
          </span>
        )}
      </Check>

      {status?.dirty?.length > 0 && (
        <div style={{ border: `1px solid ${C.ink}`, background: C.card, padding: 14, margin: "12px 0 20px" }}>
          <div style={mono({ fontSize: 11, marginBottom: 8 })}>Uncommitted source</div>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, maxHeight: 120, overflowY: "auto", marginBottom: 12 }}>
            {status.dirty.map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <label style={{ ...mono({ fontSize: 11, textTransform: "none" }), display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input type="checkbox" checked={commitSource} onChange={(e) => setCommitSource(e.target.checked)} />
            Commit these before deploying
          </label>
          <label style={{ ...mono({ fontSize: 11, textTransform: "none" }), display: "flex", gap: 8, alignItems: "center", marginBottom: 12, opacity: commitSource ? 1 : 0.4 }}>
            <input type="checkbox" checked={push} disabled={!commitSource} onChange={(e) => setPush(e.target.checked)} />
            …and push to origin
          </label>
          {commitSource && (
            <Field label="Commit message">
              <Text value={message} onChange={setMessage} />
            </Field>
          )}
          <div style={mono({ fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: "0.4px", color: C.muted })}>
            Deploying without committing publishes content that exists only on this machine — the
            next clean build would lose it.
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "24px 0" }}>
        <Button variant="primary" onClick={start} disabled={blocked}>
          {running ? "Publishing…" : "Publish to live"}
        </Button>
        <Button onClick={refresh} disabled={running}>Re-check</Button>
        <span style={mono({ fontSize: 10, color: C.muted, textTransform: "none", letterSpacing: "0.4px" })}>
          Runs npm run deploy (build + push to gh-pages).
        </span>
      </div>

      {(log.length > 0 || running) && (
        <div
          ref={logRef}
          style={{
            background: C.ink, color: "rgba(241,237,226,0.85)",
            fontFamily: F.mono, fontSize: 11, lineHeight: 1.55,
            padding: 16, maxHeight: 360, overflowY: "auto", whiteSpace: "pre-wrap",
          }}
        >
          {log.map((l, i) => (
            <div key={i} style={{ color: /error|failed|fatal/i.test(l) ? "#e8734a" : undefined }}>{l}</div>
          ))}
        </div>
      )}

      {done && !running && (
        <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
          <a href="https://tylorduong.dev/" target="_blank" rel="noreferrer" style={{ ...mono({ fontSize: 11 }), color: C.rust }}>
            tylorduong.dev ↗
          </a>
          <a href="https://tylorduong.dev/resume/" target="_blank" rel="noreferrer" style={{ ...mono({ fontSize: 11 }), color: C.rust }}>
            tylorduong.dev/resume/ ↗
          </a>
        </div>
      )}
    </div>
  );
}

function Check({ ok, warn, label, children }) {
  const colour = ok ? C.ink : warn ? C.rust : C.rust;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
      <span style={{ width: 10, height: 10, background: ok ? C.rust : "transparent", border: `2px solid ${colour}`, display: "inline-block" }} />
      <span style={mono({ fontSize: 11, fontWeight: 400, textTransform: "none", letterSpacing: "0.4px", color: colour })}>
        {label}
      </span>
      {children}
    </div>
  );
}
