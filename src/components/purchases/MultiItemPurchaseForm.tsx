
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Agent, Transporter, Purchase } from "@/services/types";
import { getAgents, getTransporters, getLocations } from "@/services/storageService";
import ItemsTable from '../shared/ItemsTable';
import FormSummary from '../shared/FormSummary';
import FormHeader from './components/FormHeader';
import AgentSection from './components/AgentSection';
import TransportSection from './components/TransportSection';
import { usePurchaseForm } from './hooks/usePurchaseForm';

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

  const {
    formState,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    calculateSubtotal,
    calculateTotal,
    handleSubmit
  } = usePurchaseForm({ onSubmit, initialValues });

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
            />
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
