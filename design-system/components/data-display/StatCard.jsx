import React from "react";

/**
 * Dashboard KPI chip. Uppercase muted label over a large value, on a faint
 * cyan-tinted surface. Mirrors the product's `.stat`.
 */
export function StatCard({ label, value, meta, accent = false, style }) {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "var(--radius-sm)",
        background: accent ? "var(--accent-glow)" : "rgba(34, 211, 238, 0.06)",
        border: `1px solid ${accent ? "var(--border-strong)" : "var(--border)"}`,
        ...style,
      }}
    >
      <div style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-semibold)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)" }}>
        {label}
      </div>
      <div style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", color: "var(--text)", marginTop: "0.25rem", letterSpacing: "var(--tracking-snug)" }}>
        {value}
      </div>
      {meta && <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", marginTop: "0.15rem" }}>{meta}</div>}
    </div>
  );
}
