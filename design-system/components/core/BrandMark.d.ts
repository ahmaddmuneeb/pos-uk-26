import * as React from "react";

export interface BrandMarkProps {
  /** Mark side length in px. @default 36 */
  size?: number;
  /** Glyph inside the mark. @default "P" */
  letter?: string;
  /** Wordmark title. @default "POS / ERP" */
  title?: string;
  /** Wordmark subtitle. @default "Operations" */
  subtitle?: string;
  /** Show the title/subtitle lockup beside the mark. @default false */
  showWordmark?: boolean;
  style?: React.CSSProperties;
}

/** POS UK logo mark — gradient rounded square, optionally with the wordmark lockup. */
export function BrandMark(props: BrandMarkProps): JSX.Element;
