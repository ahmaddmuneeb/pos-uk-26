import React from "react";

const fieldStyle = {
  base: { color: "var(--text)" },
};

/** Shared input visual: surface fill, hairline border, cyan focus ring. */
function controlStyle(invalid) {
  return {
    font: "inherit",
    fontSize: "var(--fs-base)",
    width: "100%",
    padding: "0.55rem 0.75rem",
    borderRadius: "var(--radius-sm)",
    border: `1px solid ${invalid ? "var(--danger)" : "var(--border)"}`,
    background: "var(--bg-surface)",
    color: "var(--text)",
    minWidth: 0,
    transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)",
  };
}
function focusOn(e) {
  e.currentTarget.style.borderColor = "var(--accent-dim)";
  e.currentTarget.style.boxShadow = "var(--ring)";
}
function focusOff(e, invalid) {
  e.currentTarget.style.borderColor = invalid ? "var(--danger)" : "var(--border)";
  e.currentTarget.style.boxShadow = "none";
}

/**
 * Labelled field wrapper. POS UK stacks a small uppercase-ish muted label
 * above each control (the product's `<label>` flex-column pattern).
 */
export function Field({ label, hint, error, htmlFor, children, style }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.78rem", fontWeight: "var(--fw-semibold)", color: "var(--text-muted)", ...style }}
    >
      {label}
      {children}
      {error ? (
        <span style={{ color: "var(--danger)", fontWeight: "var(--fw-medium)" }}>{error}</span>
      ) : hint ? (
        <span style={{ color: "var(--text-subtle)", fontWeight: "var(--fw-medium)" }}>{hint}</span>
      ) : null}
    </label>
  );
}

/** Text input. */
export function Input({ invalid = false, style, ...rest }) {
  return (
    <input
      style={{ ...controlStyle(invalid), ...style }}
      onFocus={focusOn}
      onBlur={(e) => focusOff(e, invalid)}
      {...rest}
    />
  );
}

/** Multi-line input. */
export function Textarea({ invalid = false, rows = 3, style, ...rest }) {
  return (
    <textarea
      rows={rows}
      style={{ ...controlStyle(invalid), resize: "vertical", lineHeight: 1.45, ...style }}
      onFocus={focusOn}
      onBlur={(e) => focusOff(e, invalid)}
      {...rest}
    />
  );
}
