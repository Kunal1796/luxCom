import { cn } from "../../utils/cn";

type StatCardProps = {
  label: string;
  value: string;
  badge?: string;
  badgeVariant?: "success" | "primary" | "warning";
  icon: React.ReactNode;
};

export function StatCard({
  label,
  value,
  badge,
  badgeVariant = "primary",
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 shadow-elevation-1">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-full bg-surface-container text-primary-container">
          {icon}
        </div>
        {badge && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-label-sm font-medium",
              badgeVariant === "success" && "bg-secondary-container text-on-secondary-container",
              badgeVariant === "primary" && "bg-primary-container/10 text-primary-container",
              badgeVariant === "warning" && "bg-tertiary-container/20 text-tertiary-container",
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="mt-3 text-label-md uppercase text-on-surface-variant">{label}</p>
      <p className="text-headline-md font-bold text-primary-container">{value}</p>
    </div>
  );
}
