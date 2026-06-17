import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const Schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const { email } = Schema.parse(await req.json());
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      await db.passwordResetToken.deleteMany({ where: { userId: user.id, used: false } });
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const { token } = await db.passwordResetToken.create({ data: { userId: user.id, expiresAt } });
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "POS ERP <onboarding@resend.dev>",
        to: email,
        subject: "Reset your password",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem">
            <h2 style="margin:0 0 1rem;font-size:1.4rem">Reset your password</h2>
            <p style="margin:0 0 1.5rem;color:#64748b">Hi ${user.fullName}, click the button below to set a new password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;padding:0.75rem 1.5rem;background:#22d3ee;color:#0f172a;text-decoration:none;border-radius:6px;font-weight:700">Reset password</a>
            <p style="margin:1.5rem 0 0;font-size:0.8rem;color:#94a3b8">If you didn't request this, you can safely ignore this email.</p>
          </div>`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
