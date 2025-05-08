
import { useState, useEffect, useMemo, useCallback } from "react";
import { SelectOption, UseEnhancedSelectReturn } from "./types";
import { findBestMatch } from "string-similarity";

export const useEnhancedSelect = (options: SelectOption[], value: string): UseEnhancedSelectReturn => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Ensure options is always an array
  const safeOptions = useMemo(() => {
    if (!Array.isArray(options)) {
      console.warn("useEnhancedSelect: options is not an array, using empty array instead");
      return [];
    }
    return options;
  }, [options]);

  // Find the selected option based on the value
  const selectedOption = useMemo(() => {
    if (!value || !safeOptions.length) return undefined;
    return safeOptions.find(option => option.value === value);
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

  // Filter options based on search term - memoized to prevent re-calculation on every render
  const filteredOptions = useMemo(() => {
    if (!searchTerm || !safeOptions.length) {
      return safeOptions;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(lowerSearchTerm)
    );
  }, [safeOptions, searchTerm]);

  // Find suggested match if no options match the search term
  const suggestedMatch = useMemo(() => {
    if (!searchTerm || filteredOptions.length > 0 || safeOptions.length === 0) {
      return null;
    }
    
    try {
      // Use string-similarity to find the closest match
      const targets = safeOptions.map(option => option.label);
      
      if (!targets.length) return null;

      const matches = findBestMatch(searchTerm, targets);
      if (matches.bestMatch.rating > 0.4) {
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
      option.label.toLowerCase() === searchTerm.toLowerCase()
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
