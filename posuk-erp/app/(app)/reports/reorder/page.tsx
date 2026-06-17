"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Modal } from "@/components/feedback/Modal";
import { ExportActions, KeyValue } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import { openPrintWindow, simpleTableDoc } from "@/lib/printDoc";
import { Eye, Printer } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  reorderLevel: number;
  currentStock: number;
}

interface ReorderRow {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  shortfall: number;
}

export default function ReorderReportPage() {
  const [viewing, setViewing] = useState<ReorderRow | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchArray("/api/products"),
  });

  const rows: ReorderRow[] = products
    .filter((p) => p.currentStock < p.reorderLevel)
    .map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      currentStock: p.currentStock,
      reorderLevel: p.reorderLevel,
      shortfall: p.reorderLevel - p.currentStock,
    }));

  const printRow = (r: ReorderRow) => {
    openPrintWindow(
      `Reorder Alert — ${r.sku}`,
      simpleTableDoc(`Reorder Alert — ${r.sku}`, r.name, [
        ["Current Stock", String(r.currentStock)],
        ["Reorder Level", String(r.reorderLevel)],
        ["Shortfall", `<strong style="color:#dc2626">${r.shortfall}</strong>`],
      ]),
    );
  };

  const columns: Column<ReorderRow>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "currentStock", header: "Current Stock", align: "right" },
    { key: "reorderLevel", header: "Reorder Level", align: "right" },
    {
      key: "shortfall", header: "Shortfall", align: "right",
      render: (r) => <Badge tone="danger">{r.shortfall}</Badge>,
    },
    {
      key: "act", header: "Actions", align: "right",
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4 }}>
          <IconButton label="View" size="sm" onClick={() => setViewing(r)}><Eye size={14} color="#38bdf8" /></IconButton>
          <IconButton label="Print" size="sm" onClick={() => printRow(r)}><Printer size={14} color="#a78bfa" /></IconButton>
        </span>
      ),
    },
  ];

  return (
    <>
      <Card title="Reorder Report" subtitle="Products below their reorder level" actions={<ExportActions columns={columns} rows={rows} filename="reorder-report" />}>
        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
        ) : (
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No products need reordering" />
        )}
      </Card>

      <Modal
        open={!!viewing}
        title={viewing ? `${viewing.sku} — ${viewing.name}` : ""}
        onClose={() => setViewing(null)}
        footer={
          <>
            <Button onClick={() => { if (viewing) printRow(viewing); }}>
              <Printer size={14} style={{ marginRight: 6 }} />Print
            </Button>
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
          </>
        }
      >
        {viewing && (
          <KeyValue cols={2} items={[
            ["SKU", viewing.sku],
            ["Name", viewing.name],
            ["Current stock", String(viewing.currentStock)],
            ["Reorder level", String(viewing.reorderLevel)],
            ["Shortfall", <Badge key="s" tone="danger">{viewing.shortfall}</Badge>],
          ]} />
        )}
      </Modal>
    </>
  );
}
