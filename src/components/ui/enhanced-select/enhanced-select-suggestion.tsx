
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EnhancedSelectSuggestionProps } from "./types";

export const EnhancedSelectSuggestion: React.FC<EnhancedSelectSuggestionProps> = ({
  suggestedMatch,
  onUseSuggestion,
  searchTerm,
  onAddNewItem,
  masterType = "supplier",
  showAddOption = true,
}) => {
  const formattedMasterType = masterType.charAt(0).toUpperCase() + masterType.slice(1);
  
  // If there's a suggested match, show it as a suggestion
  if (suggestedMatch) {
    return (
      <div className="p-3 text-sm">
        <div className="mb-2 text-muted-foreground">
          Did you mean:
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal hover:bg-accent hover:text-accent-foreground"
          onClick={onUseSuggestion}
        >
          {suggestedMatch}
        </Button>
      </div>
    );
  }

  // If no search term or suggestions, show a standard message
  if (!searchTerm.trim()) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Type to search...
      </div>
    );
  }

  // If there's a search term but no match, show "No results" with add option
  return (
    <div className="p-3 text-center">
      <p className="py-2 text-sm text-muted-foreground">
        No match found for "{searchTerm}"
      </p>
      {showAddOption && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={onAddNewItem}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add "{searchTerm}" to {formattedMasterType} master
        </Button>
      )}
    </div>
  );
};
