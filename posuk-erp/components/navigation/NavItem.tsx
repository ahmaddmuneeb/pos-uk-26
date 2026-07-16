"use client";
import React from "react";

interface NavItemProps { active?: boolean; children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; }

export function NavItem({ active, children, onClick, style }: NavItemProps) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.4rem 0.65rem",
      borderRadius: "var(--radius-sm)", border: "none", background: active ? "rgba(34,211,238,0.12)" : "transparent",
      color: active ? "var(--accent)" : "var(--text-muted)", fontSize: "var(--fs-base)", fontWeight: active ? 600 : 500,
      cursor: "pointer", textAlign: "left", transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)", ...style,
    }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--overlay-subtle)"; e.currentTarget.style.color = "var(--text)"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}>
      {children}
    </button>
  );
}
