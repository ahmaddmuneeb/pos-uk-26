---
name: pos-uk-design
description: Use this skill to generate well-branded interfaces and assets for POS UK — a dark, dense POS / ERP web application for UK retail & wholesale — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

POS UK is a **single dark theme**: deep navy canvas (`#0c1222`), a rationed **cyan** accent (`#22d3ee`), a signature **cyan→blue gradient** (`#06b6d4 → #3b82f6`) with a soft cyan glow on the brand mark and primary buttons, and **Plus Jakarta Sans** throughout. Dense, application-grade, text-forward, almost no icons, no imagery, no emoji.

- `styles.css` — link this one file; it `@import`s all tokens + fonts. Use the CSS custom properties (`var(--bg-base)`, `var(--accent)`, `var(--primary)`, `var(--radius)`, …) rather than hardcoding values.
- `tokens/` — colors, typography, spacing, effects, fonts.
- `components/` — React primitives (Button, Field/Input/Select, Card, StatCard, Badge, Tabs, DataTable, NavItem, Modal, BrandMark, IconButton). In a compiled design-system context import them from `window.POSUKDesignSystem_85bb4f`; in plain artifacts, copy the JSX or mirror the styles.
- `ui_kits/pos-web/` — interactive recreation of the POS/ERP web app (login, dashboard, customers, invoices, receipts) — the best reference for composing a full screen.
- `assets/logo-mark.svg` — the brand mark.
- `guidelines/` — foundation specimen cards.

## Rules of thumb

- Frame sections in `Card`s on the navy washed background; never flat-fill the page.
- Sentence case for labels; UPPERCASE only for nav-section / table-head overlines; verb-first buttons (New / Post / Save / Refresh).
- Cyan is a scalpel — focus rings, active nav, links, badge dots, tabs. The gradient is for the mark + primary CTAs only.
- 8px control radius, 12px card radius, pill badges. Hairline translucent borders. Deep soft shadows. Glass topbar.
- Money is £ GBP; documents carry typed codes (INV-…, RCP-…, CUST-…, SKU-…).
- No emoji. Icons are minimal — text labels and Unicode (✕). If you must add icons, use Lucide (slate, 1.5px stroke) and flag it as a substitution.
