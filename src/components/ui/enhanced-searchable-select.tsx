
import React from "react";
import { SearchableSelect } from "./searchable-select";
import { useMasterData } from "@/hooks/useMasterData";
import { useGlobalMasterDialog } from "@/hooks/useGlobalMasterDialog";
import { MasterType } from "@/types/master.types";
import { SelectOption } from "./searchable-select/types";

interface EnhancedSearchableSelectProps {
  options?: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  masterType?: MasterType;
  onAddNew?: (value: string) => void;
}

export const EnhancedSearchableSelect: React.FC<EnhancedSearchableSelectProps> = ({
  options: providedOptions,
  value,
  onValueChange,
  placeholder,
  emptyMessage,
  label,
  disabled,
  className,
  masterType,
  onAddNew: externalAddNewHandler,
}) => {
  // Get master data and dialog functionality
  const { getByType, refresh } = useMasterData();
  const { open: openMasterDialog } = useGlobalMasterDialog();
  
  // Use provided options or get options based on masterType
  const options = providedOptions || (masterType ? getByType(masterType) : []);
  
  // Handler for adding new master data
  const handleAddNew = (name: string) => {
    // If external handler is provided, use it
    if (externalAddNewHandler) {
      return externalAddNewHandler(name);
    }

    if (!masterType) return;
    
    // Open the global master dialog with the new name prefilled
    openMasterDialog(masterType, name);
    
    // Refresh the master data
    setTimeout(() => {
      refresh();
    }, 500);
  };
  
  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      onAddNew={handleAddNew}
      placeholder={placeholder || `Select ${masterType || 'option'}`}
      emptyMessage={emptyMessage || "No results found."}
      disabled={disabled}
      className={className}
      masterType={masterType}
    />
  );
};
