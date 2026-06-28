import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCart } from "../../hooks/useCart";
import { describeCouponRestrictions } from "../../services/couponService";
import { getActiveCoupons } from "../../utils/couponStorage";
import { formatPrice } from "../../utils/pricing";
import type { CouponDefinition } from "../../types/coupon";

type AvailableCouponsProps = {
  onSelect: (code: string) => void;
};

function couponLabel(coupon: CouponDefinition): string {
  const savings =
    coupon.type === "percent"
      ? `${coupon.value}% off`
      : `${formatPrice(coupon.value)} off`;
  return `${coupon.code} — ${savings}`;
}

export function AvailableCoupons({ onSelect }: AvailableCouponsProps) {
  const { items } = useCart();
  const coupons = useMemo(() => getActiveCoupons(), []);

  if (coupons.length === 0) return null;

  function handleCopy(coupon: CouponDefinition) {
    onSelect(coupon.code);
    toast.success(`Code ${coupon.code} ready to apply`);
  }

  return (
    <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4">
      <p className="mb-3 text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
        Available Coupons
      </p>
      <ul className="space-y-2">
        {coupons.map((coupon) => (
          <li
            key={coupon.code}
            className="flex items-start justify-between gap-3 rounded-lg bg-surface-container px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="text-body-md font-semibold text-on-surface">
                {couponLabel(coupon)}
              </p>
              {coupon.description && (
                <p className="text-label-sm text-on-surface-variant">
                  {coupon.description}
                </p>
              )}
              <p className="mt-0.5 text-label-sm text-on-surface-variant/80">
                {describeCouponRestrictions(coupon)}
              </p>
              {items.length === 0 && (
                <p className="mt-1 text-label-sm text-on-surface-variant">
                  Add items to cart first
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(coupon)}
              className="shrink-0 text-label-sm font-semibold text-primary-container hover:underline"
            >
              Use
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
