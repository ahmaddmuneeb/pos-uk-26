import React from "react";

/**
 * Segmented tab bar. Pill tabs with a hairline border; the active tab gets
 * the cyan accent + tint. Mirrors the product's `.tab-bar` / `.tab`.
 */
export function Tabs({ tabs = [], value, onChange, style }) {
  return (
    <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", ...style }}>
      {tabs.map((t) => {
        const key = typeof t === "string" ? t : t.value;
        const label = typeof t === "string" ? t : t.label;
        const active = key === value;
        return (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange && onChange(key)}
            style={{
              font: "inherit",
              fontSize: "var(--fs-base)",
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              background: active ? "var(--accent-glow)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${active ? "var(--border-strong)" : "var(--border)"}`,
              transition: "color var(--dur) var(--ease), border-color var(--dur) var(--ease), background var(--dur) var(--ease)",
            }}
            onMouseEnter={(e) => {
              if (active) return;
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.borderColor = "var(--border-strong)";
            }}
            onMouseLeave={(e) => {
              if (active) return;
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
