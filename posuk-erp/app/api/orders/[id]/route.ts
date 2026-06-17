import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const ORDER_STATUSES = ["Open", "Invoiced", "Cancelled"] as const;
const StatusSchema = z.object({ status: z.enum(ORDER_STATUSES) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Sale Orders", "edit");
    const { id } = await params;
    const { status } = StatusSchema.parse(await req.json());
    await db.saleOrder.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return apiError(e);
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Sale Orders", "view");
    const { id } = await params;
    const order = await db.saleOrder.findUniqueOrThrow({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, address: true } },
        salePerson: { select: { id: true, name: true } },
        lines: { include: { product: { select: { sku: true, name: true } } } },
      },
    });
    return NextResponse.json({
      id: order.id,
      no: order.no,
      date: order.date,
      status: order.status,
      customerName: order.customer.name,
      customerAddress: order.customer.address,
      salePersonName: order.salePerson?.name ?? null,
      subtotal: parseFloat(order.subtotal.toString()),
      vatTotal: parseFloat(order.vatTotal.toString()),
      grandTotal: parseFloat(order.grandTotal.toString()),
      lines: order.lines.map((l) => ({
        sku: l.product.sku,
        name: l.product.name,
        qty: l.qty,
        rate: parseFloat(l.rate.toString()),
        discount: parseFloat(l.discount.toString()),
        vatRate: parseFloat(l.vatRate.toString()),
        lineTotal: parseFloat(l.lineTotal.toString()),
      })),
    });
  } catch (e: unknown) {
    return apiError(e);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Sale Orders", "delete");
    const { id } = await params;
    await db.saleOrder.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2003") {
      return NextResponse.json({ error: "Cannot delete: this order has been invoiced." }, { status: 409 });
    }
    return apiError(e);
  }
}
