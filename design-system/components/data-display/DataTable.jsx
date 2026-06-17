import React from "react";

/**
 * Data table matching the product's table styling: uppercase muted column
 * heads, hairline row separators, muted cell text. Columns are
 * { key, header, render?, align?, width? }; rows are arbitrary objects.
 */
export function DataTable({ columns = [], rows = [], rowKey, empty = "No records", style }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fs-base)", ...style }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: c.align || "left",
                fontSize: "var(--fs-xs)",
                fontWeight: "var(--fw-semibold)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wide)",
                color: "var(--text-subtle)",
                padding: "0.65rem 0.5rem",
                borderBottom: "1px solid var(--border)",
                width: c.width,
                whiteSpace: "nowrap",
              }}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: "1.5rem 0.5rem", textAlign: "center", color: "var(--text-subtle)" }}>
              {empty}
            </td>
          </tr>
        ) : (
          rows.map((r, i) => (
            <tr key={rowKey ? rowKey(r, i) : i}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align || "left",
                    padding: "0.55rem 0.5rem",
                    borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  {c.render ? c.render(r, i) : r[c.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
