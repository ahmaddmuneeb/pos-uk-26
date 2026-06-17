"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

interface CurrentStockRow {
  id: string;
  sku: string;
  name: string;
  uomName: string;
  balance: number;
}

const COLORS = ["#38bdf8", "#4ade80", "#facc15", "#a78bfa", "#fb923c", "#f472b6", "#34d399", "#f87171"];

const CHART_STYLE: React.CSSProperties = {
  background: "var(--bg-surface, #0f172a)",
  border: "1px solid var(--border, #1e293b)",
  borderRadius: "var(--radius-sm, 6px)",
  padding: "1rem 1rem 0.5rem",
};

const STAT_STYLE: React.CSSProperties = {
  background: "var(--bg-surface, #0f172a)",
  border: "1px solid var(--border, #1e293b)",
  borderRadius: "var(--radius-sm, 6px)",
  padding: "1rem 1.25rem",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const tooltipStyle = {
  contentStyle: { background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#f1f5f9", fontSize: 12 },
  labelStyle: { color: "#94a3b8", fontWeight: 600 },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

export default function CurrentStockReportPage() {
  const { data: rows = [], isLoading } = useQuery<CurrentStockRow[]>({
    queryKey: ["currentstock"],
    queryFn: () => fetchArray("/api/reports/currentstock"),
  });

  const totalSkus = rows.length;
  const inStock = rows.filter((r) => r.balance > 0).length;
  const outOfStock = rows.filter((r) => r.balance <= 0).length;
  const totalUnits = rows.reduce((s, r) => s + r.balance, 0);

  const top10 = [...rows]
    .filter((r) => r.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 10)
    .map((r) => ({ name: r.sku, balance: r.balance }));

  const uomMap = new Map<string, number>();
  rows.forEach((r) => {
    if (r.balance > 0) uomMap.set(r.uomName, (uomMap.get(r.uomName) ?? 0) + r.balance);
  });
  const uomPie = Array.from(uomMap.entries()).map(([name, value]) => ({ name, value }));

  const columns: Column<CurrentStockRow>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "uomName", header: "UOM" },
    {
      key: "balance", header: "Current Balance", align: "right",
      render: (r) => (
        <span style={{ fontWeight: 600, color: r.balance <= 0 ? "var(--danger)" : "var(--text)" }}>
          {r.balance}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title="Current Stock" subtitle="Total stock balance across all locations">
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      </Card>
    );
  }

  return (
    <Card title="Current Stock" subtitle="Total stock balance across all locations" actions={<ExportActions columns={columns} rows={rows} filename="current-stock" />}>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={STAT_STYLE}>
          <div style={{ fontSize: "var(--fs-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)" }}>Total SKUs</div>
          <div style={{ fontSize: "var(--fs-2xl, 1.75rem)", fontWeight: 800, color: "var(--accent)" }}>{totalSkus}</div>
        </div>
        <div style={STAT_STYLE}>
          <div style={{ fontSize: "var(--fs-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)" }}>In Stock</div>
          <div style={{ fontSize: "var(--fs-2xl, 1.75rem)", fontWeight: 800, color: "#4ade80" }}>{inStock}</div>
        </div>
        <div style={STAT_STYLE}>
          <div style={{ fontSize: "var(--fs-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)" }}>Out of Stock</div>
          <div style={{ fontSize: "var(--fs-2xl, 1.75rem)", fontWeight: 800, color: "#f87171" }}>{outOfStock}</div>
        </div>
        <div style={STAT_STYLE}>
          <div style={{ fontSize: "var(--fs-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)" }}>Total Units</div>
          <div style={{ fontSize: "var(--fs-2xl, 1.75rem)", fontWeight: 800, color: "var(--text)" }}>{totalUnits.toLocaleString()}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

        {/* Top 10 by balance — horizontal bar */}
        <div style={CHART_STYLE}>
          <div style={{ fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Top {top10.length} Products by Stock
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={top10} layout="vertical" margin={{ top: 4, right: 24, left: 10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={56} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="balance" name="Units" fill="#38bdf8" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Units by UOM */}
        <div style={CHART_STYLE}>
          <div style={{ fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Units by UOM
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={uomPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                label={({ name, value }) => `${name} (${value})`}
                labelLine={{ stroke: "#475569" }}
              >
                {uomPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Table */}
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No stock data" />
    </Card>
  );
}
