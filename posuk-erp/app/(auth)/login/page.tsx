"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandMark } from "@/components/core/BrandMark";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/forms/Input";
import { Field } from "@/components/forms/Field";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signIn("credentials", { username, password, redirect: false });
    if (res?.error) {
      setError("Invalid username or password");
      setBusy(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1.5rem", backgroundColor: "var(--bg-base)", backgroundImage: "var(--wash-login)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2rem 2rem 1.75rem", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}><BrandMark size={48} /></div>
          <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, letterSpacing: "var(--tracking-tight)", color: "var(--text)" }}>Welcome back</h2>
          <p style={{ margin: "0.4rem 0 0", fontSize: "var(--fs-base)", color: "var(--text-muted)" }}>Sign in to continue to POS / ERP</p>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Username">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required />
          </Field>
          <Field label="Password" hint={<Link href="/forgot-password" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "var(--fs-xs)" }}>Forgot password?</Link>}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </Field>
          {error && <p style={{ margin: 0, color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
          <Button type="submit" block disabled={busy} style={{ marginTop: "0.25rem", padding: "0.7rem 1rem" }}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
