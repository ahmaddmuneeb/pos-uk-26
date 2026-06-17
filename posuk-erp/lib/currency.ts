export function fmt(amount: number | string | { toFixed: (n: number) => string }): string {
  const n = typeof amount === "number" ? amount : parseFloat(String(amount));
  if (isNaN(n)) return "£0.00";
  return `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
