import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User } from "../../types/auth";
import { withAdminRole } from "../../utils/admin";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  isTokenExpired,
  setStoredToken,
  setStoredUser,
} from "../../utils/token";

type AuthSliceState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

function loadInitialState(): AuthSliceState {
  const token = getStoredToken();
  const userJson = getStoredUser();

  if (token && !isTokenExpired(token) && userJson) {
    try {
      const user = withAdminRole(JSON.parse(userJson) as User);
      return {
        user,
        token,
        isAuthenticated: true,
        isHydrated: true,
      };
    } catch {
      clearAuthStorage();
    }
  } else if (token) {
    clearAuthStorage();
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isHydrated: true,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) {
      state.user = withAdminRole(action.payload.user);
      state.token = action.payload.token;
      state.isAuthenticated = true;
      setStoredToken(action.payload.token);
      setStoredUser(JSON.stringify(state.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearAuthStorage();
    },
    setHydrated(state) {
      state.isHydrated = true;
    },
  },
});

export const { setCredentials, logout, setHydrated } = authSlice.actions;
export default authSlice.reducer;
