# POS UK ERP — Build Guide (Next.js · Node.js · PostgreSQL)

A step-by-step path from the design system + prototype in this project to a production ERP.

The design system answers *"what does it look like and how does it behave?"*. This guide covers the rest: **data, logic, API, auth, and deployment.** Build order matters — masters first, documents second, reports last.

---

## 0. Prerequisites

- Node.js 20+, pnpm (or npm), Git
- PostgreSQL 16 (local via Docker is fine)
- An editor with TypeScript support

```bash
# Postgres in Docker for local dev
docker run --name posuk-db -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=posuk -p 5432:5432 -d postgres:16
```

---

## 1. Recommended architecture

A single **Next.js (App Router) full-stack app** is the simplest fit — Next gives you the React frontend AND the Node backend (Route Handlers / Server Actions) in one repo. Add a separate Node service later only if you outgrow it.

```
posuk-erp/
├─ app/                      # Next.js App Router (pages + API routes)
│  ├─ (auth)/login/page.tsx
│  ├─ (app)/                 # authenticated shell layout
│  │  ├─ layout.tsx          # sidebar + topbar (from shell.jsx)
│  │  ├─ dashboard/page.tsx
│  │  ├─ company/customers/page.tsx
│  │  ├─ product/products/page.tsx
│  │  ├─ sales/invoices/page.tsx
│  │  └─ … one folder per screen
│  └─ api/                   # Route Handlers (the backend)
│     ├─ customers/route.ts
│     ├─ invoices/route.ts
│     └─ …
├─ lib/
│  ├─ db.ts                  # Prisma client singleton
│  ├─ auth.ts                # session + RBAC helpers
│  └─ posting.ts             # invoice/receipt/return posting logic
├─ components/               # ← copy from this design system
├─ styles/                   # ← copy styles.css + tokens/ here
├─ prisma/
│  └─ schema.prisma
└─ package.json
```

**Stack choices:**
- **ORM:** Prisma — type-safe, great migrations, matches the relational model below.
- **Server state:** TanStack Query (data fetching/caching on the client).
- **Forms:** React Hook Form + Zod (validation shared client+server).
- **Auth:** Auth.js (NextAuth) credentials provider, or Lucia for full control.

```bash
npx create-next-app@latest posuk-erp --ts --app --no-tailwind
cd posuk-erp
pnpm add @prisma/client zod react-hook-form @tanstack/react-query
pnpm add -D prisma
npx prisma init
```

---

## 2. Port the design system in (½ day)

This is mostly copy-and-wire — the components are already plain React + CSS-variable styling.

1. Copy `styles.css` + the whole `tokens/` folder into `styles/`. Import once in `app/layout.tsx`:
   ```tsx
   import "@/styles/styles.css";
   ```
2. Copy `components/core`, `forms`, `data-display`, `navigation`, `feedback` into `components/`. Each already has a `.d.ts` — rename the `.jsx` to `.tsx` and the types line up.
3. Rebuild the shell from `ui_kits/pos-web/shell.jsx` as `app/(app)/layout.tsx`, and convert each `screens-*.jsx` screen into its `page.tsx`. **Keep the same component API** (`<DataTable columns rows>`, `<Field label>`, `<Modal wide>`) so the screen JSX ports almost 1:1 — you only swap the fake `data.js` reads for real data fetching.

---

## 3. Model the database (the core of the ERP)

Derived directly from the PRD entities. Drop this into `prisma/schema.prisma`, then run migrations.

```prisma
// ---------- Administration ----------
model Branch {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String
  phone     String?
  vat       String?
  address   String?
  isHead    Boolean  @default(false)
  active    Boolean  @default(true)
  users     User[]
  invoices  Invoice[]
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  fullName  String
  passwordHash String
  role      Role     @relation(fields: [roleId], references: [id])
  roleId    String
  branch    Branch   @relation(fields: [branchId], references: [id])
  branchId  String
  status    String   @default("Active")
  lastLogin DateTime?
  activities ActivityLog[]
}

model Role {
  id     String  @id @default(cuid())
  name   String  @unique
  rights Right[]
  users  User[]
}

// Per-screen RBAC: one row per (role, screen) with action flags
model Right {
  id      String  @id @default(cuid())
  role    Role    @relation(fields: [roleId], references: [id])
  roleId  String
  screen  String  // e.g. "Sale Invoices"
  view    Boolean @default(false)
  create  Boolean @default(false)
  edit    Boolean @default(false)
  delete  Boolean @default(false)
  print   Boolean @default(false)
  @@unique([roleId, screen])
}

// ---------- Company ----------
model CustomerType { id String @id @default(cuid()) name String @unique customers Customer[] }

model Customer {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String
  contact   String?
  type      CustomerType @relation(fields: [typeId], references: [id])
  typeId    String
  phone     String?  email String?  vat String?
  city      String?  postcode String?  address String?
  active    Boolean  @default(true)
  invoices  Invoice[]
  receipts  Receipt[]
  ledger    LedgerEntry[]
}

model SalePerson {
  id String @id @default(cuid())
  name String  designation String?  region String?
  commission Decimal @default(0)  status String @default("Active")
  invoices Invoice[]
}

model Receipt {
  id        String   @id @default(cuid())
  code      String   @unique
  customer  Customer @relation(fields: [customerId], references: [id])
  customerId String
  amount    Decimal
  mode      String   // CASH | BANK_TRANSFER | CHEQUE
  reference String?
  date      DateTime
}

// ---------- Product ----------
model Category    { id String @id @default(cuid()) code String @unique name String active Boolean @default(true) subs SubCategory[] products Product[] }
model SubCategory { id String @id @default(cuid()) code String @unique name String parent Category @relation(fields:[parentId],references:[id]) parentId String products Product[] }
model Uom         { id String @id @default(cuid()) code String @unique name String products Product[] }
model Location    { id String @id @default(cuid()) code String @unique name String stock StockLedger[] }

model Product {
  id        String @id @default(cuid())
  sku       String @unique
  name      String
  type      String  // Finished | Raw
  category  Category    @relation(fields:[categoryId],references:[id])  categoryId String
  sub       SubCategory @relation(fields:[subId],references:[id])       subId String
  uom       Uom         @relation(fields:[uomId],references:[id])       uomId String
  purchaseRate  Decimal
  wholesaleRate Decimal
  retailRate    Decimal
  reorderLevel  Int     @default(0)
  barcode   String?
  active    Boolean @default(true)
  stock     StockLedger[]
}

// Stock is a LEDGER (source of truth). Current stock = sum of movements.
model StockLedger {
  id        String   @id @default(cuid())
  product   Product  @relation(fields:[productId],references:[id])  productId String
  location  Location @relation(fields:[locationId],references:[id]) locationId String
  qtyIn     Int      @default(0)
  qtyOut    Int      @default(0)
  docType   String   // GRN | Invoice | Return | Adjustment
  docNo     String
  date      DateTime @default(now())
}

// ---------- Sales (documents) ----------
model Invoice {
  id         String   @id @default(cuid())
  no         String   @unique
  branch     Branch   @relation(fields:[branchId],references:[id])  branchId String
  customer   Customer @relation(fields:[customerId],references:[id]) customerId String
  salePerson SalePerson? @relation(fields:[salePersonId],references:[id]) salePersonId String?
  date       DateTime
  dueDate    DateTime
  subtotal   Decimal
  vatTotal   Decimal
  grandTotal Decimal
  paidTotal  Decimal  @default(0)
  status     String   // Draft | Paid | Partial | Overdue
  lines      InvoiceLine[]
  returns    SaleReturn[]
}

model InvoiceLine {
  id        String  @id @default(cuid())
  invoice   Invoice @relation(fields:[invoiceId],references:[id]) invoiceId String
  product   Product @relation(fields:[productId],references:[id]) productId String
  qty       Int
  rate      Decimal
  discount  Decimal @default(0)
  vatRate   Decimal @default(20)
  lineTotal Decimal
}

model SaleReturn {
  id        String  @id @default(cuid())
  no        String  @unique
  invoice   Invoice @relation(fields:[invoiceId],references:[id]) invoiceId String
  date      DateTime
  reason    String?
  subtotal  Decimal  vatTotal Decimal  grandTotal Decimal
  lines     SaleReturnLine[]
}
model SaleReturnLine {
  id String @id @default(cuid())
  ret SaleReturn @relation(fields:[retId],references:[id]) retId String
  productId String  qty Int  rate Decimal  vatRate Decimal  lineTotal Decimal
}

// Customer ledger: every invoice (debit) / receipt (credit) posts here
model LedgerEntry {
  id        String   @id @default(cuid())
  customer  Customer @relation(fields:[customerId],references:[id]) customerId String
  date      DateTime @default(now())
  docType   String   docNo String  narration String?
  debit     Decimal  @default(0)
  credit    Decimal  @default(0)
}

model ActivityLog {
  id      String   @id @default(cuid())
  user    User     @relation(fields:[userId],references:[id]) userId String
  docType String   docNo String  action String  // Created|Updated|Deleted
  at      DateTime @default(now())
}
```

```bash
npx prisma migrate dev --name init
npx prisma generate
```

> Use `Decimal` for all money — never `Float`. Configure Prisma `Decimal` and format to £ only in the UI.

---

## 4. Auth + RBAC (1–2 days)

1. **Login:** Auth.js credentials provider. Verify `passwordHash` with bcrypt/argon2, create a session carrying `userId`, `roleId`, `branchId`.
2. **Enforce rights on the server, not just the UI.** Write a guard used in every API route:
   ```ts
   // lib/auth.ts
   export async function requireRight(screen: string, action: "view"|"create"|"edit"|"delete"|"print") {
     const session = await getSession();
     if (!session) throw new HttpError(401);
     const right = await db.right.findUnique({ where: { roleId_screen: { roleId: session.roleId, screen } } });
     if (!right?.[action]) throw new HttpError(403);
     return session;
   }
   ```
3. The **User Rights matrix screen** is just an editor for the `Right` table — the toggles write rows; the guard reads them. Hiding sidebar items by `view` is a convenience, not the security boundary.

---

## 5. API layer — Route Handlers (build per module)

One resource = one folder under `app/api/`. Standard shape:

```ts
// app/api/customers/route.ts
import { db } from "@/lib/db";
import { requireRight } from "@/lib/auth";
import { z } from "zod";

export async function GET(req: Request) {
  await requireRight("Customers", "view");
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const rows = await db.customer.findMany({
    where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { code: { contains: q } }] },
    include: { type: true }, orderBy: { code: "asc" },
  });
  return Response.json(rows);
}

const CreateCustomer = z.object({ name: z.string().min(1), typeId: z.string(), phone: z.string().optional(), /* … */ });

export async function POST(req: Request) {
  const session = await requireRight("Customers", "create");
  const data = CreateCustomer.parse(await req.json());
  const code = await nextCode("CUST"); // sequence from Preferences
  const customer = await db.customer.create({ data: { ...data, code } });
  await logActivity(session.userId, "Customer", code, "Created");
  return Response.json(customer, { status: 201 });
}
```

Validate with the **same Zod schema** on client and server.

---

## 6. Document posting logic (the highest-value work)

This is what makes it an ERP, not a CRUD app. Each posting is **one atomic DB transaction.** Put these in `lib/posting.ts`.

**Posting an invoice:**
```ts
export async function postInvoice(input: InvoiceInput, userId: string) {
  return db.$transaction(async (tx) => {
    // 1. compute totals server-side (never trust client totals)
    const lines = input.lines.map(l => {
      const base = l.qty * l.rate * (1 - l.discount/100);
      return { ...l, lineTotal: base * (1 + l.vatRate/100) };
    });
    const subtotal = sum(lines, l => l.qty*l.rate*(1-l.discount/100));
    const vatTotal = sum(lines, l => /* vat portion */);
    const no = await nextCode("INV", tx);

    // 2. create the document + lines
    const inv = await tx.invoice.create({ data: { no, /* …*/, subtotal, vatTotal, grandTotal: subtotal+vatTotal, lines: { create: lines } } });

    // 3. decrement stock at the chosen location (one ledger row per line)
    for (const l of lines)
      await tx.stockLedger.create({ data: { productId: l.productId, locationId: input.locationId, qtyOut: l.qty, docType: "Invoice", docNo: no } });

    // 4. debit the customer ledger
    await tx.ledgerEntry.create({ data: { customerId: input.customerId, docType: "Invoice", docNo: no, debit: inv.grandTotal, narration: "Sale invoice" } });

    await logActivity(userId, "Sale Invoice", no, "Created", tx);
    return inv;
  });
}
```

**The rules to implement (faked in the prototype):**
- **Receipt** → credit the customer ledger; recompute the invoice's `paidTotal`/`status`.
- **Sale return** → validate `returnQty ≤ invoicedQty − priorReturns` **server-side**; add stock back (`qtyIn`); credit the ledger.
- **VAT & numbering** → centralize. `nextCode()` reads prefix + next-number from a `Preferences` table inside the transaction to avoid duplicate numbers under concurrency.
- **Current stock** = `SUM(qtyIn) − SUM(qtyOut)` grouped by product/location — a query, never a stored mutable number.

---

## 7. Wire the frontend to the API

Replace the prototype's `window.POSDATA` reads with TanStack Query:

```tsx
function CustomersScreen() {
  const { data: rows = [] } = useQuery({ queryKey: ["customers", q], queryFn: () => fetch(`/api/customers?q=${q}`).then(r => r.json()) });
  const create = useMutation({ mutationFn: (body) => fetch("/api/customers", { method: "POST", body: JSON.stringify(body) }), onSuccess: () => qc.invalidateQueries(["customers"]) });
  // …same <Card>/<DataTable>/<Modal> JSX as the prototype
}
```

The screen markup barely changes — that's the payoff of building the prototype on the real component API.

---

## 8. Build order (don't do it all at once)

Follow the dependency chain — each module needs the masters above it:

1. **Administration** — Branches → Roles/Rights → Users → Preferences (numbering, VAT). *Everything depends on these.*
2. **Product** — Categories → Sub-categories → UOM → Locations → Products → opening stock (via Bulk Import).
3. **Company** — Customer Types → Customers → Sale Persons.
4. **Sales** — Orders → Invoices → Returns → Receipts. *The posting logic in §6 lives here.*
5. **Reports** — read-only projections over the above (Ledger, Receivable, Stock Ledger, Registers, Audit). Build last.

Ship and test each module end-to-end before starting the next.

---

## 9. Reports & Bulk Import

- **Reports** are SQL aggregations rendered with the same `ReportScreen` shell. Add server-side date/branch filters; stream CSV for export. Print = a print-stylesheet route.
- **Bulk Import**: upload → parse CSV/XLSX (e.g. `papaparse`) → validate each row with the entity's Zod schema → return a preview with per-row errors → commit valid rows in a transaction. This is the prototype's 3-stage flow, made real.

---

## 10. Testing & deployment

- **Tests:** Vitest for posting logic (the math + transactions are where bugs hurt), Playwright for the critical flow (login → create invoice → post receipt → check ledger).
- **Deploy:** Vercel for the Next.js app + a managed Postgres (Neon, Supabase, or RDS). Run `prisma migrate deploy` in the release step. Keep `DATABASE_URL` and auth secrets in env vars.
- **Backups & audit:** enable Postgres point-in-time recovery; the `ActivityLog` table is your in-app audit trail.

---

## Estimated effort (one experienced full-stack dev)

| Phase | Rough effort |
|---|---|
| Scaffold + design system port | 2–3 days |
| DB schema + migrations | 2 days |
| Auth + RBAC | 2–3 days |
| Administration + Product modules | 1 week |
| Company + Sales modules + posting logic | 1.5–2 weeks |
| Reports + Bulk Import | 1 week |
| Testing, polish, deploy | 1 week |

**~6–8 weeks** to a solid v1. The design system removes essentially all of the UI-design and component-build time from that estimate.
