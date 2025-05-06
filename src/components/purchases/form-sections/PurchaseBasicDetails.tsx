
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-select";

interface PurchaseBasicDetailsProps {
  form: any;
  locations: string[];
  formSubmitted?: boolean;
}

const PurchaseBasicDetails: React.FC<PurchaseBasicDetailsProps> = ({
  form,
  locations,
  formSubmitted = false,
}) => {
  const showErrors = formSubmitted || form.formState.isSubmitted;
  
  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Basic Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lotNumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Lot Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <EnhancedSearchableSelect
                  options={locations.map(location => ({ value: location, label: location }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select location"
                  className="w-full"
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PurchaseBasicDetails;
