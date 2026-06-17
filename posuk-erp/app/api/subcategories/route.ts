import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  parentId: z.string().min(1),
});

export async function GET() {
  try {
    await requireRight("Categories", "view");
    const rows = await db.subCategory.findMany({
      orderBy: { code: "asc" },
      include: { parent: true },
    });
    const mapped = rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      parentId: r.parentId,
      parentName: r.parent.name,
    }));
    return NextResponse.json(mapped);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRight("Categories", "create");
    const data = Schema.parse(await req.json());
    const sub = await db.subCategory.create({ data });
    return NextResponse.json(sub, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 400 });
  }
}
