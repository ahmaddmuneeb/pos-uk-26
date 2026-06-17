import React from "react";

/**
 * Modal dialog over a dark scrim. Surface body, accent border, deep shadow.
 * Mirrors the product's `.modal-overlay` / `.modal` (use `wide` for forms).
 */
export function Modal({ open = true, title, onClose, wide = false, footer, children }) {
  if (!open) return null;
  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius)",
          padding: "1.25rem",
          width: "100%",
          maxWidth: wide ? "48rem" : "32rem",
          boxShadow: "var(--shadow-lg)",
          color: "var(--text)",
        }}
      >
        {title && (
          <h3 style={{ margin: "0 0 1rem", fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--tracking-snug)" }}>
            {title}
          </h3>
        )}
        {children}
        {footer && <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>{footer}</div>}
      </div>
    </div>
  );
}
