
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const brokerSchema = z.object({
  name: z.string().min(1, "Broker name is required"),
  commission: z.coerce.number().min(0, "Commission cannot be negative").optional(),
});

type BrokerFormValues = z.infer<typeof brokerSchema>;

interface BrokerFormProps {
  onClose: () => void;
  initialData?: any;
}

const BrokerForm: React.FC<BrokerFormProps> = ({ onClose, initialData }) => {
  const form = useForm<BrokerFormValues>({
    resolver: zodResolver(brokerSchema),
    defaultValues: {
      name: initialData?.name || "",
      commission: initialData?.commission || 1,
    },
  });

  const onSubmit = (data: BrokerFormValues) => {
    console.log("Broker form data:", data);
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broker Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default BrokerForm;
