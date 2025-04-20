
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationSelectorProps {
  form: any;
  locations?: string[];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ form, locations = ['Mumbai', 'Chiplun', 'Sawantwadi'] }) => {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default LocationSelector;
