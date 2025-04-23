
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
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        isSelected ? "bg-accent text-accent-foreground" : ""
      )}
      onClick={onSelect}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
      {label}
    </div>
  );
});

EnhancedSelectOption.displayName = "EnhancedSelectOption";
