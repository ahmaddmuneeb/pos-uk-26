import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireRight("User Activity", "view");

    const logs = await db.activityLog.findMany({
      include: { user: { select: { id: true, fullName: true } } },
      orderBy: { at: "desc" },
      take: 200,
    });

    const rows = logs.map((l) => ({
      id: l.id,
      at: l.at,
      userFullName: l.user.fullName,
      docType: l.docType,
      docNo: l.docNo,
      action: l.action,
    }));

    return NextResponse.json(rows);
  } catch (e: unknown) {
    return apiError(e);
  }
}
