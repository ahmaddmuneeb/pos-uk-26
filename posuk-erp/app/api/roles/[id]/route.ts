import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({ name: z.string().min(1).max(64) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("User Rights", "edit");
    const { id } = await params;
    const { name } = Schema.parse(await req.json());
    const role = await db.role.update({ where: { id }, data: { name } });
    return NextResponse.json(role);
  } catch (e: unknown) { return apiError(e); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("User Rights", "delete");
    const { id } = await params;
    const userCount = await db.user.count({ where: { roleId: id } });
    if (userCount > 0) throw new Error(`Cannot delete role: ${userCount} user(s) are assigned to it. Reassign them first.`);
    await db.role.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) { return apiError(e); }
}
