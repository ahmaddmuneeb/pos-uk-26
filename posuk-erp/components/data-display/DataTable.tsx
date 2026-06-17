"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  pageSize?: number;
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export function DataTable<T = Record<string, unknown>>({ columns, rows, rowKey, empty = "No records", style, pageSize = 10 }: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [prevRows, setPrevRows] = useState(rows);

  // Derived-state reset: when rows reference changes (e.g. filter applied), go back to page 1
  if (prevRows !== rows) {
    setPrevRows(rows);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <div>
      <table style={{ width: "100%", tableLayout: "auto", borderCollapse: "collapse", fontSize: "var(--fs-base)", ...style }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align || "left", fontSize: "var(--fs-xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", padding: "0.65rem 0.75rem", borderBottom: "1px solid var(--border)", width: c.width, whiteSpace: "nowrap" }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: "2rem 0.5rem", textAlign: "center", color: "var(--text-subtle)" }}>{empty}</td></tr>
          ) : pageRows.map((r, i) => (
            <tr key={rowKey ? rowKey(r, i + start) : i + start} style={{ transition: "background var(--dur-fast) var(--ease)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.02)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align || "left", padding: "0.55rem 0.75rem", borderBottom: i === pageRows.length - 1 ? "none" : "1px solid var(--border)", color: "var(--text-muted)", whiteSpace: c.width ? "nowrap" : undefined }}>
                  {c.render ? c.render(r, i + start) : (r as Record<string, unknown>)[c.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length > pageSize && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0.75rem 0.25rem", borderTop: "1px solid var(--border)", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-subtle)" }}>
            Showing {start + 1}–{Math.min(start + pageSize, rows.length)} of {rows.length}
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              style={{ padding: "0.3rem 0.5rem", display: "inline-flex", alignItems: "center", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: safePage === 1 ? "var(--text-subtle)" : "var(--text)", cursor: safePage === 1 ? "default" : "pointer", opacity: safePage === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={14} />
            </button>
            {pageNumbers(safePage, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} style={{ padding: "0.3rem 0.4rem", fontSize: "var(--fs-xs)", color: "var(--text-subtle)" }}>…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{ padding: "0.3rem 0.6rem", minWidth: 32, fontSize: "var(--fs-xs)", background: p === safePage ? "var(--accent-dim)" : "transparent", border: "1px solid", borderColor: p === safePage ? "var(--accent)" : "var(--border)", borderRadius: "var(--radius-sm)", color: p === safePage ? "var(--accent)" : "var(--text)", cursor: p === safePage ? "default" : "pointer", fontWeight: p === safePage ? 600 : 400 }}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              style={{ padding: "0.3rem 0.5rem", display: "inline-flex", alignItems: "center", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: safePage === totalPages ? "var(--text-subtle)" : "var(--text)", cursor: safePage === totalPages ? "default" : "pointer", opacity: safePage === totalPages ? 0.4 : 1 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
