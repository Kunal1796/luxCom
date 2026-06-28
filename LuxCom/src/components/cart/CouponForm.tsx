import { useMemo, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useCartTotals } from "../../hooks/useCartTotals";
import {
  validateCouponFormat,
  validateCouponSync,
} from "../../services/couponService";
import { formatPrice } from "../../utils/pricing";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type CouponFormProps = {
  code?: string;
  onCodeChange?: (code: string) => void;
};

export function CouponForm({ code: externalCode, onCodeChange }: CouponFormProps = {}) {
  const [internalCode, setInternalCode] = useState("");
  const code = externalCode ?? internalCode;
  const setCode = onCodeChange ?? setInternalCode;
  const [loading, setLoading] = useState(false);
  const { applyCouponCode, appliedCoupon, clearCoupon, items } = useCart();
  const { discount, isCouponApplied } = useCartTotals();

  const preview = useMemo(() => {
    const trimmed = code.trim();
    if (!trimmed || appliedCoupon) return null;

    const formatError = validateCouponFormat(trimmed);
    if (formatError) {
      return { type: "error" as const, message: formatError };
    }

    const result = validateCouponSync(trimmed, items);
    if (result.valid === false) {
      return { type: "error" as const, message: result.error };
    }

    return {
      type: "success" as const,
      message: `Valid — saves ${formatPrice(result.discount)} on this order`,
    };
  }, [appliedCoupon, code, items]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const applied = await applyCouponCode(code);
    if (applied) setCode("");
    setLoading(false);
  }

  return (
    <div className="space-y-3 rounded-xl bg-surface-container-lowest p-4 shadow-elevation-1">
      <p className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
        Discount &amp; Coupon
      </p>

      {isCouponApplied && appliedCoupon ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-secondary/10 px-3 py-2">
            <div>
              <span className="text-body-md font-semibold text-secondary">
                {appliedCoupon.code}
              </span>
              <span className="ml-2 text-body-md text-on-surface-variant">
                {appliedCoupon.type === "percent"
                  ? `${appliedCoupon.value}% off`
                  : `$${appliedCoupon.value} off`}
              </span>
            </div>
            <button
              type="button"
              onClick={clearCoupon}
              className="text-label-sm font-medium text-primary-container"
            >
              Remove
            </button>
          </div>
          <p className="text-label-sm text-secondary">
            Discount applied: −{formatPrice(discount)} (updates as cart changes)
          </p>
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g. WELCOME10)"
              className="flex-1"
              maxLength={12}
            />
            <Button
              type="submit"
              className="shrink-0 bg-secondary text-on-secondary hover:opacity-90"
              disabled={loading || !code.trim() || preview?.type === "error"}
            >
              {loading ? "..." : "Apply"}
            </Button>
          </div>
          {preview && (
            <p
              className={`text-label-sm ${
                preview.type === "error" ? "text-error" : "text-secondary"
              }`}
            >
              {preview.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
