
export interface SelectOption {
  value: string;
  label: string;
  data?: any;
}

export interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => string | void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  masterType?: string;
}

export interface EnhancedSelectOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  index: number;
}

export interface EnhancedSelectSuggestionProps {
  suggestedMatch?: string;
  onUseSuggestion: () => void;
  searchTerm: string;
  onAddNewItem: () => void;
  masterType: string;
  showAddOption: boolean;
}
