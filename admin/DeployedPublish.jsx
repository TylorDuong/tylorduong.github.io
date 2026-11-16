import { useEffect, useState } from "react";
import { C, F, mono } from "@/lib/theme";
import { Button } from "./ui";
import { githubApi, REPO } from "./github-api";

/**
 * Publish screen for the deployed /admin/. Unlike local dev — where Save only
 * writes files and Publish runs the deploy — here every Save is already a
 * commit to `main`, and the GitHub Actions workflow rebuilds + ships it. So
 * there is nothing to "publish" separately; this screen just confirms the
 * token, nudges you to save, and links out to the deploy + live site.
 */
export function DeployedPublish({ dirty, onSaveAll }) {
  const [who, setWho] = useState(null);
  const [err, setErr] = useState(null);
  const anyDirty = Object.values(dirty).some(Boolean);

  useEffect(() => {
    githubApi.whoami().then(setWho).catch((e) => setErr(e.message));
  }, []);

  const actionsUrl = `https://github.com/${REPO.owner}/${REPO.repo}/actions`;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={mono({ fontSize: 12, marginBottom: 16, borderBottom: `2px solid ${C.ink}`, paddingBottom: 6 })}>
        Publishing
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>
        On the live site, <b>Save is Publish</b>. Each save commits that file to{" "}
        <code style={{ fontFamily: F.mono }}>{REPO.branch}</code>, and a GitHub Actions workflow
        rebuilds the site and deploys it — usually live within a minute or two.
      </p>

      <div style={{ border: `1px solid ${C.ink}`, background: C.card, padding: 16, marginBottom: 20 }}>
        <Row label="Signed in">
          {err ? (
            <span style={{ color: C.rust }}>{err}</span>
          ) : who ? (
            <span>
              {who.repo} — {who.canWrite ? "can write" : "read only"}
            </span>
          ) : (
            "checking…"
          )}
        </Row>
        <Row label="Unsaved edits">
          {anyDirty ? (
            <span style={{ color: C.rust, display: "inline-flex", gap: 10, alignItems: "center" }}>
              yes
              <Button onClick={onSaveAll}>Save all now</Button>
            </span>
          ) : (
            "none"
          )}
        </Row>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <a href={actionsUrl} target="_blank" rel="noreferrer" style={{ ...mono({ fontSize: 11 }), color: C.rust }}>
          Deploy status ↗
        </a>
        <a href="https://tylorduong.dev/" target="_blank" rel="noreferrer" style={{ ...mono({ fontSize: 11 }), color: C.rust }}>
          tylorduong.dev ↗
        </a>
        <a href="https://tylorduong.dev/resume/" target="_blank" rel="noreferrer" style={{ ...mono({ fontSize: 11 }), color: C.rust }}>
          tylorduong.dev/resume/ ↗
        </a>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "6px 0", alignItems: "center" }}>
      <span style={{ ...mono({ fontSize: 10, color: C.muted }), width: 120, flex: "0 0 120px" }}>{label}</span>
      <span style={mono({ fontSize: 11, fontWeight: 400, textTransform: "none", letterSpacing: "0.4px" })}>{children}</span>
    </div>
  );
}
