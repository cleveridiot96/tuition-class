
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedSelectOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  index?: number;
}

export const EnhancedSelectOption: React.FC<EnhancedSelectOptionProps> = ({
  value,
  label,
  isSelected,
  onSelect,
  onKeyDown,
  index
}) => {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onKeyDown={onKeyDown}
      data-index={index}
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
};
