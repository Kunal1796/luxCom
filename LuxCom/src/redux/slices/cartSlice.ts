import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppliedCoupon, CartItem } from "../../types/cart";
import type { Product } from "../../types/product";

const CART_KEY = "luxe_cart";

type CartSliceState = {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
};

function normalizeAppliedCoupon(raw: unknown): AppliedCoupon | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  if (typeof c.code !== "string" || typeof c.type !== "string") return null;

  return {
    code: c.code,
    type: c.type as AppliedCoupon["type"],
    value: Number(c.value),
    minCartValue: Number(c.minCartValue ?? 0),
    expiresAt: String(c.expiresAt ?? "2099-12-31"),
    eligibleCategories: c.eligibleCategories as string[] | undefined,
    eligibleProductIds: c.eligibleProductIds as number[] | undefined,
    maxDiscount: c.maxDiscount != null ? Number(c.maxDiscount) : undefined,
  };
}

function loadCart(): CartSliceState {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CartSliceState;
      return {
        items: parsed.items ?? [],
        appliedCoupon: normalizeAppliedCoupon(parsed.appliedCoupon),
      };
    }
  } catch {
    localStorage.removeItem(CART_KEY);
  }
  return { items: [], appliedCoupon: null };
}

function persistCart(state: CartSliceState): void {
  localStorage.setItem(CART_KEY, JSON.stringify(state));
}

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart(),
  reducers: {
    addItem(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, 99);
      } else {
        state.items.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0] ?? "",
          category: product.category.name,
          categoryId: product.category.id,
          quantity: Math.min(Math.max(quantity, 1), 99),
        });
      }
      persistCart(state);
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persistCart(state);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (!item) return;

      const qty = action.payload.quantity;
      if (qty <= 0) {
        state.items = state.items.filter((i) => i.productId !== action.payload.productId);
      } else {
        item.quantity = Math.min(Math.max(qty, 1), 99);
      }
      persistCart(state);
    },
    applyCoupon(state, action: PayloadAction<AppliedCoupon>) {
      state.appliedCoupon = action.payload;
      persistCart(state);
    },
    removeCoupon(state) {
      state.appliedCoupon = null;
      persistCart(state);
    },
    clearCart(state) {
      state.items = [];
      state.appliedCoupon = null;
      persistCart(state);
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
