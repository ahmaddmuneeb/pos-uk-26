"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ style, ...rest }, ref) => (
  <input
    ref={ref}
    style={{
      width: "100%", background: "var(--bg-surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)", padding: "0.48rem 0.65rem", fontSize: "var(--fs-base)",
      color: "var(--text)", outline: "none", transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)",
      ...style,
    }}
    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-dim)"; e.currentTarget.style.boxShadow = "var(--ring)"; }}
    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
    {...rest}
  />
));
Input.displayName = "Input";
