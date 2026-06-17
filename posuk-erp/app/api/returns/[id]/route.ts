import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Sale Returns", "delete");
    const { id } = await params;
    const ret = await db.saleReturn.findUniqueOrThrow({ where: { id }, select: { no: true } });
    await db.$transaction([
      db.ledgerEntry.deleteMany({ where: { returnId: id } }),
      db.stockLedger.deleteMany({ where: { docNo: ret.no } }),
      db.saleReturn.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return apiError(e);
  }
}
