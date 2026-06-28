import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PageLoader } from "../components/ui/Spinner";

export function ProtectedRoute() {
  const { isAuthenticated, isHydrated } = useAuth();
  const location = useLocation();

  if (!isHydrated) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
