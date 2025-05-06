
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  onClose: () => void;
  initialData?: any;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onClose, initialData }) => {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const onSubmit = (data: SupplierFormValues) => {
    console.log("Supplier form data:", data);
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
              <FormLabel>Supplier Name</FormLabel>
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

export default SupplierForm;
