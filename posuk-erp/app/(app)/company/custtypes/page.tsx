"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

interface CustType {
  id: string;
  name: string;
  _count: { customers: number };
}

const formFields = [
  { key: "name", label: "Name", required: true, full: true },
];

export default function CustTypesPage() {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<CustType[]>({
    queryKey: ["custtypes"],
    queryFn: () => fetchArray("/api/custtypes"),
  });

  const addMutation = useMutation({
    mutationFn: (form: Record<string, string>) =>
      fetch("/api/custtypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custtypes"] }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: Record<string, string> }) =>
      fetch(`/api/custtypes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custtypes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/custtypes/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custtypes"] }),
  });

  return (
    <ListScreen
      title="Customer Types"
      addLabel="Add Customer Type"
      columns={[
        { key: "name", header: "Name", width: "50%" },
        {
          key: "customers",
          header: "Customers",
          align: "right",
          width: "25%",
          render: (r) => (r as unknown as CustType)._count.customers,
        },
      ]}
      rows={rows}
      formFields={formFields}
      onAdd={(form) => addMutation.mutateAsync(form)}
      onEdit={(id, form) => editMutation.mutateAsync({ id, form })}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      loading={isLoading}
    />
  );
}
