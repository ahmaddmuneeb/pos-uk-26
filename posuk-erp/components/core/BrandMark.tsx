import React from "react";

interface BrandMarkProps { size?: number; showWordmark?: boolean; }

export function BrandMark({ size = 36, showWordmark = false }: BrandMarkProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <div style={{
        width: size, height: size, borderRadius: Math.round(size * 0.28),
        background: "var(--primary)", display: "grid", placeItems: "center",
        boxShadow: "var(--glow-accent)", flexShrink: 0,
      }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: size * 0.52, lineHeight: 1, letterSpacing: "-0.03em", fontFamily: "var(--font)" }}>P</span>
      </div>
      {showWordmark && (
        <div>
          <div style={{ fontSize: "var(--fs-md)", fontWeight: 800, letterSpacing: "var(--tracking-tight)", color: "var(--text)", lineHeight: 1.1 }}>POS UK</div>
          <div style={{ fontSize: "var(--fs-2xs)", color: "var(--text-subtle)", fontWeight: 600, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>ERP</div>
        </div>
      )}
    </div>
  );
}
