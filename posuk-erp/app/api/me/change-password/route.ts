import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { sendPasswordChanged } from "@/lib/email";
import { z } from "zod";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const Schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const { currentPassword, newPassword } = Schema.parse(await req.json());
    const user = await db.user.findUniqueOrThrow({ where: { id: session.id } });
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new Error("Current password is incorrect.");
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.user.update({ where: { id: session.id }, data: { passwordHash } });
    void sendPasswordChanged(user).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e: unknown) { return apiError(e); }
}
