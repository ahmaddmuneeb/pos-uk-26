import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const ToggleSchema = z.object({ active: z.boolean() });

const Schema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  type: z.string().default("Finished"),
  categoryId: z.string().min(1),
  subId: z.string().min(1),
  uomId: z.string().min(1),
  purchaseRate: z.number().nonnegative().default(0),
  wholesaleRate: z.number().nonnegative().default(0),
  retailRate: z.number().nonnegative().default(0),
  reorderLevel: z.number().int().nonnegative().default(0),
  barcode: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Products", "delete");
    const { id } = await params;
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2003") {
      return NextResponse.json({ error: "Cannot delete: this product is linked to invoices, orders or stock movements. Deactivate it instead." }, { status: 409 });
    }
    return apiError(e);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Products", "edit");
    const { id } = await params;
    const body = await req.json();

    if (Object.keys(body).length === 1 && "active" in body) {
      const { active } = ToggleSchema.parse(body);
      const product = await db.product.update({ where: { id }, data: { active } });
      return NextResponse.json(product);
    }

    const data = Schema.parse(body);
    const product = await db.product.update({
      where: { id },
      data: {
        sku: data.sku,
        name: data.name,
        type: data.type,
        categoryId: data.categoryId,
        subId: data.subId,
        uomId: data.uomId,
        purchaseRate: data.purchaseRate,
        wholesaleRate: data.wholesaleRate,
        retailRate: data.retailRate,
        reorderLevel: data.reorderLevel,
        barcode: data.barcode ?? null,
        active: data.active,
      },
    });

    return NextResponse.json(product);
  } catch (e: unknown) {
    return apiError(e);
  }
}
