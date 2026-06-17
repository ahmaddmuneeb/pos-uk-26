import React from "react";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const tones: Record<Tone, { color: string; bg: string }> = {
  success: { color: "var(--success)", bg: "var(--success-bg)" },
  warning: { color: "var(--warning)", bg: "var(--warning-bg)" },
  danger: { color: "var(--danger)", bg: "var(--danger-bg)" },
  info: { color: "var(--info)", bg: "var(--info-bg)" },
  neutral: { color: "var(--text-muted)", bg: "rgba(148,163,184,0.1)" },
};

interface BadgeProps { tone?: Tone; children: React.ReactNode; style?: React.CSSProperties; }

export function Badge({ tone = "neutral", children, style }: BadgeProps) {
  const t = tones[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-pill)", fontSize: "var(--fs-xs)", fontWeight: 600, color: t.color, background: t.bg, whiteSpace: "nowrap", ...style }}>
      {children}
    </span>
  );
}
