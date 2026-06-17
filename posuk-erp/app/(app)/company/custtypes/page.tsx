"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import apiClient from "@/lib/apiClient";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

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
      apiClient.post("/api/custtypes", { name: form.name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custtypes"] }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: Record<string, string> }) =>
      apiClient.patch(`/api/custtypes/${id}`, { name: form.name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custtypes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/custtypes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custtypes"] }),
  });

  return (
    <ScreenGuard screen="Customer Types">
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
      rows={rows as unknown as Record<string, unknown>[]}
      formFields={formFields}
      onAdd={(form) => addMutation.mutateAsync(form)}
      onEdit={(id, form) => editMutation.mutateAsync({ id, form })}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      loading={isLoading}
    />
    </ScreenGuard>
  );
}
