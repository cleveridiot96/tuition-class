
import React from "react";
import { CommandItem } from "@/components/ui/command";
import { Plus } from "lucide-react";

export interface EnhancedSelectSuggestionProps {
  suggestedMatch: string | null;
  onUseSuggestion: () => void;
  searchTerm: string;
  onAddNewItem: () => void;
  masterType: string;
  showAddOption: boolean;
}

export const EnhancedSelectSuggestion: React.FC<EnhancedSelectSuggestionProps> = ({
  suggestedMatch,
  onUseSuggestion,
  searchTerm,
  onAddNewItem,
  masterType,
  showAddOption
}) => {
  return (
    <div className="p-2 text-sm">
      {suggestedMatch ? (
        <CommandItem
          value={suggestedMatch}
          onSelect={onUseSuggestion}
          className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-gray-100"
        >
          <span>Did you mean: <strong>{suggestedMatch}</strong>?</span>
        </CommandItem>
      ) : (
        <div>
          <p className="px-2 py-1.5 text-gray-500">No matching {masterType} found</p>
          {showAddOption && (
            <CommandItem
              value={`add-${searchTerm}`}
              onSelect={onAddNewItem}
              className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-gray-100"
            >
              <span className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add "{searchTerm}" as new {masterType}
              </span>
            </CommandItem>
          )}
        </div>
      )}
    </div>
  );
};
