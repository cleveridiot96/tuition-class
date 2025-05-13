
import React, { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectOption } from "./types";
import { useSafeContext } from "@/hooks/useSafeContext";
import { EnhancedSearchableSelectProps } from "./types";

export const EnhancedSearchableSelect = ({
  options = [],
  value,
  onValueChange,
  onAddNew,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  label,
  disabled = false,
  className,
  masterType,
}: EnhancedSearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get the selected option based on value
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const handleAddNew = () => {
    // ✅ Fixed: Check if onAddNew is a function before calling it
    if (typeof onAddNew === 'function') {
      onAddNew(searchTerm);
    }
    setOpen(false);
  };

  // Adjust button width when it's rendered
  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      const width = button.offsetWidth;
      // Any additional logic if needed
    }
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <div className="text-sm font-medium mb-1.5 text-gray-700">{label}</div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <span className="truncate">
              {selectedOption?.label || placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 max-h-[300px] overflow-auto"
          style={{ width: buttonRef.current?.offsetWidth }}
        >
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandEmpty className="py-2 px-2 text-sm text-center">
              <div className="flex flex-col gap-1.5">
                <span>{emptyMessage}</span>
                {typeof onAddNew === 'function' && searchTerm.trim() !== "" && (
                  <Button
                    size="sm"
                    className="mt-1 h-8 text-xs"
                    onClick={handleAddNew}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add "{searchTerm}"
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{option.label}</span>
                </div>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
