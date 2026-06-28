import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../redux/api/productsApi";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/pricing";
import { Badge } from "../ui/Badge";
import { FiSearch, FiTrash2 } from "../ui/icons";
import { ProductFormModal } from "./ProductFormModal";

export function ProductTable() {
  const { data: products = [], isLoading } = useGetProductsQuery({ offset: 0, limit: 50 });
  const [deleteProduct] = useDeleteProductMutation();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        String(p.id).includes(q) ||
        p.category.name.toLowerCase().includes(q),
    );
  }, [products, search]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  async function handleDelete(id: number) {
    if (confirm("Delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted");
      } catch {
        toast.error("Failed to delete product");
      }
    }
  }

  if (isLoading) {
    return <p className="text-body-md text-on-surface-variant">Loading products...</p>;
  }

  return (
    <>
      <div className="mb-4 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-outline-variant px-3 py-2">
          <FiSearch className="text-on-surface-variant" size={16} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search SKU, Name..."
            className="flex-1 bg-transparent text-body-md outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-full bg-primary-container px-4 py-2 text-label-md font-semibold text-on-primary"
        >
          + ADD NEW PRODUCT
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-elevation-1">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-outline-variant/40 px-4 py-2 text-label-md uppercase text-on-surface-variant">
          <span>Product</span>
          <span>Stock</span>
        </div>

        {paged.map((product) => {
          const stock = (product.id * 7) % 50;
          const isLow = stock < 5;

          return (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-outline-variant/20 px-4 py-3 last:border-0"
            >
              <button
                type="button"
                className="flex items-center gap-3 text-left"
                onClick={() => setEditing(product)}
              >
                <img
                  src={product.images[0]}
                  alt=""
                  className="size-10 rounded-lg object-cover"
                />
                <div>
                  <p className="text-body-md font-semibold text-on-surface">
                    {product.title}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    SKU: LUX-{product.id} · {formatPrice(product.price)}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2">
                {isLow ? (
                  <Badge variant="warning">Low: {stock} Units</Badge>
                ) : (
                  <span className="text-body-md text-on-surface">{stock} Units</span>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="text-on-surface-variant hover:text-error"
                  aria-label="Delete product"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-body-md text-on-surface-variant">
        <span>
          Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of{" "}
          {filtered.length} products
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-outline-variant px-3 py-1 disabled:opacity-40"
          >
            ‹
          </button>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-outline-variant px-3 py-1 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>

      {(showCreate || editing) && (
        <ProductFormModal
          product={editing}
          onClose={() => {
            setShowCreate(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
