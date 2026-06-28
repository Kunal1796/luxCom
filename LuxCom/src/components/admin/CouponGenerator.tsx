import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useGetCategoriesQuery, useGetProductsQuery } from "../../redux/api/productsApi";
import type { CouponDefinition } from "../../types/coupon";
import {
  generateCouponCode,
  getAllCoupons,
  saveGeneratedCoupon,
} from "../../utils/couponStorage";
import { COUPON_FORMAT } from "../../services/couponService";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const couponSchema = z
  .object({
    code: z
      .string()
      .min(4, "Code must be 4–12 characters")
      .max(12)
      .regex(/^[A-Za-z0-9]+$/, "Letters and numbers only")
      .transform((v) => v.toUpperCase()),
    type: z.enum(["percent", "fixed"]),
    value: z.number().positive("Value must be positive"),
    minCartValue: z.number().min(0, "Minimum cart value required"),
    expiresAt: z.string().min(1, "Expiry date required"),
    description: z.string().optional(),
    eligibleCategories: z.string().optional(),
    eligibleProductIds: z.string().optional(),
    maxDiscount: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (!COUPON_FORMAT.test(data.code)) {
      ctx.addIssue({
        code: "custom",
        message: "Code must be 4–12 uppercase letters or numbers",
        path: ["code"],
      });
    }
    if (data.type === "percent" && data.value > 100) {
      ctx.addIssue({
        code: "custom",
        message: "Percent discount cannot exceed 100",
        path: ["value"],
      });
    }
    const expiry = new Date(data.expiresAt);
    if (Number.isNaN(expiry.getTime()) || expiry < new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "Expiry must be a future date",
        path: ["expiresAt"],
      });
    }
  });

type CouponFormData = z.infer<typeof couponSchema>;

type CouponGeneratorProps = {
  onCreated?: () => void;
};

const DEFAULT_COUPON_EXPIRY = (() => {
  const date = new Date();
  date.setDate(date.getDate() + 90);
  return date.toISOString().slice(0, 10);
})();

export function CouponGenerator({ onCreated }: CouponGeneratorProps) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: products = [] } = useGetProductsQuery({ offset: 0, limit: 50 });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [initialCode] = useState(() => generateCouponCode());

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: initialCode,
      type: "percent",
      value: 10,
      minCartValue: 50,
      expiresAt: DEFAULT_COUPON_EXPIRY,
      description: "",
      eligibleCategories: "",
      eligibleProductIds: "",
    },
  });

  const couponType = useWatch({ control, name: "type" });

  function handleGenerateCode() {
    setValue("code", generateCouponCode(), { shouldValidate: true });
  }

  function toggleCategory(name: string) {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  }

  function onSubmit(data: CouponFormData) {
    const existing = getAllCoupons().find(
      (c) => c.code.toUpperCase() === data.code.toUpperCase(),
    );
    if (existing) {
      toast.error("A coupon with this code already exists.");
      return;
    }

    const productIds = data.eligibleProductIds
      ?.split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !Number.isNaN(id) && id > 0);

    const coupon: CouponDefinition = {
      code: data.code,
      type: data.type,
      value: data.value,
      minCartValue: data.minCartValue,
      expiresAt: data.expiresAt,
      description: data.description || undefined,
      eligibleCategories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      eligibleProductIds: productIds?.length ? productIds : undefined,
      maxDiscount:
        data.type === "percent" &&
        data.maxDiscount != null &&
        !Number.isNaN(data.maxDiscount) &&
        data.maxDiscount > 0
          ? data.maxDiscount
          : undefined,
      isGenerated: true,
    };

    saveGeneratedCoupon(coupon);
    toast.success(`Coupon ${coupon.code} created!`);
    setValue("code", generateCouponCode());
    setSelectedCategories([]);
    onCreated?.();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-elevation-1"
    >
      <div>
        <h3 className="text-headline-sm text-on-surface">Generate Coupon</h3>
        <p className="text-body-md text-on-surface-variant">
          Create codes with format, expiry, minimum cart, and product/category rules.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          label="Coupon Code"
          {...register("code")}
          error={errors.code?.message}
          className="flex-1 uppercase"
          maxLength={12}
        />
        <Button
          type="button"
          variant="secondary"
          className="mt-7 shrink-0"
          onClick={handleGenerateCode}
        >
          Random
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-body-md font-semibold text-on-surface">Discount Type</label>
          <select
            {...register("type")}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md"
          >
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>
        <Input
          label={couponType === "percent" ? "Discount (%)" : "Discount ($)"}
          type="number"
          step="0.01"
          {...register("value", { valueAsNumber: true })}
          error={errors.value?.message}
        />
        <Input
          label="Minimum Cart Value ($)"
          type="number"
          step="0.01"
          {...register("minCartValue", { valueAsNumber: true })}
          error={errors.minCartValue?.message}
        />
        <Input
          label="Expiry Date"
          type="date"
          {...register("expiresAt")}
          error={errors.expiresAt?.message}
        />
        {couponType === "percent" && (
          <Input
            label="Max Discount Cap ($, optional)"
            type="number"
            step="0.01"
            {...register("maxDiscount", {
              setValueAs: (value) =>
                value === "" || Number.isNaN(Number(value))
                  ? undefined
                  : Number(value),
            })}
            error={errors.maxDiscount?.message}
          />
        )}
        <Input
          label="Description (optional)"
          {...register("description")}
          className="sm:col-span-2"
        />
      </div>

      <div>
        <p className="mb-2 text-body-md font-semibold text-on-surface">
          Eligible Categories (optional)
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.name)}
              className={`rounded-full px-3 py-1 text-label-sm font-medium transition-colors ${
                selectedCategories.includes(cat.name)
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-body-md font-semibold text-on-surface">
          Eligible Product IDs (optional, comma-separated)
        </label>
        <select
          multiple
          className="h-32 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md"
          onChange={(e) => {
            const ids = Array.from(e.target.selectedOptions).map((o) => o.value);
            setValue("eligibleProductIds", ids.join(", "));
          }}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              #{p.id} — {p.title} ({p.category.name})
            </option>
          ))}
        </select>
        <p className="text-label-sm text-on-surface-variant">
          Hold Ctrl/Cmd to select multiple products. Leave empty for all products.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Coupon"}
      </Button>
    </form>
  );
}
