
import * as React from "react";
import { SelectOption } from "./types";

export function useSearchableSelect(options: SelectOption[] = [], value?: string) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const safeOptions = React.useMemo(() => {
    try {
      console.log("SearchableSelect options:", options);
      
      if (!options) return [];
      
      if (!Array.isArray(options)) {
        console.warn('SearchableSelect: options is not an array:', options);
        return [];
      }
      
      return options.filter(option => 
        option && 
        typeof option === 'object' &&
        'value' in option &&
        'label' in option
      );
    } catch (error) {
      console.error('Error in SearchableSelect:', error);
      return [];
    }
  }, [options]);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return safeOptions;
    
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeOptions, searchTerm]);

  const selectedOption = React.useMemo(() => {
    try {
      return safeOptions.find(option => option.value === value);
    } catch (e) {
      return undefined;
    }
  }, [safeOptions, value]);

  React.useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    selectedOption,
    safeOptions
  };
}
