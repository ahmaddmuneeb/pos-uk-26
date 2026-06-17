import { auth } from "@/auth";
import { db } from "./db";

export class HttpError extends Error {
  constructor(public status: number, message?: string) {
    super(message || String(status));
  }
}

export async function getSession() {
  return auth();
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) throw new HttpError(401, "Unauthorized");
  return session.user as { id: string; roleId: string; branchId: string; username: string; fullName: string; role: string };
}

export async function requireRight(screen: string, action: "view" | "create" | "edit" | "delete" | "print") {
  const user = await requireAuth();
  const right = await db.right.findUnique({
    where: { roleId_screen: { roleId: user.roleId, screen } },
  });
  if (!right?.[action]) throw new HttpError(403, "Forbidden");
  return user;
}

export async function logActivity(userId: string, docType: string, docNo: string, action: string, tx?: Parameters<typeof db.activityLog.create>[0] extends { data: infer _D } ? unknown : unknown) {
  const client = (tx as { activityLog?: { create: typeof db.activityLog.create } })?.activityLog ?? db.activityLog;
  await (client as typeof db.activityLog).create({ data: { userId, docType, docNo, action } });
}
