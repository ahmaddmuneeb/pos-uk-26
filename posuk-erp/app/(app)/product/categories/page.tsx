"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/data-display/Badge";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import apiClient from "@/lib/apiClient";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

type CategoryRow = {
  id: string;
  code: string;
  name: string;
  active: boolean;
};

export default function CategoriesPage() {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<CategoryRow[]>({
    queryKey: ["categories"],
    queryFn: () => fetchArray("/api/categories"),
  });

  const add = useMutation({
    mutationFn: (body: unknown) => apiClient.post("/api/categories", body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const edit = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      apiClient.patch(`/api/categories/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  return (
    <ScreenGuard screen="Categories">
    <ListScreen
      title="Categories"
      addLabel="Add category"
      loading={isLoading}
      rows={rows as unknown as Record<string, unknown>[]}
      columns={[
        { key: "code", header: "Code", width: 120 },
        { key: "name", header: "Category name" },
        { key: "active", header: "Status", width: 100, render: (r) => <Badge tone={(r as unknown as CategoryRow).active ? "success" : "neutral"}>{(r as unknown as CategoryRow).active ? "Active" : "Inactive"}</Badge> },
      ]}
      formFields={[
        { key: "code", label: "Code", required: true, placeholder: "CAT-01" },
        { key: "name", label: "Category name", required: true },
      ]}
      onAdd={(form) => add.mutateAsync(form)}
      onEdit={(id, form) => edit.mutateAsync({ id, data: form })}
      onDelete={(id) => remove.mutateAsync(id)}
    />
    </ScreenGuard>
  );
}
