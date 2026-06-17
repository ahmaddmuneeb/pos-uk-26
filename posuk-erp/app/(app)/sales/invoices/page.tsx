"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Modal } from "@/components/feedback/Modal";
import { Field } from "@/components/forms/Field";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { Toolbar, TotalsBar, ExportActions, KeyValue } from "@/components/ui/ScreenHelpers";
import { LineItems, docTotals, DocLine } from "@/components/ui/LineItems";
import { fmt } from "@/lib/currency";
import { getCompanyInfo, invoiceDoc, openPrintWindow, InvoicePrintData } from "@/lib/printDoc";
import { fetchArray } from "@/lib/fetchJson";
import { toast } from "sonner";
import { Eye, Printer, Trash2, RefreshCw } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface Customer { id: string; name: string }
interface SalePerson { id: string; name: string }
interface Location { id: string; name: string }
interface Order { id: string; no: string }

const blankLine: DocLine = { productId: "", qty: "1", rate: "0", disc: "0", vat: "20" };
const statusTone: Record<string, "success" | "warning" | "danger" | "info"> = { Paid: "success", Partial: "warning", Overdue: "danger", Draft: "info" };
const STATUS_COLORS: Record<string, string> = { Paid: "#4ade80", Partial: "#fbbf24", Overdue: "#f87171", Draft: "#94a3b8" };
const axisStyle = { fill: "#64748b", fontSize: 11 };
const gridProps = { strokeDasharray: "3 3", stroke: "#1e293b" };

function last6Months() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleString("en-GB", { month: "short", year: "2-digit" }), year: d.getFullYear(), month: d.getMonth() };
  });
}

function CurrencyTip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      <p style={{ margin: "0 0 4px", color: "#94a3b8", fontWeight: 600 }}>{label}</p>
      {payload.map((p) => <p key={p.name} style={{ margin: "2px 0", color: p.color }}>{p.name}: {fmt(p.value)}</p>)}
    </div>
  );
}

function CountTip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      <p style={{ margin: "0 0 4px", color: "#94a3b8", fontWeight: 600 }}>{label}</p>
      {payload.map((p) => <p key={p.name} style={{ margin: "2px 0", color: "#f1f5f9" }}>{p.name}: {p.value}</p>)}
    </div>
  );
}

type InvoiceRow = {
  id: string; no: string; date: string; dueDate: string;
  customerId: string; customerName: string; salePersonName?: string;
  grandTotal: number; paidTotal: number; outstanding: number; status: string;
};

export default function InvoicesPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["invoices"], queryFn: () => fetchArray<InvoiceRow>("/api/invoices") });
  const { data: customers = [] } = useQuery<Customer[]>({ queryKey: ["customers"], queryFn: () => fetchArray("/api/customers") });
  const { data: salePersons = [] } = useQuery<SalePerson[]>({ queryKey: ["salepersons"], queryFn: () => fetchArray("/api/salepersons") });
  const { data: locations = [] } = useQuery<Location[]>({ queryKey: ["locations"], queryFn: () => fetchArray("/api/locations") });
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ["orders"], queryFn: () => fetchArray("/api/orders") });
  const { data: products = [] } = useQuery<{ id: string; sku: string; name: string; wholesaleRate: string | number }[]>({ queryKey: ["products"], queryFn: () => fetchArray("/api/products") });
  const { data: preferences = [] } = useQuery<{ key: string; value: string }[]>({ queryKey: ["preferences"], queryFn: () => fetchArray("/api/preferences") });

  const [statusFilter, setStatusFilter] = useState("");
  const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
  const [head, setHead] = useState({ customerId: "", salePersonId: "", locationId: "", orderId: "", date: new Date().toISOString().slice(0, 10), dueDate: new Date().toISOString().slice(0, 10) });
  const [lines, setLines] = useState<DocLine[]>([blankLine]);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState<InvoicePrintData | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; no: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusModal, setStatusModal] = useState<{ id: string; no: string; status: string } | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const t = docTotals(lines, true);
  const normProducts = products.map((p) => ({ id: p.id, sku: p.sku, name: p.name, wholesaleRate: typeof p.wholesaleRate === "string" ? parseFloat(p.wholesaleRate) : p.wholesaleRate }));
  const filtered = rows.filter((r) => (!statusFilter || r.status === statusFilter) && (!q || r.no.toLowerCase().includes(q.toLowerCase()) || r.customerName.toLowerCase().includes(q.toLowerCase())));
  const reset = () => { setHead({ customerId: "", salePersonId: "", locationId: "", orderId: "", date: new Date().toISOString().slice(0, 10), dueDate: new Date().toISOString().slice(0, 10) }); setLines([blankLine]); setError(""); };

  // ── Chart data ────────────────────────────────────────────────────────────
  const months = last6Months();
  const revenueTrend = months.map(({ label, year, month }) => {
    const slice = rows.filter((r) => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; });
    return { month: label, Revenue: slice.reduce((s, r) => s + r.grandTotal, 0), Paid: slice.reduce((s, r) => s + r.paidTotal, 0) };
  });

  const statusDist = ["Paid", "Partial", "Overdue", "Draft"]
    .map((s) => ({ name: s, value: rows.filter((r) => r.status === s).length }))
    .filter((d) => d.value > 0);

  const custMap: Record<string, number> = {};
  rows.forEach((r) => { custMap[r.customerName] = (custMap[r.customerName] || 0) + r.grandTotal; });
  const topCustomers = Object.entries(custMap).sort(([, a], [, b]) => b - a).slice(0, 6)
    .map(([name, Revenue]) => ({ name: name.length > 18 ? name.slice(0, 18) + "…" : name, Revenue }));

  const now = new Date();
  const thisMonth = rows.filter((r) => { const d = new Date(r.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const totalRevenue = rows.reduce((s, r) => s + r.grandTotal, 0);
  const totalOutstanding = rows.reduce((s, r) => s + r.outstanding, 0);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const save = useMutation({
    mutationFn: () => fetch("/api/invoices", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: head.customerId, salePersonId: head.salePersonId || undefined, orderId: head.orderId || undefined,
        locationId: head.locationId, date: head.date, dueDate: head.dueDate,
        lines: lines.filter((l) => l.productId).map((l) => ({ productId: l.productId, qty: parseInt(l.qty) || 0, rate: parseFloat(l.rate) || 0, discount: parseFloat(l.disc) || 0, vatRate: parseFloat(l.vat) || 0 })),
      }),
    }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed to post invoice"); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); setShow(false); reset(); toast.success("Invoice saved."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/invoices/${id}`, { method: "DELETE" }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed to delete"); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); setConfirmDelete(null); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/invoices/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
        .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed to update status"); }),
    onSuccess: (_data, { status }) => { qc.invalidateQueries({ queryKey: ["invoices"] }); setStatusModal(null); toast.success(`Status updated to "${status}".`); },
    onError: (e: Error) => toast.error(e.message),
  });

  const loadInvoice = async (id: string): Promise<InvoicePrintData | null> => {
    setLoadingId(id);
    try { const res = await fetch(`/api/invoices/${id}`); if (!res.ok) throw new Error((await res.json()).error || "Failed"); return await res.json(); }
    catch (e: unknown) { toast.error((e as Error).message); return null; }
    finally { setLoadingId(null); }
  };

  const openView = async (id: string) => { const inv = await loadInvoice(id); if (inv) setViewing(inv); };
  const printInvoice = async (id: string, inv?: InvoicePrintData) => { const data = inv ?? await loadInvoice(id); if (data) openPrintWindow(`Invoice ${data.no}`, invoiceDoc(getCompanyInfo(preferences), data)); };
  const handleDelete = async () => {
    if (!confirmDelete) return; setDeleting(true);
    try { await deleteMutation.mutateAsync(confirmDelete.id); toast.success(`Invoice ${confirmDelete.no} deleted.`); }
    catch (e: unknown) { toast.error((e as Error).message); setConfirmDelete(null); } finally { setDeleting(false); }
  };

  const valid = head.customerId && head.locationId && lines.some((l) => l.productId);

  const columns: Column<InvoiceRow>[] = [
    { key: "no", header: "Invoice No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "dueDate", header: "Due date", render: (r) => new Date(r.dueDate).toLocaleDateString("en-GB") },
    { key: "customerName", header: "Customer" },
    { key: "grandTotal", header: "Net total", align: "right", render: (r) => fmt(r.grandTotal) },
    { key: "paidTotal", header: "Paid", align: "right", render: (r) => fmt(r.paidTotal) },
    { key: "outstanding", header: "Outstanding", align: "right", render: (r) => fmt(r.outstanding) },
    { key: "status", header: "Status", render: (r) => <Badge tone={statusTone[r.status] || "neutral"}>{r.status}</Badge> },
    {
      key: "act", header: "Actions", align: "right", width: 120,
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}>
          <IconButton label="View" size="sm" disabled={loadingId === r.id} onClick={() => openView(r.id)}><Eye size={14} color="#38bdf8" /></IconButton>
          <IconButton label="Print" size="sm" disabled={loadingId === r.id} onClick={() => printInvoice(r.id)}><Printer size={14} color="#a78bfa" /></IconButton>
          <IconButton label="Update status" size="sm" onClick={() => { setStatusModal({ id: r.id, no: r.no, status: r.status }); setNewStatus(r.status); }}><RefreshCw size={14} color="#4ade80" /></IconButton>
          <IconButton label="Delete" size="sm" onClick={() => setConfirmDelete({ id: r.id, no: r.no })}><Trash2 size={14} color="#f87171" /></IconButton>
        </span>
      ),
    },
  ];

  return (
    <>
      {/* Stat summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
        {[
          { label: "Total invoices", value: String(rows.length) },
          { label: "Total revenue", value: fmt(totalRevenue) },
          { label: "Outstanding", value: fmt(totalOutstanding) },
          { label: "This month", value: fmt(thisMonth.reduce((s, r) => s + r.grandTotal, 0)) },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", boxShadow: "var(--shadow)" }}>
            <p style={{ margin: "0 0 4px", fontSize: "var(--fs-xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600 }}>{label}</p>
            <p style={{ margin: 0, fontSize: "var(--fs-xl)", fontWeight: 700, color: "var(--text)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        <Card title="Revenue vs Paid — last 6 months">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} /><stop offset="95%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient>
                <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4ade80" stopOpacity={0.2} /><stop offset="95%" stopColor="#4ade80" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} width={48} />
              <Tooltip cursor={false} content={<CurrencyTip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Area type="monotone" dataKey="Revenue" stroke="#22d3ee" fill="url(#gRev)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Paid" stroke="#4ade80" fill="url(#gPaid)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Invoice status breakdown">
          {statusDist.length === 0
            ? <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>No invoices yet</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {statusDist.map((e) => <Cell key={e.name} fill={STATUS_COLORS[e.name] || "#94a3b8"} />)}
                  </Pie>
                  <Tooltip cursor={false} content={<CountTip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
        </Card>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        <Card title="Top customers by revenue">
          {topCustomers.length === 0
            ? <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>No data yet</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topCustomers} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" tick={axisStyle} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} width={48} />
                  <YAxis type="category" dataKey="name" tick={axisStyle} width={120} />
                  <Tooltip cursor={false} content={<CurrencyTip />} />
                  <Bar dataKey="Revenue" fill="#a78bfa" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </Card>

        <Card title="Monthly invoice count — last 6 months">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={months.map(({ label, year, month }) => ({
                month: label,
                Invoices: rows.filter((r) => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; }).length,
              }))}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} allowDecimals={false} />
              <Tooltip cursor={false} content={<CountTip />} />
              <Bar dataKey="Invoices" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Main table */}
      <Card title="Sale Invoices" actions={<><ExportActions columns={columns} rows={filtered} filename="sale-invoices" /><Button onClick={() => setShow(true)}>New invoice</Button><Button variant="ghost" onClick={() => qc.invalidateQueries({ queryKey: ["invoices"] })}>Refresh</Button></>}>
        <Toolbar>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: "auto" }}>
            <option value="">All statuses</option><option>Paid</option><option>Partial</option><option>Overdue</option><option>Draft</option>
          </Select>
          <Input placeholder="Search invoice or customer" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "auto", minWidth: "15rem" }} />
        </Toolbar>
        {isLoading ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div> : (
          <div style={{ overflowX: "auto" }}>
            <DataTable rowKey={(r) => r.id} columns={columns} rows={filtered} />
          </div>
        )}
      </Card>

      {/* New invoice modal */}
      <Modal open={show} wide title="New sale invoice" onClose={() => { setShow(false); reset(); }}
        footer={<><Button onClick={() => save.mutate()} disabled={!valid || save.isPending}>{save.isPending ? "Posting…" : "Post invoice"}</Button><Button variant="ghost" onClick={() => { setShow(false); reset(); }}>Cancel</Button></>}>
        {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-sm)", margin: "0 0 12px" }}>{error}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Field label="From sale order">
            <Select value={head.orderId} onChange={(e) => setHead({ ...head, orderId: e.target.value })}>
              <option value="">— None —</option>
              {orders.map((o) => <option key={o.id} value={o.id}>{o.no}</option>)}
            </Select>
          </Field>
          <Field label="Customer">
            <Select value={head.customerId} onChange={(e) => setHead({ ...head, customerId: e.target.value })}>
              <option value="">Select…</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Sale person">
            <Select value={head.salePersonId} onChange={(e) => setHead({ ...head, salePersonId: e.target.value })}>
              <option value="">Select…</option>
              {salePersons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
          <Field label="Stock location">
            <Select value={head.locationId} onChange={(e) => setHead({ ...head, locationId: e.target.value })}>
              <option value="">Select…</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </Select>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Field label="Invoice date"><Input type="date" value={head.date} onChange={(e) => setHead({ ...head, date: e.target.value })} /></Field>
          <Field label="Due date"><Input type="date" value={head.dueDate} onChange={(e) => setHead({ ...head, dueDate: e.target.value })} /></Field>
        </div>
        <LineItems lines={lines} setLines={setLines} products={normProducts} />
        <TotalsBar items={[["Subtotal", fmt(t.sub)], ["VAT (20%)", fmt(t.vat)], ["Grand total", fmt(t.grand)]]} />
      </Modal>

      {/* View modal */}
      <Modal open={!!viewing} title={viewing ? `Invoice ${viewing.no}` : ""} wide onClose={() => setViewing(null)}
        footer={<><Button onClick={() => { if (viewing) printInvoice("", viewing); }}><Printer size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />Print</Button><Button variant="ghost" onClick={() => setViewing(null)}>Close</Button></>}>
        {viewing && (
          <>
            <KeyValue cols={3} items={[["Invoice No", viewing.no], ["Date", new Date(viewing.date).toLocaleDateString("en-GB")], ["Due Date", new Date(viewing.dueDate).toLocaleDateString("en-GB")], ["Customer", viewing.customerName], ["Sale Person", viewing.salePersonName ?? "—"], ["Status", viewing.status]]} />
            <div style={{ marginTop: 16, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fs-sm)" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>{["SKU", "Product", "Qty", "Rate", "Disc%", "VAT%", "Total"].map((h) => <th key={h} style={{ padding: "6px 8px", textAlign: h === "SKU" || h === "Product" ? "left" : "right", color: "var(--text-subtle)", fontWeight: 600, fontSize: "var(--fs-xs)", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
                <tbody>{viewing.lines.map((l, i) => <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}><td style={{ padding: "6px 8px" }}>{l.sku}</td><td style={{ padding: "6px 8px" }}>{l.name}</td><td style={{ padding: "6px 8px", textAlign: "right" }}>{l.qty}</td><td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(l.rate)}</td><td style={{ padding: "6px 8px", textAlign: "right" }}>{l.discount}%</td><td style={{ padding: "6px 8px", textAlign: "right" }}>{l.vatRate}%</td><td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(l.lineTotal)}</td></tr>)}</tbody>
              </table>
            </div>
            <TotalsBar items={[["Subtotal", fmt(viewing.subtotal)], ["VAT", fmt(viewing.vatTotal)], ["Grand total", fmt(viewing.grandTotal)], ["Paid", fmt(viewing.paidTotal)], ["Outstanding", fmt(viewing.grandTotal - viewing.paidTotal)]]} />
          </>
        )}
      </Modal>

      {/* Update status modal */}
      <Modal open={!!statusModal} title={statusModal ? `Update Status — ${statusModal.no}` : ""} onClose={() => setStatusModal(null)}
        footer={<><Button onClick={() => { if (statusModal) statusMutation.mutate({ id: statusModal.id, status: newStatus }); }} disabled={statusMutation.isPending || newStatus === statusModal?.status}>{statusMutation.isPending ? "Saving…" : "Save"}</Button><Button variant="ghost" onClick={() => setStatusModal(null)}>Cancel</Button></>}>
        <Field label="Status">
          <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {["Draft", "Paid", "Partial", "Overdue"].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      </Modal>

      {/* Delete modal */}
      <Modal open={!!confirmDelete} title="Delete Invoice" onClose={() => setConfirmDelete(null)}
        footer={<><Button onClick={handleDelete} disabled={deleting} style={{ background: "var(--danger)", borderColor: "var(--danger)" }}>{deleting ? "Deleting…" : "Yes, delete"}</Button><Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button></>}>
        <p style={{ margin: 0, color: "var(--text)" }}>Are you sure you want to delete invoice <strong>{confirmDelete?.no}</strong>? This will reverse all stock and ledger entries. This cannot be undone.</p>
      </Modal>
    </>
  );
}
