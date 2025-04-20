
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: { value: string; label: string; }[];
}

interface NewPurchaseFormProps {
  onSubmit: (data: any) => void;
  fields: FormField[];
  initialData?: any;
  agents: any[];
  suppliers: any[];
  transporters: any[];
  brokers: any[];
}

const NewPurchaseForm = ({
  onSubmit,
  fields,
  initialData,
  agents,
  suppliers,
  transporters,
  brokers
}: NewPurchaseFormProps) => {
  const [formData, setFormData] = React.useState(initialData || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <Label>{field.label}</Label>
          {field.type === 'select' ? (
            <Select 
              value={formData[field.name] || ''} 
              onValueChange={(value) => handleChange(field.name, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
        </div>
      ))}
      <Button type="submit" className="w-full">
        {initialData ? 'Update' : 'Add'} Purchase
      </Button>
    </form>
  );
};

export default NewPurchaseForm;
