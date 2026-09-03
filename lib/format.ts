export function formatPrice(price: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
