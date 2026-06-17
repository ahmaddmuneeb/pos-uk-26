"use client";
import React from "react";

interface Tab { label: string; value: string; }
interface TabsProps { tabs: Tab[]; value: string; onChange: (v: string) => void; style?: React.CSSProperties; }

export function Tabs({ tabs, value, onChange, style }: TabsProps) {
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: "0.75rem", ...style }}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button key={t.value} onClick={() => onChange(t.value)}
            style={{ padding: "0.5rem 0.85rem", fontSize: "var(--fs-sm)", fontWeight: active ? 700 : 500, color: active ? "var(--accent)" : "var(--text-muted)", background: "none", border: "none", borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent", cursor: "pointer", marginBottom: -1, transition: "color var(--dur) var(--ease)" }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
