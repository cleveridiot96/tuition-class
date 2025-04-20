import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import {
  getAgents,
  getTransporters,
  getLocations,
  addPurchase,
  updatePurchase,
  Agent,
  Transporter,
  Purchase,
  savePurchases
} from "@/services/storageService";
import AgentForm from "@/components/agents/AgentForm";
import TransporterForm from "@/components/transporters/TransporterForm";
import ItemsTable from '../shared/ItemsTable';
import FormSummary from '../shared/FormSummary';
import { ItemFormState } from '../shared/types/ItemFormTypes';

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

  const [formState, setFormState] = useState<ItemFormState>({
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
        // Update existing purchase
        updatePurchase(purchaseData);
        toast({
          title: "Purchase Updated",
          description: `Purchase ${purchaseData.lotNumber} has been updated.`
        });
      } else {
        // Add new purchase
        addPurchase(purchaseData);
        toast({
          title: "Purchase Added",
          description: `Purchase ${purchaseData.lotNumber} has been added.`
        });
      }

      // Refresh data and close form
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="lotNumber">Lot Number</Label>
            <Input
              id="lotNumber"
              name="lotNumber"
              value={formState.lotNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formState.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              name="location"
              value={formState.location}
              onValueChange={(value) => handleSelectChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="agentId">Agent</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleAddAgentClick}
              >
                Add New
              </Button>
            </div>
            <Select
              name="agentId"
              value={formState.agentId}
              onValueChange={(value) => handleSelectChange('agentId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="transporterId">Transporter</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleAddTransporterClick}
              >
                Add New
              </Button>
            </div>
            <Select
              name="transporterId"
              value={formState.transporterId}
              onValueChange={(value) => handleSelectChange('transporterId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transporter" />
              </SelectTrigger>
              <SelectContent>
                {transporters.map(transporter => (
                  <SelectItem key={transporter.id} value={transporter.id}>
                    {transporter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="transportCost">Transport Cost</Label>
            <Input
              id="transportCost"
              name="transportCost"
              type="number"
              value={formState.transportCost}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <ItemsTable
          items={formState.items}
          onItemChange={handleItemChange}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-2 rounded-md border"
              rows={3}
              value={formState.notes}
              onChange={(e) => handleInputChange({
                target: { name: 'notes', value: e.target.value }
              } as React.ChangeEvent<HTMLInputElement>)}
            ></textarea>
          </div>

          <FormSummary
            subtotal={calculateSubtotal()}
            transportCost={parseFloat(formState.transportCost || '0')}
            expenses={parseFloat(formState.expenses?.toString() || '0')}
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

      {/* Dialogs */}
      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
          </DialogHeader>
          <AgentForm onAgentAdded={handleAgentAdded} onCancel={() => setShowAddAgentDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showAddTransporterDialog} onOpenChange={setShowAddTransporterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transporter</DialogTitle>
          </DialogHeader>
          <TransporterForm onTransporterAdded={handleTransporterAdded} onCancel={() => setShowAddTransporterDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiItemPurchaseForm;
