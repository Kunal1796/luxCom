import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, icon, className, id, ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="text-body-md font-semibold text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-shadow placeholder:text-on-surface-variant/60 focus:border-primary-container focus:shadow-[0_0_0_2px_rgb(79_70_229_/_0.2)]",
              icon && "pl-10",
              error && "border-error",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-label-sm text-error">{error}</p>}
      </div>
    );
  },
);
