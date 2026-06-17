import { db } from "./db";
import { Decimal } from "@prisma/client";

function sum(lines: { qty: number; rate: number; discount: number }[]) {
  return lines.reduce((acc, l) => {
    const base = l.qty * l.rate * (1 - l.discount / 100);
    return acc + base;
  }, 0);
}

export async function nextCode(prefix: string, tx: typeof db) {
  const key = `next_${prefix.toLowerCase()}`;
  const pref = await (tx as typeof db).preference.findUnique({ where: { key } });
  const next = pref ? parseInt(pref.value) : 1;
  await (tx as typeof db).preference.upsert({ where: { key }, create: { key, value: String(next + 1) }, update: { value: String(next + 1) } });
  const pfxPref = await (tx as typeof db).preference.findUnique({ where: { key: `prefix_${prefix.toLowerCase()}` } });
  const pfx = pfxPref?.value ?? prefix + "-";
  return `${pfx}${String(next).padStart(4, "0")}`;
}

export interface LineInput {
  productId: string;
  qty: number;
  rate: number;
  discount: number;
  vatRate: number;
}

export interface InvoiceInput {
  branchId: string;
  customerId: string;
  salePersonId?: string;
  orderId?: string;
  locationId: string;
  date: Date;
  dueDate: Date;
  notes?: string;
  lines: LineInput[];
}

export async function postInvoice(input: InvoiceInput, userId: string) {
  return db.$transaction(async (tx) => {
    const lines = input.lines.map((l) => {
      const base = l.qty * l.rate * (1 - l.discount / 100);
      const lineTotal = base * (1 + l.vatRate / 100);
      return { ...l, base, lineTotal };
    });

    const subtotal = new Decimal(sum(lines));
    const vatTotal = new Decimal(lines.reduce((acc, l) => acc + l.base * (l.vatRate / 100), 0));
    const grandTotal = subtotal.add(vatTotal);

    const no = await nextCode("INV", tx as unknown as typeof db);

    const inv = await tx.invoice.create({
      data: {
        no,
        branchId: input.branchId,
        customerId: input.customerId,
        salePersonId: input.salePersonId,
        orderId: input.orderId,
        locationId: input.locationId,
        date: input.date,
        dueDate: input.dueDate,
        notes: input.notes,
        subtotal,
        vatTotal,
        grandTotal,
        status: "Draft",
        lines: {
          create: lines.map((l) => ({
            productId: l.productId,
            qty: l.qty,
            rate: new Decimal(l.rate),
            discount: new Decimal(l.discount),
            vatRate: new Decimal(l.vatRate),
            lineTotal: new Decimal(l.lineTotal),
          })),
        },
      },
    });

    // Decrement stock — reject if any product would go negative at this location
    const requestedByProduct = new Map<string, number>();
    for (const l of lines) requestedByProduct.set(l.productId, (requestedByProduct.get(l.productId) ?? 0) + l.qty);
    for (const [productId, requested] of requestedByProduct) {
      const agg = await tx.stockLedger.aggregate({
        where: { productId, locationId: input.locationId },
        _sum: { qtyIn: true, qtyOut: true },
      });
      const balance = (agg._sum.qtyIn ?? 0) - (agg._sum.qtyOut ?? 0);
      if (balance < requested) {
        const product = await tx.product.findUnique({ where: { id: productId }, select: { sku: true, name: true } });
        throw new Error(`Insufficient stock for ${product?.sku ?? productId} — ${product?.name ?? ""} (available ${balance}, requested ${requested})`);
      }
    }
    for (const l of lines) {
      await tx.stockLedger.create({
        data: { productId: l.productId, locationId: input.locationId, qtyOut: l.qty, docType: "Invoice", docNo: no, date: input.date },
      });
    }

    // Debit customer ledger
    await tx.ledgerEntry.create({
      data: { customerId: input.customerId, docType: "Invoice", docNo: no, invoiceId: inv.id, debit: grandTotal, narration: "Sale invoice", date: input.date },
    });

    await tx.activityLog.create({ data: { userId, docType: "Sale Invoice", docNo: no, action: "Created" } });
    return inv;
  });
}

export async function postReceipt(input: { customerId: string; amount: number; mode: string; reference?: string; date: Date; branchId: string }, userId: string) {
  return db.$transaction(async (tx) => {
    const no = await nextCode("RCP", tx as unknown as typeof db);
    const amount = new Decimal(input.amount);

    const receipt = await tx.receipt.create({
      data: { code: no, customerId: input.customerId, amount, mode: input.mode, reference: input.reference, date: input.date },
    });

    // Credit customer ledger
    await tx.ledgerEntry.create({
      data: { customerId: input.customerId, docType: "Receipt", docNo: no, receiptId: receipt.id, credit: amount, narration: `Payment — ${input.mode}`, date: input.date },
    });

    // Update oldest unpaid invoices
    const unpaid = await tx.invoice.findMany({
      where: { customerId: input.customerId, status: { in: ["Draft", "Partial", "Overdue"] } },
      orderBy: { date: "asc" },
    });

    let remaining = parseFloat(amount.toString());
    for (const inv of unpaid) {
      if (remaining <= 0) break;
      const outstanding = parseFloat(inv.grandTotal.toString()) - parseFloat(inv.paidTotal.toString());
      const applying = Math.min(remaining, outstanding);
      const newPaid = parseFloat(inv.paidTotal.toString()) + applying;
      const newStatus = newPaid >= parseFloat(inv.grandTotal.toString()) - 0.01 ? "Paid" : "Partial";
      await tx.invoice.update({ where: { id: inv.id }, data: { paidTotal: new Decimal(newPaid), status: newStatus } });
      remaining -= applying;
    }

    await tx.activityLog.create({ data: { userId, docType: "Receipt", docNo: no, action: "Created" } });
    return receipt;
  });
}

export async function postReturn(input: { invoiceId: string; reason?: string; date: Date; lines: { productId: string; qty: number; rate: number; vatRate: number }[] }, userId: string) {
  return db.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUniqueOrThrow({
      where: { id: input.invoiceId },
      include: { lines: true, returns: { include: { lines: true } } },
    });

    // Validate qty: returnQty ≤ invoicedQty − priorReturns
    for (const l of input.lines) {
      const invoicedQty = invoice.lines.filter((il) => il.productId === l.productId).reduce((a, b) => a + b.qty, 0);
      const returnedQty = invoice.returns.flatMap((r) => r.lines).filter((rl) => rl.productId === l.productId).reduce((a, b) => a + b.qty, 0);
      if (l.qty > invoicedQty - returnedQty) throw new Error(`Return qty for product ${l.productId} exceeds available (${invoicedQty - returnedQty})`);
    }

    const returnLines = input.lines.map((l) => {
      const base = l.qty * l.rate;
      return { ...l, lineTotal: base * (1 + l.vatRate / 100) };
    });

    const subtotal = new Decimal(returnLines.reduce((a, l) => a + l.qty * l.rate, 0));
    const vatTotal = new Decimal(returnLines.reduce((a, l) => a + l.qty * l.rate * (l.vatRate / 100), 0));
    const grandTotal = subtotal.add(vatTotal);
    const no = await nextCode("SR", tx as unknown as typeof db);

    const ret = await tx.saleReturn.create({
      data: {
        no, invoiceId: input.invoiceId, date: input.date, reason: input.reason,
        subtotal, vatTotal, grandTotal,
        lines: { create: returnLines.map((l) => ({ productId: l.productId, qty: l.qty, rate: new Decimal(l.rate), vatRate: new Decimal(l.vatRate), lineTotal: new Decimal(l.lineTotal) })) },
      },
    });

    // Return stock
    for (const l of returnLines) {
      await tx.stockLedger.create({
        data: { productId: l.productId, locationId: invoice.locationId, qtyIn: l.qty, docType: "Return", docNo: no, date: input.date },
      });
    }

    // Credit customer ledger
    await tx.ledgerEntry.create({
      data: { customerId: invoice.customerId, docType: "Return", docNo: no, returnId: ret.id, invoiceId: invoice.id, credit: grandTotal, narration: `Sale return against ${invoice.no}`, date: input.date },
    });

    await tx.activityLog.create({ data: { userId, docType: "Sale Return", docNo: no, action: "Created" } });
    return ret;
  });
}

export async function postSaleOrder(input: { branchId: string; customerId: string; salePersonId?: string; date: Date; lines: LineInput[] }, userId: string) {
  return db.$transaction(async (tx) => {
    const lines = input.lines.map((l) => {
      const base = l.qty * l.rate * (1 - l.discount / 100);
      return { ...l, base, lineTotal: base * (1 + l.vatRate / 100) };
    });
    const subtotal = new Decimal(sum(lines));
    const vatTotal = new Decimal(lines.reduce((a, l) => a + l.base * (l.vatRate / 100), 0));
    const no = await nextCode("SO", tx as unknown as typeof db);

    const order = await tx.saleOrder.create({
      data: {
        no, branchId: input.branchId, customerId: input.customerId, salePersonId: input.salePersonId,
        date: input.date, subtotal, vatTotal, grandTotal: subtotal.add(vatTotal),
        lines: {
          create: lines.map((l) => ({ productId: l.productId, qty: l.qty, rate: new Decimal(l.rate), discount: new Decimal(l.discount), vatRate: new Decimal(l.vatRate), lineTotal: new Decimal(l.lineTotal) })),
        },
      },
    });

    await tx.activityLog.create({ data: { userId, docType: "Sale Order", docNo: no, action: "Created" } });
    return order;
  });
}
