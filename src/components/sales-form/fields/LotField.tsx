
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { EnhancedSearchableSelect } from '@/components/ui/enhanced-select';

export const LotField = ({ form, options, handleLotChange, initialData }) => (
  <FormField
    control={form.control}
    name="lotNumber"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Lot Number</FormLabel>
        <FormControl>
          <EnhancedSearchableSelect
            options={options}
            value={field.value}
            onValueChange={handleLotChange}
            placeholder="Select lot number"
            disabled={!!initialData}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
