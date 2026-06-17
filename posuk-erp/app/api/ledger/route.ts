import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const customerId = req.nextUrl.searchParams.get("customerId");
    if (!customerId) {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }
    const entries = await db.ledgerEntry.findMany({
      where: { customerId },
      include: {
        invoice: { select: { id: true, no: true } },
        receipt: { select: { id: true, code: true } },
        saleReturn: { select: { id: true, no: true } },
      },
      orderBy: { date: "asc" },
    });

    let runningBalance = 0;
    const rows = entries.map((e) => {
      const debit = parseFloat(e.debit.toString());
      const credit = parseFloat(e.credit.toString());
      runningBalance += debit - credit;
      return {
        id: e.id,
        date: e.date,
        docType: e.docType,
        docNo: e.docNo,
        narration: e.narration,
        debit,
        credit,
        balance: runningBalance,
        invoiceId: e.invoiceId,
        receiptId: e.receiptId,
        returnId: e.returnId,
      };
    });

    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}
