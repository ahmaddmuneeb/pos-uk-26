/* POS UK web — Dashboard + generic placeholder. */
const C = window.POSUKDesignSystem_85bb4f;

function DashboardScreen({ go }) {
  const { Card, StatCard, Button, DataTable, Badge } = C;
  const d = window.POSDATA;
  const { Toolbar, BranchSelect, DateField } = window;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Card title="Dashboard" subtitle="Summary for the selected branch and date range.">
        <Toolbar>
          <BranchSelect />
          <DateField label="From" defaultValue="2026-06-01" />
          <DateField label="To" defaultValue="2026-06-14" />
          <Button variant="ghost">Apply</Button>
        </Toolbar>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem" }}>
          <StatCard label="Invoices total" value={d.stats.invoicesTotal} meta={d.stats.invoicesCount + " documents"} />
          <StatCard label="Receipts total" value={d.stats.receiptsTotal} meta={d.stats.receiptsCount + " documents"} />
          <StatCard label="Customers with AR" value={d.stats.receivables} accent />
          <StatCard label="Low-stock items" value={d.stats.lowStock} meta="below re-order level" />
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "1rem" }}>
        <Card title="Recent invoices" actions={<Button variant="ghost" size="sm" onClick={() => go("invoices")}>View all</Button>}>
          <DataTable
            rowKey={(r) => r.id}
            columns={[
              { key: "no", header: "No" },
              { key: "customer", header: "Customer" },
              { key: "net", header: "Net total", align: "right" },
              { key: "outstanding", header: "Outstanding", align: "right" },
              { key: "status", header: "Status", render: (r) => <Badge tone={r.tone}>{r.status}</Badge> },
            ]}
            rows={d.invoices}
          />
        </Card>
        <Card title="Re-order alerts" actions={<Button variant="ghost" size="sm" onClick={() => go("rpt-reorder")}>Report</Button>}>
          <DataTable
            rowKey={(r) => r.id}
            empty="All products above threshold"
            columns={[
              { key: "name", header: "Product" },
              { key: "qty", header: "Bal", align: "right" },
              { key: "reorder", header: "ROL", align: "right" },
              { key: "due", header: "", align: "right", render: (r) => <Badge tone="danger">{r.reorder - r.qty} due</Badge> },
            ]}
            rows={d.products.filter((p) => p.qty < p.reorder)}
          />
        </Card>
      </div>
    </div>
  );
}

function PlaceholderScreen({ title }) {
  const { Card } = C;
  return (
    <Card title={title}>
      <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--text-subtle)" }}>
        <div style={{ fontSize: "var(--fs-md)", color: "var(--text-muted)", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: "var(--fs-sm)" }}>Specified in the PRD — available on request.</div>
      </div>
    </Card>
  );
}

Object.assign(window, { DashboardScreen, PlaceholderScreen });
