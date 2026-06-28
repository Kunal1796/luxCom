import { cn } from "../../utils/cn";

type AuthTabsProps = {
  active: "login" | "signup";
  onChange: (tab: "login" | "signup") => void;
};

export function AuthTabs({ active, onChange }: AuthTabsProps) {
  return (
    <div className="mb-6 flex rounded-xl bg-surface-container-high p-1">
      {(["login", "signup"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 rounded-lg py-2.5 text-body-md font-semibold capitalize transition-colors",
            active === tab
              ? "bg-surface-container-lowest text-primary-container shadow-elevation-1"
              : "text-on-surface-variant",
          )}
        >
          {tab === "login" ? "Login" : "Sign Up"}
        </button>
      ))}
    </div>
  );
}
