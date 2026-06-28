import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CouponGenerator } from "../components/admin/CouponGenerator";
import { CouponList } from "../components/admin/CouponList";
import { PageContainer } from "../components/layout/PageContainer";
import { ProductTable } from "../components/admin/ProductTable";
import { StatCard } from "../components/admin/StatCard";
import { PageLoader } from "../components/ui/Spinner";
import { useGetProductsQuery } from "../redux/api/productsApi";
import { formatPrice } from "../utils/pricing";

export default function AdminPage() {
  const { data: products = [], isLoading } = useGetProductsQuery({ offset: 0, limit: 50 });
  const [couponRefreshKey, setCouponRefreshKey] = useState(0);

  const stats = useMemo(() => {
    const revenue = products.reduce((sum, p) => sum + p.price * 10, 0);
    return {
      revenue,
      productCount: products.length,
      activeOrders: Math.min(products.length * 2, 312),
    };
  }, [products]);

  if (isLoading) return <PageLoader />;

  return (
    <PageContainer className="pb-stack-lg pt-6 lg:pt-8">
      <div className="mb-stack-lg flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface lg:text-headline-lg">Admin Panel</h1>
          <p className="text-body-md text-on-surface-variant">
            Manage inventory, orders, and product listings.
          </p>
        </div>
        <Link
          to="/"
          className="text-body-md font-semibold text-primary-container hover:underline"
        >
          ← Back to Shop
        </Link>
      </div>

      <div className="space-y-stack-lg">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Revenue"
            value={formatPrice(stats.revenue)}
            badge="+12.5%"
            badgeVariant="success"
            icon={<span>$</span>}
          />
          <StatCard
            label="Total Products"
            value={String(stats.productCount)}
            badge="Active"
            icon={<span>📦</span>}
          />
          <StatCard
            label="Active Orders"
            value={String(stats.activeOrders)}
            badge="48 Pending"
            badgeVariant="warning"
            icon={<span>🛒</span>}
          />
        </div>

        <section>
          <h2 className="text-headline-sm text-on-surface lg:text-headline-md">
            Coupon Management
          </h2>
          <p className="mb-4 text-body-md text-on-surface-variant">
            Generate discount codes with validation rules for format, expiry, minimum cart,
            and eligible products or categories.
          </p>
          <div className="mb-stack-lg space-y-stack-md">
            <CouponGenerator onCreated={() => setCouponRefreshKey((k) => k + 1)} />
            <div key={couponRefreshKey}>
              <CouponList />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-headline-sm text-on-surface lg:text-headline-md">
            Product Catalog
          </h2>
          <p className="mb-4 text-body-md text-on-surface-variant">
            Manage your high-end inventory and product listings.
          </p>
          <ProductTable />
        </section>
      </div>
    </PageContainer>
  );
}
