import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { postInvoice } from "@/lib/posting";
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
  orderId: z.string().optional(),
  locationId: z.string().min(1),
  date: z.string().min(1),
  dueDate: z.string().min(1),
  notes: z.string().optional(),
  lines: z.array(LineSchema).min(1),
});

export async function GET() {
  try {
    await requireRight("Sale Invoices", "view");
    const rows = await db.invoice.findMany({
      include: {
        customer: { select: { id: true, name: true, code: true } },
        salePerson: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(
      rows.map((r) => {
        const grandTotal = parseFloat(r.grandTotal.toString());
        const paidTotal = parseFloat(r.paidTotal.toString());
        return {
          id: r.id,
          no: r.no,
          date: r.date,
          dueDate: r.dueDate,
          customerId: r.customerId,
          customerName: r.customer.name,
          salePersonName: r.salePerson?.name ?? null,
          subtotal: parseFloat(r.subtotal.toString()),
          vatTotal: parseFloat(r.vatTotal.toString()),
          grandTotal,
          paidTotal,
          outstanding: grandTotal - paidTotal,
          status: r.status,
          notes: r.notes,
          createdAt: r.createdAt,
        };
      })
    );
  } catch (e: unknown) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRight("Sale Invoices", "create");
    const body = Schema.parse(await req.json());
    const invoice = await postInvoice(
      {
        branchId: user.branchId,
        customerId: body.customerId,
        salePersonId: body.salePersonId,
        orderId: body.orderId,
        locationId: body.locationId,
        date: new Date(body.date),
        dueDate: new Date(body.dueDate),
        notes: body.notes,
        lines: body.lines,
      },
      user.id
    );
    return NextResponse.json(invoice, { status: 201 });
  } catch (e: unknown) {
    return apiError(e);
  }
}
