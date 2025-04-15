
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
  options?: SelectOption[] | null | any; // Accept ANYTHING
  value?: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options = [], // DEFAULT TO EMPTY ARRAY (CRITICAL)
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
  
  // 1. FORCE options to ALWAYS be an array, no matter what
  const safeOptions = React.useMemo(() => {
    // For debugging
    console.log("SearchableSelect OPTIONS DEBUG:", {
      type: typeof options,
      isArray: Array.isArray(options),
      raw: options,
      sample: options?.[0],
      value: value
    });
    
    if (!options) return [];
    if (Array.isArray(options)) {
      return options
        .filter(o => o !== null && o !== undefined)
        .map((o) => ({
          value: String(o?.value ?? ""),
          label: String(o?.label ?? "")
        }))
        .filter((o) => o.value); // Remove empty values
    }
    console.error("OPTIONS IS NOT ARRAY:", options);
    return [];
  }, [options, value]);
  
  // 2. SAFE filtered options
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return safeOptions;
    
    try {
      const term = searchTerm.toLowerCase();
      return safeOptions.filter(option => 
        String(option.label).toLowerCase().includes(term)
      );
    } catch (error) {
      console.error("Error filtering options:", error);
      return safeOptions;
    }
  }, [safeOptions, searchTerm]);
  
  // 3. SAFE selected value
  const selectedOption = React.useMemo(() => {
    try {
      return safeOptions.find(option => option.value === value) || null;
    } catch (error) {
      console.error("Error finding selected option:", error);
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
          {selectedOption ? selectedOption.label : placeholder}
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
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
