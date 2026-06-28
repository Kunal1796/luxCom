import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/pricing";
import { FiHeart, FiShoppingCart, FiStar } from "../ui/icons";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const rating = (4 + (product.id % 10) / 10).toFixed(1);

  return (
    <article className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-elevation-1 transition-shadow hover:shadow-elevation-2 lg:rounded-2xl">
      <Link to={`/product/${product.id}`} className="relative block aspect-square bg-surface-container">
        <img
          src={product.images[0]}
          alt={product.title}
          className="size-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/80 text-on-surface-variant backdrop-blur-sm"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <FiHeart size={16} />
        </button>
      </Link>

      <div className="space-y-1 p-3">
        <div className="flex items-center gap-1">
          <FiStar className="text-tertiary-fixed-dim" size={12} />
          <span className="text-label-sm text-on-surface">{rating}</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="truncate text-body-md font-semibold text-on-surface">
            {product.title}
          </h3>
        </Link>

        <p className="text-label-sm text-on-surface-variant">
          {product.category.name}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-body-md font-bold text-secondary">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg bg-primary-container text-on-primary shadow-elevation-2"
            aria-label={`Add ${product.title} to cart`}
            onClick={() => addToCart(product)}
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
