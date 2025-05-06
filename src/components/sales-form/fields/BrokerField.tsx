
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

export const BrokerField = ({ form, options, handleBrokerChange, selectedBroker }) => (
  <div className="space-y-4">
    <FormField
      control={form.control}
      name="brokerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Broker</FormLabel>
          <FormControl>
            <EnhancedSearchableSelect
              options={options}
              value={field.value}
              onValueChange={handleBrokerChange}
              placeholder="Select broker"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="brokerageAmount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brokerage Amount</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              {...field}
              readOnly={!!selectedBroker}
            />
          </FormControl>
          {selectedBroker && (
            <div className="text-xs text-gray-500">
              Auto-calculated at {selectedBroker.commissionRate}%
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);
