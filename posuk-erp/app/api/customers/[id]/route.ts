import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

const Schema = z.object({
  name: z.string().min(1).optional(),
  contact: z.string().optional(),
  typeId: z.string().min(1).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  vat: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  address: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Customers", "edit");
    const { id } = await params;
    const data = Schema.parse(await req.json());
    const row = await db.customer.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (e: unknown) {
    return apiError(e);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Customers", "delete");
    const { id } = await params;
    await db.customer.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return NextResponse.json(
        { error: "This customer has linked transactions (invoices, receipts, or orders) and cannot be deleted. You can deactivate them instead." },
        { status: 409 }
      );
    }
    return apiError(e);
  }
}
