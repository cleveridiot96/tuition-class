
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onAddNew?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  allowAddNew?: boolean;
}

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  onAddNew,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  label,
  disabled = false,
  className,
  allowAddNew = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [newItemName, setNewItemName] = React.useState("");

  // Ensure options is always an array of valid objects and log for debugging
  const safeOptions = React.useMemo(() => {
    try {
      console.log("SearchableSelect options:", options);
      
      if (!options) return [];
      
      if (!Array.isArray(options)) {
        console.warn('SearchableSelect: options is not an array:', options);
        return [];
      }
      
      // Filter out any invalid options
      return options.filter(option => 
        option && 
        typeof option === 'object' &&
        'value' in option &&
        'label' in option
      );
    } catch (error) {
      console.error('Error in SearchableSelect:', error);
      return [];
    }
  }, [options]);

  // Reset search term when closed
  React.useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  // Ensure options is always an array
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return safeOptions;
    
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeOptions, searchTerm]);

  // Check if current input matches any existing option
  const inputMatchesOption = React.useMemo(() => {
    if (!searchTerm) return false;
    
    return safeOptions.some(option => 
      option.label.toLowerCase() === searchTerm.toLowerCase() ||
      option.value.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [safeOptions, searchTerm]);

  // Find the selected option safely
  const selectedOption = React.useMemo(() => {
    try {
      return safeOptions.find(option => option.value === value);
    } catch (e) {
      return undefined;
    }
  }, [safeOptions, value]);

  // Handle selection with error protection
  const handleSelect = React.useCallback((currentValue: string) => {
    try {
      onValueChange(currentValue);
      setOpen(false);
      setSearchTerm("");
    } catch (e) {
      console.error("Error in select handler:", e);
    }
  }, [onValueChange]);

  // Open add dialog with current input value
  const openAddDialog = () => {
    setNewItemName(searchTerm);
    setShowAddDialog(true);
    setOpen(false);
  };

  // Handle adding a new item
  const handleAddNewItem = () => {
    try {
      if (newItemName.trim() && onAddNew) {
        onAddNew(newItemName.trim());
        setShowAddDialog(false);
        setNewItemName("");
      }
    } catch (e) {
      console.error("Error adding new item:", e);
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
          <div className="flex items-center border-b px-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ScrollArea className="max-h-60">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">
                {allowAddNew && searchTerm.trim() ? (
                  <div className="space-y-2 px-4">
                    <p>No results found</p>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={openAddDialog}
                    >
                      <Plus className="h-4 w-4" />
                      Add "{searchTerm}"
                    </Button>
                  </div>
                ) : (
                  emptyMessage
                )}
              </div>
            ) : (
              <>
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === option.value ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
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
                {allowAddNew && searchTerm.trim() && !inputMatchesOption && (
                  <div
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground border-t"
                    onClick={openAddDialog}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add "{searchTerm}"
                  </div>
                )}
              </>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Dialog to add new item */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddNewItem}
              disabled={!newItemName.trim()}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
