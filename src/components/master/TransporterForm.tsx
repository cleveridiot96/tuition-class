
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const transporterSchema = z.object({
  name: z.string().min(1, "Transporter name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  vehicleDetails: z.string().optional(),
});

type TransporterFormValues = z.infer<typeof transporterSchema>;

interface TransporterFormProps {
  onClose: () => void;
  initialData?: any;
}

const TransporterForm: React.FC<TransporterFormProps> = ({ onClose, initialData }) => {
  const form = useForm<TransporterFormValues>({
    resolver: zodResolver(transporterSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      vehicleDetails: initialData?.vehicleDetails || "",
    },
  });

  const onSubmit = (data: TransporterFormValues) => {
    // Placeholder for transporter form submission
    console.log("Transporter form data:", data);
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
              <FormLabel>Transporter Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Details</FormLabel>
              <FormControl>
                <Input {...field} />
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

export default TransporterForm;
