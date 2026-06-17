"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import apiClient from "@/lib/apiClient";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

type LocationRow = {
  id: string;
  code: string;
  name: string;
};

export default function LocationsPage() {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<LocationRow[]>({
    queryKey: ["locations"],
    queryFn: () => fetchArray("/api/locations"),
  });

  const add = useMutation({
    mutationFn: (body: unknown) => apiClient.post("/api/locations", body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });

  const edit = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      apiClient.patch(`/api/locations/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/locations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });

  return (
    <ScreenGuard screen="Stock Locations">
    <ListScreen
      title="Locations"
      addLabel="Add location"
      loading={isLoading}
      rows={rows}
      columns={[
        { key: "code", header: "Code", width: 120 },
        { key: "name", header: "Location name" },
      ]}
      formFields={[
        { key: "code", label: "Code", required: true, placeholder: "WH-01" },
        { key: "name", label: "Location name", required: true, placeholder: "Main warehouse" },
      ]}
      onAdd={(form) => add.mutateAsync(form)}
      onEdit={(id, form) => edit.mutateAsync({ id, data: form })}
      onDelete={(id) => remove.mutateAsync(id)}
    />
    </ScreenGuard>
  );
}
