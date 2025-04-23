
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchableSelectContent } from "./searchable-select-content";
import { useSearchableSelect } from "./use-searchable-select";
import type { SearchableSelectProps } from "./types";

export { type SelectOption } from "./types";

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    selectedOption
  } = useSearchableSelect(options, value);

  const handleSelect = React.useCallback((currentValue: string) => {
    try {
      onValueChange(currentValue);
      setOpen(false);
      setSearchTerm("");
    } catch (e) {
      console.error("Error in select handler:", e);
    }
  }, [onValueChange, setOpen, setSearchTerm]);

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
          className={cn(
            "w-full justify-between bg-white",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) setOpen(!open);
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg z-[9999]" 
        align="start"
        side="bottom"
        sideOffset={4}
        style={{ pointerEvents: 'auto' }}
      >
        <SearchableSelectContent 
          filteredOptions={filteredOptions}
          value={value}
          handleSelect={handleSelect}
          emptyMessage={emptyMessage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={placeholder}
        />
      </PopoverContent>
    </Popover>
  );
}
