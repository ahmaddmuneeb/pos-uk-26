"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

interface StockSummaryRow {
  id: string;
  sku: string;
  name: string;
  categoryName: string;
  qtyIn: number;
  qtyOut: number;
  balance: number;
  reorderLevel: number;
}

const COLORS = ["#38bdf8", "#4ade80", "#facc15", "#f87171", "#a78bfa", "#fb923c", "#34d399", "#f472b6"];

const CHART_STYLE: React.CSSProperties = {
  background: "var(--bg-surface, #0f172a)",
  border: "1px solid var(--border, #1e293b)",
  borderRadius: "var(--radius-sm, 6px)",
  padding: "1rem 1rem 0.5rem",
};

export default function StockSummaryReportPage() {
  const rights = useRights("Stock Summary");
  const { data: rows = [], isLoading } = useQuery<StockSummaryRow[]>({
    queryKey: ["stocksummary"],
    queryFn: () => fetchArray("/api/reports/stocksummary"),
  });

  const [topN] = useState(10);

  // Top N products by current balance
  const topByBalance = [...rows]
    .filter((r) => r.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, topN)
    .map((r) => ({ name: r.sku, balance: r.balance, reorder: r.reorderLevel }));

  // Qty In vs Out — top movers
  const topMovers = [...rows]
    .sort((a, b) => (b.qtyIn + b.qtyOut) - (a.qtyIn + a.qtyOut))
    .slice(0, topN)
    .map((r) => ({ name: r.sku, "Qty In": r.qtyIn, "Qty Out": r.qtyOut }));

  // Stock health breakdown
  const healthy = rows.filter((r) => r.balance >= r.reorderLevel).length;
  const lowStock = rows.filter((r) => r.balance > 0 && r.balance < r.reorderLevel).length;
  const outOfStock = rows.filter((r) => r.balance <= 0).length;
  const healthPie = [
    { name: "Healthy", value: healthy },
    { name: "Low stock", value: lowStock },
    { name: "Out of stock", value: outOfStock },
  ].filter((d) => d.value > 0);
  const healthColors = ["#4ade80", "#facc15", "#f87171"];

  // Stock by category
  const categoryMap = new Map<string, number>();
  rows.forEach((r) => {
    categoryMap.set(r.categoryName, (categoryMap.get(r.categoryName) ?? 0) + r.balance);
  });
  const categoryPie = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const tooltipStyle = {
    contentStyle: { background: "#1e293b", border: "1px solid #334155", borderRadius: 6, color: "#f1f5f9", fontSize: 12 },
    labelStyle: { color: "#94a3b8", fontWeight: 600 },
    cursor: { fill: "rgba(255,255,255,0.04)" },
  };

  const columns: Column<StockSummaryRow>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "categoryName", header: "Category" },
    { key: "qtyIn", header: "Qty In", align: "right" },
    { key: "qtyOut", header: "Qty Out", align: "right" },
    { key: "balance", header: "Balance", align: "right" },
    { key: "reorderLevel", header: "Reorder Level", align: "right" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge tone={r.balance <= 0 ? "danger" : r.balance < r.reorderLevel ? "warning" : "success"}>
          {r.balance <= 0 ? "Out of stock" : r.balance < r.reorderLevel ? "Low stock" : "OK"}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <ScreenGuard screen="Stock Summary">
      <Card title="Stock Summary" subtitle="Movement and balance by product">
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      </Card>
      </ScreenGuard>
    );
  }

  return (
    <ScreenGuard screen="Stock Summary">
    <Card title="Stock Summary" subtitle="Movement and balance by product" actions={rights.print ? <ExportActions columns={columns} rows={rows} filename="stock-summary" /> : undefined}>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

        {/* Top products by balance */}
        <div style={CHART_STYLE}>
          <div style={{ fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Top {topByBalance.length} Products by Stock Balance
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topByBalance} margin={{ top: 4, right: 8, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="balance" name="Balance" fill="#38bdf8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="reorder" name="Reorder Level" fill="#334155" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Qty In vs Out — top movers */}
        <div style={CHART_STYLE}>
          <div style={{ fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Top {topMovers.length} Products — Qty In vs Out
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topMovers} margin={{ top: 4, right: 8, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 8 }} />
              <Bar dataKey="Qty In" fill="#4ade80" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Qty Out" fill="#f87171" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock health pie */}
        <div style={CHART_STYLE}>
          <div style={{ fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Stock Health
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={healthPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name} (${value})`} labelLine={{ stroke: "#475569" }}>
                {healthPie.map((_, i) => <Cell key={i} fill={healthColors[i]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock by category pie */}
        <div style={CHART_STYLE}>
          <div style={{ fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Stock by Category
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name} (${value})`} labelLine={{ stroke: "#475569" }}>
                {categoryPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Table */}
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No stock data" />
    </Card>
    </ScreenGuard>
  );
}
