import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({ theme: z.enum(["light", "dark"]) });

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();
    const { theme } = Schema.parse(await req.json());
    await db.user.update({ where: { id: session.id }, data: { theme } });
    return NextResponse.json({ theme });
  } catch (e: unknown) { return apiError(e); }
}
