import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const PatchSchema = z.object({
  name: z.string().min(1).optional(),
  designation: z.string().optional(),
  region: z.string().optional(),
  commission: z.coerce.number().nonnegative().optional(),
  status: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireRight("Sale Persons", "edit");
    const data = PatchSchema.parse(await req.json());
    const row = await db.salePerson.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (e: unknown) { return apiError(e); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireRight("Sale Persons", "delete");
    await db.salePerson.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2003") {
      return NextResponse.json({ error: "Cannot delete: this sale person is linked to invoices or orders. Set them to Inactive instead." }, { status: 409 });
    }
    return apiError(e);
  }
}
