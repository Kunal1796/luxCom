import { cn } from "../../utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-8 animate-spin rounded-full border-2 border-primary-container/20 border-t-primary-container",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
