import type { User } from "../types/auth";

export const ADMIN_EMAIL = "kunal.dongare@indexnine.com";

export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function isAdminUser(user: User | null | undefined): boolean {
  return user != null && isAdminEmail(user.email);
}

export function withAdminRole(user: User): User {
  if (isAdminEmail(user.email)) {
    return { ...user, role: "admin" };
  }
  if (user.role === "admin") {
    return { ...user, role: "customer" };
  }
  return user;
}
