# POS UK — Design System

A design system for **POS UK**, a phased **POS / ERP web application** for UK retail and wholesale operations: administration & RBAC, company/accounts-receivable, product & stock, and sales documents (orders → invoices → returns) with receipts, ledgers and audit logging.

This system captures the product's **dark, dense, application-grade** visual language — a deep navy canvas, a signature **cyan→blue** accent, and Plus Jakarta Sans throughout — and packages it as tokens, reusable React components, foundation specimens, and an interactive UI-kit recreation.

---

## Sources

This system was reverse-engineered from the product source. If you have access, explore these to build with higher fidelity:

- **`ahmaddmuneeb/pos-uk-designs`** — the repo attached to this project. It is currently **empty** (no committed files), so nothing could be drawn from it directly. *Ask the maintainer to populate it, or point this system at the product repo below.*
- **`ahmaddmuneeb/pos-product-uk`** — the actual product monorepo and the true source of truth for this system. Web app under `apps/web` (React + Vite). Everything here was lifted from:
  - `apps/web/src/styles.css` — the single global stylesheet (tokens, shell, cards, tables, modals, login, dashboard, health).
  - `apps/web/src/pages/` — `shell.tsx`, `login.tsx`, `dashboard.tsx`, and the `*-module.tsx` screens (admin, company, product, sales).
  - `apps/web/index.html` — the Plus Jakarta Sans webfont link.

> GitHub: https://github.com/ahmaddmuneeb/pos-product-uk · https://github.com/ahmaddmuneeb/pos-uk-designs
> Explore the product repo to extend this system: the full screen set (branches, users, user-rights matrices, preferences, bulk import, categories, UOMs, stock locations, products, registers) lives there and can be recreated as additional UI-kit screens.

---

## Content fundamentals

How POS UK writes copy — match this for any new screen, label, or message.

- **Voice — operational, terse, British.** This is back-office software for shop and warehouse staff; copy is functional, never marketing-y. Page titles are bare nouns: *Dashboard*, *Customers*, *Sale invoices*, *Receipts*, *Sales registers*. No taglines, no exclamation, no emoji.
- **Buttons are verb-first and short.** *New invoice*, *New customer*, *Post receipt*, *Post invoice*, *Save order*, *Add line*, *Load lines from order*, *Export CSV*, *Refresh*, *Apply*, *Log out*. Primary actions usually start with **New** / **Post** / **Save**; secondary with **Refresh** / **Apply** / **Cancel**.
- **Casing — sentence case everywhere** ("Sale invoices", "Stock locations", "Customer ledger"), with three deliberate exceptions: **UPPERCASE overlines** for nav sections and table column heads ("OVERVIEW", "ADMINISTRATION", "CODE", "STATUS"); **SCREAMING_SNAKE enum values** surfaced raw from the API (`CASH`, `BANK_TRANSFER`, `CHEQUE`); and the brand string **POS / ERP**.
- **Second person, sparingly.** Helper text addresses the user ("Sign in to continue to POS / ERP", "Summary for the selected branch and date range", "Search name or code"). System constraints are stated as plain fact, often noting server enforcement: *"Max return qty per product is enforced server-side against invoiced minus prior returns."*
- **Domain vocabulary is precise and consistent.** Branch, customer, customer type, sale person, receipt, receivables, ledger, sale order, sale invoice, sale return, UOM, stock location, reorder, VAT, AR, RBAC. Money is **£ GBP**. Documents have typed codes: `INV-1042`, `RCP-0502`, `CUST-0001`, `SKU-1001`.
- **Empty / loading states are one quiet word or phrase.** "Loading…", "—" for an absent metric, "(no data)". Errors are surfaced inline in danger red, plainly worded.
- **Vibe:** trustworthy, fast, no-nonsense. A tool you live in all day, not one you're being sold.

---

## Visual foundations

- **Theme — one dark theme, no light mode.** `color-scheme: dark`. The canvas is a deep desaturated navy `#0c1222`; surfaces climb a tight elevation ladder (`#111827` chrome → `#151f32` inputs → `#1a2438` cards). There is no pure black and no pure white.
- **Accent — cyan, used as a scalpel.** A single accent `#22d3ee` carries focus rings, active nav, links, tabs, and the leading dots on badges. It is never used for large fills — it earns attention precisely because it's rationed.
- **The signature gradient.** `linear-gradient(135deg, #06b6d4 → #3b82f6)` (cyan→blue) appears only on the brand mark, primary buttons, and the avatar chip — always paired with a soft cyan **glow** (`0 0 20px rgba(34,211,238,.15)` on marks, `0 2px 12px rgba(6,182,212,.25)` on CTAs). This glow is the brand's most recognisable flourish.
- **Backgrounds — ambient radial washes, never flat.** Both the app and login layer two faint radial blooms over the navy: cyan from the top-right, blue from the bottom-left (`--wash-app` / `--wash-login`). No imagery, no photography, no patterns, no noise — the product ships zero raster art. Depth comes from gradient washes + elevation + shadow.
- **Type — Plus Jakarta Sans, one family.** Weights 400–800; titles are bold (700) and tight (`-0.02em`), large headings tighter (`-0.03em`). The scale is small and information-dense (14px body, 11–13px meta, 10px overlines). JetBrains Mono appears only for codes, IDs and raw payloads.
- **Borders — hairlines, mostly translucent.** Default `rgba(148,163,184,.12)`; an accented `rgba(56,189,248,.22)` marks active/strong states (active nav uses an *inset* accent ring, not a solid border). Tables and lists are separated by single bottom hairlines, not boxes.
- **Corner radii.** 8px on controls (buttons, inputs, nav items, tabs, chips), 12px on cards and modals, 16px on the login panel, pill (999px) on status badges.
- **Cards.** Solid `#1a2438` fill, 1px hairline border, 12px radius, soft deep shadow `0 4px 24px rgba(0,0,0,.35)`. No colored left-border accents, no nested card-in-card chrome. Cards frame nearly every screen section and carry an h2 title (often with right-aligned ghost actions).
- **Shadows — deep and soft.** `--shadow` for cards; `--shadow-lg` (`0 24px 48px rgba(0,0,0,.45)`) for modals and the login panel. Plus the brand cyan glows above.
- **Transparency & blur.** The topbar is glass: `rgba(17,24,39,.75)` + `backdrop-filter: blur(12px)`. Modal scrims are `rgba(0,0,0,.55)`. Translucency is reserved for chrome and overlays — content surfaces stay solid.
- **Motion — short and functional.** 0.1–0.15s transitions on `background` / `color` / `box-shadow` / `transform`; ease `cubic-bezier(.4,0,.2,1)`. The only looping animation in the product is the System-health status orb (a 2.4s pulse / 1.2s breathe). No entrance choreography, no bounce, no parallax.
- **Hover states.** Ghost buttons & nav items lift to `rgba(255,255,255,.05–.06)` and brighten text muted→primary; primary buttons deepen their glow and `brightness(1.06)`. **Press/disabled:** disabled drops to 55% opacity with `not-allowed`; there is no shrink-on-press.
- **Focus.** Always a 3px cyan ring (`0 0 0 3px rgba(34,211,238,.15)`) plus an accent-dim border — consistent across inputs, selects and textareas.
- **Layout.** Fixed 252px sidebar (its own top-to-bottom gradient) + 56px glass topbar + fluid content padded at 20px. Content tops out around 960px for reading-width screens (health, reports). Forms stack labels above controls; dense line-item rows use flex/grid with tight 5.6px gaps.

---

## Iconography

**The product ships almost no icons** — and faithfully recreating it means resisting the urge to add them.

- **No icon library, font, or sprite is used in the source.** The UI leans entirely on **text labels** for actions ("Delete", "Header", "Refresh", "Pick product", "Add line"). This text-forward density is itself part of the brand.
- **Unicode glyphs** stand in for the few true icons: **✕** (`U+2715`) to remove a line item, **·** as a separator, **—** / **…** as placeholders. The status badge uses a small CSS dot, not a glyph.
- **The only "logo" is a CSS construct:** a gradient rounded square containing the letter **P**, with a cyan glow — rendered at 36px in the sidebar and 48px on login. This system reproduces it two ways: the `BrandMark` component and `assets/logo-mark.svg` (same mark as a standalone file).
- **No emoji.** None appear in the product and none should be added.
- **Substitution guidance (flagged):** if a *new* screen genuinely needs iconography (e.g. a richer toolbar), use **[Lucide](https://lucide.dev)** — its 1.5px stroke weight and rounded, restrained style is the closest match to this UI's minimal, slate-grey aesthetic. Tint icons `--text-muted` (`#94a3b8`) by default and `--accent` when active. **This is a substitution, not from the source — confirm before relying on it.**

---

## Foundations at a glance

| Concern | Where |
|---|---|
| Global entry (consumers link this) | `styles.css` → `@import`s everything below |
| Color tokens | `tokens/colors.css` — surfaces, accent, gradient, text ramp, semantic status |
| Type tokens | `tokens/typography.css` — family, weights, scale, tracking |
| Spacing & radii | `tokens/spacing.css` — 4px rhythm, radii, layout constants |
| Effects | `tokens/effects.css` — shadows, glows, focus ring, blur, washes, motion |
| Webfont | `tokens/fonts.css` — Plus Jakarta Sans + JetBrains Mono (Google Fonts) |

---

## Components

Reusable React primitives. Import from the compiled bundle: `const { Button } = window.POSUKDesignSystem_85bb4f`.

- **`components/core/`** — `Button` (primary / ghost / danger; sm·md·lg; block), `IconButton` (square, ghost/bare/accent), `BrandMark` (the logo, with optional wordmark lockup).
- **`components/forms/`** — `Field` (stacked label + hint/error), `Input`, `Textarea`, `Select` (custom chevron). Cyan focus ring, danger `invalid` state.
- **`components/data-display/`** — `Card`, `StatCard` (dashboard KPI chip), `Badge` (pill status, semantic tones), `Tabs` (segmented), `DataTable` (column-config list table).
- **`components/navigation/`** — `NavSection` (overline), `NavItem` (sidebar link with active accent).
- **`components/feedback/`** — `Modal` (scrim dialog, `wide` for line-item forms).

Each directory carries a `*.card.html` specimen (shown in the Design System tab) and each component has a `.d.ts` contract + `.prompt.md` usage note.

## UI kits

- **`ui_kits/pos-web/`** — interactive, development-ready recreation of the full POS / ERP web app, built directly from the PRD + user manual. Entry: `ui_kits/pos-web/index.html`. Every screen composes the design-system primitives. File layout: `data.js` (in-memory seed mirroring PRD entities), `kit.jsx` (shared toolbar / report / list scaffolds), `shell.jsx` (sidebar + topbar + login), and one `screens-*.jsx` per module. Coverage:
  - **Overview** — Dashboard (KPI stats, recent invoices, re-order alerts).
  - **Company** — Customers (search, filter, create, **drill-in customer history** with running balance), Customer Types, Customer Receipts (post + list, payment modes), Sale Persons; Ledger & Receivable reports.
  - **Product** — Categories, Sub Categories, Products (full add form: SKU, type, category, UOM, 3 price tiers, re-order level, barcode), Stock Locations, UOM; six stock reports incl. **Stock Ledger** and printable **Product Barcode** labels.
  - **Sales** — Sale Orders, Sale Invoices (**line-item editor with product picker + live per-line and grand VAT totals**), Sale Returns (against an invoice); Sale Register & Return Register reports.
  - **Administration** — Branches, Users, **User Rights matrix** (per-screen View/Create/Edit/Delete/Print toggles), Preferences (tax, numbering, defaults), **Bulk Import** (upload → validated preview → commit); User Activity, Active Users & Users List reports.

---

## Index / manifest

```
styles.css                     ← global entry (consumers link this)
tokens/                        colors · typography · spacing · effects · fonts
assets/logo-mark.svg           the P brand mark as a standalone file
components/
  core/ forms/ data-display/ navigation/ feedback/
guidelines/                    foundation specimen cards (Colors · Type · Spacing · Brand)
ui_kits/pos-web/               full interactive POS/ERP web app (data.js · kit.jsx · shell.jsx · screens-*.jsx)
SKILL.md                       Agent-Skills-compatible entry point
readme.md                      this file
```

The **Design System tab** renders every `@dsCard`-tagged specimen, grouped: Colors, Type, Spacing, Brand, Components, POS Web App.

---

## Caveats

- This UI kit was built from the attached **PRD** (`POS_System_PRD.docx`) and **user documentation** (`POS_Documentation Requirements.pdf`) — the commercial BTRD/Proposal docs were read for context but don't drive screen design. The Google Drive folder link itself isn't reachable from here; everything is based on the files you attached directly.
- The attached `pos-uk-designs` repo is **empty**; the visual system is built from `pos-product-uk`. If `pos-uk-designs` is meant to hold curated design assets, populate it and re-run.
- **Plus Jakarta Sans** and **JetBrains Mono** load from **Google Fonts**. No binaries are vendored.
- **Iconography is intentionally minimal** (text + Unicode). Lucide is suggested only as a *future* substitute and is not used in the kit.
- The kit is a **high-fidelity design prototype** with fake in-memory data: all create/post/search/filter/navigation flows work, but there is no real persistence, auth, or server-side validation (e.g. the documented "max return qty enforced server-side" rule is noted in the UI but not computed).
