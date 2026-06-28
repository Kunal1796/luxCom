import { useCartTotals } from "../../hooks/useCartTotals";
import { useAppSelector } from "../../redux/hooks";
import { formatPrice } from "../../utils/pricing";

type PriceSummaryProps = {
  showShipping?: boolean;
  compact?: boolean;
};

export function PriceSummary({ showShipping = true, compact = false }: PriceSummaryProps) {
  const { subtotal, discount, tax, total, itemCount, isCouponApplied } = useCartTotals();
  const appliedCode = useAppSelector((state) => state.cart.appliedCoupon?.code);

  return (
    <div
      className={`space-y-2 rounded-xl bg-surface-container p-4 ${
        compact ? "" : "shadow-elevation-1"
      }`}
    >
      <div className="flex justify-between text-body-md">
        <span className="text-on-surface-variant">Subtotal ({itemCount} items)</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-body-md">
          <span className="text-on-surface-variant">
            Discount{isCouponApplied && appliedCode ? ` (${appliedCode})` : ""}
          </span>
          <span className="font-semibold text-secondary">−{formatPrice(discount)}</span>
        </div>
      )}

      {showShipping && (
        <div className="flex justify-between text-body-md">
          <span className="text-on-surface-variant">Shipping</span>
          <span className="font-semibold text-secondary">FREE</span>
        </div>
      )}

      <div className="flex justify-between text-body-md">
        <span className="text-on-surface-variant">Tax (8%)</span>
        <span>{formatPrice(tax)}</span>
      </div>

      <div className="flex justify-between border-t border-outline-variant/40 pt-2">
        <span className="text-headline-sm font-bold text-on-surface">Total</span>
        <span className="text-headline-sm font-bold text-primary-container">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}
