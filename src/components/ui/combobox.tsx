
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
  options = [],
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

  // Ensure options is always an array of valid objects
  const safeOptions = React.useMemo(() => {
    if (!Array.isArray(options)) return [];
    
    return options.filter(option => 
      option && 
      typeof option === 'object' && 
      'value' in option && 
      'label' in option
    );
  }, [options]);

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return safeOptions;
    
    return safeOptions.filter(option => {
      const label = String(option.label).toLowerCase();
      const optionValue = String(option.value).toLowerCase();
      const search = inputValue.toLowerCase();
      
      return label.includes(search) || optionValue.includes(search);
    });
  }, [safeOptions, inputValue]);

  // Select handler
  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue);
    setOpen(false);
    if (onSelect) onSelect(currentValue);
    if (onChange) onChange(currentValue);
  };

  // Input change handler
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (onInputChange) onInputChange(newValue);
  };

  // Get display text for selected value
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
