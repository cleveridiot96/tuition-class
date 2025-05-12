
import React, { useRef, useState, useCallback, useMemo } from "react";
import { Command, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command";
import { EnhancedSearchableSelectProps } from "./enhanced-select/types";
import { EnhancedSelectOption } from "./enhanced-select/enhanced-select-option";
import { EnhancedSelectSuggestion } from "./enhanced-select/enhanced-select-suggestion";
import { useEnhancedSelect } from "./enhanced-select/use-enhanced-select";
import { useGlobalMasterDialog } from "@/hooks/useGlobalMasterDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function EnhancedSearchableSelect({
  options = [],
  value,
  onValueChange,
  onAddNew,
  placeholder = "Search...",
  emptyMessage = "No results found",
  label,
  disabled = false,
  className = "",
  masterType = "supplier"
}: EnhancedSearchableSelectProps) {
  // Always ensure options is an array to prevent "undefined is not iterable" errors
  const safeOptions = useMemo(() => {
    if (!Array.isArray(options)) {
      console.warn(`EnhancedSearchableSelect: options is not an array, received:`, options);
      return [];
    }
    return options.filter(option => option !== null && option !== undefined);
  }, [options]);
  
  const { open, GlobalMasterAddDialog, handleAddMaster } = useGlobalMasterDialog();
  
  const {
    open: isOpen,
    setOpen,
    searchTerm,
    setSearchTerm,
    selectedOption,
    filteredOptions,
    suggestedMatch,
    inputMatchesOption
  } = useEnhancedSelect(safeOptions, value || '');

  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    
    // Safely access filteredOptions - ensure it's always an array
    const safeFilteredOptions = Array.isArray(filteredOptions) ? filteredOptions : [];
    const optionsLength = safeFilteredOptions.length;
    
    // Handle keyboard navigation with improved safety checks
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(prevIndex => 
          prevIndex < optionsLength - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < optionsLength && safeFilteredOptions[activeIndex]) {
          onValueChange(safeFilteredOptions[activeIndex].value);
          setOpen(false);
        } else if (searchTerm && !inputMatchesOption) {
          handleAddNewItem();
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  }, [isOpen, filteredOptions, activeIndex, onValueChange, setOpen, searchTerm, inputMatchesOption]);

  const handleBlur = useCallback(() => {
    // Delayed closing to allow clicking on options
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setOpen(false);
      }
    }, 100);
  }, [setOpen]);

  const handleUseSuggestion = useCallback(() => {
    if (suggestedMatch && safeOptions.length > 0) {
      try {
        const option = safeOptions.find(opt => 
          opt && opt.label && opt.label.toLowerCase() === suggestedMatch.toLowerCase()
        );
        if (option) {
          onValueChange(option.value);
          setOpen(false);
        }
      } catch (error) {
        console.error("Error using suggestion:", error);
      }
    }
  }, [suggestedMatch, safeOptions, onValueChange, setOpen]);

  const handleAddNewItem = useCallback(() => {
    if (searchTerm) {
      // If we're using the global master dialog
      if (masterType === 'supplier' || masterType === 'agent' || masterType === 'transporter') {
        open(masterType, searchTerm);
        handleAddMaster((id, name) => {
          // This callback will be called after successfully adding the new master
          if (onValueChange) {
            onValueChange(id);
          }
        });
      } 
      // If we're using a custom onAddNew function
      else if (onAddNew) {
        try {
          const newValue = onAddNew(searchTerm);
          if (newValue) {
            onValueChange(newValue);
            setOpen(false);
          }
        } catch (error) {
          console.error("Error adding new item:", error);
        }
      }
    }
  }, [onAddNew, searchTerm, onValueChange, setOpen, masterType, open, handleAddMaster]);

  const showAddOption = useMemo(() => {
    return Boolean(searchTerm && !inputMatchesOption && (onAddNew || masterType));
  }, [onAddNew, searchTerm, inputMatchesOption, masterType]);

  // Ensure filteredOptions is always an array
  const safeFilteredOptions = useMemo(() => {
    return Array.isArray(filteredOptions) ? filteredOptions : [];
  }, [filteredOptions]);

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {masterType && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => open(masterType as 'supplier' | 'agent' | 'transporter')}
              className="h-6 px-2 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          )}
        </div>
      )}
      <Command
        className="border rounded-md overflow-visible bg-transparent"
        shouldFilter={false}
      >
        <CommandInput
          ref={inputRef}
          value={searchTerm || ''}
          onValueChange={setSearchTerm}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="focus:outline-none border-none focus:ring-0 p-2"
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
        {isOpen && (
          <CommandList className="absolute top-full left-0 w-full z-50 bg-white shadow-lg rounded-md border mt-1 max-h-60 overflow-auto">
            <CommandEmpty>
              <EnhancedSelectSuggestion
                suggestedMatch={suggestedMatch}
                onUseSuggestion={handleUseSuggestion}
                searchTerm={searchTerm || ''}
                onAddNewItem={handleAddNewItem}
                masterType={masterType}
                showAddOption={showAddOption}
              />
            </CommandEmpty>
            {safeFilteredOptions.length > 0 ? (
              safeFilteredOptions.map((option, index) => (
                <EnhancedSelectOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  isSelected={value === option.value}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  onKeyDown={handleKeyDown}
                  index={index}
                />
              ))
            ) : (
              <div className="py-2 px-4 text-sm text-gray-500">
                {searchTerm ? `No results for "${searchTerm}"` : emptyMessage}
              </div>
            )}
            {showAddOption && (
              <div 
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t"
                onClick={handleAddNewItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add "{searchTerm}" to {masterType} master
              </div>
            )}
          </CommandList>
        )}
      </Command>
      <GlobalMasterAddDialog />
    </div>
  );
}
