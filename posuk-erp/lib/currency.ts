type CurrencyCode = "GBP" | "USD" | "EUR";

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; locale: string }> = {
  GBP: { symbol: "£", locale: "en-GB" },
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
};

let _currency: CurrencyCode = "GBP";

export function setCurrency(code: string) {
  if (code in CURRENCY_CONFIG) _currency = code as CurrencyCode;
}

export function getCurrency(): CurrencyCode {
  return _currency;
}

export function currencySymbol(): string {
  return CURRENCY_CONFIG[_currency].symbol;
}

export function fmt(amount: number | string | { toFixed: (n: number) => string }): string {
  const n = typeof amount === "number" ? amount : parseFloat(String(amount));
  if (isNaN(n)) return `${CURRENCY_CONFIG[_currency].symbol}0.00`;
  const { symbol, locale } = CURRENCY_CONFIG[_currency];
  return `${symbol}${n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
