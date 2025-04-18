
import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

interface ComboboxProps {
  options: { value: string; label: string }[];
  value?: string;
  onSelect?: (value: string) => void;
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  onAddNew?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowAddNew?: boolean;
}

export function Combobox({
  options = [],
  value = "",
  onSelect,
  onChange,
  onInputChange,
  onAddNew,
  placeholder = "Select an option",
  className,
  disabled = false,
  allowAddNew = false
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(value || "");
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [newItemName, setNewItemName] = React.useState("");
  
  // Log options for debugging
  React.useEffect(() => {
    console.log("Combobox options:", options);
  }, [options]);
  
  // Sync with external value changes
  React.useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  // Ensure options is always an array of valid objects
  const safeOptions = React.useMemo(() => {
    try {
      if (!options) return [];
      
      if (!Array.isArray(options)) {
        console.warn('Combobox: options is not an array:', options);
        return [];
      }
      
      return options.filter(option => 
        option && 
        typeof option === 'object' && 
        'value' in option && 
        'label' in option
      );
    } catch (error) {
      console.error('Error in Combobox:', error);
      return [];
    }
  }, [options]);

  // Filter options based on input safely
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return safeOptions;
    
    try {
      return safeOptions.filter(option => {
        const label = String(option.label || '').toLowerCase();
        const optionValue = String(option.value || '').toLowerCase();
        const search = inputValue.toLowerCase();
        
        return label.includes(search) || optionValue.includes(search);
      });
    } catch (e) {
      return safeOptions;
    }
  }, [safeOptions, inputValue]);

  // Check if current input matches any existing option
  const inputMatchesOption = React.useMemo(() => {
    if (!inputValue) return false;
    
    return safeOptions.some(option => 
      option.label.toLowerCase() === inputValue.toLowerCase() ||
      option.value.toLowerCase() === inputValue.toLowerCase()
    );
  }, [safeOptions, inputValue]);

  // Select handler with error protection
  const handleSelect = (currentValue: string) => {
    try {
      setSelectedValue(currentValue);
      setOpen(false);
      if (onSelect) onSelect(currentValue);
      if (onChange) onChange(currentValue);
    } catch (e) {
      console.error("Error in select handler:", e);
    }
  };

  // Input change handler with error protection
  const handleInputChange = (newValue: string) => {
    try {
      setInputValue(newValue);
      if (onInputChange) onInputChange(newValue);
    } catch (e) {
      console.error("Error in input change handler:", e);
    }
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

  // Open add dialog with current input value
  const openAddDialog = () => {
    setNewItemName(inputValue);
    setShowAddDialog(true);
    setOpen(false);
  };

  // Get display text for selected value safely
  const displayText = React.useMemo(() => {
    if (!selectedValue) return placeholder;
    
    try {
      const foundOption = safeOptions.find(option => option.value === selectedValue);
      return foundOption ? foundOption.label : selectedValue;
    } catch (e) {
      return selectedValue || placeholder;
    }
  }, [selectedValue, safeOptions, placeholder]);

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
            className={cn("w-full justify-between bg-white", className)}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) setOpen(!open);
            }}
          >
            <span className="truncate">{displayText}</span>
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
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">
                {allowAddNew && inputValue.trim() ? (
                  <div className="space-y-2 px-4">
                    <p>No results found</p>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={openAddDialog}
                    >
                      <Plus className="h-4 w-4" />
                      Add "{inputValue}"
                    </Button>
                  </div>
                ) : (
                  "No results found."
                )}
              </div>
            ) : (
              <div>
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      selectedValue === option.value ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                ))}
                
                {/* Show add option if there's input and no exact match */}
                {allowAddNew && inputValue.trim() && !inputMatchesOption && (
                  <div
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground border-t"
                    onClick={openAddDialog}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add "{inputValue}"
                  </div>
                )}
              </div>
            )}
          </div>
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
