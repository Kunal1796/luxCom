import type { LoginCredentials, SignupCredentials, User } from "../types/auth";
import { withAdminRole, isAdminEmail } from "../utils/admin";

const USERS_KEY = "luxe_registered_users";

type StoredUser = {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  avatar: string;
};

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser(stored: StoredUser): User {
  return withAdminRole({
    id: stored.id,
    email: stored.email,
    name: stored.name,
    role: stored.role,
    avatar: stored.avatar,
  });
}

export function createLocalToken(userId: number): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      local: true,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }),
  );
  return `${header}.${payload}.local`;
}

export function isLocalToken(token: string): boolean {
  return token.endsWith(".local");
}

export function registerLocalUser(credentials: SignupCredentials): User {
  const email = credentials.email.trim().toLowerCase();
  const users = loadUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error("This email is already registered. Try logging in instead.");
  }

  const stored: StoredUser = {
    id: Date.now(),
    email,
    name: credentials.name.trim(),
    password: credentials.password,
    role: isAdminEmail(email) ? "admin" : "customer",
    avatar: `https://picsum.photos/seed/${encodeURIComponent(email)}/200`,
  };

  saveUsers([...users, stored]);
  return toPublicUser(stored);
}

export function authenticateLocalUser(
  credentials: LoginCredentials,
): { token: string; user: User } | null {
  const email = credentials.email.trim().toLowerCase();
  const users = loadUsers();
  const match = users.find(
    (u) => u.email === email && u.password === credentials.password,
  );

  if (!match) return null;

  return {
    token: createLocalToken(match.id),
    user: toPublicUser(match),
  };
}

export function getLocalUserById(id: number): User | null {
  const users = loadUsers();
  const match = users.find((u) => u.id === id);
  return match ? toPublicUser(match) : null;
}
