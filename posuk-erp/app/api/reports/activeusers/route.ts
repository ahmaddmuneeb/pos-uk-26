import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireRight("Active Users", "view");

    const users = await db.user.findMany({
      where: { status: "Active" },
      include: { role: { select: { id: true, name: true } }, branch: { select: { id: true, name: true } } },
      orderBy: { username: "asc" },
    });

    const rows = users.map((u) => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      roleName: u.role.name,
      branchName: u.branch.name,
      lastLogin: u.lastLogin,
    }));

    return NextResponse.json(rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}
