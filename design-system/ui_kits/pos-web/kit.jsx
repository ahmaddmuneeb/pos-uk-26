/* POS UK web — shared screen helpers built on the design system. */
const K = window.POSUKDesignSystem_85bb4f;

function Toolbar({ children, style }) {
  return <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "0.75rem", margin: "0 0 1rem", ...style }}>{children}</div>;
}

function DateField({ label, defaultValue }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text-muted)" }}>
      {label}
      <K.Input type="date" defaultValue={defaultValue} style={{ width: "auto" }} />
    </label>
  );
}

function BranchSelect({ width = "14rem" }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text-muted)" }}>
      Branch
      <K.Select defaultValue={window.POSDATA.branch} style={{ width: "auto", minWidth: width }}>
        {window.POSDATA.branches.map((b) => <option key={b.id}>{b.name}</option>)}
      </K.Select>
    </label>
  );
}

/* Section sub-heading inside a card */
function SubHead({ children, style }) {
  return <h3 style={{ margin: "0 0 0.6rem", fontSize: "var(--fs-base)", fontWeight: 700, color: "var(--text)", ...style }}>{children}</h3>;
}

/* Read-only key/value grid (detail panels, summaries) */
function KeyValue({ items, cols = 3, style }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "0.9rem 1.5rem", ...style }}>
      {items.map(([k, v]) => (
        <div key={k}>
          <div style={{ fontSize: "var(--fs-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600, marginBottom: 3 }}>{k}</div>
          <div style={{ fontSize: "var(--fs-base)", color: "var(--text)", fontWeight: 500 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* Totals strip used on document forms */
function TotalsBar({ items }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "2rem", padding: "0.9rem 1rem", marginTop: "0.75rem", background: "rgba(34,211,238,0.05)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
      {items.map(([k, v], i) => (
        <div key={k} style={{ textAlign: "right" }}>
          <div style={{ fontSize: "var(--fs-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600 }}>{k}</div>
          <div style={{ fontSize: i === items.length - 1 ? "var(--fs-lg)" : "var(--fs-md)", fontWeight: 700, color: i === items.length - 1 ? "var(--accent)" : "var(--text)", marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* Report screen: optional tabs + filter bar + result table + export */
function ReportScreen({ title, subtitle, tabs, columns, rows, note }) {
  const [tab, setTab] = React.useState(tabs ? tabs[0].value : null);
  const data = typeof rows === "function" ? rows(tab) : rows;
  const cols = typeof columns === "function" ? columns(tab) : columns;
  return (
    <K.Card title={title} subtitle={subtitle} actions={<K.Button variant="ghost">Export CSV</K.Button>}>
      <Toolbar>
        <BranchSelect />
        <DateField label="From" defaultValue="2026-06-01" />
        <DateField label="To" defaultValue="2026-06-14" />
        <K.Button variant="ghost">Apply</K.Button>
        <div style={{ flex: 1 }} />
        <K.Button variant="ghost" size="sm">Print</K.Button>
        <K.Button variant="ghost" size="sm">Email</K.Button>
      </Toolbar>
      {tabs && <K.Tabs value={tab} onChange={setTab} tabs={tabs} style={{ marginBottom: "0.9rem" }} />}
      {note && <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-subtle)", margin: "0 0 0.75rem" }}>{note}</p>}
      <div style={{ overflowX: "auto" }}>
        <K.DataTable columns={cols} rows={data} rowKey={(r, i) => i} />
      </div>
    </K.Card>
  );
}

/* Generic reference-list screen with an inline "add" modal */
function ListScreen({ title, addLabel, columns, rows: initial, formFields, toBuild, toolbar }) {
  const [rows, setRows] = React.useState(initial);
  const [show, setShow] = React.useState(false);
  const [form, setForm] = React.useState(() => Object.fromEntries(formFields.map((f) => [f.key, f.default || ""])));
  const save = () => {
    const required = formFields.find((f) => f.required && !String(form[f.key]).trim());
    if (required) return;
    setRows([toBuild(form, rows), ...rows]);
    setForm(Object.fromEntries(formFields.map((f) => [f.key, f.default || ""])));
    setShow(false);
  };
  return (
    <K.Card title={title} actions={<K.Button onClick={() => setShow(true)}>{addLabel}</K.Button>}>
      {toolbar && <Toolbar>{toolbar}</Toolbar>}
      <K.DataTable columns={columns} rows={rows} rowKey={(r, i) => r.id || i} />
      <K.Modal open={show} title={addLabel} onClose={() => setShow(false)}
        footer={<><K.Button onClick={save}>Save</K.Button><K.Button variant="ghost" onClick={() => setShow(false)}>Cancel</K.Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {formFields.map((f) => (
            <K.Field key={f.key} label={f.label} style={{ gridColumn: f.full ? "1 / -1" : undefined }}>
              {f.options
                ? <K.Select value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>{f.options.map((o) => <option key={o} value={o}>{o}</option>)}</K.Select>
                : <K.Input value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} />}
            </K.Field>
          ))}
        </div>
      </K.Modal>
    </K.Card>
  );
}

Object.assign(window, { Toolbar, DateField, BranchSelect, SubHead, KeyValue, TotalsBar, ReportScreen, ListScreen });
