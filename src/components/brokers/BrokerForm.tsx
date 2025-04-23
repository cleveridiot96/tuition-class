
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Broker } from "@/services/types";

const formSchema = z.object({
  name: z.string().min(1, "Broker name is required"),
  commissionRate: z.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BrokerFormProps {
  onBrokerAdded: (broker: Broker) => void;
  onCancel: () => void;
  initialData?: Partial<Broker>;
}

const BrokerForm: React.FC<BrokerFormProps> = ({ onBrokerAdded, onCancel, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      commissionRate: initialData?.commissionRate || 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Ensure name is not undefined to satisfy the Broker type requirement
      const newBroker: Broker = {
        id: initialData?.id || uuidv4(),
        name: data.name, // This is now guaranteed to be a string due to the form schema
        commissionRate: data.commissionRate,
        balance: initialData?.balance || 0,
      };
      
      onBrokerAdded(newBroker);
      toast.success(`Broker ${initialData ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error(`Error ${initialData ? 'updating' : 'adding'} broker:`, error);
      toast.error(`Failed to ${initialData ? 'update' : 'add'} broker`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Broker Name *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="commissionRate">Commission Rate (%)</Label>
        <Input
          id="commissionRate"
          type="number"
          step="0.01"
          {...register("commissionRate", { valueAsNumber: true })}
        />
        {errors.commissionRate && (
          <p className="text-red-500 text-sm">{errors.commissionRate.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? (initialData ? "Updating..." : "Adding...") 
            : (initialData ? "Update Broker" : "Add Broker")}
        </Button>
      </div>
    </form>
  );
};

export default BrokerForm;
