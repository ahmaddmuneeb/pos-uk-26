"use client";
import React from "react";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { IconButton } from "@/components/core/IconButton";
import { Button } from "@/components/core/Button";

export interface DocLine {
  productId: string;
  qty: string;
  rate: string;
  disc: string;
  vat: string;
}

interface Product { id: string; sku: string; name: string; wholesaleRate: number }

interface LineItemsProps {
  lines: DocLine[];
  setLines: React.Dispatch<React.SetStateAction<DocLine[]>>;
  products: Product[];
  showDisc?: boolean;
}

export function LineItems({ lines, setLines, products, showDisc = true }: LineItemsProps) {
  const setLine = (i: number, patch: Partial<DocLine>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const cols = showDisc ? "1fr 4.5rem 5rem 4.5rem 4.5rem 6rem 2rem" : "1fr 4.5rem 5rem 4.5rem 6rem 2rem";
  const head = showDisc ? ["Product", "Qty", "Rate", "Disc %", "VAT %", "Line total", ""] : ["Product", "Qty", "Rate", "VAT %", "Line total", ""];
  const lineTotal = (l: DocLine) => (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) * (1 - (showDisc ? (parseFloat(l.disc) || 0) / 100 : 0)) * (1 + (parseFloat(l.vat) || 0) / 100);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, fontSize: "var(--fs-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600, marginBottom: 8 }}>
        {head.map((h, i) => <span key={i} style={{ textAlign: i >= head.length - 2 ? "right" : "left" }}>{h}</span>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: cols, gap: 8, alignItems: "center" }}>
            <Select value={l.productId} onChange={(e) => { const p = products.find((x) => x.id === e.target.value); setLine(i, { productId: e.target.value, rate: p ? String(p.wholesaleRate) : l.rate }); }}>
              <option value="">Pick product…</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
            </Select>
            <Input value={l.qty} onChange={(e) => setLine(i, { qty: e.target.value })} />
            <Input value={l.rate} onChange={(e) => setLine(i, { rate: e.target.value })} />
            {showDisc && <Input value={l.disc} onChange={(e) => setLine(i, { disc: e.target.value })} />}
            <Input value={l.vat} onChange={(e) => setLine(i, { vat: e.target.value })} />
            <div style={{ textAlign: "right", fontWeight: 600, color: "var(--text)", fontSize: "var(--fs-base)" }}>£{lineTotal(l).toFixed(2)}</div>
            <IconButton label="Remove line" size="sm" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}>✕</IconButton>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" style={{ marginTop: 10 }} onClick={() => setLines((ls) => [...ls, { productId: "", qty: "1", rate: "0", disc: "0", vat: "20" }])}>+ Add line</Button>
    </div>
  );
}

export function docTotals(lines: DocLine[], showDisc: boolean) {
  let sub = 0, vat = 0;
  lines.forEach((l) => {
    const base = (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) * (1 - (showDisc ? (parseFloat(l.disc) || 0) / 100 : 0));
    sub += base; vat += base * ((parseFloat(l.vat) || 0) / 100);
  });
  return { sub, vat, grand: sub + vat };
}
