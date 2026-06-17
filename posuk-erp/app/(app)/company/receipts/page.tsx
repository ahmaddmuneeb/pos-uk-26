"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Field } from "@/components/forms/Field";
import { SubHead, ExportActions } from "@/components/ui/ScreenHelpers";
import { fmt } from "@/lib/currency";
import { getCompanyInfo, receiptDoc, openPrintWindow } from "@/lib/printDoc";
import { fetchArray } from "@/lib/fetchJson";

interface Customer { id: string; name: string; code: string }

interface Receipt {
  id: string;
  code: string;
  customer: { id: string; name: string; code: string };
  amount: string | number;
  mode: string;
  reference: string | null;
  date: string;
}

type ModeKey = "CASH" | "BANK_TRANSFER" | "CHEQUE";

const MODE_TONES: Record<ModeKey, "success" | "info" | "warning"> = {
  CASH: "success",
  BANK_TRANSFER: "info",
  CHEQUE: "warning",
};

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  customerId: "",
  amount: "",
  mode: "CASH",
  reference: "",
  date: today,
};

export default function ReceiptsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...emptyForm });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => fetchArray("/api/customers"),
  });

  const { data: receipts = [], isLoading } = useQuery<Receipt[]>({
    queryKey: ["receipts"],
    queryFn: () => fetchArray("/api/receipts"),
  });

  const { data: preferences = [] } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["preferences"],
    queryFn: () => fetchArray("/api/preferences"),
  });

  const printReceipt = (r: Receipt) => {
    openPrintWindow(`Receipt ${r.code}`, receiptDoc(getCompanyInfo(preferences), {
      code: r.code, date: r.date, customerName: r.customer.name, amount: typeof r.amount === "string" ? parseFloat(r.amount) : r.amount, mode: r.mode, reference: r.reference,
    }));
  };

  const mutation = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: data.customerId,
          amount: parseFloat(data.amount),
          mode: data.mode,
          reference: data.reference || undefined,
          date: data.date,
        }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["ledger"] });
      setForm({ ...emptyForm });
    },
  });

  const handlePost = async () => {
    if (!form.customerId) { setError("Please select a customer"); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { setError("Please enter a valid amount"); return; }
    setError("");
    setPosting(true);
    try {
      await mutation.mutateAsync(form);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setPosting(false);
    }
  };

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const columns: Column<Receipt>[] = [
    { key: "code", header: "No.", width: 100 },
    { key: "customer", header: "Customer", render: (r) => r.customer.name, csv: (r) => r.customer.name },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (r) => fmt(r.amount),
    },
    {
      key: "mode",
      header: "Mode",
      render: (r) => (
        <Badge tone={MODE_TONES[r.mode as ModeKey] ?? "neutral"}>
          {r.mode.replace("_", " ")}
        </Badge>
      ),
    },
    { key: "reference", header: "Reference", render: (r) => r.reference ?? "—" },
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "act", header: "", align: "right", render: (r) => <span className="no-print" style={{ display: "inline-flex", justifyContent: "flex-end" }}><IconButton label="Print" size="sm" onClick={() => printReceipt(r)}>⎙</IconButton></span> },
  ];

  return (
    <Card title="Customer Receipts" actions={<ExportActions columns={columns} rows={receipts} filename="customer-receipts" />}>
      <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
        <SubHead>Post Receipt</SubHead>
        {error && (
          <div style={{ color: "var(--danger)", fontSize: "var(--fs-sm)", marginBottom: "0.75rem" }}>{error}</div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, alignItems: "flex-end" }}>
          <Field label="Customer" style={{ gridColumn: "span 2" }}>
            <Select value={form.customerId} onChange={set("customerId")}>
              <option value="">— Select customer —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Amount (£)">
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={set("amount")}
              placeholder="0.00"
            />
          </Field>
          <Field label="Mode">
            <Select value={form.mode} onChange={set("mode")}>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHEQUE">Cheque</option>
            </Select>
          </Field>
          <Field label="Reference">
            <Input value={form.reference} onChange={set("reference")} placeholder="Cheque / Txn ref" />
          </Field>
          <Field label="Date">
            <Input type="date" value={form.date} onChange={set("date")} />
          </Field>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <Button onClick={handlePost} disabled={posting}>
              {posting ? "Posting…" : "Post Receipt"}
            </Button>
          </div>
        </div>
      </div>

      <SubHead>Recent Receipts</SubHead>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable
          columns={columns}
          rows={receipts}
          rowKey={(r) => r.id}
          empty="No receipts posted yet"
        />
      )}
    </Card>
  );
}
