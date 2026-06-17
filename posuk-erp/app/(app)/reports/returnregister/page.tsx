"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fmt } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

interface ReturnRow {
  id: string;
  no: string;
  date: string;
  invoiceNo: string;
  customerName: string;
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
}

export default function ReturnRegisterReportPage() {
  const rights = useRights("Return Register");
  const { data: rows = [], isLoading } = useQuery<ReturnRow[]>({
    queryKey: ["returns"],
    queryFn: () => fetchArray("/api/returns"),
  });

  const columns: Column<ReturnRow>[] = [
    { key: "no", header: "Return No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "invoiceNo", header: "Invoice No" },
    { key: "customerName", header: "Customer" },
    { key: "subtotal", header: "Subtotal", align: "right", render: (r) => fmt(r.subtotal) },
    { key: "vatTotal", header: "VAT", align: "right", render: (r) => fmt(r.vatTotal) },
    { key: "grandTotal", header: "Grand Total", align: "right", render: (r) => fmt(r.grandTotal) },
  ];

  return (
    <ScreenGuard screen="Return Register">
    <Card title="Return Register" subtitle="All sales returns" actions={rights.print ? <ExportActions columns={columns} rows={rows} filename="return-register" /> : undefined}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No returns found" />
      )}
    </Card>
    </ScreenGuard>
  );
}
