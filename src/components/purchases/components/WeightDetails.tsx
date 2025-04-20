
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface WeightDetailsProps {
  form: any;
}

const WeightDetails: React.FC<WeightDetailsProps> = ({ form }) => {
  // Extract bags from lot number whenever lot number changes
  useEffect(() => {
    const subscription = form.watch((value: any, { name }: { name: string }) => {
      if (name === 'lotNumber') {
        extractBagsFromLotNumber(value.lotNumber || '');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Function to extract bags from lot number
  const extractBagsFromLotNumber = (lotNumber: string) => {
    const match = lotNumber.match(/[\/\\](\d+)/);
    if (match && match[1]) {
      const bags = parseInt(match[1], 10);
      if (!isNaN(bags)) {
        form.setValue('bags', bags);
      }
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="bags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bags</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  // Trigger net weight recalculation when bags change
                  form.trigger('netWeight');
                }}
              />
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
              <Input 
                type="number" 
                step="0.01" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  // Trigger calculations when net weight changes
                  form.trigger('rate');
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default WeightDetails;
