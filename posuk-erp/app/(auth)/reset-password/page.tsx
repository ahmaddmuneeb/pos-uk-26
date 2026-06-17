"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BrandMark } from "@/components/core/BrandMark";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/forms/Input";
import { Field } from "@/components/forms/Field";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "var(--danger)", marginBottom: "1rem" }}>Invalid reset link.</p>
      <Link href="/forgot-password" style={{ color: "var(--accent)", fontSize: "var(--fs-sm)", textDecoration: "none" }}>Request a new one</Link>
    </div>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error ?? "Something went wrong."); setBusy(false); return; }
    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  };

  return done ? (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(74,222,128,0.15)", display: "grid", placeItems: "center", margin: "0 auto 1rem" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <p style={{ color: "var(--text)", marginBottom: "0.5rem" }}>Password updated! Redirecting to login…</p>
    </div>
  ) : (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Field label="New password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required minLength={6} placeholder="At least 6 characters" />
      </Field>
      <Field label="Confirm password">
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Repeat new password" />
      </Field>
      {error && <p style={{ margin: 0, color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
      <Button type="submit" block disabled={busy} style={{ marginTop: "0.25rem", padding: "0.7rem 1rem" }}>
        {busy ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1.5rem", backgroundColor: "var(--bg-base)", backgroundImage: "var(--wash-login)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2rem 2rem 1.75rem", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}><BrandMark size={48} /></div>
          <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, letterSpacing: "var(--tracking-tight)", color: "var(--text)" }}>Set new password</h2>
          <p style={{ margin: "0.4rem 0 0", fontSize: "var(--fs-base)", color: "var(--text-muted)" }}>Choose a strong password for your account</p>
        </div>
        <Suspense>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
