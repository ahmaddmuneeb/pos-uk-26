import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight, HttpError } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const SYSADMIN_ROLE = "System Administrator";

const PatchSchema = z.object({
  status: z.enum(["Active", "Inactive"]).optional(),
  fullName: z.string().min(1).optional(),
  roleId: z.string().min(1).optional(),
  branchId: z.string().min(1).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const me = await requireRight("Users", "edit");
    const data = PatchSchema.parse(await req.json());

    if (data.status === "Inactive" && id === me.id) {
      throw new HttpError(400, "You cannot deactivate your own account.");
    }

    if (data.roleId && id === me.id) {
      throw new HttpError(400, "You cannot change your own role.");
    }

    if (data.roleId) {
      const [callerRole, targetRole] = await Promise.all([
        db.role.findUnique({ where: { id: me.roleId }, select: { name: true } }),
        db.role.findUnique({ where: { id: data.roleId }, select: { name: true } }),
      ]);
      if (callerRole?.name !== SYSADMIN_ROLE && targetRole?.name === SYSADMIN_ROLE) {
        throw new HttpError(403, "Only a System Administrator can assign the System Administrator role.");
      }
    }

    const updated = await db.user.update({ where: { id }, data });
    return NextResponse.json({ id: updated.id });
  } catch (e: unknown) { return apiError(e); }
}
