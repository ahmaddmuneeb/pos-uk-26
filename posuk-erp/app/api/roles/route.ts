import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireAuth, requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({ name: z.string().min(1, "Name is required").max(64) });

export async function GET() {
  try {
    await requireAuth();
    const roles = await db.role.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(roles.map((r) => ({ id: r.id, name: r.name, userCount: r._count.users })));
  } catch (e: unknown) { return apiError(e); }
}

export async function POST(req: Request) {
  try {
    await requireRight("User Rights", "create");
    const { name } = Schema.parse(await req.json());
    const role = await db.role.create({ data: { name } });
    return NextResponse.json(role, { status: 201 });
  } catch (e: unknown) { return apiError(e); }
}
