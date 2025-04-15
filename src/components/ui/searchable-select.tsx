
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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

  // Create a safe command item wrapper to catch any errors
  const SafeCommandItem = React.forwardRef<
    HTMLDivElement, 
    React.ComponentPropsWithoutRef<typeof CommandItem>
  >((props, ref) => {
    try {
      return <CommandItem ref={ref} {...props} />;
    } catch (error) {
      console.error("CommandItem crashed:", error);
      return <div className="p-2 text-sm">Error rendering option</div>;
    }
  });
  
  SafeCommandItem.displayName = "SafeCommandItem";

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
        avoidCollisions
        side="bottom"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={`Search ${placeholder.toLowerCase()}...`} 
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <ScrollArea className="max-h-60">
            {filteredOptions.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <SafeCommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue);
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
                  </SafeCommandItem>
                ))}
              </CommandGroup>
            )}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
