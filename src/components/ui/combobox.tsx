
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

  // Filter options based on input value
  const filteredOptions = React.useMemo(() => {
    // Ensure options is always an array
    const safeOptions = Array.isArray(options) ? options : [];
    
    if (!inputValue) return safeOptions;
    
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.value.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  // Find the display text
  const displayText = React.useMemo(() => {
    if (!selectedValue) return "";
    
    // Ensure options is always an array
    const safeOptions = Array.isArray(options) ? options : [];
    const foundOption = safeOptions.find((option) => option.value === selectedValue);
    
    return foundOption ? foundOption.label : selectedValue;
  }, [selectedValue, options]);

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
        className="w-[--radix-popover-trigger-width] p-0" 
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
            {Array.isArray(filteredOptions) && filteredOptions.map((option) => (
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
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
