import React from "react";

/**
 * Status badge / tag. Semantic tones map to the product's status palette
 * (success / warning / danger / info / neutral). Used for payment status,
 * sale-person status, document state, etc.
 */
export function Badge({ tone = "neutral", subtle = true, children, style }) {
  const tones = {
    success: { fg: "var(--success)", bg: "var(--success-bg)" },
    warning: { fg: "var(--warning)", bg: "var(--warning-bg)" },
    danger: { fg: "var(--danger)", bg: "var(--danger-bg)" },
    info: { fg: "var(--accent)", bg: "var(--info-bg)" },
    neutral: { fg: "var(--text-muted)", bg: "rgba(148,163,184,0.10)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.2rem 0.55rem",
        borderRadius: "var(--radius-pill)",
        fontSize: "var(--fs-xs)",
        fontWeight: "var(--fw-semibold)",
        letterSpacing: "0.02em",
        color: t.fg,
        background: subtle ? t.bg : "transparent",
        border: `1px solid ${subtle ? "transparent" : t.fg}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.fg, flexShrink: 0 }} />
      {children}
    </span>
  );
}
