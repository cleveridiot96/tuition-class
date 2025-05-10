
import { useState, useEffect, useMemo, useCallback } from "react";
import { SelectOption, UseEnhancedSelectReturn } from "./types";
import { findBestMatch } from "string-similarity";

export const useEnhancedSelect = (options: SelectOption[] | null | undefined, value: string): UseEnhancedSelectReturn => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lastValidOptions, setLastValidOptions] = useState<SelectOption[]>([]);
  const [lastSearchTerm, setLastSearchTerm] = useState<string>("");

  // Enhanced validation to ensure options is always a valid array
  const safeOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) {
      console.warn("useEnhancedSelect: options is not a valid array, using empty array instead");
      return lastValidOptions.length > 0 ? lastValidOptions : [];
    }
    
    // Filter out null or undefined options
    const validOptions = options.filter(option => 
      option !== null && 
      option !== undefined && 
      typeof option === 'object' && 
      'value' in option && 
      'label' in option
    );
    
    // Store valid options for fallback
    if (validOptions.length > 0) {
      setLastValidOptions(validOptions);
    }
    
    return validOptions;
  }, [options, lastValidOptions]);

  // Find the selected option based on the value, with improved error handling
  const selectedOption = useMemo(() => {
    if (!value || !safeOptions.length) return undefined;
    
    try {
      const found = safeOptions.find(option => 
        option && typeof option === 'object' && 'value' in option && option.value === value
      );
      
      if (found) return found;
      
      // If no match found, log for debugging
      console.log("No matching option found for value:", value);
      return undefined;
    } catch (error) {
      console.error("Error finding selected option:", error);
      return undefined;
    }
  }, [safeOptions, value]);

  // Set the search term to the selected option's label when value changes
  useEffect(() => {
    try {
      if (selectedOption && selectedOption.label) {
        // Only update if it's different to avoid loops
        if (searchTerm !== selectedOption.label) {
          setSearchTerm(selectedOption.label);
          setLastSearchTerm(selectedOption.label);
        }
      } else if (value === '') {
        // Reset search term if value is empty
        if (searchTerm !== '') {
          setSearchTerm('');
          setLastSearchTerm('');
        }
      }
    } catch (error) {
      console.error("Error setting search term from selected option:", error);
      setSearchTerm(lastSearchTerm);
    }
  }, [selectedOption, value, searchTerm, lastSearchTerm]);

  // Filter options based on search term - memoized with error handling
  const filteredOptions = useMemo(() => {
    if (!searchTerm || !safeOptions.length) {
      return safeOptions;
    }
    
    try {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return safeOptions.filter(option => 
        option && option.label && 
        typeof option.label === 'string' && 
        option.label.toLowerCase().includes(lowerSearchTerm)
      );
    } catch (error) {
      console.error("Error filtering options:", error);
      return safeOptions;
    }
  }, [safeOptions, searchTerm]);

  // Find suggested match with improved error handling
  const suggestedMatch = useMemo(() => {
    if (!searchTerm || filteredOptions.length > 0 || safeOptions.length === 0) {
      return null;
    }
    
    try {
      // Use string-similarity to find the closest match
      const targets = safeOptions
        .filter(option => option && typeof option === 'object' && option.label)
        .map(option => String(option.label));
      
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

  // Check if input matches an existing option - with improved error handling
  const inputMatchesOption = useMemo(() => {
    if (!searchTerm || !safeOptions.length) return false;
    
    try {
      return safeOptions.some(option => 
        option && option.label && 
        typeof option.label === 'string' && 
        option.label.toLowerCase() === searchTerm.toLowerCase()
      );
    } catch (error) {
      console.error("Error checking if input matches option:", error);
      return false;
    }
  }, [safeOptions, searchTerm]);

  // Memoize the setSearchTerm function to prevent re-creation on each render
  const handleSearchTermChange = useCallback((term: string) => {
    // Only update if different to prevent infinite loops
    if (term !== searchTerm) {
      setSearchTerm(term || '');
      setLastSearchTerm(term || '');
    }
  }, [searchTerm]);

  // Ensure we always return valid arrays and values
  return {
    open,
    setOpen,
    searchTerm: searchTerm || '',
    setSearchTerm: handleSearchTermChange,
    selectedOption,
    filteredOptions: filteredOptions || [], // Ensure we never return undefined
    suggestedMatch,
    inputMatchesOption
  };
};
