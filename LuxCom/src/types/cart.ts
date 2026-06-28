import type { AppliedCoupon } from "./coupon";

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  image: string;
  category: string;
  categoryId: number;
  quantity: number;
  variant?: string;
};

export type { AppliedCoupon };

export type CartState = {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
};
