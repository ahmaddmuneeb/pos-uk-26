import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await requireRight("User Rights", "view");
    const roleId = new URL(req.url).searchParams.get("roleId");
    if (!roleId) return NextResponse.json([]);
    const rights = await db.right.findMany({ where: { roleId } });
    return NextResponse.json(rights);
  } catch (e: unknown) { return apiError(e); }
}

export async function POST(req: Request) {
  try {
    const user = await requireRight("User Rights", "edit");
    const { roleId, rights } = await req.json();
    const ops = Object.entries(rights as Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean; print: boolean }>).map(([screen, r]) =>
      db.right.upsert({ where: { roleId_screen: { roleId, screen } }, create: { roleId, screen, ...r }, update: r })
    );
    await db.$transaction(ops);
    await db.activityLog.create({ data: { userId: user.id, docType: "User Rights", docNo: roleId, action: "Updated" } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) { return apiError(e); }
}
