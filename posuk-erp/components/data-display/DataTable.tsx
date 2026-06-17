import React from "react";

export interface Column<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (row: T, i: number) => React.ReactNode;
  /** Plain-text value used for CSV export; falls back to row[key] when omitted. */
  csv?: (row: T, i: number) => string | number | null | undefined;
  align?: "left" | "right" | "center";
  width?: string | number;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  rows: T[];
  rowKey?: (row: T, i: number) => React.Key;
  empty?: string;
  style?: React.CSSProperties;
}

export function DataTable<T = Record<string, unknown>>({ columns, rows, rowKey, empty = "No records", style }: DataTableProps<T>) {
  return (
    <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", fontSize: "var(--fs-base)", ...style }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ textAlign: c.align || "left", fontSize: "var(--fs-xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", padding: "0.65rem 0.5rem", borderBottom: "1px solid var(--border)", width: c.width, whiteSpace: "nowrap" }}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={columns.length} style={{ padding: "2rem 0.5rem", textAlign: "center", color: "var(--text-subtle)" }}>{empty}</td></tr>
        ) : rows.map((r, i) => (
          <tr key={rowKey ? rowKey(r, i) : i} style={{ transition: "background var(--dur-fast) var(--ease)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}>
            {columns.map((c) => (
              <td key={c.key} style={{ textAlign: c.align || "left", padding: "0.55rem 0.5rem", borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border)", color: "var(--text-muted)" }}>
                {c.render ? c.render(r, i) : (r as Record<string, unknown>)[c.key] as React.ReactNode}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
