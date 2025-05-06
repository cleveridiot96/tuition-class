
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";

interface LedgerFiltersProps {
  selectedParty: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  partyOptions: Array<{ value: string; label: string }>;
  onPartyChange: (partyId: string) => void;
  onDateChange: (field: "startDate" | "endDate", value: string) => void;
}

const LedgerFilters = ({
  selectedParty,
  dateRange,
  partyOptions,
  onPartyChange,
  onDateChange
}: LedgerFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:hidden">
      <div>
        <Label htmlFor="party-select">Select Party</Label>
        <EnhancedSearchableSelect
          options={partyOptions}
          value={selectedParty}
          onValueChange={onPartyChange}
          placeholder="Select a party"
          masterType="party"
        />
      </div>
      <div>
        <Label htmlFor="start-date">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={dateRange.startDate}
          onChange={(e) => onDateChange("startDate", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="end-date">End Date</Label>
        <Input
          id="end-date"
          type="date"
          value={dateRange.endDate}
          onChange={(e) => onDateChange("endDate", e.target.value)}
        />
      </div>
    </div>
  );
};

export default LedgerFilters;
