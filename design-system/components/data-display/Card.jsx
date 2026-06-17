import React from "react";

/**
 * The product's primary container: solid elevated surface, hairline border,
 * 12px radius, soft deep shadow. Optional title (h2) + subtitle.
 */
export function Card({ title, subtitle, actions, padding = "1.25rem", children, style }) {
  return (
    <section
      style={{
        background: "var(--bg-card-solid)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding,
        boxShadow: "var(--shadow)",
        color: "var(--text)",
        ...style,
      }}
    >
      {(title || actions) && (
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: subtitle ? "0.25rem" : "0.75rem" }}>
          {title && (
            <h2 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--tracking-snug)", color: "var(--text)" }}>
              {title}
            </h2>
          )}
          {actions && <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>{actions}</div>}
        </header>
      )}
      {subtitle && (
        <p style={{ margin: "0 0 0.75rem", color: "var(--text-muted)", fontSize: "var(--fs-base)" }}>{subtitle}</p>
      )}
      {children}
    </section>
  );
}
