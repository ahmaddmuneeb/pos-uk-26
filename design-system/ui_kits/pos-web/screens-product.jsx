/* POS UK web — Product module. */
const PR = window.POSUKDesignSystem_85bb4f;

function CategoriesScreen() {
  const d = window.POSDATA;
  const { Badge } = PR;
  return window.ListScreen({
    title: "Categories", addLabel: "Add category",
    columns: [
      { key: "code", header: "Code" }, { key: "name", header: "Category" },
      { key: "items", header: "Total items", align: "right" },
      { key: "active", header: "Status", render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge> },
    ],
    rows: d.categories,
    formFields: [{ key: "name", label: "Category name", required: true }, { key: "code", label: "Code", placeholder: "CAT-05" }],
    toBuild: (f) => ({ id: "cat" + Date.now(), code: f.code || "CAT-NEW", name: f.name, items: 0, active: true }),
  });
}

function SubCategoriesScreen() {
  const d = window.POSDATA;
  return window.ListScreen({
    title: "Sub Categories", addLabel: "Add sub category",
    columns: [
      { key: "code", header: "Code" }, { key: "parent", header: "Parent category" },
      { key: "name", header: "Sub category" }, { key: "items", header: "Total items", align: "right" },
    ],
    rows: d.subCategories,
    formFields: [
      { key: "parent", label: "Parent category", options: d.categories.map((c) => c.name), required: true },
      { key: "name", label: "Sub category name", required: true }, { key: "code", label: "Code", placeholder: "SUB-05" },
    ],
    toBuild: (f) => ({ id: "sc" + Date.now(), code: f.code || "SUB-NEW", parent: f.parent, name: f.name, items: 0 }),
  });
}

function LocationsScreen() {
  const d = window.POSDATA;
  return window.ListScreen({
    title: "Stock Locations", addLabel: "Add location",
    columns: [{ key: "code", header: "Code" }, { key: "name", header: "Location name" }],
    rows: d.locations,
    formFields: [{ key: "code", label: "Location code", placeholder: "LOC-04" }, { key: "name", label: "Location name", required: true }],
    toBuild: (f) => ({ id: "l" + Date.now(), code: f.code || "LOC-NEW", name: f.name }),
  });
}

function UomsScreen() {
  const d = window.POSDATA;
  return window.ListScreen({
    title: "UOM — Units of Measurement", addLabel: "Add UOM",
    columns: [{ key: "code", header: "Code" }, { key: "name", header: "Unit name" }],
    rows: d.uoms,
    formFields: [{ key: "code", label: "UOM code", placeholder: "UOM-06" }, { key: "name", label: "Unit name", required: true, placeholder: "e.g. Pallet" }],
    toBuild: (f) => ({ id: "u" + Date.now(), code: f.code || "UOM-NEW", name: f.name }),
  });
}

function ProductsScreen() {
  const { Card, Button, DataTable, Badge, Modal, Field, Input, Select, IconButton } = PR;
  const { Toolbar } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.products);
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("");
  const [show, setShow] = React.useState(false);
  const blank = { sku: "", name: "", type: "Finished", category: "Grocery", sub: "Rice & Grains", uom: "Box", purchase: "", wholesale: "", retail: "", location: "Main Warehouse", reorder: "", barcode: "" };
  const [form, setForm] = React.useState(blank);
  const filtered = rows.filter((p) => (p.name + p.sku).toLowerCase().includes(q.toLowerCase()) && (!cat || p.category === cat));
  const save = () => {
    if (!form.name.trim() || !form.sku.trim()) return;
    setRows([{ id: "p" + Date.now(), ...form, qty: 0, reorder: parseInt(form.reorder) || 0, active: true }, ...rows]);
    setForm(blank); setShow(false);
  };
  return (
    <Card title="Products" actions={<><Button onClick={() => setShow(true)}>Add new</Button><Button variant="ghost">Import items</Button></>}>
      <Toolbar>
        <Input placeholder="Search SKU or name" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "auto", minWidth: "16rem" }} />
        <Select value={cat} onChange={(e) => setCat(e.target.value)} style={{ width: "auto" }}><option value="">All categories</option>{d.categories.map((c) => <option key={c.id}>{c.name}</option>)}</Select>
      </Toolbar>
      <div style={{ overflowX: "auto" }}>
        <DataTable
          rowKey={(r) => r.id}
          empty="No products match your search"
          columns={[
            { key: "sku", header: "SKU" },
            { key: "name", header: "Product", render: (r) => <span style={{ color: "var(--text)", fontWeight: 600 }}>{r.name}</span> },
            { key: "category", header: "Category" },
            { key: "sub", header: "Sub category" },
            { key: "uom", header: "UOM" },
            { key: "wholesale", header: "W/sale", align: "right", render: (r) => "£" + r.wholesale },
            { key: "retail", header: "Retail", align: "right", render: (r) => "£" + r.retail },
            { key: "qty", header: "Qty", align: "right", render: (r) => <span style={{ color: r.qty < r.reorder ? "var(--danger)" : "var(--text-muted)", fontWeight: r.qty < r.reorder ? 600 : 400 }}>{r.qty}</span> },
            { key: "active", header: "Status", render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge> },
            { key: "act", header: "", align: "right", render: () => <IconButton label="Edit" size="sm">✎</IconButton> },
          ]}
          rows={filtered}
        />
      </div>
      <Modal open={show} wide title="Add product" onClose={() => setShow(false)}
        footer={<><Button onClick={save}>Save product</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="Product code (SKU)"><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU-1007" /></Field>
          <Field label="Product name" style={{ gridColumn: "span 2" }}><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Product type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Finished</option><option>Raw</option></Select></Field>
          <Field label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{d.categories.map((c) => <option key={c.id}>{c.name}</option>)}</Select></Field>
          <Field label="Sub category"><Select value={form.sub} onChange={(e) => setForm({ ...form, sub: e.target.value })}>{d.subCategories.map((s) => <option key={s.id}>{s.name}</option>)}</Select></Field>
          <Field label="UOM"><Select value={form.uom} onChange={(e) => setForm({ ...form, uom: e.target.value })}>{d.uoms.map((u) => <option key={u.id}>{u.name}</option>)}</Select></Field>
          <Field label="Stock location"><Select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>{d.locations.map((l) => <option key={l.id}>{l.name}</option>)}</Select></Field>
          <Field label="Re-order level"><Input value={form.reorder} onChange={(e) => setForm({ ...form, reorder: e.target.value })} placeholder="0" /></Field>
          <Field label="Purchase rate"><Input value={form.purchase} onChange={(e) => setForm({ ...form, purchase: e.target.value })} placeholder="0.00" /></Field>
          <Field label="Wholesale rate"><Input value={form.wholesale} onChange={(e) => setForm({ ...form, wholesale: e.target.value })} placeholder="0.00" /></Field>
          <Field label="Retail rate"><Input value={form.retail} onChange={(e) => setForm({ ...form, retail: e.target.value })} placeholder="0.00" /></Field>
          <Field label="Barcode" style={{ gridColumn: "span 2" }}><Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} placeholder="EAN-13" /></Field>
        </div>
      </Modal>
    </Card>
  );
}

function StockSummaryReport() {
  const d = window.POSDATA;
  return window.ReportScreen({
    title: "Current Stock Summary", subtitle: "Total quantity on hand per product across all locations.",
    columns: [
      { key: "sku", header: "SKU" }, { key: "name", header: "Product" }, { key: "uom", header: "UOM" },
      { key: "qty", header: "Total qty", align: "right" },
      { key: "value", header: "Stock value", align: "right", render: (r) => "£" + (r.qty * parseFloat(r.purchase)).toFixed(2) },
    ],
    rows: d.products,
  });
}

function CurrentStockReport() {
  const d = window.POSDATA;
  return window.ReportScreen({
    title: "Current Stock Report", subtitle: "Detailed per-product, per-location stock levels.",
    columns: [
      { key: "sku", header: "SKU" }, { key: "name", header: "Product" }, { key: "location", header: "Location" },
      { key: "uom", header: "UOM" }, { key: "qty", header: "Balance", align: "right" },
    ],
    rows: d.products,
  });
}

function StockLedgerReport() {
  const moves = [
    { sku: "SKU-1001", product: "Basmati Rice 20kg", location: "Main Warehouse", doc: "GRN-0091", date: "2026-06-08", inq: "300", out: "—", balance: "300" },
    { sku: "SKU-1001", product: "Basmati Rice 20kg", location: "Main Warehouse", doc: "INV-1042", date: "2026-06-10", inq: "—", out: "60", balance: "240" },
    { sku: "SKU-1003", product: "Chopped Tomatoes 2.5kg", location: "Showroom", doc: "INV-1044", date: "2026-06-12", inq: "—", out: "28", balance: "12" },
    { sku: "SKU-1005", product: "Paper Bags 500ct", location: "Shop Floor", doc: "INV-1046", date: "2026-06-13", inq: "—", out: "17", balance: "8" },
  ];
  return window.ReportScreen({
    title: "Stock Ledger", subtitle: "Chronological audit trail of all stock movements, linked to source documents.",
    columns: [
      { key: "sku", header: "SKU" }, { key: "product", header: "Product" }, { key: "location", header: "Location" },
      { key: "doc", header: "Document" }, { key: "date", header: "Date" },
      { key: "inq", header: "Qty in", align: "right" }, { key: "out", header: "Qty out", align: "right" }, { key: "balance", header: "Balance", align: "right" },
    ],
    rows: moves,
  });
}

function ProductListReport() {
  const d = window.POSDATA;
  const { Badge } = PR;
  return window.ReportScreen({
    title: "Product List", subtitle: "Printable catalogue of all products.",
    columns: [
      { key: "sku", header: "Code" }, { key: "name", header: "Name" }, { key: "category", header: "Category" },
      { key: "sub", header: "Sub category" }, { key: "wholesale", header: "W/sale", align: "right", render: (r) => "£" + r.wholesale },
      { key: "retail", header: "Retail", align: "right", render: (r) => "£" + r.retail }, { key: "qty", header: "Qty", align: "right" },
      { key: "active", header: "Status", render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge> },
    ],
    rows: d.products,
  });
}

function ReorderReport() {
  const d = window.POSDATA;
  const { Badge } = PR;
  const rows = d.products.filter((p) => p.qty < p.reorder).map((p) => ({ sku: p.sku, name: p.name, location: p.location, balance: p.qty, reorder: p.reorder, due: p.reorder - p.qty }));
  return window.ReportScreen({
    title: "Re-Order Level Report", subtitle: "Products at or below their minimum stock threshold.",
    columns: [
      { key: "sku", header: "SKU" }, { key: "name", header: "Product" }, { key: "location", header: "Location" },
      { key: "balance", header: "Current balance", align: "right" }, { key: "reorder", header: "Re-order level", align: "right" },
      { key: "due", header: "Due balance", align: "right", render: (r) => <Badge tone="danger">{r.due}</Badge> },
    ],
    rows,
  });
}

function BarcodeReport() {
  const { Card, Button, Select } = PR;
  const { Toolbar } = window;
  const d = window.POSDATA;
  return (
    <Card title="Product Barcode" subtitle="Generate printable barcode labels for selected products." actions={<Button>Print labels</Button>}>
      <Toolbar>
        <label style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", fontWeight: 600, display: "flex", flexDirection: "column", gap: 4 }}>Label format<Select style={{ width: "auto" }}><option>40 × 25 mm (2 per row)</option><option>50 × 30 mm</option><option>A4 sheet (3 × 8)</option></Select></label>
        <label style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", fontWeight: 600, display: "flex", flexDirection: "column", gap: 4 }}>Copies<Select style={{ width: "auto" }}><option>1</option><option>2</option><option>5</option><option>10</option></Select></label>
      </Toolbar>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
        {d.products.map((p) => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", color: "#0c1222" }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#475569", margin: "2px 0 8px" }}>{p.sku} · £{p.retail}</div>
            <div style={{ display: "flex", gap: 1.5, height: 38, alignItems: "stretch" }}>
              {p.barcode.split("").map((n, i) => <div key={i} style={{ width: (parseInt(n) % 3) + 1.5, background: "#0c1222" }} />)}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, textAlign: "center", marginTop: 4, color: "#0c1222" }}>{p.barcode}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

Object.assign(window, { CategoriesScreen, SubCategoriesScreen, ProductsScreen, LocationsScreen, UomsScreen, StockSummaryReport, CurrentStockReport, StockLedgerReport, ProductListReport, ReorderReport, BarcodeReport });
