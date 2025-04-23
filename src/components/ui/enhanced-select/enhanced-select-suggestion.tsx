
import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnhancedSelectSuggestionProps {
  suggestedMatch: string | null;
  onUseSuggestion: () => void;
  searchTerm: string;
  onAddNewItem: () => void;
  masterType: string;
  showAddOption: boolean;
}

export const EnhancedSelectSuggestion = React.memo(({
  suggestedMatch,
  onUseSuggestion,
  searchTerm,
  onAddNewItem,
  masterType,
  showAddOption
}: EnhancedSelectSuggestionProps) => {
  return (
    <div className="py-6 text-center text-sm">
      {searchTerm.trim() ? (
        <div className="space-y-2 px-4">
          {suggestedMatch ? (
            <div className="space-y-2">
              <p>Did you mean?</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onUseSuggestion}
              >
                {suggestedMatch}
              </Button>
            </div>
          ) : (
            <p>"{searchTerm}" not found</p>
          )}
          {showAddOption && (
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={onAddNewItem}
            >
              <Plus className="h-4 w-4" />
              Add to {masterType} master
            </Button>
          )}
        </div>
      ) : (
        <p>No options available</p>
      )}
    </div>
  );
});

EnhancedSelectSuggestion.displayName = "EnhancedSelectSuggestion";
