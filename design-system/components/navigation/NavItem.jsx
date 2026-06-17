import React from "react";

/**
 * Sidebar nav link. Muted by default; active state gets the cyan accent,
 * a faint tint, and an inset accent ring. Mirrors `.nav a` / `.nav a.active`.
 */
export function NavItem({ active = false, children, style, ...rest }) {
  return (
    <a
      style={{
        display: "block",
        padding: "0.5rem 0.65rem",
        borderRadius: "var(--radius-sm)",
        fontSize: "var(--fs-base)",
        fontWeight: "var(--fw-medium)",
        textDecoration: "none",
        cursor: "pointer",
        color: active ? "var(--accent)" : "var(--text-muted)",
        background: active ? "rgba(34,211,238,0.10)" : "transparent",
        boxShadow: active ? "inset 0 0 0 1px var(--border-strong)" : "none",
        transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.color = "var(--text)";
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Uppercase overline that groups nav items (Overview / Administration / …). */
export function NavSection({ children, style }) {
  return (
    <div
      style={{
        marginTop: "1rem",
        fontSize: "var(--fs-2xs)",
        fontWeight: "var(--fw-semibold)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-wider)",
        color: "var(--text-subtle)",
        padding: "0.35rem 0.5rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
