"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ScreenHelpers";
import { Badge } from "@/components/data-display/Badge";
import { fetchArray } from "@/lib/fetchJson";

interface SalePerson {
  id: string;
  name: string;
  designation: string | null;
  region: string | null;
  commission: string | number;
  status: string;
}

const formFields = [
  { key: "name", label: "Name", required: true, full: true },
  { key: "designation", label: "Designation" },
  { key: "region", label: "Region" },
  { key: "commission", label: "Commission %", placeholder: "2.0", type: "number" },
  {
    key: "status",
    label: "Status",
    options: ["Active", "Inactive"],
    default: "Active",
  },
];

export default function SalePersonsPage() {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<SalePerson[]>({
    queryKey: ["salepersons"],
    queryFn: () => fetchArray("/api/salepersons"),
  });

  const mutation = useMutation({
    mutationFn: (form: Record<string, string>) =>
      fetch("/api/salepersons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          designation: form.designation || undefined,
          region: form.region || undefined,
          commission: parseFloat(form.commission || "0"),
          status: form.status || "Active",
        }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["salepersons"] }),
  });

  return (
    <ListScreen
      title="Sale Persons"
      addLabel="Add Sale Person"
      columns={[
        { key: "name", header: "Name" },
        { key: "designation", header: "Designation", render: (r) => r.designation ?? "—" },
        { key: "region", header: "Region", render: (r) => r.region ?? "—" },
        {
          key: "commission",
          header: "Commission",
          align: "right",
          render: (r) => `${parseFloat(String(r.commission)).toFixed(2)}%`,
        },
        {
          key: "status",
          header: "Status",
          render: (r) => (
            <Badge tone={r.status === "Active" ? "success" : "neutral"}>{r.status}</Badge>
          ),
        },
      ]}
      rows={rows}
      formFields={formFields}
      onAdd={(form) => mutation.mutateAsync(form)}
      loading={isLoading}
    />
  );
}
