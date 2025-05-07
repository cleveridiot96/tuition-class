
import React from "react";
import { EnhancedSelectOptionProps } from "./types";
import { CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";

export const EnhancedSelectOption: React.FC<EnhancedSelectOptionProps> = ({
  value,
  label,
  isSelected,
  onSelect,
  onKeyDown,
  index
}) => {
  return (
    <CommandItem
      key={value}
      value={value}
      onSelect={onSelect}
      onKeyDown={onKeyDown}
      className="flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 data-[selected=true]:bg-gray-100"
      data-index={index}
    >
      <span>{label}</span>
      {isSelected && <Check className="h-4 w-4 text-primary" />}
    </CommandItem>
  );
};
