
import { useState, useEffect, useMemo, useCallback } from "react";
import { SelectOption, UseEnhancedSelectReturn } from "./types";
import { findBestMatch } from "string-similarity";

export const useEnhancedSelect = (options: SelectOption[], value: string): UseEnhancedSelectReturn => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Find the selected option based on the value
  const selectedOption = useMemo(() => {
    return options?.find(option => option.value === value);
  }, [options, value]);

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
    if (!searchTerm || !Array.isArray(options)) {
      return options || [];
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(lowerSearchTerm)
    );
  }, [options, searchTerm]);

  // Find suggested match if no options match the search term
  const suggestedMatch = useMemo(() => {
    if (!searchTerm || filteredOptions.length > 0 || !Array.isArray(options) || options.length === 0) {
      return null;
    }
    
    // Use string-similarity to find the closest match
    const targets = options.map(option => option.label);
    
    try {
      const matches = findBestMatch(searchTerm, targets);
      if (matches.bestMatch.rating > 0.4) {
        return matches.bestMatch.target;
      }
    } catch (error) {
      console.error("Error finding best match:", error);
    }
    
    return null;
  }, [searchTerm, filteredOptions, options]);

  // Check if input matches an existing option - memoized to prevent re-calculation
  const inputMatchesOption = useMemo(() => {
    if (!searchTerm || !Array.isArray(options)) return false;
    
    return options.some(option => 
      option.label.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [options, searchTerm]);

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
    filteredOptions: filteredOptions || [],
    suggestedMatch,
    inputMatchesOption
  };
};
