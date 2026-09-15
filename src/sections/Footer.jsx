import { F, C, mono } from "@/lib/theme";
import { Hover } from "@/lib/Hover";
import { contact, profile } from "@/data";

export function Footer({ go }) {
  return (
    <div style={{ background: C.ink }}>
      <div
        data-r="footer"
        style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}
      >
        <div>
          <div style={{ fontFamily: F.tight, fontSize: 20, fontWeight: 600, letterSpacing: "-0.4px", color: C.paper, marginBottom: 12 }}>
            {profile.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: F.mono, fontSize: 12, letterSpacing: "0.6px", lineHeight: "17.4px" }}>
            <a href={`mailto:${contact.email}`} style={{ color: "rgba(241,237,226,0.55)" }}>{contact.email}</a>
            <a href={contact.phoneHref} style={{ color: "rgba(241,237,226,0.55)" }}>{contact.phone}</a>
            <span style={{ color: "rgba(241,237,226,0.55)" }}>{contact.location.toUpperCase()}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, ...mono({ fontSize: 12, letterSpacing: "0.6px", lineHeight: "17.4px" }) }}>
          <Hover as="button" onClick={() => go("contact")}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: F.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.6px", color: C.paper }}
            hoverStyle={{ color: C.rust }}>
            Contact
          </Hover>
          <a href={profile.resumeUrl} style={{ color: C.paper }}>Résumé ↗</a>
          <a href={contact.github.url} target="_blank" rel="noopener noreferrer" style={{ color: C.paper }}>GitHub ↗</a>
          <a href={contact.linkedin.url} target="_blank" rel="noopener noreferrer" style={{ color: C.paper }}>LinkedIn ↗</a>
        </div>
      </div>
    </div>
  );
}
