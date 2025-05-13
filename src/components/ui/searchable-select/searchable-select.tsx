
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
import { SelectOption } from './types';

export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => string | void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  masterType?: string;
  label?: React.ReactNode;
}

export const SearchableSelect = React.forwardRef<
  HTMLButtonElement,
  SearchableSelectProps
>(
  (
    {
      options = [],
      value,
      onValueChange,
      onAddNew,
      placeholder = "Select an option",
      emptyMessage = "No results found.",
      className,
      disabled = false,
      masterType = "item",
      label,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    
    // Filter options based on search term
    const filteredOptions = React.useMemo(() => {
      return searchTerm === ""
        ? options
        : options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          );
    }, [searchTerm, options]);
    
    // Check if input matches any option
    const inputMatchesOption = React.useMemo(() => {
      return options.some(
        option => option.label.toLowerCase() === searchTerm.toLowerCase()
      );
    }, [searchTerm, options]);
    
    // Find the currently selected option
    const selectedOption = React.useMemo(() => {
      return options.find((option) => option.value === value);
    }, [value, options]);
    
    // Handle option selection
    const handleSelect = React.useCallback((currentValue: string) => {
      onValueChange(currentValue);
      setOpen(false);
      setSearchTerm("");
    }, [onValueChange]);
    
    // Handle new item addition
    const handleAddNewItem = React.useCallback(() => {
      if (searchTerm.trim() && !inputMatchesOption && onAddNew) {
        const newValue = onAddNew(searchTerm.trim());
        if (newValue) {
          onValueChange(newValue);
        }
        setOpen(false);
        setSearchTerm("");
      }
    }, [searchTerm, inputMatchesOption, onAddNew, onValueChange]);
    
    // Handle input key press
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        
        if (filteredOptions.length === 1) {
          // If there's exactly one match, select it
          handleSelect(filteredOptions[0].value);
        } else if (!inputMatchesOption && searchTerm.trim() && onAddNew) {
          // Otherwise, try to add a new item
          handleAddNewItem();
        }
      } else if (e.key === 'ArrowDown') {
        // Focus the first item in the list
        const firstItem = document.querySelector('[data-select-option]') as HTMLElement;
        if (firstItem) firstItem.focus();
      }
    }, [filteredOptions, handleSelect, inputMatchesOption, searchTerm, onAddNew, handleAddNewItem]);

    return (
      <>
        {label && <div className="text-sm font-medium mb-1.5 text-gray-700">{label}</div>}
        <Popover open={disabled ? false : open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between bg-white",
                !value && "text-muted-foreground",
                className
              )}
              disabled={disabled}
            >
              {selectedOption ? selectedOption.label : placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg z-50" align="start">
            <div className="flex items-center border-b px-3">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                autoFocus
              />
            </div>
            <ScrollArea className="h-[var(--radix-popover-content-available-height)] max-h-[300px]">
              {filteredOptions.length > 0 ? (
                <div className="p-1">
                  {filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      data-select-option
                      tabIndex={0}
                      role="option"
                      aria-selected={value === option.value}
                      className={cn(
                        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
                        value === option.value && "bg-accent text-accent-foreground"
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelect(option.value);
                        }
                      }}
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
                  
                  {/* Add new option if searchTerm doesn't match any existing option */}
                  {searchTerm.trim() && !inputMatchesOption && onAddNew && (
                    <div
                      role="option"
                      tabIndex={0}
                      className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground border-t"
                      onClick={handleAddNewItem}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAddNewItem();
                        }
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add "{searchTerm}" to {masterType} list
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 text-sm text-muted-foreground">
                  {emptyMessage}
                  {onAddNew && searchTerm.trim() && (
                    <div className="mt-4">
                      <Button 
                        size="sm" 
                        onClick={handleAddNewItem}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add "{searchTerm}"
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";
