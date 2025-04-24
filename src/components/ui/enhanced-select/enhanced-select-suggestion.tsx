
import React from "react";
import { Plus, AlertCircle } from "lucide-react";

interface EnhancedSelectSuggestionProps {
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
  if (!searchTerm) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Type to search...
      </div>
    );
  }

  return (
    <div className="p-2">
      {suggestedMatch ? (
        <div className="p-2 text-sm">
          <p className="mb-2">Did you mean:</p>
          <div
            className="flex items-center px-3 py-2 rounded-sm cursor-pointer hover:bg-accent"
            onClick={onUseSuggestion}
          >
            <span className="ml-2">{suggestedMatch}</span>
          </div>
        </div>
      ) : searchTerm.length > 0 && showAddOption ? (
        <div
          className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
          onClick={onAddNewItem}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add "{searchTerm}" to {masterType} master
        </div>
      ) : (
        <div className="flex items-center gap-2 py-6 text-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>No results found.</span>
        </div>
      )}
    </div>
  );
};
