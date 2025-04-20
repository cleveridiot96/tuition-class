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

interface MultiItemPurchaseFormProps {
  onCancel: () => void;
  onSubmit: (purchase: Purchase) => void;
  initialValues?: Purchase;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

const MultiItemPurchaseForm = (props: MultiItemPurchaseFormProps) => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState(false);

  const [formState, setFormState] = useState({
    lotNumber: props.initialValues?.lotNumber || '',
    date: props.initialValues?.date || new Date().toISOString().split('T')[0],
    location: props.initialValues?.location || '',
    agentId: props.initialValues?.agentId || '',
    transporterId: props.initialValues?.transporterId || '',
    transportCost: props.initialValues?.transportCost?.toString() || '0',
    items: props.initialValues?.items || [{ id: uuidv4(), name: '', quantity: 0, rate: 0 }],
    notes: props.initialValues?.notes || '',
    expenses: props.initialValues?.expenses || 0,
    totalAfterExpenses: props.initialValues?.totalAfterExpenses || 0
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
    updatedItems[index][field] = value;
    setFormState(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  const handleAddItem = () => {
    setFormState(prevState => ({
      ...prevState,
      items: [...prevState.items, { id: uuidv4(), name: '', quantity: 0, rate: 0 }]
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
        id: props.initialValues?.id || uuidv4(),
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

      if (props.initialValues) {
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
      props.onSubmit(purchaseData);
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

        <div className="border rounded-md p-4 bg-white overflow-x-auto">
          <div className="w-full min-w-[650px]">
            <div className="grid grid-cols-12 gap-2 mb-2 font-medium">
              <div className="col-span-4">Item</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-1"></div>
            </div>

            {formState.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                <div className="col-span-4">
                  <Input
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    name="rate"
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                    placeholder="Rate"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    name="amount"
                    type="number"
                    value={(item.quantity * item.rate).toFixed(2)}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  {formState.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="mt-2"
            >
              Add Item
            </Button>
          </div>
        </div>
        
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
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transport:</span>
              <span>₹{Number(formState.transportCost || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Expenses:</span>
              <span>₹{Number(formState.expenses || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-bold">Total:</span>
              <span className="font-bold">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Purchase'}
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
