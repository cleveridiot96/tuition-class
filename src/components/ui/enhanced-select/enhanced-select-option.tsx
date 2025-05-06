
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedSelectOptionProps } from "./types";

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
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      )}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      data-index={index}
    >
      <span className="flex-grow truncate">{label}</span>
      {isSelected && <Check className="ml-2 h-4 w-4 shrink-0" />}
    </div>
  );
};
