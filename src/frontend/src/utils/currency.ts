/**
 * Formats a number as Indian Rupees (INR) with the ₹ symbol
 * and Indian comma formatting (e.g., ₹1,299 / ₹10,999 / ₹1,00,000).
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
