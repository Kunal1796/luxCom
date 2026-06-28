import { cn } from "../../utils/cn";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:opacity-50",
        variant === "primary" &&
          "bg-primary-container text-on-primary shadow-elevation-2 hover:bg-primary",
        variant === "secondary" &&
          "border border-primary-container bg-surface-container-lowest text-primary-container hover:bg-surface-container-low",
        variant === "ghost" && "text-on-surface-variant hover:bg-surface-container",
        variant === "danger" && "bg-error text-on-error hover:opacity-90",
        size === "sm" && "px-3 py-1.5 text-body-md",
        size === "md" && "px-4 py-2.5 text-body-md",
        size === "lg" && "px-6 py-3 text-body-lg",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
