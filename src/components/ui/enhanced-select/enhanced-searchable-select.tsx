
import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { EnhancedSearchableSelectProps } from "./types";
import { useEnhancedSelect } from "./use-enhanced-select";
import { EnhancedSelectOption } from "./enhanced-select-option";
import { EnhancedSelectSuggestion } from "./enhanced-select-suggestion";

export const EnhancedSearchableSelect = React.memo(({
  options = [],
  value,
  onValueChange,
  onAddNew,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  label,
  disabled = false,
  className,
  masterType = "supplier"
}: EnhancedSearchableSelectProps) => {
  const {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    suggestedMatch,
    filteredOptions,
    inputMatchesOption,
    selectedOption
  } = useEnhancedSelect(options, value);

  // Handler functions
  const handleSelect = React.useCallback((currentValue: string) => {
    onValueChange(currentValue);
    setOpen(false);
    setSearchTerm("");
  }, [onValueChange, setOpen, setSearchTerm]);

  const handleAddNewItem = React.useCallback(() => {
    if (searchTerm.trim() && !inputMatchesOption && onAddNew) {
      const newValue = onAddNew(searchTerm.trim());
      if (newValue) {
        onValueChange(newValue);
        setOpen(false);
        setSearchTerm("");
      }
    }
  }, [searchTerm, inputMatchesOption, onAddNew, onValueChange, setOpen, setSearchTerm]);

  const useSuggestedMatch = React.useCallback(() => {
    if (suggestedMatch) {
      const matchingOption = options.find(option => option.label === suggestedMatch);
      if (matchingOption) {
        handleSelect(matchingOption.value);
      }
    }
  }, [suggestedMatch, options, handleSelect]);

  const handleInputKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0].value);
      } else if (!inputMatchesOption && searchTerm.trim() && onAddNew) {
        handleAddNewItem();
      }
    } else if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
      // Focus the first item in the list
      const firstItem = document.querySelector('[role="option"]') as HTMLElement;
      if (firstItem) firstItem.focus();
    }
  }, [filteredOptions, handleSelect, inputMatchesOption, searchTerm, onAddNew, handleAddNewItem]);

  const handleKeyNavigation = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextItem = document.querySelectorAll('[role="option"]')[index + 1] as HTMLElement;
      if (nextItem) nextItem.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        // Focus back on the input
        const input = document.querySelector(`input[placeholder*="${placeholder.toLowerCase()}"]`) as HTMLElement;
        if (input) input.focus();
      } else {
        const prevItem = document.querySelectorAll('[role="option"]')[index - 1] as HTMLElement;
        if (prevItem) prevItem.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const option = filteredOptions[index];
      if (option) handleSelect(option.value);
    }
  }, [filteredOptions, handleSelect, placeholder]);

  return (
    <Popover 
      open={disabled ? false : open} 
      onOpenChange={disabled ? undefined : setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white shadow-sm border-gray-300",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg z-[9999]" 
        align="start"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex items-center border-b px-3">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <ScrollArea className="max-h-60">
          {filteredOptions.length === 0 ? (
            <EnhancedSelectSuggestion 
              suggestedMatch={suggestedMatch}
              onUseSuggestion={useSuggestedMatch}
              searchTerm={searchTerm}
              onAddNewItem={handleAddNewItem}
              masterType={masterType}
              showAddOption={!!onAddNew}
            />
          ) : (
            <div role="listbox">
              {filteredOptions.map((option, index) => (
                <EnhancedSelectOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  isSelected={value === option.value}
                  onSelect={() => handleSelect(option.value)}
                  onKeyDown={(e) => handleKeyNavigation(e, index)}
                  index={index}
                />
              ))}
              
              {/* Add option for new entry if search term doesn't match any existing option */}
              {searchTerm.trim() && !inputMatchesOption && onAddNew && (
                <div
                  role="option"
                  tabIndex={0}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border-t"
                  onClick={handleAddNewItem}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewItem();
                    }
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add "{searchTerm}" to {masterType} master
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
});

EnhancedSearchableSelect.displayName = "EnhancedSearchableSelect";
