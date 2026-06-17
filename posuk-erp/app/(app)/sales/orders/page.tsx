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
import { TotalsBar, ExportActions } from "@/components/ui/ScreenHelpers";
import { LineItems, docTotals, DocLine } from "@/components/ui/LineItems";
import { fmt } from "@/lib/currency";
import { getCompanyInfo, orderDoc, openPrintWindow, OrderPrintData } from "@/lib/printDoc";
import { fetchArray } from "@/lib/fetchJson";
import { toast } from "sonner";
import { Eye, Printer, Trash2 } from "lucide-react";

interface Customer { id: string; name: string }
interface SalePerson { id: string; name: string }
interface Product { id: string; sku: string; name: string; wholesaleRate: string | number }

const blankLine: DocLine = { productId: "", qty: "1", rate: "0", disc: "0", vat: "20" };

export default function OrdersPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["orders"], queryFn: () => fetchArray<Record<string, unknown>>("/api/orders") });
  const { data: customers = [] } = useQuery<Customer[]>({ queryKey: ["customers"], queryFn: () => fetchArray("/api/customers") });
  const { data: salePersons = [] } = useQuery<SalePerson[]>({ queryKey: ["salepersons"], queryFn: () => fetchArray("/api/salepersons") });
  const { data: products = [] } = useQuery<Product[]>({ queryKey: ["products"], queryFn: () => fetchArray("/api/products") });
  const { data: preferences = [] } = useQuery<{ key: string; value: string }[]>({ queryKey: ["preferences"], queryFn: () => fetchArray("/api/preferences") });

  const [show, setShow] = useState(false);
  const [head, setHead] = useState({ customerId: "", salePersonId: "", date: new Date().toISOString().slice(0, 10) });
  const [lines, setLines] = useState<DocLine[]>([blankLine]);
  const [error, setError] = useState("");

  const [viewing, setViewing] = useState<OrderPrintData | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; no: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const t = docTotals(lines, true);
  const normProducts = products.map((p) => ({ id: p.id, sku: p.sku, name: p.name, wholesaleRate: typeof p.wholesaleRate === "string" ? parseFloat(p.wholesaleRate) : p.wholesaleRate }));

  const reset = () => { setHead({ customerId: "", salePersonId: "", date: new Date().toISOString().slice(0, 10) }); setLines([blankLine]); };

  const save = useMutation({
    mutationFn: () => fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: head.customerId, salePersonId: head.salePersonId || undefined, date: head.date,
        lines: lines.filter((l) => l.productId).map((l) => ({ productId: l.productId, qty: parseInt(l.qty) || 0, rate: parseFloat(l.rate) || 0, discount: parseFloat(l.disc) || 0, vatRate: parseFloat(l.vat) || 0 })),
      }),
    }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed to save"); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); setShow(false); reset(); toast.success("Order saved."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/orders/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Failed to delete");
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); setConfirmDelete(null); },
  });

  const loadOrder = async (id: string): Promise<OrderPrintData | null> => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load order");
      return await res.json();
    } catch (e: unknown) {
      toast.error((e as Error).message);
      return null;
    } finally {
      setLoadingId(null);
    }
  };

  const openView = async (id: string) => {
    const ord = await loadOrder(id);
    if (ord) setViewing(ord);
  };

  const printOrder = async (id: string, ord?: OrderPrintData) => {
    const data = ord ?? await loadOrder(id);
    if (data) openPrintWindow(`Order ${data.no}`, orderDoc(getCompanyInfo(preferences), data));
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success(`Order ${confirmDelete.no} deleted.`);
    } catch (e: unknown) {
      toast.error((e as Error).message);
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const valid = head.customerId && lines.some((l) => l.productId);

  const columns: Column<any>[] = [
    { key: "no", header: "Order No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date as string).toLocaleDateString("en-GB") },
    { key: "customerName", header: "Customer" },
    { key: "salePersonName", header: "Sale person", render: (r) => (r.salePersonName as string) || "—" },
    { key: "grandTotal", header: "Total", align: "right", render: (r) => fmt(r.grandTotal as number) },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Invoiced" ? "success" : "info"}>{r.status as string}</Badge> },
    {
      key: "act", header: "Actions", align: "right", width: 100,
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}>
          <IconButton label="View" size="sm" disabled={loadingId === r.id} onClick={() => openView(r.id as string)}><Eye size={14} color="#38bdf8" /></IconButton>
          <IconButton label="Print" size="sm" disabled={loadingId === r.id} onClick={() => printOrder(r.id as string)}><Printer size={14} color="#a78bfa" /></IconButton>
          <IconButton label="Delete" size="sm" onClick={() => setConfirmDelete({ id: r.id as string, no: r.no as string })}><Trash2 size={14} color="#f87171" /></IconButton>
        </span>
      ),
    },
  ];

  return (
    <>
      <Card title="Sale Orders" actions={<><ExportActions columns={columns} rows={rows} filename="sale-orders" /><Button onClick={() => setShow(true)}>New order</Button></>}>
        {isLoading ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div> : (
          <DataTable rowKey={(r) => r.id as string} columns={columns} rows={rows} />
        )}
      </Card>

      {/* New order modal */}
      <Modal open={show} wide title="New sale order" onClose={() => { setShow(false); reset(); }}
        footer={<><Button onClick={() => save.mutate()} disabled={!valid || save.isPending}>{save.isPending ? "Saving…" : "Save order"}</Button><Button variant="ghost" onClick={() => { setShow(false); reset(); }}>Cancel</Button></>}>
        {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-sm)", margin: "0 0 12px" }}>{error}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
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
          <Field label="Order date"><Input type="date" value={head.date} onChange={(e) => setHead({ ...head, date: e.target.value })} /></Field>
        </div>
        <LineItems lines={lines} setLines={setLines} products={normProducts} />
        <TotalsBar items={[["Subtotal", fmt(t.sub)], ["VAT", fmt(t.vat)], ["Grand total", fmt(t.grand)]]} />
      </Modal>

      {/* View modal */}
      <Modal
        open={!!viewing}
        title={viewing ? `Order ${viewing.no}` : ""}
        wide
        onClose={() => setViewing(null)}
        footer={
          <>
            <Button onClick={() => { if (viewing) printOrder("", viewing); }}>
              <Printer size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />Print
            </Button>
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
          </>
        }
      >
        {viewing && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 24px", marginBottom: 16 }}>
              {[["Order No", viewing.no], ["Date", new Date(viewing.date).toLocaleDateString("en-GB")], ["Status", viewing.status], ["Customer", viewing.customerName], ["Sale Person", viewing.salePersonName ?? "—"]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: "var(--fs-xs)", fontWeight: 600, textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: "var(--fs-sm)" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ overflowX: "auto" }}>
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
            <TotalsBar items={[["Subtotal", fmt(viewing.subtotal)], ["VAT", fmt(viewing.vatTotal)], ["Grand total", fmt(viewing.grandTotal)]]} />
          </>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        title="Delete Order"
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
          Are you sure you want to delete order <strong>{confirmDelete?.no}</strong>? This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
