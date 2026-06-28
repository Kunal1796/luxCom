import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import { FiHome, FiSearch, FiUser } from "../ui/icons";

const navItems = [
  { to: "/", label: "Shop", icon: FiHome, end: true },
  { to: "/search", label: "Search", icon: FiSearch },
  { to: "/auth", label: "Profile", icon: FiUser },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/40 bg-surface-container-lowest shadow-elevation-1 lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
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
                "flex flex-col items-center gap-0.5 px-3 py-1",
                isActive ? "text-primary-container" : "text-on-surface-variant",
              )}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  isActive && "bg-primary-container/10",
                )}
              >
                <Icon size={20} />
              </span>
              <span className="text-label-sm font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
