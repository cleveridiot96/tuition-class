
import * as React from "react";
import { ChevronsUpDown, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface EnhancedSearchableSelectProps {
  options: Array<{value: string, label: string}>;
  value: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => string;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  masterType?: string;
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
  const [open, setOpen] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  
  // Debug logging
  console.log(`EnhancedSearchableSelect for ${masterType}:`, { 
    optionsCount: options?.length || 0, 
    options: options,
    value,
    searchTerm
  });
  
  // Handle null/undefined options array
  const safeOptions = Array.isArray(options) ? options : [];

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    return safeOptions.filter(option => 
      option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeOptions, searchTerm]);
  
  // Find the selected option for display
  const selectedOption = React.useMemo(() => {
    return safeOptions.find(option => option.value === value);
  }, [safeOptions, value]);
  
  // Check if input matches an existing option
  const inputMatchesOption = React.useMemo(() => {
    return !!safeOptions.find(
      option => option.label.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [safeOptions, searchTerm]);
  
  // Find a suggested match for partially typed input
  const suggestedMatch = React.useMemo(() => {
    if (!searchTerm) return null;
    const match = safeOptions.find(option => 
      option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    return match ? match.label : null;
  }, [safeOptions, searchTerm]);

  // Handle key events in the input
  const handleInputKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0].value);
      } else if (!inputMatchesOption && searchTerm.trim() && onAddNew) {
        handleAddNewItem();
      }
    }
  }, [filteredOptions, inputMatchesOption, searchTerm, onAddNew]);

  // Handler functions
  const handleSelect = React.useCallback((currentValue: string) => {
    try {
      onValueChange(currentValue);
      setOpen(false);
      setSearchTerm("");
    } catch (e) {
      console.error("Error in select handler:", e);
    }
  }, [onValueChange]);

  const handleAddNewItem = React.useCallback(() => {
    if (searchTerm.trim() && !inputMatchesOption && onAddNew) {
      const newValue = onAddNew(searchTerm.trim());
      if (newValue) {
        onValueChange(newValue);
        setOpen(false);
        setSearchTerm("");
      }
    }
  }, [searchTerm, inputMatchesOption, onAddNew, onValueChange]);

  const useSuggestedMatch = React.useCallback(() => {
    if (suggestedMatch) {
      const matchingOption = safeOptions.find(option => option.label === suggestedMatch);
      if (matchingOption) {
        handleSelect(matchingOption.value);
      }
    }
  }, [suggestedMatch, safeOptions, handleSelect]);

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
            <div className="py-6 px-2 text-center">
              {/* Empty state - show suggestions or empty message */}
              {suggestedMatch ? (
                <div className="text-sm">
                  <p>Did you mean:</p>
                  <Button 
                    variant="link" 
                    className="font-semibold"
                    onClick={useSuggestedMatch}
                  >
                    {suggestedMatch}
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {emptyMessage}
                  
                  {/* Add new option button */}
                  {onAddNew && searchTerm.trim() && (
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        className="text-xs"
                        onClick={handleAddNewItem}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add "{searchTerm}"
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div role="listbox">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === option.value ? "bg-muted" : ""
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
});

EnhancedSearchableSelect.displayName = "EnhancedSearchableSelect";
