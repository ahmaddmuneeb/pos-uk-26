import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { postReturn } from "@/lib/posting";
import { z } from "zod";
import { NextResponse } from "next/server";

const LineSchema = z.object({
  productId: z.string().min(1),
  qty: z.coerce.number().int().positive(),
  rate: z.coerce.number().nonnegative(),
  vatRate: z.coerce.number().nonnegative().default(20),
});

const Schema = z.object({
  invoiceId: z.string().min(1),
  reason: z.string().optional(),
  date: z.string().min(1),
  lines: z.array(LineSchema).min(1),
});

export async function GET() {
  try {
    await requireRight("Sale Returns", "view");
    const rows = await db.saleReturn.findMany({
      include: {
        invoice: {
          select: {
            id: true,
            no: true,
            customer: { select: { id: true, name: true } },
          },
        },
        lines: { include: { product: { select: { id: true, name: true, sku: true } } } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        no: r.no,
        date: r.date,
        reason: r.reason,
        invoiceId: r.invoiceId,
        invoiceNo: r.invoice.no,
        customerName: r.invoice.customer.name,
        subtotal: parseFloat(r.subtotal.toString()),
        vatTotal: parseFloat(r.vatTotal.toString()),
        grandTotal: parseFloat(r.grandTotal.toString()),
        lines: r.lines.map((l) => ({
          id: l.id,
          productId: l.productId,
          productName: l.product.name,
          sku: l.product.sku,
          qty: l.qty,
          rate: parseFloat(l.rate.toString()),
          vatRate: parseFloat(l.vatRate.toString()),
          lineTotal: parseFloat(l.lineTotal.toString()),
        })),
        createdAt: r.createdAt,
      }))
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRight("Sale Returns", "create");
    const body = Schema.parse(await req.json());
    const ret = await postReturn(
      {
        invoiceId: body.invoiceId,
        reason: body.reason,
        date: new Date(body.date),
        lines: body.lines,
      },
      user.id
    );
    return NextResponse.json(ret, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 400 });
  }
}
