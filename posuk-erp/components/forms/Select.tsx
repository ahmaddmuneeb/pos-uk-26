"use client";
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ style, children, ...rest }, ref) => (
  <select
    ref={ref}
    style={{
      width: "100%", background: "var(--bg-surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)", padding: "0.48rem 0.65rem", fontSize: "var(--fs-base)",
      color: "var(--text)", outline: "none", cursor: "pointer",
      transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)", ...style,
    }}
    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-dim)"; e.currentTarget.style.boxShadow = "var(--ring)"; }}
    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
    {...rest}
  >{children}</select>
));
Select.displayName = "Select";
