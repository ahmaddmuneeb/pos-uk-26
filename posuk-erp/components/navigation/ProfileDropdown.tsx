"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, KeyRound, LogOut, ChevronDown } from "lucide-react";

interface Me { fullName: string; email: string | null; role: { name: string }; branch: { name: string } }

const menuItem: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10, width: "100%",
  padding: "0.5rem 0.75rem", border: "none", background: "transparent",
  color: "var(--text)", cursor: "pointer", borderRadius: "var(--radius-sm)",
  fontSize: "var(--fs-sm)", textAlign: "left",
};

export function ProfileDropdown({ user }: { user: { fullName: string; role: string; branchName: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Live-sync name/initials from /api/me so profile edits reflect immediately
  const { data: me } = useQuery<Me>({
    queryKey: ["me"],
    queryFn: () => fetch("/api/me").then((r) => r.json()),
    staleTime: 30_000,
  });

  const displayName = me?.fullName ?? user.fullName;
  const displayRole = me?.role.name ?? user.role;
  const displayBranch = me?.branch.name ?? user.branchName;
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (path: string) => { setOpen(false); router.push(path); };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "transparent", border: "1px solid transparent", borderRadius: "var(--radius-sm)", padding: "0.3rem 0.5rem", cursor: "pointer", transition: "border-color 120ms, background 120ms" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
      >
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--primary)", display: "grid", placeItems: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials}</span>
        <div style={{ lineHeight: 1.15, textAlign: "left" }}>
          <div style={{ fontSize: "var(--fs-base)", fontWeight: 600, color: "var(--text)" }}>{displayName}</div>
          <div style={{ fontSize: "var(--fs-2xs)", color: "var(--text-subtle)" }}>{displayRole}</div>
        </div>
        <ChevronDown size={14} style={{ color: "var(--text-subtle)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms" }} />
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", width: 220, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 12px 32px rgba(0,0,0,0.4)", zIndex: 50, padding: "0.375rem", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ padding: "0.5rem 0.75rem 0.625rem" }}>
            <p style={{ margin: "0 0 1px", fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text)" }}>{displayName}</p>
            <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>{displayRole} · {displayBranch}</p>
          </div>
          <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />
          <button style={menuItem} onClick={() => go("/profile")} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <User size={14} style={{ color: "var(--text-subtle)", flexShrink: 0 }} /> My Profile
          </button>
          <button style={menuItem} onClick={() => go("/profile#password")} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <KeyRound size={14} style={{ color: "var(--text-subtle)", flexShrink: 0 }} /> Change Password
          </button>
          <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />
          <button style={{ ...menuItem, color: "var(--danger)" }} onClick={() => signOut({ callbackUrl: "/login" })} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <LogOut size={14} style={{ flexShrink: 0 }} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
