"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

type UomRow = {
  id: string;
  code: string;
  name: string;
};

export default function UomsPage() {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<UomRow[]>({
    queryKey: ["uoms"],
    queryFn: () => fetchArray("/api/uoms"),
  });

  const add = useMutation({
    mutationFn: (body: unknown) =>
      fetch("/api/uoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(new Error(e.error || "Failed")));
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["uoms"] }),
  });

  return (
    <ListScreen
      title="Units of measure"
      addLabel="Add UOM"
      loading={isLoading}
      rows={rows}
      columns={[
        { key: "code", header: "Code", width: 120 },
        { key: "name", header: "Unit name" },
      ]}
      formFields={[
        { key: "code", label: "Code", required: true, placeholder: "KG" },
        { key: "name", label: "Unit name", required: true, placeholder: "Kilogram" },
      ]}
      onAdd={(form) => add.mutateAsync(form)}
    />
  );
}
