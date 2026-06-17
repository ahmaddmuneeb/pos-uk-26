"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import apiClient from "@/lib/apiClient";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

type UomRow = { id: string; code: string; name: string };

export default function UomsPage() {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<UomRow[]>({
    queryKey: ["uoms"],
    queryFn: () => fetchArray("/api/uoms"),
  });

  const add = useMutation({
    mutationFn: (body: unknown) => apiClient.post("/api/uoms", body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["uoms"] }),
  });

  const edit = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      apiClient.patch(`/api/uoms/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["uoms"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/uoms/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["uoms"] }),
  });

  return (
    <ScreenGuard screen="UOM">
    <ListScreen
      title="Units of measure"
      addLabel="Add UOM"
      loading={isLoading}
      rows={rows as unknown as Record<string, unknown>[]}
      columns={[
        { key: "code", header: "Code", width: 120 },
        { key: "name", header: "Unit name" },
      ]}
      formFields={[
        { key: "code", label: "Code", required: true, placeholder: "KG" },
        { key: "name", label: "Unit name", required: true, placeholder: "Kilogram" },
      ]}
      onAdd={(form) => add.mutateAsync(form)}
      onEdit={(id, form) => edit.mutateAsync({ id, data: form })}
      onDelete={(id) => remove.mutateAsync(id)}
    />
    </ScreenGuard>
  );
}
