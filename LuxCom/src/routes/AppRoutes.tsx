import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import AdminPage from "../pages/AdminPage";
import AuthPage from "../pages/AuthPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import SearchPage from "../pages/SearchPage";
import ShopPage from "../pages/ShopPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ShopPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="auth" element={<AuthPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell showBottomNav={false} />}>
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AppShell showBottomNav={false} />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
