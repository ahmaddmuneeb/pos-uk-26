"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Modal } from "@/components/feedback/Modal";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function UsersPage() {
  const qc = useQueryClient();
  const rights = useRights("Users");
  const { data: session } = useSession();
  const myId = (session?.user as { id?: string })?.id;
  const { data: users = [], isLoading } = useQuery({ queryKey: ["users"], queryFn: () => fetchArray<Record<string, unknown>>("/api/users") });
  const { data: roles = [] } = useQuery({ queryKey: ["roles"], queryFn: () => fetchArray<{ id: string; name: string }>("/api/roles") });
  const { data: branches = [] } = useQuery({ queryKey: ["branches"], queryFn: () => fetchArray<{ id: string; name: string }>("/api/branches") });
  const [show, setShow] = useState(false);
  const blank = { username: "", fullName: "", roleId: "", branchId: "", password: "" };
  const [form, setForm] = useState(blank);

  const toggleMutation = useMutation({
    mutationFn: (u: { id: string; username: string; status: string }) =>
      fetch(`/api/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: u.status === "Active" ? "Inactive" : "Active" }),
      }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed"); return r.json(); }),
    onSuccess: (_data, u) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      const action = u.status === "Active" ? "deactivated" : "activated";
      toast.success(`"${u.username}" has been ${action}.`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: (body: unknown) => fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); setShow(false); setForm(blank); toast.success("User created."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const columns: Column<any>[] = [
    { key: "username", header: "Username", render: (r) => <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{r.username as string}</span> },
    { key: "fullName", header: "Full name" },
    { key: "roleName", header: "Role", render: (r) => r.isAdmin ? <Badge tone="info">{r.roleName as string}</Badge> : <span>{r.roleName as string}</span> },
    { key: "branchName", header: "Branch" },
    { key: "lastLogin", header: "Last login", render: (r) => r.lastLogin ? new Date(r.lastLogin as string).toLocaleDateString("en-GB") : "—" },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "success" : "neutral"}>{r.status as string}</Badge> },
    {
      key: "act", header: "Actions", align: "right",
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4 }}>
          {rights.edit && (
            <IconButton
              label={r.status === "Active" ? "Deactivate" : "Activate"}
              size="sm"
              onClick={() => {
                if (r.id === myId) { toast.error("Cannot deactivate yourself."); return; }
                toggleMutation.mutate({ id: r.id as string, username: r.username as string, status: r.status as string });
              }}
            >
              {r.status === "Active"
                ? <ToggleRight size={16} color="#facc15" />
                : <ToggleLeft size={16} color="#facc15" />}
            </IconButton>
          )}
        </span>
      ),
    },
  ];

  return (
    <ScreenGuard screen="Users">
    <Card title="Users" actions={<>{rights.print && <ExportActions columns={columns} rows={users} filename="users" />}{rights.create && <Button onClick={() => setShow(true)}>Add user</Button>}</>}>
      {isLoading ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div> : (
        <DataTable
          rowKey={(r) => r.id as string}
          columns={columns}
          rows={users}
        />
      )}
      <Modal open={show} wide title="Add user" onClose={() => setShow(false)}
        footer={<><Button onClick={() => add.mutate(form)} disabled={add.isPending}>Create user</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Username"><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></Field>
          <Field label="Full name"><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
          <Field label="Role">
            <Select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>
              <option value="">Select…</option>
              {(roles as { id: string; name: string }[]).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </Field>
          <Field label="Branch">
            <Select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
              <option value="">Select…</option>
              {(branches as { id: string; name: string }[]).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </Field>
          <Field label="Temporary password" style={{ gridColumn: "1 / -1" }}>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="User must change on first login" />
          </Field>
        </div>
      </Modal>
    </Card>
    </ScreenGuard>
  );
}
