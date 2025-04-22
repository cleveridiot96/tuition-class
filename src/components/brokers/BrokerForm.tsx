
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
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
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
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      commissionRate: initialData?.commissionRate || 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const newBroker: Broker = {
        id: initialData?.id || uuidv4(),
        ...data,
      };
      
      onBrokerAdded(newBroker);
      toast.success("Broker added successfully");
    } catch (error) {
      console.error("Error adding broker:", error);
      toast.error("Failed to add broker");
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
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" {...register("address")} />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
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
          {isSubmitting ? "Adding..." : "Add Broker"}
        </Button>
      </div>
    </form>
  );
};

export default BrokerForm;
