/* POS UK web — Sales module. */
const SA = window.POSUKDesignSystem_85bb4f;

/* Reusable line-item editor for documents (order / invoice / return). */
function LineItems({ lines, setLines, showDisc = true }) {
  const { Select, Input, IconButton, Button } = SA;
  const products = window.POSDATA.products;
  const setLine = (i, patch) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const cols = showDisc ? "1fr 4.5rem 5rem 4.5rem 4.5rem 6rem 2rem" : "1fr 4.5rem 5rem 4.5rem 6rem 2rem";
  const head = showDisc ? ["Product", "Qty", "Rate", "Disc %", "VAT %", "Line total", ""] : ["Product", "Qty", "Rate", "VAT %", "Line total", ""];
  const lineTotal = (l) => (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) * (1 - (showDisc ? (parseFloat(l.disc) || 0) / 100 : 0)) * (1 + (parseFloat(l.vat) || 0) / 100);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, fontSize: "var(--fs-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600, marginBottom: 8 }}>
        {head.map((h, i) => <span key={i} style={{ textAlign: i >= head.length - 2 ? "right" : "left" }}>{h}</span>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: cols, gap: 8, alignItems: "center" }}>
            <Select value={l.productId} onChange={(e) => { const p = products.find((x) => x.id === e.target.value); setLine(i, { productId: e.target.value, rate: p ? p.wholesale : l.rate }); }}>
              <option value="">Pick product…</option>{products.map((p) => <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
            </Select>
            <Input value={l.qty} onChange={(e) => setLine(i, { qty: e.target.value })} />
            <Input value={l.rate} onChange={(e) => setLine(i, { rate: e.target.value })} />
            {showDisc && <Input value={l.disc} onChange={(e) => setLine(i, { disc: e.target.value })} />}
            <Input value={l.vat} onChange={(e) => setLine(i, { vat: e.target.value })} />
            <div style={{ textAlign: "right", fontWeight: 600, color: "var(--text)", fontSize: "var(--fs-base)" }}>£{lineTotal(l).toFixed(2)}</div>
            <IconButton label="Remove line" size="sm" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}>✕</IconButton>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" style={{ marginTop: 10 }} onClick={() => setLines((ls) => [...ls, { productId: "", qty: "1", rate: "0", disc: "0", vat: "20" }])}>+ Add line</Button>
    </div>
  );
}

function docTotals(lines, showDisc) {
  let sub = 0, vat = 0;
  lines.forEach((l) => {
    const base = (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) * (1 - (showDisc ? (parseFloat(l.disc) || 0) / 100 : 0));
    sub += base; vat += base * ((parseFloat(l.vat) || 0) / 100);
  });
  return { sub, vat, grand: sub + vat };
}

function OrdersScreen() {
  const { Card, Button, DataTable, Badge, Modal, Field, Select, IconButton } = SA;
  const { TotalsBar } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.orders);
  const [show, setShow] = React.useState(false);
  const [head, setHead] = React.useState({ customer: "", person: "", date: "2026-06-14" });
  const [lines, setLines] = React.useState([{ productId: "", qty: "1", rate: "0", disc: "0", vat: "20" }]);
  const t = docTotals(lines, true);
  const save = () => {
    if (!head.customer || !lines.some((l) => l.productId)) return;
    setRows([{ id: "o" + Date.now(), no: "SO-" + (2090 + rows.length - 3), date: head.date, customer: head.customer, person: head.person || "—", total: "£" + t.grand.toFixed(2), vat: true }, ...rows]);
    setShow(false); setHead({ customer: "", person: "", date: "2026-06-14" }); setLines([{ productId: "", qty: "1", rate: "0", disc: "0", vat: "20" }]);
  };
  return (
    <Card title="Sale Orders" actions={<Button onClick={() => setShow(true)}>New order</Button>}>
      <DataTable
        rowKey={(r) => r.id}
        columns={[
          { key: "no", header: "Order No" }, { key: "date", header: "Date" }, { key: "customer", header: "Customer" },
          { key: "person", header: "Sale person" }, { key: "total", header: "Total", align: "right" },
          { key: "act", header: "", align: "right", render: () => <span style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}><Button variant="ghost" size="sm">Convert to invoice</Button></span> },
        ]}
        rows={rows}
      />
      <Modal open={show} wide title="New sale order" onClose={() => setShow(false)}
        footer={<><Button onClick={save}>Save order</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Field label="Customer"><Select value={head.customer} onChange={(e) => setHead({ ...head, customer: e.target.value })}><option value="">Select…</option>{d.customers.map((c) => <option key={c.id}>{c.name}</option>)}</Select></Field>
          <Field label="Sale person"><Select value={head.person} onChange={(e) => setHead({ ...head, person: e.target.value })}><option value="">Select…</option>{d.salePersons.map((s) => <option key={s.id}>{s.name}</option>)}</Select></Field>
          <Field label="Order date"><SA.Input type="date" value={head.date} onChange={(e) => setHead({ ...head, date: e.target.value })} /></Field>
        </div>
        <LineItems lines={lines} setLines={setLines} />
        <TotalsBar items={[["Subtotal", "£" + t.sub.toFixed(2)], ["VAT", "£" + t.vat.toFixed(2)], ["Grand total", "£" + t.grand.toFixed(2)]]} />
      </Modal>
    </Card>
  );
}

function InvoicesScreen() {
  const { Card, Button, DataTable, Badge, Modal, Field, Select, IconButton } = SA;
  const { TotalsBar, Toolbar } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.invoices);
  const [show, setShow] = React.useState(false);
  const [head, setHead] = React.useState({ customer: "", person: "", location: "Main Warehouse", date: "2026-06-14", order: "" });
  const [lines, setLines] = React.useState([{ productId: "", qty: "1", rate: "0", disc: "0", vat: "20" }]);
  const t = docTotals(lines, true);
  const valid = head.customer && lines.some((l) => l.productId);
  const post = () => {
    if (!valid) return;
    setRows([{ id: "i" + Date.now(), no: "INV-" + (1047 + rows.length - 5), date: head.date, due: "2026-06-28", customer: head.customer, net: "£" + t.grand.toFixed(2), paid: "£0.00", outstanding: "£" + t.grand.toFixed(2), status: "Draft", tone: "info", vat: true }, ...rows]);
    setShow(false); setHead({ customer: "", person: "", location: "Main Warehouse", date: "2026-06-14", order: "" }); setLines([{ productId: "", qty: "1", rate: "0", disc: "0", vat: "20" }]);
  };
  return (
    <Card title="Sale Invoices" actions={<><Button onClick={() => setShow(true)}>New invoice</Button><Button variant="ghost">Refresh</Button></>}>
      <Toolbar>
        <Select defaultValue="" style={{ width: "auto" }}><option value="">All statuses</option><option>Paid</option><option>Partial</option><option>Overdue</option><option>Draft</option></Select>
        <SA.Input placeholder="Search invoice or customer" style={{ width: "auto", minWidth: "15rem" }} />
      </Toolbar>
      <div style={{ overflowX: "auto" }}>
        <DataTable
          rowKey={(r) => r.id}
          columns={[
            { key: "no", header: "Invoice No" }, { key: "date", header: "Date" }, { key: "due", header: "Due date" },
            { key: "customer", header: "Customer" }, { key: "net", header: "Net total", align: "right" },
            { key: "paid", header: "Paid", align: "right" }, { key: "outstanding", header: "Outstanding", align: "right" },
            { key: "status", header: "Status", render: (r) => <Badge tone={r.tone}>{r.status}</Badge> },
            { key: "act", header: "", align: "right", render: () => <span style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}><IconButton label="Print" size="sm">⎙</IconButton><IconButton label="Header" size="sm">⋯</IconButton></span> },
          ]}
          rows={rows}
        />
      </div>
      <Modal open={show} wide title="New sale invoice" onClose={() => setShow(false)}
        footer={<><Button onClick={post} disabled={!valid}>Post invoice</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Field label="From sale order"><Select value={head.order} onChange={(e) => setHead({ ...head, order: e.target.value })}><option value="">— None —</option>{d.orders.map((o) => <option key={o.id}>{o.no}</option>)}</Select></Field>
          <Field label="Customer"><Select value={head.customer} onChange={(e) => setHead({ ...head, customer: e.target.value })}><option value="">Select…</option>{d.customers.map((c) => <option key={c.id}>{c.name}</option>)}</Select></Field>
          <Field label="Sale person"><Select value={head.person} onChange={(e) => setHead({ ...head, person: e.target.value })}><option value="">Select…</option>{d.salePersons.map((s) => <option key={s.id}>{s.name}</option>)}</Select></Field>
          <Field label="Stock location"><Select value={head.location} onChange={(e) => setHead({ ...head, location: e.target.value })}>{d.locations.map((l) => <option key={l.id}>{l.name}</option>)}</Select></Field>
        </div>
        {head.order && <p style={{ fontSize: "var(--fs-sm)", color: "var(--accent)", margin: "0 0 10px" }}>Lines loaded from {head.order} — editable below.</p>}
        <LineItems lines={lines} setLines={setLines} />
        <TotalsBar items={[["Subtotal", "£" + t.sub.toFixed(2)], ["VAT (20%)", "£" + t.vat.toFixed(2)], ["Grand total", "£" + t.grand.toFixed(2)]]} />
      </Modal>
    </Card>
  );
}

function ReturnsScreen() {
  const { Card, Button, DataTable, Modal, Field, Select } = SA;
  const { TotalsBar } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.returns);
  const [show, setShow] = React.useState(false);
  const [head, setHead] = React.useState({ invoice: "", reason: "Damaged goods" });
  const [lines, setLines] = React.useState([{ productId: "", qty: "1", rate: "0", vat: "20" }]);
  const t = docTotals(lines, false);
  const valid = head.invoice && lines.some((l) => l.productId);
  const save = () => {
    if (!valid) return;
    const inv = d.invoices.find((i) => i.no === head.invoice);
    setRows([{ id: "sr" + Date.now(), no: "SR-0" + (314 + rows.length - 2), date: "2026-06-14", saleNo: head.invoice, customer: inv ? inv.customer : "—", person: "Daniel Carter", subtotal: "£" + t.sub.toFixed(2), vat: "£" + t.vat.toFixed(2), total: "£" + t.grand.toFixed(2) }, ...rows]);
    setShow(false); setHead({ invoice: "", reason: "Damaged goods" }); setLines([{ productId: "", qty: "1", rate: "0", vat: "20" }]);
  };
  return (
    <Card title="Sale Returns" actions={<Button onClick={() => setShow(true)}>New return</Button>}>
      <DataTable
        rowKey={(r) => r.id}
        columns={[
          { key: "no", header: "Return No" }, { key: "date", header: "Date" }, { key: "saleNo", header: "Against invoice" },
          { key: "customer", header: "Customer" }, { key: "person", header: "Sale person" },
          { key: "subtotal", header: "Subtotal", align: "right" }, { key: "vat", header: "VAT", align: "right" }, { key: "total", header: "Total", align: "right" },
        ]}
        rows={rows}
      />
      <Modal open={show} wide title="New sale return" onClose={() => setShow(false)}
        footer={<><Button onClick={save} disabled={!valid}>Save return</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Field label="Against sale invoice"><Select value={head.invoice} onChange={(e) => setHead({ ...head, invoice: e.target.value })}><option value="">Select invoice…</option>{d.invoices.map((i) => <option key={i.id}>{i.no}</option>)}</Select></Field>
          <Field label="Reason"><Select value={head.reason} onChange={(e) => setHead({ ...head, reason: e.target.value })}><option>Damaged goods</option><option>Wrong item</option><option>Customer cancelled</option><option>Quality issue</option></Select></Field>
        </div>
        <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-subtle)", margin: "0 0 12px" }}>Max return qty per product is enforced server-side against invoiced minus prior returns.</p>
        <LineItems lines={lines} setLines={setLines} showDisc={false} />
        <TotalsBar items={[["Subtotal", "£" + t.sub.toFixed(2)], ["VAT", "£" + t.vat.toFixed(2)], ["Refund total", "£" + t.grand.toFixed(2)]]} />
      </Modal>
    </Card>
  );
}

function SaleRegisterReport() {
  const d = window.POSDATA;
  const { Badge } = SA;
  return window.ReportScreen({
    title: "Sale Register", subtitle: "All sale invoices for the selected branch and period, with totals.",
    columns: [
      { key: "no", header: "Invoice No" }, { key: "date", header: "Date" }, { key: "customer", header: "Customer" },
      { key: "net", header: "Net total", align: "right" }, { key: "paid", header: "Paid", align: "right" },
      { key: "outstanding", header: "Outstanding", align: "right" },
      { key: "status", header: "Status", render: (r) => <Badge tone={r.tone}>{r.status}</Badge> },
    ],
    rows: d.invoices,
  });
}

function ReturnRegisterReport() {
  const d = window.POSDATA;
  return window.ReportScreen({
    title: "Return Register", subtitle: "All sale returns for the selected branch and period.",
    columns: [
      { key: "no", header: "Return No" }, { key: "date", header: "Date" }, { key: "saleNo", header: "Invoice" },
      { key: "customer", header: "Customer" }, { key: "subtotal", header: "Subtotal", align: "right" },
      { key: "vat", header: "VAT", align: "right" }, { key: "total", header: "Total", align: "right" },
    ],
    rows: d.returns,
  });
}

Object.assign(window, { OrdersScreen, InvoicesScreen, ReturnsScreen, SaleRegisterReport, ReturnRegisterReport });
