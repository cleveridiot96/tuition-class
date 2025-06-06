
import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import PurchaseBasicDetails from "./form-sections/PurchaseBasicDetails";
import PurchasePartyDetails from "./form-sections/PurchasePartyDetails";
import PurchaseQuantityDetails from "./form-sections/PurchaseQuantityDetails";
import PurchaseTransportDetails from "./form-sections/PurchaseTransportDetails";
import PurchaseBrokerageDetails from "./form-sections/PurchaseBrokerageDetails";
import PurchaseSummary from "./form-sections/PurchaseSummary";
import DuplicateLotDialog from "./dialogs/DuplicateLotDialog";

const PurchaseFormContent = ({
  form,
  formSubmitted,
  onCancel,
  isSubmitting,
  isEdit,
  locations,
  brokerageAmount,
  totalAmount,
  transportCost,
  totalAfterExpenses,
  ratePerKgAfterExpenses,
  extractBagsFromLotNumber,
  showBrokerage,
  initialData,
  expenses,
  showDuplicateLotDialog,
  setShowDuplicateLotDialog,
  duplicateLotInfo,
  onContinueDespiteDuplicate,
  handleFormSubmit,
  partyManagement,
  formValidation
}) => {
  const watchAgentId = form.watch("agentId");
  const watchParty = form.watch("party");
  const hasEitherPartyOrAgent = watchAgentId || watchParty;

  // Clear validation errors when form is submitted
  useEffect(() => {
    if (formValidation) {
      return () => {
        formValidation.clearErrorHighlights();
      };
    }
  }, [formValidation]);

  // Enhanced form submission with validation
  const handleSubmitWithValidation = (data) => {
    if (formValidation) {
      // Clear previous validations
      formValidation.clearErrorHighlights();
    }
    
    console.log('Form data before submission:', data);
    
    // Proceed with form submission
    return handleFormSubmit(data);
  };

  return (
    <Card className="bg-white border-blue-100 shadow-md relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">
            {isEdit ? "Edit Purchase" : "Add New Purchase"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">Fill in the purchase details</p>
        </div>

        {!hasEitherPartyOrAgent && formSubmitted && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Either Supplier Name or Agent must be specified
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitWithValidation)} className="space-y-6" noValidate>
            <PurchaseBasicDetails 
              form={form} 
              locations={locations} 
              formSubmitted={formSubmitted} 
            />
            
            <PurchasePartyDetails 
              form={form}
              formSubmitted={formSubmitted}
              partyManagement={partyManagement}
            />
            
            <PurchaseQuantityDetails 
              form={form}
              formSubmitted={formSubmitted}
              extractBagsFromLotNumber={extractBagsFromLotNumber}
            />
            
            <PurchaseTransportDetails 
              form={form}
              formSubmitted={formSubmitted}
              partyManagement={partyManagement}
            />
            
            <PurchaseBrokerageDetails 
              form={form}
              showBrokerage={showBrokerage}
              brokerageAmount={brokerageAmount}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <input
                  id="notes"
                  {...form.register("notes")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <PurchaseSummary
                totalAmount={totalAmount}
                transportCost={transportCost}
                expenses={expenses}
                brokerageAmount={brokerageAmount}
                totalAfterExpenses={totalAfterExpenses}
                ratePerKgAfterExpenses={ratePerKgAfterExpenses}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="md-ripple"
              >
                {isSubmitting ? "Saving..." : isEdit ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      
      <DuplicateLotDialog
        open={showDuplicateLotDialog}
        onOpenChange={setShowDuplicateLotDialog}
        duplicatePurchase={duplicateLotInfo}
        onContinue={onContinueDespiteDuplicate}
      />
    </Card>
  );
};

export default PurchaseFormContent;
