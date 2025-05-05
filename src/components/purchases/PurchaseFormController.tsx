
import React from "react";
import { PurchaseFormProps } from "./types/PurchaseTypes";
import { useEntityData } from "./hooks/useEntityData";
import { usePurchaseForm } from "./hooks/usePurchaseForm";
import { usePartyManagement } from "./usePartyManagement";
import PurchaseFormContent from "./PurchaseFormContent";
import { enhanceFormValidation } from "@/hooks/useFormValidation";

const PurchaseFormController: React.FC<PurchaseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  // Load entity data
  const entityData = useEntityData();
  
  // Setup form and calculations
  const purchaseForm = usePurchaseForm({ onSubmit, onCancel, initialData });
  
  // Setup party management
  const partyManagement = usePartyManagement({ 
    form: purchaseForm.form
  });

  // Setup enhanced form validation
  const formValidation = enhanceFormValidation(purchaseForm.form);

  // Ensure expenses is always a string for the view
  const formExpenses = purchaseForm.form.watch("expenses");
  const expensesDisplay = formExpenses !== undefined 
    ? String(formExpenses) 
    : '0';

  return (
    <PurchaseFormContent
      form={purchaseForm.form}
      formSubmitted={purchaseForm.formSubmitted}
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
      expenses={expensesDisplay}
      showDuplicateLotDialog={purchaseForm.showDuplicateLotDialog}
      setShowDuplicateLotDialog={purchaseForm.setShowDuplicateLotDialog}
      duplicateLotInfo={purchaseForm.duplicateLotInfo}
      onContinueDespiteDuplicate={purchaseForm.handleContinueDespiteDuplicate}
      handleFormSubmit={purchaseForm.handleFormSubmit}
      partyManagement={partyManagement}
      formValidation={formValidation}
    />
  );
};

export default PurchaseFormController;
