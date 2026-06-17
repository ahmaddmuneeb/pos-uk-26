"use client";
import React from "react";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Field } from "@/components/forms/Field";
import { Modal } from "@/components/feedback/Modal";
import { exportCsv } from "@/lib/csv";

export function ExportActions<T>({ columns, rows, filename, style }: { columns: Column<T>[]; rows: T[]; filename: string; style?: React.CSSProperties }) {
  return (
    <span className="no-print" style={{ display: "inline-flex", gap: "0.5rem", ...style }}>
      <Button variant="ghost" size="sm" onClick={() => exportCsv(filename, columns, rows)}>Export CSV</Button>
      <Button variant="ghost" size="sm" onClick={() => window.print()}>Print</Button>
    </span>
  );
}

export function Toolbar({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="no-print" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "0.75rem", margin: "0 0 1rem", ...style }}>{children}</div>;
}

export function SubHead({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h3 style={{ margin: "0 0 0.6rem", fontSize: "var(--fs-base)", fontWeight: 700, color: "var(--text)", ...style }}>{children}</h3>;
}

export function KeyValue({ items, cols = 3, style }: { items: [string, React.ReactNode][]; cols?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "0.9rem 1.5rem", ...style }}>
      {items.map(([k, v]) => (
        <div key={k}>
          <div style={{ fontSize: "var(--fs-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600, marginBottom: 3 }}>{k}</div>
          <div style={{ fontSize: "var(--fs-base)", color: "var(--text)", fontWeight: 500 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function TotalsBar({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "2rem", padding: "0.9rem 1rem", marginTop: "0.75rem", background: "rgba(34,211,238,0.05)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
      {items.map(([k, v], i) => (
        <div key={k} style={{ textAlign: "right" }}>
          <div style={{ fontSize: "var(--fs-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600 }}>{k}</div>
          <div style={{ fontSize: i === items.length - 1 ? "var(--fs-lg)" : "var(--fs-md)", fontWeight: 700, color: i === items.length - 1 ? "var(--accent)" : "var(--text)", marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function DateField({ label, value, onChange }: { label: string; value: string; onChange?: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text-muted)" }}>
      {label}
      <Input type="date" value={value} onChange={(e) => onChange?.(e.target.value)} style={{ width: "auto" }} />
    </label>
  );
}

export function ReportShell({ title, subtitle, children, onExport }: { title: string; subtitle?: string; children: React.ReactNode; onExport?: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = today.slice(0, 8) + "01";
  const [from, setFrom] = React.useState(monthStart);
  const [to, setTo] = React.useState(today);

  return (
    <Card title={title} subtitle={subtitle} actions={<Button variant="ghost" onClick={onExport}>Export CSV</Button>}>
      <Toolbar>
        <DateField label="From" value={from} onChange={setFrom} />
        <DateField label="To" value={to} onChange={setTo} />
        <Button variant="ghost">Apply</Button>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" onClick={() => window.print()}>Print</Button>
      </Toolbar>
      {children}
    </Card>
  );
}

export interface FormField {
  key: string;
  label: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  options?: string[];
  type?: string;
  default?: string;
}

interface ListScreenProps<T extends Record<string, unknown>> {
  title: string;
  addLabel: string;
  columns: Column<T>[];
  rows: T[];
  formFields: FormField[];
  onAdd: (form: Record<string, string>) => Promise<void> | void;
  toolbar?: React.ReactNode;
  loading?: boolean;
}

export function ListScreen<T extends Record<string, unknown>>({ title, addLabel, columns, rows, formFields, onAdd, toolbar, loading }: ListScreenProps<T>) {
  const [show, setShow] = React.useState(false);
  const [form, setForm] = React.useState<Record<string, string>>(() => Object.fromEntries(formFields.map((f) => [f.key, f.default || ""])));
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    const required = formFields.find((f) => f.required && !String(form[f.key]).trim());
    if (required) return;
    setSaving(true);
    try { await onAdd(form); setForm(Object.fromEntries(formFields.map((f) => [f.key, f.default || ""]))); setShow(false); }
    finally { setSaving(false); }
  };

  const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <Card title={title} actions={<><ExportActions columns={columns} rows={rows} filename={filename} /><Button onClick={() => setShow(true)}>{addLabel}</Button></>}>
      {toolbar && <Toolbar>{toolbar}</Toolbar>}
      {loading ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div> : <DataTable columns={columns} rows={rows} rowKey={(r, i) => (r.id as string) || i} />}
      <Modal open={show} title={addLabel} onClose={() => setShow(false)}
        footer={<><Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {formFields.map((f) => (
            <Field key={f.key} label={f.label} style={{ gridColumn: f.full ? "1 / -1" : undefined }}>
              {f.options
                ? <Select value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>{f.options.map((o) => <option key={o}>{o}</option>)}</Select>
                : <Input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} />}
            </Field>
          ))}
        </div>
      </Modal>
    </Card>
  );
}
