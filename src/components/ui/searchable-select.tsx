
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

interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options?: SelectOption[] | null | undefined;
  value?: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options = [], // Default to empty array
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // 1. Nuclear-proof options normalization
  const safeOptions = React.useMemo(() => {
    try {
      // For debugging
      console.log("SearchableSelect OPTIONS DEBUG:", {
        type: typeof options,
        isArray: Array.isArray(options),
        raw: options,
        sample: options?.[0],
        value: value
      });
      
      // If options is null/undefined, return empty array
      if (!options) return [];
      
      // If it's not an array, try to convert it
      if (!Array.isArray(options)) {
        // Handle single option case
        if (options && typeof options === 'object' && 'value' in options) {
          return [{
            value: String(options.value),
            label: String(options.label || options.value)
          }];
        }
        console.warn('Options is not an array:', options);
        return [];
      }

      // Process array options
      return options
        .filter(Boolean) // Remove null/undefined
        .map(option => ({
          value: String(option?.value ?? ''),
          label: String(option?.label ?? option?.value ?? '')
        }))
        .filter(option => option.value); // Remove empty values
    } catch (error) {
      console.error('Error normalizing options:', error);
      return [];
    }
  }, [options, value]);

  // 2. Safe filtered options
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return safeOptions;
    
    try {
      const term = searchTerm.toLowerCase();
      return safeOptions.filter(option => 
        option.label.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error filtering options:', error);
      return safeOptions;
    }
  }, [safeOptions, searchTerm]);

  // 3. Safe selected option
  const selectedOption = React.useMemo(() => {
    try {
      return safeOptions.find(option => option.value === value) || null;
    } catch (error) {
      console.error('Error finding selected option:', error);
      return null;
    }
  }, [safeOptions, value]);

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
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
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg z-[9999]" 
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="flex items-center border-b px-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <ScrollArea className="max-h-60">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm">{emptyMessage}</div>
          ) : (
            <div>
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    value === option.value && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onValueChange(option.value);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

