
import React from "react";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassmorphismButton } from "@/components/ui/glassmorphism-button";

const transporterSchema = z.object({
  name: z.string().min(1, "Transporter name is required"),
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
      vehicleDetails: initialData?.vehicleDetails || "",
    },
  });

  const onSubmit = (data: TransporterFormValues) => {
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
          <GlassmorphismButton type="button" variant="blue" onClick={onClose}>Cancel</GlassmorphismButton>
          <GlassmorphismButton type="submit" variant="green">Save</GlassmorphismButton>
        </div>
      </form>
    </Form>
  );
};

export default TransporterForm;
