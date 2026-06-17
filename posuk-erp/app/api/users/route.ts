import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const Schema = z.object({
  username: z.string().min(1),
  fullName: z.string().min(1),
  roleId: z.string().min(1),
  branchId: z.string().min(1),
  password: z.string().min(6),
});

export async function GET() {
  try {
    await requireRight("Users", "view");
    const users = await db.user.findMany({
      include: { role: true, branch: true },
      orderBy: { username: "asc" },
    });
    return NextResponse.json(users.map((u) => ({
      id: u.id, username: u.username, fullName: u.fullName,
      roleName: u.role.name, roleId: u.roleId, isAdmin: u.role.name === "System Administrator",
      branchName: u.branch.name, branchId: u.branchId, status: u.status, lastLogin: u.lastLogin,
    })));
  } catch (e: unknown) { return apiError(e); }
}

export async function POST(req: Request) {
  try {
    const user = await requireRight("Users", "create");
    const data = Schema.parse(await req.json());
    const passwordHash = await bcrypt.hash(data.password, 10);
    const created = await db.user.create({ data: { username: data.username, fullName: data.fullName, roleId: data.roleId, branchId: data.branchId, passwordHash, mustChangePwd: true } });
    await db.activityLog.create({ data: { userId: user.id, docType: "User", docNo: data.username, action: "Created" } });
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e: unknown) { return apiError(e); }
}
