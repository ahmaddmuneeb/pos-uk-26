"use client";
import { useRights } from "@/components/auth/RightsContext";
import { ShieldX } from "lucide-react";

export function ScreenGuard({ screen, children }: { screen: string; children: React.ReactNode }) {
  const { view } = useRights(screen);
  if (!view) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "1rem", color: "var(--text-subtle)" }}>
      <ShieldX size={48} style={{ opacity: 0.4 }} />
      <p style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: 600 }}>Access Denied</p>
      <p style={{ margin: 0, fontSize: "var(--fs-sm)" }}>You do not have permission to view this page.</p>
    </div>
  );
  return <>{children}</>;
}
