"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Button } from "@/components/core/Button";
import { Modal } from "@/components/feedback/Modal";
import { Field } from "@/components/forms/Field";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { TotalsBar, ExportActions } from "@/components/ui/ScreenHelpers";
import { LineItems, docTotals, DocLine } from "@/components/ui/LineItems";
import { fmt } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";

interface InvoiceOpt { id: string; no: string; customerName: string }

const blankLine: DocLine = { productId: "", qty: "1", rate: "0", disc: "0", vat: "20" };
const REASONS = ["Damaged goods", "Wrong item", "Customer cancelled", "Quality issue"];

export default function ReturnsPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["returns"], queryFn: () => fetchArray<Record<string, unknown>>("/api/returns") });
  const { data: invoices = [] } = useQuery<InvoiceOpt[]>({ queryKey: ["invoices"], queryFn: () => fetchArray("/api/invoices") });
  const { data: products = [] } = useQuery<{ id: string; sku: string; name: string; wholesaleRate: string | number }[]>({ queryKey: ["products"], queryFn: () => fetchArray("/api/products") });

  const [show, setShow] = useState(false);
  const [head, setHead] = useState({ invoiceId: "", reason: REASONS[0], date: new Date().toISOString().slice(0, 10) });
  const [lines, setLines] = useState<DocLine[]>([blankLine]);
  const [error, setError] = useState("");
  const t = docTotals(lines, false);

  const normProducts = products.map((p) => ({ id: p.id, sku: p.sku, name: p.name, wholesaleRate: typeof p.wholesaleRate === "string" ? parseFloat(p.wholesaleRate) : p.wholesaleRate }));

  const reset = () => { setHead({ invoiceId: "", reason: REASONS[0], date: new Date().toISOString().slice(0, 10) }); setLines([blankLine]); setError(""); };

  const save = useMutation({
    mutationFn: () => fetch("/api/returns", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceId: head.invoiceId, reason: head.reason, date: head.date,
        lines: lines.filter((l) => l.productId).map((l) => ({ productId: l.productId, qty: parseInt(l.qty) || 0, rate: parseFloat(l.rate) || 0, vatRate: parseFloat(l.vat) || 0 })),
      }),
    }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed to save return"); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["returns"] }); setShow(false); reset(); },
    onError: (e: Error) => setError(e.message),
  });

  const valid = head.invoiceId && lines.some((l) => l.productId);

  const columns: Column<any>[] = [
    { key: "no", header: "Return No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date as string).toLocaleDateString("en-GB") },
    { key: "invoiceNo", header: "Against invoice" },
    { key: "customerName", header: "Customer" },
    { key: "subtotal", header: "Subtotal", align: "right", render: (r) => fmt(r.subtotal as number) },
    { key: "vatTotal", header: "VAT", align: "right", render: (r) => fmt(r.vatTotal as number) },
    { key: "grandTotal", header: "Total", align: "right", render: (r) => fmt(r.grandTotal as number) },
  ];

  return (
    <Card title="Sale Returns" actions={<><ExportActions columns={columns} rows={rows} filename="sale-returns" /><Button onClick={() => setShow(true)}>New return</Button></>}>
      {isLoading ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div> : (
        <DataTable
          rowKey={(r) => r.id as string}
          columns={columns}
          rows={rows}
        />
      )}
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
    </Card>
  );
}
