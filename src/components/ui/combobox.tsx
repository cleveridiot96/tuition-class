
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
  options = [], // Always ensure options has a default
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
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Handle clicks outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) && 
        open
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [open]);

  // Sync with external value changes
  React.useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

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
    
    // If input is cleared, also clear selection
    if (!newValue) {
      setSelectedValue("");
      if (onChange) onChange("");
    }
  };

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    // Ensure options is an array
    const safeOptions = Array.isArray(options) ? options : [];
    
    if (!inputValue || safeOptions.length === 0) return safeOptions;
    
    return safeOptions.filter(option => {
      if (!option) return false;
      
      const label = typeof option.label === 'string' ? option.label.toLowerCase() : '';
      const optionValue = typeof option.value === 'string' ? option.value.toLowerCase() : '';
      const search = inputValue.toLowerCase();
      
      return label.includes(search) || optionValue.includes(search);
    });
  }, [options, inputValue]);

  // Get display text for selected value
  const displayText = React.useMemo(() => {
    if (!selectedValue) return placeholder;
    
    const foundOption = options.find(option => option && option.value === selectedValue);
    return foundOption ? foundOption.label : selectedValue;
  }, [selectedValue, options, placeholder]);

  return (
    <div ref={popoverRef}>
      <Popover 
        open={disabled ? false : open} 
        onOpenChange={disabled ? undefined : setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled) setOpen(!open);
            }}
          >
            <span className="truncate">{selectedValue ? displayText : placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[--radix-popover-trigger-width] p-0 z-[9999] bg-white shadow-lg" 
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
            <CommandGroup>
              {filteredOptions.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
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
                ))
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
