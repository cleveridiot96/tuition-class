
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  label,
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Ensure options is always an array of valid objects and log for debugging
  const safeOptions = React.useMemo(() => {
    try {
      console.log("SearchableSelect options:", options);
      
      if (!options) return [];
      
      if (!Array.isArray(options)) {
        console.warn('SearchableSelect: options is not an array:', options);
        return [];
      }
      
      // Filter out any invalid options
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

  // Reset search term when closed
  React.useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  // Ensure options is always an array
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return safeOptions;
    
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeOptions, searchTerm]);

  // Find the selected option safely
  const selectedOption = React.useMemo(() => {
    try {
      return safeOptions.find(option => option.value === value);
    } catch (e) {
      return undefined;
    }
  }, [safeOptions, value]);

  // Handle selection with error protection
  const handleSelect = React.useCallback((currentValue: string) => {
    try {
      onValueChange(currentValue);
      setOpen(false);
      setSearchTerm("");
    } catch (e) {
      console.error("Error in select handler:", e);
    }
  }, [onValueChange]);

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
            "w-full justify-between bg-white",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) setOpen(!open);
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg z-[9999]" 
        align="start"
        side="bottom"
        sideOffset={4}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex items-center border-b px-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <ScrollArea className="max-h-60">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm">
              {emptyMessage}
            </div>
          ) : (
            <>
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === option.value ? "bg-accent text-accent-foreground" : ""
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
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
            </>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
