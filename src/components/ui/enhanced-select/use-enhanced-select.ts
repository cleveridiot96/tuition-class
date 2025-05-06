import * as React from "react";
import { SelectOption } from "./types";

export const useEnhancedSelect = (options: SelectOption[], value?: string) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Find the selected option from the options array
  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    
    return options.filter((option) => {
      const label = option.label.toLowerCase();
      const search = searchTerm.toLowerCase();
      return label.includes(search);
    });
  }, [options, searchTerm]);

  // Check if the current search term exactly matches any option's label
  const inputMatchesOption = React.useMemo(() => {
    if (!searchTerm) return false;
    
    return options.some(
      (option) => option.label.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [options, searchTerm]);

  // Find a suggested match for the search term
  const suggestedMatch = React.useMemo(() => {
    if (!searchTerm || searchTerm.length < 2 || inputMatchesOption) return undefined;
    
    // Find options that start with the search term
    const matchingOptions = options.filter(option => 
      option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    
    // If there's exactly one matching option, suggest it
    if (matchingOptions.length === 1) {
      return matchingOptions[0].label;
    }
    
    // Otherwise, return undefined (no suggestion)
    return undefined;
  }, [options, searchTerm, inputMatchesOption]);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    selectedOption,
    inputMatchesOption,
    suggestedMatch
  };
};
