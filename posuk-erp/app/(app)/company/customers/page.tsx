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
import { Eye, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/components/feedback/Toast";

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
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

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

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      name: c.name,
      contact: c.contact ?? "",
      typeId: c.typeId,
      phone: c.phone ?? "",
      whatsapp: c.whatsapp ?? "",
      email: c.email ?? "",
      vat: c.vat ?? "",
      city: c.city ?? "",
      postcode: c.postcode ?? "",
      address: c.address ?? "",
    });
    ;
  };

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof emptyForm }) =>
      fetch(`/api/customers/${id}`, {
        method: "PATCH",
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
      setEditing(null);
      setForm({ ...emptyForm });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/customers/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setConfirmDelete(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: (_data, { active }) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success(active ? "Customer activated." : "Customer deactivated.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success(`${confirmDelete.name} deleted.`);
    } catch (e: unknown) {
      toast.error((e as Error).message);
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeactivate = async (c: Customer) => {
    await toggleActiveMutation.mutateAsync({ id: c.id, active: false });
    setConfirmDelete(null);
  };

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
      header: "Actions",
      width: 130,
      align: "right",
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: "0.25rem" }}>
          <IconButton label="View" size="sm" onClick={(e) => { (e as React.MouseEvent).stopPropagation(); setViewing(r); }}><Eye size={14} color="#38bdf8" /></IconButton>
          <IconButton label="Edit" size="sm" onClick={(e) => { (e as React.MouseEvent).stopPropagation(); openEdit(r); }}><Pencil size={14} color="#4ade80" /></IconButton>
          <IconButton
            label={r.active ? "Deactivate" : "Activate"}
            size="sm"
            onClick={(e) => { (e as React.MouseEvent).stopPropagation(); toggleActiveMutation.mutate({ id: r.id, active: !r.active }); }}
          >
            {r.active
              ? <ToggleRight size={14} color="#facc15" />
              : <ToggleLeft size={14} color="#facc15" />}
          </IconButton>
          <IconButton label="Delete" size="sm" onClick={(e) => { (e as React.MouseEvent).stopPropagation(); setConfirmDelete(r); }}><Trash2 size={14} color="#f87171" /></IconButton>
        </span>
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
    if (!form.name.trim()) { toast.error("Name is required."); return; }
    if (!form.typeId) { toast.error("Customer type is required."); return; }
    setSaving(true);
    try {
      if (editing) {
        await editMutation.mutateAsync({ id: editing.id, data: form });
        toast.success("Customer updated.");
      } else {
        await addMutation.mutateAsync(form);
        toast.success("Customer created.");
      }
    } catch (e: unknown) {
      toast.error((e as Error).message);
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

      {/* Quick-view modal */}
      <Modal
        open={!!viewing}
        title={`${viewing?.name ?? ""} (${viewing?.code ?? ""})`}
        wide
        onClose={() => setViewing(null)}
        footer={<Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && (
          <KeyValue cols={3} items={[
            ["Type", viewing.typeName],
            ["Contact", viewing.contact ?? "—"],
            ["Phone", viewing.phone ?? "—"],
            ["WhatsApp", viewing.whatsapp ?? "—"],
            ["Email", viewing.email ?? "—"],
            ["VAT No.", viewing.vat ?? "—"],
            ["City", viewing.city ?? "—"],
            ["Postcode", viewing.postcode ?? "—"],
            ["Address", viewing.address ?? "—"],
            ["Status", <Badge key="s" tone={viewing.active ? "success" : "neutral"}>{viewing.active ? "Active" : "Inactive"}</Badge>],
          ]} />
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        title="Delete Customer"
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
          Are you sure you want to permanently delete <strong>{confirmDelete?.name}</strong>? This cannot be undone.
        </p>
      </Modal>

      {/* Add / Edit modal */}
      <Modal
        open={showAdd || !!editing}
        title={editing ? `Edit Customer — ${editing.code}` : "Add Customer"}
        wide
        onClose={() => { setShowAdd(false); setEditing(null); setForm({ ...emptyForm }); ; }}
        footer={
          <>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            <Button variant="ghost" onClick={() => { setShowAdd(false); setEditing(null); setForm({ ...emptyForm }); ; }}>Cancel</Button>
          </>
        }
      >
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
