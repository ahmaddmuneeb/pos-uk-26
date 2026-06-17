import * as React from "react";

export interface CardProps {
  /** Optional card heading (rendered as an h2). */
  title?: React.ReactNode;
  /** Muted description below the title. */
  subtitle?: React.ReactNode;
  /** Right-aligned header actions (buttons). */
  actions?: React.ReactNode;
  /** CSS padding override. @default "1.25rem" */
  padding?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Primary surface container used to frame every screen section.
 *
 * @startingPoint section="Data display" subtitle="Elevated card with title + actions" viewport="700x220"
 */
export function Card(props: CardProps): JSX.Element;
