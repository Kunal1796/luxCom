import { useMemo, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { CategoryChips } from "../components/product/CategoryChips";
import { FeaturedBanner } from "../components/product/FeaturedBanner";
import { ProductGrid } from "../components/product/ProductGrid";
import { SearchBar } from "../components/product/SearchBar";
import { PageLoader } from "../components/ui/Spinner";
import { Header } from "../components/layout/Header";
import { useCart } from "../hooks/useCart";
import { useGetProductsQuery } from "../redux/api/productsApi";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { data: products = [], isLoading, isError } = useGetProductsQuery({
    offset: 0,
    limit: 30,
  });
  const { addToCart } = useCart();

  const categories = useMemo(() => {
    const names = new Set(products.map((p) => p.category.name));
    return ["All", ...Array.from(names).slice(0, 5)] as string[];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || p.category.name === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const featured = filtered[0];
  const catalogProducts = featured
    ? filtered.filter((p) => p.id !== featured.id)
    : filtered;

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <PageContainer className="py-stack-lg text-center text-body-md text-error">
        Failed to load products. Please try again.
      </PageContainer>
    );
  }

  return (
    <>
      <Header />

      <PageContainer className="space-y-stack-md pb-stack-lg pt-2 lg:space-y-stack-lg lg:pt-6">
        <div className="hidden lg:block">
          <h1 className="text-headline-lg text-on-surface">Premium Collection</h1>
          <p className="mt-1 text-body-lg text-on-surface-variant">
            Curated luxury products for the modern shopper.
          </p>
        </div>

        <div className="lg:flex lg:items-center lg:gap-4">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} inline />
          </div>
        </div>

        <CategoryChips categories={categories} active={category} onChange={setCategory} />

        {featured && (
          <FeaturedBanner product={featured} onAddToCart={() => addToCart(featured)} />
        )}

        <section>
          <h2 className="mb-stack-md hidden text-headline-md text-on-surface lg:block">
            All Products
          </h2>
          <ProductGrid products={catalogProducts} />
        </section>
      </PageContainer>
    </>
  );
}
