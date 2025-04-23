
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

interface NewEntityFormProps {
  onSubmit: (data: any) => void;
  fields: Field[];
  initialData?: any;
}

// Helper function to safely handle form schema creation
const createSafeFormSchema = (fields: Field[]) => {
  try {
    if (!Array.isArray(fields) || fields.length === 0) {
      console.warn('Invalid or empty fields array provided to createSafeFormSchema');
      // Return a simple empty schema to prevent crashes
      return z.object({});
    }
    
    return z.object(
      fields.reduce((acc, field) => {
        let validator: any;
        
        if (field.type === 'text') {
          validator = field.required ? 
            z.string().min(1, `${field.label} is required`) :
            z.string().optional();
        } else if (field.type === 'number') {
          validator = field.required ?
            z.coerce.number().min(0, `${field.label} must be a valid number`) :
            z.coerce.number().min(0).optional();
        } else {
          validator = z.any();
        }
        
        return { ...acc, [field.name]: validator };
      }, {} as Record<string, any>)
    );
  } catch (error) {
    console.error('Error creating form schema:', error);
    // Return a safe fallback schema
    return z.object({});
  }
};

// Helper function to safely get default values
const getSafeDefaultValues = (fields: Field[], initialData?: any) => {
  try {
    if (!Array.isArray(fields)) {
      console.warn('Invalid fields array provided to getSafeDefaultValues');
      return {};
    }
    
    return fields.reduce((acc, field) => {
      let defaultValue: any = '';
      
      if (initialData && field.name in initialData) {
        defaultValue = initialData[field.name];
      } else if (field.type === 'number') {
        defaultValue = 0;
      }
      
      return { ...acc, [field.name]: defaultValue };
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Error getting default values:', error);
    return {};
  }
};

const NewEntityForm = ({ onSubmit, fields, initialData }: NewEntityFormProps) => {
  // Safely create form schema and default values
  const formSchema = createSafeFormSchema(fields);
  const defaultValues = getSafeDefaultValues(fields, initialData);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: any) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      // You could add error handling UI here
    }
  };

  // Fallback if fields is invalid
  if (!Array.isArray(fields) || fields.length === 0) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded">
        <p className="text-yellow-800">No form fields provided. Please try again.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    step={field.type === 'number' ? '0.01' : undefined}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end">
          <Button type="submit">
            {initialData ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewEntityForm;
