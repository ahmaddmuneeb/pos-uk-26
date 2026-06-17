"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { BrandMark } from "@/components/core/BrandMark";
import { Button } from "@/components/core/Button";
import { NavItem } from "./NavItem";

const NAV = [
  { section: "Overview", items: [{ key: "/dashboard", label: "Dashboard" }] },
  {
    section: "Company",
    items: [
      { key: "/company/customers", label: "Customers" },
      { key: "/company/custtypes", label: "Customer Types" },
      { key: "/company/receipts", label: "Customer Receipts" },
      { key: "/company/salepersons", label: "Sale Persons" },
    ],
    reports: [
      { key: "/reports/ledger", label: "Ledger" },
      { key: "/reports/receivable", label: "Receivable" },
    ],
  },
  {
    section: "Product",
    items: [
      { key: "/product/categories", label: "Categories" },
      { key: "/product/subcategories", label: "Sub Categories" },
      { key: "/product/products", label: "Products" },
      { key: "/product/locations", label: "Stock Locations" },
      { key: "/product/uoms", label: "UOM" },
    ],
    reports: [
      { key: "/reports/stocksummary", label: "Stock Summary" },
      { key: "/reports/currentstock", label: "Current Stock" },
      { key: "/reports/stockledger", label: "Stock Ledger" },
      { key: "/reports/productlist", label: "Product List" },
      { key: "/reports/reorder", label: "Re-Order Level" },
    ],
  },
  {
    section: "Sales",
    items: [
      { key: "/sales/orders", label: "Sale Orders" },
      { key: "/sales/invoices", label: "Sale Invoices" },
      { key: "/sales/returns", label: "Sale Returns" },
    ],
    reports: [
      { key: "/reports/saleregister", label: "Sale Register" },
      { key: "/reports/returnregister", label: "Return Register" },
    ],
  },
  {
    section: "Administration",
    items: [
      { key: "/administration/branches", label: "Branches" },
      { key: "/administration/users", label: "Users" },
      { key: "/administration/userrights", label: "User Rights" },
      { key: "/administration/preferences", label: "Preferences" },
      { key: "/administration/import", label: "Bulk Import" },
    ],
    reports: [
      { key: "/reports/useractivity", label: "User Activity" },
      { key: "/reports/activeusers", label: "Active Users" },
      { key: "/reports/userslist", label: "Users List" },
    ],
  },
];

interface AppShellProps {
  user: { fullName: string; role: string; branchName: string };
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const initials = user.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-base)", backgroundImage: "var(--wash-app)" }}>
      <aside style={{ width: "var(--sidebar-w)", flexShrink: 0, background: "linear-gradient(180deg, var(--bg-elevated) 0%, #0d1424 100%)", borderRight: "1px solid var(--border)", padding: "1.25rem 0.875rem 1.5rem", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflowY: "auto" }}>
        <div style={{ paddingBottom: "1.1rem", marginBottom: "0.25rem", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <BrandMark size={36} showWordmark />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", marginRight: "-0.4rem", paddingRight: "0.4rem" }}>
          {NAV.map((grp) => (
            <React.Fragment key={grp.section}>
              <div style={{ fontSize: "var(--fs-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-subtle)", padding: "0.75rem 0.65rem 0.25rem" }}>{grp.section}</div>
              {grp.items.map((item) => (
                <NavItem key={item.key} active={pathname === item.key || pathname.startsWith(item.key + "/")} onClick={() => router.push(item.key)}>{item.label}</NavItem>
              ))}
              {grp.reports && (
                <>
                  <div style={{ fontSize: "var(--fs-2xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)", padding: "0.5rem 0.65rem 0.25rem", opacity: 0.7 }}>Reports</div>
                  <div style={{ paddingLeft: 6, borderLeft: "1px solid var(--border)", marginLeft: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                    {grp.reports.map((r) => (
                      <NavItem key={r.key} active={pathname === r.key} onClick={() => router.push(r.key)} style={{ fontSize: "0.82rem" }}>{r.label}</NavItem>
                    ))}
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: "var(--topbar-h)", flexShrink: 0, background: "rgba(17,24,39,0.75)", backdropFilter: "var(--blur)", WebkitBackdropFilter: "var(--blur)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-subtle)", fontWeight: 600 }}>Branch</strong> · {user.branchName}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--primary)", display: "grid", placeItems: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{initials}</span>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: "var(--fs-base)", fontWeight: 600, color: "var(--text)" }}>{user.fullName}</div>
              <div style={{ fontSize: "var(--fs-2xs)", color: "var(--text-subtle)" }}>{user.role}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>Log out</Button>
          </div>
        </header>
        <main style={{ padding: "1.25rem", flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
