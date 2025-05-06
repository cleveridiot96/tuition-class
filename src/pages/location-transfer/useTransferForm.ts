
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { getLocations, getAvailableInventoryByLocation, transferBetweenLocations } from "@/utils/locationTransfer";
import { toast } from "sonner";

export interface TransferFormValues {
  lotNumber: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  date: string;
  notes?: string;
}

export function useTransferForm(initialValues: Partial<TransferFormValues> = {}) {
  const [locations, setLocations] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransferFormValues>({
    defaultValues: {
      lotNumber: "",
      fromLocation: "",
      toLocation: "",
      quantity: 1,
      date: new Date().toISOString().split('T')[0],
      notes: "",
      ...initialValues
    }
  });

  const { watch, setValue, handleSubmit, reset, getValues } = form;
  const fromLocation = watch("fromLocation");
  const lotNumber = watch("lotNumber");

  useEffect(() => {
    setLocations(getLocations());
  }, []);

  useEffect(() => {
    if (fromLocation) {
      const items = getAvailableInventoryByLocation(fromLocation);
      setAvailableItems(items);
      setSelectedItem(null);
      setValue("lotNumber", "");
    }
  }, [fromLocation, setValue]);

  useEffect(() => {
    if (lotNumber && availableItems.length > 0) {
      const item = availableItems.find(i => i.lotNumber === lotNumber);
      setSelectedItem(item || null);
      if (item) {
        setValue("quantity", Math.min(item.remainingQuantity, getValues("quantity")));
      }
    }
  }, [lotNumber, availableItems, setValue, getValues]);

  const onSubmit = (data: TransferFormValues) => {
    setIsSubmitting(true);

    try {
      const success = transferBetweenLocations({
        lotNumber: data.lotNumber,
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        quantity: data.quantity,
        date: data.date
      });

      if (success) {
        toast.success(`Successfully transferred ${data.quantity} units of ${data.lotNumber} from ${data.fromLocation} to ${data.toLocation}`);
        reset();
      } else {
        toast.error("Failed to transfer inventory. Please try again.");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("An error occurred during transfer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    locations,
    availableItems,
    selectedItem,
    isSubmitting,
    form,
    fromLocation,
    lotNumber,
    onSubmit
  };
}
