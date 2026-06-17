"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { IconButton } from "@/components/core/IconButton";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fmt } from "@/lib/currency";
import { getCompanyInfo, receivableDoc, openPrintWindow } from "@/lib/printDoc";
import { fetchArray } from "@/lib/fetchJson";

interface ReceivableRow {
  customerId: string;
  code: string;
  name: string;
  typeName: string;
  phone: string | null;
  balance: number;
}

export default function ReceivableReportPage() {
  const { data: rows = [], isLoading } = useQuery<ReceivableRow[]>({
    queryKey: ["receivable"],
    queryFn: () => fetchArray("/api/reports/receivable"),
  });

  const { data: preferences = [] } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["preferences"],
    queryFn: () => fetchArray("/api/preferences"),
  });

  const printReceivable = (row: ReceivableRow) => {
    openPrintWindow(`Statement ${row.code}`, receivableDoc(getCompanyInfo(preferences), row));
  };

  const columns: Column<ReceivableRow>[] = [
    { key: "code", header: "Code", width: 100 },
    { key: "name", header: "Name" },
    { key: "typeName", header: "Type" },
    { key: "phone", header: "Phone", render: (r) => r.phone ?? "—" },
    {
      key: "balance",
      header: "Balance",
      align: "right",
      render: (r) => (
        <span style={{ color: "var(--danger)", fontWeight: 600 }}>{fmt(r.balance)}</span>
      ),
    },
    { key: "act", header: "", align: "right", render: (r) => <span className="no-print" style={{ display: "inline-flex", justifyContent: "flex-end" }}><IconButton label="Print" size="sm" onClick={() => printReceivable(r)}>⎙</IconButton></span> },
  ];

  return (
    <Card title="Receivable Report" subtitle="Customers with outstanding balances" actions={<ExportActions columns={columns} rows={rows} filename="receivable-report" />}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.customerId} empty="No outstanding balances" />
      )}
    </Card>
  );
}
