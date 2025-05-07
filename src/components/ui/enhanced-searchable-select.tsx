
import React, { useRef, useState } from "react";
import { Command, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command";
import { EnhancedSearchableSelectProps } from "./enhanced-select/types";
import { EnhancedSelectOption } from "./enhanced-select/enhanced-select-option";
import { EnhancedSelectSuggestion } from "./enhanced-select/enhanced-select-suggestion";
import { useEnhancedSelect } from "./enhanced-select/use-enhanced-select";

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
  const safeOptions = Array.isArray(options) ? options : [];
  
  const {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    selectedOption,
    filteredOptions,
    suggestedMatch,
    inputMatchesOption
  } = useEnhancedSelect(safeOptions, value);

  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    
    const optionsLength = filteredOptions.length;
    
    // Handle keyboard navigation
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
        if (activeIndex >= 0 && activeIndex < optionsLength) {
          onValueChange(filteredOptions[activeIndex].value);
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const handleBlur = () => {
    // Delayed closing to allow clicking on options
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setOpen(false);
      }
    }, 100);
  };

  const handleUseSuggestion = () => {
    if (suggestedMatch) {
      const option = safeOptions.find(opt => opt.label.toLowerCase() === suggestedMatch.toLowerCase());
      if (option) {
        onValueChange(option.value);
        setOpen(false);
      }
    }
  };

  const handleAddNewItem = () => {
    if (onAddNew && searchTerm) {
      const newValue = onAddNew(searchTerm);
      onValueChange(newValue);
      setOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Command
        className="border rounded-md overflow-visible bg-transparent"
        shouldFilter={false}
      >
        <CommandInput
          ref={inputRef}
          value={searchTerm}
          onValueChange={setSearchTerm}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="focus:outline-none border-none focus:ring-0 p-2"
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
        {open && filteredOptions && (
          <CommandList className="absolute top-full left-0 w-full z-50 bg-white shadow-lg rounded-md border mt-1 max-h-60 overflow-auto">
            <CommandEmpty>
              {!inputMatchesOption && suggestedMatch ? (
                <EnhancedSelectSuggestion
                  suggestedMatch={suggestedMatch}
                  onUseSuggestion={handleUseSuggestion}
                  searchTerm={searchTerm}
                  onAddNewItem={handleAddNewItem}
                  masterType={masterType}
                  showAddOption={!!onAddNew}
                />
              ) : (
                <EnhancedSelectSuggestion
                  suggestedMatch={null}
                  onUseSuggestion={handleUseSuggestion}
                  searchTerm={searchTerm}
                  onAddNewItem={handleAddNewItem}
                  masterType={masterType}
                  showAddOption={!!onAddNew}
                />
              )}
            </CommandEmpty>
            {filteredOptions.map((option, index) => (
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
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
