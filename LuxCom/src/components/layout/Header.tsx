import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { FiArrowLeft, FiMenu, FiShoppingBag } from "../ui/icons";

type HeaderProps = {
  showBack?: boolean;
  title?: string;
  showMenu?: boolean;
};

export function Header({
  showBack = false,
  title = "LuxCom",
  showMenu = true,
}: HeaderProps) {
  const navigate = useNavigate();
  const { itemCount } = useCart();

  return (
    <header className="flex items-center justify-between px-margin-mobile py-stack-md lg:hidden">
      {showBack ? (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-primary-container"
          aria-label="Go back"
        >
          <FiArrowLeft size={22} />
        </button>
      ) : showMenu ? (
        <button type="button" className="text-primary-container" aria-label="Open menu">
          <FiMenu size={22} />
        </button>
      ) : (
        <span className="w-[22px]" />
      )}

      <Link to="/" className="text-headline-sm font-bold text-primary-container">
        {title}
      </Link>

      <Link
        to="/cart"
        className="relative text-primary-container"
        aria-label={`Shopping bag, ${itemCount} items`}
      >
        <FiShoppingBag size={22} />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-error text-[10px] font-semibold text-on-error">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </Link>
    </header>
  );
}

export function HeaderMinimal({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3 px-margin-mobile py-stack-md lg:hidden">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-primary-container"
        aria-label="Go back"
      >
        <FiArrowLeft size={22} />
      </button>
      <h1 className="flex-1 text-center text-headline-sm font-bold text-primary-container">
        {title}
      </h1>
      <span className="w-[22px]" />
    </header>
  );
}
