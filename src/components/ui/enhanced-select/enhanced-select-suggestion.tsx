
import React from "react";
import { Plus } from "lucide-react";
import { EnhancedSelectSuggestionProps } from "./types";

export const EnhancedSelectSuggestion: React.FC<EnhancedSelectSuggestionProps> = ({
  suggestedMatch,
  onUseSuggestion,
  searchTerm,
  onAddNewItem,
  masterType = "item",
  showAddOption,
}) => {
  if (!searchTerm) {
    return (
      <div className="py-6 text-center text-sm text-gray-500">
        Type to search...
      </div>
    );
  }

  return (
    <div className="py-2 px-1">
      {suggestedMatch ? (
        <div>
          <p className="px-2 pb-2 text-sm text-gray-500">
            Did you mean:
          </p>
          <div
            className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            onClick={onUseSuggestion}
          >
            {suggestedMatch}
          </div>
        </div>
      ) : (
        <p className="px-2 pb-2 text-sm text-gray-500">
          No results found
        </p>
      )}

      {showAddOption && (
        <div
          className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground border-t mt-2"
          onClick={onAddNewItem}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add "{searchTerm}" to {masterType} master
        </div>
      )}
    </div>
  );
};
