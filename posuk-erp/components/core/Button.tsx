"use client";
import React from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

export function Button({ variant = "primary", size = "md", block = false, disabled, children, style, ...rest }: ButtonProps) {
  const sizes: Record<Size, React.CSSProperties> = {
    sm: { padding: "0.4rem 0.7rem", fontSize: "var(--fs-sm)" },
    md: { padding: "0.55rem 1rem", fontSize: "var(--fs-base)" },
    lg: { padding: "0.7rem 1.25rem", fontSize: "var(--fs-md)" },
  };
  const variants: Record<Variant, React.CSSProperties> = {
    primary: { background: "var(--primary)", color: "#fff", border: "none", boxShadow: "var(--glow-primary)" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" },
    danger: { background: "transparent", color: "var(--danger)", border: "1px solid var(--danger-bg)" },
  };
  const base: React.CSSProperties = {
    font: "inherit", fontWeight: 600, lineHeight: 1,
    display: block ? "flex" : "inline-flex", width: block ? "100%" : undefined,
    alignItems: "center", justifyContent: "center", gap: "0.45rem",
    borderRadius: "var(--radius-sm)", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "box-shadow var(--dur) var(--ease), background var(--dur) var(--ease), color var(--dur) var(--ease)",
    textDecoration: "none",
    ...sizes[size],
  };
  return (
    <button disabled={disabled} style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => { if (disabled) return; const t = e.currentTarget; if (variant === "primary") t.style.boxShadow = "var(--glow-primary-hover)"; else t.style.background = "var(--overlay-hover)"; }}
      onMouseLeave={(e) => { const t = e.currentTarget; t.style.boxShadow = variant === "primary" ? "var(--glow-primary)" : "none"; t.style.background = variants[variant].background as string; }}
      {...rest}>{children}</button>
  );
}
