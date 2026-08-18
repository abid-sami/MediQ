export const BDT_CURRENCY_CODE = "BDT";

export function formatBDT(value: number | string | null | undefined): string {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: BDT_CURRENCY_CODE,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}
