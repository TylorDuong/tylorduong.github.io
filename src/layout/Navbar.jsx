import { F, C } from "@/lib/theme";
import { Hover } from "@/lib/Hover";

const LINKS = [
  ["home", "Home"],
  ["about", "About"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["testimonials", "Testimonials"],
  ["contact", "Contact"],
];

export function Navbar({ active, go, menuOpen, openMenu, closeMenu }) {
  const linkColor = (key) => (active === key ? C.rust : C.paper);

  return (
    <>
      {/* ============ NAV BAR ============ */}
      <div style={{ background: C.ink, position: "sticky", top: 0, zIndex: 50 }}>
        <div
          data-r="nav"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "20px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <button
            data-r="nav-logo"
            onClick={() => go("home")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: F.tight,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.48px",
              color: C.paper,
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            TYLOR DUONG
            <span style={{ width: 9, height: 9, background: C.rust, display: "inline-block" }} />
          </button>

          <div
            data-r="nav-links"
            style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}
          >
            {LINKS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => go(key)}
                className="dp-underline-hover"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: F.body,
                  fontSize: 15,
                  fontWeight: 400,
                  color: linkColor(key),
                  transition: "color 0.25s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            data-r="nav-hamburger"
            onClick={openMenu}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              gap: 5,
              width: 44,
              height: 44,
              padding: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "block", width: 26, height: 2, background: C.paper }} />
            <span style={{ display: "block", width: 26, height: 2, background: C.paper }} />
            <span style={{ display: "block", width: 26, height: 2, background: C.paper }} />
          </button>
        </div>
      </div>

      {/* ============ MOBILE DRAWER ============ */}
      <div
        onClick={closeMenu}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 64,
          background: "rgba(22,25,15,0.55)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.28s",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(80vw, 320px)",
          zIndex: 65,
          background: C.ink,
          transform: `translateX(${menuOpen ? "0%" : "100%"})`,
          transition: "transform 0.32s cubic-bezier(0.22,0.61,0.36,1)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 28px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 40 }}>
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            style={{
              width: 40,
              height: 40,
              padding: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.paper,
              fontFamily: F.mono,
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {LINKS.map(([key, label], i) => (
            <button
              key={key}
              onClick={() => {
                closeMenu();
                go(key);
              }}
              style={{
                textAlign: "left",
                background: "none",
                border: "none",
                borderBottom:
                  i === LINKS.length - 1 ? "none" : "1px solid rgba(241,237,226,0.14)",
                padding: "16px 0",
                cursor: "pointer",
                fontFamily: F.tight,
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: "-0.5px",
                color: linkColor(key),
                transition: "color 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "auto",
            fontFamily: F.mono,
            fontSize: 11,
            letterSpacing: "0.88px",
            lineHeight: "16px",
            textTransform: "uppercase",
            color: "rgba(241,237,226,0.5)",
          }}
        >
          TYLORDUONG1@GMAIL.COM
          <br />
          +1.480.208.5234
        </div>
      </div>
    </>
  );
}

export default Navbar;
