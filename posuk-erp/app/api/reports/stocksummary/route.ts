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
        category: { select: { id: true, name: true } },
      },
    });

    const stockTotals = await db.stockLedger.groupBy({
      by: ["productId"],
      _sum: { qtyIn: true, qtyOut: true },
    });

    const stockMap = new Map(
      stockTotals.map((s) => [s.productId, { qtyIn: s._sum.qtyIn ?? 0, qtyOut: s._sum.qtyOut ?? 0 }])
    );

    const rows = products.map((p) => {
      const totals = stockMap.get(p.id) ?? { qtyIn: 0, qtyOut: 0 };
      const balance = totals.qtyIn - totals.qtyOut;
      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        categoryName: p.category.name,
        qtyIn: totals.qtyIn,
        qtyOut: totals.qtyOut,
        balance,
        reorderLevel: p.reorderLevel,
      };
    });

    return NextResponse.json(rows);
  } catch (e: unknown) {
    return apiError(e);
  }
}
