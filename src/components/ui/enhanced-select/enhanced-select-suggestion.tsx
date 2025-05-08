
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnhancedSelectSuggestionProps {
  suggestedMatch: string | null;
  searchTerm: string;
  onUseSuggestion: () => void;
  onAddNewItem: () => void;
  masterType?: string;
  showAddOption: boolean;
}

export const EnhancedSelectSuggestion: React.FC<EnhancedSelectSuggestionProps> = ({
  suggestedMatch,
  searchTerm,
  onUseSuggestion,
  onAddNewItem,
  masterType = "item",
  showAddOption
}) => {
  // Skip rendering if there's no search term
  if (!searchTerm || typeof searchTerm !== 'string') {
    return <div className="py-6 text-center text-sm">Type to search...</div>;
  }

  return (
    <div className="p-2 text-sm">
      {suggestedMatch ? (
        <div className="flex flex-col gap-2">
          <p>Did you mean: </p>
          <Button
            variant="outline"
            className="justify-start text-left font-normal"
            onClick={onUseSuggestion}
          >
            {suggestedMatch}
          </Button>
        </div>
      ) : (
        <div>
          <p>No matches found for "{searchTerm}"</p>
          {showAddOption && (
            <Button
              variant="outline"
              className="mt-2 w-full justify-start"
              onClick={onAddNewItem}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add new {masterType}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
