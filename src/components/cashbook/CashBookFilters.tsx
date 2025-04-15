
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Search } from "lucide-react";

interface CashBookFiltersProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  onFilterChange: () => void;
  onResetFilters: () => void;
}

const CashBookFilters = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onFilterChange,
  onResetFilters,
}: CashBookFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <DatePicker
          id="startDate"
          selected={startDate}
          onSelect={setStartDate}
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <DatePicker
          id="endDate"
          selected={endDate}
          onSelect={setEndDate}
          className="w-full"
        />
      </div>
      <div className="flex items-end gap-2">
        <Button onClick={onFilterChange} className="flex-grow">
          <Search size={16} className="mr-2" />
          Filter
        </Button>
        <Button variant="outline" onClick={onResetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CashBookFilters;
