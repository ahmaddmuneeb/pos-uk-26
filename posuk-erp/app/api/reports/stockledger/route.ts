import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireRight("Stock Ledger", "view");
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const entries = await db.stockLedger.findMany({
      where: { productId },
      include: {
        location: { select: { id: true, name: true } },
      },
      orderBy: { date: "asc" },
    });

    let runningBalance = 0;
    const rows = entries.map((e) => {
      runningBalance += e.qtyIn - e.qtyOut;
      return {
        id: e.id,
        date: e.date,
        docType: e.docType,
        docNo: e.docNo,
        locationName: e.location.name,
        qtyIn: e.qtyIn,
        qtyOut: e.qtyOut,
        balance: runningBalance,
      };
    });

    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}
