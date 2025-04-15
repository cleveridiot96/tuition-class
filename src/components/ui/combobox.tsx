
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

interface ComboboxProps {
  options?: { value: string; label: string }[] | null | any;
  value?: string | null;
  onSelect?: (value: string) => void;
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options = [], // Default to empty array
  value = "",
  onSelect,
  onChange,
  onInputChange,
  placeholder = "Select an option",
  className,
  disabled = false
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(value || "");
  
  // Sync with external value changes
  React.useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  // Validate and normalize options
  const normalizedOptions = React.useMemo(() => {
    // For debugging
    console.log("Combobox OPTIONS DEBUG:", {
      type: typeof options,
      isArray: Array.isArray(options),
      raw: options,
      sample: options?.[0],
      value: value
    });
    
    if (!options) return [];
    if (Array.isArray(options)) {
      return options
        .filter(option => option !== null && option !== undefined)
        .map(option => {
          if (!option || typeof option !== 'object') {
            return { value: '', label: 'Invalid option' };
          }
          return {
            value: String(option.value || ''),
            label: String(option.label || '')
          };
        })
        .filter(option => option.value); // Filter out empty values
    }
    console.error("OPTIONS IS NOT ARRAY:", options);
    return [];
  }, [options]);

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    try {
      if (!inputValue) return normalizedOptions;
      
      const term = inputValue.toLowerCase();
      return normalizedOptions.filter(option => 
        String(option.label).toLowerCase().includes(term)
      );
    } catch (error) {
      console.error("Error filtering combobox options:", error);
      return normalizedOptions;
    }
  }, [normalizedOptions, inputValue]);

  // Handle selection
  const handleSelect = (currentValue: string) => {
    try {
      const validValue = currentValue || "";
      setSelectedValue(validValue);
      setOpen(false);
      
      // Only call handlers if they exist
      if (onSelect) onSelect(validValue);
      if (onChange) onChange(validValue);
    } catch (error) {
      console.error("Error in combobox selection:", error);
    }
  };

  // Handle input change
  const handleInputChange = (newValue: string) => {
    try {
      const validValue = newValue || "";
      setInputValue(validValue);
      if (onInputChange) onInputChange(validValue);
    } catch (error) {
      console.error("Error in combobox input change:", error);
    }
  };

  // Get display text
  const displayText = React.useMemo(() => {
    try {
      if (!selectedValue) return placeholder;
      
      const foundOption = normalizedOptions.find(option => option.value === selectedValue);
      return foundOption ? foundOption.label : selectedValue;
    } catch (error) {
      console.error("Error getting display text:", error);
      return placeholder;
    }
  }, [selectedValue, normalizedOptions, placeholder]);

  // Create a safe command item wrapper to catch any errors
  const SafeCommandItem = React.forwardRef<
    HTMLDivElement, 
    React.ComponentPropsWithoutRef<typeof CommandItem>
  >((props, ref) => {
    try {
      return <CommandItem ref={ref} {...props} />;
    } catch (error) {
      console.error("CommandItem crashed in Combobox:", error);
      return <div className="p-2 text-sm">Error rendering option</div>;
    }
  });
  
  SafeCommandItem.displayName = "SafeCommandItem";

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
          className={cn("w-full justify-between bg-white", className)}
          disabled={disabled}
        >
          <span className="truncate">{displayText}</span>
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
            value={inputValue}
            onValueChange={handleInputChange}
          />
          {filteredOptions.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup>
              {filteredOptions.map((option) => (
                <SafeCommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </SafeCommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
