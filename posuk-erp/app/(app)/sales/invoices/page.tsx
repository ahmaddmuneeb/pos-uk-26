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
import { Eye, Printer, Trash2 } from "lucide-react";

interface Customer { id: string; name: string }
interface SalePerson { id: string; name: string }
interface Location { id: string; name: string }
interface Order { id: string; no: string }

const blankLine: DocLine = { productId: "", qty: "1", rate: "0", disc: "0", vat: "20" };
const statusTone: Record<string, "success" | "warning" | "danger" | "info"> = { Paid: "success", Partial: "warning", Overdue: "danger", Draft: "info" };

export default function InvoicesPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["invoices"], queryFn: () => fetchArray("/api/invoices") });
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

  const t = docTotals(lines, true);
  const normProducts = products.map((p) => ({ id: p.id, sku: p.sku, name: p.name, wholesaleRate: typeof p.wholesaleRate === "string" ? parseFloat(p.wholesaleRate) : p.wholesaleRate }));
  const filtered = (rows as { status: string; no: string; customerName: string }[]).filter((r) =>
    (!statusFilter || r.status === statusFilter) && (!q || r.no.toLowerCase().includes(q.toLowerCase()) || r.customerName.toLowerCase().includes(q.toLowerCase()))
  );

  const reset = () => { setHead({ customerId: "", salePersonId: "", locationId: "", orderId: "", date: new Date().toISOString().slice(0, 10), dueDate: new Date().toISOString().slice(0, 10) }); setLines([blankLine]); setError(""); };

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
    mutationFn: (id: string) =>
      fetch(`/api/invoices/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Failed to delete");
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); setConfirmDelete(null); },
  });

  const loadInvoice = async (id: string): Promise<InvoicePrintData | null> => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load invoice");
      return await res.json();
    } catch (e: unknown) {
      toast.error((e as Error).message);
      return null;
    } finally {
      setLoadingId(null);
    }
  };

  const openView = async (id: string) => {
    const inv = await loadInvoice(id);
    if (inv) setViewing(inv);
  };

  const printInvoice = async (id: string, inv?: InvoicePrintData) => {
    const data = inv ?? await loadInvoice(id);
    if (data) openPrintWindow(`Invoice ${data.no}`, invoiceDoc(getCompanyInfo(preferences), data));
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success(`Invoice ${confirmDelete.no} deleted.`);
    } catch (e: unknown) {
      toast.error((e as Error).message);
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const valid = head.customerId && head.locationId && lines.some((l) => l.productId);

  const columns: Column<any>[] = [
    { key: "no", header: "Invoice No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date as string).toLocaleDateString("en-GB") },
    { key: "dueDate", header: "Due date", render: (r) => new Date(r.dueDate as string).toLocaleDateString("en-GB") },
    { key: "customerName", header: "Customer" },
    { key: "grandTotal", header: "Net total", align: "right", render: (r) => fmt(r.grandTotal as number) },
    { key: "paidTotal", header: "Paid", align: "right", render: (r) => fmt(r.paidTotal as number) },
    { key: "outstanding", header: "Outstanding", align: "right", render: (r) => fmt(r.outstanding as number) },
    { key: "status", header: "Status", render: (r) => <Badge tone={statusTone[r.status as string] || "neutral"}>{r.status as string}</Badge> },
    {
      key: "act", header: "Actions", align: "right", width: 100,
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}>
          <IconButton label="View" size="sm" disabled={loadingId === r.id} onClick={() => openView(r.id as string)}><Eye size={14} color="#38bdf8" /></IconButton>
          <IconButton label="Print" size="sm" disabled={loadingId === r.id} onClick={() => printInvoice(r.id as string)}><Printer size={14} color="#a78bfa" /></IconButton>
          <IconButton label="Delete" size="sm" onClick={() => setConfirmDelete({ id: r.id as string, no: r.no as string })}><Trash2 size={14} color="#f87171" /></IconButton>
        </span>
      ),
    },
  ];

  return (
    <>
      <Card title="Sale Invoices" actions={<><ExportActions columns={columns} rows={filtered} filename="sale-invoices" /><Button onClick={() => setShow(true)}>New invoice</Button><Button variant="ghost" onClick={() => qc.invalidateQueries({ queryKey: ["invoices"] })}>Refresh</Button></>}>
        <Toolbar>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: "auto" }}>
            <option value="">All statuses</option><option>Paid</option><option>Partial</option><option>Overdue</option><option>Draft</option>
          </Select>
          <Input placeholder="Search invoice or customer" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "auto", minWidth: "15rem" }} />
        </Toolbar>
        {isLoading ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div> : (
          <div style={{ overflowX: "auto" }}>
            <DataTable rowKey={(r: any) => r.id as string} columns={columns} rows={filtered} />
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
      <Modal
        open={!!viewing}
        title={viewing ? `Invoice ${viewing.no}` : ""}
        wide
        onClose={() => setViewing(null)}
        footer={
          <>
            <Button onClick={() => { if (viewing) printInvoice("", viewing); }}>
              <Printer size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />Print
            </Button>
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
          </>
        }
      >
        {viewing && (
          <>
            <KeyValue cols={3} items={[
              ["Invoice No", viewing.no],
              ["Date", new Date(viewing.date).toLocaleDateString("en-GB")],
              ["Due Date", new Date(viewing.dueDate).toLocaleDateString("en-GB")],
              ["Customer", viewing.customerName],
              ["Sale Person", viewing.salePersonName ?? "—"],
              ["Status", viewing.status],
            ]} />
            <div style={{ marginTop: 16, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fs-sm)" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    {["SKU", "Product", "Qty", "Rate", "Disc%", "VAT%", "Total"].map((h) => (
                      <th key={h} style={{ padding: "6px 8px", textAlign: h === "SKU" || h === "Product" ? "left" : "right", color: "var(--text-subtle)", fontWeight: 600, fontSize: "var(--fs-xs)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewing.lines.map((l, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "6px 8px" }}>{l.sku}</td>
                      <td style={{ padding: "6px 8px" }}>{l.name}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{l.qty}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(l.rate)}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{l.discount}%</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{l.vatRate}%</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(l.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TotalsBar items={[["Subtotal", fmt(viewing.subtotal)], ["VAT", fmt(viewing.vatTotal)], ["Grand total", fmt(viewing.grandTotal)], ["Paid", fmt(viewing.paidTotal)], ["Outstanding", fmt(viewing.grandTotal - viewing.paidTotal)]]} />
          </>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        title="Delete Invoice"
        onClose={() => setConfirmDelete(null)}
        footer={
          <>
            <Button onClick={handleDelete} disabled={deleting} style={{ background: "var(--danger)", borderColor: "var(--danger)" }}>
              {deleting ? "Deleting…" : "Yes, delete"}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          </>
        }
      >
        <p style={{ margin: 0, color: "var(--text)" }}>
          Are you sure you want to delete invoice <strong>{confirmDelete?.no}</strong>? This will reverse all stock and ledger entries. This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
