
import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { fuzzyMatch } from "@/lib/fuzzy-match";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAddToMaster } from "@/hooks/useAddToMaster";

export interface SelectOption {
  value: string;
  label: string;
}

interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  masterType?: string;
}

// Optimize performance with React.memo and useCallback
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
  masterType = "item"
}: EnhancedSearchableSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [suggestedMatch, setSuggestedMatch] = React.useState<string | null>(null);
  
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();

  // Reset state when dropdown closes
  React.useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSuggestedMatch(null);
    }
  }, [open]);

  // Enhanced filtering with fuzzy matching - memoized for performance
  const filteredOptions = React.useMemo(() => {
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

  // Check if input matches any option - memoized
  const inputMatchesOption = React.useMemo(() => {
    if (!searchTerm) return false;
    return options.some(option => 
      option.label.toLowerCase() === searchTerm.toLowerCase() ||
      option.value.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [options, searchTerm]);

  // Get selected option - memoized
  const selectedOption = React.useMemo(() => {
    if (!value) return null;
    return options.find(option => option.value === value) || null;
  }, [options, value]);

  // Handler functions
  const handleSelect = React.useCallback((currentValue: string) => {
    onValueChange(currentValue);
    setOpen(false);
    setSearchTerm("");
    setSuggestedMatch(null);
  }, [onValueChange]);

  const handleAddNewItem = React.useCallback(() => {
    if (searchTerm.trim() && !inputMatchesOption) {
      if (onAddNew) {
        onAddNew(searchTerm.trim());
      } else {
        confirmAddToMaster(searchTerm.trim(), (confirmedValue) => {
          onValueChange(confirmedValue);
        });
      }
      setOpen(false);
    }
  }, [searchTerm, inputMatchesOption, onAddNew, confirmAddToMaster, onValueChange]);

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
              <div className="py-6 text-center text-sm">
                {searchTerm.trim() ? (
                  <div className="space-y-2 px-4">
                    {suggestedMatch ? (
                      <div className="space-y-2">
                        <p>Did you mean?</p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={useSuggestedMatch}
                        >
                          {suggestedMatch}
                        </Button>
                      </div>
                    ) : (
                      <p>"{searchTerm}" not found</p>
                    )}
                    {(onAddNew || confirmAddToMaster) && (
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleAddNewItem}
                      >
                        <Plus className="h-4 w-4" />
                        Add to {masterType} master
                      </Button>
                    )}
                  </div>
                ) : (
                  emptyMessage
                )}
              </div>
            ) : (
              <div role="listbox">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === option.value ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
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

export default EnhancedSearchableSelect;
