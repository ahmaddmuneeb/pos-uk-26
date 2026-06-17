"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BrandMark } from "@/components/core/BrandMark";
import { NavItem } from "./NavItem";
import { ProfileDropdown } from "./ProfileDropdown";
import { CurrencySync } from "@/components/ui/CurrencySync";
import { RightsContext, RightsMap } from "@/components/auth/RightsContext";
import {
  LayoutDashboard, Users, Tag, Receipt, UserCheck,
  BookOpen, Wallet, Layers, List, Package, MapPin, Ruler,
  BarChart2, Box, ClipboardList, PackageSearch, AlertTriangle,
  ShoppingCart, FileText, RotateCcw, FileBarChart, FileX,
  Building2, UserCog, Shield, ShieldCheck, Settings, Upload,
  Activity, ChevronLeft, ChevronRight,
  type LucideIcon,
} from "lucide-react";

type NavEntry = { key: string; label: string; icon: LucideIcon; screen?: string };

const NAV: { section: string; items: NavEntry[]; reports?: NavEntry[] }[] = [
  {
    section: "Overview",
    items: [{ key: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Company",
    items: [
      { key: "/company/customers", label: "Customers", icon: Users, screen: "Customers" },
      { key: "/company/custtypes", label: "Customer Types", icon: Tag, screen: "Customer Types" },
      { key: "/company/receipts", label: "Customer Receipts", icon: Receipt, screen: "Customer Receipts" },
      { key: "/company/salepersons", label: "Sale Persons", icon: UserCheck, screen: "Sale Persons" },
    ],
    reports: [
      { key: "/reports/ledger", label: "Ledger", icon: BookOpen, screen: "Ledger" },
      { key: "/reports/receivable", label: "Receivable", icon: Wallet, screen: "Receivable" },
    ],
  },
  {
    section: "Product",
    items: [
      { key: "/product/categories", label: "Categories", icon: Layers, screen: "Categories" },
      { key: "/product/subcategories", label: "Sub Categories", icon: List, screen: "Sub Categories" },
      { key: "/product/products", label: "Products", icon: Package, screen: "Products" },
      { key: "/product/locations", label: "Stock Locations", icon: MapPin, screen: "Stock Locations" },
      { key: "/product/uoms", label: "UOM", icon: Ruler, screen: "UOM" },
    ],
    reports: [
      { key: "/reports/stocksummary", label: "Stock Summary", icon: BarChart2, screen: "Stock Summary" },
      { key: "/reports/currentstock", label: "Current Stock", icon: Box, screen: "Current Stock" },
      { key: "/reports/stockledger", label: "Stock Ledger", icon: ClipboardList, screen: "Stock Ledger" },
      { key: "/reports/productlist", label: "Product List", icon: PackageSearch, screen: "Product List" },
      { key: "/reports/reorder", label: "Re-Order Level", icon: AlertTriangle, screen: "Re-Order Level" },
    ],
  },
  {
    section: "Sales",
    items: [
      { key: "/sales/orders", label: "Sale Orders", icon: ShoppingCart, screen: "Sale Orders" },
      { key: "/sales/invoices", label: "Sale Invoices", icon: FileText, screen: "Sale Invoices" },
      { key: "/sales/returns", label: "Sale Returns", icon: RotateCcw, screen: "Sale Returns" },
    ],
    reports: [
      { key: "/reports/saleregister", label: "Sale Register", icon: FileBarChart, screen: "Sale Register" },
      { key: "/reports/returnregister", label: "Return Register", icon: FileX, screen: "Return Register" },
    ],
  },
  {
    section: "Administration",
    items: [
      { key: "/administration/branches", label: "Branches", icon: Building2, screen: "Branches" },
      { key: "/administration/users", label: "Users", icon: UserCog, screen: "Users" },
      { key: "/administration/roles", label: "Roles", icon: ShieldCheck, screen: "User Rights" },
      { key: "/administration/userrights", label: "User Rights", icon: Shield, screen: "User Rights" },
      { key: "/administration/preferences", label: "Preferences", icon: Settings, screen: "Preferences" },
      { key: "/administration/import", label: "Bulk Import", icon: Upload, screen: "Bulk Import" },
    ],
    reports: [
      { key: "/reports/useractivity", label: "User Activity", icon: Activity, screen: "User Activity" },
      { key: "/reports/activeusers", label: "Active Users", icon: UserCheck, screen: "Active Users" },
      { key: "/reports/userslist", label: "Users List", icon: Users, screen: "Users List" },
    ],
  },
];

interface AppShellProps {
  user: { fullName: string; role: string; branchName: string };
  rights: RightsMap;
  children: React.ReactNode;
}

function CollapseIconBtn({ entry, active, onClick }: { entry: NavEntry; active: boolean; onClick: () => void }) {
  const Icon = entry.icon;
  return (
    <button
      title={entry.label}
      onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: "var(--radius-sm)", border: "none",
        background: active ? "rgba(34,211,238,0.12)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-muted)",
        cursor: "pointer", display: "grid", placeItems: "center",
        transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--text)"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}
    >
      <Icon size={17} />
    </button>
  );
}

export function AppShell({ user, rights, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (key: string) => pathname === key || pathname.startsWith(key + "/");

  const isVisible = (entry: NavEntry) => {
    if (!entry.screen) return true;
    return rights[entry.screen]?.view === true;
  };

  return (
    <RightsContext.Provider value={rights}>
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-base)", backgroundImage: "var(--wash-app)" }}>
        <CurrencySync />

        {/* Sidebar */}
        <aside style={{
          width: collapsed ? 60 : 252, flexShrink: 0,
          background: "linear-gradient(180deg, var(--bg-elevated) 0%, #0d1424 100%)",
          borderRight: "1px solid var(--border)",
          padding: collapsed ? "1.1rem 0.75rem 1.5rem" : "1.25rem 0.875rem 1.5rem",
          display: "flex", flexDirection: "column",
          height: "100vh", position: "sticky", top: 0, overflowY: "auto", overflowX: "hidden",
          transition: "width 220ms cubic-bezier(0.4,0,0.2,1), padding 220ms cubic-bezier(0.4,0,0.2,1)",
        }}>

          {/* Brand + toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", paddingBottom: "1rem", marginBottom: "0.25rem", borderBottom: "1px solid var(--border)", flexShrink: 0, gap: 8 }}>
            {!collapsed && <BrandMark size={32} showWordmark />}
            <button
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
                background: "transparent", color: "var(--text-subtle)", cursor: "pointer",
                display: "grid", placeItems: "center", flexShrink: 0,
                transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-subtle)"; }}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Nav */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", overflowX: "hidden", marginRight: "-0.4rem", paddingRight: "0.4rem" }}>
            {NAV.map((grp) => {
              const visibleItems = grp.items.filter(isVisible);
              const visibleReports = (grp.reports ?? []).filter(isVisible);
              const sectionVisible = visibleItems.length > 0 || visibleReports.length > 0;
              if (!sectionVisible) return null;

              return (
                <React.Fragment key={grp.section}>
                  {/* Section heading */}
                  {collapsed ? (
                    <div style={{ height: 1, background: "var(--border)", margin: "0.5rem 0", opacity: 0.5 }} />
                  ) : (
                    <div style={{ fontSize: "var(--fs-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-subtle)", padding: "0.75rem 0.65rem 0.25rem", whiteSpace: "nowrap", overflow: "hidden" }}>
                      {grp.section}
                    </div>
                  )}

                  {/* Main items */}
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.key);
                    return collapsed ? (
                      <div key={item.key} style={{ display: "flex", justifyContent: "center" }}>
                        <CollapseIconBtn entry={item} active={active} onClick={() => router.push(item.key)} />
                      </div>
                    ) : (
                      <NavItem key={item.key} active={active} onClick={() => router.push(item.key)}>
                        <Icon size={15} style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
                      </NavItem>
                    );
                  })}

                  {/* Report items */}
                  {visibleReports.length > 0 && (
                    collapsed ? (
                      visibleReports.map((r) => (
                        <div key={r.key} style={{ display: "flex", justifyContent: "center" }}>
                          <CollapseIconBtn entry={r} active={isActive(r.key)} onClick={() => router.push(r.key)} />
                        </div>
                      ))
                    ) : (
                      <>
                        <div style={{ fontSize: "var(--fs-2xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)", padding: "0.5rem 0.65rem 0.25rem", opacity: 0.7, whiteSpace: "nowrap" }}>Reports</div>
                        <div style={{ paddingLeft: 6, borderLeft: "1px solid var(--border)", marginLeft: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                          {visibleReports.map((r) => {
                            const Icon = r.icon;
                            return (
                              <NavItem key={r.key} active={isActive(r.key)} onClick={() => router.push(r.key)} style={{ fontSize: "0.82rem" }}>
                                <Icon size={13} style={{ flexShrink: 0, opacity: 0.8 }} />
                                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</span>
                              </NavItem>
                            );
                          })}
                        </div>
                      </>
                    )
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </aside>

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, transition: "margin-left 220ms cubic-bezier(0.4,0,0.2,1)" }}>
          <header style={{ height: "var(--topbar-h)", flexShrink: 0, background: "rgba(17,24,39,0.75)", backdropFilter: "var(--blur)", WebkitBackdropFilter: "var(--blur)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text-subtle)", fontWeight: 600 }}>Branch</strong> · {user.branchName}
            </div>
            <ProfileDropdown user={user} />
          </header>
          <main style={{ padding: "1.25rem", flex: 1, minWidth: 0 }}>{children}</main>
        </div>
      </div>
    </RightsContext.Provider>
  );
}
