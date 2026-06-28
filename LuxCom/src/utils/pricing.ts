import type { CartItem } from "../types/cart";
import type { AppliedCoupon } from "../types/coupon";
import { computeCouponDiscount, validateAppliedCoupon } from "../services/couponService";

const TAX_RATE = Number(import.meta.env.VITE_TAX_RATE) || 0.08;

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateDiscount(
  items: CartItem[],
  coupon: AppliedCoupon | null,
): number {
  if (!coupon || items.length === 0) return 0;
  const result = validateAppliedCoupon(items, coupon);
  if (!result.valid) return 0;
  return result.discount;
}

export function calculateTax(subtotal: number, discount: number): number {
  const taxable = Math.max(subtotal - discount, 0);
  return taxable * TAX_RATE;
}

export function calculateTotal(
  subtotal: number,
  discount: number,
  tax: number,
): number {
  return Math.max(subtotal - discount + tax, 0);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export { TAX_RATE, computeCouponDiscount };
