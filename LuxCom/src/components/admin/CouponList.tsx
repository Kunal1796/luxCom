import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { describeCouponRestrictions } from "../../services/couponService";
import {
  deleteGeneratedCoupon,
  getAllCoupons,
  isCouponExpired,
} from "../../utils/couponStorage";
import { formatPrice } from "../../utils/pricing";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function CouponList() {
  const [refreshKey, setRefreshKey] = useState(0);

  const coupons = useMemo(() => {
    void refreshKey;
    return getAllCoupons();
  }, [refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  }

  function handleDelete(code: string, isGenerated?: boolean) {
    if (!isGenerated) {
      toast.error("Built-in coupons cannot be deleted.");
      return;
    }
    deleteGeneratedCoupon(code);
    toast.success(`Deleted ${code}`);
    refresh();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-elevation-1">
      <div className="border-b border-outline-variant/40 px-4 py-3">
        <h3 className="text-headline-sm text-on-surface">All Coupons</h3>
        <p className="text-body-md text-on-surface-variant">
          {coupons.length} codes · built-in and admin-generated
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-body-md">
          <thead className="bg-surface-container text-label-sm uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Discount</th>
              <th className="px-4 py-3 font-semibold">Rules</th>
              <th className="px-4 py-3 font-semibold">Expires</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {coupons.map((coupon) => {
              const expired = isCouponExpired(coupon);
              const discountLabel =
                coupon.type === "percent"
                  ? `${coupon.value}%${coupon.maxDiscount ? ` (max ${formatPrice(coupon.maxDiscount)})` : ""}`
                  : formatPrice(coupon.value);

              return (
                <tr key={coupon.code} className="hover:bg-surface-container/50">
                  <td className="px-4 py-3 font-semibold text-on-surface">
                    {coupon.code}
                    {coupon.isGenerated && (
                      <span className="ml-2 text-label-sm text-on-surface-variant">
                        (generated)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{discountLabel}</td>
                  <td className="max-w-xs px-4 py-3 text-label-sm text-on-surface-variant">
                    {describeCouponRestrictions(coupon)}
                  </td>
                  <td className="px-4 py-3">{coupon.expiresAt}</td>
                  <td className="px-4 py-3">
                    <Badge variant={expired ? "warning" : "success"}>
                      {expired ? "Expired" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="px-3 py-1 text-label-sm"
                        onClick={() => handleCopy(coupon.code)}
                      >
                        Copy
                      </Button>
                      {coupon.isGenerated && (
                        <Button
                          type="button"
                          variant="secondary"
                          className="px-3 py-1 text-label-sm text-error"
                          onClick={() => handleDelete(coupon.code, coupon.isGenerated)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
