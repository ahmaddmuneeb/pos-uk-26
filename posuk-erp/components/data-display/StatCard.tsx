import React from "react";

interface StatCardProps { label: string; value: string | number; meta?: string; accent?: boolean; }

export function StatCard({ label, value, meta, accent }: StatCardProps) {
  return (
    <div style={{ background: accent ? "rgba(34,211,238,0.07)" : "var(--overlay-subtle)", border: `1px solid ${accent ? "var(--border-strong)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <div style={{ fontSize: "var(--fs-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: "var(--fs-xl)", fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)", letterSpacing: "var(--tracking-tight)" }}>{value}</div>
      {meta && <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-subtle)" }}>{meta}</div>}
    </div>
  );
}
