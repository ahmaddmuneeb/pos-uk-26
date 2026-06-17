"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Modal } from "@/components/feedback/Modal";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Field } from "@/components/forms/Field";
import { SubHead, KeyValue, ExportActions } from "@/components/ui/ScreenHelpers";
import { fmt, currencySymbol } from "@/lib/currency";
import { getCompanyInfo, receiptDoc, openPrintWindow } from "@/lib/printDoc";
import { fetchArray } from "@/lib/fetchJson";
import { Eye, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

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
  const rights = useRights("Customer Receipts");
  const [form, setForm] = useState({ ...emptyForm });
  const [posting, setPosting] = useState(false);
  const [viewing, setViewing] = useState<Receipt | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Receipt | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      code: r.code, date: r.date, customerName: r.customer.name,
      amount: typeof r.amount === "string" ? parseFloat(r.amount) : r.amount,
      mode: r.mode, reference: r.reference,
    }));
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/receipts/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Failed to delete");
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["ledger"] });
      setConfirmDelete(null);
    },
  });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success(`Receipt ${confirmDelete.code} deleted.`);
    } catch (e: unknown) {
      toast.error((e as Error).message);
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
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
      toast.success("Receipt posted.");
    },
  });

  const handlePost = async () => {
    if (!form.customerId) { toast.error("Please select a customer"); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { toast.error("Please enter a valid amount"); return; }
    setPosting(true);
    try {
      await mutation.mutateAsync(form);
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setPosting(false);
    }
  };

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const columns: Column<Receipt>[] = [
    { key: "code", header: "No.", width: 100 },
    { key: "customer", header: "Customer", render: (r) => r.customer.name, csv: (r) => r.customer.name },
    { key: "amount", header: "Amount", align: "right", render: (r) => fmt(r.amount) },
    {
      key: "mode", header: "Mode",
      render: (r) => (
        <Badge tone={MODE_TONES[r.mode as ModeKey] ?? "neutral"}>
          {r.mode.replace("_", " ")}
        </Badge>
      ),
    },
    { key: "reference", header: "Reference", render: (r) => r.reference ?? "—" },
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    {
      key: "act", header: "Actions", align: "right",
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4 }}>
          <IconButton label="View" size="sm" onClick={() => setViewing(r)}>
            <Eye size={14} color="#38bdf8" />
          </IconButton>
          {rights.print && <IconButton label="Print" size="sm" onClick={() => printReceipt(r)}>
            <Printer size={14} color="#a78bfa" />
          </IconButton>}
          {rights.delete && <IconButton label="Delete" size="sm" onClick={() => setConfirmDelete(r)}>
            <Trash2 size={14} color="#f87171" />
          </IconButton>}
        </span>
      ),
    },
  ];

  return (
    <ScreenGuard screen="Customer Receipts">
    <>
      <Card title="Customer Receipts" actions={rights.print ? <ExportActions columns={columns} rows={receipts} filename="customer-receipts" /> : undefined}>
        {rights.create && <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
          <SubHead>Post Receipt</SubHead>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, alignItems: "flex-end" }}>
            <Field label="Customer" style={{ gridColumn: "span 2" }}>
              <Select value={form.customerId} onChange={set("customerId")}>
                <option value="">— Select customer —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label={`Amount (${currencySymbol()})`}>
              <Input type="number" min="0.01" step="0.01" value={form.amount} onChange={set("amount")} placeholder="0.00" />
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
        </div>}

        <SubHead>Recent Receipts</SubHead>
        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
        ) : (
          <DataTable columns={columns} rows={receipts} rowKey={(r) => r.id} empty="No receipts posted yet" />
        )}
      </Card>

      {/* Quick-view modal */}
      <Modal
        open={!!viewing}
        title={`Receipt ${viewing?.code ?? ""}`}
        onClose={() => setViewing(null)}
        footer={
          <>
            {rights.print && <Button onClick={() => { if (viewing) printReceipt(viewing); }}>
              <Printer size={14} style={{ marginRight: 6 }} />Print
            </Button>}
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
          </>
        }
      >
        {viewing && (
          <KeyValue cols={2} items={[
            ["Receipt No.", viewing.code],
            ["Date", new Date(viewing.date).toLocaleDateString("en-GB")],
            ["Customer", viewing.customer.name],
            ["Amount", fmt(viewing.amount)],
            ["Mode", viewing.mode.replace("_", " ")],
            ["Reference", viewing.reference ?? "—"],
          ]} />
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        title="Delete Receipt"
        onClose={() => setConfirmDelete(null)}
        footer={
          <>
            <Button onClick={handleDelete} disabled={deleting} style={{ background: "var(--danger)", borderColor: "var(--danger)" }}>
              {deleting ? "Deleting…" : "Yes, delete"}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          </>
        }
      >
        <p style={{ margin: 0, color: "var(--text)" }}>
          Are you sure you want to delete receipt <strong>{confirmDelete?.code}</strong>? This will also reverse the ledger entry.
        </p>
      </Modal>
    </>
    </ScreenGuard>
  );
}
