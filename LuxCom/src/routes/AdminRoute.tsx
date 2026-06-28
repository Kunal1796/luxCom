import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { PageLoader } from "../components/ui/Spinner";
import { isAdminUser } from "../utils/admin";

export function AdminRoute() {
  const { isAuthenticated, isHydrated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isHydrated && isAuthenticated && !isAdminUser(user)) {
      toast.error("You do not have access to the admin panel.");
    }
  }, [isAuthenticated, isHydrated, user]);

  if (!isHydrated) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
