/* POS UK web — Company module. */
const CO = window.POSUKDesignSystem_85bb4f;

function CustomersScreen() {
  const { Card, Button, DataTable, Badge, Modal, Field, Input, Select, Textarea, IconButton, Tabs } = CO;
  const { Toolbar, BranchSelect, KeyValue, SubHead } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.customers);
  const [q, setQ] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [detail, setDetail] = React.useState(null);
  const [form, setForm] = React.useState({ name: "", contact: "", phone: "", whatsapp: "", email: "", vat: "", type: "Wholesale", city: "", postcode: "", address: "" });
  const filtered = rows.filter((c) => (c.name + c.code).toLowerCase().includes(q.toLowerCase()) && (!typeFilter || c.type === typeFilter));
  const save = () => {
    if (!form.name.trim()) return;
    const n = rows.length + 1;
    setRows([{ id: "c" + Date.now(), code: "CUST-" + String(n).padStart(4, "0"), name: form.name, contact: form.contact, type: form.type, phone: form.phone, email: form.email, vat: form.vat || "—", balance: "£0.00", active: true }, ...rows]);
    setShow(false);
  };

  if (detail) {
    const c = detail;
    return (
      <Card title="Customer history" actions={<Button variant="ghost" onClick={() => setDetail(null)}>← Back to list</Button>}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0 0 1rem", marginBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--primary)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, boxShadow: "var(--glow-accent)" }}>{c.name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "var(--fs-lg)", fontWeight: 700, color: "var(--text)" }}>{c.name}</div>
            <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>{c.code} · {c.type} · {c.contact}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "var(--fs-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600 }}>Outstanding</div>
            <div style={{ fontSize: "var(--fs-xl)", fontWeight: 700, color: c.balance === "£0.00" ? "var(--success)" : "var(--danger)" }}>{c.balance}</div>
          </div>
        </div>
        <KeyValue style={{ marginBottom: "1.25rem" }} items={[["Phone", c.phone], ["Email", c.email], ["VAT No.", c.vat], ["Customer Type", c.type], ["Status", c.active ? "Active" : "Inactive"], ["Branch", d.branch]]} />
        <Toolbar><label style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", fontWeight: 600, display: "flex", flexDirection: "column", gap: 4 }}>From<Input type="date" defaultValue="2026-06-01" style={{ width: "auto" }} /></label>
          <label style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", fontWeight: 600, display: "flex", flexDirection: "column", gap: 4 }}>To<Input type="date" defaultValue="2026-06-14" style={{ width: "auto" }} /></label>
          <Button variant="ghost">Apply</Button></Toolbar>
        <SubHead>Transactions</SubHead>
        <DataTable
          rowKey={(r, i) => i}
          columns={[
            { key: "type", header: "Type" },
            { key: "doc", header: "Document" },
            { key: "date", header: "Date" },
            { key: "amount", header: "Amount", align: "right" },
            { key: "balance", header: "Balance", align: "right" },
            { key: "status", header: "Payment status", render: (r) => <Badge tone={r.tone}>{r.status}</Badge> },
          ]}
          rows={d.customerHistory}
        />
      </Card>
    );
  }

  return (
    <Card title="Customers" actions={<Button onClick={() => setShow(true)}>Add new</Button>}>
      <Toolbar>
        <BranchSelect />
        <Input placeholder="Search name or code" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "auto", minWidth: "16rem" }} />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ width: "auto" }}>
          <option value="">All types</option>{d.customerTypes.map((t) => <option key={t.id}>{t.name}</option>)}
        </Select>
      </Toolbar>
      <DataTable
        rowKey={(r) => r.id}
        empty="No customers match your search"
        columns={[
          { key: "code", header: "Code" },
          { key: "name", header: "Name", render: (r) => <button onClick={() => setDetail(r)} style={{ background: "none", border: "none", padding: 0, color: "var(--accent)", fontWeight: 600, cursor: "pointer", font: "inherit" }}>{r.name}</button> },
          { key: "type", header: "Type" },
          { key: "phone", header: "Phone" },
          { key: "balance", header: "Balance", align: "right" },
          { key: "active", header: "Status", render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge> },
          { key: "act", header: "", align: "right", render: () => <span style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}><IconButton label="Edit" size="sm">✎</IconButton></span> },
        ]}
        rows={filtered}
      />
      <Modal open={show} wide title="Add customer" onClose={() => setShow(false)}
        footer={<><Button onClick={save}>Save customer</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="Customer name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Business name" /></Field>
          <Field label="Contact person"><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></Field>
          <Field label="Customer type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{d.customerTypes.map((t) => <option key={t.id}>{t.name}</option>)}</Select></Field>
          <Field label="Phone / Mobile"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0121 000 0000" /></Field>
          <Field label="WhatsApp No."><Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></Field>
          <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="VAT No."><Input value={form.vat} onChange={(e) => setForm({ ...form, vat: e.target.value })} placeholder="GB 000 0000 00" /></Field>
          <Field label="City"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
          <Field label="Postcode"><Input value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} /></Field>
          <Field label="Billing address" style={{ gridColumn: "1 / -1" }}><Textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, landmark, country" /></Field>
        </div>
      </Modal>
    </Card>
  );
}

function CustomerTypesScreen() {
  const d = window.POSDATA;
  return window.ListScreen({
    title: "Customer Types", addLabel: "Add type",
    columns: [{ key: "name", header: "Type name" }, { key: "customers", header: "Customers", align: "right" }],
    rows: d.customerTypes,
    formFields: [{ key: "name", label: "Type name", required: true, full: true, placeholder: "e.g. Wholesale" }],
    toBuild: (f) => ({ id: "ct" + Date.now(), name: f.name, customers: 0 }),
  });
}

function ReceiptsScreen() {
  const { Card, Button, DataTable, Badge, Field, Select, Input } = CO;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.receipts);
  const [draft, setDraft] = React.useState({ customer: "", amount: "", mode: "CASH", ref: "" });
  const post = () => {
    if (!draft.customer || !draft.amount) return;
    const n = 504 + (rows.length - 3);
    setRows([{ id: "r" + Date.now(), code: "RCP-0" + n, customer: draft.customer, amount: "£" + parseFloat(draft.amount || 0).toFixed(2), mode: draft.mode, ref: draft.ref || "—", date: "2026-06-14" }, ...rows]);
    setDraft({ customer: "", amount: "", mode: "CASH", ref: "" });
  };
  const tone = { CASH: "success", BANK_TRANSFER: "info", CHEQUE: "warning" };
  return (
    <Card title="Customer Receipts">
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end", marginBottom: "1.25rem" }}>
        <Field label="Customer"><Select value={draft.customer} onChange={(e) => setDraft({ ...draft, customer: e.target.value })}><option value="">Select…</option>{d.customers.map((c) => <option key={c.id}>{c.name}</option>)}</Select></Field>
        <Field label="Amount"><Input value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} placeholder="0.00" /></Field>
        <Field label="Payment mode"><Select value={draft.mode} onChange={(e) => setDraft({ ...draft, mode: e.target.value })}><option>CASH</option><option>BANK_TRANSFER</option><option>CHEQUE</option></Select></Field>
        <Field label="Reference"><Input value={draft.ref} onChange={(e) => setDraft({ ...draft, ref: e.target.value })} placeholder="Optional" /></Field>
        <Button onClick={post}>Post receipt</Button>
      </div>
      <DataTable
        rowKey={(r) => r.id}
        columns={[
          { key: "code", header: "Code" },
          { key: "customer", header: "Customer" },
          { key: "amount", header: "Amount", align: "right" },
          { key: "mode", header: "Mode", render: (r) => <Badge tone={tone[r.mode]}>{r.mode.replace("_", " ")}</Badge> },
          { key: "ref", header: "Reference" },
          { key: "date", header: "Date" },
          { key: "act", header: "", align: "right", render: () => <Button variant="ghost" size="sm">Print</Button> },
        ]}
        rows={rows}
      />
    </Card>
  );
}

function SalePersonsScreen() {
  const d = window.POSDATA;
  const { Badge } = CO;
  return window.ListScreen({
    title: "Sale Persons", addLabel: "Add sale person",
    columns: [
      { key: "name", header: "Name" }, { key: "designation", header: "Designation" },
      { key: "region", header: "Region" }, { key: "commission", header: "Commission", align: "right" },
      { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "success" : "neutral"}>{r.status}</Badge> },
    ],
    rows: d.salePersons,
    formFields: [
      { key: "name", label: "Name", required: true }, { key: "designation", label: "Designation" },
      { key: "region", label: "Region" }, { key: "commission", label: "Commission %", placeholder: "2.0%" },
    ],
    toBuild: (f) => ({ id: "sp" + Date.now(), name: f.name, designation: f.designation, region: f.region, commission: f.commission || "0%", status: "Active" }),
  });
}

function LedgerReport() {
  const d = window.POSDATA;
  const ledger = [
    { doc: "INV-1042", date: "2026-06-10", type: "Invoice", narration: "Sale invoice", debit: "£1,240.00", credit: "—", balance: "£1,240.00" },
    { doc: "RCP-0501", date: "2026-06-10", type: "Receipt", narration: "Bank transfer", debit: "—", credit: "£1,240.00", balance: "£0.00" },
    { doc: "INV-1051", date: "2026-06-12", type: "Invoice", narration: "Sale invoice", debit: "£860.50", credit: "—", balance: "£860.50" },
    { doc: "RCP-0509", date: "2026-06-13", type: "Receipt", narration: "Cash", debit: "—", credit: "£400.00", balance: "£460.50" },
  ];
  return window.ReportScreen({
    title: "Ledger Report", subtitle: "Chronological transaction history per customer with running balance.",
    note: "Filter by customer, branch and date range. Printable and emailable.",
    columns: [
      { key: "doc", header: "Doc No." }, { key: "date", header: "Date" }, { key: "type", header: "Type" },
      { key: "narration", header: "Narration" }, { key: "debit", header: "Debit", align: "right" },
      { key: "credit", header: "Credit", align: "right" }, { key: "balance", header: "Balance", align: "right" },
    ],
    rows: ledger,
  });
}

function ReceivableReport() {
  const d = window.POSDATA;
  const rows = d.customers.filter((c) => c.balance !== "£0.00").map((c) => ({ code: c.code, name: c.name, type: c.type, address: window.POSDATA.branch, due: c.balance }));
  return window.ReportScreen({
    title: "Receivable Report", subtitle: "Customers with outstanding balances as of the selected date.",
    columns: [
      { key: "code", header: "Code" }, { key: "name", header: "Customer" }, { key: "type", header: "Type" },
      { key: "address", header: "Branch" }, { key: "due", header: "Amount due", align: "right" },
    ],
    rows,
  });
}

Object.assign(window, { CustomersScreen, CustomerTypesScreen, ReceiptsScreen, SalePersonsScreen, LedgerReport, ReceivableReport });
