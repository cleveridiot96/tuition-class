
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedSelectOptionProps } from "./types";

export const EnhancedSelectOption: React.FC<EnhancedSelectOptionProps> = ({
  value,
  label,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground"
      )}
      onClick={onSelect}
    >
      <span className="flex-1 truncate">{label}</span>
      {isSelected && <Check className="h-4 w-4 ml-2" />}
    </div>
  );
};
