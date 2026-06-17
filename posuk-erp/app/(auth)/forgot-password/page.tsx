"use client";
import { useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/core/BrandMark";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/forms/Input";
import { Field } from "@/components/forms/Field";
import apiClient from "@/lib/apiClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiClient.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to send email. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1.5rem", backgroundColor: "var(--bg-base)", backgroundImage: "var(--wash-login)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2rem 2rem 1.75rem", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}><BrandMark size={48} /></div>
          <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, letterSpacing: "var(--tracking-tight)", color: "var(--text)" }}>Forgot password</h2>
          <p style={{ margin: "0.4rem 0 0", fontSize: "var(--fs-base)", color: "var(--text-muted)" }}>Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(74,222,128,0.15)", display: "grid", placeItems: "center", margin: "0 auto 1rem" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{ margin: "0 0 1.25rem", color: "var(--text)", fontSize: "var(--fs-base)" }}>
              If <strong>{email}</strong> is registered, a reset link has been sent. Check your inbox.
            </p>
            <Link href="/login" style={{ color: "var(--accent)", fontSize: "var(--fs-sm)", textDecoration: "none" }}>Back to login</Link>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field label="Email address">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required placeholder="you@example.com" />
            </Field>
            {error && <p style={{ margin: 0, color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
            <Button type="submit" block disabled={busy} style={{ marginTop: "0.25rem", padding: "0.7rem 1rem" }}>
              {busy ? "Sending…" : "Send reset link"}
            </Button>
            <p style={{ margin: 0, textAlign: "center", fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>
              <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>Back to login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
