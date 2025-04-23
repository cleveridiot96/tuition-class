
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Transporter } from '@/services/types';
import { GlassmorphismButton } from '@/components/ui/glassmorphism-button';

interface TransporterFormProps {
  onTransporterAdded: (transporter: Transporter) => void;
  onCancel: () => void;
  initialValues?: Partial<Transporter>;
}

const TransporterForm: React.FC<TransporterFormProps> = ({ onTransporterAdded, onCancel, initialValues }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    vehicleDetails: initialValues?.vehicleDetails || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Transporter name is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const newTransporter: Transporter = {
        id: initialValues?.id || uuidv4(),
        name: formData.name.trim(),
        vehicleDetails: formData.vehicleDetails,
        balance: initialValues?.balance || 0,
      };

      onTransporterAdded(newTransporter);
      
      toast({
        title: "Success",
        description: initialValues ? "Transporter updated successfully" : "Transporter added successfully",
      });
    } catch (error) {
      console.error("Error adding transporter:", error);
      toast({
        title: "Error",
        description: "Failed to save transporter",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Transporter Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter transporter name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vehicleDetails">Vehicle Details</Label>
        <textarea
          id="vehicleDetails"
          name="vehicleDetails"
          value={formData.vehicleDetails}
          onChange={handleChange}
          placeholder="Enter vehicle details (optional)"
          className="w-full min-h-[80px] p-2 border rounded-md"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <GlassmorphismButton type="button" variant="blue" onClick={onCancel}>
          Cancel
        </GlassmorphismButton>
        <GlassmorphismButton type="submit" variant="green" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialValues ? "Update Transporter" : "Add Transporter"}
        </GlassmorphismButton>
      </div>
    </form>
  );
};

export default TransporterForm;
