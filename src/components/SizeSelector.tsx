import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}

const SizeSelector = ({ sizes, selected, onSelect }: SizeSelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={cn(
            "w-12 h-10 rounded-lg border-2 text-sm font-medium transition-all",
            selected === size
              ? "bg-primary border-primary text-primary-foreground"
              : "border-foreground bg-background text-foreground hover:bg-secondary"
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
