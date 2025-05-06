
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormHeaderProps } from '../../shared/types/PurchaseFormTypes';
import { FormRow } from "@/components/ui/form";

const FormHeader: React.FC<FormHeaderProps> = ({
  lotNumber,
  date,
  location,
  locations,
  onInputChange,
  onSelectChange
}) => {
  return (
    <FormRow>
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
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormRow>
  );
};

export default FormHeader;
