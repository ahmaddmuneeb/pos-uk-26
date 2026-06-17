import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({
  name: z.string().min(1),
});

export async function GET() {
  try {
    await requireRight("Customer Types", "view");
    const rows = await db.customerType.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { customers: true } } },
    });
    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRight("Customer Types", "create");
    const data = Schema.parse(await req.json());
    const row = await db.customerType.create({ data });
    return NextResponse.json(row, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 400 });
  }
}
