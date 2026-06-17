import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({
  name: z.string().min(1),
  designation: z.string().optional(),
  region: z.string().optional(),
  commission: z.coerce.number().nonnegative().default(0),
  status: z.string().default("Active"),
});

export async function GET() {
  try {
    await requireRight("Sale Persons", "view");
    const rows = await db.salePerson.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(rows);
  } catch (e: unknown) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireRight("Sale Persons", "create");
    const data = Schema.parse(await req.json());
    const row = await db.salePerson.create({ data });
    return NextResponse.json(row, { status: 201 });
  } catch (e: unknown) {
    return apiError(e);
  }
}
