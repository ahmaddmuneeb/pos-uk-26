import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const PatchSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireRight("Products", "edit");
    const data = PatchSchema.parse(await req.json());
    const row = await db.location.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (e: unknown) { return apiError(e); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireRight("Products", "delete");
    await db.location.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2003") {
      return NextResponse.json({ error: "Cannot delete: this location has stock movements linked to it." }, { status: 409 });
    }
    return apiError(e);
  }
}
