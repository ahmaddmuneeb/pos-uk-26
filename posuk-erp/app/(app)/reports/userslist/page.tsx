"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/data-display/Card";
import { DataTable, Column } from "@/components/data-display/DataTable";
import { Badge } from "@/components/data-display/Badge";
import { ExportActions } from "@/components/ui/ScreenHelpers";
import { fetchArray } from "@/lib/fetchJson";

interface UserRow {
  id: string;
  username: string;
  fullName: string;
  roleName: string;
  branchName: string;
  status: string;
}

export default function UsersListReportPage() {
  const { data: rows = [], isLoading } = useQuery<UserRow[]>({
    queryKey: ["users"],
    queryFn: () => fetchArray("/api/users"),
  });

  const columns: Column<UserRow>[] = [
    { key: "username", header: "Username" },
    { key: "fullName", header: "Full Name" },
    { key: "roleName", header: "Role" },
    { key: "branchName", header: "Branch" },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge tone={r.status === "Active" ? "success" : "neutral"}>{r.status}</Badge>,
    },
  ];

  return (
    <Card title="Users List" subtitle="All system users" actions={<ExportActions columns={columns} rows={rows} filename="users-list" />}>
      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty="No users found" />
      )}
    </Card>
  );
}
