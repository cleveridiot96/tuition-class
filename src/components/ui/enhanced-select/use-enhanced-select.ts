
import { useState, useMemo, useCallback, useEffect } from "react";
import { SelectOption } from "./types";
import { calculateSimilarity } from "./utils";

export const useEnhancedSelect = (options: SelectOption[], value: string) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [optionsCache, setOptionsCache] = useState<SelectOption[]>(options);
  const [cachedValue, setCachedValue] = useState<string>(value);

  // Update options cache when options change
  useEffect(() => {
    const optionsChanged = JSON.stringify(options) !== JSON.stringify(optionsCache);
    if (optionsChanged) {
      setOptionsCache(options);
    }
  }, [options, optionsCache]);

  // Reset search when value changes externally
  useEffect(() => {
    if (value !== cachedValue) {
      setSearchTerm("");
      setCachedValue(value);
    }
  }, [value, cachedValue]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerSearchTerm)
    );
  }, [options, searchTerm]);

  const inputMatchesOption = useMemo(() => {
    if (!searchTerm) return false;
    return options.some(
      (option) => option.label.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [options, searchTerm]);

  const suggestedMatch = useMemo(() => {
    if (!searchTerm || inputMatchesOption || filteredOptions.length > 0) return null;
    
    const mostSimilarOption = options.reduce(
      (closest, current) => {
        const currentSimilarity = calculateSimilarity(
          searchTerm.toLowerCase(),
          current.label.toLowerCase()
        );
        if (currentSimilarity > closest.similarity) {
          return { option: current, similarity: currentSimilarity };
        }
        return closest;
      },
      { option: null as SelectOption | null, similarity: 0 }
    );

    if (mostSimilarOption.similarity > 0.6) {
      return mostSimilarOption.option?.label || null;
    }
    
    return null;
  }, [searchTerm, inputMatchesOption, filteredOptions, options]);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    suggestedMatch,
    inputMatchesOption,
    selectedOption,
  };
};
