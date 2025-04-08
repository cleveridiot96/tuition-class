
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
  options = [], // Ensure options has a default empty array
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

  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      setSelectedValue(value);
    } else {
      setSelectedValue("");
    }
  }, [value]);

  const handleSelect = (currentValue: string) => {
    if (currentValue) {
      setSelectedValue(currentValue);
      setOpen(false);
      if (onSelect) onSelect(currentValue);
      if (onChange) onChange(currentValue);
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (onInputChange) onInputChange(newValue);
    
    // If the input is cleared, also clear the selected value
    if (!newValue) {
      setSelectedValue("");
      if (onChange) onChange("");
    }
  };

  // Filter options based on input value - with additional safety checks
  const filteredOptions = React.useMemo(() => {
    // Ensure options is always a valid array
    const safeOptions = Array.isArray(options) ? options : [];
    
    // Early return if no input or empty options
    if (!inputValue || safeOptions.length === 0) return safeOptions;
    
    try {
      return safeOptions.filter(option => 
        option && 
        option.label && 
        option.value && 
        (option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.value.toLowerCase().includes(inputValue.toLowerCase()))
      );
    } catch (error) {
      console.error("Error filtering options:", error);
      return safeOptions; // Return all options if filtering fails
    }
  }, [options, inputValue]);

  // Find the display text with additional safety
  const displayText = React.useMemo(() => {
    if (!selectedValue) return "";
    
    // Ensure options is always a valid array
    const safeOptions = Array.isArray(options) ? options : [];
    
    try {
      const foundOption = safeOptions.find(option => option && option.value === selectedValue);
      return foundOption ? foundOption.label : selectedValue;
    } catch (error) {
      console.error("Error finding display text:", error);
      return selectedValue; // Fallback to selected value if lookup fails
    }
  }, [selectedValue, options]);

  // Safety check for if options is not iterable at all
  if (options === undefined || options === null) {
    return (
      <Button
        variant="outline"
        role="combobox"
        className={cn("w-full justify-between", className)}
        disabled={true}
      >
        No options available
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedValue ? displayText : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0 z-50 shadow-lg" 
        align="start"
        side="bottom"
        avoidCollisions
      >
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={`Search ${placeholder.toLowerCase()}...`} 
            value={inputValue}
            onValueChange={handleInputChange}
            className="h-9"
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {(filteredOptions || []).map((option) => 
              option && option.value ? (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label || option.value}
                </CommandItem>
              ) : null
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
