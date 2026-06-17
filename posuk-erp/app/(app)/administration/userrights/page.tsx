"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { Button } from "@/components/core/Button";
import { Select } from "@/components/forms/Select";
import { Field } from "@/components/forms/Field";
import { fetchArray } from "@/lib/fetchJson";

const SCREENS = [
  { module: "Company", screens: ["Customers", "Customer Types", "Customer Receipts", "Sale Persons"] },
  { module: "Product", screens: ["Categories", "Sub Categories", "Products", "Stock Locations", "UOM"] },
  { module: "Sales", screens: ["Sale Orders", "Sale Invoices", "Sale Returns"] },
  { module: "Administration", screens: ["Branches", "Users", "User Rights", "Preferences", "Bulk Import"] },
  { module: "Reports", screens: ["Ledger", "Receivable", "Stock Ledger", "Sale Register", "Return Register", "User Activity"] },
];
const ACTIONS = ["view", "create", "edit", "delete", "print"] as const;

type RightRow = { [K in (typeof ACTIONS)[number]]: boolean };

export default function UserRightsPage() {
  const qc = useQueryClient();
  const { data: roles = [] } = useQuery({ queryKey: ["roles"], queryFn: () => fetchArray("/api/roles") });
  const [roleId, setRoleId] = useState("");
  const { data: rights = [] } = useQuery({
    queryKey: ["rights", roleId], enabled: !!roleId,
    queryFn: () => fetchArray(`/api/rights?roleId=${roleId}`),
  });

  const [grid, setGrid] = useState<Record<string, RightRow>>({});

  const rightsMap: Record<string, RightRow> = {};
  (rights as ({ screen: string } & RightRow)[]).forEach((r) => { rightsMap[r.screen] = r; });
  const effective: Record<string, RightRow> = {};
  SCREENS.flatMap((m) => m.screens).forEach((s) => {
    effective[s] = grid[s] ?? rightsMap[s] ?? { view: false, create: false, edit: false, delete: false, print: false };
  });

  const toggle = (screen: string, action: (typeof ACTIONS)[number]) => {
    setGrid((g) => ({ ...g, [screen]: { ...effective[screen], [action]: !effective[screen][action] } }));
  };

  const save = useMutation({
    mutationFn: () => fetch("/api/rights", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roleId, rights: effective }) }).then((r) => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["rights", roleId] }); setGrid({}); },
  });

  return (
    <Card title="User Rights" subtitle="Per-screen access control. Toggle the actions each role may perform."
      actions={<><Button variant="ghost">Reset</Button><Button onClick={() => save.mutate()} disabled={!roleId || save.isPending}>Save rights</Button></>}>
      <div style={{ display: "flex", gap: 12, marginBottom: "1.25rem" }}>
        <Field label="Role">
          <Select value={roleId} onChange={(e) => { setRoleId(e.target.value); setGrid({}); }} style={{ minWidth: "16rem" }}>
            <option value="">Select a role…</option>
            {(roles as { id: string; name: string }[]).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Select>
        </Field>
      </div>
      {roleId && (
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
          {SCREENS.map((m) => (
            <div key={m.module}>
              <div style={{ padding: "0.5rem 0.85rem", background: "rgba(34,211,238,0.06)", fontSize: "var(--fs-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--accent)", borderBottom: "1px solid var(--border)" }}>{m.module}</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.5rem 0.85rem", fontSize: "var(--fs-xs)", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase" }}>Screen</th>
                    {ACTIONS.map((a) => <th key={a} style={{ width: 86, padding: "0.5rem", fontSize: "var(--fs-xs)", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>{a}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {m.screens.map((s) => (
                    <tr key={s} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "0.5rem 0.85rem", fontSize: "var(--fs-base)", color: "var(--text)" }}>{s}</td>
                      {ACTIONS.map((a) => {
                        const on = effective[s]?.[a] ?? false;
                        return (
                          <td key={a} style={{ textAlign: "center", padding: "0.4rem" }}>
                            <button onClick={() => toggle(s, a)} role="switch" aria-checked={on}
                              style={{ width: 34, height: 20, borderRadius: 999, border: "none", cursor: "pointer", padding: 2, display: "inline-flex", justifyContent: on ? "flex-end" : "flex-start", background: on ? "var(--accent-dim)" : "rgba(148,163,184,0.2)", transition: "background var(--dur) var(--ease)" }}>
                              <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff" }} />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
