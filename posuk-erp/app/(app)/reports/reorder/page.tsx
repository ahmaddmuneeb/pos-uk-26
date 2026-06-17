"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

interface Product {
  id: string;
  sku: string;
  name: string;
  reorderLevel: number;
  currentStock: number;
}

interface ReorderRow {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  shortfall: number;
}

export default function ReorderReportPage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchArray("/api/products"),
  });

  const rows: ReorderRow[] = products
    .filter((p) => p.currentStock < p.reorderLevel)
    .map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      currentStock: p.currentStock,
      reorderLevel: p.reorderLevel,
      shortfall: p.reorderLevel - p.currentStock,
    }));

  const columns: Column<ReorderRow>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "currentStock", header: "Current Stock", align: "right" },
    { key: "reorderLevel", header: "Reorder Level", align: "right" },
    {
      key: "shortfall",
      header: "Shortfall",
      align: "right",
      render: (r) => <Badge tone="danger">{r.shortfall}</Badge>,
    },
  ];

  return (
    <Card title="Reorder Report" subtitle="Products below their reorder level" actions={<ExportActions columns={columns} rows={rows} filename="reorder-report" />}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No products need reordering" />
      )}
    </Card>
  );
}
