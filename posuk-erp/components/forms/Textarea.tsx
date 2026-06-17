"use client";
import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ style, ...rest }, ref) => (
  <textarea
    ref={ref}
    style={{
      width: "100%", background: "var(--bg-surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)", padding: "0.48rem 0.65rem", fontSize: "var(--fs-base)",
      color: "var(--text)", outline: "none", resize: "vertical", minHeight: 72,
      transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)", ...style,
    }}
    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-dim)"; e.currentTarget.style.boxShadow = "var(--ring)"; }}
    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
    {...rest}
  />
));
Textarea.displayName = "Textarea";
