import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const PatchSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireRight("Categories", "edit");
    const data = PatchSchema.parse(await req.json());
    const row = await db.category.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (e: unknown) { return apiError(e); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireRight("Categories", "delete");
    await db.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2003") {
      return NextResponse.json({ error: "Cannot delete: this category has sub-categories or products linked to it." }, { status: 409 });
    }
    return apiError(e);
  }
}
