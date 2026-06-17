"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";
import { useRights } from "@/components/auth/RightsContext";
import { ScreenGuard } from "@/components/auth/ScreenGuard";

interface ActiveUserRow {
  id: string;
  username: string;
  fullName: string;
  roleName: string;
  branchName: string;
  lastLogin: string | null;
}

export default function ActiveUsersReportPage() {
  const rights = useRights("Active Users");
  const { data: rows = [], isLoading } = useQuery<ActiveUserRow[]>({
    queryKey: ["activeusers"],
    queryFn: () => fetchArray("/api/reports/activeusers"),
  });

  const columns: Column<ActiveUserRow>[] = [
    { key: "username", header: "Username" },
    { key: "fullName", header: "Full Name" },
    { key: "roleName", header: "Role" },
    { key: "branchName", header: "Branch" },
    {
      key: "lastLogin",
      header: "Last Login",
      render: (r) => (r.lastLogin ? new Date(r.lastLogin).toLocaleString("en-GB") : "—"),
    },
  ];

  return (
    <ScreenGuard screen="Active Users">
    <Card title="Active Users" subtitle="Currently active system users" actions={rights.print ? <ExportActions columns={columns} rows={rows} filename="active-users" /> : undefined}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No active users" />
      )}
    </Card>
    </ScreenGuard>
  );
}
