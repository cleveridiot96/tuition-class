
import React from "react";

export interface EnhancedSelectOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  index: number;
}

export function EnhancedSelectOption({
  value,
  label,
  isSelected,
  onSelect,
  onKeyDown,
  index
}: EnhancedSelectOptionProps) {
  return (
    <div
      className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
        isSelected ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
      }`}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="option"
      aria-selected={isSelected}
      data-index={index}
    >
      <span>{label}</span>
    </div>
  );
}
