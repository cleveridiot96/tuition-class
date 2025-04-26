
import React from "react";
import { PurchaseFormProps } from "./types/PurchaseTypes";
import { useEntityData } from "./hooks/useEntityData";
import { usePurchaseForm } from "./hooks/usePurchaseForm";
import { usePartyManagement } from "./usePartyManagement";
import PurchaseFormContent from "./PurchaseFormContent";

const PurchaseFormController: React.FC<PurchaseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  // Load entity data
  const entityData = useEntityData();
  
  // Setup form and calculations
  const purchaseForm = usePurchaseForm({ onSubmit, onCancel, initialData });
  
  // Setup party management
  const partyManagement = usePartyManagement({ 
    form: purchaseForm.form, 
    loadData: entityData.loadData 
  });

  return (
    <PurchaseFormContent
      form={purchaseForm.form}
      onCancel={onCancel}
      isSubmitting={purchaseForm.form.formState.isSubmitting}
      isEdit={!!initialData}
      locations={entityData.locations}
      brokerageAmount={purchaseForm.brokerageAmount}
      totalAmount={purchaseForm.totalAmount}
      transportCost={purchaseForm.transportCost}
      totalAfterExpenses={purchaseForm.totalAfterExpenses}
      ratePerKgAfterExpenses={purchaseForm.ratePerKgAfterExpenses}
      extractBagsFromLotNumber={purchaseForm.extractBagsFromLotNumber}
      showBrokerage={purchaseForm.showBrokerage}
      initialData={initialData}
      expenses={purchaseForm.form.watch("expenses") || 0}
      showDuplicateLotDialog={purchaseForm.showDuplicateLotDialog}
      setShowDuplicateLotDialog={purchaseForm.setShowDuplicateLotDialog}
      duplicateLotInfo={purchaseForm.duplicateLotInfo}
      onContinueDespiteDuplicate={purchaseForm.handleContinueDespiteDuplicate}
      handleFormSubmit={purchaseForm.handleFormSubmit}
      partyManagement={partyManagement}
    />
  );
};

export default PurchaseFormController;
