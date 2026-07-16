"use client";
import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "sm" | "md";
}

export function IconButton({ label, size = "md", children, style, ...rest }: IconButtonProps) {
  const sz = size === "sm" ? 28 : 34;
  const [hovered, setHovered] = React.useState(false);

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        aria-label={label}
        style={{
          width: sz, height: sz, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
          background: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "inline-grid",
          placeItems: "center", fontSize: size === "sm" ? "0.8rem" : "1rem",
          transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)", ...style,
        }}
        onMouseEnter={(e) => {
          setHovered(true);
          e.currentTarget.style.background = "var(--overlay-hover)";
          e.currentTarget.style.color = "var(--text)";
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
        {...rest}
      >
        {children}
      </button>
      {hovered && (
        <span style={{
          position: "absolute",
          bottom: "calc(100% + 6px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--surface-raised)",
          color: "var(--text)",
          fontSize: "0.7rem",
          fontWeight: 600,
          whiteSpace: "nowrap",
          padding: "3px 8px",
          borderRadius: "4px",
          border: "1px solid var(--border)",
          pointerEvents: "none",
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          {label}
          <span style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "4px solid var(--border)",
          }} />
        </span>
      )}
    </span>
  );
}
