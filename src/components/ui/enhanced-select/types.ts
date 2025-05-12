
export interface SelectOption {
  value: string;
  label: string;
}

export interface UseEnhancedSelectReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedOption: SelectOption | undefined;
  filteredOptions: SelectOption[];
  suggestedMatch: string | null;
  inputMatchesOption: boolean;
}

export interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => string;
  placeholder?: string;
  emptyMessage?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  masterType?: 'supplier' | 'agent' | 'transporter'; // Added support for masterType
}
