import React from "react";

/**
 * Select dropdown matching the product's native `<select>` styling:
 * surface fill, hairline border, cyan focus ring, custom chevron.
 */
export function Select({ invalid = false, children, style, ...rest }) {
  return (
    <select
      style={{
        font: "inherit",
        fontSize: "var(--fs-base)",
        width: "100%",
        padding: "0.55rem 2rem 0.55rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${invalid ? "var(--danger)" : "var(--border)"}`,
        background:
          "var(--bg-surface) url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M2.5 4.5L6 8l3.5-3.5'/></svg>\") no-repeat right 0.7rem center",
        color: "var(--text)",
        appearance: "none",
        WebkitAppearance: "none",
        cursor: "pointer",
        minWidth: 0,
        transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-dim)";
        e.currentTarget.style.boxShadow = "var(--ring)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = invalid ? "var(--danger)" : "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
