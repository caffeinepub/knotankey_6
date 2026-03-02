/**
 * Returns the shipping cost in INR based on the order subtotal.
 * Orders below ₹2999 incur a ₹80 shipping fee.
 * Orders of ₹2999 or above receive FREE shipping (₹0).
 */
export function calculateShipping(subtotal: number): number {
  return subtotal < 2999 ? 80 : 0;
}

export const FREE_SHIPPING_THRESHOLD = 2999;
export const SHIPPING_COST = 80;
