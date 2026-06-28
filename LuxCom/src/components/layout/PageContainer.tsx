import { cn } from "../../utils/cn";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageContainer({
  children,
  className,
  narrow = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-margin-mobile lg:px-margin-desktop",
        narrow ? "max-w-3xl" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
