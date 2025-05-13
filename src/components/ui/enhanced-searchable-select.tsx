
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
  label?: string;
  disabled?: boolean;
  className?: string;
  masterType?: MasterType;
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
}) => {
  // Get master data and dialog functionality
  const { getByType, refresh } = useMasterData();
  const { open: openMasterDialog } = useGlobalMasterDialog();
  
  // Use provided options or get options based on masterType
  const options = providedOptions || (masterType ? getByType(masterType) : []);
  
  // Handler for adding new master data
  const handleAddNew = (name: string) => {
    if (!masterType) return;
    
    // Open the global master dialog with the new name prefilled
    openMasterDialog({
      itemName: name,
      masterType,
      onConfirm: (name) => {
        // After confirming, refresh the master data
        refresh();
      }
    });
  };
  
  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      onAddNew={masterType ? handleAddNew : undefined}
      placeholder={placeholder || `Select ${masterType || 'option'}`}
      emptyMessage={emptyMessage || "No results found."}
      label={label}
      disabled={disabled}
      className={className}
      masterType={masterType}
    />
  );
};
