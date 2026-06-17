"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { Button } from "@/components/core/Button";
import { Column } from "@/components/data-display/DataTable";
import { exportCsv } from "@/lib/csv";
import { fetchArray } from "@/lib/fetchJson";

interface Product {
  id: string;
  sku: string;
  name: string;
  barcode: string | null;
}

const csvColumns: Column<Product>[] = [
  { key: "sku", header: "SKU" },
  { key: "name", header: "Name" },
  { key: "barcode", header: "Barcode", csv: (r) => r.barcode ?? "" },
];

export default function BarcodeReportPage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchArray("/api/products"),
  });

  return (
    <Card
      title="Product Barcode"
      subtitle="Printable barcode labels for all products"
      actions={
        <>
          <Button variant="ghost" onClick={() => exportCsv("product-barcodes", csvColumns, products)}>Export CSV</Button>
          <Button variant="ghost" onClick={() => window.print()}>Print</Button>
        </>
      }
    >
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : products.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>No products found</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.75rem",
                textAlign: "center",
                background: "var(--bg-surface)",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.4rem",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                  margin: "0.25rem 0 0.5rem",
                  color: "var(--text)",
                  wordBreak: "break-all",
                }}
              >
                {p.barcode || "—"}
              </div>
              <div style={{ fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text)" }}>{p.name}</div>
              <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-subtle)", fontFamily: "monospace" }}>{p.sku}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
