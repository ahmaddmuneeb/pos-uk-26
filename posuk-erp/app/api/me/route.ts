import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const UpdateSchema = z.object({
  fullName: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const row = await db.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { id: true, username: true, fullName: true, email: true, role: { select: { name: true } }, branch: { select: { name: true } }, status: true, lastLogin: true },
    });
    return NextResponse.json(row);
  } catch (e: unknown) { return apiError(e); }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();
    const body = UpdateSchema.parse(await req.json());
    const updated = await db.user.update({
      where: { id: user.id },
      data: { fullName: body.fullName, email: body.email || null },
      select: { id: true, username: true, fullName: true, email: true },
    });
    return NextResponse.json(updated);
  } catch (e: unknown) { return apiError(e); }
}
