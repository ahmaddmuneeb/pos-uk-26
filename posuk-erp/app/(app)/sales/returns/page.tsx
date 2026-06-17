"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Modal } from "@/components/feedback/Modal";
import { Field } from "@/components/forms/Field";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { TotalsBar, ExportActions } from "@/components/ui/ScreenHelpers";
import { LineItems, docTotals, DocLine } from "@/components/ui/LineItems";
import { fmt } from "@/lib/currency";
import { getCompanyInfo, returnDoc, openPrintWindow, ReturnPrintData } from "@/lib/printDoc";
import { fetchArray } from "@/lib/fetchJson";
import { toast } from "sonner";
import { Eye, Printer, Trash2 } from "lucide-react";

interface InvoiceOpt { id: string; no: string; customerName: string }

const blankLine: DocLine = { productId: "", qty: "1", rate: "0", disc: "0", vat: "20" };
const REASONS = ["Damaged goods", "Wrong item", "Customer cancelled", "Quality issue"];

type ReturnRow = {
  id: string;
  no: string;
  date: string;
  reason: string;
  invoiceId: string;
  invoiceNo: string;
  customerName: string;
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  lines: { sku: string; name: string; productName: string; qty: number; rate: number; vatRate: number; lineTotal: number }[];
};

export default function ReturnsPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery<ReturnRow[]>({ queryKey: ["returns"], queryFn: () => fetchArray("/api/returns") });
  const { data: invoices = [] } = useQuery<InvoiceOpt[]>({ queryKey: ["invoices"], queryFn: () => fetchArray("/api/invoices") });
  const { data: products = [] } = useQuery<{ id: string; sku: string; name: string; wholesaleRate: string | number }[]>({ queryKey: ["products"], queryFn: () => fetchArray("/api/products") });
  const { data: preferences = [] } = useQuery<{ key: string; value: string }[]>({ queryKey: ["preferences"], queryFn: () => fetchArray("/api/preferences") });

  const [show, setShow] = useState(false);
  const [head, setHead] = useState({ invoiceId: "", reason: REASONS[0], date: new Date().toISOString().slice(0, 10) });
  const [lines, setLines] = useState<DocLine[]>([blankLine]);
  const [error, setError] = useState("");

  const [viewing, setViewing] = useState<ReturnRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; no: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const t = docTotals(lines, false);
  const normProducts = products.map((p) => ({ id: p.id, sku: p.sku, name: p.name, wholesaleRate: typeof p.wholesaleRate === "string" ? parseFloat(p.wholesaleRate) : p.wholesaleRate }));

  const reset = () => { setHead({ invoiceId: "", reason: REASONS[0], date: new Date().toISOString().slice(0, 10) }); setLines([blankLine]); };

  const save = useMutation({
    mutationFn: () => fetch("/api/returns", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceId: head.invoiceId, reason: head.reason, date: head.date,
        lines: lines.filter((l) => l.productId).map((l) => ({ productId: l.productId, qty: parseInt(l.qty) || 0, rate: parseFloat(l.rate) || 0, vatRate: parseFloat(l.vat) || 0 })),
      }),
    }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed to save return"); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["returns"] }); setShow(false); reset(); toast.success("Return saved."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/returns/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Failed to delete");
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["returns"] }); setConfirmDelete(null); },
  });

  const printReturn = (row: ReturnRow) => {
    const data: ReturnPrintData = {
      no: row.no,
      date: row.date,
      invoiceNo: row.invoiceNo,
      customerName: row.customerName,
      reason: row.reason,
      subtotal: row.subtotal,
      vatTotal: row.vatTotal,
      grandTotal: row.grandTotal,
      lines: row.lines.map((l) => ({ sku: l.sku, name: l.productName ?? l.name, qty: l.qty, rate: l.rate, vatRate: l.vatRate, lineTotal: l.lineTotal })),
    };
    openPrintWindow(`Return ${row.no}`, returnDoc(getCompanyInfo(preferences), data));
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success(`Return ${confirmDelete.no} deleted.`);
    } catch (e: unknown) {
      toast.error((e as Error).message);
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const valid = head.invoiceId && lines.some((l) => l.productId);

  const columns: Column<ReturnRow>[] = [
    { key: "no", header: "Return No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "invoiceNo", header: "Against invoice" },
    { key: "customerName", header: "Customer" },
    { key: "subtotal", header: "Subtotal", align: "right", render: (r) => fmt(r.subtotal) },
    { key: "vatTotal", header: "VAT", align: "right", render: (r) => fmt(r.vatTotal) },
    { key: "grandTotal", header: "Total", align: "right", render: (r) => fmt(r.grandTotal) },
    {
      key: "act", header: "Actions", align: "right", width: 100,
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}>
          <IconButton label="View" size="sm" onClick={() => setViewing(r)}><Eye size={14} color="#38bdf8" /></IconButton>
          <IconButton label="Print" size="sm" onClick={() => printReturn(r)}><Printer size={14} color="#a78bfa" /></IconButton>
          <IconButton label="Delete" size="sm" onClick={() => setConfirmDelete({ id: r.id, no: r.no })}><Trash2 size={14} color="#f87171" /></IconButton>
        </span>
      ),
    },
  ];

  return (
    <>
      <Card title="Sale Returns" actions={<><ExportActions columns={columns} rows={rows} filename="sale-returns" /><Button onClick={() => setShow(true)}>New return</Button></>}>
        {isLoading ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div> : (
          <DataTable rowKey={(r) => r.id} columns={columns} rows={rows} />
        )}
      </Card>

      {/* New return modal */}
      <Modal open={show} wide title="New sale return" onClose={() => { setShow(false); reset(); }}
        footer={<><Button onClick={() => save.mutate()} disabled={!valid || save.isPending}>{save.isPending ? "Saving…" : "Save return"}</Button><Button variant="ghost" onClick={() => { setShow(false); reset(); }}>Cancel</Button></>}>
        {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-sm)", margin: "0 0 12px" }}>{error}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Field label="Against sale invoice">
            <Select value={head.invoiceId} onChange={(e) => setHead({ ...head, invoiceId: e.target.value })}>
              <option value="">Select invoice…</option>
              {invoices.map((i) => <option key={i.id} value={i.id}>{i.no} — {i.customerName}</option>)}
            </Select>
          </Field>
          <Field label="Reason">
            <Select value={head.reason} onChange={(e) => setHead({ ...head, reason: e.target.value })}>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Return date" style={{ maxWidth: 220, marginBottom: 14 }}><Input type="date" value={head.date} onChange={(e) => setHead({ ...head, date: e.target.value })} /></Field>
        <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-subtle)", margin: "0 0 12px" }}>Max return qty per product is enforced server-side against invoiced minus prior returns.</p>
        <LineItems lines={lines} setLines={setLines} products={normProducts} showDisc={false} />
        <TotalsBar items={[["Subtotal", fmt(t.sub)], ["VAT", fmt(t.vat)], ["Refund total", fmt(t.grand)]]} />
      </Modal>

      {/* View modal */}
      <Modal
        open={!!viewing}
        title={viewing ? `Return ${viewing.no}` : ""}
        wide
        onClose={() => setViewing(null)}
        footer={
          <>
            <Button onClick={() => { if (viewing) printReturn(viewing); }}>
              <Printer size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />Print
            </Button>
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
          </>
        }
      >
        {viewing && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 24px", marginBottom: 16 }}>
              {[["Return No", viewing.no], ["Date", new Date(viewing.date).toLocaleDateString("en-GB")], ["Against Invoice", viewing.invoiceNo], ["Customer", viewing.customerName], ["Reason", viewing.reason || "—"]].map(([k, v]) => (
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
                    {["SKU", "Product", "Qty", "Rate", "VAT%", "Total"].map((h) => (
                      <th key={h} style={{ padding: "6px 8px", textAlign: h === "SKU" || h === "Product" ? "left" : "right", color: "var(--text-subtle)", fontWeight: 600, fontSize: "var(--fs-xs)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewing.lines.map((l, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "6px 8px" }}>{l.sku}</td>
                      <td style={{ padding: "6px 8px" }}>{l.productName ?? l.name}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{l.qty}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(l.rate)}</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{l.vatRate}%</td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(l.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TotalsBar items={[["Subtotal", fmt(viewing.subtotal)], ["VAT", fmt(viewing.vatTotal)], ["Refund total", fmt(viewing.grandTotal)]]} />
          </>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        title="Delete Return"
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
          Are you sure you want to delete return <strong>{confirmDelete?.no}</strong>? This will reverse stock and ledger entries. This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
