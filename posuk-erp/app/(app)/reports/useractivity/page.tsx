"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface ActivityRow {
  id: string;
  at: string;
  userFullName: string;
  docType: string;
  docNo: string;
  action: string;
}

function actionTone(action: string): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (action) {
    case "Created": return "success";
    case "Updated": return "info";
    case "Deleted": return "danger";
    default: return "neutral";
  }
}

const ACTION_COLORS: Record<string, string> = { Created: "#4ade80", Updated: "#38bdf8", Deleted: "#f87171" };
const DOC_COLORS = ["#22d3ee", "#a78bfa", "#4ade80", "#fbbf24", "#f87171", "#fb923c", "#38bdf8", "#e879f9"];
const axisStyle = { fill: "#64748b", fontSize: 11 };
const gridProps = { strokeDasharray: "3 3", stroke: "#1e293b" };

function CountTip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      {label && <p style={{ margin: "0 0 4px", color: "#94a3b8", fontWeight: 600 }}>{label}</p>}
      {payload.map((p) => <p key={p.name} style={{ margin: "2px 0", color: p.color ?? "#f1f5f9" }}>{p.name}: {p.value}</p>)}
    </div>
  );
}

function PieTip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      <p style={{ margin: 0, color: "#f1f5f9" }}>{p.name}: <strong>{p.value}</strong></p>
    </div>
  );
}

function last14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    d.setHours(0, 0, 0, 0);
    return { label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), date: d };
  });
}

export default function UserActivityReportPage() {
  const rights = useRights("User Activity");
  const { data: rows = [], isLoading } = useQuery<ActivityRow[]>({
    queryKey: ["useractivity"],
    queryFn: () => fetchArray("/api/reports/useractivity"),
  });

  // ── Chart data ────────────────────────────────────────────────────────────
  const days = last14Days();

  const dailyTrend = days.map(({ label, date }) => {
    const next = new Date(date); next.setDate(next.getDate() + 1);
    const slice = rows.filter((r) => { const t = new Date(r.at); return t >= date && t < next; });
    return {
      day: label,
      Created: slice.filter((r) => r.action === "Created").length,
      Updated: slice.filter((r) => r.action === "Updated").length,
      Deleted: slice.filter((r) => r.action === "Deleted").length,
    };
  });

  const actionDist = ["Created", "Updated", "Deleted"].map((a) => ({
    name: a, value: rows.filter((r) => r.action === a).length,
  })).filter((d) => d.value > 0);

  const userMap: Record<string, number> = {};
  rows.forEach((r) => { userMap[r.userFullName] = (userMap[r.userFullName] || 0) + 1; });
  const byUser = Object.entries(userMap).sort(([, a], [, b]) => b - a).slice(0, 8)
    .map(([name, Actions]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, Actions }));

  const docMap: Record<string, number> = {};
  rows.forEach((r) => { docMap[r.docType] = (docMap[r.docType] || 0) + 1; });
  const byDocType = Object.entries(docMap).sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }));

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayCount = rows.filter((r) => new Date(r.at) >= today).length;
  const mostActiveUser = byUser[0]?.name ?? "—";
  const mostCommonAction = actionDist.sort((a, b) => b.value - a.value)[0]?.name ?? "—";

  // ── Table ─────────────────────────────────────────────────────────────────
  const columns: Column<ActivityRow>[] = [
    { key: "at", header: "Timestamp", render: (r) => new Date(r.at).toLocaleString("en-GB") },
    { key: "userFullName", header: "User" },
    { key: "docType", header: "Doc Type" },
    { key: "docNo", header: "Doc No" },
    { key: "action", header: "Action", render: (r) => <Badge tone={actionTone(r.action)}>{r.action}</Badge> },
  ];

  return (
    <ScreenGuard screen="User Activity">
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stat summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[
          { label: "Total events", value: String(rows.length) },
          { label: "Today", value: String(todayCount) },
          { label: "Most active user", value: mostActiveUser },
          { label: "Most common action", value: mostCommonAction },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", boxShadow: "var(--shadow)" }}>
            <p style={{ margin: "0 0 4px", fontSize: "var(--fs-xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)", fontWeight: 600 }}>{label}</p>
            <p style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Row 1: Daily trend + Action breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem" }}>
        <Card title="Activity trend — last 14 days">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gCreated" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4ade80" stopOpacity={0.2} /><stop offset="95%" stopColor="#4ade80" stopOpacity={0} /></linearGradient>
                <linearGradient id="gUpdated" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} /><stop offset="95%" stopColor="#38bdf8" stopOpacity={0} /></linearGradient>
                <linearGradient id="gDeleted" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f87171" stopOpacity={0.2} /><stop offset="95%" stopColor="#f87171" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="day" tick={axisStyle} />
              <YAxis tick={axisStyle} allowDecimals={false} />
              <Tooltip cursor={false} content={<CountTip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Area type="monotone" dataKey="Created" stroke="#4ade80" fill="url(#gCreated)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Updated" stroke="#38bdf8" fill="url(#gUpdated)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Deleted" stroke="#f87171" fill="url(#gDeleted)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Action breakdown">
          {actionDist.length === 0
            ? <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>No activity yet</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={actionDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {actionDist.map((e) => <Cell key={e.name} fill={ACTION_COLORS[e.name] || "#94a3b8"} />)}
                  </Pie>
                  <Tooltip cursor={false} content={<PieTip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
        </Card>
      </div>

      {/* Row 2: By user + By doc type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <Card title="Most active users">
          {byUser.length === 0
            ? <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>No data yet</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byUser} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={axisStyle} width={120} />
                  <Tooltip cursor={false} content={<CountTip />} />
                  <Bar dataKey="Actions" fill="#a78bfa" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </Card>

        <Card title="Activity by document type">
          {byDocType.length === 0
            ? <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-sm)", margin: "3rem 0", textAlign: "center" }}>No data yet</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byDocType} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value">
                    {byDocType.map((_, i) => <Cell key={i} fill={DOC_COLORS[i % DOC_COLORS.length]} />)}
                  </Pie>
                  <Tooltip cursor={false} content={<PieTip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
        </Card>
      </div>

      {/* Row 3: Stacked daily bar by action */}
      <Card title="Daily actions breakdown — last 14 days">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="day" tick={axisStyle} />
            <YAxis tick={axisStyle} allowDecimals={false} />
            <Tooltip cursor={false} content={<CountTip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            <Bar dataKey="Created" stackId="a" fill="#4ade80" />
            <Bar dataKey="Updated" stackId="a" fill="#38bdf8" />
            <Bar dataKey="Deleted" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Activity log table */}
      <Card title="Activity log" subtitle="Last 200 entries" actions={rights.print ? <ExportActions columns={columns} rows={rows} filename="user-activity" /> : undefined}>
        {isLoading
          ? <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
          : <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No activity recorded" />}
      </Card>
    </div>
    </ScreenGuard>
  );
}
