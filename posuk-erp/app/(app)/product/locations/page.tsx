"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

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
    mutationFn: (body: unknown) =>
      fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(new Error(e.error || "Failed")));
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });

  return (
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
    />
  );
}
