"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fmt } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: { id: string; name: string };
  sub: { id: string; name: string };
  uom: { id: string; name: string };
  purchaseRate: string;
  wholesaleRate: string;
  retailRate: string;
  active: boolean;
}

export default function ProductListReportPage() {
  const { data: rows = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchArray("/api/products"),
  });

  const columns: Column<Product>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "category", header: "Category", render: (r) => r.category.name, csv: (r) => r.category.name },
    { key: "sub", header: "Sub Category", render: (r) => r.sub.name, csv: (r) => r.sub.name },
    { key: "uom", header: "UOM", render: (r) => r.uom.name, csv: (r) => r.uom.name },
    { key: "purchaseRate", header: "Purchase Rate", align: "right", render: (r) => fmt(parseFloat(r.purchaseRate)) },
    { key: "wholesaleRate", header: "Wholesale Rate", align: "right", render: (r) => fmt(parseFloat(r.wholesaleRate)) },
    { key: "retailRate", header: "Retail Rate", align: "right", render: (r) => fmt(parseFloat(r.retailRate)) },
    {
      key: "active",
      header: "Status",
      render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge>,
    },
  ];

  return (
    <Card title="Product List" subtitle="Master list of all products" actions={<ExportActions columns={columns} rows={rows} filename="product-list" />}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No products found" />
      )}
    </Card>
  );
}
