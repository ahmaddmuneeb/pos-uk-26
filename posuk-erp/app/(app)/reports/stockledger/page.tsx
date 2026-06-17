"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Modal } from "@/components/feedback/Modal";
import { Select } from "@/components/forms/Select";
import { Field } from "@/components/forms/Field";
import { Toolbar, KeyValue, ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import { openPrintWindow, simpleTableDoc } from "@/lib/printDoc";
import { Eye, Printer } from "lucide-react";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

interface Product {
  id: string;
  sku: string;
  name: string;
}

interface StockLedgerRow {
  id: string;
  date: string;
  docType: string;
  docNo: string;
  locationName: string;
  qtyIn: number;
  qtyOut: number;
  balance: number;
}

export default function StockLedgerReportPage() {
  const rights = useRights("Stock Ledger");
  const [productId, setProductId] = useState("");
  const [viewing, setViewing] = useState<StockLedgerRow | null>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchArray("/api/products"),
  });

  const { data: rows = [], isLoading } = useQuery<StockLedgerRow[]>({
    queryKey: ["stockledger", productId],
    queryFn: () => fetchArray(`/api/reports/stockledger?productId=${productId}`),
    enabled: !!productId,
  });

  const selectedProduct = products.find((p) => p.id === productId);

  const printRow = (r: StockLedgerRow) => {
    const product = selectedProduct ? `${selectedProduct.sku} — ${selectedProduct.name}` : "";
    openPrintWindow(
      `Stock Movement — ${r.docNo}`,
      simpleTableDoc(`Stock Movement — ${r.docNo}`, product ? `Product: ${product}` : "", [
        ["Date", new Date(r.date).toLocaleDateString("en-GB")],
        ["Doc Type", r.docType],
        ["Doc No", r.docNo],
        ["Location", r.locationName],
        ["Qty In", r.qtyIn > 0 ? String(r.qtyIn) : "—"],
        ["Qty Out", r.qtyOut > 0 ? String(r.qtyOut) : "—"],
        ["Running Balance", String(r.balance)],
      ]),
    );
  };

  const columns: Column<StockLedgerRow>[] = [
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "docType", header: "Doc Type" },
    { key: "docNo", header: "Doc No" },
    { key: "locationName", header: "Location" },
    { key: "qtyIn", header: "Qty In", align: "right", render: (r) => r.qtyIn > 0 ? <span style={{ color: "#4ade80" }}>{r.qtyIn}</span> : "—" },
    { key: "qtyOut", header: "Qty Out", align: "right", render: (r) => r.qtyOut > 0 ? <span style={{ color: "#f87171" }}>{r.qtyOut}</span> : "—" },
    {
      key: "balance", header: "Balance", align: "right",
      render: (r) => <span style={{ fontWeight: 600, color: r.balance <= 0 ? "var(--danger)" : "var(--text)" }}>{r.balance}</span>,
    },
    {
      key: "act", header: "Actions", align: "right",
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4 }}>
          <IconButton label="View" size="sm" onClick={() => setViewing(r)}><Eye size={14} color="#38bdf8" /></IconButton>
          {rights.print && <IconButton label="Print" size="sm" onClick={() => printRow(r)}><Printer size={14} color="#a78bfa" /></IconButton>}
        </span>
      ),
    },
  ];

  return (
    <ScreenGuard screen="Stock Ledger">
    <>
      <Card title="Stock Ledger" subtitle="Stock movement history by product" actions={rights.print ? <ExportActions columns={columns} rows={rows} filename="stock-ledger" /> : undefined}>
        <Toolbar>
          <Field label="Product">
            <Select value={productId} onChange={(e) => setProductId(e.target.value)} style={{ width: 280 }}>
              <option value="">— Select product —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
              ))}
            </Select>
          </Field>
        </Toolbar>
        {!productId ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>
            Select a product to view its stock ledger
          </div>
        ) : isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
        ) : (
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No stock movements" />
        )}
      </Card>

      <Modal
        open={!!viewing}
        title={`${viewing?.docType ?? ""} — ${viewing?.docNo ?? ""}`}
        onClose={() => setViewing(null)}
        footer={
          <>
            {rights.print && <Button onClick={() => { if (viewing) printRow(viewing); }}>
              <Printer size={14} style={{ marginRight: 6 }} />Print
            </Button>}
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
          </>
        }
      >
        {viewing && (
          <KeyValue cols={2} items={[
            ["Date", new Date(viewing.date).toLocaleDateString("en-GB")],
            ["Doc Type", viewing.docType],
            ["Doc No", viewing.docNo],
            ["Location", viewing.locationName],
            ["Qty In", viewing.qtyIn > 0 ? String(viewing.qtyIn) : "—"],
            ["Qty Out", viewing.qtyOut > 0 ? String(viewing.qtyOut) : "—"],
            ["Running Balance", <span key="b" style={{ fontWeight: 700, color: viewing.balance <= 0 ? "var(--danger)" : "var(--text)" }}>{viewing.balance}</span>],
          ]} />
        )}
      </Modal>
    </>
    </ScreenGuard>
  );
}
