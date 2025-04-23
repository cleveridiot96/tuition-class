
import React from "react";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Broker } from "@/services/types";
import { GlassmorphismButton } from "@/components/ui/glassmorphism-button";

const brokerSchema = z.object({
  name: z.string().min(1, "Broker name is required"),
  commissionRate: z.coerce.number().min(0, "Commission cannot be negative").optional(),
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
      commissionRate: initialData?.commissionRate || 1,
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
          name="commissionRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission (%)</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="0.01" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <GlassmorphismButton type="button" variant="blue" onClick={onClose}>Cancel</GlassmorphismButton>
          <GlassmorphismButton type="submit" variant="orange">Save</GlassmorphismButton>
        </div>
      </form>
    </Form>
  );
};

export default BrokerForm;
