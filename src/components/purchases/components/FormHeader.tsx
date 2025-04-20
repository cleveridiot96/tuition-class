
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

interface FormHeaderProps {
  lotNumber: string;
  date: string;
  location: string;
  locations: string[];
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  lotNumber,
  date,
  location,
  locations,
  onInputChange,
  onSelectChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      <div>
        <Label htmlFor="lotNumber">Lot Number (Vakkal)</Label>
        <Input
          id="lotNumber"
          name="lotNumber"
          value={lotNumber}
          onChange={onInputChange}
          placeholder="e.g. DD/12"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Format: Name/BagCount (e.g. DD/12 for 12 bags)</p>
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
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FormHeader;
