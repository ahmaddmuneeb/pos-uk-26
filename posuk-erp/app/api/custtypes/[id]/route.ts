import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({ name: z.string().min(1) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Customer Types", "edit");
    const { id } = await params;
    const data = Schema.parse(await req.json());
    const row = await db.customerType.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (e: unknown) {
    return apiError(e);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRight("Customer Types", "delete");
    const { id } = await params;
    await db.customerType.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    const { Prisma } = await import("@prisma/client");
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete: this customer type has customers assigned to it. Reassign them to another type first." },
        { status: 409 }
      );
    }
    return apiError(e);
  }
}
