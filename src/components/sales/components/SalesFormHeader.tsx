
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SalesFormHeaderProps {
  lotNumber: string;
  date: string;
  location: string;
  locations: string[];
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const SalesFormHeader: React.FC<SalesFormHeaderProps> = ({
  lotNumber,
  date,
  location,
  locations,
  onInputChange,
  onSelectChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div>
        <Label htmlFor="lotNumber">Lot Number</Label>
        <Input
          id="lotNumber"
          name="lotNumber"
          value={lotNumber}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={date}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Select
          name="location"
          value={location}
          onValueChange={(value) => onSelectChange('location', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(location => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SalesFormHeader;
