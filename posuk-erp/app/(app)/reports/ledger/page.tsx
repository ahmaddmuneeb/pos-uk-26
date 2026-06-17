"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Select } from "@/components/forms/Select";
import { Field } from "@/components/forms/Field";
import { IconButton } from "@/components/core/IconButton";
import { Toolbar, ExportActions } from "@/components/ui/ScreenHelpers";
import { fmt } from "@/lib/currency";
import { getCompanyInfo, ledgerDoc, openPrintWindow } from "@/lib/printDoc";
import { fetchArray } from "@/lib/fetchJson";

interface Customer {
  id: string;
  code: string;
  name: string;
}

interface LedgerRow {
  id: string;
  date: string;
  docType: string;
  docNo: string;
  narration: string | null;
  debit: number;
  credit: number;
  balance: number;
}

export default function LedgerReportPage() {
  const [customerId, setCustomerId] = useState("");

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => fetchArray("/api/customers"),
  });

  const { data: ledger = [], isLoading } = useQuery<LedgerRow[]>({
    queryKey: ["ledger", customerId],
    queryFn: () => fetchArray(`/api/ledger?customerId=${customerId}`),
    enabled: !!customerId,
  });

  const { data: preferences = [] } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["preferences"],
    queryFn: () => fetchArray("/api/preferences"),
  });

  const selectedCustomer = customers.find((c) => c.id === customerId);

  const printLedgerRow = (row: LedgerRow) => {
    if (!selectedCustomer) return;
    openPrintWindow(`Ledger ${row.docNo}`, ledgerDoc(getCompanyInfo(preferences), selectedCustomer, row));
  };

  const columns: Column<LedgerRow>[] = [
    { key: "docNo", header: "Doc No" },
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "docType", header: "Type" },
    { key: "narration", header: "Narration", render: (r) => r.narration ?? "—" },
    { key: "debit", header: "Debit", align: "right", render: (r) => (r.debit > 0 ? fmt(r.debit) : "—") },
    { key: "credit", header: "Credit", align: "right", render: (r) => (r.credit > 0 ? fmt(r.credit) : "—") },
    {
      key: "balance",
      header: "Balance",
      align: "right",
      render: (r) => (
        <span style={{ color: r.balance > 0 ? "var(--danger)" : "var(--success)", fontWeight: 600 }}>
          {fmt(r.balance)}
        </span>
      ),
    },
    { key: "act", header: "", align: "right", render: (r) => <span className="no-print" style={{ display: "inline-flex", justifyContent: "flex-end" }}><IconButton label="Print" size="sm" onClick={() => printLedgerRow(r)}>⎙</IconButton></span> },
  ];

  return (
    <Card title="Customer Ledger" subtitle="Statement of account by customer" actions={<ExportActions columns={columns} rows={ledger} filename="customer-ledger" />}>
      <Toolbar>
        <Field label="Customer">
          <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={{ width: 280 }}>
            <option value="">— Select customer —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
            ))}
          </Select>
        </Field>
      </Toolbar>
      {!customerId ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>
          Select a customer to view their ledger
        </div>
      ) : isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={ledger} rowKey={(r) => r.id} empty="No ledger entries" />
      )}
    </Card>
  );
}
