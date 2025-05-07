
import { ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
  data?: any;
}

export interface EnhancedSelectOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  index?: number;
}

export interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => string;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  masterType?: string;
}

export interface UseEnhancedSelectReturn {
  open: boolean;
  setOpen: (value: boolean) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedOption: SelectOption | undefined;
  filteredOptions: SelectOption[];
  suggestedMatch: string | null;
  inputMatchesOption: boolean;
}
