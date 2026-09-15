import { useRef, useState } from "react";
import { F, C, CLIP, mono, sectionH2 } from "@/lib/theme";
import { Mark } from "@/lib/Mark";
import { Hover } from "@/lib/Hover";
import { Eyebrow } from "@/components/Eyebrow";
import { Linescape } from "@/components/Linescape";
import { contact } from "@/data";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: C.card,
  border: `1px solid ${C.ink}`,
  borderRadius: 0,
  padding: "12px 16px",
  fontFamily: F.body,
  fontSize: 15,
  color: C.ink,
};
const labelStyle = mono({ display: "block", marginBottom: 8 });

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const linkStyle = { fontFamily: F.mono, fontSize: 12 };

const infoRows = [
  ["EMAIL", <a href={`mailto:${contact.email}`} style={linkStyle}>{contact.email}</a>],
  ["TEL", <a href={contact.phoneHref} style={linkStyle}>{contact.phone}</a>],
  ["LOC", contact.location.toUpperCase()],
  ["GITHUB", <a href={contact.github.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{contact.github.handle} ↗</a>],
  ["LINKEDIN", <a href={contact.linkedin.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{contact.linkedin.handle} ↗</a>],
];

export function Contact({ innerRef, goIndex }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const msgRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [sentAt, setSentAt] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setSending(true);
    setFormSent(false);
    setTimeout(() => {
      const t = new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "America/Phoenix" });
      setSending(false);
      setFormSent(true);
      setSentAt(t);
      if (nameRef.current) nameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (msgRef.current) msgRef.current.value = "";
    }, 900);
  };

  return (
    <>
      <div ref={innerRef} data-r="wrap" style={{ maxWidth: 1400, margin: "0 auto", padding: "96px 40px 96px", position: "relative" }}>
        <div data-r="contact-orb" style={{ position: "absolute", bottom: 60, right: 0, pointerEvents: "none" }}>
          <Mark name="sphere" size={300} color={C.ink} style={{ opacity: 0.045, display: "block" }} />
        </div>

        <Eyebrow mark="goblet">SEC.05</Eyebrow>
        <h2 data-r="h2" style={{ ...sectionH2, margin: "0 0 48px", maxWidth: 900 }}>Contact</h2>

        <div data-r="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
          <form onSubmit={submit} style={{ border: `6px solid ${C.ink}`, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
            <Field id="dp-name" label="Name">
              <input id="dp-name" type="text" required placeholder="Your name…" ref={nameRef} style={inputStyle} />
            </Field>
            <Field id="dp-email" label="Email">
              <input id="dp-email" type="email" required placeholder="your@email.com" ref={emailRef} style={inputStyle} />
            </Field>
            <Field id="dp-msg" label="Message">
              <textarea id="dp-msg" rows={5} required placeholder="Your message…" ref={msgRef} style={{ ...inputStyle, resize: "vertical" }} />
            </Field>
            <Hover as="button" type="submit"
              style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 10, background: C.rust, color: C.paper, border: `6px solid ${C.ink}`, ...mono({ fontSize: 13 }), padding: "14px 28px", cursor: "pointer", clipPath: CLIP }}
              hoverStyle={{ background: C.rustDark }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 6l10 7 10-7" />
              </svg>
              {sending ? "Sending…" : "Send Message"}
            </Hover>
            {formSent && (
              <div style={mono({ fontSize: 12, fontWeight: 400, letterSpacing: "0.6px", lineHeight: "17.4px", background: C.tan, border: `1px solid ${C.ink}`, padding: "14px 16px" })}>
                TRANSMISSION LOGGED {sentAt} MST.
                <br />
                RESPONSE ETA: 24 HOURS. CHANNEL REMAINS OPEN.
              </div>
            )}
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: C.card, border: `1px solid ${C.ink}`, padding: 20 }}>
              <div style={mono({ borderBottom: "1px solid rgba(22,25,15,0.42)", paddingBottom: 10, marginBottom: 14 })}>COMMUNICATION</div>
              <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 12, fontFamily: F.mono, fontSize: 12, letterSpacing: "0.6px", lineHeight: "17.4px" }}>
                {infoRows.map(([k, v], i) => (
                  <div key={i} style={{ display: "contents" }}>
                    <div style={{ color: C.muted }}>{k}</div>
                    <div>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: `6px solid ${C.ink}`, padding: 24, position: "relative", overflow: "hidden" }}>
              <Mark name="twins" size={96} color={C.ink} style={{ position: "absolute", bottom: -16, right: -16, opacity: 0.08, pointerEvents: "none" }} />
              <div style={mono({ display: "flex", alignItems: "center", gap: 10, position: "relative" })}>
                <span style={{ width: 10, height: 10, background: C.rust, display: "inline-block" }} />
                Currently Available
              </div>
              <p style={{ fontFamily: F.body, fontSize: 15, lineHeight: "21.75px", color: C.muted, margin: "12px 0 0" }}>
                I’m currently open to new opportunities and exciting projects. Whether you need an engineer or a project collaborator, let’s talk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OUTRO LINESCAPE */}
      <div data-r="wrap" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <Linescape count={12} wMax={5} wMin={1} reverse />
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "32px 0 64px" }}>
          <Hover as="button" onClick={goIndex}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", ...mono({ color: C.rust, textDecoration: "underline", textUnderlineOffset: "3px" }) }}
            hoverStyle={{ color: C.rustDark }}>
            Next: Project Index →
          </Hover>
        </div>
      </div>
    </>
  );
}
