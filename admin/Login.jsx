import { useState } from "react";
import { C, F, mono } from "@/lib/theme";
import { Button } from "./ui";
import { input } from "./styles";
import { setToken } from "./auth";
import { githubApi, REPO } from "./github-api";

/**
 * Gate for the deployed /admin/. The GitHub token IS the password: it's the
 * only thing that lets the Contents-API writes through. Pasted once, validated
 * against the repo, then kept in this browser's localStorage. It is never in
 * the shipped bundle, so someone who merely finds the /admin/ URL sees this
 * screen and can go no further without a token that can push to the repo.
 */
export function Login({ onAuthed }) {
  const [token, setField] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e?.preventDefault();
    if (!token.trim()) return;
    setBusy(true);
    setError(null);
    // Stash first so githubApi.whoami() (which reads from auth storage) can use it.
    setToken(token.trim());
    try {
      // whoami() confirms the token is real and scoped to this repo. We don't
      // hard-block on the write bit: fine-grained tokens don't always surface
      // it cleanly, and a genuinely read-only token will just fail on save.
      await githubApi.whoami();
      onAuthed();
    } catch (err) {
      setError(
        err.status === 401
          ? "GitHub rejected that token (401). Check it hasn't expired."
          : err.message || "Could not reach GitHub."
      );
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <form
        onSubmit={submit}
        style={{ width: "100%", maxWidth: 460, background: C.paper, padding: "32px 32px 28px", border: `3px solid ${C.ink}` }}
      >
        <div style={{ fontFamily: F.tight, fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: 4 }}>
          CONTENT ADMIN
        </div>
        <div style={mono({ fontSize: 11, fontWeight: 400, textTransform: "none", letterSpacing: "0.4px", color: C.muted, marginBottom: 20 })}>
          Enter a GitHub token with write access to {REPO.repo}. It stays in this browser only.
        </div>

        <label style={mono({ fontSize: 10, color: C.ink, display: "block", marginBottom: 6 })}>Access token</label>
        <input
          type="password"
          autoFocus
          value={token}
          onChange={(e) => setField(e.target.value)}
          placeholder="github_pat_…"
          style={{ ...input, width: "100%", fontFamily: F.mono }}
        />

        {error && (
          <div style={mono({ fontSize: 10, fontWeight: 700, color: C.rust, marginTop: 10, textTransform: "none", letterSpacing: "0.4px" })}>
            {error}
          </div>
        )}

        <Button variant="primary" onClick={submit} disabled={busy || !token.trim()} style={{ width: "100%", marginTop: 16 }}>
          {busy ? "Checking…" : "Unlock"}
        </Button>

        <div style={mono({ fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: "0.4px", color: C.muted, marginTop: 16, lineHeight: 1.5 })}>
          Create one at github.com/settings/tokens → Fine-grained tokens → only this repo →
          Repository permissions → Contents: Read and write.
        </div>
      </form>
    </div>
  );
}
