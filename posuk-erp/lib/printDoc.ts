import { fmt } from "@/lib/currency";

export interface CompanyInfo {
  name: string;
  vat: string;
  address: string;
  footer: string;
  terms: string;
}

export function getCompanyInfo(prefs: { key: string; value: string }[] = []): CompanyInfo {
  const m: Record<string, string> = {};
  prefs.forEach((p) => { m[p.key] = p.value; });
  return {
    name: m.company_name || "POS UK Wholesale Ltd",
    vat: m.company_vat || "",
    address: m.company_address || "",
    footer: m.invoice_footer || "",
    terms: m.payment_terms || "",
  };
}

function esc(s: unknown): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(s ?? "").replace(/[&<>"']/g, (c) => map[c]);
}

const ukDate = (d: string | Date) => new Date(d).toLocaleDateString("en-GB");

function docHeader(company: CompanyInfo, docTitle: string, metaRows: [string, string][]) {
  return `
    <div class="doc-header">
      <div>
        <p class="company-name">${esc(company.name)}</p>
        <p class="company-meta">${esc(company.address)}${company.vat ? `<br/>VAT: ${esc(company.vat)}` : ""}</p>
      </div>
      <div>
        <div class="doc-title">${esc(docTitle)}</div>
        <div class="doc-meta">${metaRows.map(([k, v]) => `<div><strong>${esc(k)}:</strong> ${esc(v)}</div>`).join("")}</div>
      </div>
    </div>`;
}

function docFooter(company: CompanyInfo, extra?: string) {
  const note = [extra, company.footer].filter(Boolean).map(esc).join(" ");
  return note ? `<div class="footer-note">${note}</div>` : "";
}

function signatureBlock(leftLabel: string, rightLabel: string) {
  return `
    <div class="signatures">
      <div class="sig"><span>${esc(leftLabel)}</span></div>
      <div class="sig"><span>${esc(rightLabel)}</span></div>
    </div>`;
}

export function simpleTableDoc(title: string, subtitle: string, rows: [string, string][]): string {
  return `
    <h2 style="margin:0 0 4px;font-size:20px">${esc(title)}</h2>
    ${subtitle ? `<p style="color:#666;margin:0 0 20px;font-size:13px">${esc(subtitle)}</p>` : ""}
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      ${rows.map(([k, v]) => `<tr><td style="padding:7px 10px;border-bottom:1px solid #eee;color:#666;font-size:11px;text-transform:uppercase;width:40%;font-weight:600">${esc(k)}</td><td style="padding:7px 10px;border-bottom:1px solid #eee">${v}</td></tr>`).join("")}
    </table>`;
}

export function openPrintWindow(title: string, bodyHtml: string) {
  const win = window.open("", "_blank", "width=850,height=1100");
  if (!win) return;
  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 0; padding: 32px; }
  .doc { max-width: 760px; margin: 0 auto; }
  .doc-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #111; padding-bottom: 16px; margin-bottom: 20px; gap: 24px; }
  .company-name { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
  .company-meta { font-size: 12px; color: #444; line-height: 1.5; }
  .doc-title { font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-align: right; }
  .doc-meta { text-align: right; font-size: 12px; color: #444; margin-top: 6px; line-height: 1.6; }
  .section { margin-bottom: 18px; }
  .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #777; font-weight: 700; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th, td { padding: 8px 6px; font-size: 13px; text-align: left; border-bottom: 1px solid #ddd; }
  th { text-transform: uppercase; font-size: 11px; color: #555; border-bottom: 2px solid #111; }
  .text-right { text-align: right; }
  .totals { width: 280px; margin-left: auto; margin-top: 12px; }
  .totals td { padding: 6px; border-bottom: none; }
  .totals .grand td { font-size: 16px; font-weight: 800; border-top: 2px solid #111; }
  .footer-note { margin-top: 28px; font-size: 11.5px; color: #555; border-top: 1px solid #ddd; padding-top: 12px; }
  .signatures { display: flex; justify-content: space-between; margin-top: 56px; }
  .sig { border-top: 1px solid #999; width: 220px; padding-top: 6px; font-size: 11px; color: #666; text-align: center; }
  @media print { @page { size: A4; margin: 14mm; } }
</style>
</head>
<body>
  <div class="doc">${bodyHtml}</div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 150); };<\/script>
</body>
</html>`);
  win.document.close();
}

export interface InvoicePrintData {
  no: string;
  date: string | Date;
  dueDate: string | Date;
  status: string;
  notes?: string | null;
  customerName: string;
  customerAddress?: string | null;
  customerVat?: string | null;
  salePersonName?: string | null;
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  paidTotal: number;
  lines: { sku: string; name: string; qty: number; rate: number; discount: number; vatRate: number; lineTotal: number }[];
}

export function invoiceDoc(company: CompanyInfo, inv: InvoicePrintData): string {
  const rows = inv.lines.map((l, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(l.sku)}<br/><span style="color:#666">${esc(l.name)}</span></td>
      <td class="text-right">${l.qty}</td>
      <td class="text-right">${fmt(l.rate)}</td>
      <td class="text-right">${l.discount}%</td>
      <td class="text-right">${l.vatRate}%</td>
      <td class="text-right">${fmt(l.lineTotal)}</td>
    </tr>`).join("");

  return `
    ${docHeader(company, "Invoice", [["Invoice No", inv.no], ["Date", ukDate(inv.date)], ["Due date", ukDate(inv.dueDate)], ["Status", inv.status]])}
    <div class="section">
      <div class="section-label">Bill to</div>
      <div>${esc(inv.customerName)}</div>
      ${inv.customerAddress ? `<div style="font-size:12px;color:#555">${esc(inv.customerAddress)}</div>` : ""}
      ${inv.customerVat ? `<div style="font-size:12px;color:#555">VAT: ${esc(inv.customerVat)}</div>` : ""}
      ${inv.salePersonName ? `<div style="font-size:12px;color:#555">Sale person: ${esc(inv.salePersonName)}</div>` : ""}
    </div>
    <table>
      <thead><tr><th>#</th><th>Item</th><th class="text-right">Qty</th><th class="text-right">Rate</th><th class="text-right">Disc</th><th class="text-right">VAT</th><th class="text-right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <table class="totals">
      <tr><td>Subtotal</td><td class="text-right">${fmt(inv.subtotal)}</td></tr>
      <tr><td>VAT</td><td class="text-right">${fmt(inv.vatTotal)}</td></tr>
      <tr class="grand"><td>Grand total</td><td class="text-right">${fmt(inv.grandTotal)}</td></tr>
      <tr><td>Paid</td><td class="text-right">${fmt(inv.paidTotal)}</td></tr>
      <tr><td>Balance due</td><td class="text-right">${fmt(inv.grandTotal - inv.paidTotal)}</td></tr>
    </table>
    ${inv.notes ? `<div class="section"><div class="section-label">Notes</div><div>${esc(inv.notes)}</div></div>` : ""}
    ${docFooter(company)}
  `;
}

export interface ReceiptPrintData {
  code: string;
  date: string | Date;
  customerName: string;
  amount: number;
  mode: string;
  reference?: string | null;
}

export function receiptDoc(company: CompanyInfo, r: ReceiptPrintData): string {
  return `
    ${docHeader(company, "Receipt", [["Receipt No", r.code], ["Date", ukDate(r.date)], ["Mode", r.mode.replace("_", " ")]])}
    <div class="section">
      <div class="section-label">Received from</div>
      <div>${esc(r.customerName)}</div>
    </div>
    <table class="totals" style="width:100%">
      <tr class="grand"><td>Amount received</td><td class="text-right">${fmt(r.amount)}</td></tr>
    </table>
    ${r.reference ? `<div class="section"><div class="section-label">Reference</div><div>${esc(r.reference)}</div></div>` : ""}
    ${docFooter(company, "This receipt confirms payment received as detailed above.")}
    ${signatureBlock("Received by", "Authorised signature")}
  `;
}

export interface LedgerPrintData {
  docNo: string;
  date: string | Date;
  docType: string;
  narration?: string | null;
  debit: number;
  credit: number;
  balance: number;
}

export function ledgerDoc(company: CompanyInfo, customer: { code: string; name: string }, row: LedgerPrintData): string {
  return `
    ${docHeader(company, "Ledger Entry", [["Doc No", row.docNo], ["Date", ukDate(row.date)], ["Type", row.docType]])}
    <div class="section">
      <div class="section-label">Customer</div>
      <div>${esc(customer.code)} — ${esc(customer.name)}</div>
    </div>
    <table>
      <thead><tr><th>Narration</th><th class="text-right">Debit</th><th class="text-right">Credit</th><th class="text-right">Balance</th></tr></thead>
      <tbody><tr>
        <td>${esc(row.narration || "—")}</td>
        <td class="text-right">${row.debit > 0 ? fmt(row.debit) : "—"}</td>
        <td class="text-right">${row.credit > 0 ? fmt(row.credit) : "—"}</td>
        <td class="text-right">${fmt(row.balance)}</td>
      </tr></tbody>
    </table>
    ${docFooter(company)}
  `;
}

export interface OrderPrintData {
  no: string;
  date: string | Date;
  status: string;
  customerName: string;
  customerAddress?: string | null;
  salePersonName?: string | null;
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  lines: { sku: string; name: string; qty: number; rate: number; discount: number; vatRate: number; lineTotal: number }[];
}

export function orderDoc(company: CompanyInfo, ord: OrderPrintData): string {
  const rows = ord.lines.map((l, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(l.sku)}<br/><span style="color:#666">${esc(l.name)}</span></td>
      <td class="text-right">${l.qty}</td>
      <td class="text-right">${fmt(l.rate)}</td>
      <td class="text-right">${l.discount}%</td>
      <td class="text-right">${l.vatRate}%</td>
      <td class="text-right">${fmt(l.lineTotal)}</td>
    </tr>`).join("");

  return `
    ${docHeader(company, "Sale Order", [["Order No", ord.no], ["Date", ukDate(ord.date)], ["Status", ord.status]])}
    <div class="section">
      <div class="section-label">Customer</div>
      <div>${esc(ord.customerName)}</div>
      ${ord.customerAddress ? `<div style="font-size:12px;color:#555">${esc(ord.customerAddress)}</div>` : ""}
      ${ord.salePersonName ? `<div style="font-size:12px;color:#555">Sale person: ${esc(ord.salePersonName)}</div>` : ""}
    </div>
    <table>
      <thead><tr><th>#</th><th>Item</th><th class="text-right">Qty</th><th class="text-right">Rate</th><th class="text-right">Disc</th><th class="text-right">VAT</th><th class="text-right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <table class="totals">
      <tr><td>Subtotal</td><td class="text-right">${fmt(ord.subtotal)}</td></tr>
      <tr><td>VAT</td><td class="text-right">${fmt(ord.vatTotal)}</td></tr>
      <tr class="grand"><td>Grand total</td><td class="text-right">${fmt(ord.grandTotal)}</td></tr>
    </table>
    ${docFooter(company)}
  `;
}

export interface ReturnPrintData {
  no: string;
  date: string | Date;
  invoiceNo: string;
  customerName: string;
  reason?: string | null;
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  lines: { sku: string; name: string; qty: number; rate: number; vatRate: number; lineTotal: number }[];
}

export function returnDoc(company: CompanyInfo, ret: ReturnPrintData): string {
  const rows = ret.lines.map((l, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(l.sku)}<br/><span style="color:#666">${esc(l.name)}</span></td>
      <td class="text-right">${l.qty}</td>
      <td class="text-right">${fmt(l.rate)}</td>
      <td class="text-right">${l.vatRate}%</td>
      <td class="text-right">${fmt(l.lineTotal)}</td>
    </tr>`).join("");

  return `
    ${docHeader(company, "Sale Return", [["Return No", ret.no], ["Date", ukDate(ret.date)], ["Against Invoice", ret.invoiceNo]])}
    <div class="section">
      <div class="section-label">Customer</div>
      <div>${esc(ret.customerName)}</div>
      ${ret.reason ? `<div style="font-size:12px;color:#555">Reason: ${esc(ret.reason)}</div>` : ""}
    </div>
    <table>
      <thead><tr><th>#</th><th>Item</th><th class="text-right">Qty</th><th class="text-right">Rate</th><th class="text-right">VAT</th><th class="text-right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <table class="totals">
      <tr><td>Subtotal</td><td class="text-right">${fmt(ret.subtotal)}</td></tr>
      <tr><td>VAT</td><td class="text-right">${fmt(ret.vatTotal)}</td></tr>
      <tr class="grand"><td>Refund total</td><td class="text-right">${fmt(ret.grandTotal)}</td></tr>
    </table>
    ${docFooter(company, "This document confirms goods returned as listed above.")}
    ${signatureBlock("Received by", "Authorised signature")}
  `;
}

export interface ReceivablePrintData {
  code: string;
  name: string;
  typeName: string;
  phone?: string | null;
  balance: number;
}

export function receivableDoc(company: CompanyInfo, row: ReceivablePrintData): string {
  return `
    ${docHeader(company, "Statement of Account", [["Customer", row.code], ["Date", ukDate(new Date())]])}
    <div class="section">
      <div class="section-label">Customer</div>
      <div>${esc(row.name)} (${esc(row.code)})</div>
      <div style="font-size:12px;color:#555">${esc(row.typeName)}${row.phone ? " · " + esc(row.phone) : ""}</div>
    </div>
    <table class="totals" style="width:100%">
      <tr class="grand"><td>Outstanding balance</td><td class="text-right">${fmt(row.balance)}</td></tr>
    </table>
    ${docFooter(company, `Please settle the outstanding balance at your earliest convenience.${company.terms ? ` Payment terms: ${company.terms}.` : ""}`)}
  `;
}
