import type { CartItem } from "../types/cart";
import type { AppliedCoupon, CouponDefinition, CouponValidationResult } from "../types/coupon";
import { findCouponByCode, isCouponExpired } from "../utils/couponStorage";

export const COUPON_FORMAT = /^[A-Z0-9]{4,12}$/;

function sumItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

export function validateCouponFormat(code: string): string | null {
  const normalized = normalizeCouponCode(code);
  if (!normalized) {
    return "Please enter a coupon code.";
  }
  if (!COUPON_FORMAT.test(normalized)) {
    return "Invalid format. Use 4–12 uppercase letters or numbers.";
  }
  return null;
}

export function getEligibleItems(
  items: CartItem[],
  coupon: CouponDefinition | AppliedCoupon,
): CartItem[] {
  if (coupon.eligibleProductIds?.length) {
    const ids = new Set(coupon.eligibleProductIds);
    return items.filter((item) => ids.has(item.productId));
  }

  if (coupon.eligibleCategories?.length) {
    const categories = coupon.eligibleCategories.map((c) => c.toLowerCase());
    return items.filter((item) =>
      categories.includes(item.category.toLowerCase()),
    );
  }

  return items;
}

export function getEligibleSubtotal(
  items: CartItem[],
  coupon: CouponDefinition | AppliedCoupon,
): number {
  return sumItems(getEligibleItems(items, coupon));
}

export function computeCouponDiscount(
  items: CartItem[],
  coupon: CouponDefinition | AppliedCoupon,
): number {
  const eligibleSubtotal = getEligibleSubtotal(items, coupon);
  if (eligibleSubtotal <= 0) return 0;

  let discount =
    coupon.type === "percent"
      ? (eligibleSubtotal * coupon.value) / 100
      : coupon.value;

  if (coupon.type === "percent" && coupon.maxDiscount != null) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return Math.min(discount, eligibleSubtotal);
}

export function validateAppliedCoupon(
  items: CartItem[],
  coupon: AppliedCoupon,
): CouponValidationResult {
  if (items.length === 0) {
    return { valid: false, error: "Add items to your cart before applying a coupon." };
  }

  if (isCouponExpired(coupon)) {
    return { valid: false, error: "This coupon has expired." };
  }

  const eligibleItems = getEligibleItems(items, coupon);
  if (coupon.eligibleProductIds?.length || coupon.eligibleCategories?.length) {
    if (eligibleItems.length === 0) {
      const restriction =
        coupon.eligibleProductIds?.length
          ? "selected products"
          : coupon.eligibleCategories!.join(", ");
      return {
        valid: false,
        error: `Coupon only valid for: ${restriction}.`,
      };
    }
  }

  const eligibleSubtotal = sumItems(eligibleItems);
  if (eligibleSubtotal < coupon.minCartValue) {
    return {
      valid: false,
      error: `Minimum eligible cart value of $${coupon.minCartValue.toFixed(2)} required (currently $${eligibleSubtotal.toFixed(2)}).`,
    };
  }

  const discount = computeCouponDiscount(items, coupon);
  if (discount <= 0) {
    return { valid: false, error: "This coupon cannot be applied to your cart." };
  }

  return { valid: true, discount, coupon };
}

export function validateCouponSync(
  code: string,
  items: CartItem[],
): CouponValidationResult {
  const formatError = validateCouponFormat(code);
  if (formatError) {
    return { valid: false, error: formatError };
  }

  const normalized = normalizeCouponCode(code);
  const coupon = findCouponByCode(normalized);
  if (!coupon) {
    return { valid: false, error: "Coupon code not found." };
  }

  if (isCouponExpired(coupon)) {
    return { valid: false, error: "This coupon has expired." };
  }

  return validateAppliedCoupon(items, coupon);
}

export async function validateCoupon(
  code: string,
  items: CartItem[],
): Promise<CouponValidationResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return validateCouponSync(code, items);
}

export function toAppliedCoupon(coupon: CouponDefinition): AppliedCoupon {
  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minCartValue: coupon.minCartValue,
    expiresAt: coupon.expiresAt,
    eligibleCategories: coupon.eligibleCategories,
    eligibleProductIds: coupon.eligibleProductIds,
    maxDiscount: coupon.maxDiscount,
  };
}

export function describeCouponRestrictions(coupon: CouponDefinition): string {
  const parts: string[] = [];

  if (coupon.eligibleCategories?.length) {
    parts.push(`Categories: ${coupon.eligibleCategories.join(", ")}`);
  }
  if (coupon.eligibleProductIds?.length) {
    parts.push(`Product IDs: ${coupon.eligibleProductIds.join(", ")}`);
  }
  if (coupon.minCartValue > 0) {
    parts.push(`Min. $${coupon.minCartValue.toFixed(0)}`);
  }
  if (coupon.type === "percent" && coupon.maxDiscount) {
    parts.push(`Max discount $${coupon.maxDiscount.toFixed(0)}`);
  }

  return parts.join(" · ") || "No restrictions";
}
