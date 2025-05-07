
import React from "react";
import { Button } from "@/components/ui/button";

interface EnhancedSelectSuggestionProps {
  suggestedMatch: string | null;
  searchTerm: string;
  onUseSuggestion: () => void;
  onAddNewItem: () => void;
  masterType: string;
  showAddOption: boolean;
}

export const EnhancedSelectSuggestion: React.FC<EnhancedSelectSuggestionProps> = ({
  suggestedMatch,
  searchTerm,
  onUseSuggestion,
  onAddNewItem,
  masterType,
  showAddOption
}) => {
  if (suggestedMatch) {
    return (
      <div className="p-2 text-sm">
        <p>Did you mean: <strong>{suggestedMatch}</strong>?</p>
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onUseSuggestion}
            className="text-xs"
          >
            Use Suggestion
          </Button>
          {showAddOption && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onAddNewItem}
              className="text-xs"
            >
              Add New {masterType}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 text-sm">
      <p>No matches found for: <strong>{searchTerm}</strong></p>
      {showAddOption && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onAddNewItem}
          className="mt-2 text-xs"
        >
          Add New {masterType}
        </Button>
      )}
    </div>
  );
};
