
import { useState, useCallback, useEffect, useRef } from "react";
import { CheckIcon, ChevronsUpDown, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MasterType } from "@/types/master.types";
import { useAddToMaster } from "@/hooks/useAddToMaster";

export interface Option {
  value: string;
  label: string;
}

interface EnhancedSearchableSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  masterType?: MasterType;
  onAddNew?: (value: string) => string;
}

export function EnhancedSearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
  masterType,
  onAddNew,
}: EnhancedSearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Find the option that matches the current value
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    // Reset input value when popover closes
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      onValueChange(currentValue === value ? "" : currentValue);
      setOpen(false);
    },
    [value, onValueChange]
  );

  const handleInputChange = useCallback((newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  const handleAddNewItem = useCallback(() => {
    if (!inputValue.trim()) return;
    
    if (masterType) {
      // Use Add to Master dialog with type awareness
      confirmAddToMaster(inputValue, (newValue) => {
        if (newValue) {
          onValueChange(newValue);
          setOpen(false);
        }
      }, masterType);
    } else if (onAddNew) {
      // Use direct onAddNew function if provided
      const newValue = onAddNew(inputValue);
      if (newValue) {
        onValueChange(newValue);
        setOpen(false);
      }
    }
  }, [inputValue, masterType, confirmAddToMaster, onValueChange, onAddNew]);

  // Filter options based on input
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Determine if we should show the "Add new item" button
  const shouldShowAddNew = Boolean(
    (masterType || onAddNew) && 
    inputValue && 
    !options.some(option => 
      option.label.toLowerCase() === inputValue.toLowerCase()
    )
  );

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
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
            onClick={() => setOpen(!open)}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 w-full min-w-[200px] max-w-[400px] bg-white" 
          ref={popoverRef}
        >
          <Command>
            <CommandInput 
              placeholder="Search..." 
              value={inputValue}
              onValueChange={handleInputChange}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue ? "No match found." : "No options available."}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              {shouldShowAddNew && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleAddNewItem}
                      className="text-blue-600 cursor-pointer"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add "{inputValue}"
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <AddToMasterDialog />
    </div>
  );
}
