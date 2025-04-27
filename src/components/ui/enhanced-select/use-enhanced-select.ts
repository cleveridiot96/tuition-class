
import * as React from "react";
import { SelectOption } from "./types";
import { stringSimilarity } from 'string-similarity';

export const useEnhancedSelect = (options: SelectOption[], value?: string) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [suggestedMatch, setSuggestedMatch] = React.useState<string | null>(null);

  // Find the currently selected option
  const selectedOption = React.useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    
    return options.filter(option => {
      // Add null/undefined check for option.label
      const label = option.label || '';
      const search = searchTerm.toLowerCase();
      return label.toLowerCase().includes(search);
    });
  }, [options, searchTerm]);

  // Check if input matches any option exactly
  const inputMatchesOption = React.useMemo(() => {
    if (!searchTerm) return false;
    
    return options.some(option => {
      // Add null/undefined check for option.label
      const label = option.label || '';
      return label.toLowerCase() === searchTerm.toLowerCase();
    });
  }, [options, searchTerm]);

  // Find similar options for suggestion
  React.useEffect(() => {
    // Only suggest if there are no exact matches and the search term is at least 2 chars
    if (searchTerm.length > 1 && !inputMatchesOption && options.length > 0) {
      try {
        // Find the closest match
        const matches = options.map(option => ({
          option,
          similarity: stringSimilarity.compareTwoStrings(
            searchTerm.toLowerCase(),
            (option.label || '').toLowerCase()
          )
        }));
        
        const bestMatch = matches.sort((a, b) => b.similarity - a.similarity)[0];
        
        // Only suggest if the similarity is above a threshold
        if (bestMatch && bestMatch.similarity > 0.4) {
          setSuggestedMatch(bestMatch.option.label);
        } else {
          setSuggestedMatch(null);
        }
      } catch (error) {
        console.error("Error calculating string similarity:", error);
        setSuggestedMatch(null);
      }
    } else {
      setSuggestedMatch(null);
    }
  }, [searchTerm, options, inputMatchesOption]);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    suggestedMatch,
    filteredOptions,
    inputMatchesOption,
    selectedOption
  };
};
