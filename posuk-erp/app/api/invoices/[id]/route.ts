import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Sale Invoices", "delete");
    const { id } = await params;
    const inv = await db.invoice.findUniqueOrThrow({ where: { id }, select: { no: true } });
    await db.$transaction([
      db.ledgerEntry.deleteMany({ where: { invoiceId: id } }),
      db.stockLedger.deleteMany({ where: { docNo: inv.no } }),
      db.invoice.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2003") {
      return NextResponse.json({ error: "Cannot delete: this invoice has sale returns linked to it." }, { status: 409 });
    }
    return apiError(e);
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Sale Invoices", "view");
    const { id } = await params;
    const inv = await db.invoice.findUniqueOrThrow({
      where: { id },
      include: {
        customer: true,
        salePerson: { select: { id: true, name: true } },
        lines: { include: { product: { select: { sku: true, name: true } } } },
      },
    });
    return NextResponse.json({
      id: inv.id,
      no: inv.no,
      date: inv.date,
      dueDate: inv.dueDate,
      status: inv.status,
      notes: inv.notes,
      customerName: inv.customer.name,
      customerAddress: inv.customer.address,
      customerVat: inv.customer.vat,
      salePersonName: inv.salePerson?.name ?? null,
      subtotal: parseFloat(inv.subtotal.toString()),
      vatTotal: parseFloat(inv.vatTotal.toString()),
      grandTotal: parseFloat(inv.grandTotal.toString()),
      paidTotal: parseFloat(inv.paidTotal.toString()),
      lines: inv.lines.map((l) => ({
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
