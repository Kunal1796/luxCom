import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/pricing";
import { Button } from "../ui/Button";
import { FiShoppingCart, FiStar } from "../ui/icons";

type FeaturedBannerProps = {
  product: Product;
  onAddToCart: () => void;
};

export function FeaturedBanner({ product, onAddToCart }: FeaturedBannerProps) {
  return (
    <section className="px-margin-mobile lg:px-0">
      <article className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-elevation-1 lg:flex lg:items-stretch">
        <Link
          to={`/product/${product.id}`}
          className="relative block aspect-[16/10] lg:aspect-auto lg:w-1/2 lg:min-h-[320px]"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="size-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-md bg-secondary px-2.5 py-1 text-label-md font-semibold uppercase text-on-secondary">
            New Arrival
          </span>
        </Link>

        <div className="flex flex-col justify-center space-y-3 p-4 lg:w-1/2 lg:p-8">
          <div className="flex items-center gap-1.5">
            <FiStar className="text-tertiary-fixed-dim" size={14} />
            <span className="text-body-md font-medium">5.0</span>
            <span className="text-body-md text-on-surface-variant">(200+ Reviews)</span>
          </div>

          <h2 className="text-headline-sm text-on-surface lg:text-headline-lg">
            {product.title}
          </h2>
          <p className="line-clamp-3 text-body-md text-on-surface-variant lg:text-body-lg lg:leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-3 pt-2 lg:justify-start lg:gap-6">
            <span className="text-headline-sm font-bold text-secondary lg:text-headline-md">
              {formatPrice(product.price)}
            </span>
            <Button size="lg" onClick={onAddToCart}>
              Add to Cart
              <FiShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}
