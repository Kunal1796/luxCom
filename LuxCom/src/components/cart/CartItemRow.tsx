import { useCallback } from "react";
import { useCart } from "../../hooks/useCart";
import type { CartItem } from "../../types/cart";
import { formatPrice } from "../../utils/pricing";
import { FiMinus, FiPlus, FiTrash2 } from "../ui/icons";

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const { changeQuantity, removeFromCart } = useCart();

  const decrease = useCallback(() => {
    changeQuantity(item.productId, item.quantity - 1);
  }, [changeQuantity, item.productId, item.quantity]);

  const increase = useCallback(() => {
    changeQuantity(item.productId, item.quantity + 1);
  }, [changeQuantity, item.productId, item.quantity]);

  return (
    <article className="flex gap-3 rounded-xl bg-surface-container-lowest p-3 shadow-elevation-1 lg:gap-4 lg:p-4">
      <img
        src={item.image}
        alt={item.title}
        className="size-20 shrink-0 rounded-lg border border-outline-variant/50 object-cover lg:size-24"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-body-md font-semibold text-on-surface">{item.title}</h3>
            <p className="text-label-sm text-on-surface-variant">{item.category}</p>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(item.productId)}
            className="text-on-surface-variant hover:text-error"
            aria-label="Remove item"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-body-md font-bold text-primary-container">
            {formatPrice(item.price * item.quantity)}
          </span>

          <div className="flex items-center gap-2 rounded-full bg-surface-container-high px-2 py-1">
            <button
              type="button"
              onClick={decrease}
              className="flex size-6 items-center justify-center text-on-surface-variant"
              aria-label="Decrease quantity"
            >
              <FiMinus size={14} />
            </button>
            <span className="min-w-[1.25rem] text-center text-body-md font-medium">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              className="flex size-6 items-center justify-center text-on-surface-variant"
              aria-label="Increase quantity"
            >
              <FiPlus size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
