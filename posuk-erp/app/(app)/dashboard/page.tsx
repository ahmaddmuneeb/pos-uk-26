"use client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { StatCard } from "@/components/data-display/StatCard";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { fmt, currencySymbol } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface InvoiceRow { id: string; no: string; date: string; customerName: string; grandTotal: number; paidTotal: number; outstanding: number; status: string }
interface ReturnRow { id: string; date: string; grandTotal: number }
interface ReceiptRow { id: string; date: string; amount: number | string; mode: string }
interface ReceivableRow { customerId: string; name: string; balance: number }
interface StockRow { id: string; sku: string; name: string; balance: number; reorderLevel: number }
interface OrderRow { id: string }

const statusTone: Record<string, "success" | "warning" | "danger" | "info"> = { Paid: "success", Partial: "warning", Overdue: "danger", Draft: "info" };

const STATUS_COLORS: Record<string, string> = { Paid: "#4ade80", Partial: "#fbbf24", Overdue: "#f87171", Draft: "#94a3b8" };
const PIE_COLORS = ["#22d3ee", "#a78bfa", "#4ade80", "#fbbf24", "#f87171", "#fb923c"];

function last6Months() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleString("en-GB", { month: "short", year: "2-digit" }), year: d.getFullYear(), month: d.getMonth() };
  });
}

function sumByMonth<T extends { date: string; grandTotal?: number; amount?: number | string }>(
  rows: T[], months: ReturnType<typeof last6Months>, field: "grandTotal" | "amount" = "grandTotal"
) {
  return months.map(({ label, year, month }) => ({
    month: label,
    value: rows
      .filter((r) => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; })
      .reduce((sum, r) => sum + (parseFloat(String(r[field] ?? 0)) || 0), 0),
  }));
}

function CurrencyTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      <p style={{ margin: "0 0 4px", color: "#94a3b8", fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ margin: "2px 0", color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      <p style={{ margin: 0, color: "#f1f5f9" }}>{p.name}: <strong>{p.value}</strong></p>
    </div>
  );
}

function AmountPieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      <p style={{ margin: 0, color: "#f1f5f9" }}>{p.name}: <strong>{fmt(p.value)}</strong></p>
    </div>
  );
}

const axisStyle = { fill: "#64748b", fontSize: 11 };
const gridStyle = { stroke: "#1e293b" };

export default function DashboardPage() {
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices"], queryFn: () => fetchArray<InvoiceRow>("/api/invoices") });
  const { data: returns = [] } = useQuery({ queryKey: ["returns"], queryFn: () => fetchArray<ReturnRow>("/api/returns") });
  const { data: receipts = [] } = useQuery({ queryKey: ["receipts"], queryFn: () => fetchArray<ReceiptRow>("/api/receipts") });
  const { data: receivable = [] } = useQuery({ queryKey: ["reports", "receivable"], queryFn: () => fetchArray<ReceivableRow>("/api/reports/receivable") });
  const { data: stock = [] } = useQuery({ queryKey: ["reports", "stocksummary"], queryFn: () => fetchArray<StockRow>("/api/reports/stocksummary") });
  const { data: orders = [] } = useQuery({ queryKey: ["orders"], queryFn: () => fetchArray<OrderRow>("/api/orders") });

  const now = new Date();
  const salesThisMonth = invoices
    .filter((i) => { const d = new Date(i.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((sum, i) => sum + i.grandTotal, 0);
  const outstanding = receivable.reduce((sum, r) => sum + r.balance, 0);
  const lowStock = stock.filter((s) => s.balance < s.reorderLevel);
  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Chart data
  const months = last6Months();

  const salesTrend = sumByMonth(invoices, months).map((d, i) => ({
    month: d.month,
    Sales: d.value,
    Returns: sumByMonth(returns, months)[i].value,
  }));

  const statusCounts = ["Paid", "Partial", "Overdue", "Draft"].map((s) => ({
    name: s,
    value: invoices.filter((i) => i.status === s).length,
  })).filter((d) => d.value > 0);

  const customerMap: Record<string, number> = {};
  invoices.forEach((i) => { customerMap[i.customerName] = (customerMap[i.customerName] || 0) + i.grandTotal; });
  const topCustomers = Object.entries(customerMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, Revenue]) => ({ name: name.length > 18 ? name.slice(0, 18) + "…" : name, Revenue }));

  const modeMap: Record<string, number> = {};
  receipts.forEach((r) => { modeMap[r.mode] = (modeMap[r.mode] || 0) + (parseFloat(String(r.amount)) || 0); });
  const receiptModes = Object.entries(modeMap).map(([name, value]) => ({ name, value }));

  const receiptsTrend = sumByMonth(receipts, months, "amount").map((d) => ({ month: d.month, Receipts: d.value }));

  const lowStockChart = lowStock.slice(0, 8).map((s) => ({
    name: s.name.length > 14 ? s.name.slice(0, 14) + "…" : s.name,
    Stock: s.balance,
    Reorder: s.reorderLevel,
  }));

  const invoiceColumns: Column<InvoiceRow>[] = [
    { key: "no", header: "Invoice No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "customerName", header: "Customer" },
    { key: "grandTotal", header: "Total", align: "right", render: (r) => fmt(r.grandTotal) },
    { key: "status", header: "Status", render: (r) => <Badge tone={statusTone[r.status] || "neutral"}>{r.status}</Badge> },
  ];

  const stockColumns: Column<StockRow>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "balance", header: "Stock", align: "right" },
    { key: "reorderLevel", header: "Reorder", align: "right" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <StatCard label="Sales this month" value={fmt(salesThisMonth)} accent />
        <StatCard label="Outstanding receivables" value={fmt(outstanding)} />
        <StatCard label="Low stock items" value={lowStock.length} meta={lowStock.length ? "Below reorder level" : "All stocked"} />
        <StatCard label="Open orders" value={orders.length} />
      </div>

      {/* Sales trend + Invoice status */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem" }}>
        <Card title="Sales vs Returns — last 6 months">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} tickFormatter={(v) => `${currencySymbol()}${(v / 1000).toFixed(0)}k`} width={48} />
              <Tooltip cursor={false} content={<CurrencyTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Area type="monotone" dataKey="Sales" stroke="#22d3ee" fill="url(#gradSales)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Returns" stroke="#f87171" fill="url(#gradReturns)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Invoice status">
          {statusCounts.length === 0 ? (
            <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>No invoices yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {statusCounts.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<PieTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Top customers + Receipts trend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <Card title="Top customers by revenue">
          {topCustomers.length === 0 ? (
            <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCustomers} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} {...gridStyle} />
                <XAxis type="number" tick={axisStyle} tickFormatter={(v) => `${currencySymbol()}${(v / 1000).toFixed(0)}k`} width={48} />
                <YAxis type="category" dataKey="name" tick={axisStyle} width={110} />
                <Tooltip cursor={false} content={<CurrencyTooltip />} />
                <Bar dataKey="Revenue" fill="#a78bfa" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Monthly receipts — last 6 months">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={receiptsTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} tickFormatter={(v) => `${currencySymbol()}${(v / 1000).toFixed(0)}k`} width={48} />
              <Tooltip cursor={false} content={<CurrencyTooltip />} />
              <Bar dataKey="Receipts" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Receipt modes + Low stock bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem" }}>
        <Card title="Receipts by payment mode">
          {receiptModes.length === 0 ? (
            <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>No receipts yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={receiptModes} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                  {receiptModes.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<AmountPieTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Low stock — balance vs reorder level">
          {lowStockChart.length === 0 ? (
            <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>All products are sufficiently stocked</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={lowStockChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                <XAxis dataKey="name" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip cursor={false} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey="Stock" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Reorder" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.25rem" }}>
        <Card title="Recent invoices">
          <DataTable columns={invoiceColumns} rows={recentInvoices} rowKey={(r) => r.id} empty="No invoices yet" />
        </Card>
        <Card title="Low stock" subtitle="Products below reorder level">
          <DataTable columns={stockColumns} rows={lowStock.slice(0, 5)} rowKey={(r) => r.id} empty="No low stock items" />
        </Card>
      </div>

    </div>
  );
}
