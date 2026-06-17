import * as React from "react";

export type TabItem = string | { value: string; label: React.ReactNode };

export interface TabsProps {
  /** Tabs as strings or {value,label} objects. */
  tabs: TabItem[];
  /** Active tab value. */
  value: string;
  /** Called with the selected value. */
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/** Segmented pill tab bar used to switch report/register views. */
export function Tabs(props: TabsProps): JSX.Element;
