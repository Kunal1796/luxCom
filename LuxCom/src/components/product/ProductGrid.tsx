import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="px-margin-mobile py-stack-lg text-center text-body-md text-on-surface-variant lg:px-0">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-gutter px-margin-mobile sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 lg:px-0">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
