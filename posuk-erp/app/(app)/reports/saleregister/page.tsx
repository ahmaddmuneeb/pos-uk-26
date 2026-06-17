"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fmt } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";

interface InvoiceRow {
  id: string;
  no: string;
  date: string;
  customerName: string;
  grandTotal: number;
  paidTotal: number;
  outstanding: number;
  status: string;
}

function statusTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "Paid":
      return "success";
    case "Partial":
      return "warning";
    case "Draft":
      return "neutral";
    case "Cancelled":
      return "danger";
    default:
      return "info";
  }
}

export default function SaleRegisterReportPage() {
  const { data: rows = [], isLoading } = useQuery<InvoiceRow[]>({
    queryKey: ["invoices"],
    queryFn: () => fetchArray("/api/invoices"),
  });

  const columns: Column<InvoiceRow>[] = [
    { key: "no", header: "Invoice No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "customerName", header: "Customer" },
    { key: "grandTotal", header: "Grand Total", align: "right", render: (r) => fmt(r.grandTotal) },
    { key: "paidTotal", header: "Paid", align: "right", render: (r) => fmt(r.paidTotal) },
    { key: "outstanding", header: "Outstanding", align: "right", render: (r) => fmt(r.outstanding) },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge>,
    },
  ];

  return (
    <Card title="Sale Register" subtitle="All sales invoices" actions={<ExportActions columns={columns} rows={rows} filename="sale-register" />}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No invoices found" />
      )}
    </Card>
  );
}
