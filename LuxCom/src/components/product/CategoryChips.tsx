import { cn } from "../../utils/cn";

type CategoryChipsProps = {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
};

export function CategoryChips({ categories, active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-margin-mobile pb-stack-md lg:px-0 lg:pb-0">
      {categories.map((category) => {
        const isSelected = active === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-body-md font-medium transition-colors lg:px-6 lg:py-2.5",
              isSelected
                ? "bg-primary-container text-on-primary shadow-elevation-2"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container",
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
