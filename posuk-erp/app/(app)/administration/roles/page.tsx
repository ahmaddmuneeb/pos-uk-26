"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Button } from "@/components/core/Button";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { fetchArray } from "@/lib/fetchJson";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Edit2, Trash2, Plus, X, Check } from "lucide-react";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

interface Role { id: string; name: string; userCount: number }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", background: "rgba(0,0,0,0.55)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: 700, color: "var(--text)" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", padding: 4, display: "grid", placeItems: "center" }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function RolesPage() {
  const qc = useQueryClient();
  const rights = useRights("User Rights");
  const { data: roles = [], isLoading } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: () => fetchArray("/api/roles"),
  });

  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [editName, setEditName] = useState("");

  const create = useMutation({
    mutationFn: (name: string) => apiClient.post("/api/roles", { name }).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["roles"] }); setShowAdd(false); setAddName(""); toast.success("Role created."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rename = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiClient.patch(`/api/roles/${id}`, { name }).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["roles"] }); setEditRole(null); toast.success("Role updated."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/roles/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["roles"] }); toast.success("Role deleted."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const columns: Column<Role>[] = [
    { key: "name", header: "Role name" },
    { key: "userCount", header: "Users assigned", render: (r) => String(r.userCount) },
    {
      key: "id", header: "Actions", width: 100,
      render: (r) => (
        <div style={{ display: "flex", gap: 6 }}>
          {rights.edit && <button
            title="Edit"
            onClick={() => { setEditRole(r); setEditName(r.name); }}
            style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "transparent", color: "var(--text-subtle)", cursor: "pointer", display: "grid", placeItems: "center" }}
          ><Edit2 size={13} /></button>}
          {rights.delete && <button
            title="Delete"
            onClick={() => { if (confirm(`Delete role "${r.name}"?`)) remove.mutate(r.id); }}
            style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "transparent", color: "var(--text-subtle)", cursor: "pointer", display: "grid", placeItems: "center" }}
          ><Trash2 size={13} /></button>}
        </div>
      ),
    },
  ];

  return (
    <ScreenGuard screen="User Rights">
    <>
      <Card
        title="Roles"
        subtitle="Create and manage user roles."
        actions={
          rights.create ? (
            <Button onClick={() => { setShowAdd(true); setAddName(""); }}>
              <Plus size={14} style={{ marginRight: 4 }} /> Add role
            </Button>
          ) : undefined
        }
      >
        {isLoading
          ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
          : <DataTable columns={columns} rows={roles} rowKey={(r) => r.id} empty="No roles yet." />}
      </Card>

      {showAdd && (
        <Modal title="Add role" onClose={() => setShowAdd(false)}>
          <Field label="Role name">
            <Input
              autoFocus
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && addName.trim()) create.mutate(addName.trim()); }}
              placeholder="e.g. Cashier"
            />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "1.25rem" }}>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => create.mutate(addName.trim())} disabled={!addName.trim() || create.isPending}>
              <Check size={14} style={{ marginRight: 4 }} /> Create
            </Button>
          </div>
        </Modal>
      )}

      {editRole && (
        <Modal title="Edit role" onClose={() => setEditRole(null)}>
          <Field label="Role name">
            <Input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && editName.trim()) rename.mutate({ id: editRole.id, name: editName.trim() }); }}
            />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "1.25rem" }}>
            <Button variant="ghost" onClick={() => setEditRole(null)}>Cancel</Button>
            <Button onClick={() => rename.mutate({ id: editRole.id, name: editName.trim() })} disabled={!editName.trim() || rename.isPending}>
              <Check size={14} style={{ marginRight: 4 }} /> Save
            </Button>
          </div>
        </Modal>
      )}
    </>
    </ScreenGuard>
  );
}
