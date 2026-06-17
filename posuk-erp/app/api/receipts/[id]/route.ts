import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireRight("Customer Receipts", "delete");
    await db.$transaction([
      db.ledgerEntry.deleteMany({ where: { receiptId: id } }),
      db.receipt.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) { return apiError(e); }
}
