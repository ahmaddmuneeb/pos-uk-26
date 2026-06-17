import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Render with a danger border. @default false */
  invalid?: boolean;
  children?: React.ReactNode;
}

/** Native select styled to match POS UK inputs, with a custom chevron. */
export function Select(props: SelectProps): JSX.Element;
