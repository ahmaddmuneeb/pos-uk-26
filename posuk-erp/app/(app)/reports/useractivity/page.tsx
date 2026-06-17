"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

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
    case "Created":
      return "success";
    case "Updated":
      return "info";
    case "Deleted":
      return "danger";
    default:
      return "neutral";
  }
}

export default function UserActivityReportPage() {
  const { data: rows = [], isLoading } = useQuery<ActivityRow[]>({
    queryKey: ["useractivity"],
    queryFn: () => fetchArray("/api/reports/useractivity"),
  });

  const columns: Column<ActivityRow>[] = [
    { key: "at", header: "Timestamp", render: (r) => new Date(r.at).toLocaleString("en-GB") },
    { key: "userFullName", header: "User" },
    { key: "docType", header: "Doc Type" },
    { key: "docNo", header: "Doc No" },
    {
      key: "action",
      header: "Action",
      render: (r) => <Badge tone={actionTone(r.action)}>{r.action}</Badge>,
    },
  ];

  return (
    <Card title="User Activity" subtitle="Recent system activity log (last 200 entries)" actions={<ExportActions columns={columns} rows={rows} filename="user-activity" />}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No activity recorded" />
      )}
    </Card>
  );
}
