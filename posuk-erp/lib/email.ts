import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "POS ERP <onboarding@resend.dev>";
const APP = "POS ERP";

function base(body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:2.5rem 1rem">
<table width="100%" style="max-width:520px;background:#1e293b;border:1px solid #334155;border-radius:12px;overflow:hidden" cellpadding="0" cellspacing="0">
  <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:1.5rem 2rem;border-bottom:1px solid #334155">
    <p style="margin:0;font-size:1.1rem;font-weight:700;color:#22d3ee;letter-spacing:-0.01em">${APP}</p>
  </td></tr>
  <tr><td style="padding:2rem">${body}</td></tr>
  <tr><td style="padding:1rem 2rem;border-top:1px solid #334155;background:#0f172a">
    <p style="margin:0;font-size:0.75rem;color:#475569">This is an automated security notification from ${APP}. Do not reply to this email.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function h(text: string) {
  return `<h1 style="margin:0 0 0.75rem;font-size:1.2rem;font-weight:700;color:#f1f5f9">${text}</h1>`;
}

function p(text: string, subtle = false) {
  return `<p style="margin:0 0 0.75rem;font-size:0.9rem;line-height:1.6;color:${subtle ? "#94a3b8" : "#cbd5e1"}">${text}</p>`;
}

function info(rows: { label: string; value: string }[]) {
  const cells = rows.map(({ label, value }) =>
    `<tr><td style="padding:0.4rem 0.75rem;font-size:0.8rem;color:#64748b;white-space:nowrap;font-weight:600;text-transform:uppercase;letter-spacing:0.04em">${label}</td><td style="padding:0.4rem 0.75rem;font-size:0.85rem;color:#e2e8f0;font-weight:500">${value}</td></tr>`
  ).join("");
  return `<table style="width:100%;background:#0f172a;border:1px solid #334155;border-radius:8px;margin:1rem 0;border-collapse:collapse">${cells}</table>`;
}

function warn(text: string) {
  return `<div style="margin-top:1.25rem;padding:0.75rem 1rem;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.25);border-radius:8px"><p style="margin:0;font-size:0.82rem;color:#fca5a5">⚠️ ${text}</p></div>`;
}

function now() {
  return new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";
}

const LOCAL_IPS = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1", "localhost", "unknown"]);

async function getLocation(ip: string): Promise<{ ip: string; location: string }> {
  const clean = ip.replace("::ffff:", "");
  if (!clean || LOCAL_IPS.has(clean.toLowerCase())) {
    return { ip: clean || "Unknown", location: "Local / Development" };
  }
  try {
    const res = await fetch(`https://ipapi.co/${clean}/json/`, {
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "posuk-erp/1.0" },
    });
    if (!res.ok) return { ip: clean, location: "Unknown" };
    const d = await res.json() as { city?: string; region?: string; country_name?: string; error?: boolean };
    if (d.error) return { ip: clean, location: "Unknown" };
    const parts = [d.city, d.region, d.country_name].filter(Boolean);
    return { ip: clean, location: parts.length ? parts.join(", ") : "Unknown" };
  } catch {
    return { ip: clean, location: "Unknown" };
  }
}

export async function sendLoginAlert(
  user: { email: string | null; fullName: string; username: string; branch: { name: string } },
  rawIp?: string,
) {
  if (!user.email) return;
  const { ip, location } = rawIp ? await getLocation(rawIp) : { ip: "Unknown", location: "Unknown" };
  const { error } = await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `New sign-in to your ${APP} account`,
    html: base(
      h("New sign-in detected") +
      p(`Hi ${user.fullName}, a new sign-in to your account was recorded.`) +
      info([
        { label: "Username", value: `@${user.username}` },
        { label: "Branch", value: user.branch.name },
        { label: "IP address", value: ip },
        { label: "Location", value: location },
        { label: "Time", value: now() },
      ]) +
      warn("If this wasn't you, contact your administrator and change your password immediately.")
    ),
  });
  if (error) console.error("[email] sendLoginAlert:", error.message);
}

export async function sendPasswordChanged(user: { email: string | null; fullName: string; username: string }) {
  if (!user.email) return;
  const { error } = await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `Your ${APP} password was changed`,
    html: base(
      h("Password changed") +
      p(`Hi ${user.fullName}, your account password was changed successfully.`) +
      info([
        { label: "Username", value: `@${user.username}` },
        { label: "Time", value: now() },
      ]) +
      warn("If you did not make this change, contact your administrator immediately.")
    ),
  });
  if (error) console.error("[email] sendPasswordChanged:", error.message);
}

export async function sendPasswordReset(user: { email: string | null; fullName: string; username: string }) {
  if (!user.email) return;
  const { error } = await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `Your ${APP} password was reset`,
    html: base(
      h("Password reset successful") +
      p(`Hi ${user.fullName}, your password was reset successfully via the password recovery flow.`) +
      info([
        { label: "Username", value: `@${user.username}` },
        { label: "Time", value: now() },
      ]) +
      warn("If you did not request this reset, contact your administrator immediately.")
    ),
  });
  if (error) console.error("[email] sendPasswordReset:", error.message);
}
