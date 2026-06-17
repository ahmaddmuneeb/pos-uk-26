import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireAuth();
    const roles = await db.role.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(roles);
  } catch (e: unknown) { return apiError(e); }
}
