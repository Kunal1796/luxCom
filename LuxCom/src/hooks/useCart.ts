import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addItem,
  applyCoupon,
  clearCart,
  removeCoupon,
  removeItem,
  updateQuantity,
} from "../redux/slices/cartSlice";
import {
  toAppliedCoupon,
  validateAppliedCoupon,
  validateCoupon,
} from "../services/couponService";
import type { Product } from "../types/product";

export function useCart() {
  const dispatch = useAppDispatch();
  const { items, appliedCoupon } = useAppSelector((state) => state.cart);
  const lastCouponError = useRef<string | null>(null);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (!appliedCoupon) {
      lastCouponError.current = null;
      return;
    }

    const result = validateAppliedCoupon(items, appliedCoupon);
    if (result.valid === false) {
      const { error } = result;
      if (error !== lastCouponError.current) {
        lastCouponError.current = error;
        dispatch(removeCoupon());
        toast.error(error);
      }
    } else {
      lastCouponError.current = null;
    }
  }, [appliedCoupon, dispatch, items]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      dispatch(addItem({ product, quantity }));
      toast.success("Added to cart");
    },
    [dispatch],
  );

  const removeFromCart = useCallback(
    (productId: number) => {
      dispatch(removeItem(productId));
      toast.success("Removed from cart");
    },
    [dispatch],
  );

  const changeQuantity = useCallback(
    (productId: number, quantity: number) => {
      dispatch(updateQuantity({ productId, quantity }));
    },
    [dispatch],
  );

  const applyCouponCode = useCallback(
    async (code: string) => {
      const result = await validateCoupon(code, items);
      if (result.valid === false) {
        toast.error(result.error);
        return false;
      }
      dispatch(applyCoupon(toAppliedCoupon(result.coupon)));
      toast.success(`Coupon ${result.coupon.code} applied!`);
      return true;
    },
    [dispatch, items],
  );

  const clearCoupon = useCallback(() => {
    dispatch(removeCoupon());
    toast.success("Coupon removed");
  }, [dispatch]);

  const emptyCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return {
    items,
    appliedCoupon,
    itemCount,
    addToCart,
    removeFromCart,
    changeQuantity,
    applyCouponCode,
    clearCoupon,
    emptyCart,
  };
}
