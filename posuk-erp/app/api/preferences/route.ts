import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireRight("Preferences", "view");
    const prefs = await db.preference.findMany();
    return NextResponse.json(prefs);
  } catch (e: unknown) { return apiError(e); }
}

export async function POST(req: Request) {
  try {
    const user = await requireRight("Preferences", "edit");
    const body = await req.json() as Record<string, string>;
    const ops = Object.entries(body).map(([key, value]) =>
      db.preference.upsert({ where: { key }, create: { key, value }, update: { value } })
    );
    await db.$transaction(ops);
    await db.activityLog.create({ data: { userId: user.id, docType: "Preferences", docNo: "global", action: "Updated" } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) { return apiError(e); }
}
