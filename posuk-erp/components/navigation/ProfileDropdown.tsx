"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/forms/Input";
import { Field } from "@/components/forms/Field";
import { toast } from "sonner";
import { User, KeyRound, LogOut, X, ChevronDown } from "lucide-react";

interface ProfileData { id: string; username: string; fullName: string; email: string | null; role: { name: string }; branch: { name: string } }

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "grid", placeItems: "center", background: "rgba(0,0,0,0.6)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-lg)", fontWeight: 700, color: "var(--text)" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", padding: 4, display: "grid", placeItems: "center" }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["me"],
    queryFn: () => fetch("/api/me").then((r) => r.json()),
  });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => { if (profile) { setFullName(profile.fullName); setEmail(profile.email ?? ""); } }, [profile]);

  const save = useMutation({
    mutationFn: () => fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, email }) }).then(async (r) => { if (!r.ok) { const j = await r.json(); throw new Error(j.error ?? "Failed to update profile"); } return r.json(); }),
    onSuccess: () => { toast.success("Profile updated."); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p style={{ color: "var(--text-subtle)", textAlign: "center", padding: "1rem 0" }}>Loading…</p>;

  return (
    <>
      {profile && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "rgba(34,211,238,0.06)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
          <p style={{ margin: "0 0 2px", fontSize: "var(--fs-xs)", color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", fontWeight: 600 }}>Account</p>
          <p style={{ margin: "0 0 1px", fontSize: "var(--fs-base)", fontWeight: 600, color: "var(--text)" }}>@{profile.username}</p>
          <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>{profile.role.name} · {profile.branch.name}</p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Full name">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} autoFocus />
        </Field>
        <Field label="Email address" hint="Used for password reset">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </Field>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "1.25rem" }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} disabled={!fullName.trim() || save.isPending}>Save changes</Button>
      </div>
    </>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const save = useMutation({
    mutationFn: () => {
      if (next !== confirm) throw new Error("New passwords do not match.");
      return fetch("/api/me/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: current, newPassword: next }) })
        .then(async (r) => { if (!r.ok) { const j = await r.json(); throw new Error(j.error ?? "Failed"); } return r.json(); });
    },
    onSuccess: () => { toast.success("Password changed."); onClose(); },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Current password">
          <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoFocus />
        </Field>
        <Field label="New password">
          <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 6 characters" />
        </Field>
        <Field label="Confirm new password">
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        {error && <p style={{ margin: 0, color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "1.25rem" }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} disabled={!current || !next || !confirm || save.isPending}>Change password</Button>
      </div>
    </>
  );
}

const menuItem: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10, width: "100%",
  padding: "0.5rem 0.75rem", border: "none", background: "transparent",
  color: "var(--text)", cursor: "pointer", borderRadius: "var(--radius-sm)",
  fontSize: "var(--fs-sm)", textAlign: "left",
};

export function ProfileDropdown({ user }: { user: { fullName: string; role: string; branchName: string } }) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<"profile" | "password" | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const initials = user.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const open_modal = (m: "profile" | "password") => { setOpen(false); setModal(m); };

  return (
    <>
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "transparent", border: "1px solid transparent", borderRadius: "var(--radius-sm)", padding: "0.3rem 0.5rem", cursor: "pointer", transition: "border-color 120ms, background 120ms" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--primary)", display: "grid", placeItems: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials}</span>
          <div style={{ lineHeight: 1.15, textAlign: "left" }}>
            <div style={{ fontSize: "var(--fs-base)", fontWeight: 600, color: "var(--text)" }}>{user.fullName}</div>
            <div style={{ fontSize: "var(--fs-2xs)", color: "var(--text-subtle)" }}>{user.role}</div>
          </div>
          <ChevronDown size={14} style={{ color: "var(--text-subtle)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms" }} />
        </button>

        {open && (
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", width: 220, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 12px 32px rgba(0,0,0,0.4)", zIndex: 50, padding: "0.375rem", display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ padding: "0.5rem 0.75rem 0.625rem" }}>
              <p style={{ margin: "0 0 1px", fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text)" }}>{user.fullName}</p>
              <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>{user.role} · {user.branchName}</p>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />
            <button style={menuItem} onClick={() => open_modal("profile")} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <User size={14} style={{ color: "var(--text-subtle)", flexShrink: 0 }} /> My Profile
            </button>
            <button style={menuItem} onClick={() => open_modal("password")} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <KeyRound size={14} style={{ color: "var(--text-subtle)", flexShrink: 0 }} /> Change Password
            </button>
            <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />
            <button style={{ ...menuItem, color: "var(--danger)" }} onClick={() => signOut({ callbackUrl: "/login" })} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <LogOut size={14} style={{ flexShrink: 0 }} /> Log out
            </button>
          </div>
        )}
      </div>

      {modal === "profile" && <Overlay title="My Profile" onClose={() => setModal(null)}><ProfileModal onClose={() => setModal(null)} /></Overlay>}
      {modal === "password" && <Overlay title="Change Password" onClose={() => setModal(null)}><ChangePasswordModal onClose={() => setModal(null)} /></Overlay>}
    </>
  );
}
