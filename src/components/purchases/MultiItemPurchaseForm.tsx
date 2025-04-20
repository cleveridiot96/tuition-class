import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import {
  getAgents,
  getTransporters,
  getLocations,
  addPurchase,
  updatePurchase,
  Agent,
  Transporter,
  Purchase
} from "@/services/storageService";
import ItemsTable from '../shared/ItemsTable';
import FormSummary from '../shared/FormSummary';
import FormHeader from './components/FormHeader';
import AgentSection from './components/AgentSection';
import TransportSection from './components/TransportSection';
import { PurchaseFormState } from '../shared/types/PurchaseFormTypes';

interface MultiItemPurchaseFormProps {
  onCancel: () => void;
  onSubmit: (purchase: Purchase) => void;
  initialValues?: Purchase;
}

const MultiItemPurchaseForm: React.FC<MultiItemPurchaseFormProps> = ({
  onCancel,
  onSubmit,
  initialValues
}) => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState(false);

  const [formState, setFormState] = useState<PurchaseFormState>({
    lotNumber: initialValues?.lotNumber || '',
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    location: initialValues?.location || '',
    agentId: initialValues?.agentId || '',
    transporterId: initialValues?.transporterId || '',
    transportCost: initialValues?.transportCost?.toString() || '0',
    items: initialValues?.items || [{ id: uuidv4(), name: '', quantity: 0, rate: 0 }],
    notes: initialValues?.notes || '',
    expenses: initialValues?.expenses || 0,
    totalAfterExpenses: initialValues?.totalAfterExpenses || 0
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const allAgents = getAgents();
      setAgents(allAgents);

      const allTransporters = getTransporters();
      setTransporters(allTransporters);

      const allLocations = getLocations();
      setLocations(allLocations);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Error loading data",
        description: "Failed to load agents, transporters, or locations.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormState(prev => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    setFormState(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: '', quantity: 0, rate: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormState(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => {
    return formState.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const transportCost = parseFloat(formState.transportCost || '0');
    const expenses = parseFloat(formState.expenses?.toString() || '0');
    return subtotal + transportCost + expenses;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const transportCost = parseFloat(formState.transportCost || '0');
      const expenses = parseFloat(formState.expenses?.toString() || '0');
      const totalAmount = calculateTotal();

      const purchaseData: Purchase = {
        id: initialValues?.id || uuidv4(),
        lotNumber: formState.lotNumber,
        date: formState.date,
        location: formState.location,
        agentId: formState.agentId,
        transporterId: formState.transporterId,
        transportCost: transportCost,
        items: formState.items,
        notes: formState.notes,
        totalAmount: totalAmount,
        expenses: expenses,
        totalAfterExpenses: totalAmount
      };

      if (initialValues) {
        updatePurchase(purchaseData);
        toast({
          title: "Purchase Updated",
          description: `Purchase ${purchaseData.lotNumber} has been updated.`
        });
      } else {
        addPurchase(purchaseData);
        toast({
          title: "Purchase Added",
          description: `Purchase ${purchaseData.lotNumber} has been added.`
        });
      }

      onSubmit(purchaseData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAgentClick = () => {
    setShowAddAgentDialog(true);
  };

  const handleAddTransporterClick = () => {
    setShowAddTransporterDialog(true);
  };

  const handleAgentAdded = useCallback((newAgent: Agent) => {
    setAgents(prevAgents => [...prevAgents, newAgent]);
    setFormState(prevState => ({
      ...prevState,
      agentId: newAgent.id
    }));
    setShowAddAgentDialog(false);
  }, []);

  const handleTransporterAdded = useCallback((newTransporter: Transporter) => {
    setTransporters(prevTransporters => [...prevTransporters, newTransporter]);
    setFormState(prevState => ({
      ...prevState,
      transporterId: newTransporter.id
    }));
    setShowAddTransporterDialog(false);
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormHeader
          lotNumber={formState.lotNumber}
          date={formState.date}
          location={formState.location}
          locations={locations}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AgentSection
            agents={agents}
            agentId={formState.agentId}
            onSelectChange={handleSelectChange}
            onAddAgentClick={handleAddAgentClick}
            showAddAgentDialog={showAddAgentDialog}
            setShowAddAgentDialog={setShowAddAgentDialog}
            onAgentAdded={handleAgentAdded}
          />
        </div>

        <TransportSection
          transporters={transporters}
          transporterId={formState.transporterId}
          transportCost={formState.transportCost}
          onSelectChange={handleSelectChange}
          onInputChange={handleInputChange}
          onAddTransporterClick={handleAddTransporterClick}
          showAddTransporterDialog={showAddTransporterDialog}
          setShowAddTransporterDialog={setShowAddTransporterDialog}
          onTransporterAdded={handleTransporterAdded}
        />

        <ItemsTable
          items={formState.items}
          onItemChange={handleItemChange}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-2 rounded-md border"
              rows={3}
              value={formState.notes}
              onChange={(e) => handleInputChange({
                target: { name: 'notes', value: e.target.value }
              } as React.ChangeEvent<HTMLInputElement>)}
              placeholder="Enter notes..."
            ></textarea>
          </div>

          <FormSummary
            subtotal={calculateSubtotal()}
            transportCost={parseFloat(formState.transportCost || '0')}
            expenses={formState.expenses}
            total={calculateTotal()}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialValues ? 'Update Purchase' : 'Save Purchase'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MultiItemPurchaseForm;
