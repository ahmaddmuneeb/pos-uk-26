import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const Schema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  typeId: z.string().min(1),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  vat: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  address: z.string().optional(),
  active: z.boolean().default(true),
});

async function nextCustomerCode(): Promise<string> {
  const key = "next_cust";
  const pref = await db.preference.findUnique({ where: { key } });
  const next = pref ? parseInt(pref.value) : 1;
  await db.preference.upsert({
    where: { key },
    create: { key, value: String(next + 1) },
    update: { value: String(next + 1) },
  });
  const pfxPref = await db.preference.findUnique({ where: { key: "prefix_cust" } });
  const pfx = pfxPref?.value ?? "CUST-";
  return `${pfx}${String(next).padStart(4, "0")}`;
}

export async function GET(req: NextRequest) {
  try {
    await requireRight("Customers", "view");
    const q = req.nextUrl.searchParams.get("q") ?? "";
    const rows = await db.customer.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { code: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: { type: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(
      rows.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        contact: c.contact,
        typeId: c.typeId,
        typeName: c.type.name,
        phone: c.phone,
        whatsapp: c.whatsapp,
        email: c.email,
        vat: c.vat,
        city: c.city,
        postcode: c.postcode,
        address: c.address,
        active: c.active,
      }))
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRight("Customers", "create");
    const data = Schema.parse(await req.json());
    const code = await nextCustomerCode();
    const row = await db.customer.create({
      data: {
        code,
        name: data.name,
        contact: data.contact,
        typeId: data.typeId,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        vat: data.vat,
        city: data.city,
        postcode: data.postcode,
        address: data.address,
        active: data.active,
      },
    });
    return NextResponse.json(row, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: (e as { status?: number }).status || 400 });
  }
}
