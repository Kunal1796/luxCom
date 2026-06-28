import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, setCredentials } from "../redux/slices/authSlice";
import {
  getErrorMessage,
  loginUser,
  signupUser,
} from "../services/authService";
import { authenticateLocalUser } from "../utils/localUsers";
import type { LoginCredentials, SignupCredentials } from "../types/auth";
import { isTokenExpired } from "../utils/token";
import { isAdminUser } from "../utils/admin";

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isHydrated } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout());
      toast.error("Session expired. Please log in again.");
    }
  }, [token, dispatch]);

  const login = useCallback(
    async (credentials: LoginCredentials, redirectTo = "/") => {
      try {
        const result = await loginUser({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        });
        dispatch(setCredentials(result));
        toast.success("Welcome back!");
        navigate(redirectTo, { replace: true });
        return true;
      } catch (error) {
        toast.error(
          getErrorMessage(error, "Invalid email or password."),
        );
        return false;
      }
    },
    [dispatch, navigate],
  );

  const signup = useCallback(
    async (credentials: SignupCredentials, redirectTo = "/") => {
      try {
        const user = await signupUser(credentials);
        const session = authenticateLocalUser({
          email: credentials.email,
          password: credentials.password,
        });
        if (!session) {
          throw new Error("Account created but sign-in failed. Please log in.");
        }
        dispatch(setCredentials(session));
        toast.success(`Welcome, ${user.name}!`);
        navigate(redirectTo, { replace: true });
        return true;
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not create account. Please try again."));
        return false;
      }
    },
    [dispatch, navigate],
  );

  const signOut = useCallback(() => {
    dispatch(logout());
    navigate("/auth");
    toast.success("Signed out.");
  }, [dispatch, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isHydrated,
    isAdmin: isAdminUser(user),
    login,
    signup,
    signOut,
  };
}
