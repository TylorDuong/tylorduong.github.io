import { F, C, mono } from "@/lib/theme";
import { Hover } from "@/lib/Hover";

const CV_URL =
  "https://drive.google.com/file/d/1mPAFaC18GQo6RkEi8rYPYC5cGysHmfSd/view?usp=sharing";

export function Footer({ go }) {
  return (
    <div style={{ background: C.ink }}>
      <div
        data-r="footer"
        style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}
      >
        <div>
          <div style={{ fontFamily: F.tight, fontSize: 20, fontWeight: 600, letterSpacing: "-0.4px", color: C.paper, marginBottom: 12 }}>
            TYLOR DUONG
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: F.mono, fontSize: 12, letterSpacing: "0.6px", lineHeight: "17.4px" }}>
            <a href="mailto:tylorduong1@gmail.com" style={{ color: "rgba(241,237,226,0.55)" }}>tylorduong1@gmail.com</a>
            <a href="tel:+14802085234" style={{ color: "rgba(241,237,226,0.55)" }}>+1 (480) 208-5234</a>
            <span style={{ color: "rgba(241,237,226,0.55)" }}>CHANDLER, ARIZONA</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, ...mono({ fontSize: 12, letterSpacing: "0.6px", lineHeight: "17.4px" }) }}>
          <Hover as="button" onClick={() => go("contact")}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: F.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.6px", color: C.paper }}
            hoverStyle={{ color: C.rust }}>
            Contact
          </Hover>
          <a href={CV_URL} target="_blank" rel="noopener noreferrer" style={{ color: C.paper }}>Download CV ↗</a>
          <a href="https://github.com/TylorDuong" target="_blank" rel="noopener noreferrer" style={{ color: C.paper }}>GitHub ↗</a>
          <a href="https://www.linkedin.com/in/tylor-duong/" target="_blank" rel="noopener noreferrer" style={{ color: C.paper }}>LinkedIn ↗</a>
        </div>
      </div>
    </div>
  );
}
