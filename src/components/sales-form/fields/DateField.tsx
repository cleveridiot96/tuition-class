
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const DateField = ({ form }) => (
  <FormField
    control={form.control}
    name="date"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Date</FormLabel>
        <FormControl>
          <Input type="date" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
