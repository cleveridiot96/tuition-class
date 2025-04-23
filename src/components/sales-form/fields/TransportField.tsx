
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnhancedSearchableSelect } from '@/components/ui/enhanced-select';

export const TransportField = ({ form, options }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="transporterId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Transporter</FormLabel>
          <FormControl>
            <EnhancedSearchableSelect
              options={options}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select transporter"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="transportCost"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Transport Cost</FormLabel>
          <FormControl>
            <Input type="number" step="0.01" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);
