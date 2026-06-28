import axios from "axios";
import type { LoginCredentials, SignupCredentials, User } from "../types/auth";
import {
  authenticateLocalUser,
  registerLocalUser,
} from "../utils/localUsers";
import { withAdminRole } from "../utils/admin";
import api from "./api";

type LoginResponse = {
  access_token: string;
  refresh_token?: string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (typeof data?.message === "string") return data.message;
    if (error.response?.status === 400) return "Invalid registration data. Check your inputs.";
    if (error.response?.status === 409) return "This email is already registered.";
  }
  return fallback;
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<{ token: string; user: User }> {
  const normalized = {
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  };

  const localSession = authenticateLocalUser(normalized);
  if (localSession) {
    return {
      token: localSession.token,
      user: withAdminRole(localSession.user),
    };
  }

  const { data } = await api.post<LoginResponse>("/auth/login", normalized);
  const profile = await fetchProfile(data.access_token);
  return { token: data.access_token, user: withAdminRole(profile) };
}

export async function signupUser(
  credentials: SignupCredentials,
): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return registerLocalUser(credentials);
}

export async function fetchProfile(token?: string): Promise<User> {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;
  const { data } = await api.get<User>("/auth/profile", config);
  return data;
}

export { getErrorMessage };
