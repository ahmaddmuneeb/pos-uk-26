"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/data-display/Badge";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

export default function BranchesPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["branches"], queryFn: () => fetchArray<Record<string, unknown>>("/api/branches") });
  const add = useMutation({
    mutationFn: (body: unknown) => fetch("/api/branches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["branches"] }),
  });

  return (
    <ListScreen
      title="Branches"
      addLabel="Add branch"
      loading={isLoading}
      rows={rows}
      columns={[
        { key: "code", header: "Code" },
        { key: "name", header: "Branch name" },
        { key: "phone", header: "Phone" },
        { key: "vat", header: "VAT No." },
        { key: "isHead", header: "Type", render: (r) => <Badge tone={r.isHead ? "info" : "neutral"}>{r.isHead ? "Head office" : "Branch"}</Badge> },
        { key: "active", header: "Status", render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge> },
      ]}
      formFields={[
        { key: "name", label: "Branch name", required: true, full: true },
        { key: "code", label: "Code", placeholder: "BR-04" },
        { key: "phone", label: "Phone" },
        { key: "vat", label: "VAT No.", placeholder: "GB 000 0000 00" },
        { key: "address", label: "Address", full: true },
      ]}
      onAdd={(form) => add.mutateAsync(form)}
    />
  );
}
