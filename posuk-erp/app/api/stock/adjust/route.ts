import { apiError } from "@/lib/apiError";
import { db } from "@/lib/db";
import { requireRight, logActivity } from "@/lib/auth";
import { nextCode } from "@/lib/posting";
import { z } from "zod";
import { NextResponse } from "next/server";

const Schema = z.object({
  productId: z.string().min(1),
  locationId: z.string().min(1),
  qty: z.number().int().refine((n) => n !== 0, "Adjustment quantity cannot be zero"),
  reason: z.string().optional(),
  date: z.coerce.date().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await requireRight("Products", "edit");
    const body = await req.json();
    const data = Schema.parse(body);

    const result = await db.$transaction(async (tx) => {
      const agg = await tx.stockLedger.aggregate({
        where: { productId: data.productId, locationId: data.locationId },
        _sum: { qtyIn: true, qtyOut: true },
      });
      const currentBalance = (agg._sum.qtyIn ?? 0) - (agg._sum.qtyOut ?? 0);
      const newBalance = currentBalance + data.qty;

      if (newBalance < 0) {
        throw new Error(`Adjustment rejected: stock at this location cannot go negative (current balance ${currentBalance}, requested change ${data.qty}).`);
      }

      const no = await nextCode("ADJ", tx as unknown as typeof db);

      const entry = await tx.stockLedger.create({
        data: {
          productId: data.productId,
          locationId: data.locationId,
          qtyIn: data.qty > 0 ? data.qty : 0,
          qtyOut: data.qty < 0 ? -data.qty : 0,
          docType: "Adjustment",
          docNo: no,
          date: data.date ?? new Date(),
        },
      });

      await logActivity(user.id, "Stock Adjustment", no, data.reason ? `Adjusted (${data.reason})` : "Adjusted", tx);

      return { entry, newBalance };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e: unknown) {
    return apiError(e);
  }
}
