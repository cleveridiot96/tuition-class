
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SalesFormHeaderProps {
  lotNumber: string;
  date: string;
  location: string;
  billNumber: string;
  billAmount: string;
  locations: string[];
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const SalesFormHeader: React.FC<SalesFormHeaderProps> = ({
  lotNumber,
  date,
  location,
  billNumber,
  billAmount,
  locations,
  onInputChange,
  onSelectChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      <div>
        <Label htmlFor="lotNumber">Lot Number</Label>
        <Input
          id="lotNumber"
          name="lotNumber"
          value={lotNumber}
          onChange={onInputChange}
          placeholder="Enter lot number"
          className="mt-1"
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
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Select 
          name="location"
          value={location}
          onValueChange={(value) => onSelectChange('location', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="billNumber">Bill Number</Label>
        <Input
          id="billNumber"
          name="billNumber"
          value={billNumber}
          onChange={onInputChange}
          placeholder="Enter bill number"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="billAmount">Bill Amount</Label>
        <Input
          id="billAmount"
          name="billAmount"
          type="number"
          value={billAmount}
          onChange={onInputChange}
          placeholder="Enter bill amount"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Enter if this is a cut bill</p>
      </div>
    </div>
  );
};

export default SalesFormHeader;
