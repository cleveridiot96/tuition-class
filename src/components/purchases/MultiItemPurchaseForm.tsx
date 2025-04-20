
import React from 'react';
import { Purchase } from "@/services/types";
import { Button } from "@/components/ui/button";
import FormHeader from './components/FormHeader';
import AgentSection from './components/AgentSection';
import TransportSection from './components/TransportSection';
import BrokerageSection from './components/BrokerageSection';
import ItemsSection from './components/ItemsSection';
import NotesAndSummary from './components/NotesAndSummary';
import { useMultiItemPurchaseForm } from './hooks/useMultiItemPurchaseForm';
import { PurchaseFormState } from './types/PurchaseFormTypes';

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
  const {
    formState,
    isSubmitting,
    brokerageAmount,
    handleSubmit,
    formMethods,
    formUtils
  } = useMultiItemPurchaseForm({ onSubmit, initialValues });

  return (
    <div className="w-full max-h-[calc(100vh-100px)] px-2 sm:px-4 md:px-6 mx-auto overflow-y-auto pb-8">
      <div className="max-w-[1000px] mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FormHeader
            lotNumber={formState.lotNumber}
            date={formState.date}
            location={formState.location}
            locations={formUtils.locations}
            onInputChange={formMethods.handleInputChange}
            onSelectChange={formMethods.handleSelectChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-3 sm:gap-4">
            <AgentSection
              agents={formUtils.agents}
              agentId={formState.agentId}
              onSelectChange={formMethods.handleSelectChange}
              onAddAgentClick={() => formUtils.setShowAddAgentDialog(true)}
              showAddAgentDialog={formUtils.showAddAgentDialog}
              setShowAddAgentDialog={formUtils.setShowAddAgentDialog}
              onAgentAdded={formUtils.handleAgentAdded}
            />
          </div>

          <TransportSection
            transporters={formUtils.transporters}
            transporterId={formState.transporterId}
            transportCost={formState.transportCost}
            onSelectChange={formMethods.handleSelectChange}
            onInputChange={formMethods.handleInputChange}
            onAddTransporterClick={() => formUtils.setShowAddTransporterDialog(true)}
            showAddTransporterDialog={formUtils.showAddTransporterDialog}
            setShowAddTransporterDialog={formUtils.setShowAddTransporterDialog}
            onTransporterAdded={formUtils.handleTransporterAdded}
          />

          <BrokerageSection
            brokerageType={formState.brokerageType}
            brokerageRate={formState.brokerageRate}
            brokerageAmount={brokerageAmount}
            onBrokerageTypeChange={formUtils.handleBrokerageTypeChange}
            onBrokerageRateChange={formUtils.handleBrokerageRateChange}
          />

          <ItemsSection
            items={formState.items}
            onItemChange={formMethods.handleItemChange}
            onRemoveItem={formMethods.handleRemoveItem}
            onAddItem={formMethods.handleAddItem}
          />

          <NotesAndSummary
            notes={formState.notes}
            onNotesChange={formMethods.handleInputChange}
            expenses={formState.expenses}
            subtotal={formMethods.calculateSubtotal()}
            transportCost={parseFloat(formState.transportCost || '0')}
            brokerageAmount={brokerageAmount}
            total={formMethods.calculateTotal()}
          />

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
