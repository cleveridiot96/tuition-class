
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { Sale, Customer, Broker } from '@/services/types';
import { ItemFormState } from '../../shared/types/ItemFormTypes';

interface UseSalesFormProps {
  onSubmit: (sale: Sale) => void;
  initialSale?: Sale;
}

export const useSalesForm = ({ onSubmit, initialSale }: UseSalesFormProps) => {
  const { toast } = useToast();
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<ItemFormState & {
    customerId: string;
    brokerId: string;
  }>({
    lotNumber: initialSale?.lotNumber || '',
    date: initialSale?.date || new Date().toISOString().split('T')[0],
    location: initialSale?.location || '',
    customerId: initialSale?.customerId || '',
    brokerId: initialSale?.brokerId || '',
    transporterId: initialSale?.transporterId || '',
    transportCost: initialSale?.transportCost?.toString() || '0',
    items: initialSale?.items || [{ name: '', quantity: 0, rate: 0 }],
    notes: initialSale?.notes || '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formState.items];
    updatedItems[index][field] = value;
    setFormState(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  const handleAddItem = () => {
    setFormState(prevState => ({
      ...prevState,
      items: [...prevState.items, { name: '', quantity: 0, rate: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...formState.items];
    updatedItems.splice(index, 1);
    setFormState(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  const calculateSubtotal = () => {
    return formState.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  const calculateBrokerageAmount = () => {
    if (!selectedBroker) return 0;
    return calculateSubtotal() * (selectedBroker.commissionRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + parseFloat(formState.transportCost || '0') + calculateBrokerageAmount();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const saleData: Sale = {
        id: initialSale?.id || uuidv4(),
        date: formState.date,
        lotNumber: formState.lotNumber,
        customerId: formState.customerId,
        customer: '',  // Will be set by the component
        brokerId: formState.brokerId || undefined,
        broker: selectedBroker?.name,
        transporterId: formState.transporterId || undefined,
        transporter: '',  // Will be set by the component
        quantity: formState.items.reduce((sum, item) => sum + item.quantity, 0),
        netWeight: formState.items.reduce((sum, item) => sum + item.quantity, 0),
        rate: formState.items[0]?.rate || 0,
        location: formState.location,
        totalAmount: calculateTotal(),
        transportCost: parseFloat(formState.transportCost),
        items: formState.items,
        notes: formState.notes
      };

      await onSubmit(saleData);
      toast({
        title: "Success",
        description: initialSale ? "Sale updated successfully" : "Sale added successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save sale",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    selectedBroker,
    isSubmitting,
    setSelectedBroker,
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    calculateSubtotal,
    calculateBrokerageAmount,
    calculateTotal,
    handleSubmit
  };
};
