
import React from "react";
import { EnhancedSelectSuggestionProps } from "./types";
import { Plus } from "lucide-react";

export const EnhancedSelectSuggestion: React.FC<EnhancedSelectSuggestionProps> = ({
  suggestedMatch,
  onUseSuggestion,
  searchTerm,
  onAddNewItem,
  masterType = "supplier",
  showAddOption = true
}) => {
  if (!searchTerm.trim()) {
    return (
      <div className="px-3 py-6 text-center text-sm text-gray-500">
        Type to search...
      </div>
    );
  }

  if (suggestedMatch) {
    return (
      <div className="px-3 py-2 text-sm">
        No exact matches. Did you mean:
        <button
          type="button"
          className="mx-1 font-medium underline cursor-pointer text-primary"
          onClick={onUseSuggestion}
        >
          {suggestedMatch}
        </button>?
      </div>
    );
  }

  return (
    <div className="px-3 py-6 text-center text-sm">
      {showAddOption ? (
        <div className="flex flex-col items-center gap-1">
          <div>No matches found</div>
          <button
            type="button"
            className="flex items-center justify-center gap-1 text-xs font-medium px-2 py-1 border rounded bg-primary/10 hover:bg-primary/20 border-primary/20"
            onClick={onAddNewItem}
          >
            <Plus className="h-3.5 w-3.5" />
            Add "{searchTerm}" to {masterType} master
          </button>
        </div>
      ) : (
        <div>No matches found</div>
      )}
    </div>
  );
};
