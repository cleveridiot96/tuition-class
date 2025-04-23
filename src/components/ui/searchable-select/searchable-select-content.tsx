
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectOption } from "./types";

interface SearchableSelectContentProps {
  filteredOptions: SelectOption[];
  value?: string;
  handleSelect: (value: string) => void;
  emptyMessage: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder: string;
}

export function SearchableSelectContent({
  filteredOptions,
  value,
  handleSelect,
  emptyMessage,
  searchTerm,
  setSearchTerm,
  placeholder
}: SearchableSelectContentProps) {
  return (
    <div>
      <div className="flex items-center border-b px-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${placeholder.toLowerCase()}...`}
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <ScrollArea className="max-h-60">
        {filteredOptions.length === 0 ? (
          <div className="py-6 text-center text-sm">
            {emptyMessage}
          </div>
        ) : (
          <>
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === option.value ? "bg-accent text-accent-foreground" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option.value);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </div>
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
}
