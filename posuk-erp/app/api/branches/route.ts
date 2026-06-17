import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  phone: z.string().optional(),
  vat: z.string().optional(),
  address: z.string().optional(),
});

export async function GET() {
  try {
    await requireRight("Branches", "view");
    const rows = await db.branch.findMany({ orderBy: { code: "asc" } });
    return NextResponse.json(rows);
  } catch (e: unknown) { return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 }); }
}

export async function POST(req: Request) {
  try {
    const user = await requireRight("Branches", "create");
    const data = Schema.parse(await req.json());
    const branch = await db.branch.create({ data });
    await db.activityLog.create({ data: { userId: user.id, docType: "Branch", docNo: data.code, action: "Created" } });
    return NextResponse.json(branch, { status: 201 });
  } catch (e: unknown) { return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 400 }); }
}
