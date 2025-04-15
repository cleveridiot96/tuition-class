
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
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options = [],
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

  // Always ensure options is an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return safeOptions;
    
    return safeOptions.filter(option => {
      if (!option || typeof option !== 'object') return false;
      
      const label = (option.label || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      return label.includes(search);
    });
  }, [safeOptions, searchTerm]);
  
  const selectedOption = safeOptions.find((option) => option?.value === value);

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
        className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg" 
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
          {filteredOptions.length === 0 ? (
            <CommandEmpty>{emptyMessage}</CommandEmpty>
          ) : (
            <ScrollArea className="max-h-60">
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
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
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
