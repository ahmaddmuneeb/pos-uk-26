/* POS UK web — Administration module. */
const AD = window.POSUKDesignSystem_85bb4f;

function BranchesScreen() {
  const d = window.POSDATA;
  const { Badge } = AD;
  return window.ListScreen({
    title: "Branches", addLabel: "Add branch",
    columns: [
      { key: "code", header: "Code" }, { key: "name", header: "Branch name" }, { key: "phone", header: "Phone" },
      { key: "vat", header: "VAT No." },
      { key: "head", header: "Type", render: (r) => r.head ? <Badge tone="info">Head office</Badge> : <Badge tone="neutral">Branch</Badge> },
      { key: "active", header: "Status", render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge> },
    ],
    rows: d.branches,
    formFields: [
      { key: "name", label: "Branch name", required: true, full: true }, { key: "code", label: "Code", placeholder: "BR-04" },
      { key: "phone", label: "Phone" }, { key: "vat", label: "VAT No.", placeholder: "GB 000 0000 00" }, { key: "address", label: "Address", full: true },
    ],
    toBuild: (f) => ({ id: "b" + Date.now(), code: f.code || "BR-NEW", name: f.name, phone: f.phone || "—", vat: f.vat || "—", head: false, active: true }),
  });
}

function UsersScreen() {
  const { Card, Button, DataTable, Badge, Modal, Field, Input, Select, IconButton } = AD;
  const { Toolbar } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.users);
  const [show, setShow] = React.useState(false);
  const blank = { username: "", fullName: "", role: "Sales Staff", branch: d.branch, password: "" };
  const [form, setForm] = React.useState(blank);
  const roles = ["System Administrator", "Sales Staff", "Finance / Accounts", "Stock Controller", "Read-only"];
  const save = () => {
    if (!form.username.trim() || !form.fullName.trim()) return;
    setRows([{ id: "us" + Date.now(), username: form.username, fullName: form.fullName, role: form.role, branch: form.branch, isAdmin: form.role === "System Administrator", status: "Active", lastLogin: "—" }, ...rows]);
    setForm(blank); setShow(false);
  };
  return (
    <Card title="Users" actions={<Button onClick={() => setShow(true)}>Add user</Button>}>
      <DataTable
        rowKey={(r) => r.id}
        columns={[
          { key: "username", header: "Username", render: (r) => <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{r.username}</span> },
          { key: "fullName", header: "Full name" },
          { key: "role", header: "Role", render: (r) => r.isAdmin ? <Badge tone="info">{r.role}</Badge> : r.role },
          { key: "branch", header: "Branch" }, { key: "lastLogin", header: "Last login" },
          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "success" : "neutral"}>{r.status}</Badge> },
          { key: "act", header: "", align: "right", render: () => <span style={{ display: "inline-flex", gap: 4, justifyContent: "flex-end" }}><IconButton label="Reset password" size="sm">⟳</IconButton><IconButton label="Edit" size="sm">✎</IconButton></span> },
        ]}
        rows={rows}
      />
      <Modal open={show} wide title="Add user" onClose={() => setShow(false)}
        footer={<><Button onClick={save}>Create user</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Username"><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></Field>
          <Field label="Full name"><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
          <Field label="Role"><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roles.map((r) => <option key={r}>{r}</option>)}</Select></Field>
          <Field label="Branch"><Select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>{d.branches.map((b) => <option key={b.id}>{b.name}</option>)}</Select></Field>
          <Field label="Temporary password" style={{ gridColumn: "1 / -1" }}><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="User must change on first login" /></Field>
        </div>
      </Modal>
    </Card>
  );
}

function UserRightsScreen() {
  const { Card, Button, Select, Switch } = AD;
  const d = window.POSDATA;
  const actions = ["View", "Create", "Edit", "Delete", "Print"];
  const [user, setUser] = React.useState("dcarter");
  const [grid, setGrid] = React.useState(() => {
    const g = {};
    d.rightsModules.forEach((m) => m.screens.forEach((s) => { g[s] = { View: true, Create: true, Edit: s !== "Users", Delete: false, Print: true }; }));
    return g;
  });
  const toggle = (screen, action) => setGrid((g) => ({ ...g, [screen]: { ...g[screen], [action]: !g[screen][action] } }));
  return (
    <Card title="User Rights" subtitle="Per-screen access control. Toggle the actions each role may perform."
      actions={<><Button variant="ghost">Copy from role…</Button><Button>Save rights</Button></>}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: "1.25rem" }}>
        <label style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", fontWeight: 600, display: "flex", flexDirection: "column", gap: 4 }}>
          User
          <Select value={user} onChange={(e) => setUser(e.target.value)} style={{ width: "auto", minWidth: "16rem" }}>
            {d.users.map((u) => <option key={u.id} value={u.username}>{u.fullName} — {u.role}</option>)}
          </Select>
        </label>
      </div>
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
        {d.rightsModules.map((m) => (
          <div key={m.module}>
            <div style={{ padding: "0.5rem 0.85rem", background: "rgba(34,211,238,0.06)", fontSize: "var(--fs-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--accent)", borderBottom: "1px solid var(--border)" }}>{m.module}</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.85rem", fontSize: "var(--fs-xs)", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-wide)" }}>Screen</th>
                  {actions.map((a) => <th key={a} style={{ width: 86, padding: "0.5rem", fontSize: "var(--fs-xs)", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", textAlign: "center" }}>{a}</th>)}
                </tr>
              </thead>
              <tbody>
                {m.screens.map((s, si) => (
                  <tr key={s} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.5rem 0.85rem", fontSize: "var(--fs-base)", color: "var(--text)" }}>{s}</td>
                    {actions.map((a) => (
                      <td key={a} style={{ textAlign: "center", padding: "0.4rem" }}>
                        <button onClick={() => toggle(s, a)} role="switch" aria-checked={grid[s][a]} aria-label={`${s} ${a}`}
                          style={{ width: 34, height: 20, borderRadius: 999, border: "none", cursor: "pointer", padding: 2, display: "inline-flex", justifyContent: grid[s][a] ? "flex-end" : "flex-start", background: grid[s][a] ? "var(--accent-dim)" : "rgba(148,163,184,0.2)", transition: "background var(--dur) var(--ease)" }}>
                          <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff" }} />
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PreferencesScreen() {
  const { Card, Button, Field, Input, Select, Textarea } = AD;
  const { SubHead } = window;
  return (
    <Card title="Preferences" subtitle="Company-wide defaults applied to documents, tax and numbering."
      actions={<Button>Save changes</Button>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem", maxWidth: "52rem" }}>
        <div>
          <SubHead>Company</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Legal name"><Input defaultValue="POS UK Wholesale Ltd" /></Field>
            <Field label="VAT registration"><Input defaultValue="GB 432 8891 02" /></Field>
            <Field label="Registered address"><Textarea rows={2} defaultValue="14 Bull Street, Birmingham, B4 6AF" /></Field>
          </div>
        </div>
        <div>
          <SubHead>Tax &amp; currency</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Default VAT rate"><Select defaultValue="20% (Standard)"><option>20% (Standard)</option><option>5% (Reduced)</option><option>0% (Zero-rated)</option></Select></Field>
            <Field label="Currency"><Select defaultValue="GBP (£)"><option>GBP (£)</option></Select></Field>
            <Field label="Prices include VAT"><Select defaultValue="No — VAT added at line"><option>No — VAT added at line</option><option>Yes — VAT inclusive</option></Select></Field>
          </div>
        </div>
        <div>
          <SubHead>Document numbering</SubHead>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Invoice prefix"><Input defaultValue="INV-" /></Field>
            <Field label="Next invoice no"><Input defaultValue="1047" /></Field>
            <Field label="Order prefix"><Input defaultValue="SO-" /></Field>
            <Field label="Receipt prefix"><Input defaultValue="RCP-" /></Field>
          </div>
        </div>
        <div>
          <SubHead>Defaults</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Default branch"><Select defaultValue="Birmingham — Central">{window.POSDATA.branches.map((b) => <option key={b.id}>{b.name}</option>)}</Select></Field>
            <Field label="Default payment terms"><Select defaultValue="14 days"><option>Due on receipt</option><option>7 days</option><option>14 days</option><option>30 days</option></Select></Field>
            <Field label="Invoice footer note"><Textarea rows={2} defaultValue="Thank you for your business. Goods remain the property of POS UK Wholesale Ltd until paid in full." /></Field>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ImportScreen() {
  const { Card, Button, Select, Badge } = AD;
  const { SubHead } = window;
  const [entity, setEntity] = React.useState("Products");
  const [stage, setStage] = React.useState("upload");
  const preview = {
    Products: { cols: ["SKU", "Name", "Category", "UOM", "Wholesale", "Retail", "Re-order"], rows: [["SKU-2001", "Jasmine Rice 10kg", "Grocery", "Box", "18.40", "21.00", "40"], ["SKU-2002", "Olive Oil 1L", "Grocery", "Case", "4.10", "5.25", "30"], ["SKU-2003", "Foil Trays 250ct", "Packaging", "Box", "6.80", "8.40", "20"]] },
    Customers: { cols: ["Name", "Type", "Phone", "Email", "VAT"], rows: [["Eastside Grocers", "Wholesale", "0121 555 0190", "buy@eastside.uk", "GB 771 2210 88"], ["Maple Deli", "Retail", "0161 555 7741", "hi@mapledeli.uk", "—"]] },
  }[entity];
  return (
    <Card title="Bulk Import" subtitle="Import master data from CSV / Excel. Download a template, map columns, validate, then commit.">
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: "1.25rem" }}>
        <label style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", fontWeight: 600, display: "flex", flexDirection: "column", gap: 4 }}>
          Import type
          <Select value={entity} onChange={(e) => { setEntity(e.target.value); setStage("upload"); }} style={{ width: "auto", minWidth: "14rem" }}>
            <option>Products</option><option>Customers</option><option>Opening Stock</option>
          </Select>
        </label>
        <Button variant="ghost">Download template</Button>
      </div>

      {stage === "upload" ? (
        <div onClick={() => setStage("preview")} style={{ border: "1.5px dashed var(--border-strong)", borderRadius: "var(--radius)", padding: "2.5rem", textAlign: "center", cursor: "pointer", background: "rgba(34,211,238,0.04)" }}>
          <div style={{ fontSize: "var(--fs-lg)", fontWeight: 700, color: "var(--text)" }}>Drop your {entity} file here</div>
          <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-subtle)", marginTop: 6 }}>CSV or XLSX up to 10 MB · or click to browse</div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <SubHead style={{ margin: 0 }}>Preview · {entity.toLowerCase()}.csv</SubHead>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Badge tone="success">{preview.rows.length} valid</Badge>
              <Badge tone="warning">0 warnings</Badge>
              <Button variant="ghost" size="sm" onClick={() => setStage("upload")}>Choose another file</Button>
              <Button size="sm">Commit import</Button>
            </div>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fs-base)" }}>
              <thead><tr>{preview.cols.map((c) => <th key={c} style={{ textAlign: "left", padding: "0.6rem 0.75rem", fontSize: "var(--fs-xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>{c}</th>)}</tr></thead>
              <tbody>{preview.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: "0.55rem 0.75rem", color: "var(--text-muted)", borderBottom: i < preview.rows.length - 1 ? "1px solid var(--border)" : "none" }}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}

function UserActivityReport() {
  const d = window.POSDATA;
  const { Badge } = AD;
  return window.ReportScreen({
    title: "User Activity Report", subtitle: "Audit log of create / update / delete actions across all documents.",
    columns: [
      { key: "at", header: "Timestamp" }, { key: "user", header: "User" }, { key: "docType", header: "Document type" },
      { key: "docNo", header: "Reference" },
      { key: "action", header: "Action", render: (r) => <Badge tone={r.tone}>{r.action}</Badge> },
    ],
    rows: d.activity,
  });
}

function ActiveUsersReport() {
  const d = window.POSDATA;
  const { Badge } = AD;
  const rows = d.users.filter((u) => u.status === "Active").map((u) => ({ username: u.username, fullName: u.fullName, role: u.role, branch: u.branch, lastLogin: u.lastLogin }));
  return window.ReportScreen({
    title: "Active Users Report", subtitle: "Currently enabled user accounts and their last sign-in.",
    columns: [
      { key: "username", header: "Username" }, { key: "fullName", header: "Full name" }, { key: "role", header: "Role" },
      { key: "branch", header: "Branch" }, { key: "lastLogin", header: "Last login" },
    ],
    rows,
  });
}

function UsersListReport() {
  const d = window.POSDATA;
  const { Badge } = AD;
  return window.ReportScreen({
    title: "Users List", subtitle: "Complete directory of all user accounts.",
    columns: [
      { key: "username", header: "Username" }, { key: "fullName", header: "Full name" }, { key: "role", header: "Role" },
      { key: "branch", header: "Branch" },
      { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "success" : "neutral"}>{r.status}</Badge> },
    ],
    rows: d.users,
  });
}

Object.assign(window, { BranchesScreen, UsersScreen, UserRightsScreen, PreferencesScreen, ImportScreen, UserActivityReport, ActiveUsersReport, UsersListReport });
