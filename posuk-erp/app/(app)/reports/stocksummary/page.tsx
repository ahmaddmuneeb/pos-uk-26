"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

interface StockSummaryRow {
  id: string;
  sku: string;
  name: string;
  categoryName: string;
  qtyIn: number;
  qtyOut: number;
  balance: number;
  reorderLevel: number;
}

export default function StockSummaryReportPage() {
  const { data: rows = [], isLoading } = useQuery<StockSummaryRow[]>({
    queryKey: ["stocksummary"],
    queryFn: () => fetchArray("/api/reports/stocksummary"),
  });

  const columns: Column<StockSummaryRow>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "categoryName", header: "Category" },
    { key: "qtyIn", header: "Qty In", align: "right" },
    { key: "qtyOut", header: "Qty Out", align: "right" },
    { key: "balance", header: "Balance", align: "right" },
    { key: "reorderLevel", header: "Reorder Level", align: "right" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge tone={r.balance < r.reorderLevel ? "danger" : "success"}>
          {r.balance < r.reorderLevel ? "Below Reorder" : "OK"}
        </Badge>
      ),
    },
  ];

  return (
    <Card title="Stock Summary" subtitle="Movement and balance by product" actions={<ExportActions columns={columns} rows={rows} filename="stock-summary" />}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No stock data" />
      )}
    </Card>
  );
}
