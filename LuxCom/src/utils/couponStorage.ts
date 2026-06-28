import type { AppliedCoupon, CouponDefinition } from "../types/coupon";

const GENERATED_COUPONS_KEY = "luxcom_generated_coupons";

export const DEFAULT_COUPONS: CouponDefinition[] = [
  {
    code: "LUXE25",
    type: "percent",
    value: 25,
    minCartValue: 100,
    expiresAt: "2026-12-31",
    description: "25% off orders over $100",
  },
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minCartValue: 50,
    expiresAt: "2026-12-31",
    description: "10% off your first order over $50",
  },
  {
    code: "FASHION20",
    type: "percent",
    value: 20,
    minCartValue: 75,
    expiresAt: "2026-12-31",
    eligibleCategories: ["Clothes", "Fashion", "Shoes"],
    description: "20% off fashion items (min $75 in eligible items)",
  },
  {
    code: "FLAT15",
    type: "fixed",
    value: 15,
    minCartValue: 80,
    expiresAt: "2026-12-31",
    description: "$15 off orders over $80",
  },
  {
    code: "VIP30",
    type: "percent",
    value: 30,
    minCartValue: 150,
    expiresAt: "2026-12-31",
    maxDiscount: 50,
    description: "30% off (max $50 discount) on orders over $150",
  },
];

function loadGeneratedCoupons(): CouponDefinition[] {
  try {
    const stored = localStorage.getItem(GENERATED_COUPONS_KEY);
    if (stored) {
      return JSON.parse(stored) as CouponDefinition[];
    }
  } catch {
    localStorage.removeItem(GENERATED_COUPONS_KEY);
  }
  return [];
}

function persistGeneratedCoupons(coupons: CouponDefinition[]): void {
  localStorage.setItem(GENERATED_COUPONS_KEY, JSON.stringify(coupons));
}

export function getAllCoupons(): CouponDefinition[] {
  const generated = loadGeneratedCoupons();
  const codes = new Set<string>();
  const merged: CouponDefinition[] = [];

  for (const coupon of [...DEFAULT_COUPONS, ...generated]) {
    const key = coupon.code.toUpperCase();
    if (codes.has(key)) continue;
    codes.add(key);
    merged.push({ ...coupon, code: key });
  }

  return merged;
}

export function findCouponByCode(code: string): CouponDefinition | undefined {
  return getAllCoupons().find((c) => c.code.toUpperCase() === code.toUpperCase());
}

export function saveGeneratedCoupon(coupon: CouponDefinition): CouponDefinition {
  const normalized: CouponDefinition = {
    ...coupon,
    code: coupon.code.trim().toUpperCase(),
    isGenerated: true,
  };

  const existing = loadGeneratedCoupons().filter(
    (c) => c.code.toUpperCase() !== normalized.code,
  );
  persistGeneratedCoupons([...existing, normalized]);
  return normalized;
}

export function deleteGeneratedCoupon(code: string): void {
  const filtered = loadGeneratedCoupons().filter(
    (c) => c.code.toUpperCase() !== code.toUpperCase(),
  );
  persistGeneratedCoupons(filtered);
}

export function generateCouponCode(prefix = "LUX"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}${suffix}`;
}

export function isCouponExpired(coupon: CouponDefinition | AppliedCoupon): boolean {
  const expiry = new Date(coupon.expiresAt);
  expiry.setHours(23, 59, 59, 999);
  return expiry < new Date();
}

export function getActiveCoupons(): CouponDefinition[] {
  return getAllCoupons().filter((c) => !isCouponExpired(c));
}
