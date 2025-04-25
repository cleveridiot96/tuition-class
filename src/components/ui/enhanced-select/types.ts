
import { ReactNode } from "react";
import { MasterType } from "@/types/master.types";

export interface SelectOption {
  value: string;
  label: string;
}

export interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => string; 
  placeholder?: string;
  emptyMessage?: string;  // Add this property
  disabled?: boolean;
  className?: string;
  label?: string;
  masterType?: MasterType;
}
