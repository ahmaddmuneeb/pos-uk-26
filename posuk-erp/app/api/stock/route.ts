import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") ?? undefined;
    const locationId = searchParams.get("locationId") ?? undefined;

    if (!productId && !locationId) {
      return NextResponse.json({ error: "Provide at least productId or locationId" }, { status: 400 });
    }

    const where = {
      ...(productId ? { productId } : {}),
      ...(locationId ? { locationId } : {}),
    };

    const result = await db.stockLedger.aggregate({
      where,
      _sum: {
        qtyIn: true,
        qtyOut: true,
      },
    });

    const qtyIn = result._sum.qtyIn ?? 0;
    const qtyOut = result._sum.qtyOut ?? 0;
    const balance = qtyIn - qtyOut;

    return NextResponse.json({ qtyIn, qtyOut, balance });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: (e as { status?: number }).status || 500 },
    );
  }
}
