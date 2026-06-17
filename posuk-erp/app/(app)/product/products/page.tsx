"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { Button } from "@/components/core/Button";
import { IconButton } from "@/components/core/IconButton";
import { Modal } from "@/components/feedback/Modal";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ExportActions, KeyValue } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import { Eye, Pencil, Trash2, PackagePlus, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

type CategoryOption = { id: string; code: string; name: string };
type SubOption = { id: string; code: string; name: string; parentId: string };
type UomOption = { id: string; code: string; name: string };
type LocationOption = { id: string; code: string; name: string };

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  type: string;
  categoryId: string;
  subId: string;
  uomId: string;
  purchaseRate: number;
  wholesaleRate: number;
  retailRate: number;
  reorderLevel: number;
  barcode: string | null;
  active: boolean;
  currentStock: number;
  category: { id: string; name: string };
  sub: { id: string; name: string };
  uom: { id: string; name: string };
};

type ProductForm = {
  sku: string;
  name: string;
  type: string;
  categoryId: string;
  subId: string;
  uomId: string;
  purchaseRate: string;
  wholesaleRate: string;
  retailRate: string;
  reorderLevel: string;
  barcode: string;
};

const EMPTY_FORM: ProductForm = {
  sku: "",
  name: "",
  type: "Finished",
  categoryId: "",
  subId: "",
  uomId: "",
  purchaseRate: "",
  wholesaleRate: "",
  retailRate: "",
  reorderLevel: "0",
  barcode: "",
};

function fmt(val: number | string) {
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? "£0.00" : `£${n.toFixed(2)}`;
}

export default function ProductsPage() {
  const qc = useQueryClient();
  const rights = useRights("Products");
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewing, setViewing] = useState<ProductRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [adjusting, setAdjusting] = useState<ProductRow | null>(null);
  const [adjustForm, setAdjustForm] = useState({ locationId: "", qty: "", reason: "" });
  const [adjustSaving, setAdjustSaving] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery<ProductRow[]>({
    queryKey: ["products-all"],
    queryFn: () => fetchArray("/api/products?all=true"),
  });

  const { data: categories = [] } = useQuery<CategoryOption[]>({
    queryKey: ["categories"],
    queryFn: () => fetchArray("/api/categories"),
  });

  const { data: allSubs = [] } = useQuery<SubOption[]>({
    queryKey: ["subcategories"],
    queryFn: () => fetchArray("/api/subcategories"),
  });

  const { data: uoms = [] } = useQuery<UomOption[]>({
    queryKey: ["uoms"],
    queryFn: () => fetchArray("/api/uoms"),
  });

  const { data: locations = [] } = useQuery<LocationOption[]>({
    queryKey: ["locations"],
    queryFn: () => fetchArray("/api/locations"),
  });

  const filteredSubs = form.categoryId
    ? allSubs.filter((s) => s.parentId === form.categoryId)
    : allSubs;

  const add = useMutation({
    mutationFn: (body: unknown) =>
      fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(async (r) => {
        if (!r.ok) {
          const e = await r.json();
          throw new Error(e.error || "Failed to save product");
        }
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products-all"] });
      setForm(EMPTY_FORM);
      setShow(false);
      toast.success("Product created.");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: unknown }) =>
      fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(async (r) => {
        if (!r.ok) {
          const e = await r.json();
          throw new Error(e.error || "Failed to update product");
        }
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products-all"] });
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShow(false);
      toast.success("Product updated.");
    },
  });

  const adjustStock = useMutation({
    mutationFn: (body: { productId: string; locationId: string; qty: number; reason?: string }) =>
      fetch("/api/stock/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(async (r) => {
        if (!r.ok) {
          const e = await r.json();
          throw new Error(e.error || "Failed to adjust stock");
        }
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products-all"] });
      setAdjusting(null);
      setAdjustForm({ locationId: "", qty: "", reason: "" });
      setAdjustError(null);
      toast.success("Stock adjusted.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Failed to update");
      }),
    onSuccess: (_data, { active }) => {
      qc.invalidateQueries({ queryKey: ["products-all"] });
      toast.success(active ? "Product activated." : "Product deactivated.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/products/${id}`, { method: "DELETE" }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Failed to delete");
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products-all"] }); setConfirmDelete(null); },
  });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success(`"${confirmDelete.name}" deleted.`);
    } catch (e: unknown) {
      toast.error((e as Error).message);
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setShow(true); };

  const openEdit = (p: ProductRow) => {
    setEditingId(p.id);
    setForm({
      sku: p.sku,
      name: p.name,
      type: p.type,
      categoryId: p.categoryId,
      subId: p.subId,
      uomId: p.uomId,
      purchaseRate: String(p.purchaseRate),
      wholesaleRate: String(p.wholesaleRate),
      retailRate: String(p.retailRate),
      reorderLevel: String(p.reorderLevel),
      barcode: p.barcode ?? "",
    });
        setShow(true);
  };

  const openAdjust = (p: ProductRow) => {
    setAdjusting(p);
    setAdjustForm({ locationId: "", qty: "", reason: "" });
    setAdjustError(null);
  };

  const submitAdjust = async () => {
    if (!adjusting) return;
    const qty = parseInt(adjustForm.qty, 10);
    if (!adjustForm.locationId) { setAdjustError("Please select a location."); return; }
    if (!qty) { setAdjustError("Enter a non-zero quantity (positive to add, negative to remove)."); return; }
    setAdjustSaving(true);
    setAdjustError(null);
    try {
      await adjustStock.mutateAsync({ productId: adjusting.id, locationId: adjustForm.locationId, qty, reason: adjustForm.reason.trim() || undefined });
    } catch (e: unknown) {
      setAdjustError((e as Error).message);
    } finally {
      setAdjustSaving(false);
    }
  };

  const set = (key: keyof ProductForm, val: string) =>
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      // Reset sub when category changes
      if (key === "categoryId") next.subId = "";
      return next;
    });

  const save = async () => {
    if (!form.sku.trim() || !form.name.trim() || !form.categoryId || !form.subId || !form.uomId) {
      toast.error("Please fill in all required fields."); return;
    }
    setSaving(true);
        const body = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      type: form.type,
      categoryId: form.categoryId,
      subId: form.subId,
      uomId: form.uomId,
      purchaseRate: parseFloat(form.purchaseRate) || 0,
      wholesaleRate: parseFloat(form.wholesaleRate) || 0,
      retailRate: parseFloat(form.retailRate) || 0,
      reorderLevel: parseInt(form.reorderLevel, 10) || 0,
      barcode: form.barcode.trim() || null,
    };
    try {
      if (editingId) await update.mutateAsync({ id: editingId, body });
      else await add.mutateAsync(body);
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<ProductRow>[] = [
    { key: "sku", header: "SKU", width: 110 },
    { key: "name", header: "Product name" },
    {
      key: "category",
      header: "Category",
      render: (r) => r.category?.name ?? "—",
      csv: (r) => r.category?.name ?? "",
    },
    {
      key: "uom",
      header: "UOM",
      width: 80,
      render: (r) => r.uom?.name ?? "—",
      csv: (r) => r.uom?.name ?? "",
    },
    {
      key: "wholesaleRate",
      header: "Wholesale",
      align: "right",
      width: 110,
      render: (r) => fmt(r.wholesaleRate),
    },
    {
      key: "currentStock",
      header: "Stock",
      align: "right",
      width: 80,
      render: (r) => r.currentStock ?? 0,
    },
    {
      key: "active",
      header: "Status",
      width: 90,
      render: (r) => (
        <Badge tone={r.active ? "success" : "neutral"}>
          {r.active ? "Active" : "Inactive"}
        </Badge>
      ),
      csv: (r) => (r.active ? "Active" : "Inactive"),
    },
    {
      key: "act",
      header: "Actions",
      width: 148,
      align: "right",
      render: (r) => (
        <span className="no-print" style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}>
          <IconButton label="View" size="sm" onClick={() => setViewing(r)}><Eye size={14} color="#38bdf8" /></IconButton>
          {rights.edit && <IconButton label="Edit" size="sm" onClick={() => openEdit(r)}><Pencil size={14} color="#4ade80" /></IconButton>}
          {rights.edit && <IconButton label="Adjust stock" size="sm" onClick={() => openAdjust(r)}><PackagePlus size={14} color="#a78bfa" /></IconButton>}
          {rights.edit && (
            <IconButton
              label={r.active ? "Deactivate" : "Activate"}
              size="sm"
              onClick={() => toggleMutation.mutate({ id: r.id, active: !r.active })}
            >
              {r.active
                ? <ToggleRight size={14} color="#facc15" />
                : <ToggleLeft size={14} color="#facc15" />}
            </IconButton>
          )}
          {rights.delete && <IconButton label="Delete" size="sm" onClick={() => setConfirmDelete(r)}><Trash2 size={14} color="#f87171" /></IconButton>}
        </span>
      ),
    },
  ];

  return (
    <ScreenGuard screen="Products">
    <>
      <Card
        title="Products"
        actions={
          <>
            {rights.print && <ExportActions columns={columns} rows={products} filename="products" />}
            {rights.create && <Button onClick={openAdd}>Add product</Button>}
          </>
        }
      >
        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>
            Loading…
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={products}
            rowKey={(r) => r.id}
            empty="No products found"
          />
        )}
      </Card>

      <Modal
        open={show}
        title={editingId ? "Edit product" : "Add product"}
        wide
        onClose={() => { setShow(false); setEditingId(null); }}
        footer={
          <>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => { setShow(false); setEditingId(null); }}>
              Cancel
            </Button>
          </>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* SKU */}
          <Field label="SKU *">
            <Input
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              placeholder="PRD-001"
            />
          </Field>

          {/* Name – full width */}
          <Field label="Product name *" style={{ gridColumn: "1 / -1" }}>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Product name"
            />
          </Field>

          {/* Type */}
          <Field label="Type">
            <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="Finished">Finished</option>
              <option value="Raw">Raw</option>
            </Select>
          </Field>

          {/* Category */}
          <Field label="Category *">
            <Select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>

          {/* Sub-category – filtered by selected category */}
          <Field label="Sub-category *">
            <Select value={form.subId} onChange={(e) => set("subId", e.target.value)}>
              <option value="">Select sub-category…</option>
              {filteredSubs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>

          {/* UOM */}
          <Field label="Unit of measure *">
            <Select value={form.uomId} onChange={(e) => set("uomId", e.target.value)}>
              <option value="">Select UOM…</option>
              {uoms.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>

          {/* Rates */}
          <Field label="Purchase rate (£)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.purchaseRate}
              onChange={(e) => set("purchaseRate", e.target.value)}
              placeholder="0.00"
            />
          </Field>

          <Field label="Wholesale rate (£)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.wholesaleRate}
              onChange={(e) => set("wholesaleRate", e.target.value)}
              placeholder="0.00"
            />
          </Field>

          <Field label="Retail rate (£)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.retailRate}
              onChange={(e) => set("retailRate", e.target.value)}
              placeholder="0.00"
            />
          </Field>

          {/* Reorder level */}
          <Field label="Reorder level">
            <Input
              type="number"
              min="0"
              step="1"
              value={form.reorderLevel}
              onChange={(e) => set("reorderLevel", e.target.value)}
              placeholder="0"
            />
          </Field>

          {/* Barcode – full width */}
          <Field label="Barcode" style={{ gridColumn: "1 / -1" }}>
            <Input
              value={form.barcode}
              onChange={(e) => set("barcode", e.target.value)}
              placeholder="Scan or enter barcode"
            />
          </Field>

          {error && (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "var(--danger)",
                fontSize: "var(--fs-sm)",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}
        </div>
      </Modal>

      {/* Quick-view modal */}
      <Modal
        open={!!viewing}
        title={viewing ? `${viewing.sku} — ${viewing.name}` : ""}
        wide
        onClose={() => setViewing(null)}
        footer={<Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && (
          <KeyValue cols={3} items={[
            ["SKU", viewing.sku],
            ["Type", viewing.type],
            ["Status", <Badge key="s" tone={viewing.active ? "success" : "neutral"}>{viewing.active ? "Active" : "Inactive"}</Badge>],
            ["Category", viewing.category?.name ?? "—"],
            ["Sub-category", viewing.sub?.name ?? "—"],
            ["UOM", viewing.uom?.name ?? "—"],
            ["Purchase rate", fmt(viewing.purchaseRate)],
            ["Wholesale rate", fmt(viewing.wholesaleRate)],
            ["Retail rate", fmt(viewing.retailRate)],
            ["Reorder level", String(viewing.reorderLevel)],
            ["Current stock", String(viewing.currentStock ?? 0)],
            ["Barcode", viewing.barcode ?? "—"],
          ]} />
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        title="Delete Product"
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
          Are you sure you want to delete <strong>{confirmDelete?.name}</strong>? This cannot be undone.
        </p>
      </Modal>

      <Modal
        open={!!adjusting}
        title={adjusting ? `Adjust stock — ${adjusting.sku}` : "Adjust stock"}
        onClose={() => setAdjusting(null)}
        footer={
          <>
            <Button onClick={submitAdjust} disabled={adjustSaving}>
              {adjustSaving ? "Saving…" : "Apply adjustment"}
            </Button>
            <Button variant="ghost" onClick={() => setAdjusting(null)}>
              Cancel
            </Button>
          </>
        }
      >
        {adjusting && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>
              {adjusting.name} — total stock across all locations: <strong>{adjusting.currentStock ?? 0}</strong>
            </div>
            <Field label="Location *">
              <Select value={adjustForm.locationId} onChange={(e) => setAdjustForm({ ...adjustForm, locationId: e.target.value })}>
                <option value="">Select location…</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Quantity change *">
              <Input
                type="number"
                step="1"
                value={adjustForm.qty}
                onChange={(e) => setAdjustForm({ ...adjustForm, qty: e.target.value })}
                placeholder="e.g. 10 to add, -10 to remove"
              />
            </Field>
            <Field label="Reason">
              <Input
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                placeholder="Stock count correction, damage, etc."
              />
            </Field>
            <p style={{ fontSize: "var(--fs-xs)", color: "var(--text-subtle)", margin: 0 }}>
              Stock can never go below zero at a location — adjustments that would result in negative stock are rejected.
            </p>
            {adjustError && (
              <div style={{ color: "var(--danger)", fontSize: "var(--fs-sm)", fontWeight: 500 }}>{adjustError}</div>
            )}
          </div>
        )}
      </Modal>
    </>
    </ScreenGuard>
  );
}
