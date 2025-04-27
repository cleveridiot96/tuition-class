
import * as React from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedSelectSuggestionProps {
  suggestedMatch: string | null;
  searchTerm: string;
  onUseSuggestion: () => void;
  onAddNewItem?: () => void;
  showAddOption: boolean;
  masterType: string;
}

export const EnhancedSelectSuggestion = React.memo(({
  suggestedMatch,
  searchTerm,
  onUseSuggestion,
  onAddNewItem,
  showAddOption,
  masterType
}: EnhancedSelectSuggestionProps) => {
  if (suggestedMatch) {
    return (
      <div className="px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Did you mean: 
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal mt-1"
          onClick={onUseSuggestion}
        >
          <Check className="mr-2 h-4 w-4 text-green-500" />
          {suggestedMatch}
        </Button>
        
        {showAddOption && searchTerm.trim() && (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal mt-1"
            onClick={onAddNewItem}
          >
            <Plus className="mr-2 h-4 w-4 text-blue-500" />
            Add "{searchTerm}"
          </Button>
        )}
      </div>
    );
  }
  
  if (!suggestedMatch && searchTerm.trim() && showAddOption) {
    return (
      <div className="px-2 py-4">
        <div className="text-sm text-muted-foreground">
          No matches found
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal mt-1"
          onClick={onAddNewItem}
        >
          <Plus className="mr-2 h-4 w-4 text-blue-500" />
          Add "{searchTerm}" as new {masterType}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 text-sm text-muted-foreground text-center">
      No results found
    </div>
  );
});

EnhancedSelectSuggestion.displayName = "EnhancedSelectSuggestion";
