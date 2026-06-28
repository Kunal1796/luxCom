import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { PageLoader } from "../components/ui/Spinner";
import { FiHeart, FiShoppingCart, FiStar } from "../components/ui/icons";
import { useCart } from "../hooks/useCart";
import { useGetProductByIdQuery } from "../redux/api/productsApi";
import { formatPrice } from "../utils/pricing";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });
  const { addToCart } = useCart();
  const [imageIndex, setImageIndex] = useState(0);

  if (isLoading) return <PageLoader />;

  if (isError || !product) {
    return (
      <PageContainer className="py-stack-lg text-center text-body-md text-error">
        Product not found.
      </PageContainer>
    );
  }

  const images = product.images.length ? product.images : ["https://placehold.co/600x400"];
  const rating = (4 + (product.id % 10) / 10).toFixed(1);
  const originalPrice = Math.round(product.price * 1.25);

  return (
    <>
      <Header showBack title="LuxCom" showMenu={false} />

      <PageContainer className="pb-stack-lg pt-2 lg:pt-6">
        <nav className="mb-4 hidden text-body-md text-on-surface-variant lg:block">
          <Link to="/" className="hover:text-primary-container">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-on-surface">{product.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-container lg:sticky lg:top-24 lg:aspect-4/3">
            <img
              src={images[imageIndex]}
              alt={product.title}
              className="size-full object-cover"
            />
            <button
              type="button"
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-surface-container-low/90 text-primary-container"
              aria-label="Add to wishlist"
            >
              <FiHeart size={18} />
            </button>

            {images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageIndex(i)}
                      className={`size-2.5 rounded-full ${
                        i === imageIndex
                          ? "ring-2 ring-primary-container ring-offset-2"
                          : "bg-white/70"
                      }`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4 hidden gap-2 lg:flex">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageIndex(i)}
                      className={`size-16 overflow-hidden rounded-lg border-2 ${
                        i === imageIndex
                          ? "border-primary-container"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 px-margin-mobile py-stack-md lg:px-0 lg:py-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-1">
                  <FiStar className="text-tertiary-fixed-dim" size={14} />
                  <span className="text-body-md">{rating}</span>
                </div>
                <h1 className="text-headline-md text-on-surface lg:text-headline-lg">
                  {product.title}
                </h1>
                <p className="text-body-md text-on-surface-variant lg:text-body-lg">
                  {product.category.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-headline-sm font-bold text-secondary lg:text-headline-md">
                  {formatPrice(product.price)}
                </p>
                <p className="text-body-md text-on-surface-variant line-through">
                  {formatPrice(originalPrice)}
                </p>
              </div>
            </div>

            <p className="text-body-lg leading-relaxed text-on-surface-variant">
              {product.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row lg:pt-4">
              <Button fullWidth size="lg" onClick={() => addToCart(product)}>
                Add to Cart
                <FiShoppingCart size={18} />
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
