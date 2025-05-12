
import React from "react";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MasterType } from "@/types/master.types";

interface EnhancedSelectSuggestionProps {
  suggestedMatch: string | null;
  onUseSuggestion: () => void;
  searchTerm: string;
  onAddNewItem: () => void;
  showAddOption: boolean;
  masterType?: string;
}

export function EnhancedSelectSuggestion({
  suggestedMatch,
  onUseSuggestion,
  searchTerm,
  onAddNewItem,
  showAddOption,
  masterType = "item"
}: EnhancedSelectSuggestionProps) {
  if (suggestedMatch) {
    return (
      <div className="p-4 text-center">
        <div className="text-sm text-gray-500">
          Did you mean <span className="font-medium">{suggestedMatch}</span>?
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 h-8"
          onClick={onUseSuggestion}
        >
          Use suggestion <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (showAddOption && searchTerm) {
    return (
      <div className="p-4 text-center">
        <div className="text-sm text-gray-500">
          No results for "{searchTerm}"
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 h-8 text-blue-600 hover:text-blue-700" 
          onClick={onAddNewItem}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add "{searchTerm}" to {masterType} master
        </Button>
      </div>
    );
  }

  return (
    <div className="py-6 text-center text-sm text-gray-500">
      No results found
    </div>
  );
}
