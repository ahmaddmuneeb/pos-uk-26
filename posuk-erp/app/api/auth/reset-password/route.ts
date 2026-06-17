import { db } from "@/lib/db";
import { apiError } from "@/lib/apiError";
import { sendPasswordReset } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { isRateLimited, clientIp } from "@/lib/rateLimit";

const Schema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    if (isRateLimited(`reset-pw:${clientIp(req)}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }
    const { token, newPassword } = Schema.parse(await req.json());
    const reset = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!reset) throw new Error("Invalid or expired reset link.");
    if (reset.used) throw new Error("This reset link has already been used.");
    if (reset.expiresAt < new Date()) throw new Error("This reset link has expired. Please request a new one.");
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.$transaction([
      db.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
      db.passwordResetToken.update({ where: { id: reset.id }, data: { used: true } }),
    ]);
    void sendPasswordReset(reset.user).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e: unknown) { return apiError(e); }
}
