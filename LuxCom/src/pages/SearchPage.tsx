import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { PageContainer } from "../components/layout/PageContainer";
import { ProductGrid } from "../components/product/ProductGrid";
import { SearchBar } from "../components/product/SearchBar";
import { PageLoader } from "../components/ui/Spinner";
import { useGetProductsQuery } from "../redux/api/productsApi";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading } = useGetProductsQuery({ offset: 0, limit: 50 });

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q),
    );
  }, [products, search]);

  return (
    <>
      <Header title="Search" />

      <PageContainer className="space-y-stack-md pb-stack-lg pt-2 lg:pt-6">
        <div className="hidden lg:block">
          <h1 className="text-headline-lg text-on-surface">Search Products</h1>
          <p className="mt-1 text-body-lg text-on-surface-variant">
            Find premium items across our entire catalog.
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} inline />

        {isLoading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="py-stack-lg text-center">
            <p className="text-body-md text-on-surface-variant">
              No results for &quot;{search}&quot;
            </p>
            <Link to="/" className="mt-2 inline-block text-primary-container">
              Browse all products
            </Link>
          </div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </PageContainer>
    </>
  );
}
