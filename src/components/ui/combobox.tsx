
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
  safeChildrenToArray,
  CommandErrorBoundary
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

/**
 * Enhanced Combobox with comprehensive error handling and fallback UI
 */
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

  // Handle clicks outside with robust error protection
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        if (
          popoverRef.current && 
          !popoverRef.current.contains(event.target as Node) && 
          open
        ) {
          setOpen(false);
        }
      } catch (error) {
        // Silent logging without UI disruption
        console.error("Error handling outside click in Combobox:", {
          error,
          timestamp: new Date().toISOString()
        });
        // Always ensure dropdown closes on error
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [open]);

  // Sync with external value changes safely
  React.useEffect(() => {
    try {
      setSelectedValue(value || "");
    } catch (error) {
      // Silent logging without UI errors
      console.error("Error syncing with external value in Combobox:", {
        error,
        value,
        timestamp: new Date().toISOString()
      });
    }
  }, [value]);

  // Ultra-safe select handler with error protection
  const handleSelect = React.useCallback((currentValue: string) => {
    try {
      setSelectedValue(currentValue);
      setOpen(false);
      if (onSelect) onSelect(currentValue);
      if (onChange) onChange(currentValue);
    } catch (error) {
      // Silent logging without UI disruption
      console.error("Error in combobox handleSelect:", {
        error,
        currentValue,
        timestamp: new Date().toISOString()
      });
    }
  }, [onSelect, onChange]);

  // Safe input change handler with error protection
  const handleInputChange = React.useCallback((newValue: string) => {
    try {
      setInputValue(newValue);
      if (onInputChange) onInputChange(newValue);
      
      // If input is cleared, also clear selection
      if (!newValue) {
        setSelectedValue("");
        if (onChange) onChange("");
      }
    } catch (error) {
      // Silent logging without UI disruption
      console.error("Error in combobox handleInputChange:", {
        error,
        newValue,
        timestamp: new Date().toISOString()
      });
    }
  }, [onInputChange, onChange]);

  // Ultra-safe options filtering with comprehensive error handling
  const filteredOptions = React.useMemo(() => {
    try {
      // Always ensure we have a valid array
      const safeOptions = Array.isArray(options) ? options : [];
      
      // Early return for efficiency
      if (!inputValue || safeOptions.length === 0) return safeOptions;
      
      // Safe filtering with null checks
      return safeOptions.filter(option => {
        if (!option) return false;
        
        const label = typeof option.label === 'string' ? option.label.toLowerCase() : '';
        const value = typeof option.value === 'string' ? option.value.toLowerCase() : '';
        const search = inputValue.toLowerCase();
        
        return label.includes(search) || value.includes(search);
      });
    } catch (error) {
      // Silent logging without UI disruption
      console.error("Error filtering options in Combobox:", {
        error,
        options,
        inputValue,
        timestamp: new Date().toISOString()
      });
      return []; // Safe fallback
    }
  }, [options, inputValue]);

  // Ultra-safe display text computation
  const displayText = React.useMemo(() => {
    try {
      if (!selectedValue) return placeholder;
      
      // Always ensure options is a valid array
      const safeOptions = Array.isArray(options) ? options : [];
      
      // Safe find with null checks
      const foundOption = safeOptions.find(option => 
        option && option.value === selectedValue
      );
      
      return foundOption ? foundOption.label : selectedValue;
    } catch (error) {
      // Silent logging without UI disruption
      console.error("Error finding display text in Combobox:", {
        error,
        selectedValue,
        options,
        timestamp: new Date().toISOString()
      });
      return placeholder; // Safe fallback
    }
  }, [selectedValue, options, placeholder]);

  // Safely render with comprehensive error boundaries
  return (
    <div ref={popoverRef}>
      <CommandErrorBoundary componentName="Combobox">
        <Popover 
          open={disabled ? false : open} 
          onOpenChange={disabled ? undefined : (isOpen) => {
            try {
              if (!disabled) {
                setOpen(isOpen);
              }
            } catch (error) {
              // Silent logging without UI disruption
              console.error("Error changing popover state in Combobox:", {
                error,
                isOpen,
                timestamp: new Date().toISOString()
              });
              setOpen(false); // Safe fallback
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("w-full justify-between", className)}
              disabled={disabled}
              onClick={(e) => {
                try {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!disabled) setOpen(!open);
                } catch (error) {
                  // Silent logging without UI disruption
                  console.error("Error handling button click in Combobox:", {
                    error,
                    timestamp: new Date().toISOString()
                  });
                }
              }}
            >
              <span className="truncate">{selectedValue ? displayText : placeholder}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[--radix-popover-trigger-width] p-0 z-[9999] shadow-lg bg-popover" 
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
                  filteredOptions.map((option) => 
                    option ? (
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
                  )
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </CommandErrorBoundary>
    </div>
  );
}
