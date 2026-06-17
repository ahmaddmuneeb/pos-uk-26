"use client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { StatCard } from "@/components/data-display/StatCard";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { fmt } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";

interface InvoiceRow { id: string; no: string; date: string; customerName: string; grandTotal: number; outstanding: number; status: string }
interface ReceivableRow { customerId: string; name: string; balance: number }
interface StockRow { id: string; sku: string; name: string; balance: number; reorderLevel: number }
interface OrderRow { id: string }

const statusTone: Record<string, "success" | "warning" | "danger" | "info"> = { Paid: "success", Partial: "warning", Overdue: "danger", Draft: "info" };

export default function DashboardPage() {
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices"], queryFn: () => fetchArray<InvoiceRow>("/api/invoices") });
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
    { key: "balance", header: "Balance", align: "right" },
    { key: "reorderLevel", header: "Reorder Level", align: "right" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <StatCard label="Sales this month" value={fmt(salesThisMonth)} accent />
        <StatCard label="Outstanding receivables" value={fmt(outstanding)} />
        <StatCard label="Low stock items" value={lowStock.length} meta={lowStock.length ? "Below reorder level" : "All stocked"} />
        <StatCard label="Open orders" value={orders.length} />
      </div>
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
