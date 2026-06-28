import { useMemo } from "react";
import { useAppSelector } from "../redux/hooks";
import { validateAppliedCoupon } from "../services/couponService";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  TAX_RATE,
} from "../utils/pricing";

export function useCartTotals() {
  const { items, appliedCoupon } = useAppSelector((state) => state.cart);

  return useMemo(() => {
    const subtotal = calculateSubtotal(items);
    const couponValidation = appliedCoupon
      ? validateAppliedCoupon(items, appliedCoupon)
      : null;
    const discount =
      couponValidation?.valid === true
        ? couponValidation.discount
        : calculateDiscount(items, appliedCoupon);
    const tax = calculateTax(subtotal, discount);
    const total = calculateTotal(subtotal, discount, tax);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      subtotal,
      discount,
      tax,
      total,
      itemCount,
      taxRate: TAX_RATE,
      shipping: subtotal > 0 ? 0 : 0,
      isFreeShipping: subtotal > 0,
      couponValidation,
      isCouponApplied: appliedCoupon != null && couponValidation?.valid === true,
    };
  }, [items, appliedCoupon]);
}
