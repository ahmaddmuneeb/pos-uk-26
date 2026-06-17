import * as React from "react";

export interface Column<Row = any> {
  /** Unique column key (also the row field read when no `render`). */
  key: string;
  /** Header label. */
  header: React.ReactNode;
  /** Custom cell renderer. */
  render?: (row: Row, index: number) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: string | number;
}

export interface DataTableProps<Row = any> {
  columns: Column<Row>[];
  rows: Row[];
  /** Stable key per row. */
  rowKey?: (row: Row, index: number) => React.Key;
  /** Empty-state text. @default "No records" */
  empty?: React.ReactNode;
  style?: React.CSSProperties;
}

/** List/grid table — uppercase muted heads, hairline separators. */
export function DataTable<Row = any>(props: DataTableProps<Row>): JSX.Element;
