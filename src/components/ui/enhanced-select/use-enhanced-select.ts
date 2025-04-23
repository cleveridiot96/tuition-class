
import { useState, useEffect, useMemo, useCallback } from "react";
import { fuzzyMatch } from "@/lib/fuzzy-match";
import { SelectOption } from "./types";

export function useEnhancedSelect(options: SelectOption[], value?: string) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedMatch, setSuggestedMatch] = useState<string | null>(null);
  
  // Reset state when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSuggestedMatch(null);
    }
  }, [open]);

  // Enhanced filtering with fuzzy matching
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    // Find exact and fuzzy matches
    const matches = options.filter(option => 
      fuzzyMatch(searchTerm, option.label) || 
      fuzzyMatch(searchTerm, option.value)
    );
    
    // Look for best fuzzy match for suggestion
    if (matches.length === 0 && searchTerm.length >= 2) {
      const bestMatch = options.find(option => {
        const cleanInput = searchTerm.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        const cleanOption = option.label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        return cleanOption.startsWith(cleanInput.charAt(0)) && 
               (cleanOption.includes(cleanInput) || 
                cleanInput.length >= 2 && cleanOption.substring(0, 2) === cleanInput.substring(0, 2));
      });
      
      if (bestMatch) {
        setSuggestedMatch(bestMatch.label);
      } else {
        setSuggestedMatch(null);
      }
    } else {
      setSuggestedMatch(null);
    }
    
    return matches;
  }, [options, searchTerm]);

  // Check if input matches any option
  const inputMatchesOption = useMemo(() => {
    if (!searchTerm) return false;
    return options.some(option => 
      option.label.toLowerCase() === searchTerm.toLowerCase() ||
      option.value.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [options, searchTerm]);

  // Get selected option
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return options.find(option => option.value === value) || null;
  }, [options, value]);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    suggestedMatch,
    setSuggestedMatch,
    filteredOptions,
    inputMatchesOption,
    selectedOption
  };
}
