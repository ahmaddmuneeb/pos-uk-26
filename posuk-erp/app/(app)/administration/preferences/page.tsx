"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { Button } from "@/components/core/Button";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { SubHead } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

const DEFAULTS: Record<string, string> = {
  company_name: "POS UK Wholesale Ltd",
  company_vat: "GB 432 8891 02",
  company_address: "14 Bull Street, Birmingham, B4 6AF",
  default_vat_rate: "20",
  currency: "GBP",
  prefix_inv: "INV-",
  next_inv: "1",
  prefix_so: "SO-",
  next_so: "1",
  prefix_rcp: "RCP-",
  next_rcp: "1",
  prefix_sr: "SR-",
  next_sr: "1",
  payment_terms: "14 days",
  invoice_footer: "Thank you for your business. Goods remain the property of POS UK Wholesale Ltd until paid in full.",
};

export default function PreferencesPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["preferences"], queryFn: () => fetchArray("/api/preferences") });
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    if ((data as { key: string; value: string }[]).length) {
      const m: Record<string, string> = { ...DEFAULTS };
      (data as { key: string; value: string }[]).forEach((p) => { m[p.key] = p.value; });
      setForm(m);
    }
  }, [data]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = useMutation({
    mutationFn: () => fetch("/api/preferences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preferences"] }),
  });

  return (
    <Card title="Preferences" subtitle="Company-wide defaults applied to documents, tax and numbering." actions={<Button onClick={() => save.mutate()} disabled={save.isPending}>Save changes</Button>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem", maxWidth: "52rem" }}>
        <div>
          <SubHead>Company</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Legal name"><Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} /></Field>
            <Field label="VAT registration"><Input value={form.company_vat} onChange={(e) => set("company_vat", e.target.value)} /></Field>
            <Field label="Registered address"><Textarea rows={2} value={form.company_address} onChange={(e) => set("company_address", e.target.value)} /></Field>
          </div>
        </div>
        <div>
          <SubHead>Tax &amp; currency</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Default VAT rate (%)"><Input value={form.default_vat_rate} onChange={(e) => set("default_vat_rate", e.target.value)} /></Field>
            <Field label="Currency"><Select value={form.currency} onChange={(e) => set("currency", e.target.value)}><option value="GBP">GBP (£)</option></Select></Field>
          </div>
        </div>
        <div>
          <SubHead>Document numbering</SubHead>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Invoice prefix"><Input value={form.prefix_inv} onChange={(e) => set("prefix_inv", e.target.value)} /></Field>
            <Field label="Next invoice no"><Input type="number" value={form.next_inv} onChange={(e) => set("next_inv", e.target.value)} /></Field>
            <Field label="Order prefix"><Input value={form.prefix_so} onChange={(e) => set("prefix_so", e.target.value)} /></Field>
            <Field label="Next order no"><Input type="number" value={form.next_so} onChange={(e) => set("next_so", e.target.value)} /></Field>
            <Field label="Receipt prefix"><Input value={form.prefix_rcp} onChange={(e) => set("prefix_rcp", e.target.value)} /></Field>
            <Field label="Next receipt no"><Input type="number" value={form.next_rcp} onChange={(e) => set("next_rcp", e.target.value)} /></Field>
            <Field label="Return prefix"><Input value={form.prefix_sr} onChange={(e) => set("prefix_sr", e.target.value)} /></Field>
            <Field label="Next return no"><Input type="number" value={form.next_sr} onChange={(e) => set("next_sr", e.target.value)} /></Field>
          </div>
        </div>
        <div>
          <SubHead>Defaults</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Default payment terms">
              <Select value={form.payment_terms} onChange={(e) => set("payment_terms", e.target.value)}>
                <option>Due on receipt</option><option>7 days</option><option>14 days</option><option>30 days</option>
              </Select>
            </Field>
            <Field label="Invoice footer note"><Textarea rows={3} value={form.invoice_footer} onChange={(e) => set("invoice_footer", e.target.value)} /></Field>
          </div>
        </div>
      </div>
    </Card>
  );
}
