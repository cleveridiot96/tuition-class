
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
  options: { value: string; label: string }[];
  value?: string;
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
  
  // IMPROVED: Sync with external value changes
  React.useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  // IMPORTANT FIX: Guarantee options is always a valid array of objects with value and label
  const safeOptions = React.useMemo(() => {
    // First ensure options is an array
    if (!Array.isArray(options)) {
      console.log("Combobox: options is not an array, defaulting to []");
      return [];
    }
    
    // Then filter out invalid options
    const validOptions = options.filter(option => 
      option !== null &&
      option !== undefined &&
      typeof option === 'object' && 
      'value' in option && 
      'label' in option
    );
    
    if (validOptions.length < options.length) {
      console.log("Combobox: Some options were invalid and filtered out");
    }
    
    return validOptions;
  }, [options]);

  // IMPROVED: Filter options based on input with proper null checking
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return safeOptions;
    
    return safeOptions.filter(option => {
      if (!option || !option.label) return false;
      
      const label = String(option.label).toLowerCase();
      const search = inputValue.toLowerCase();
      return label.includes(search);
    });
  }, [safeOptions, inputValue]);

  // IMPROVED: Select handler with null checking
  const handleSelect = (currentValue: string) => {
    const validValue = currentValue || "";
    setSelectedValue(validValue);
    setOpen(false);
    
    // Only call handlers if they exist
    if (validValue && onSelect) onSelect(validValue);
    if (validValue && onChange) onChange(validValue);
  };

  // IMPROVED: Input change handler with null checking
  const handleInputChange = (newValue: string) => {
    const validValue = newValue || "";
    setInputValue(validValue);
    if (onInputChange && validValue !== undefined) onInputChange(validValue);
  };

  // IMPROVED: Get display text for selected value with null checking
  const displayText = React.useMemo(() => {
    if (!selectedValue) return placeholder;
    
    const foundOption = safeOptions.find(option => option.value === selectedValue);
    return foundOption ? foundOption.label : selectedValue;
  }, [selectedValue, safeOptions, placeholder]);

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
        className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg" 
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
                <CommandItem
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
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
