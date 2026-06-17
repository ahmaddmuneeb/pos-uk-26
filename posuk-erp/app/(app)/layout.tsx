import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AppShell } from "@/components/navigation/AppShell";
import type { RightsMap } from "@/components/auth/RightsContext";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  const rights = await db.right.findMany({ where: { roleId: session.user.roleId } });
  const rightsMap: RightsMap = Object.fromEntries(
    rights.map((r) => [r.screen, { view: r.view, create: r.create, edit: r.edit, delete: r.delete, print: r.print }])
  );
  return <AppShell user={session.user} rights={rightsMap}>{children}</AppShell>;
}
