
import { useState, useEffect, useMemo, useCallback } from 'react';
import { SelectOption } from './types';
import stringSimilarity from 'string-similarity';

interface UseEnhancedSelectReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedOption: SelectOption | undefined;
  filteredOptions: SelectOption[];
  suggestedMatch: string | null;
  inputMatchesOption: boolean;
}

export const useEnhancedSelect = (
  options: SelectOption[],
  selectedValue?: string
): UseEnhancedSelectReturn => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Find the currently selected option
  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === selectedValue);
  }, [options, selectedValue]);

  // Reset search term when the dropdown is closed
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  // Set initial search term to the selected option's label when opened
  useEffect(() => {
    if (open && selectedOption) {
      setSearchTerm(selectedOption.label);
    }
  }, [open, selectedOption]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Check if the input exactly matches any option
  const inputMatchesOption = useMemo(() => {
    return options.some(
      (option) => option.label.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [options, searchTerm]);

  // Find the best suggestion if no exact match is found
  const suggestedMatch = useMemo(() => {
    if (!searchTerm || inputMatchesOption || filteredOptions.length > 0) {
      return null;
    }

    const optionLabels = options.map((option) => option.label);
    const matches = stringSimilarity.findBestMatch(searchTerm, optionLabels);
    
    if (matches.bestMatch.rating > 0.4) {
      return matches.bestMatch.target;
    }
    
    return null;
  }, [searchTerm, inputMatchesOption, filteredOptions, options]);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    selectedOption,
    filteredOptions,
    suggestedMatch,
    inputMatchesOption,
  };
};
