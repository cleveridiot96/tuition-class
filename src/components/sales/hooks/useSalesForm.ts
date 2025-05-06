
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { Sale, Customer, Broker, SaleItem } from '@/services/types';
import { ItemFormState } from '../../shared/types/ItemFormTypes';

interface UseSalesFormProps {
  onSubmit: (sale: Sale) => void;
  initialSale?: Sale;
}

export const useSalesForm = ({ onSubmit, initialSale }: UseSalesFormProps) => {
  const { toast } = useToast();
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extended form state with sales-specific fields
  interface SalesFormState extends ItemFormState {
    customerId: string;
    brokerId: string;
    billNumber: string;
    billAmount: string;
  }

  const [formState, setFormState] = useState<SalesFormState>({
    lotNumber: initialSale?.lotNumber || '',
    date: initialSale?.date || new Date().toISOString().split('T')[0],
    location: initialSale?.location || '',
    customerId: initialSale?.customerId || '',
    brokerId: initialSale?.brokerId || '',
    transporterId: initialSale?.transporterId || '',
    transportCost: initialSale?.transportCost?.toString() || '',
    billNumber: initialSale?.billNumber || '',
    billAmount: initialSale?.billAmount?.toString() || '',
    items: (initialSale?.items?.map(item => ({
      id: item.id,
      name: item.name || '',
      quantity: item.quantity,
      rate: item.rate
    })) || [{ id: uuidv4(), name: '', quantity: 0, rate: 0 }]) as { id?: string; name: string; quantity: number; rate: number }[],
    notes: initialSale?.notes || '',
    bags: initialSale?.bags || 0,
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
    return formState.items.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      return total + (quantity * rate);
    }, 0);
  };

  const calculateBrokerageAmount = () => {
    if (!selectedBroker) return 0;
    const subtotal = calculateSubtotal();
    const brokerageRate = selectedBroker.commissionRate || 0;
    return subtotal * (brokerageRate / 100);
  };

  const calculateTotal = () => {
    if (formState.billAmount && parseFloat(formState.billAmount) > 0) {
      return parseFloat(formState.billAmount);
    }
    
    const subtotal = calculateSubtotal();
    const transportCost = parseFloat(formState.transportCost || '0');
    return subtotal + transportCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const billAmount = formState.billNumber && formState.billAmount 
        ? parseFloat(formState.billAmount) 
        : 0;
      
      const brokerageAmount = calculateBrokerageAmount();
      const subtotal = calculateSubtotal();
      
      // Convert form items to SaleItems
      const saleItems: SaleItem[] = formState.items.map(item => ({
        id: item.id || uuidv4(),
        inventoryItemId: item.id || uuidv4(),
        name: item.name,
        lotNumber: formState.lotNumber,
        quantity: item.quantity,
        rate: item.rate,
        totalAmount: item.quantity * item.rate
      }));

      const saleData: Sale = {
        id: initialSale?.id || uuidv4(),
        date: formState.date,
        lotNumber: formState.lotNumber,
        location: formState.location,
        customerId: formState.customerId,
        customerName: '', // Will be set by the component
        brokerId: formState.brokerId || undefined,
        brokerName: selectedBroker?.name,
        broker: selectedBroker?.name, // For compatibility
        transporterId: formState.transporterId || undefined,
        transporterName: '',  // Will be set by the component
        destination: formState.location || '',
        totalBags: formState.bags || 0,
        bags: formState.bags || 0,
        quantity: formState.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        netWeight: formState.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        rate: Number(formState.items[0]?.rate || 0),
        totalAmount: calculateTotal(),
        transportCost: parseFloat(formState.transportCost || '0'),
        transportAmount: parseFloat(formState.transportCost || '0'),
        billNumber: formState.billNumber,
        billAmount: billAmount,
        items: saleItems,
        notes: formState.notes || '',
        salesBroker: selectedBroker?.name || undefined,
        customer: '', // Will be set by the component
        isDeleted: false,
      };

      if (brokerageAmount > 0) {
        saleData.brokerageAmount = brokerageAmount;
      }

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
    setFormState,
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
