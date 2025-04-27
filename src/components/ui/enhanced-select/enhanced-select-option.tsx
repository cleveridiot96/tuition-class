
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedSelectOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const EnhancedSelectOption = React.memo(({
  value,
  label,
  isSelected,
  onSelect
}: EnhancedSelectOptionProps) => {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={onSelect}
    >
      <span className={cn("absolute left-2 flex h-4 w-4 items-center justify-center", isSelected ? "opacity-100" : "opacity-0")}>
        <Check className="h-4 w-4" />
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
});

EnhancedSelectOption.displayName = "EnhancedSelectOption";
