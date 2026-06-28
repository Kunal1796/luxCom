import { cn } from "../../utils/cn";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "primary" | "warning";
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-label-sm font-medium",
        variant === "default" && "bg-surface-container-high text-on-surface-variant",
        variant === "success" && "bg-secondary text-on-secondary",
        variant === "primary" && "bg-primary-container/10 text-primary-container",
        variant === "warning" && "bg-tertiary-container text-on-tertiary-container",
        className,
      )}
    >
      {children}
    </span>
  );
}
