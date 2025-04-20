
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PurchaseDetailsProps } from "../types/PurchaseTypes";

const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({ form, locations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bags</FormLabel>
            <FormControl>
              <Input type="number" {...field} placeholder="0" />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="netWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Net Weight (kg)</FormLabel>
            <FormControl>
              <Input type="number" {...field} placeholder="0.00" />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate per kg (₹)</FormLabel>
            <FormControl>
              <Input type="number" {...field} placeholder="0.00" step="0.01" />
            </FormControl>
          </FormItem>
        )}
      />
      
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
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
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
    </div>
  );
};

export default PurchaseDetails;
