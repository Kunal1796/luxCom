import type { CartItem } from "../../types/cart";
import { formatPrice } from "../../utils/pricing";

type OrderItemRowProps = {
  item: CartItem;
};

export function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div className="flex gap-3 rounded-xl bg-surface-container-lowest p-3 shadow-elevation-1">
      <img
        src={item.image}
        alt={item.title}
        className="size-16 rounded-lg border border-outline-variant/50 object-cover"
      />
      <div className="flex flex-1 flex-col justify-center">
        <h4 className="text-body-md font-semibold text-on-surface">{item.title}</h4>
        <p className="text-label-sm text-on-surface-variant">
          {item.category} · Qty: {item.quantity}
        </p>
      </div>
      <span className="self-center text-body-md font-bold text-primary-container">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}
