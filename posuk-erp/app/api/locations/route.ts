import { apiError } from "@/lib/apiError";
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
    await requireRight("Products", "view");
    const rows = await db.location.findMany({ orderBy: { code: "asc" } });
    return NextResponse.json(rows);
  } catch (e: unknown) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireRight("Products", "create");
    const data = Schema.parse(await req.json());
    const location = await db.location.create({ data });
    return NextResponse.json(location, { status: 201 });
  } catch (e: unknown) {
    return apiError(e);
  }
}
