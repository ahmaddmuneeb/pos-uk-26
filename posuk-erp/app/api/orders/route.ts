import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { postSaleOrder } from "@/lib/posting";
import { z } from "zod";
import { NextResponse } from "next/server";

const LineSchema = z.object({
  productId: z.string().min(1),
  qty: z.coerce.number().int().positive(),
  rate: z.coerce.number().nonnegative(),
  discount: z.coerce.number().nonnegative().default(0),
  vatRate: z.coerce.number().nonnegative().default(20),
});

const Schema = z.object({
  customerId: z.string().min(1),
  salePersonId: z.string().optional(),
  date: z.string().min(1),
  lines: z.array(LineSchema).min(1),
});

export async function GET() {
  try {
    await requireRight("Sale Orders", "view");
    const rows = await db.saleOrder.findMany({
      include: {
        customer: { select: { id: true, name: true, code: true } },
        salePerson: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        no: r.no,
        date: r.date,
        customerId: r.customerId,
        customerName: r.customer.name,
        salePersonName: r.salePerson?.name ?? null,
        branchName: r.branch.name,
        subtotal: parseFloat(r.subtotal.toString()),
        vatTotal: parseFloat(r.vatTotal.toString()),
        grandTotal: parseFloat(r.grandTotal.toString()),
        status: r.status,
        createdAt: r.createdAt,
      }))
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRight("Sale Orders", "create");
    const body = Schema.parse(await req.json());
    const order = await postSaleOrder(
      {
        branchId: user.branchId,
        customerId: body.customerId,
        salePersonId: body.salePersonId,
        date: new Date(body.date),
        lines: body.lines,
      },
      user.id
    );
    return NextResponse.json(order, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 400 });
  }
}
