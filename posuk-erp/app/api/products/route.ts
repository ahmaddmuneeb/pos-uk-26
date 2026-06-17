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

export async function GET() {
  try {
    await requireRight("Products", "view");

    const products = await db.product.findMany({
      orderBy: { sku: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        sub: { select: { id: true, name: true } },
        uom: { select: { id: true, name: true } },
      },
    });

    // Compute stock balance per product using aggregate
    const stockTotals = await db.stockLedger.groupBy({
      by: ["productId"],
      _sum: { qtyIn: true, qtyOut: true },
    });

    const stockMap = new Map(
      stockTotals.map((s) => [
        s.productId,
        (s._sum.qtyIn ?? 0) - (s._sum.qtyOut ?? 0),
      ]),
    );

    const rows = products.map((p) => ({
      ...p,
      currentStock: stockMap.get(p.id) ?? 0,
    }));

    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: (e as { status?: number }).status || 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireRight("Products", "create");
    const body = await req.json();
    const data = Schema.parse(body);

    const product = await db.product.create({
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

    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: (e as { status?: number }).status || 400 },
    );
  }
}
