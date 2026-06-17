import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
});

export async function GET() {
  try {
    await requireRight("Categories", "view");
    const rows = await db.category.findMany({ orderBy: { code: "asc" } });
    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRight("Categories", "create");
    const data = Schema.parse(await req.json());
    const category = await db.category.create({ data });
    return NextResponse.json(category, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 400 });
  }
}
