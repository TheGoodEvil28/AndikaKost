export function formatIdr(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export function formatDate(dateIso: string) {
  const d = new Date(dateIso);
  return new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "short", day: "2-digit" }).format(d);
}

