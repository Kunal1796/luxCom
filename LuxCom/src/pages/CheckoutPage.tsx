import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AddressCard, PaymentCard } from "../components/checkout/AddressCard";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper";
import { OrderItemRow } from "../components/checkout/OrderItemRow";
import { HeaderMinimal } from "../components/layout/Header";
import { PageContainer } from "../components/layout/PageContainer";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { CouponForm } from "../components/cart/CouponForm";
import { PriceSummary } from "../components/cart/PriceSummary";
import { FiShoppingBag } from "../components/ui/icons";
import { useCart } from "../hooks/useCart";
import { useCartTotals } from "../hooks/useCartTotals";
import { formatPrice } from "../utils/pricing";

export default function CheckoutPage() {
  const { items, appliedCoupon, emptyCart } = useCart();
  const { total, discount, isCouponApplied } = useCartTotals();
  const navigate = useNavigate();

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  function handlePlaceOrder() {
    emptyCart();
    toast.success("Order placed successfully!");
    navigate("/");
  }

  return (
    <>
      <HeaderMinimal title="Checkout" />
      <CheckoutStepper currentStep={3} />

      <PageContainer className="pb-32 pt-2 lg:pb-12 lg:pt-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:pb-8">
          <div className="space-y-stack-md">
            <AddressCard
              name="Alex Morgan"
              address="123 Fifth Avenue, New York, NY 10001"
            />
            <PaymentCard label="Visa" detail="Visa ending in •••• 8842 · Exp 09/27" />

            <div>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-headline-sm text-on-surface lg:text-headline-md">
                  Order Items
                </h2>
                <Badge>{items.length}</Badge>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <OrderItemRow key={item.productId} item={item} />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-stack-md lg:sticky lg:top-24">
            <div>
              <h2 className="mb-3 text-headline-sm text-on-surface lg:text-headline-md">
                Price Details
              </h2>
              <CouponForm />
              {isCouponApplied && appliedCoupon && (
                <div className="mb-2 mt-3 flex items-center gap-2">
                  <Badge variant="success">{appliedCoupon.code}</Badge>
                  <span className="text-body-md text-secondary">
                    −{formatPrice(discount)}
                  </span>
                </div>
              )}
              <PriceSummary compact />
            </div>

            <div className="hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-elevation-1 lg:block">
              <p className="text-label-sm text-on-surface-variant">Amount to Pay</p>
              <p className="text-headline-lg font-bold text-primary-container">
                {formatPrice(total)}
              </p>
              {discount > 0 && (
                <p className="mt-1 text-label-sm text-secondary">
                  You save {formatPrice(discount)} · Incl. all taxes
                </p>
              )}
              <Button fullWidth size="lg" className="mt-4" onClick={handlePlaceOrder}>
                Place Order
                <FiShoppingBag size={18} />
              </Button>
            </div>
          </aside>
        </div>
      </PageContainer>

      <div className="fixed inset-x-0 bottom-0 border-t border-outline-variant/40 bg-surface-container-lowest p-4 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <p className="text-label-sm text-on-surface-variant">Amount to Pay</p>
            <p className="text-headline-md font-bold text-primary-container">
              {formatPrice(total)}
            </p>
            {discount > 0 && (
              <p className="text-label-sm text-secondary">
                You save {formatPrice(discount)} · Incl. all taxes
              </p>
            )}
          </div>
          <Button size="lg" onClick={handlePlaceOrder}>
            Place Order
            <FiShoppingBag size={18} />
          </Button>
        </div>
      </div>
    </>
  );
}
