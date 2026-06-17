import { db } from "@/lib/db";
import { requireRight, requireAuth } from "@/lib/auth";
import { postReceipt } from "@/lib/posting";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({
  customerId: z.string().min(1),
  amount: z.coerce.number().positive(),
  mode: z.string().min(1),
  reference: z.string().optional(),
  date: z.string().min(1),
});

export async function GET() {
  try {
    await requireRight("Customer Receipts", "view");
    const rows = await db.receipt.findMany({
      include: { customer: { select: { id: true, name: true, code: true } } },
      orderBy: { date: "desc" },
      take: 50,
    });
    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRight("Customer Receipts", "create");
    const body = Schema.parse(await req.json());
    const receipt = await postReceipt(
      {
        customerId: body.customerId,
        amount: body.amount,
        mode: body.mode,
        reference: body.reference,
        date: new Date(body.date),
        branchId: user.branchId,
      },
      user.id
    );
    return NextResponse.json(receipt, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 400 });
  }
}
