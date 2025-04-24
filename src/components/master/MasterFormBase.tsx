
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

// Base schema that only requires name
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  contactPerson: z.string().optional(),
  gstNumber: z.string().optional(),
  notes: z.string().optional(),
});

export interface MasterFormBaseProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  initialData?: any;
  children?: React.ReactNode;
  submitButtonText?: string;
  additionalSchema?: Record<string, any>;
}

const MasterFormBase: React.FC<MasterFormBaseProps> = ({
  onSubmit,
  onClose,
  initialData,
  children,
  submitButtonText = "Save",
  additionalSchema = {},
}) => {
  // Create a complete schema by merging the base schema with any additional fields
  const completeSchema = baseSchema.extend(additionalSchema);
  
  const form = useForm({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      contactPerson: initialData?.contactPerson || "",
      gstNumber: initialData?.gstNumber || "",
      notes: initialData?.notes || "",
      ...Object.keys(additionalSchema).reduce((acc, key) => {
        acc[key] = initialData?.[key] || "";
        return acc;
      }, {} as Record<string, any>),
    },
  });

  const handleSubmit = (data: any) => {
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {children}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MasterFormBase;
