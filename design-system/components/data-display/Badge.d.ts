import * as React from "react";

export interface BadgeProps {
  /** Semantic tone. @default "neutral" */
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
  /** Tinted fill (true) vs outline (false). @default true */
  subtle?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Pill status badge with a leading dot — payment status, document state, etc. */
export function Badge(props: BadgeProps): JSX.Element;
