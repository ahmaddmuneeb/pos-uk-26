import React from "react";

interface FieldProps { label: string; children: React.ReactNode; error?: string; hint?: React.ReactNode; style?: React.CSSProperties; }

export function Field({ label, children, error, hint, style }: FieldProps) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text-muted)", ...style }}>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{label}</span>
        {hint && <span style={{ fontWeight: 400 }}>{hint}</span>}
      </span>
      {children}
      {error && <span style={{ color: "var(--danger)", fontSize: "var(--fs-xs)", fontWeight: 500 }}>{error}</span>}
    </label>
  );
}
