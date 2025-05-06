
import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onAddNew?: (item: string) => string;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  masterType?: string;
}
