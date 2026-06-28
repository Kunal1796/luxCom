import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { cn } from "../../utils/cn";
import { FiHome, FiSearch, FiShoppingCart, FiUser } from "../ui/icons";

const navItems = [
  { to: "/", label: "Shop", icon: FiHome, end: true },
  { to: "/search", label: "Search", icon: FiSearch },
  { to: "/auth", label: "Account", icon: FiUser },
];

export function DesktopNav() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-outline-variant/40 bg-surface-container-lowest/95 backdrop-blur-md lg:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-margin-desktop">
        <NavLink
          to="/"
          className="text-headline-md font-bold text-primary-container"
        >
          LuxCom
        </NavLink>

        <nav className="flex flex-1 items-center justify-center gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => {
            const isActive = end
              ? location.pathname === to
              : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-body-md font-medium transition-colors",
                  isActive
                    ? "bg-primary-container/10 text-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                )}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            );
          })}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={cn(
                "rounded-lg px-4 py-2 text-body-md font-medium transition-colors",
                location.pathname.startsWith("/admin")
                  ? "bg-primary-container/10 text-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
              )}
            >
              Admin
            </NavLink>
          )}
        </nav>

        <NavLink
          to="/cart"
          className="relative flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 text-body-md font-semibold text-on-primary shadow-elevation-2 transition-opacity hover:opacity-90"
        >
          <FiShoppingCart size={18} />
          View Cart
          {itemCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-on-primary text-[10px] font-bold text-primary-container">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </NavLink>
      </div>
    </header>
  );
}
