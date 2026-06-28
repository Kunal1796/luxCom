import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "../../redux/api/productsApi";
import type { Product } from "../../types/product";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.number().positive("Select a category"),
  images: z.string().min(1, "At least one image URL required"),
});

type ProductFormData = z.infer<typeof productSchema>;

type ProductFormModalProps = {
  product?: Product | null;
  onClose: () => void;
};

export function ProductFormModal({ product, onClose }: ProductFormModalProps) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      categoryId: categories[0]?.id ?? 1,
      images: "https://placehold.co/600x400",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price,
        description: product.description,
        categoryId: product.category.id,
        images: product.images.join(", "),
      });
    }
  }, [product, reset]);

  async function onSubmit(data: ProductFormData) {
    const payload = {
      title: data.title,
      price: data.price,
      description: data.description,
      categoryId: data.categoryId,
      images: data.images.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (product) {
        await updateProduct({ id: product.id, data: payload }).unwrap();
        toast.success("Product updated");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created");
      }
      onClose();
    } catch {
      toast.error("Failed to save product");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-surface-container-lowest p-6 shadow-elevation-2">
        <h2 className="mb-4 text-headline-md text-on-surface">
          {product ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <Input
            label="Price"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />
          <div className="space-y-1">
            <label className="text-body-md font-semibold">Description</label>
            <textarea
              className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md outline-none focus:border-primary-container"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-label-sm text-error">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-body-md font-semibold">Category</label>
            <select
              className="w-full rounded-lg border border-outline-variant px-3 py-2.5 text-body-md"
              {...register("categoryId", { valueAsNumber: true })}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Image URLs (comma-separated)"
            error={errors.images?.message}
            {...register("images")}
          />

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" fullWidth disabled={creating || updating}>
              {creating || updating ? "Saving..." : product ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
