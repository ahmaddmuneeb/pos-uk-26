"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Modal } from "@/components/feedback/Modal";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Field } from "@/components/forms/Field";
import { Textarea } from "@/components/forms/Textarea";
import { Toolbar, SubHead, KeyValue, ExportActions } from "@/components/ui/ScreenHelpers";
import { fmt } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";

interface CustType { id: string; name: string }

interface Customer {
  id: string;
  code: string;
  name: string;
  contact: string | null;
  typeId: string;
  typeName: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  vat: string | null;
  city: string | null;
  postcode: string | null;
  address: string | null;
  active: boolean;
}

interface LedgerRow {
  id: string;
  date: string;
  docType: string;
  docNo: string;
  narration: string | null;
  debit: number;
  credit: number;
  balance: number;
}

const emptyForm = {
  name: "", contact: "", typeId: "", phone: "", whatsapp: "",
  email: "", vat: "", city: "", postcode: "", address: "",
};

export default function CustomersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const { data: custTypes = [] } = useQuery<CustType[]>({
    queryKey: ["custtypes"],
    queryFn: () => fetchArray("/api/custtypes"),
  });

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["customers", search],
    queryFn: () =>
      fetchArray(`/api/customers${search ? `?q=${encodeURIComponent(search)}` : ""}`),
  });

  const { data: ledger = [] } = useQuery<LedgerRow[]>({
    queryKey: ["ledger", selected?.id],
    queryFn: () => fetchArray(`/api/ledger?customerId=${selected!.id}`),
    enabled: !!selected,
  });

  const addMutation = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          contact: data.contact || undefined,
          typeId: data.typeId,
          phone: data.phone || undefined,
          whatsapp: data.whatsapp || undefined,
          email: data.email || undefined,
          vat: data.vat || undefined,
          city: data.city || undefined,
          postcode: data.postcode || undefined,
          address: data.address || undefined,
        }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setShowAdd(false);
      setForm({ ...emptyForm });
    },
  });

  const filteredCustomers = typeFilter
    ? customers.filter((c) => c.typeId === typeFilter)
    : customers;

  const balance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;

  const columns: Column<Customer>[] = [
    { key: "code", header: "Code", width: 100 },
    {
      key: "name",
      header: "Name",
      render: (r) => (
        <span
          style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}
          onClick={() => setSelected(r)}
        >
          {r.name}
        </span>
      ),
    },
    { key: "typeName", header: "Type" },
    { key: "phone", header: "Phone", render: (r) => r.phone ?? "—" },
    {
      key: "active",
      header: "Status",
      render: (r) => (
        <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      width: 40,
      render: (r) => (
        <span className="no-print"><IconButton label="Edit" size="sm" onClick={() => setSelected(r)}>✎</IconButton></span>
      ),
    },
  ];

  const ledgerColumns: Column<LedgerRow>[] = [
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "docType", header: "Type" },
    { key: "docNo", header: "Doc No" },
    { key: "narration", header: "Narration", render: (r) => r.narration ?? "—" },
    { key: "debit", header: "Debit", align: "right", render: (r) => r.debit > 0 ? fmt(r.debit) : "—" },
    { key: "credit", header: "Credit", align: "right", render: (r) => r.credit > 0 ? fmt(r.credit) : "—" },
    {
      key: "balance",
      header: "Balance",
      align: "right",
      render: (r) => (
        <span style={{ color: r.balance >= 0 ? "var(--danger)" : "var(--success)", fontWeight: 600 }}>
          {fmt(Math.abs(r.balance))}{r.balance < 0 ? " CR" : ""}
        </span>
      ),
    },
  ];

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required"); return; }
    if (!form.typeId) { setFormError("Customer type is required"); return; }
    setFormError("");
    setSaving(true);
    try {
      await addMutation.mutateAsync(form);
    } catch (e: unknown) {
      setFormError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <Card
        title={selected ? undefined : "Customers"}
        actions={
          selected ? (
            <>
              <ExportActions columns={ledgerColumns} rows={ledger} filename={`ledger-${selected.code}`} />
              <Button variant="ghost" onClick={() => setSelected(null)}>← Back to list</Button>
            </>
          ) : (
            <>
              <ExportActions columns={columns} rows={filteredCustomers} filename="customers" />
              <Button onClick={() => setShowAdd(true)}>Add Customer</Button>
            </>
          )
        }
      >
        {selected ? (
          <>
            <SubHead>{selected.name} ({selected.code})</SubHead>
            <KeyValue
              cols={3}
              items={[
                ["Type", selected.typeName],
                ["Contact", selected.contact ?? "—"],
                ["Phone", selected.phone ?? "—"],
                ["WhatsApp", selected.whatsapp ?? "—"],
                ["Email", selected.email ?? "—"],
                ["VAT No.", selected.vat ?? "—"],
                ["City", selected.city ?? "—"],
                ["Postcode", selected.postcode ?? "—"],
                ["Address", selected.address ?? "—"],
                ["Status", <Badge key="s" tone={selected.active ? "success" : "neutral"}>{selected.active ? "Active" : "Inactive"}</Badge>],
                ["Balance", <span key="b" style={{ color: "var(--danger)", fontWeight: 700 }}>{fmt(balance)}</span>],
              ]}
            />
            <div style={{ marginTop: "1.5rem" }}>
              <SubHead>Ledger</SubHead>
              <DataTable
                columns={ledgerColumns}
                rows={ledger}
                rowKey={(r) => r.id}
                empty="No ledger entries"
              />
            </div>
          </>
        ) : (
          <>
            <Toolbar>
              <Input
                placeholder="Search name, code, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 240 }}
              />
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ width: 180 }}
              >
                <option value="">All Types</option>
                {custTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </Select>
            </Toolbar>
            {isLoading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
            ) : (
              <DataTable
                columns={columns}
                rows={filteredCustomers}
                rowKey={(r) => r.id}
                empty="No customers found"
              />
            )}
          </>
        )}
      </Card>

      <Modal
        open={showAdd}
        title="Add Customer"
        wide
        onClose={() => { setShowAdd(false); setForm({ ...emptyForm }); setFormError(""); }}
        footer={
          <>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            <Button variant="ghost" onClick={() => { setShowAdd(false); setForm({ ...emptyForm }); setFormError(""); }}>Cancel</Button>
          </>
        }
      >
        {formError && (
          <div style={{ color: "var(--danger)", marginBottom: "0.75rem", fontSize: "var(--fs-sm)" }}>{formError}</div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Name *" style={{ gridColumn: "1 / -1" }}>
            <Input value={form.name} onChange={set("name")} placeholder="Full company or customer name" />
          </Field>
          <Field label="Contact Person">
            <Input value={form.contact} onChange={set("contact")} placeholder="Contact name" />
          </Field>
          <Field label="Customer Type *">
            <Select value={form.typeId} onChange={set("typeId")}>
              <option value="">— Select type —</option>
              {custTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={set("phone")} placeholder="+44 7700 000000" />
          </Field>
          <Field label="WhatsApp">
            <Input value={form.whatsapp} onChange={set("whatsapp")} placeholder="+44 7700 000000" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" />
          </Field>
          <Field label="VAT Number">
            <Input value={form.vat} onChange={set("vat")} placeholder="GB 123456789" />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={set("city")} placeholder="London" />
          </Field>
          <Field label="Postcode">
            <Input value={form.postcode} onChange={set("postcode")} placeholder="SW1A 1AA" />
          </Field>
          <Field label="Address" style={{ gridColumn: "1 / -1" }}>
            <Textarea value={form.address} onChange={set("address")} placeholder="Full delivery / billing address" rows={3} />
          </Field>
        </div>
      </Modal>
    </>
  );
}
