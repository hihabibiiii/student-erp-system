export const currency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);

export const percent = (value = 0) => `${Math.round(Number(value) || 0)}%`;
