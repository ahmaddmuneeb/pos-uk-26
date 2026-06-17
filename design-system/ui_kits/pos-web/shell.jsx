/* POS UK web — app shell (sidebar + topbar) and login screen. */
const DS = window.POSUKDesignSystem_85bb4f;

const NAV = [
  { section: "Overview", items: [["dashboard", "Dashboard"]] },
  { section: "Company",
    items: [["customers", "Customers"], ["custtypes", "Customer Types"], ["receipts", "Customer Receipts"], ["salepersons", "Sale Persons"]],
    reports: [["rpt-ledger", "Ledger"], ["rpt-receivable", "Receivable"]] },
  { section: "Product",
    items: [["categories", "Categories"], ["subcategories", "Sub Categories"], ["products", "Products"], ["locations", "Stock Locations"], ["uoms", "UOM"]],
    reports: [["rpt-stocksummary", "Stock Summary"], ["rpt-currentstock", "Current Stock"], ["rpt-stockledger", "Stock Ledger"], ["rpt-productlist", "Product List"], ["rpt-reorder", "Re-Order Level"], ["rpt-barcode", "Product Barcode"]] },
  { section: "Sales",
    items: [["orders", "Sale Orders"], ["invoices", "Sale Invoices"], ["returns", "Sale Returns"]],
    reports: [["rpt-saleregister", "Sale Register"], ["rpt-returnregister", "Return Register"]] },
  { section: "Administration",
    items: [["branches", "Branches"], ["users", "Users"], ["userrights", "User Rights"], ["preferences", "Preferences"], ["import", "Bulk Import"]],
    reports: [["rpt-useractivity", "User Activity"], ["rpt-activeusers", "Active Users"], ["rpt-userslist", "Users List"]] },
];

function NavGroup({ grp, route, onNavigate }) {
  const { NavItem, NavSection } = DS;
  return (
    <React.Fragment>
      <NavSection>{grp.section}</NavSection>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {grp.items.map(([key, label]) => (
          <NavItem key={key} active={route === key} onClick={() => onNavigate(key)}>{label}</NavItem>
        ))}
      </div>
      {grp.reports && (
        <React.Fragment>
          <div style={{ fontSize: "var(--fs-2xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)", padding: "0.5rem 0.65rem 0.25rem", opacity: 0.7 }}>Reports</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 6, borderLeft: "1px solid var(--border)", marginLeft: 6 }}>
            {grp.reports.map(([key, label]) => (
              <NavItem key={key} active={route === key} onClick={() => onNavigate(key)} style={{ fontSize: "0.82rem" }}>{label}</NavItem>
            ))}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function AppShell({ route, onNavigate, onLogout, children }) {
  const { BrandMark, Button } = DS;
  const d = window.POSDATA;
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-base)", backgroundImage: "var(--wash-app)" }}>
      <aside style={{ width: "var(--sidebar-w)", flexShrink: 0, background: "linear-gradient(180deg, var(--bg-elevated) 0%, #0d1424 100%)", borderRight: "1px solid var(--border)", padding: "1.25rem 0.875rem 1.5rem", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
        <div style={{ paddingBottom: "1.1rem", marginBottom: "0.25rem", borderBottom: "1px solid var(--border)" }}>
          <BrandMark size={36} showWordmark />
        </div>
        <div style={{ overflowY: "auto", flex: 1, marginRight: "-0.4rem", paddingRight: "0.4rem" }}>
          {NAV.map((grp) => <NavGroup key={grp.section} grp={grp} route={route} onNavigate={onNavigate} />)}
        </div>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: "var(--topbar-h)", flexShrink: 0, background: "rgba(17,24,39,0.75)", backdropFilter: "var(--blur)", WebkitBackdropFilter: "var(--blur)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-subtle)", fontWeight: 600 }}>Branch</strong> · {d.branch}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--primary)", display: "grid", placeItems: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{d.user.initials}</span>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: "var(--fs-base)", fontWeight: 600, color: "var(--text)" }}>{d.user.fullName}</div>
              <div style={{ fontSize: "var(--fs-2xs)", color: "var(--text-subtle)" }}>{d.user.role}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>Log out</Button>
          </div>
        </header>
        <main style={{ padding: "1.25rem", flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const { BrandMark, Field, Input, Button } = DS;
  const [u, setU] = React.useState("admin");
  const [p, setP] = React.useState("admin123");
  const [busy, setBusy] = React.useState(false);
  const submit = () => { setBusy(true); setTimeout(() => { setBusy(false); onLogin(); }, 550); };
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1.5rem", backgroundColor: "var(--bg-base)", backgroundImage: "var(--wash-login)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2rem 2rem 1.75rem", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}><BrandMark size={48} /></div>
          <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, letterSpacing: "var(--tracking-tight)", color: "var(--text)" }}>Welcome back</h2>
          <p style={{ margin: "0.4rem 0 0", fontSize: "var(--fs-base)", color: "var(--text-muted)" }}>Sign in to continue to POS / ERP</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Username"><Input value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" /></Field>
          <Field label="Password"><Input type="password" value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" /></Field>
          <label style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, fontSize: "var(--fs-sm)", color: "var(--text-muted)", fontWeight: 500 }}>
            <input type="checkbox" defaultChecked style={{ width: 15, height: 15, accentColor: "var(--accent)" }} /> Remember me
          </label>
          <Button block disabled={busy} onClick={submit} style={{ marginTop: "0.25rem", padding: "0.7rem 1rem" }}>{busy ? "Signing in…" : "Sign in"}</Button>
          <p style={{ margin: 0, textAlign: "center", fontSize: "var(--fs-sm)", color: "var(--text-subtle)" }}>Demo · <code style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>admin / admin123</code></p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AppShell, LoginScreen, POS_NAV: NAV });
