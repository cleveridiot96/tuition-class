
import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAddToMaster } from "@/hooks/useAddToMaster";

export interface SelectOption {
  value: string;
  label: string;
}

interface EnhancedSearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  masterType?: string;
}

export function EnhancedSearchableSelect({
  options = [],
  value,
  onValueChange,
  onAddNew,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  label,
  disabled = false,
  className,
  masterType = "item"
}: EnhancedSearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();

  // Reset search term when closed
  React.useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  // Ensure options is always an array
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Check if current input matches any existing option
  const inputMatchesOption = React.useMemo(() => {
    if (!searchTerm) return false;
    
    return options.some(option => 
      option.label.toLowerCase() === searchTerm.toLowerCase() ||
      option.value.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [options, searchTerm]);

  // Find the selected option
  const selectedOption = options.find(option => option.value === value);

  // Handle selection
  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue);
    setOpen(false);
    setSearchTerm("");
  };

  // Handle adding new item
  const handleAddNewItem = () => {
    if (searchTerm.trim() && !inputMatchesOption && onAddNew) {
      confirmAddToMaster(searchTerm.trim(), (confirmedValue) => {
        onAddNew(confirmedValue);
        // Auto-select the newly added item
        onValueChange(confirmedValue);
      });
    }
  };

  // Handle input blur to show confirmation dialog
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    
    // If clicking outside the dropdown and not on an option
    if (searchTerm && !inputMatchesOption && onAddNew && 
       (!relatedTarget || !relatedTarget.closest('[role="listbox"]'))) {
      setTimeout(() => {
        if (open) {
          handleAddNewItem();
        }
      }, 100);
    }
  };

  return (
    <>
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
            onClick={() => !disabled && setOpen(!open)}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[--radix-popover-trigger-width] p-0 bg-white shadow-lg z-[9999]" 
          align="start"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex items-center border-b px-3">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={handleInputBlur}
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ScrollArea className="max-h-60">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">
                {searchTerm.trim() ? (
                  <div className="space-y-2 px-4">
                    <p>"{searchTerm}" not found</p>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleAddNewItem}
                    >
                      <Plus className="h-4 w-4" />
                      Add to {masterType} master?
                    </Button>
                  </div>
                ) : (
                  emptyMessage
                )}
              </div>
            ) : (
              <div role="listbox">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === option.value ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                ))}

                {/* Show add option if there's input and no exact match */}
                {searchTerm.trim() && !inputMatchesOption && (
                  <div
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground border-t"
                    onClick={handleAddNewItem}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add "{searchTerm}" to {masterType} master?
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Add to Master Confirmation Dialog */}
      <AddToMasterDialog />
    </>
  );
}
