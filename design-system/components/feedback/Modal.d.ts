import * as React from "react";

export interface ModalProps {
  /** Mounts when true. @default true */
  open?: boolean;
  /** Dialog heading (h3). */
  title?: React.ReactNode;
  /** Called when the scrim is clicked. */
  onClose?: () => void;
  /** Wider dialog (48rem) for multi-column forms. @default false */
  wide?: boolean;
  /** Footer row (typically Save / Cancel buttons). */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/** Centered modal dialog over a dark scrim, with an accent border. */
export function Modal(props: ModalProps): JSX.Element;
