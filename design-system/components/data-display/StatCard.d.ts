import * as React from "react";

export interface StatCardProps {
  /** Uppercase metric label. */
  label: React.ReactNode;
  /** Large headline value. */
  value: React.ReactNode;
  /** Optional muted sub-line (e.g. "12 documents"). */
  meta?: React.ReactNode;
  /** Stronger cyan tint + accent border. @default false */
  accent?: boolean;
  style?: React.CSSProperties;
}

/** Dashboard KPI chip — uppercase label over a large value on a cyan-tinted tile. */
export function StatCard(props: StatCardProps): JSX.Element;
