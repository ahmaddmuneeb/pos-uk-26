import * as React from "react";

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /** Accessible label (also the tooltip). */
  label: string;
  /** @default "ghost" */
  variant?: "ghost" | "bare" | "accent";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

/** Square icon-only button for row actions and close/dismiss affordances. */
export function IconButton(props: IconButtonProps): JSX.Element;
