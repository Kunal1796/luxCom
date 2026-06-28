import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AvailableCoupons } from "../components/cart/AvailableCoupons";
import { CartItemRow } from "../components/cart/CartItemRow";
import { CouponForm } from "../components/cart/CouponForm";
import { PriceSummary } from "../components/cart/PriceSummary";
import { Header } from "../components/layout/Header";
import { PageContainer } from "../components/layout/PageContainer";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const { items, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponDraft, setCouponDraft] = useState("");

  function handleCheckout() {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  }

  return (
    <>
      <Header title="LuxCom" />

      <PageContainer className="pb-stack-lg pt-2 lg:pt-6">
        <div className="mb-stack-md flex items-center justify-between lg:mb-stack-lg">
          <h2 className="text-headline-md text-on-surface lg:text-headline-lg">Your Cart</h2>
          <Badge>{itemCount} Items</Badge>
        </div>

        {items.length === 0 ? (
          <div className="py-stack-lg text-center">
            <p className="text-body-md text-on-surface-variant lg:text-body-lg">
              Your cart is empty.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-body-md font-semibold text-primary-container"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-10">
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            <aside className="mt-stack-md space-y-stack-md lg:sticky lg:top-24 lg:mt-0">
              <CouponForm code={couponDraft} onCodeChange={setCouponDraft} />
              <AvailableCoupons onSelect={setCouponDraft} />
              <PriceSummary />
              <Button fullWidth size="lg" onClick={handleCheckout}>
                Proceed to Checkout →
              </Button>
            </aside>
          </div>
        )}
      </PageContainer>
    </>
  );
}
