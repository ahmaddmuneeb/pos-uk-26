"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/data-display/Badge";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

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
    mutationFn: (body: unknown) =>
      fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(new Error(e.error || "Failed")));
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  return (
    <ListScreen
      title="Categories"
      addLabel="Add category"
      loading={isLoading}
      rows={rows}
      columns={[
        { key: "code", header: "Code", width: 120 },
        { key: "name", header: "Category name" },
        {
          key: "active",
          header: "Status",
          width: 100,
          render: (r) => (
            <Badge tone={r.active ? "success" : "neutral"}>
              {r.active ? "Active" : "Inactive"}
            </Badge>
          ),
        },
      ]}
      formFields={[
        { key: "code", label: "Code", required: true, placeholder: "CAT-01" },
        { key: "name", label: "Category name", required: true },
      ]}
      onAdd={(form) => add.mutateAsync(form)}
    />
  );
}
