
import React from "react";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassmorphismButton } from "@/components/ui/glassmorphism-button";

const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onClose: () => void;
  initialData?: any;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onClose, initialData }) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    console.log("Customer form data:", data);
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
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <GlassmorphismButton type="button" variant="blue" onClick={onClose}>Cancel</GlassmorphismButton>
          <GlassmorphismButton type="submit" variant="purple">Save</GlassmorphismButton>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
