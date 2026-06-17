"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { Button } from "@/components/core/Button";
import { Modal } from "@/components/feedback/Modal";
import { Field } from "@/components/forms/Field";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { TotalsBar, ExportActions } from "@/components/ui/ScreenHelpers";
import { LineItems, docTotals, DocLine } from "@/components/ui/LineItems";
import { fmt } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";

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

  const [show, setShow] = useState(false);
  const [head, setHead] = useState({ customerId: "", salePersonId: "", date: new Date().toISOString().slice(0, 10) });
  const [lines, setLines] = useState<DocLine[]>([blankLine]);
  const [error, setError] = useState("");
  const t = docTotals(lines, true);

  const normProducts = (products as unknown as { id: string; sku: string; name: string; wholesaleRate: string | number }[]).map((p) => ({ id: p.id, sku: p.sku, name: p.name, wholesaleRate: typeof p.wholesaleRate === "string" ? parseFloat(p.wholesaleRate) : p.wholesaleRate }));

  const reset = () => { setHead({ customerId: "", salePersonId: "", date: new Date().toISOString().slice(0, 10) }); setLines([blankLine]); setError(""); };

  const save = useMutation({
    mutationFn: () => fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: head.customerId, salePersonId: head.salePersonId || undefined, date: head.date,
        lines: lines.filter((l) => l.productId).map((l) => ({ productId: l.productId, qty: parseInt(l.qty) || 0, rate: parseFloat(l.rate) || 0, discount: parseFloat(l.disc) || 0, vatRate: parseFloat(l.vat) || 0 })),
      }),
    }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed to save"); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); setShow(false); reset(); },
    onError: (e: Error) => setError(e.message),
  });

  const valid = head.customerId && lines.some((l) => l.productId);

  const columns: Column<any>[] = [
    { key: "no", header: "Order No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date as string).toLocaleDateString("en-GB") },
    { key: "customerName", header: "Customer" },
    { key: "salePersonName", header: "Sale person", render: (r) => (r.salePersonName as string) || "—" },
    { key: "grandTotal", header: "Total", align: "right", render: (r) => fmt(r.grandTotal as number) },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Invoiced" ? "success" : "info"}>{r.status as string}</Badge> },
  ];

  return (
    <Card title="Sale Orders" actions={<><ExportActions columns={columns} rows={rows} filename="sale-orders" /><Button onClick={() => setShow(true)}>New order</Button></>}>
      {isLoading ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div> : (
        <DataTable
          rowKey={(r) => r.id as string}
          columns={columns}
          rows={rows}
        />
      )}
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
    </Card>
  );
}
