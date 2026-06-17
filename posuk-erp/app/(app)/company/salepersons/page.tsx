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
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { KeyValue, ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SalePerson {
  id: string;
  name: string;
  designation: string | null;
  region: string | null;
  commission: string | number;
  status: string;
}

const emptyForm = { name: "", designation: "", region: "", commission: "0", status: "Active" };

export default function SalePersonsPage() {
  const qc = useQueryClient();
  const [viewing, setViewing] = useState<SalePerson | null>(null);
  const [editing, setEditing] = useState<SalePerson | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<SalePerson | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: rows = [], isLoading } = useQuery<SalePerson[]>({
    queryKey: ["salepersons"],
    queryFn: () => fetchArray("/api/salepersons"),
  });

  const openEdit = (r: SalePerson) => {
    setEditing(r);
    setForm({
      name: r.name,
      designation: r.designation ?? "",
      region: r.region ?? "",
      commission: String(parseFloat(String(r.commission)).toFixed(2)),
      status: r.status,
    });
  };

  const addMutation = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      fetch("/api/salepersons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          designation: data.designation || undefined,
          region: data.region || undefined,
          commission: parseFloat(data.commission || "0"),
          status: data.status,
        }),
      }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["salepersons"] }); setShowAdd(false); setForm({ ...emptyForm }); },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof emptyForm }) =>
      fetch(`/api/salepersons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          designation: data.designation || undefined,
          region: data.region || undefined,
          commission: parseFloat(data.commission || "0"),
          status: data.status,
        }),
      }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["salepersons"] }); setEditing(null); setForm({ ...emptyForm }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/salepersons/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["salepersons"] }); setConfirmDelete(null); },
  });

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required."); return; }
    setSaving(true);
    try {
      if (editing) {
        await editMutation.mutateAsync({ id: editing.id, data: form });
        toast.success("Sale person updated.");
      } else {
        await addMutation.mutateAsync(form);
        toast.success("Sale person created.");
      }
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success(`"${confirmDelete.name}" deleted.`);
    } catch (e: unknown) {
      toast.error((e as Error).message);
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const columns: Column<SalePerson>[] = [
    { key: "name", header: "Name" },
    { key: "designation", header: "Designation", render: (r) => r.designation ?? "—" },
    { key: "region", header: "Region", render: (r) => r.region ?? "—" },
    { key: "commission", header: "Commission", align: "right", render: (r) => `${parseFloat(String(r.commission)).toFixed(2)}%` },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "success" : "neutral"}>{r.status}</Badge> },
    {
      key: "act", header: "Actions", align: "right",
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4 }}>
          <IconButton label="View" size="sm" onClick={() => setViewing(r)}><Eye size={14} color="#38bdf8" /></IconButton>
          <IconButton label="Edit" size="sm" onClick={() => openEdit(r)}><Pencil size={14} color="#4ade80" /></IconButton>
          <IconButton label="Delete" size="sm" onClick={() => setConfirmDelete(r)}><Trash2 size={14} color="#f87171" /></IconButton>
        </span>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Sale Persons"
        actions={<><ExportActions columns={columns} rows={rows} filename="salepersons" /><Button onClick={() => { setForm({ ...emptyForm }); setShowAdd(true); }}>Add Sale Person</Button></>}
      >
        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
        ) : (
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No sale persons found" />
        )}
      </Card>

      {/* Quick-view modal */}
      <Modal open={!!viewing} title={viewing?.name ?? ""} onClose={() => setViewing(null)}
        footer={<Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>}>
        {viewing && (
          <KeyValue cols={2} items={[
            ["Designation", viewing.designation ?? "—"],
            ["Region", viewing.region ?? "—"],
            ["Commission", `${parseFloat(String(viewing.commission)).toFixed(2)}%`],
            ["Status", <Badge key="s" tone={viewing.status === "Active" ? "success" : "neutral"}>{viewing.status}</Badge>],
          ]} />
        )}
      </Modal>

      {/* Add / Edit modal */}
      <Modal
        open={showAdd || !!editing}
        title={editing ? `Edit — ${editing.name}` : "Add Sale Person"}
        onClose={() => { setShowAdd(false); setEditing(null); setForm({ ...emptyForm }); }}
        footer={
          <>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            <Button variant="ghost" onClick={() => { setShowAdd(false); setEditing(null); setForm({ ...emptyForm }); }}>Cancel</Button>
          </>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Name *" style={{ gridColumn: "1 / -1" }}>
            <Input value={form.name} onChange={set("name")} placeholder="Full name" />
          </Field>
          <Field label="Designation">
            <Input value={form.designation} onChange={set("designation")} placeholder="e.g. Senior Rep" />
          </Field>
          <Field label="Region">
            <Input value={form.region} onChange={set("region")} placeholder="e.g. North West" />
          </Field>
          <Field label="Commission %">
            <Input type="number" min="0" step="0.01" value={form.commission} onChange={set("commission")} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={set("status")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        title="Delete Sale Person"
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
          Are you sure you want to delete <strong>{confirmDelete?.name}</strong>? This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
