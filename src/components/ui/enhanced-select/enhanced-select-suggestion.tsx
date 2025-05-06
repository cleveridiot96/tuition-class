
import * as React from "react";
import { Plus } from "lucide-react";

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
        Start typing to search...
      </div>
    );
  }

  return (
    <div>
      {suggestedMatch ? (
        <div className="px-3 py-4 text-sm">
          <p>No exact match. Did you mean:</p>
          <div
            role="option"
            tabIndex={0}
            className="mt-1 cursor-pointer rounded-sm px-2 py-1.5 text-sm bg-accent text-accent-foreground hover:bg-accent/80 focus:bg-accent/80 outline-none"
            onClick={onUseSuggestion}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onUseSuggestion();
              }
            }}
          >
            {suggestedMatch}
          </div>
        </div>
      ) : (
        <div className="px-3 py-4 text-sm">
          <p>No matches found for "{searchTerm}"</p>
          
          {showAddOption && (
            <div
              role="option"
              tabIndex={0}
              className="mt-2 flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm bg-accent text-accent-foreground hover:bg-accent/80 focus:bg-accent/80 outline-none"
              onClick={onAddNewItem}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddNewItem();
                }
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add "{searchTerm}" to {masterType} master
            </div>
          )}
        </div>
      )}
    </div>
  );
};
