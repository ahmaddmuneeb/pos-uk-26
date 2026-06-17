"use client";
import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "sm" | "md";
}

export function IconButton({ label, size = "md", children, style, ...rest }: IconButtonProps) {
  const sz = size === "sm" ? 28 : 34;
  return (
    <button
      aria-label={label}
      title={label}
      style={{
        width: sz, height: sz, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
        background: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "inline-grid",
        placeItems: "center", fontSize: size === "sm" ? "0.8rem" : "1rem", transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)", ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
      {...rest}
    >
      {children}
    </button>
  );
}
