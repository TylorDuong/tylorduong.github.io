// Form primitives for the admin. Styled with the site's own tokens so the
// editor looks like the thing it edits.

import { useEffect, useMemo, useRef, useState } from "react";
import { C, F, mono, CLIP } from "@/lib/theme";
import { Hover } from "@/lib/Hover";
import { input, label } from "./styles";

export function Field({ label: text, hint, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={label}>{text}</div>
      {children}
      {hint && !error && (
        <div style={mono({ fontSize: 10, fontWeight: 400, color: C.muted, marginTop: 4, textTransform: "none", letterSpacing: "0.4px" })}>
          {hint}
        </div>
      )}
      {error && (
        <div style={mono({ fontSize: 10, fontWeight: 700, color: C.rust, marginTop: 4, textTransform: "none", letterSpacing: "0.4px" })}>
          {error}
        </div>
      )}
    </div>
  );
}

export function Text({ value, onChange, ...rest }) {
  return <input style={input} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function Area({ value, onChange, rows = 4, ...rest }) {
  return (
    <textarea
      style={{ ...input, resize: "vertical", lineHeight: 1.5 }}
      rows={rows}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}

export function Select({ value, onChange, options, ...rest }) {
  return (
    <select style={input} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest}>
      {options.map((o) => {
        const [v, l] = Array.isArray(o) ? o : [o, o];
        return (
          <option key={v} value={v}>
            {l}
          </option>
        );
      })}
    </select>
  );
}

export function Button({ children, onClick, variant = "ghost", disabled, style, ...rest }) {
  const base = {
    ...mono({ fontSize: 12 }),
    padding: "10px 18px",
    cursor: disabled ? "not-allowed" : "pointer",
    border: `3px solid ${C.ink}`,
    clipPath: CLIP,
    opacity: disabled ? 0.45 : 1,
    ...style,
  };
  const skin =
    variant === "primary"
      ? { background: C.rust, color: C.paper }
      : variant === "danger"
        ? { background: "transparent", color: C.rust }
        : { background: "transparent", color: C.ink };
  return (
    <Hover
      as="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ ...base, ...skin }}
      hoverStyle={disabled ? {} : variant === "primary" ? { background: C.rustDark } : { background: "rgba(22,25,15,0.08)" }}
      {...rest}
    >
      {children}
    </Hover>
  );
}

/* ------------------------------------------------------------ MonthInput */

/**
 * Native <input type="month"> emits exactly "YYYY-MM" and brings its own
 * picker, so the whole app needs zero date parsing. The "Present" checkbox
 * maps to end: null, which is what drives `current` and the ongoing-first sort.
 */
export function MonthInput({ value, onChange, allowPresent, presentLabel = "Present" }) {
  const isPresent = allowPresent && value == null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <input
        type="month"
        style={{ ...input, width: "auto", flex: "0 0 auto", opacity: isPresent ? 0.4 : 1 }}
        value={isPresent ? "" : (value ?? "")}
        disabled={isPresent}
        onChange={(e) => onChange(e.target.value || null)}
      />
      {allowPresent && (
        <label style={{ ...mono({ fontSize: 11, textTransform: "none" }), display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isPresent}
            onChange={(e) => onChange(e.target.checked ? null : new Date().toISOString().slice(0, 7))}
          />
          {presentLabel}
        </label>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- TagInput */

/**
 * Autocompleting tech picker. Tokens not already known are flagged NEW and
 * reported upward so the caller can offer to file them into a skill category.
 */
export function TagInput({ value = [], onChange, suggestions = [], known = new Set(), placeholder }) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef(null);

  const matches = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!q) return [];
    return suggestions
      .filter((s) => s.toLowerCase().includes(q) && !value.some((v) => v.toLowerCase() === s.toLowerCase()))
      .slice(0, 8);
  }, [draft, suggestions, value]);

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const commit = (raw) => {
    const t = String(raw).trim();
    if (!t) return;
    if (!value.some((v) => v.toLowerCase() === t.toLowerCase())) onChange([...value, t]);
    setDraft("");
    setOpen(false);
    setActive(0);
  };

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(matches[active] ?? draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <div style={{ ...input, display: "flex", flexWrap: "wrap", gap: 6, padding: 8, alignItems: "center" }}>
        {value.map((t) => {
          const isNew = !known.has(t.toLowerCase());
          return (
            <span
              key={t}
              style={mono({
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: "0.88px",
                textTransform: "none",
                border: `1px solid ${isNew ? C.rust : "rgba(22,25,15,0.42)"}`,
                color: isNew ? C.rust : C.ink,
                borderRadius: 2,
                padding: "3px 7px",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              })}
            >
              {t}
              {isNew && <b style={{ fontSize: 9 }}>NEW</b>}
              <button
                onClick={() => onChange(value.filter((x) => x !== t))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", fontSize: 13, lineHeight: 1 }}
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </span>
          );
        })}
        <input
          value={draft}
          placeholder={value.length ? "" : placeholder}
          onChange={(e) => {
            setDraft(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={onKey}
          onFocus={() => setOpen(true)}
          style={{ flex: 1, minWidth: 120, border: "none", outline: "none", background: "transparent", fontFamily: F.body, fontSize: 14, color: C.ink }}
        />
      </div>

      {open && matches.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            background: C.paper,
            border: `1px solid ${C.ink}`,
            borderTop: "none",
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {matches.map((m, i) => (
            <div
              key={m}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(m);
              }}
              onMouseEnter={() => setActive(i)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontFamily: F.body,
                fontSize: 14,
                background: i === active ? C.tint : "transparent",
              }}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ ListEditor */

/** Add / remove / reorder a list of strings (bullets, paragraphs). */
export function ListEditor({ value = [], onChange, placeholder, rows = 2 }) {
  const set = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  const move = (i, d) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {value.map((v, i) => (
        <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <textarea
            style={{ ...input, resize: "vertical", lineHeight: 1.5 }}
            rows={rows}
            value={v}
            placeholder={placeholder}
            onChange={(e) => set(i, e.target.value)}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <MiniBtn onClick={() => move(i, -1)} disabled={i === 0} title="Move up">↑</MiniBtn>
            <MiniBtn onClick={() => move(i, 1)} disabled={i === value.length - 1} title="Move down">↓</MiniBtn>
            <MiniBtn onClick={() => onChange(value.filter((_, j) => j !== i))} title="Remove" danger>×</MiniBtn>
          </div>
        </div>
      ))}
      <div>
        <Button onClick={() => onChange([...value, ""])}>+ Add</Button>
      </div>
    </div>
  );
}

export function MiniBtn({ children, onClick, disabled, danger, title }) {
  return (
    <Hover
      as="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      disabled={disabled}
      style={{
        width: 26,
        height: 22,
        border: `1px solid ${C.ink}`,
        background: "transparent",
        color: danger ? C.rust : C.ink,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 1,
        fontFamily: F.mono,
        fontSize: 12,
        lineHeight: 1,
        padding: 0,
      }}
      hoverStyle={disabled ? {} : { background: C.tint }}
    >
      {children}
    </Hover>
  );
}
