import { FiFilter, FiSearch } from "../ui/icons";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  inline?: boolean;
};

export function SearchBar({ value, onChange, inline = false }: SearchBarProps) {
  return (
    <div className={inline ? "" : "px-margin-mobile pb-stack-md lg:px-0 lg:pb-0"}>
      <div className="flex items-center gap-3 rounded-xl bg-surface-container-high px-4 py-3 lg:py-3.5">
        <FiSearch className="shrink-0 text-on-surface-variant" size={18} />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search premium products..."
          className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/70 lg:text-body-lg"
        />
        <button type="button" className="shrink-0 text-on-surface-variant" aria-label="Filter">
          <FiFilter size={18} />
        </button>
      </div>
    </div>
  );
}
