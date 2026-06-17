import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireRight("Stock Ledger", "view");

    const products = await db.product.findMany({
      orderBy: { sku: "asc" },
      include: {
        uom: { select: { id: true, name: true } },
      },
    });

    const stockTotals = await db.stockLedger.groupBy({
      by: ["productId"],
      _sum: { qtyIn: true, qtyOut: true },
    });

    const stockMap = new Map(
      stockTotals.map((s) => [s.productId, (s._sum.qtyIn ?? 0) - (s._sum.qtyOut ?? 0)])
    );

    const rows = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      uomName: p.uom.name,
      balance: stockMap.get(p.id) ?? 0,
    }));

    return NextResponse.json(rows);
  } catch (e: unknown) {
    return apiError(e);
  }
}
