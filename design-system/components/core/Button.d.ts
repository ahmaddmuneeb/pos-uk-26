import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "ghost" | "danger";
  /** Control height. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Full-width block button. @default false */
  block?: boolean;
  children?: React.ReactNode;
}

/**
 * Primary call-to-action and secondary actions across POS UK.
 *
 * @startingPoint section="Core" subtitle="Gradient primary + ghost buttons" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
