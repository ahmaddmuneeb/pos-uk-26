"use client";
import { useState, useEffect, useId } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { Input } from "@/components/forms/Input";
import { Field } from "@/components/forms/Field";
import { Button } from "@/components/core/Button";
import { User, Mail, KeyRound, AtSign, Shield, Building2, CheckCircle2 } from "lucide-react";

interface Me {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  role: { name: string };
  branch: { name: string };
  status: string;
  lastLogin: string | null;
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.625rem" }}>
        <span style={{ color: "var(--accent)" }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: "var(--fs-base)", fontWeight: 700, color: "var(--text)" }}>{title}</h2>
      </div>
      <div style={{ padding: "1.5rem" }}>{children}</div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: "var(--fs-2xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", color: "var(--text-subtle)" }}>{label}</span>
      <span style={{ fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.35rem 0.75rem", display: "inline-block" }}>{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const qc = useQueryClient();
  const passwordSectionId = useId();

  const { data: me, isLoading } = useQuery<Me>({
    queryKey: ["me"],
    queryFn: () => apiClient.get<Me>("/api/me").then((r) => r.data),
  });

  // ── Personal info ─────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [infoSaved, setInfoSaved] = useState(false);

  useEffect(() => {
    if (me) { setFullName(me.fullName); setEmail(me.email ?? ""); }
  }, [me]);

  const saveInfo = useMutation({
    mutationFn: () => apiClient.patch("/api/me", { fullName, email }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 2500);
      toast.success("Profile updated.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── Change password ───────────────────────────────────────────────────────
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSaved, setPwdSaved] = useState(false);

  const changePwd = useMutation({
    mutationFn: () => {
      if (next !== confirm) throw new Error("New passwords do not match.");
      return apiClient.post("/api/me/change-password", { currentPassword: current, newPassword: next }).then((r) => r.data);
    },
    onSuccess: () => {
      setCurrent(""); setNext(""); setConfirm(""); setPwdError("");
      setPwdSaved(true);
      setTimeout(() => setPwdSaved(false), 2500);
      toast.success("Password changed.");
    },
    onError: (e: Error) => { setPwdError(e.message); },
  });

  const initials = (me?.fullName ?? "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const lastLogin = me?.lastLogin ? new Date(me.lastLogin).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";

  if (isLoading) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-subtle)" }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Avatar + account summary */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.25rem 1.5rem", background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary)", display: "grid", placeItems: "center", fontSize: "1.4rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: "0 0 3px", fontSize: "var(--fs-xl)", fontWeight: 700, color: "var(--text)" }}>{me?.fullName}</h1>
          <p style={{ margin: 0, fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>@{me?.username} · {me?.role.name} · {me?.branch.name}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ margin: "0 0 2px", fontSize: "var(--fs-2xs)", color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)", fontWeight: 600 }}>Last login</p>
          <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>{lastLogin}</p>
        </div>
      </div>

      {/* Read-only account info chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", padding: "1rem 1.5rem", background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <Chip label="Username" value={`@${me?.username ?? ""}`} />
        <Chip label="Role" value={me?.role.name ?? ""} />
        <Chip label="Branch" value={me?.branch.name ?? ""} />
      </div>

      {/* Personal information */}
      <SectionCard title="Personal Information" icon={<User size={16} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Full name">
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none" }}><User size={14} /></span>
              <Input value={fullName} onChange={(e) => { setFullName(e.target.value); setInfoSaved(false); }} style={{ paddingLeft: "2.1rem" }} />
            </div>
          </Field>
          <Field label="Email address" hint={<span style={{ fontSize: "var(--fs-xs)", color: "var(--text-subtle)", fontWeight: 400 }}>Used for password reset</span>}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none" }}><Mail size={14} /></span>
              <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setInfoSaved(false); }} placeholder="you@example.com" style={{ paddingLeft: "2.1rem" }} />
            </div>
          </Field>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: "1.5rem" }}>
          {infoSaved && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--fs-sm)", color: "#4ade80" }}>
              <CheckCircle2 size={14} /> Saved
            </span>
          )}
          <Button onClick={() => saveInfo.mutate()} disabled={!fullName.trim() || saveInfo.isPending}>
            {saveInfo.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </SectionCard>

      {/* Change password */}
      <SectionCard title="Change Password" icon={<KeyRound size={16} />}>
        <div id={passwordSectionId} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Current password">
            <Input type="password" value={current} onChange={(e) => { setCurrent(e.target.value); setPwdError(""); setPwdSaved(false); }} autoComplete="current-password" />
          </Field>
          <Field label="New password">
            <Input type="password" value={next} onChange={(e) => { setNext(e.target.value); setPwdError(""); setPwdSaved(false); }} placeholder="At least 6 characters" autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setPwdError(""); setPwdSaved(false); }} autoComplete="new-password" />
          </Field>
          {pwdError && <p style={{ margin: 0, color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{pwdError}</p>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: "1.5rem" }}>
          {pwdSaved && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--fs-sm)", color: "#4ade80" }}>
              <CheckCircle2 size={14} /> Password updated
            </span>
          )}
          <Button onClick={() => changePwd.mutate()} disabled={!current || !next || !confirm || changePwd.isPending}>
            {changePwd.isPending ? "Updating…" : "Update password"}
          </Button>
        </div>
      </SectionCard>

    </div>
  );
}
