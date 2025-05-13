
export interface SelectOption {
  value: string;
  label: string;
  data?: any;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => void | string;
  placeholder?: string;
  emptyMessage?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  masterType?: string;
}
