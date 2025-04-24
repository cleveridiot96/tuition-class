
import React, { useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PurchaseQuantityDetailsProps {
  form: any;
  extractBagsFromLotNumber: (lotNumber: string) => number | null;
}

const PurchaseQuantityDetails: React.FC<PurchaseQuantityDetailsProps> = ({
  form,
  extractBagsFromLotNumber
}) => {
  // Handle the weight calculation when bags change
  const handleBagsChange = (value: number) => {
    form.setValue("bags", value);
    
    // Only auto-calculate weight if it hasn't been manually edited
    const currentWeight = form.getValues("netWeight");
    const autoCalculatedWeight = value * 50; // Default 50kg per bag
    
    // Check if the current weight matches the previous auto-calculated weight
    // or if it's 0/undefined, suggesting it hasn't been manually set
    if (!currentWeight) {
      form.setValue("netWeight", autoCalculatedWeight);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Quantity Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="bags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Bags</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    handleBagsChange(value);
                    field.onChange(value);
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
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
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                  // Allow manual override of weight
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate (₹/kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                  step="0.01" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PurchaseQuantityDetails;
