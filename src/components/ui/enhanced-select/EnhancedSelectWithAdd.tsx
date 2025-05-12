
import React from "react";
import { Command, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGlobalMasterDialog } from "@/context/GlobalMasterDialogContext";
import { MasterType } from "@/types/master.types";
import { EnhancedSelectOption } from "./enhanced-select-option";
import { EnhancedSelectSuggestion } from "./enhanced-select-suggestion";
import { useEnhancedSelect } from "./use-enhanced-select";
import { SelectOption } from "./types";

interface EnhancedSelectWithAddProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  masterType: MasterType;
}

export function EnhancedSelectWithAdd({
  options = [],
  value,
  onValueChange,
  placeholder = "Search...",
  emptyMessage = "No results found",
  label,
  disabled = false,
  className = "",
  masterType
}: EnhancedSelectWithAddProps) {
  const { open, handleAddMaster } = useGlobalMasterDialog();
  
  const {
    open: isOpen,
    setOpen,
    searchTerm,
    setSearchTerm,
    selectedOption,
    filteredOptions,
    suggestedMatch,
    inputMatchesOption
  } = useEnhancedSelect(options, value || '');
  
  const handleAddNewItem = () => {
    if (searchTerm) {
      open(masterType, searchTerm);
      handleAddMaster((id, name) => {
        // This callback will be called after successfully adding the new master
        if (onValueChange) {
          onValueChange(id);
        }
      });
    }
  };
  
  const handleUseSuggestion = () => {
    if (suggestedMatch && options.length > 0) {
      try {
        const option = options.find(opt => 
          opt && opt.label && opt.label.toLowerCase() === suggestedMatch.toLowerCase()
        );
        if (option) {
          onValueChange(option.value);
          setOpen(false);
        }
      } catch (error) {
        console.error("Error using suggestion:", error);
      }
    }
  };
  
  const showAddOption = searchTerm && !inputMatchesOption;
  
  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => open(masterType)}
            className="h-6 px-2 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      )}
      <Command
        className="border rounded-md overflow-visible bg-transparent"
        shouldFilter={false}
      >
        <CommandInput
          value={searchTerm || ''}
          onValueChange={setSearchTerm}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="focus:outline-none border-none focus:ring-0 p-2"
          disabled={disabled}
        />
        {isOpen && (
          <CommandList className="absolute top-full left-0 w-full z-50 bg-white shadow-lg rounded-md border mt-1 max-h-60 overflow-auto">
            <CommandEmpty>
              <EnhancedSelectSuggestion
                suggestedMatch={suggestedMatch}
                onUseSuggestion={handleUseSuggestion}
                searchTerm={searchTerm || ''}
                onAddNewItem={handleAddNewItem}
                masterType={masterType}
                showAddOption={showAddOption}
              />
            </CommandEmpty>
            
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <EnhancedSelectOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  isSelected={value === option.value}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  onKeyDown={() => {}}
                  index={index}
                />
              ))
            ) : (
              <div className="py-2 px-4 text-sm text-gray-500">
                {searchTerm ? `No results for "${searchTerm}"` : emptyMessage}
              </div>
            )}
            
            {showAddOption && (
              <div 
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t"
                onClick={handleAddNewItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add "{searchTerm}" to {masterType} master
              </div>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
