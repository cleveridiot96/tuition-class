
import { useState, useMemo, useCallback, useEffect } from "react";
import { SelectOption } from "./types";

export const useEnhancedSelect = (options: SelectOption[], value: string) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [optionsCache, setOptionsCache] = useState<SelectOption[]>(options);

  // Update options cache when options change
  useEffect(() => {
    if (JSON.stringify(options) !== JSON.stringify(optionsCache)) {
      setOptionsCache(options);
    }
  }, [options, optionsCache]);

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
    if (!searchTerm || inputMatchesOption || filteredOptions.length === 0) return null;
    
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

  const calculateSimilarity = (a: string, b: string): number => {
    if (a.length === 0) return b.length === 0 ? 1 : 0;
    if (b.length === 0) return 0;
    
    // Simple contains check
    if (b.includes(a) || a.includes(b)) {
      return 0.8;
    }
    
    // Levenshtein-based similarity for non-containing strings
    const maxLength = Math.max(a.length, b.length);
    const distance = levenshteinDistance(a, b);
    return 1 - distance / maxLength;
  };

  const levenshteinDistance = (a: string, b: string): number => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[b.length][a.length];
  };

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
