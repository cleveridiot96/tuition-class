
import * as React from "react";
import { SelectOption } from "./types";
import { useDebounce } from "@/hooks/useDebounce";

export function useEnhancedSelect(options: SelectOption[] = [], value?: string) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Derived state from search term
  const suggestedMatch = React.useMemo(() => {
    if (!debouncedSearchTerm) return "";
    
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    for (const option of options) {
      if (option.label.toLowerCase().startsWith(lowerSearchTerm)) {
        return option.label;
      }
    }
    return "";
  }, [debouncedSearchTerm, options]);

  // Check if the current input exactly matches an option
  const inputMatchesOption = React.useMemo(() => {
    if (!searchTerm) return false;
    return options.some(
      option => option.label.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [searchTerm, options]);

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!debouncedSearchTerm) return options;
    
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(lowerSearchTerm)
    );
  }, [debouncedSearchTerm, options]);

  // Find the selected option based on value
  const selectedOption = React.useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    suggestedMatch,
    filteredOptions,
    inputMatchesOption,
    selectedOption,
  };
}
