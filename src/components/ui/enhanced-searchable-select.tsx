
import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAddToMaster } from "@/hooks/useAddToMaster";
import { SelectOption } from "./enhanced-select/types";
import { EnhancedSelectOption } from "./enhanced-select/enhanced-select-option";
import { EnhancedSelectSuggestion } from "./enhanced-select/enhanced-select-suggestion";
import { MasterType } from "@/types/master.types";

export interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => string;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  masterType?: MasterType | string;
}

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
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();
  
  // State for searchable functionality
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [suggestedMatch, setSuggestedMatch] = React.useState<string | null>(null);
  const [selectedOption, setSelectedOption] = React.useState<SelectOption | null>(null);
  
  // Update the selected option whenever value or options change
  React.useEffect(() => {
    const selected = options.find(option => option.value === value);
    setSelectedOption(selected || null);
  }, [value, options]);
  
  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(lowerSearchTerm)
    );
    
    // Find suggested match
    if (filtered.length === 0) {
      // Find closest match for suggestion
      let bestMatch = null;
      let bestMatchScore = -1;
      
      for (const option of options) {
        const label = option.label.toLowerCase();
        if (label.startsWith(lowerSearchTerm)) {
          // Prefer options that start with the search term
          const score = lowerSearchTerm.length / label.length;
          if (score > bestMatchScore) {
            bestMatch = option.label;
            bestMatchScore = score;
          }
        }
      }
      
      setSuggestedMatch(bestMatch);
    } else {
      setSuggestedMatch(null);
    }
    
    return filtered;
  }, [options, searchTerm]);
  
  // Check if input matches an existing option
  const inputMatchesOption = React.useMemo(() => {
    if (!searchTerm) return false;
    return options.some(option => 
      option.label.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [searchTerm, options]);

  // Handler functions
  const handleSelect = React.useCallback((currentValue: string) => {
    onValueChange(currentValue);
    setOpen(false);
    setSearchTerm("");
  }, [onValueChange]);

  const handleAddNewItem = React.useCallback(() => {
    if (searchTerm.trim() && !inputMatchesOption) {
      if (onAddNew) {
        onAddNew(searchTerm.trim());
      } else {
        confirmAddToMaster(searchTerm.trim(), (confirmedValue) => {
          onValueChange(confirmedValue);
        }, masterType as MasterType);
      }
      setOpen(false);
    }
  }, [searchTerm, inputMatchesOption, onAddNew, confirmAddToMaster, onValueChange, masterType]);

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
        // If there's only one option, select it
        handleSelect(filteredOptions[0].value);
      } else if (!inputMatchesOption && searchTerm.trim()) {
        // If input doesn't match any option and we can add new items
        handleAddNewItem();
      }
    }
  }, [filteredOptions, handleSelect, inputMatchesOption, searchTerm, handleAddNewItem]);

  return (
    <>
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
                showAddOption={Boolean(onAddNew || confirmAddToMaster)}
              />
            ) : (
              <div role="listbox">
                {filteredOptions.map((option) => (
                  <EnhancedSelectOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    isSelected={value === option.value}
                    onSelect={() => handleSelect(option.value)}
                  />
                ))}

                {searchTerm.trim() && !inputMatchesOption && (onAddNew || confirmAddToMaster) && (
                  <div
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground border-t"
                    onClick={handleAddNewItem}
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

      <AddToMasterDialog />
    </>
  );
});

EnhancedSearchableSelect.displayName = "EnhancedSearchableSelect";
