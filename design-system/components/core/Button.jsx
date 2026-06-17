import React from "react";

/**
 * POS UK button. Cyan→blue gradient for primary actions, hairline-bordered
 * ghost for everything else. Matches the product's `button.primary` / `.ghost`.
 */
export function Button({
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  type = "button",
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: "0.4rem 0.7rem", fontSize: "var(--fs-sm)" },
    md: { padding: "0.55rem 1rem", fontSize: "var(--fs-base)" },
    lg: { padding: "0.7rem 1.25rem", fontSize: "var(--fs-md)" },
  };
  const base = {
    font: "inherit",
    fontWeight: "var(--fw-semibold)",
    lineHeight: 1,
    display: block ? "block" : "inline-flex",
    width: block ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: "0.45rem",
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "transform var(--dur-fast) var(--ease), filter var(--dur) var(--ease), box-shadow var(--dur) var(--ease), background var(--dur) var(--ease), color var(--dur) var(--ease)",
    ...sizes[size],
  };
  const variants = {
    primary: {
      background: "var(--primary)",
      color: "#fff",
      border: "none",
      boxShadow: "var(--glow-primary)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-muted)",
      borderColor: "var(--border)",
    },
    danger: {
      background: "transparent",
      color: "var(--danger)",
      borderColor: "var(--danger-bg)",
    },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "primary") e.currentTarget.style.boxShadow = "var(--glow-primary-hover)";
        else e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        if (variant !== "primary") e.currentTarget.style.color = "var(--text)";
      }}
      onMouseLeave={(e) => {
        const v = variants[variant];
        e.currentTarget.style.boxShadow = v.boxShadow || "none";
        e.currentTarget.style.background = v.background;
        e.currentTarget.style.color = v.color;
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
