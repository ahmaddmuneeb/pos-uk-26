import React from "react";

/**
 * Square icon-only button. Used for the row-action "✕" / close affordances.
 * Pass any node (an icon glyph, an <img> of an SVG icon, or text) as children.
 */
export function IconButton({ size = "md", variant = "ghost", label, disabled = false, children, style, ...rest }) {
  const dim = size === "sm" ? "1.85rem" : size === "lg" ? "2.5rem" : "2.15rem";
  const variants = {
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" },
    bare: { background: "transparent", color: "var(--text-subtle)", border: "1px solid transparent" },
    accent: { background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-strong)" },
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{
        width: dim,
        height: dim,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-sm)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        font: "inherit",
        fontSize: "var(--fs-md)",
        transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled || variant === "accent") return;
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        e.currentTarget.style.color = "var(--text)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variants[variant].background;
        e.currentTarget.style.color = variants[variant].color;
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
