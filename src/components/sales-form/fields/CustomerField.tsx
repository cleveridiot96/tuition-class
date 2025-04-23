
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { EnhancedSearchableSelect } from '@/components/ui/enhanced-select';

export const CustomerField = ({ form, options }) => (
  <FormField
    control={form.control}
    name="customerId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Customer</FormLabel>
        <FormControl>
          <EnhancedSearchableSelect
            options={options}
            value={field.value}
            onValueChange={field.onChange}
            placeholder="Select customer"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
