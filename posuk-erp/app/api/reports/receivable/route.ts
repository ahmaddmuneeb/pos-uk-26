import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireRight("Receivable", "view");

    const totals = await db.ledgerEntry.groupBy({
      by: ["customerId"],
      _sum: { debit: true, credit: true },
    });

    const customerIds = totals.map((t) => t.customerId);
    const customers = await db.customer.findMany({
      where: { id: { in: customerIds } },
      include: { type: { select: { name: true } } },
    });
    const customerMap = new Map(customers.map((c) => [c.id, c]));

    const rows = totals
      .map((t) => {
        const debit = parseFloat((t._sum.debit ?? 0).toString());
        const credit = parseFloat((t._sum.credit ?? 0).toString());
        const balance = debit - credit;
        const c = customerMap.get(t.customerId);
        return {
          customerId: t.customerId,
          code: c?.code ?? "",
          name: c?.name ?? "",
          typeName: c?.type.name ?? "",
          phone: c?.phone ?? null,
          balance,
        };
      })
      .filter((r) => r.balance > 0.01)
      .sort((a, b) => b.balance - a.balance);

    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}
