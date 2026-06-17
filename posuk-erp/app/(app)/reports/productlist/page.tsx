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
import { fmt } from "@/lib/currency";
import { fetchArray } from "@/lib/fetchJson";
import { openPrintWindow, simpleTableDoc } from "@/lib/printDoc";
import { Eye, Printer } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  type: string;
  category: { id: string; name: string };
  sub: { id: string; name: string };
  uom: { id: string; name: string };
  purchaseRate: string;
  wholesaleRate: string;
  retailRate: string;
  reorderLevel: number;
  barcode: string | null;
  active: boolean;
}

export default function ProductListReportPage() {
  const [viewing, setViewing] = useState<Product | null>(null);

  const { data: rows = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchArray("/api/products"),
  });

  const printProduct = (p: Product) => {
    openPrintWindow(
      `${p.sku} — ${p.name}`,
      simpleTableDoc(`${p.sku} — ${p.name}`, `${p.category.name} › ${p.sub.name}`, [
        ["Type", p.type],
        ["UOM", p.uom.name],
        ["Purchase Rate", fmt(parseFloat(p.purchaseRate))],
        ["Wholesale Rate", fmt(parseFloat(p.wholesaleRate))],
        ["Retail Rate", fmt(parseFloat(p.retailRate))],
        ["Reorder Level", String(p.reorderLevel)],
        ["Barcode", p.barcode ?? "—"],
        ["Status", p.active ? "Active" : "Inactive"],
      ]),
    );
  };

  const columns: Column<Product>[] = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Name" },
    { key: "category", header: "Category", render: (r) => r.category.name, csv: (r) => r.category.name },
    { key: "sub", header: "Sub Category", render: (r) => r.sub.name, csv: (r) => r.sub.name },
    { key: "uom", header: "UOM", render: (r) => r.uom.name, csv: (r) => r.uom.name },
    { key: "purchaseRate", header: "Purchase Rate", align: "right", render: (r) => fmt(parseFloat(r.purchaseRate)) },
    { key: "wholesaleRate", header: "Wholesale Rate", align: "right", render: (r) => fmt(parseFloat(r.wholesaleRate)) },
    { key: "retailRate", header: "Retail Rate", align: "right", render: (r) => fmt(parseFloat(r.retailRate)) },
    { key: "active", header: "Status", render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge> },
    {
      key: "act", header: "Actions", align: "right",
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4 }}>
          <IconButton label="View" size="sm" onClick={() => setViewing(r)}><Eye size={14} color="#38bdf8" /></IconButton>
          <IconButton label="Print" size="sm" onClick={() => printProduct(r)}><Printer size={14} color="#a78bfa" /></IconButton>
        </span>
      ),
    },
  ];

  return (
    <>
      <Card title="Product List" subtitle="Master list of all products" actions={<ExportActions columns={columns} rows={rows} filename="product-list" />}>
        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
        ) : (
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No products found" />
        )}
      </Card>

      <Modal
        open={!!viewing}
        title={viewing ? `${viewing.sku} — ${viewing.name}` : ""}
        wide
        onClose={() => setViewing(null)}
        footer={
          <>
            <Button onClick={() => { if (viewing) printProduct(viewing); }}>
              <Printer size={14} style={{ marginRight: 6 }} />Print
            </Button>
            <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
          </>
        }
      >
        {viewing && (
          <KeyValue cols={3} items={[
            ["Category", viewing.category.name],
            ["Sub-category", viewing.sub.name],
            ["UOM", viewing.uom.name],
            ["Type", viewing.type],
            ["Reorder level", String(viewing.reorderLevel)],
            ["Status", <Badge key="s" tone={viewing.active ? "success" : "neutral"}>{viewing.active ? "Active" : "Inactive"}</Badge>],
            ["Purchase rate", fmt(parseFloat(viewing.purchaseRate))],
            ["Wholesale rate", fmt(parseFloat(viewing.wholesaleRate))],
            ["Retail rate", fmt(parseFloat(viewing.retailRate))],
            ["Barcode", viewing.barcode ?? "—"],
          ]} />
        )}
      </Modal>
    </>
  );
}
