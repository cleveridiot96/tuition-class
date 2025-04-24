
import { ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => string; // Ensure this is consistently defined as returning a string
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  masterType?: string;
}
