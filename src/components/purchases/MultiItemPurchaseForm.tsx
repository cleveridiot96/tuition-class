
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Agent, Transporter, Purchase } from "@/services/types";
import { getAgents, getTransporters, getLocations } from "@/services/storageService";
import ItemsTable from '../shared/ItemsTable';
import FormSummary from '../shared/FormSummary';
import FormHeader from './components/FormHeader';
import AgentSection from './components/AgentSection';
import TransportSection from './components/TransportSection';
import BrokerageSection from './components/BrokerageSection';
import { usePurchaseForm } from './hooks/usePurchaseForm';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState(false);
  const [expenses, setExpenses] = useState(initialValues?.expenses || 0);

  const {
    formState,
    isSubmitting,
    brokerageAmount,
    brokerageType,
    brokerageRate,
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    calculateSubtotal,
    calculateTotal,
    handleSubmit,
    updateBrokerageSettings,
    setFormState
  } = usePurchaseForm({ onSubmit, initialValues });

  useEffect(() => {
    loadInitialData();

    // Auto-extract bags from lot number on initial load
    if (formState.lotNumber) {
      extractBagsFromLotNumber(formState.lotNumber);
    }
  }, []);

  const loadInitialData = () => {
    try {
      const allAgents = getAgents();
      setAgents(allAgents);

      const allTransporters = getTransporters();
      setTransporters(allTransporters);

      const allLocations = getLocations() || ['Chiplun', 'Mumbai', 'Sawantwadi'];
      setLocations(allLocations);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const handleAgentAdded = (newAgent: Agent) => {
    setAgents(prevAgents => [...prevAgents, newAgent]);
    handleSelectChange('agentId', newAgent.id);
    setShowAddAgentDialog(false);
  };

  const handleTransporterAdded = (newTransporter: Transporter) => {
    setTransporters(prevTransporters => [...prevTransporters, newTransporter]);
    handleSelectChange('transporterId', newTransporter.id);
    setShowAddTransporterDialog(false);
  };

  const handleBrokerageTypeChange = (type: string) => {
    updateBrokerageSettings(type, brokerageRate);
  };

  const handleBrokerageRateChange = (value: number) => {
    updateBrokerageSettings(brokerageType, value);
  };

  const handleExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setExpenses(value);
    setFormState(prev => ({
      ...prev,
      expenses: value
    }));
  };

  // Function to extract bags from lot number
  const extractBagsFromLotNumber = (lotNumber: string) => {
    const match = lotNumber.match(/[\/\\](\d+)/);
    if (match && match[1]) {
      const bags = parseInt(match[1], 10);
      if (!isNaN(bags)) {
        updateItemsWithBags(bags);
      }
    }
  };

  // Update first item quantity with bags count
  const updateItemsWithBags = (bags: number) => {
    if (formState.items.length > 0) {
      const updatedItems = [...formState.items];
      updatedItems[0] = { ...updatedItems[0], quantity: bags };
      
      setFormState(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  // Watch for changes in lot number
  useEffect(() => {
    if (formState.lotNumber) {
      extractBagsFromLotNumber(formState.lotNumber);
    }
  }, [formState.lotNumber]);

  return (
    <div className="w-full max-h-[calc(100vh-100px)] px-2 sm:px-4 md:px-6 mx-auto overflow-y-auto pb-8">
      <div className="max-w-[1000px] mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FormHeader
            lotNumber={formState.lotNumber}
            date={formState.date}
            location={formState.location}
            locations={locations}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-3 sm:gap-4">
            <AgentSection
              agents={agents}
              agentId={formState.agentId}
              onSelectChange={handleSelectChange}
              onAddAgentClick={() => setShowAddAgentDialog(true)}
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
            onAddTransporterClick={() => setShowAddTransporterDialog(true)}
            showAddTransporterDialog={showAddTransporterDialog}
            setShowAddTransporterDialog={setShowAddTransporterDialog}
            onTransporterAdded={handleTransporterAdded}
          />

          <BrokerageSection
            brokerageType={brokerageType}
            brokerageRate={brokerageRate}
            brokerageAmount={brokerageAmount}
            onBrokerageTypeChange={handleBrokerageTypeChange}
            onBrokerageRateChange={handleBrokerageRateChange}
          />

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="expenses" className="block text-sm font-medium text-gray-700">
                Other Expenses (₹)
              </Label>
              <Input
                id="expenses"
                name="expenses"
                type="number"
                value={expenses}
                onChange={handleExpensesChange}
                className="mt-1"
              />
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <ItemsTable
              items={formState.items}
              onItemChange={handleItemChange}
              onRemoveItem={handleRemoveItem}
              onAddItem={handleAddItem}
            />
          </div>

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
              />
            </div>

            <FormSummary
              subtotal={calculateSubtotal()}
              transportCost={parseFloat(formState.transportCost || '0')}
              brokerageAmount={brokerageAmount}
              showBrokerage={true}
              expenses={expenses}
              total={calculateTotal()}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Saving...' : initialValues ? 'Update Purchase' : 'Save Purchase'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiItemPurchaseForm;
