import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Products", "edit");
    const { id } = await params;
    const body = await req.json();
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
    return NextResponse.json(
      { error: (e as Error).message },
      { status: (e as { status?: number }).status || 400 },
    );
  }
}
