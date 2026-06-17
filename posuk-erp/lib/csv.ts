import type { Column } from "@/components/data-display/DataTable";

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportCsv<T>(filename: string, columns: Column<T>[], rows: T[]) {
  const cols = columns.filter((c) => c.header);
  const header = cols.map((c) => csvEscape(c.header));
  const lines = rows.map((r, i) =>
    cols.map((c) => csvEscape(c.csv ? c.csv(r, i) : (r as Record<string, unknown>)[c.key])),
  );
  const csv = [header, ...lines].map((row) => row.join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
