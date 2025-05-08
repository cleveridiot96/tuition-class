
import { useState, useEffect, useMemo, useCallback } from "react";
import { SelectOption, UseEnhancedSelectReturn } from "./types";
import { findBestMatch } from "string-similarity";

export const useEnhancedSelect = (options: SelectOption[] | null | undefined, value: string): UseEnhancedSelectReturn => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Ensure options is always an array even if null or undefined
  const safeOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) {
      console.warn("useEnhancedSelect: options is not a valid array, using empty array instead");
      return [];
    }
    return options;
  }, [options]);

  // Find the selected option based on the value
  const selectedOption = useMemo(() => {
    if (!value || !safeOptions.length) return undefined;
    
    const found = safeOptions.find(option => option && option.value === value);
    if (found) return found;
    
    // If no match found, log for debugging
    console.log("No matching option found for value:", value, "in options:", safeOptions);
    return undefined;
  }, [safeOptions, value]);

  // Set the search term to the selected option's label when value changes
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else if (value === '') {
      // Reset search term if value is empty
      setSearchTerm('');
    }
  }, [selectedOption, value]);

  // Filter options based on search term - memoized to prevent re-calculation
  const filteredOptions = useMemo(() => {
    if (!searchTerm || !safeOptions.length) {
      return safeOptions;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return safeOptions.filter(option => 
      option && option.label && option.label.toLowerCase().includes(lowerSearchTerm)
    );
  }, [safeOptions, searchTerm]);

  // Find suggested match if no options match the search term
  const suggestedMatch = useMemo(() => {
    if (!searchTerm || filteredOptions.length > 0 || safeOptions.length === 0) {
      return null;
    }
    
    try {
      // Use string-similarity to find the closest match
      const targets = safeOptions
        .filter(option => option && option.label)
        .map(option => option.label);
      
      if (!targets.length) return null;

      const matches = findBestMatch(searchTerm, targets);
      if (matches && matches.bestMatch && matches.bestMatch.rating > 0.4) {
        return matches.bestMatch.target;
      }
    } catch (error) {
      console.error("Error finding best match:", error);
    }
    
    return null;
  }, [searchTerm, filteredOptions, safeOptions]);

  // Check if input matches an existing option - memoized to prevent re-calculation
  const inputMatchesOption = useMemo(() => {
    if (!searchTerm || !safeOptions.length) return false;
    
    return safeOptions.some(option => 
      option && option.label && option.label.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [safeOptions, searchTerm]);

  // Memoize the setSearchTerm function to prevent re-creation on each render
  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    selectedOption,
    filteredOptions,
    suggestedMatch,
    inputMatchesOption
  };
};
