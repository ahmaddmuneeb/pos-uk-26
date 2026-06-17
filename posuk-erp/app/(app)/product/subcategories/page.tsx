"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

type CategoryOption = { id: string; code: string; name: string };
type SubCategoryRow = { id: string; code: string; name: string; parentId: string; parentName: string };

export default function SubCategoriesPage() {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<SubCategoryRow[]>({
    queryKey: ["subcategories"],
    queryFn: () => fetchArray("/api/subcategories"),
  });

  const { data: categories = [] } = useQuery<CategoryOption[]>({
    queryKey: ["categories"],
    queryFn: () => fetchArray("/api/categories"),
  });

  const categoryNameToId = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  const add = useMutation({
    mutationFn: (body: unknown) =>
      fetch("/api/subcategories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then((r) => { if (!r.ok) return r.json().then((e) => Promise.reject(new Error(e.error || "Failed"))); return r.json(); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  const edit = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      fetch(`/api/subcategories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed"); return r.json(); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/subcategories/${id}`, { method: "DELETE" })
        .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed"); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  return (
    <ListScreen
      title="Sub-categories"
      addLabel="Add sub-category"
      loading={isLoading}
      rows={rows as unknown as Record<string, unknown>[]}
      columns={[
        { key: "code", header: "Code", width: 120 },
        { key: "name", header: "Sub-category name" },
        { key: "parentName", header: "Parent category" },
      ]}
      formFields={[
        { key: "code", label: "Code", required: true, placeholder: "SUB-01" },
        { key: "name", label: "Sub-category name", required: true },
        { key: "parentId", label: "Parent category", required: true, options: categories.map((c) => c.name), viewKey: "parentName" },
      ]}
      onAdd={(form) => {
        const parentId = categoryNameToId[form.parentId] ?? form.parentId;
        return add.mutateAsync({ code: form.code, name: form.name, parentId });
      }}
      onEdit={(id, form) => {
        const parentId = categoryNameToId[form.parentId] ?? form.parentId;
        return edit.mutateAsync({ id, data: { code: form.code, name: form.name, parentId } });
      }}
      onDelete={(id) => remove.mutateAsync(id)}
    />
  );
}
