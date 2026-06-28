const TOKEN_KEY = "luxe_token";
const USER_KEY = "luxe_user";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function setStoredUser(user: string): void {
  localStorage.setItem(USER_KEY, user);
}

export function removeStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function clearAuthStorage(): void {
  removeStoredToken();
  removeStoredUser();
}

type JwtPayload = {
  exp?: number;
  sub?: string;
};

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}
