export type CouponDefinition = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minCartValue: number;
  expiresAt: string;
  eligibleCategories?: string[];
  eligibleProductIds?: number[];
  maxDiscount?: number;
  description?: string;
  isGenerated?: boolean;
};

export type AppliedCoupon = Pick<
  CouponDefinition,
  | "code"
  | "type"
  | "value"
  | "minCartValue"
  | "expiresAt"
  | "eligibleCategories"
  | "eligibleProductIds"
  | "maxDiscount"
>;

export type CouponValidationResult =
  | { valid: true; discount: number; coupon: CouponDefinition | AppliedCoupon }
  | { valid: false; error: string };
