import React from "react";

/**
 * The POS UK brand mark: a cyan→blue rounded square with a letter,
 * optionally paired with the product wordmark. Mirrors `.sidebar-brand`.
 */
export function BrandMark({ size = 36, letter = "P", title = "POS / ERP", subtitle = "Operations", showWordmark = false, style }) {
  const radius = Math.round(size * 0.28);
  const mark = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "var(--primary)",
        display: "grid",
        placeItems: "center",
        fontWeight: "var(--fw-extrabold)",
        fontSize: size * 0.42,
        color: "#fff",
        letterSpacing: "-0.02em",
        boxShadow: "var(--glow-accent)",
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
  if (!showWordmark) return <div style={style}>{mark}</div>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", ...style }}>
      {mark}
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", color: "var(--text)", letterSpacing: "var(--tracking-snug)" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)", marginTop: "0.1rem" }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
