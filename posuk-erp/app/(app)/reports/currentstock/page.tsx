"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

interface CurrentStockRow {
  id: string;
  sku: string;
  name: string;
  uomName: string;
  balance: number;
}

export default function CurrentStockReportPage() {
  const { data: rows = [], isLoading } = useQuery<CurrentStockRow[]>({
    queryKey: ["currentstock"],
    queryFn: () => fetchArray("/api/reports/currentstock"),
  });

  const columns: Column<CurrentStockRow>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "uomName", header: "UOM" },
    { key: "balance", header: "Current Balance", align: "right" },
  ];

  return (
    <Card title="Current Stock" subtitle="Total stock balance across all locations" actions={<ExportActions columns={columns} rows={rows} filename="current-stock" />}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No stock data" />
      )}
    </Card>
  );
}
