"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Select } from "@/components/forms/Select";
import { Field } from "@/components/forms/Field";
import { Toolbar, ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

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
  const [productId, setProductId] = useState("");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchArray("/api/products"),
  });

  const { data: rows = [], isLoading } = useQuery<StockLedgerRow[]>({
    queryKey: ["stockledger", productId],
    queryFn: () => fetchArray(`/api/reports/stockledger?productId=${productId}`),
    enabled: !!productId,
  });

  const columns: Column<StockLedgerRow>[] = [
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-GB") },
    { key: "docType", header: "Doc Type" },
    { key: "docNo", header: "Doc No" },
    { key: "locationName", header: "Location" },
    { key: "qtyIn", header: "Qty In", align: "right" },
    { key: "qtyOut", header: "Qty Out", align: "right" },
    { key: "balance", header: "Balance", align: "right" },
  ];

  return (
    <Card title="Stock Ledger" subtitle="Stock movement history by product" actions={<ExportActions columns={columns} rows={rows} filename="stock-ledger" />}>
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
  );
}
