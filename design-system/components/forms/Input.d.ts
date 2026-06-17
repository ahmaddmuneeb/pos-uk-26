import * as React from "react";

export interface FieldProps {
  /** Label text shown above the control. */
  label: React.ReactNode;
  /** Muted helper text below the control. */
  hint?: React.ReactNode;
  /** Error message — shown in danger colour, replaces hint. */
  error?: React.ReactNode;
  htmlFor?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Render with a danger border. @default false */
  invalid?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/** Stacked label + control wrapper used on every POS UK form. */
export function Field(props: FieldProps): JSX.Element;
/** Single-line text input with cyan focus ring. */
export function Input(props: InputProps): JSX.Element;
/** Multi-line text input. */
export function Textarea(props: TextareaProps): JSX.Element;
